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
import { BYO_DEFINITION, CATERING_ID, RESTAURANT_ID, FACTS, SITE_ORIGIN, cateringContacts, getFact, isConfirmed, toE164 } from "../src/data/entity-truth.ts";
import { MENU_NOTES } from "../src/data/menu-canonical.ts";
import { CATERING_DIET } from "../config/seo-gates.ts";
import { firstAnswerSentence } from "../src/lib/answers.js";
import { cateringRelationshipProblems, factProblems, readPageCopy } from "./aeo-rules.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const dist = resolve(process.argv[2] ?? join(ROOT, "dist"));
const cfg = JSON.parse(readFileSync(join(ROOT, "config", "client-verification.json"), "utf8"));
const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);

/* ---- Facts the entity must match -------------------------------------- */
const SITE = {
  name: FACTS.name.value,
  phone: FACTS.phone.value,
  cuisines: FACTS.cuisines.value,
  region: FACTS.address.value.state,
  locality: FACTS.address.value.city,
  postal: FACTS.address.value.postalCode,
};

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
const { phone: confirmedPhone, whatsapp: confirmedWhatsapp } = cateringContacts();
const nonEmpty = (a) => Array.isArray(a) && a.length > 0;
const GATES = {
  "Does Brihadhee do wedding and event catering?": () => cfg.offer_catering === true && nonEmpty(cfg.confirmed_events),
  "Does Brihadhee provide end-to-end event catering?": () => FACTS.eventService?.status === "verified",
  "What kind of catering does Brihadhee provide?": () => nonEmpty(cfg.menu_formats),
  [`Is Brihadhee catering ${CATERING_DIET}?`]: () => nonEmpty(cfg.menu_formats),
  "Which events does Brihadhee cater?": () => nonEmpty(cfg.confirmed_events),
  "Where can I find vegetarian catering in Anna Nagar?": () => nonEmpty(cfg.service_area) && Boolean(confirmedPhone),
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
    err(name, "no server-rendered JSON-LD found");
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
    if (typeOf(o).includes("CateringService")) err(name, "CateringService is not a Schema.org type");
  }
  const seen = new Set();
  for (const n of nodes) {
    if (!n["@id"]) continue;
    if (seen.has(n["@id"])) err(name, `duplicate top-level @id: ${n["@id"]}`);
    seen.add(n["@id"]);
  }

  /* Restaurant entity */
  const restaurants = nodes.filter((n) => typeOf(n).includes("Restaurant"));
  const [r] = restaurants;
  const address = getFact("address");
  if (restaurants.length !== 1) err(name, `expected exactly one Restaurant entity, found ${restaurants.length}`);
  if (r) {
    if (r["@id"] !== RESTAURANT_ID || r.url !== `${SITE_ORIGIN}/`) err(name, `Restaurant must use the stable ${RESTAURANT_ID} @id and home URL`);
    if (r.name !== SITE.name) err(name, `Restaurant.name "${r.name}" != "${SITE.name}"`);
    if (!sameJson(r.servesCuisine, SITE.cuisines)) err(name, "Restaurant.servesCuisine differs from entity-truth.ts");
    if (!r.description?.includes(getFact("dietary")) || !r.description.includes(getFact("mealTimes"))) {
      err(name, "Restaurant.description must state the verified diet and meal service");
    }
    for (const problem of factProblems(r.description ?? "")) err(name, `Restaurant.description: ${problem}`);
    const a = r.address ?? {};
    if (a.addressLocality !== SITE.locality) err(name, `addressLocality "${a.addressLocality}"`);
    if (a.addressRegion !== SITE.region) err(name, `addressRegion "${a.addressRegion}"`);
    if (a.postalCode !== SITE.postal) err(name, `postalCode "${a.postalCode}"`);
    if (a["@type"] !== "PostalAddress" || a.addressCountry !== address.country ||
        a.streetAddress !== `${address.line1}, ${address.line2}`) err(name, "Restaurant PostalAddress differs from the verified physical address");
    if (r.telephone !== toE164(SITE.phone)) err(name, `Restaurant.telephone must be the dining number in E.164 (${toE164(SITE.phone)})`);
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
  }

  /* WebSite / WebPage / BreadcrumbList */
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const ws = nodes.filter((n) => typeOf(n).includes("WebSite"));
  if (ws.length !== 1) err(name, `expected exactly 1 WebSite node, found ${ws.length}`);
  if (ws[0]?.publisher?.["@id"] !== RESTAURANT_ID) err(name, "WebSite.publisher must reference the Restaurant");
  const wp = nodes.find((n) => typeOf(n).includes("WebPage"));
  const sharedCatering = nodes.find((n) => n["@id"] === CATERING_ID);
  const pageService = nodes.find((n) => n["@id"] === `${canonical}#service`);
  const primaryContent = nodes.find((n) => typeOf(n).some((type) => ["Menu", "Article"].includes(type)));
  const subjectId = CATERING_PAGES.includes(name) ? (pageService?.["@id"] ?? CATERING_ID) : RESTAURANT_ID;
  const expectedPrimary = primaryContent ?? pageService ?? (name === QUOTE_PATH ? sharedCatering : null) ??
    (["/", "/about/", "/book-a-table/"].includes(name) ? r : null);
  if (!wp) err(name, "missing WebPage node");
  else {
    if (canonical && wp.url !== canonical) err(name, `WebPage.url ${wp.url} != canonical ${canonical}`);
    if (wp["@id"] !== `${wp.url}#webpage`) err(name, "WebPage @id does not match its URL");
    if (wp.isPartOf?.["@id"] !== ws[0]?.["@id"]) err(name, "WebPage.isPartOf does not reference the WebSite");
    if (wp.about?.["@id"] !== subjectId) err(name, `WebPage.about must reference ${subjectId}`);
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
  if (r && isConfirmed("hours") && isConfirmed("openDays")) {
    const rows = (r.openingHoursSpecification ?? []).flatMap((row) =>
      [].concat(row.dayOfWeek ?? []).map((day) => `${day} ${row.opens} ${row.closes}`)
    ).sort();
    const expectedRows = getFact("hours").days.filter(({ open, close }) => open && close)
      .map(({ day, open, close }) => `https://schema.org/${day} ${open} ${close}`).sort();
    if (!sameJson(rows, expectedRows) || r.openingHoursSpecification?.some((row) => row["@type"] !== "OpeningHoursSpecification")) {
      err(name, "Restaurant openingHoursSpecification differs from verified days or times");
    }
  } else if (r && "openingHoursSpecification" in r) {
    err(name, "openingHoursSpecification emitted while hours or days are pending");
  }

  /* Service (catering) */
  const sharedExpected = cfg.offer_catering === true && (name === "/" || CATERING_PAGES.includes(name));
  if (Boolean(sharedCatering) !== sharedExpected) err(name, "presence of the shared catering entity contradicts the page role or catering gate");
  const services = nodes.filter((n) => n["@id"] === CATERING_ID || typeOf(n).includes("Service"));
  for (const s of services) {
    const shared = s === sharedCatering;
    for (const problem of cateringRelationshipProblems(s, { shared })) err(name, problem);
    for (const text of [s.name, s.serviceType, s.description].filter(Boolean)) {
      for (const problem of factProblems(text)) err(name, `Service ${s["@id"]}: ${problem}`);
    }
    if (cfg.offer_catering !== true) err(name, "Service emitted while offer_catering is not true");
    if (shared) {
      if (s.url !== `${SITE_ORIGIN}${CATERING_PATH}` || s.name !== `${SITE.name} Catering` ||
          s.serviceType?.toLowerCase() !== `${CATERING_DIET} catering` || !s.description?.includes(`${CATERING_DIET} catering`)) {
        err(name, "shared catering Service differs from the approved name, hub URL or diet");
      }
      if (s.hasOfferCatalog || s.availableChannel) err(name, "keep offer details and contact channels on specialist Services");
    } else {
      if (!SERVICE_PAGES.includes(name)) err(name, "specialist Service schema outside a catering service page");
      if (s.url !== canonical || s["@id"] !== `${canonical}#service`) err(name, "specialist Service URL and @id must use the page canonical");
      if (s.serviceType !== SERVICE_TYPES[name]) err(name, `serviceType "${s.serviceType}" != "${SERVICE_TYPES[name]}"`);
    }
    if (!shared && name === CATERING_PATH) {
      const offers = s.hasOfferCatalog?.itemListElement ?? [];
      if (!offers.length) err(name, "event catering Service has no hasOfferCatalog offers");
      for (const o of offers) if (!o.itemOffered?.name) err(name, "hasOfferCatalog offer without itemOffered.name");
    }
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
    if (!shared && confirmedPhone) {
      if (channel?.["@type"] !== "ServiceChannel" || contact?.["@type"] !== "ContactPoint" ||
          contact.telephone !== toE164(confirmedPhone)) {
        err(name, `ServiceChannel must use the confirmed catering phone ${confirmedPhone}`);
      }
    } else if (!shared && contact) {
      err(name, "ServiceChannel.servicePhone present but no confirmed catering phone");
    }
  }
  if (SERVICE_PAGES.includes(name) && !pageService) err(name, "missing page-specific Service schema");
  if (CATERING_PAGES.includes(name) && confirmedPhone && !html.includes(`href="tel:${toE164(confirmedPhone)}"`)) {
    err(name, "confirmed catering phone is missing from the page's call links");
  }

  /* FAQPage */
  for (const f of nodes.filter((n) => typeOf(n).includes("FAQPage"))) {
    const { text } = readPageCopy(html);
    const qs = f.mainEntity ?? [];
    if (!qs.length) err(name, "FAQPage has no mainEntity");
    for (const q of qs) {
      const qn = q.name;
      const ans = q.acceptedAnswer?.text ?? "";
      if (!ans.trim()) err(name, `empty answer: ${qn}`);
      if (!text.includes(qn)) err(name, `FAQ question not visible on the page: ${qn}`);
      if (!text.includes(firstAnswerSentence(ans))) err(name, `FAQ answer sentence 1 not visible on the page: ${qn}`);
      if (name === CATERING_PATH) {
        if (!TARGET_QUESTIONS.includes(qn)) err(name, `FAQ question is not one of the catering targets: ${qn}`);
        else if (!GATES[qn]()) err(name, `FAQ question not confirmed in config: ${qn}`);
      }
    }
    const dup = qs.map((q) => q.name).filter((n, i, a) => a.indexOf(n) !== i);
    if (dup.length) err(name, `duplicate FAQ questions: ${dup.join("; ")}`);
    if (f.about?.["@id"] !== subjectId) err(name, `FAQPage.about must reference ${subjectId}`);
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
    if (customization?.description !== BYO_DEFINITION || !text.includes(BYO_DEFINITION)) {
      err(name, "Build Your Own Dosa MenuSection must share its definition with visible HTML");
    }
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
const cateringEntities = pages.flatMap(({ name, nodes }) =>
  nodes.filter((n) => n["@id"] === CATERING_ID).map((node) => ({ name, node }))
);
for (const { name, node } of cateringEntities.slice(1)) {
  if (!sameJson(node, cateringEntities[0].node)) err(name, `shared catering entity differs from ${cateringEntities[0].name}`);
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
