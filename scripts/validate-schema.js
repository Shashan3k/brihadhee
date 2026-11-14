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
 *  - the catering pages exist only when offer_catering is true
 *  - Service: provider -> Restaurant, confirmed service areas and event guest
 *    quantities, and a ServiceChannel phone that matches the visible action
 *  - WebPage: canonical metadata, primary entity, breadcrumb and FAQ links
 *  - FAQPage: visible questions with confirmed event answers and a direct first answer
 *  - Menu: canonical page identity and descriptions for build-your-own add-on prices
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");
const dist = resolve(process.argv[2] ?? join(ROOT, "dist"));
const cfg = JSON.parse(readFileSync(join(ROOT, "config", "client-verification.json"), "utf8"));
const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);

/* ---- Facts the entity must match -------------------------------------- */
// entity-truth.ts is importable by Node (type stripping), so the validator reads the same source as the site.
const { FACTS, SITE_ORIGIN } = await import(pathToFileURL(join(ROOT, "src", "data", "entity-truth.ts")).href);
const { MENU_NOTES } = await import(pathToFileURL(join(ROOT, "src", "data", "menu-canonical.ts")).href);
// Catering says "vegetarian" until the owner answers Q20 (config/seo-gates.ts).
const { CATERING_DIET } = await import(pathToFileURL(join(ROOT, "config", "seo-gates.ts")).href);
const SITE = {
  name: FACTS.name.value,
  phone: FACTS.phone.value,
  whatsapp: FACTS.whatsapp.value,
  cuisines: FACTS.cuisines.value,
  region: FACTS.address.value.state,
  locality: FACTS.address.value.city,
  postal: FACTS.address.value.postalCode,
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

// Catering pages (Pillar 2). The flagship page's FAQ must come from this list,
// and each question must be backed by a confirmed config value.
const CATERING_PATH = "/catering-services-chennai/";
const PLANNER_PATH = "/event-planner-catering-partner/";
const CORPORATE_PATH = "/corporate-catering-chennai/";
const SMALL_FUNCTIONS_PATH = "/small-function-catering-chennai/";
const QUOTE_PATH = "/catering-quote-chennai/";
const MENU_PATH = "/menu/";
const SERVICE_PAGES = [CATERING_PATH, PLANNER_PATH, CORPORATE_PATH, SMALL_FUNCTIONS_PATH];
const CATERING_PAGES = [...SERVICE_PAGES, QUOTE_PATH];
/* Questions allowed on the event catering page, each gated on a confirmed value.
 * One Q&A per route: corporate questions live on /corporate-catering-chennai/
 * and the location question on /about/ (src/lib/answers.js qaRoute). */
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
  "Does Brihadhee do wedding and event catering?": () => cfg.offer_catering === true && nonEmpty(cfg.confirmed_events),
  "Does Brihadhee provide end-to-end event catering?": () => FACTS.eventService?.status === "verified",
  "What kind of catering does Brihadhee provide?": () => nonEmpty(cfg.menu_formats),
  [`Is Brihadhee catering ${CATERING_DIET}?`]: () => nonEmpty(cfg.menu_formats),
  "Which events does Brihadhee cater?": () => nonEmpty(cfg.confirmed_events),
  [`Where can I find ${CATERING_DIET} catering in Anna Nagar?`]: () => nonEmpty(cfg.service_area) && Boolean(confirmedPhone),
  "How do I book catering with Brihadhee?": () => Boolean(confirmedPhone || confirmedWhatsapp),
  /* Answered with the confirmed lead time, or "not published, call" while advance_notice_required is null. */
  "How far ahead should I book catering with Brihadhee?": () => Boolean(confirmedPhone || confirmedWhatsapp),
  "How is Brihadhee catering priced?": () => ["per_plate", "on_request"].includes(cfg.pricing_model),
};
const TARGET_QUESTIONS = Object.keys(GATES);
/* Service schema per catering page (serviceType). */
const SERVICE_TYPES = {
  [CATERING_PATH]: "Event catering",
  [PLANNER_PATH]: "Event catering",
  [CORPORATE_PATH]: "Corporate catering",
  [SMALL_FUNCTIONS_PATH]: "Event catering",
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
const htmlEntities = {
  amp: "&", apos: "'", quot: '"', lt: "<", gt: ">",
};
const decodeHtml = (text) => String(text ?? "").replace(
  /&(?:#(\d+)|#x([\da-f]+)|(amp|apos|quot|lt|gt));/gi,
  (_, decimal, hex, named) => named ? htmlEntities[named.toLowerCase()] : String.fromCodePoint(decimal ? Number(decimal) : parseInt(hex, 16)),
);
const visibleText = (html) =>
  decodeHtml(html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

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
      if (parsed && parsed["@graph"]) {
        if (parsed["@context"] !== "https://schema.org") err(name, "@graph block without @context https://schema.org");
        nodes.push(...parsed["@graph"].map((n) => ({ "@context": parsed["@context"], ...n })));
      } else nodes.push(...[].concat(parsed));
    } catch (e) {
      err(name, `JSON-LD block ${i + 1} is not valid JSON: ${e.message}`);
    }
  });
  pages.push({ name, html, nodes });
}

