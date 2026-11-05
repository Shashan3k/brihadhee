#!/usr/bin/env node
/**
 * JSON-LD validator for the built site.
 *
 *   node scripts/validate-schema.js [distDir]      (default: dist)
 *
 * Checks, per page and across pages:
 *  - every <script type="application/ld+json"> parses, has @context/@type
 *  - every { "@id": ... } reference resolves to a node on the same page
 *  - Restaurant entity matches Key.md / site data and is identical on every page
 *  - /catering exists only when offer_catering is true
 *  - Service: serviceType Catering, provider -> Restaurant @id, areaServed and
 *    telephone only from confirmed config, and NO AggregateRating
 *  - FAQPage: only the 11 target questions, each backed by a confirmed config
 *    value, visible on the page, with the direct answer in sentence 1
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const dist = resolve(process.argv[2] ?? join(ROOT, "dist"));
const cfg = JSON.parse(readFileSync(join(ROOT, "config", "client-verification.json"), "utf8"));
const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);

/* ---- Facts the entity must match -------------------------------------- */
// Read straight from the source of truth for the site data.
const siteSrc = readFileSync(join(ROOT, "src", "data", "site.js"), "utf8");
const pick = (re, label) => {
  const m = siteSrc.match(re);
  if (!m) fatal(`Could not read ${label} from src/data/site.js`);
  return m[1];
};
const SITE = {
  name: pick(/\bname:\s*"([^"]+)"/, "name"),
  phone: pick(/phone:\s*"([^"]+)"/, "contact.phone"),
  whatsapp: pick(/whatsapp:\s*"([^"]+)"/, "contact.whatsapp"),
  cuisine: "Vegetarian South Indian",
  region: "Tamil Nadu",
  locality: "Chennai",
  postal: "600040",
};
const digits = (s) => String(s ?? "").replace(/\D/g, "");

// Key.md is gitignored, so it only exists locally.
const keyPath = join(ROOT, "Key.md");
let KEY = null;
if (existsSync(keyPath)) {
  const k = readFileSync(keyPath, "utf8");
  KEY = {
    entity: k.match(/^- Entity: (.+)$/m)?.[1]?.trim(),
    location: k.match(/^- Location: (.+)$/m)?.[1]?.trim(),
    cuisine: k.match(/^- Cuisine: (.+)$/m)?.[1]?.trim(),
  };
} else {
  warnings.push("Key.md not found (gitignored): skipped Key.md comparison.");
}

const TARGET_QUESTIONS = [
  "Does Brihadhee offer catering?",
  "What kind of catering does Brihadhee provide?",
  "Is Brihadhee catering vegetarian?",
  "Which events does Brihadhee cater?",
  "How many guests can Brihadhee cater for?",
  "Does Brihadhee cater outside Anna Nagar?",
  "Does Brihadhee provide banana-leaf catering?",
  "How do I book catering with Brihadhee?",
  "How far in advance should I book Brihadhee catering?",
  "What is the catering price per plate at Brihadhee?",
  "Where is Brihadhee located?",
];

/* What each question needs confirmed in the config. */
const ch = cfg.enquiry_channels ?? {};
const confirmedPhone =
  ch.is_different_from_restaurant === true
    ? ch.phone
    : ch.is_different_from_restaurant === false
      ? ch.phone || SITE.phone
      : null;
const confirmedWhatsapp =
  ch.is_different_from_restaurant === true
    ? ch.whatsapp
    : ch.is_different_from_restaurant === false
      ? ch.whatsapp || SITE.whatsapp
      : null;
const nonEmpty = (a) => Array.isArray(a) && a.length > 0;
const GATES = {
  [TARGET_QUESTIONS[0]]: () => cfg.offer_catering === true,
  [TARGET_QUESTIONS[1]]: () => nonEmpty(cfg.menu_formats),
  [TARGET_QUESTIONS[2]]: () => nonEmpty(cfg.menu_formats),
  [TARGET_QUESTIONS[3]]: () => nonEmpty(cfg.confirmed_events),
  [TARGET_QUESTIONS[4]]: () => Number.isFinite(cfg.min_guests) && Number.isFinite(cfg.max_guests),
  [TARGET_QUESTIONS[5]]: () => nonEmpty(cfg.service_area),
  [TARGET_QUESTIONS[6]]: () => (cfg.menu_formats ?? []).includes("banana_leaf_service"),
  [TARGET_QUESTIONS[7]]: () => Boolean(confirmedPhone || confirmedWhatsapp),
  [TARGET_QUESTIONS[8]]: () => typeof cfg.advance_notice_required === "string" && cfg.advance_notice_required !== "",
  [TARGET_QUESTIONS[9]]: () => ["per_plate", "on_request"].includes(cfg.pricing_model),
  [TARGET_QUESTIONS[10]]: () => true, // restaurant fact, confirmed in Key.md
};

