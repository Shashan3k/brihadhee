#!/usr/bin/env node
/**
 * verify-seo-compliance: the 12 November keyword plan's section 7 do-not-use list
 * and the client-verification gates in config/seo-gates.ts, enforced on everything
 * the site publishes. Part of `npm run check` (and so of `npm run build`).
 *
 *   node scripts/verify-seo-compliance.ts [distDir]      (default: dist)
 *
 * What it scans, and why:
 *  - dist/: every .html, .txt, .xml, .json and .webmanifest a visitor, crawler or
 *    AI agent can fetch. This is where every claim ends up, whichever source file
 *    (src/data/*.js, *.ts, *.astro, menu-canonical.ts) it came from. HTML is reduced
 *    to its claim surfaces: visible text, <title>, every meta content, alt / title /
 *    aria-label / placeholder attributes, and JSON-LD.
 *  - public/: static text files served as they are (.txt, .json, .md, .svg, .xml,
 *    .webmanifest), in case one never passes through the build.
 *  Source files are not scanned: their comments and rule lists (this file,
 *  avoid-terms.txt, seo-gates.ts) name the forbidden terms on purpose.
 *
 * Fails (exit 1) on:
 *  A. Section 7 terms: breakfast and tiffin positioning, dosa variety counts,
 *     cheap / budget / price-cap / value-meal wording, rupee per-plate figures,
 *     Jain overclaims and Marwari / Rajasthani cuisine, non-veg catering, and
 *     catering headcounts under 50. The one permitted mention is the exact question
 *     NEGATIVE_FAQ_QUESTION ("Does Brihadhee serve breakfast?").
 *  B. Gated claims published while their gate is off: no onion no garlic, satvik,
 *     Jain, Hindi copy, Brahmin religious functions, "premium", a named temple,
 *     "pure veg" catering (Q20), the WhatsApp quote hand-off, and the gated page in
 *     the build, sitemap, llms files or any link.
 *  C. Gate consistency: seo-gates.ts against entity-truth.ts,
 *     config/client-verification.json and src/lib/lead.js.
 *  D. Brand disambiguation: the home page <title>, <h1> and every meta title and
 *     description pair "Brihadhee" with "Pure Veg South Indian Restaurant in Anna
 *     Nagar" or "dosa"; the home page states the hours and "Lunch & Dinner Only";
 *     every indexable page title names Brihadhee.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative, extname } from "node:path";
import { pathToFileURL } from "node:url";

type Rule = { re: RegExp; why: string };
type Hit = { group: string; file: string; message: string };

const ROOT = resolve(import.meta.dirname, "..");
const dist = resolve(process.argv[2] ?? join(ROOT, "dist"));
const PUBLIC_DIR = join(ROOT, "public");
const load = (p: string) => import(pathToFileURL(join(ROOT, p)).href);

const G = await load("config/seo-gates.ts");
const { FACTS } = await load("src/data/entity-truth.ts");
const LEAD = await load("src/lib/lead.js");
const cfg = JSON.parse(readFileSync(join(ROOT, "config", "client-verification.json"), "utf8"));

if (!existsSync(dist)) {
  console.error(`✖ verify-seo-compliance: ${dist} not found. Run astro build first.`);
  process.exit(2);
}

const hits: Hit[] = [];
const fail = (group: string, file: string, message: string) => hits.push({ group, file, message });

/* ---- A. Section 7 do-not-use list ----------------------------------------- */
const RATE = String.raw`(?:₹|rs\.?|inr)\s*\d[\d,]*`;
const SECTION_7: Rule[] = [
  // Breakfast and tiffin: no breakfast service (open 11 AM to 11 PM, lunch and dinner only)
  { re: /\bbreakfasts?\b/i, why: "no breakfast service; the only permitted mention is the exact FAQ question" },
  { re: /\bearly[\s-]+morning\b/i, why: "no early-morning service (opens 11 AM)" },
  { re: /\bmorning\s+tiffins?\b/i, why: "tiffin is not offered" },
  { re: /\btiffin\s+cent(?:re|er)s?\b/i, why: "tiffin is not offered" },
  { re: /\bmini[\s-]*tiffins?\b/i, why: "Mini Tiffin is retired" },
  { re: /\btiffins?\b/i, why: "tiffin is not offered" },
  { re: /டிபன்|காலை\s*உணவு/, why: "tiffin / breakfast in Tamil" },
  { re: /\bpongal\s+vada\b/i, why: "tiffin item" },
  { re: /\bghee\s+podi\s+idl[iy]s?\b/i, why: "tiffin item" },
  { re: /\bmini\s+idl[iy]s?\s+sambh?ar\b/i, why: "tiffin item" },
  { re: /\bpoori\s+masala\b/i, why: "tiffin item" },
  { re: /\bkuzhi\s+paniyaram\b/i, why: "tiffin item" },
  { re: /\bkesari\b/i, why: "tiffin item" },
  { re: /\bmargazhi\s+special\s+tiffin\b/i, why: "tiffin-led" },
  { re: /\bkarthik\s+tiffin\s+cent(?:re|er)\b/i, why: "tiffin-led competitor" },
  { re: /\bmorning\s+walkers?\b|\bafter\s+a\s+walk\s+at\s+(?:anna\s+nagar\s+)?tower\s+park\b/i, why: "breakfast-led persona" },
  // Dosa counts: replaced by build-your-own dosa
  { re: /\b500\s*\+?\s*(?:dosa\s+)?(?:varieties|types|kinds)\b|\b500\s*\+?\s*dosas?\b|\b500\s+kinds\s+of\s+dosas?\b/i, why: "'500 varieties' is not a client claim" },
  { re: /500\s*தோசை\s*வகைகள்/, why: "'500 varieties' in Tamil" },
  { re: /\b99\s*\+?\s*(?:dosa\s+)?varieties\b/i, why: "variety-count positioning (a competitor's claim)" },
  // Price positioning: the client is not a budget option; no published per-plate rates
  { re: /\bcheap(?:er|est|ly)?\b/i, why: "not a budget option" },
  { re: /\bbudget\b/i, why: "not a budget option" },
  { re: /\bpocket[\s-]*friendly\b|\bwallet[\s-]*friendly\b/i, why: "not a budget option" },
  { re: /\baffordabl[ey]\b|\baffordability\b/i, why: "not a budget option" },
  { re: /\bunder\s*(?:₹|rs\.?|inr)\s*(?:100|150|300)\b/i, why: "price-cap positioning" },
  { re: /\bvalue[\s-]+(?:meals?|combos?)\b/i, why: "'value meal' is held (question 21)" },
  { re: new RegExp(String.raw`${RATE}\s*(?:\/|per|a)\s*(?:plate|head|person|guest|pax)\b`, "i"), why: "no per-plate rupee figures (quoted after the enquiry)" },
  { re: new RegExp(String.raw`\bper[\s-]+(?:plate|head)\s*(?:from\s*|at\s*|:\s*)?${RATE}`, "i"), why: "no per-plate rupee figures (quoted after the enquiry)" },
  // Dietary and cuisine overclaims
  { re: /\bpure\s+jain\b|\b100\s*%\s*jain\b|\bstrictly\s+jain\b|\bjain[\s-]+certified\b/i, why: "a religious dietary claim the kitchen cannot certify" },
  { re: /\bmarwa[rd]i\s+bhojn?alaya\b|\bmarwa[rd]i\s+thalis?\b|\brajasthani\s+thalis?\b|\bdal\s+baati(?:\s+churma)?\b|\bker\s+sangri\b/i, why: "a different cuisine (Rajasthani / Marwari), not served" },
  { re: /\bnon[\s-]?veg(?:etarian)?\s+(?:wedding\s+|party\s+|event\s+)?catering\b|\b(?:chicken|mutton|fish)\s+catering\b|\bveg\s+(?:and|&)\s+non[\s-]?veg\s+caterers?\b/i, why: "no non-veg catering" },
  // Headcounts under the 50-guest minimum
  { re: /\bcater(?:ing|er|ers|s)?\s+(?:for\s+)?(?:[1-9]|[1-4]\d)(?![\d,.])\s*(?:people|guests|persons|pax)\b/i, why: "catering minimum is 50 guests" },
  { re: /\bcatering\s+for\s+(?:10|20|30|40)\b(?![\d,.])/i, why: "catering minimum is 50 guests" },
  { re: /\b(?:[1-9]|[1-4]\d)(?![\d,.])\s*(?:people|guests|persons|pax)\s+catering\b/i, why: "catering minimum is 50 guests" },
  { re: /\btiny\s+party\s+catering\b/i, why: "catering minimum is 50 guests" },
  { re: /\b(?:under|below|less\s+than)\s+50\s+(?:guests|people|persons|pax)\b|>\s*Under 50\s*</i, why: "catering minimum is 50 guests" },
];

