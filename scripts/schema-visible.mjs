#!/usr/bin/env node
/**
 * schema-visible: fails the build when JSON-LD is invalid or when the Restaurant
 * markup says something the visitor cannot read on the same page.
 *
 * For every built HTML page in dist/:
 *   1. Every <script type="application/ld+json"> parses, uses @context
 *      https://schema.org, and every node has an @type.
 *   2. Every @type and property is a real schema.org term (vocabulary 30.1,
 *      scripts/data/schemaorg-terms.json), and each property is allowed on its
 *      type (domainIncludes, through the type's parents).
 *   3. URL-valued properties are absolute https URLs.
 *   4. No AggregateRating, Review or Rating nodes and no aggregateRating, review
 *      or award(s) properties anywhere (CLAUDE.md ground rules).
 *   5. The Restaurant's name, street address, postal code, city, telephone and
 *      opening hours appear in the page's visible text (scripts, styles and
 *      <template> content removed), and every alternateName is visible on /about/.
 *
 *   node scripts/schema-visible.mjs [dist]
 *
 * The checks are exported for scripts/schema-visible.test.mjs.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { decodeHtml } from "./aeo-rules.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const TERMS = JSON.parse(readFileSync(join(ROOT, "scripts", "data", "schemaorg-terms.json"), "utf8"));

/** Properties whose superseded status is known and kept on purpose. */
const ALLOWED_SUPERSEDED = {
  // Google's local business documentation names `menu`; hasMenu (its successor) is also emitted.
  menu: "Google documents `menu` for food establishments; hasMenu is emitted alongside it",
};
const BANNED_TYPES = ["AggregateRating", "Review", "Rating", "EmployerAggregateRating"];
const BANNED_PROPS = ["aggregateRating", "review", "reviews", "award", "awards"];
const URL_PROPS = ["url", "item", "image", "logo", "hasMenu", "menu", "sameAs", "hasMap", "mainEntityOfPage"];
const JSONLD_KEYWORDS = new Set(["@context", "@type", "@id", "@graph", "@language", "@value"]);

/* ---- helpers --------------------------------------------------------------- */

const asArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const typesOf = (node) => asArray(node?.["@type"]);

/** Visible text: no script, style or template content, tags removed, entities decoded. */
export function visibleText(html) {
  const body = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<template\b[\s\S]*?<\/template>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return decodeHtml(body).replace(/\s+/g, " ").trim();
}

/** Lowercase words only, so "3rd Avenue, Ward 100" matches "3rd Avenue Ward 100". */
export const words = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const digits = (s) => s.replace(/\D/g, "");

/** Every class this type inherits from, including itself (enumeration members included). */
function ancestors(type, seen = new Set()) {
  if (seen.has(type)) return seen;
  seen.add(type);
  for (const parent of [...(TERMS.types[type] ?? []), ...(TERMS.enumerationMembers[type] ?? [])]) ancestors(parent, seen);
  return seen;
}
const isKnownType = (t) => t in TERMS.types || t in TERMS.enumerationMembers;

/** Visible clock formats for "HH:MM": "11 AM" and "11:00 AM". */
export function clockForms(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 && h < 24 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mm = String(m).padStart(2, "0");
  return m === 0 ? [`${h12} ${suffix}`, `${h12}:${mm} ${suffix}`] : [`${h12}:${mm} ${suffix}`];
}
const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/* ---- checks ---------------------------------------------------------------- */

/** Parse every JSON-LD block. Returns { nodes, problems }. */
export function parseJsonLd(html) {
  const problems = [];
  const nodes = [];
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  blocks.forEach((raw, i) => {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      problems.push(`JSON-LD block ${i + 1} does not parse: ${e.message}`);
      return;
    }
    for (const doc of asArray(data)) {
      if (doc?.["@context"] !== "https://schema.org") problems.push(`JSON-LD block ${i + 1}: @context must be "https://schema.org"`);
      for (const node of doc["@graph"] ? asArray(doc["@graph"]) : [doc]) {
        if (!typesOf(node).length) problems.push(`JSON-LD block ${i + 1}: a top-level node has no @type`);
        nodes.push(node);
      }
    }
  });
  return { nodes, problems };
}