/* ---- Helpers ---------------------------------------------------------- */
function fatal(msg) {
  console.error(`✖ ${msg}`);
  process.exit(2);
}
function* walk(p) {
  if (statSync(p).isFile()) return yield p;
  for (const e of readdirSync(p)) yield* walk(join(p, e));
}
const sameJson = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const firstSentence = (t) => (String(t).match(/^[^.!?]*[.!?]/)?.[0] ?? t).trim();
const visibleText = (html) =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/\s+/g, " ");

/** Find every object in a JSON tree. */
function* objects(node) {
  if (Array.isArray(node)) for (const n of node) yield* objects(n);
  else if (node && typeof node === "object") {
    yield node;
    for (const v of Object.values(node)) yield* objects(v);
  }
}
const typeOf = (n) => [].concat(n["@type"] ?? []);
const hasKey = (tree, key) => [...objects(tree)].some((o) => key in o);

/* ---- Load pages ------------------------------------------------------- */
if (!existsSync(dist)) fatal(`${dist} not found. Run \`npm run build\` first.`);
const pages = [];
for (const file of walk(dist)) {
  if (!/\.html?$/i.test(file)) continue;
  const html = readFileSync(file, "utf8");
  const name = "/" + relative(dist, file).replace(/\\/g, "/").replace(/index\.html$/, "");
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const nodes = [];
  blocks.forEach((b, i) => {
    try {
      const parsed = JSON.parse(b[1]);
      nodes.push(...[].concat(parsed));
    } catch (e) {
      err(name, `JSON-LD block ${i + 1} is not valid JSON: ${e.message}`);
    }
  });
  pages.push({ name, html, nodes });
}

const catering = pages.find((p) => p.name === "/catering/");
if (cfg.offer_catering !== true && catering) err("/catering/", "page was built while offer_catering is not true");
if (cfg.offer_catering === true && !catering) err("/catering/", "offer_catering is true but the page was not built");