const catering = pages.find((p) => p.name === CATERING_PATH);
const canonicals = new Set(pages.flatMap(({ html }) => html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? []));
for (const cp of CATERING_PAGES) {
  const built = pages.some((p) => p.name === cp);
  if (cfg.offer_catering !== true && built) err(cp, "page was built while offer_catering is not true");
  if (cfg.offer_catering === true && !built) err(cp, "offer_catering is true but the page was not built");
}

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
    if (JSON.stringify(r.servesCuisine) !== JSON.stringify(SITE.cuisines)) err(name, `servesCuisine ${JSON.stringify(r.servesCuisine)} != facts.js cuisines`);
    const a = r.address ?? {};
    if (a.addressLocality !== SITE.locality) err(name, `addressLocality "${a.addressLocality}"`);
    if (a.addressRegion !== SITE.region) err(name, `addressRegion "${a.addressRegion}"`);
    if (a.postalCode !== SITE.postal) err(name, `postalCode "${a.postalCode}"`);
    for (const part of ["W-Block", "3rd Avenue", "Anna Nagar East"]) {
      if (!String(a.streetAddress ?? "").includes(part)) err(name, `streetAddress missing "${part}"`);
    }
    if (digits(r.telephone) !== digits(SITE.phone)) err(name, `telephone ${r.telephone} != site phone ${SITE.phone}`);
    if (r.telephone && !/^\+\d{10,15}$/.test(r.telephone)) err(name, `telephone not E.164: ${r.telephone}`);
    if (hasKey(r, "aggregateRating") || hasKey(r, "review")) err(name, "Restaurant carries aggregateRating or review (self-served)");
    if (hasKey(r, "makesOffer")) err(name, "Restaurant carries legacy makesOffer nodes");
    if (KEY) {
      if (KEY.entity && r.name !== KEY.entity) err(name, `name != Key.md entity "${KEY.entity}"`);
      if (KEY.cuisine) {
        const joined = [].concat(r.servesCuisine).join(" ").toLowerCase();
        for (const w of KEY.cuisine.toLowerCase().split(/\s+/)) {
          if (!joined.includes(w)) err(name, `servesCuisine lacks "${w}" from Key.md cuisine "${KEY.cuisine}"`);
        }
      }
      if (KEY.location) {
        for (const part of ["W Block", "Anna Nagar East", "Chennai", "Tamil Nadu", "600040"]) {
          if (!KEY.location.includes(part)) warnings.push(`Key.md Location lacks "${part}"`);
        }
      }
    }
  } else {
    err(name, "no Restaurant entity");
  }

  /* WebSite / WebPage / BreadcrumbList */
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const ws = nodes.filter((n) => typeOf(n).includes("WebSite"));
  if (ws.length !== 1) err(name, `expected exactly 1 WebSite node, found ${ws.length}`);
  const wp = nodes.find((n) => typeOf(n).includes("WebPage"));
  const primaryContent = nodes.find((n) => typeOf(n).some((type) => ["Menu", "Service", "Article"].includes(type)));
  const expectedPrimary = primaryContent ?? (["/", "/about/", "/book-a-table/"].includes(name) ? r : null);
  if (!wp) err(name, "missing WebPage node");
  else {
    if (canonical && wp.url !== canonical) err(name, `WebPage.url ${wp.url} != canonical ${canonical}`);
    if (wp["@id"] !== `${wp.url}#webpage`) err(name, "WebPage @id does not match its URL");
    if (wp.isPartOf?.["@id"] !== ws[0]?.["@id"]) err(name, "WebPage.isPartOf does not reference the WebSite");
    if (wp.about?.["@id"] !== r?.["@id"]) err(name, "WebPage.about does not reference the Restaurant");
    const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
    const description = decodeHtml(html.match(/<meta name="description" content="([^"]*)"/i)?.[1]);
    if (!title || wp.name !== title) err(name, "WebPage.name differs from the HTML title");
    if (!description || wp.description !== description) err(name, "WebPage.description differs from the HTML description");
    if (expectedPrimary && wp.mainEntity?.["@id"] !== expectedPrimary["@id"]) {
      err(name, `WebPage.mainEntity does not reference this page's ${typeOf(expectedPrimary).join("/")} node`);
    }
    const bcId = wp.breadcrumb?.["@id"];
    const bc = nodes.find((n) => n["@id"] === bcId && typeOf(n).includes("BreadcrumbList"));
    if (name === "/") {
      if (wp.breadcrumb || nodes.some((n) => typeOf(n).includes("BreadcrumbList"))) err(name, "homepage should omit its one-item breadcrumb trail");
    } else if (!bc) err(name, "WebPage.breadcrumb does not resolve to a BreadcrumbList");
    else {
      const items = bc.itemListElement ?? [];
      if (items.length < 2) err(name, "BreadcrumbList needs at least two items");
      items.forEach((it, i) => {
        if (it["@type"] !== "ListItem") err(name, "breadcrumb item must be a ListItem");
        if (it.position !== i + 1) err(name, `breadcrumb position ${it.position} != ${i + 1}`);
        if (!it.name || !it.item?.startsWith(`${SITE_ORIGIN}/`) || !canonicals.has(it.item)) {
          err(name, `breadcrumb item needs a name and a built same-site canonical: ${it.item}`);
        }
      });
      if (items.at(-1)?.item !== wp.url) err(name, "last breadcrumb does not point at this page");
    }
  }
  if (r && (r.hasMenu !== `${SITE_ORIGIN}${MENU_PATH}` || !canonicals.has(r.hasMenu))) err(name, "Restaurant.hasMenu must link to the built menu canonical");
  if (r && "priceRange" in r && FACTS.priceRange.status !== "verified") err(name, "priceRange emitted while the fact is pending");
  if (r && "openingHoursSpecification" in r && FACTS.hours.status !== "verified") err(name, "openingHoursSpecification emitted while hours are pending");

  /* Service (catering) */
  for (const s of nodes.filter((n) => typeOf(n).includes("Service"))) {
    if (!SERVICE_PAGES.includes(name)) err(name, "Service schema outside the catering service pages");
    if (cfg.offer_catering !== true) err(name, "Service emitted while offer_catering is not true");
    if (s.url !== canonical || s["@id"] !== `${canonical}#service`) err(name, "Service URL and @id must use the page canonical");
    if (s.serviceType !== SERVICE_TYPES[name]) err(name, `serviceType "${s.serviceType}" != "${SERVICE_TYPES[name]}"`);
    if (name === CATERING_PATH) {
      const offers = s.hasOfferCatalog?.itemListElement ?? [];
      if (!offers.length) err(name, "event catering Service has no hasOfferCatalog offers");
      for (const o of offers) if (!o.itemOffered?.name) err(name, "hasOfferCatalog offer without itemOffered.name");
    }
    if (s.provider?.["@id"] !== r?.["@id"]) err(name, "Service.provider does not reference the Restaurant @id");
    if (hasKey(s, "aggregateRating") || hasKey(s, "review")) err(name, "Service carries AggregateRating/review (no verified catering reviews)");
    for (const offer of s.hasOfferCatalog?.itemListElement ?? []) {
      const quantity = offer.eligibleQuantity;
      const maxMismatch = (name === CATERING_PATH || quantity?.maxValue !== undefined) && quantity?.maxValue !== cfg.max_guests;
      if (quantity?.minValue !== cfg.min_guests || maxMismatch || quantity?.unitText !== "guests") {
        err(name, `Service offer "${offer.itemOffered?.name}" does not use the approved single-event guest range`);
      }
    }
    if (name === CORPORATE_PATH && hasKey(s, "eligibleQuantity")) err(name, "corporate Service must not apply the single-event guest range to office meal programmes");
    const areas = [].concat(s.areaServed ?? []).map((x) => x?.name ?? x);
    for (const a of areas) if (!(cfg.service_area ?? []).includes(a)) err(name, `areaServed "${a}" is not in confirmed service_area`);
    if (!nonEmpty(cfg.service_area) && areas.length) err(name, "areaServed present but service_area is empty");
    if ("telephone" in s) err(name, "use ServiceChannel.servicePhone rather than telephone directly on Service");
    const channel = s.availableChannel;
    const contact = channel?.servicePhone;
    if (confirmedPhone) {
      if (channel?.["@type"] !== "ServiceChannel" || contact?.["@type"] !== "ContactPoint" ||
          digits(contact.telephone) !== digits(confirmedPhone) || !/^\+\d{10,15}$/.test(contact.telephone)) {
        err(name, `ServiceChannel must use the confirmed catering phone ${confirmedPhone}`);
      }
    } else if (contact) {
      err(name, "ServiceChannel.servicePhone present but no confirmed catering phone");
    }
  }
  if (SERVICE_PAGES.includes(name) && !nodes.some((n) => typeOf(n).includes("Service"))) err(name, "missing Service schema");
  if (CATERING_PAGES.includes(name) && confirmedPhone && !html.includes(`href="tel:+${digits(confirmedPhone)}"`)) {
    err(name, "confirmed catering phone is missing from the page's call links");
  }

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
      if (name === CATERING_PATH) {
        if (!TARGET_QUESTIONS.includes(qn)) err(name, `FAQ question is not one of the catering targets: ${qn}`);
        else if (!GATES[qn]()) err(name, `FAQ question not confirmed in config: ${qn}`);
      }
    }
    const dup = qs.map((q) => q.name).filter((n, i, a) => a.indexOf(n) !== i);
    if (dup.length) err(name, `duplicate FAQ questions: ${dup.join("; ")}`);
    if (f.about?.["@id"] !== r?.["@id"]) err(name, "FAQPage.about does not reference the Restaurant @id");
    if (f.isPartOf?.["@id"] !== wp?.["@id"] || wp?.hasPart?.["@id"] !== f["@id"]) err(name, "FAQPage and WebPage must have reciprocal part links");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.dateModified ?? "")) err(name, "FAQPage missing dateModified (YYYY-MM-DD)");
  }

  /* Menu: every MenuItem declares the vegetarian diet */
  for (const m of nodes.filter((n) => typeOf(n).includes("Menu"))) {
    if (name !== MENU_PATH || m.url !== canonical || m["@id"] !== `${canonical}#menu` ||
        m.mainEntityOfPage?.["@id"] !== wp?.["@id"]) {
      err(name, "Menu identity must match the canonical menu and WebPage");
    }
    const text = visibleText(html);
    if (m.description !== `${MENU_NOTES.gst} ${MENU_NOTES.parcel}` || !text.includes(m.description)) {
      err(name, "Menu description must match the visible tax and parcel notes");
    }
    const customization = m.hasMenuSection?.find((section) => section.name === "Build Your Own Dosa");
    const steps = customization?.hasMenuSection?.filter((section) => /^Step \d+:/.test(section.name)) ?? [];
    if (!steps.length) err(name, "Menu is missing its build-your-own steps");
    for (const [index, step] of steps.entries()) {
      if (!text.includes(step.name)) err(name, `Menu step heading differs from visible HTML: ${step.name}`);
      for (const option of step.hasMenuItem ?? []) {
        const describedAsExtra = option.offers?.description === "Add-on price for Build Your Own Dosa.";
        if (describedAsExtra !== (index > 0)) err(name, `Menu option "${option.name}" has incorrect add-on price context`);
      }
    }
    (function walk(sections) {
      for (const sec of sections ?? []) {
        for (const it of sec.hasMenuItem ?? []) {
          if (it.suitableForDiet !== "https://schema.org/VegetarianDiet") err(name, `MenuItem "${it.name}" lacks suitableForDiet VegetarianDiet`);
        }
        walk(sec.hasMenuSection);
      }
    })(m.hasMenuSection);
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
console.log(`✔ Schema valid: ${count} JSON-LD node(s) on ${pages.length} page(s)${catering ? " (incl. catering pages)" : ""}`);