/* ---- B. Gated claims (each only while its gate is off) --------------------- */
const GATED: (Rule & { on: boolean; gate: string })[] = [
  {
    gate: "ENABLE_NO_ONION_NO_GARLIC_CLUSTER (Q11-Q14)",
    on: G.ENABLE_NO_ONION_NO_GARLIC_CLUSTER,
    re: /\bno[\s-]+onion[\s,/&-]*(?:(?:and|or|no)[\s-]+)?garlic\b|\bwithout\s+onion\s*(?:and|or|,|&)\s*garlic\b|\bonion[\s-]*(?:and|&)?[\s-]*garlic[\s-]*free\b|\bgarlic[\s-]*free\b|\bno[\s-]+garlic\b|\bbina\s+(?:pyaz|lahsun)\b|बिना\s+प्याज|வெங்காயம்\s*பூண்டு\s*இல்லா|பூண்டு\s*இல்லா/i,
    why: "no-onion-no-garlic claim before the kitchen confirms dish by dish",
  },
  {
    gate: "ENABLE_NO_ONION_NO_GARLIC_CLUSTER (Q11-Q14)",
    on: G.ENABLE_NO_ONION_NO_GARLIC_CLUSTER,
    re: /\bsat+v(?:ik|ic)\b|\bsaa?thvik\b|\bsatwik\b|सात्विक|சாத்வீக/i,
    why: "satvik claim before the kitchen confirms",
  },
  { gate: "ENABLE_JAIN_FRIENDLY_CLAIMS (Q13-Q14)", on: G.ENABLE_JAIN_FRIENDLY_CLAIMS, re: /\bjain\b|जैन|ஜெயின்/i, why: "Jain wording before the kitchen confirms" },
  { gate: "ENABLE_HINDI_COPY (Q17)", on: G.ENABLE_HINDI_COPY, re: /[ऀ-ॿ]+/, why: "Hindi (Devanagari) copy before question 17" },
  {
    gate: "ENABLE_BRAHMIN_RELIGIOUS_FUNCTIONS (Q23)",
    on: G.ENABLE_BRAHMIN_RELIGIOUS_FUNCTIONS,
    re: /\bupanayan(?:am)?\b|\bseemantham\b|\bannad(?:h)?anam\b|\bhomam\b|\bbrahmin\b|\biyer\s+catering\b|\biyengar\s+catering\b/i,
    why: "community / religious-function wording before question 23",
  },
  { gate: "ENABLE_PREMIUM_WORDING (Q22)", on: G.ENABLE_PREMIUM_WORDING, re: /\bpremium\b|\bupscale\b|\bfine[\s-]+dining\b/i, why: "'premium' wording before question 22" },
  { gate: "ENABLE_NAMED_TEMPLE (Q24)", on: G.ENABLE_NAMED_TEMPLE, re: /\bayyappan\s+(?:koil|kovil|temple)\b/i, why: "a named nearby temple before question 24" },
  {
    gate: "IS_CATERING_PURE_VEG (Q20)",
    on: G.IS_CATERING_PURE_VEG,
    re: /\bpure[\s-]*veg(?:etarian)?\b(?:\s+[\w'’&%-]+){0,4}?\s+(?:cater(?:ing|er|ers)|caters)\b|\bcater(?:ing|er|ers|s)\b(?:\s+[\w'’&%-]+){0,3}?\s+(?:is\s+|are\s+)?(?:100\s*%\s+)?pure[\s-]*veg|சுத்த\s*சைவ\s*கேட்டரிங்/i,
    why: "catering copy says 'vegetarian', not 'pure veg', until question 20",
  },
];