/** Vocabulary, URL and banned-markup checks over every node, nested ones included. */
export function vocabularyProblems(nodes) {
  const problems = [];
  const walk = (node, path) => {
    if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${path}[${i}]`));
    if (!node || typeof node !== "object") return;
    const types = typesOf(node);
    for (const t of types) {
      if (!isKnownType(t)) problems.push(`${path}: unknown schema.org type "${t}"`);
      if (BANNED_TYPES.includes(t)) problems.push(`${path}: ${t} markup is not allowed (no ratings, reviews or awards)`);
    }
    const lineage = new Set(types.flatMap((t) => [...ancestors(t)]));
    for (const [key, value] of Object.entries(node)) {
      if (JSONLD_KEYWORDS.has(key)) continue;
      if (BANNED_PROPS.includes(key)) problems.push(`${path}.${key}: not allowed (no ratings, reviews or awards)`);
      if (!(key in TERMS.properties)) {
        problems.push(`${path}.${key}: unknown schema.org property`);
        continue;
      }
      const domains = TERMS.properties[key];
      if (types.length && domains.length && !domains.some((d) => lineage.has(d))) {
        problems.push(`${path}.${key}: not a property of ${types.join("/")} (expected on ${domains.join(", ")})`);
      }
      if (TERMS.superseded[key] && !ALLOWED_SUPERSEDED[key]) {
        problems.push(`${path}.${key}: superseded by ${TERMS.superseded[key].join(", ")}`);
      }
      if (URL_PROPS.includes(key)) {
        for (const v of asArray(value)) {
          if (typeof v === "string" && !/^https:\/\//.test(v)) problems.push(`${path}.${key}: "${v}" is not an absolute https URL`);
        }
      }
      walk(value, `${path}.${key}`);
    }
  };
  nodes.forEach((n, i) => walk(n, `${typesOf(n).join("/") || "node"}#${i}`));
  return problems;
}

/** The Restaurant's name, address, phone and hours must be readable on the page. */
export function restaurantVisibilityProblems(nodes, text) {
  const problems = [];
  const restaurants = nodes.filter((n) => typesOf(n).some((t) => ancestors(t).has("FoodEstablishment")));
  if (!restaurants.length) return ["no Restaurant (FoodEstablishment) node"];
  const plain = words(text);
  for (const r of restaurants) {
    if (!r.name || !text.includes(r.name)) problems.push(`Restaurant.name "${r.name}" is not visible`);
    const a = r.address ?? {};
    for (const key of ["streetAddress", "postalCode", "addressLocality"]) {
      if (!a[key]) problems.push(`Restaurant.address.${key} is missing`);
      else if (!plain.includes(words(a[key]))) problems.push(`Restaurant.address.${key} "${a[key]}" is not visible`);
    }
    if (!r.telephone) problems.push("Restaurant.telephone is missing");
    else {
      const shown = [...text.matchAll(/\+?\d[\d\s-]{8,16}\d/g)].map((m) => digits(m[0]));
      const want = digits(r.telephone);
      if (!shown.some((d) => d === want || `91${d}` === want)) problems.push(`Restaurant.telephone ${r.telephone} is not visible`);
    }
    for (const spec of asArray(r.openingHoursSpecification)) {
      const opens = clockForms(spec.opens ?? "");
      const closes = clockForms(spec.closes ?? "");
      const range = opens.some((o) => closes.some((c) => new RegExp(`${o}\\s*(?:to|–|-|—)\\s*${c}`).test(text)));
      if (!range) problems.push(`opening hours ${spec.opens}–${spec.closes} are not visible as "${opens[0]} to ${closes[0]}"`);
      const days = asArray(spec.dayOfWeek).map((d) => String(d).replace(/^https?:\/\/schema\.org\//, ""));
      const everyDay = ALL_DAYS.every((d) => days.includes(d));
      if (everyDay ? !/\b(daily|every day)\b/i.test(text) : !days.every((d) => text.includes(d))) {
        problems.push(`opening days (${everyDay ? "every day" : days.join(", ")}) are not visible`);
      }
    }
  }
  return problems;
}

/* ---- CLI ------------------------------------------------------------------- */

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith(".html") ? [p] : [];
  });
}

export function run(distDir = join(ROOT, "dist")) {
  if (!existsSync(distDir)) return { problems: [`${distDir} not found: run astro build first`], pages: 0, nodes: 0 };
  const problems = [];
  let nodeCount = 0;
  let aboutText = null;
  let alternateNames = [];
  const files = htmlFiles(distDir);
  for (const file of files) {
    const route = `/${relative(distDir, file).split(sep).join("/")}`.replace(/index\.html$/, "");
    const html = readFileSync(file, "utf8");
    const { nodes, problems: parse } = parseJsonLd(html);
    nodeCount += nodes.length;
    const text = visibleText(html);
    const issues = [...parse, ...vocabularyProblems(nodes)];
    if (nodes.length) issues.push(...restaurantVisibilityProblems(nodes, text));
    for (const issue of issues) problems.push(`${route}: ${issue}`);
    if (route === "/about/") {
      aboutText = text;
      alternateNames = asArray(nodes.find((n) => typesOf(n).includes("Restaurant"))?.alternateName);
    }
  }
  if (aboutText === null) problems.push("/about/ not built: alternateName visibility not checked");
  for (const alt of alternateNames) {
    if (!aboutText.includes(alt)) problems.push(`/about/: Restaurant.alternateName "${alt}" is not visible on the page`);
  }
  return { problems, pages: files.length, nodes: nodeCount };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const dist = process.argv[2] ? resolve(process.argv[2]) : undefined;
  const { problems, pages, nodes } = run(dist);
  if (problems.length) {
    console.error(`✖ schema-visible failed: ${problems.length} problem(s)`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log(`✔ schema-visible passed (${nodes} JSON-LD node(s) on ${pages} page(s): valid schema.org ${TERMS.version} terms, NAP and hours visible, no rating markup)`);
}