/* ---- Per-page structural checks -------------------------------------- */
for (const { name, html, nodes } of pages) {
  if (!nodes.length) {
    warnings.push(`${name}: no JSON-LD found`);
    continue;
  }
  const idSet = new Set(nodes.map((n) => n["@id"]).filter(Boolean));
  for (const n of nodes) {
    if (n["@context"] !== "https://schema.org") err(name, `${typeOf(n).join("/") || "node"} missing @context "https://schema.org"`);
    if (!typeOf(n).length) err(name, "node without @type");
  }
  // every reference-only object ({"@id": x}) must resolve on this page
  for (const o of objects(nodes)) {
    const keys = Object.keys(o);
    if (keys.length === 1 && keys[0] === "@id" && !idSet.has(o["@id"])) {
      err(name, `unresolved @id reference: ${o["@id"]}`);
    }
  }
  // duplicate @id with different content
  const seen = new Map();
  for (const n of nodes) {
    if (!n["@id"]) continue;
    if (seen.has(n["@id"]) && !sameJson(seen.get(n["@id"]), n)) err(name, `duplicate @id with different content: ${n["@id"]}`);
    seen.set(n["@id"], n);
  }

  /* Restaurant entity */
  const r = nodes.find((n) => typeOf(n).includes("Restaurant"));
  if (r) {
    if (r.name !== SITE.name) err(name, `Restaurant.name "${r.name}" != "${SITE.name}"`);
    if (r.servesCuisine !== SITE.cuisine) err(name, `servesCuisine "${r.servesCuisine}" != "${SITE.cuisine}"`);
    const a = r.address ?? {};
    if (a.addressLocality !== SITE.locality) err(name, `addressLocality "${a.addressLocality}"`);
    if (a.addressRegion !== SITE.region) err(name, `addressRegion "${a.addressRegion}"`);
    if (a.postalCode !== SITE.postal) err(name, `postalCode "${a.postalCode}"`);
    for (const part of ["W Block", "Anna Nagar East"]) {
      if (!String(a.streetAddress ?? "").includes(part)) err(name, `streetAddress missing "${part}"`);
    }
    if (digits(r.telephone) !== digits(SITE.phone)) err(name, `telephone ${r.telephone} != site phone ${SITE.phone}`);
    if (r.telephone && !/^\+\d{10,15}$/.test(r.telephone)) err(name, `telephone not E.164: ${r.telephone}`);
    if (hasKey(r, "aggregateRating")) err(name, "Restaurant carries aggregateRating (self-served)");
    if (KEY) {
      if (KEY.entity && r.name !== KEY.entity) err(name, `name != Key.md entity "${KEY.entity}"`);
      if (KEY.cuisine && r.servesCuisine.toLowerCase() !== KEY.cuisine.toLowerCase()) err(name, `servesCuisine != Key.md cuisine "${KEY.cuisine}"`);
      if (KEY.location) {
        for (const part of ["W Block", "Anna Nagar East", "Chennai", "Tamil Nadu", "600040"]) {
          if (!KEY.location.includes(part)) warnings.push(`Key.md Location lacks "${part}"`);
        }
      }
    }
  } else {
    err(name, "no Restaurant entity");
  }

  /* Service (catering) */
  for (const s of nodes.filter((n) => typeOf(n).includes("Service"))) {
    if (name !== "/catering/") err(name, "Service schema outside /catering/");
    if (cfg.offer_catering !== true) err(name, "Service emitted while offer_catering is not true");
    if (s.serviceType !== "Catering") err(name, `serviceType "${s.serviceType}" != "Catering"`);
    if (s.provider?.["@id"] !== r?.["@id"]) err(name, "Service.provider does not reference the Restaurant @id");
    if (hasKey(s, "aggregateRating") || hasKey(s, "review")) err(name, "Service carries AggregateRating/review (no verified catering reviews)");
    const areas = [].concat(s.areaServed ?? []).map((x) => x?.name ?? x);
    for (const a of areas) if (!(cfg.service_area ?? []).includes(a)) err(name, `areaServed "${a}" is not in confirmed service_area`);
    if (!nonEmpty(cfg.service_area) && areas.length) err(name, "areaServed present but service_area is empty");
    if (s.telephone) {
      if (!confirmedPhone) err(name, "Service.telephone present but no confirmed catering phone");
      else if (digits(s.telephone) !== digits(confirmedPhone)) err(name, `Service.telephone ${s.telephone} != confirmed ${confirmedPhone}`);
    }
  }
  if (name === "/catering/" && !nodes.some((n) => typeOf(n).includes("Service"))) err(name, "missing Service schema");

  /* FAQPage */
  for (const f of nodes.filter((n) => typeOf(n).includes("FAQPage"))) {
    const text = visibleText(html);
    const qs = f.mainEntity ?? [];
    if (!qs.length) err(name, "FAQPage has no mainEntity");
    for (const q of qs) {
      const qn = q.name;
      const ans = q.acceptedAnswer?.text ?? "";
      if (!ans.trim()) err(name, `empty answer: ${qn}`);
      if (!text.includes(qn)) err(name, `FAQ question not visible on the page: ${qn}`);
      if (!text.includes(firstSentence(ans))) err(name, `FAQ answer sentence 1 not visible on the page: ${qn}`);
      if (name === "/catering/") {
        if (!TARGET_QUESTIONS.includes(qn)) err(name, `FAQ question is not one of the 11 targets: ${qn}`);
        else if (!GATES[qn]()) err(name, `FAQ question not confirmed in config: ${qn}`);
        if (qn === TARGET_QUESTIONS[10]) {
          for (const part of ["W Block, Anna Nagar East", "Chennai, Tamil Nadu 600040", "Anna Tower", "3rd Avenue"]) {
            if (!ans.includes(part)) err(name, `location answer missing "${part}"`);
          }
        }
      }
    }
    const dup = qs.map((q) => q.name).filter((n, i, a) => a.indexOf(n) !== i);
    if (dup.length) err(name, `duplicate FAQ questions: ${dup.join("; ")}`);
    if (f.about?.["@id"] !== r?.["@id"]) err(name, "FAQPage.about does not reference the Restaurant @id");
  }
}

/* ---- Cross-page: Restaurant entity must be identical ------------------ */
const restaurants = pages
  .map((p) => ({ page: p.name, node: p.nodes.find((n) => typeOf(n).includes("Restaurant")) }))
  .filter((x) => x.node);
for (const x of restaurants.slice(1)) {
  if (!sameJson(x.node, restaurants[0].node)) err(x.page, `Restaurant entity differs from ${restaurants[0].page}`);
}

/* ---- Report ----------------------------------------------------------- */
for (const w of warnings) console.warn(`⚠ ${w}`);
if (errors.length) {
  console.error(`✖ Schema validation failed: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
const count = pages.reduce((n, p) => n + p.nodes.length, 0);
console.log(`✔ Schema valid: ${count} JSON-LD node(s) on ${pages.length} page(s)${catering ? " (incl. /catering/)" : ""}`);