/* ---- Helpers ---------------------------------------------------------------- */
function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}
const decode = (s: string): string =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_m, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_m, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

/** Everything on an HTML page that can carry a claim. */
function claimSurface(html: string): string {
  const ld = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const metas = [...html.matchAll(/<meta\b[^>]*\bcontent="([^"]*)"[^>]*>/gi)].map((m) => m[1]);
  const attrs = [...html.matchAll(/\s(?:alt|title|aria-label|placeholder)="([^"]*)"/gi)].map((m) => m[1]);
  // Block boundaries become " | " so words from neighbouring list items, headings or
  // paragraphs never read as one phrase ("...catering in Chennai | Pure veg restaurant...").
  const body = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/?(?:li|p|h[1-6]|div|dt|dd|td|th|tr|section|header|footer|nav|figcaption|summary|details|option|label|button|ul|ol|dl|address|br)\b[^>]*>/gi, " | ")
    .replace(/<[^>]+>/g, " ");
  return decode([body, ...metas, ...attrs, ...ld].join("\n | ")).replace(/\s+/g, " ");
}
const visible = (html: string): string =>
  decode(html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const snippet = (text: string, m: RegExpMatchArray): string => {
  const i = m.index ?? 0;
  return `"${m[0]}" in "…${text.slice(Math.max(0, i - 45), i + m[0].length + 45).trim()}…"`;
};
const pagePath = (rel: string): string => `/${rel.replace(/index\.html$/, "")}`;

/* ---- Scan dist/ and public/ --------------------------------------------------- */
const DIST_EXT = new Set([".html", ".txt", ".xml", ".json", ".webmanifest"]);
const PUBLIC_EXT = new Set([".txt", ".json", ".md", ".svg", ".xml", ".webmanifest"]);
const pages = new Map<string, string>(); // path -> html
let scanned = 0;

function scanText(file: string, text: string): void {
  const t = G.stripPermittedNegatives(text);
  for (const r of SECTION_7) {
    const m = t.match(r.re);
    if (m) fail("A. Section 7 term", file, `${snippet(t, m)}: ${r.why}`);
  }
  for (const r of GATED) {
    if (r.on) continue;
    const m = t.match(r.re);
    if (m) fail("B. Gated claim", file, `${snippet(t, m)}: ${r.why} [gate ${r.gate} is off]`);
  }
}

for (const file of walk(dist)) {
  const ext = extname(file);
  if (!DIST_EXT.has(ext)) continue;
  const rel = relative(dist, file).replaceAll("\\", "/");
  if (rel.startsWith("_astro/")) continue;
  const raw = readFileSync(file, "utf8");
  scanned++;
  if (ext === ".html") {
    pages.set(pagePath(rel), raw);
    scanText(`dist/${rel}`, claimSurface(raw));
  } else {
    scanText(`dist/${rel}`, decode(raw));
  }
}
if (existsSync(PUBLIC_DIR)) {
  for (const file of walk(PUBLIC_DIR)) {
    if (!PUBLIC_EXT.has(extname(file))) continue;
    scanned++;
    scanText(`public/${relative(PUBLIC_DIR, file).replaceAll("\\", "/")}`, readFileSync(file, "utf8"));
  }
}

/* ---- B2. Gated pages, links and the WhatsApp hand-off ------------------------ */
const read = (p: string): string => (existsSync(join(dist, p)) ? readFileSync(join(dist, p), "utf8") : "");
const sitemap = read("sitemap.xml");
const llms = `${read("llms.txt")}\n${read("llms-full.txt")}`;
const GATED_PAGES = [{ path: "/no-onion-no-garlic-anna-nagar/", on: G.ENABLE_NO_ONION_NO_GARLIC_CLUSTER, gate: "ENABLE_NO_ONION_NO_GARLIC_CLUSTER" }];
for (const gp of GATED_PAGES) {
  const built = pages.has(gp.path);
  if (!gp.on) {
    if (built) fail("B. Gated page", gp.path, `built while ${gp.gate} is off (drafts belong in astro dev or SEO_GATES_PREVIEW=1 builds only)`);
    if (sitemap.includes(gp.path)) fail("B. Gated page", "dist/sitemap.xml", `lists ${gp.path} while ${gp.gate} is off`);
    if (llms.includes(gp.path)) fail("B. Gated page", "dist/llms.txt", `lists ${gp.path} while ${gp.gate} is off`);
    for (const [p, html] of pages) if (html.includes(`href="${gp.path}`) || html.includes(`${gp.path}"`)) fail("B. Gated page", p, `links to ${gp.path} while ${gp.gate} is off`);
  } else {
    if (!built) fail("B. Gated page", gp.path, `${gp.gate} is on but the page was not built`);
    else if (/<meta name="robots" content="noindex/i.test(pages.get(gp.path) ?? "")) fail("B. Gated page", gp.path, `${gp.gate} is on but the page is noindex`);
    if (!sitemap.includes(gp.path)) fail("B. Gated page", "dist/sitemap.xml", `${gp.gate} is on but ${gp.path} is not in the sitemap`);
  }
}
for (const [p, html] of pages) {
  if (!G.ENABLE_LIVE_WHATSAPP_QUOTE_FORM && /data-whatsapp-quote=/.test(html)) {
    fail("B. Gated claim", p, "the quote form hands off to WhatsApp while ENABLE_LIVE_WHATSAPP_QUOTE_FORM is off (Q19)");
  }
  if (/<div class="draft-banner"/.test(html)) fail("B. Gated page", p, "a draft banner is in the production build");
}

/* ---- C. Gate consistency ---------------------------------------------------------- */
const hours = FACTS.hours?.value;
if (!hours || hours.opens !== G.CONFIRMED_OPENS || hours.closes !== G.CONFIRMED_CLOSES) {
  fail("C. Consistency", "config/seo-gates.ts", `CONFIRMED_OPENS/CLOSES (${G.CONFIRMED_OPENS}-${G.CONFIRMED_CLOSES}) != entity-truth.ts hours (${hours?.opens}-${hours?.closes})`);
}
const hhmm = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};
if (G.CONFIRMED_HOURS !== `${hhmm(G.CONFIRMED_OPENS)} – ${hhmm(G.CONFIRMED_CLOSES)}`) {
  fail("C. Consistency", "config/seo-gates.ts", `CONFIRMED_HOURS "${G.CONFIRMED_HOURS}" does not match ${G.CONFIRMED_OPENS} to ${G.CONFIRMED_CLOSES}`);
}
if (cfg.min_guests !== G.CATERING_MIN_GUESTS) fail("C. Consistency", "config/client-verification.json", `min_guests ${cfg.min_guests} != CATERING_MIN_GUESTS ${G.CATERING_MIN_GUESTS}`);
if (LEAD.QUOTE_MIN_GUESTS !== G.CATERING_MIN_GUESTS) fail("C. Consistency", "src/lib/lead.js", `QUOTE_MIN_GUESTS ${LEAD.QUOTE_MIN_GUESTS} != CATERING_MIN_GUESTS ${G.CATERING_MIN_GUESTS}`);
if (LEAD.HEADCOUNTS.some((h: string) => /under|below|^(?:[1-9]|[1-4]\d)(?![\d,])/i.test(h))) fail("C. Consistency", "src/lib/lead.js", "HEADCOUNTS offers a band under the 50-guest minimum");
const covers = FACTS.corporateCatering?.value?.dailyCovers;
if (covers !== G.CORPORATE_DAILY_COVERS) fail("C. Consistency", "config/seo-gates.ts", `CORPORATE_DAILY_COVERS ${G.CORPORATE_DAILY_COVERS} != entity-truth.ts corporateCatering ${covers}`);
if (!G.CORPORATE_DAILY_SCALE.startsWith(`${Number(G.CORPORATE_DAILY_COVERS).toLocaleString("en-IN")}+`)) fail("C. Consistency", "config/seo-gates.ts", `CORPORATE_DAILY_SCALE "${G.CORPORATE_DAILY_SCALE}" does not start with the daily covers`);
if (G.IS_RESTAURANT_PURE_VEG && FACTS.dietary?.status !== "verified") fail("C. Consistency", "config/seo-gates.ts", "IS_RESTAURANT_PURE_VEG is on but the dietary fact is not verified");
if (G.ENABLE_NO_ONION_NO_GARLIC_CLUSTER) {
  if (!G.NO_ONION_NO_GARLIC_DISHES.length) fail("C. Consistency", "config/seo-gates.ts", "ENABLE_NO_ONION_NO_GARLIC_CLUSTER is on but NO_ONION_NO_GARLIC_DISHES is empty (Q12)");
  if (!G.NO_ONION_NO_GARLIC_AVAILABILITY) fail("C. Consistency", "config/seo-gates.ts", "ENABLE_NO_ONION_NO_GARLIC_CLUSTER is on but NO_ONION_NO_GARLIC_AVAILABILITY is not set (Q12)");
  if (FACTS.noOnionGarlic?.status !== "verified") fail("C. Consistency", "src/data/entity-truth.ts", "ENABLE_NO_ONION_NO_GARLIC_CLUSTER is on but the noOnionGarlic fact is still unverified (its probes will fail check:facts)");
}
if (G.ENABLE_JAIN_FRIENDLY_CLAIMS && !G.ENABLE_NO_ONION_NO_GARLIC_CLUSTER) fail("C. Consistency", "config/seo-gates.ts", "ENABLE_JAIN_FRIENDLY_CLAIMS needs ENABLE_NO_ONION_NO_GARLIC_CLUSTER");
if (G.ENABLE_LIVE_WHATSAPP_QUOTE_FORM && !/^(?:\+?91)?[6-9]\d{9}$/.test(String(G.QUOTE_WHATSAPP_NUMBER ?? "").replace(/[\s-]/g, ""))) {
  fail("C. Consistency", "config/seo-gates.ts", "ENABLE_LIVE_WHATSAPP_QUOTE_FORM is on but QUOTE_WHATSAPP_NUMBER is not a valid Indian mobile number (Q19)");
}
if (G.ENABLE_NAMED_TEMPLE && !G.NEARBY_TEMPLE) fail("C. Consistency", "config/seo-gates.ts", "ENABLE_NAMED_TEMPLE is on but NEARBY_TEMPLE is empty (Q24)");

/* ---- D. Brand disambiguation and hours framing on the home page ------------------ */
const CATEGORY = /pure\s+veg(?:etarian)?\s+south\s+indian\s+restaurant,?\s+(?:in\s+)?anna\s+nagar|\bdosas?\b/i;
const home = pages.get("/") ?? "";
if (!home) fail("D. Disambiguation", "/", "home page not built");
else {
  const pair = (label: string, text: string) => {
    if (!/Brihadhee/.test(text) || !CATEGORY.test(text)) {
      fail("D. Disambiguation", "/", `${label} must pair "Brihadhee" with "Pure Veg South Indian Restaurant in Anna Nagar" or "dosa": "${text}"`);
    }
  };
  pair("<title>", decode(home.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ""));
  pair("<h1>", visible(home.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? ""));
  for (const m of home.matchAll(/<meta\s+(?:name|property)="((?:og:|twitter:)?(?:title|description))"\s+content="([^"]*)"/gi)) {
    pair(`<meta ${m[1]}>`, decode(m[2]));
  }
  const text = visible(home);
  const open = `${hhmm(G.CONFIRMED_OPENS).replace(":00", "")} to ${hhmm(G.CONFIRMED_CLOSES).replace(":00", "")}`;
  if (!text.includes(open)) fail("D. Disambiguation", "/", `home page does not state the hours "${open}"`);
  if (!text.toLowerCase().includes(G.MEAL_FRAMING.toLowerCase())) fail("D. Disambiguation", "/", `home page does not state "${G.MEAL_FRAMING}"`);
}
// Every indexable page title names the brand, except topic guides (/guides/), whose
// titles carry the question they answer; the guide body and schema name Brihadhee.
for (const [p, html] of pages) {
  if (/<meta name="robots" content="noindex/i.test(html) || p.startsWith("/guides/")) continue;
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  if (!/Brihadhee/.test(title)) fail("D. Disambiguation", p, `<title> does not name Brihadhee: "${title}"`);
}

/* ---- Report ------------------------------------------------------------------------ */
const gateLine = Object.entries(G.GATE_SUMMARY as Record<string, string>)
  .map(([k, q]) => `${k}=${G[k] ? "on" : "off"} (${q})`)
  .join(", ");
if (hits.length) {
  console.error(`✖ verify-seo-compliance failed (${hits.length} problem(s) in ${scanned} file(s)):`);
  const groups = [...new Set(hits.map((h) => h.group))];
  for (const g of groups) {
    console.error(`  ${g}`);
    for (const h of hits.filter((x) => x.group === g)) console.error(`    - ${h.file}: ${h.message}`);
  }
  console.error(`  Gates: ${gateLine}`);
  process.exit(1);
}
console.log(`✔ verify-seo-compliance passed (${scanned} file(s), ${SECTION_7.length} section 7 rules, ${GATED.filter((r) => !r.on).length} gated-claim rules active)`);
console.log(`  Gates: ${gateLine}`);
