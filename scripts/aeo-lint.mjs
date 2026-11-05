#!/usr/bin/env node
/**
 * AEO lint for the built site.
 *
 *   node scripts/aeo-lint.mjs [distDir]      (default: dist)
 *
 * Fails (exit 1) on errors and writes a readable report to
 * docs/seo/aeo-lint-report.md. Checks:
 *   1. FAQ JSON-LD text equals the visible FAQ text
 *   2. NAP: name, address, phone and email identical on every page and in schema
 *   3. Every FAQ question is followed by a paragraph of 15 to 60 words whose
 *      first sentence is 15 to 35 words, and the answer names "Brihadhee"
 *   4. No pending fact is rendered (probes from src/data/facts.js)
 *   5. No phrase from docs/seo/avoid-terms.txt
 *   6. No "best", "No.1" or "top-rated" claim without a data-claim-source annotation
 *   7. Every image has non-empty, non-repeating alt text (lightbox image and
 *      repeated brand logos exempt)
 *   8. Canonical, og:url, og:image, sitemap and schema URLs share one origin
 *   9. Catering is absent from the build and the sitemap while offer_catering is false
 *  10. JSON-LD parses and has no empty values
 *  11. Pages are complete without JavaScript (one H1, menu items present in the HTML)
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");
const dist = resolve(process.argv[2] ?? join(ROOT, "dist"));
const REPORT = join(ROOT, "docs", "seo", "aeo-lint-report.md");

const { FACTS, pendingFacts } = await import(pathToFileURL(join(ROOT, "src", "data", "facts.js")).href);
const cfg = JSON.parse(readFileSync(join(ROOT, "config", "client-verification.json"), "utf8"));
const menu = JSON.parse(readFileSync(join(ROOT, "src", "data", "menu.json"), "utf8"));

if (!existsSync(dist)) {
  console.error(`✖ ${dist} not found. Run \`npm run build\` first.`);
  process.exit(2);
}

/* ---- Helpers ---------------------------------------------------------- */
const errors = [];
const warnings = [];
const checks = new Map(); // id -> { title, errors: n }
const CHECKS = {
  faq_equal: "FAQ JSON-LD equals visible FAQ",
  nap: "NAP identical everywhere",
  answer_first: "Answer-first structure (15 to 35 / 15 to 60 words, names Brihadhee)",
  pending: "No pending fact rendered",
  avoid: "No avoid-list terms",
  superlatives: "No unsourced superlatives",
  alt: "Image alt text present and unique",
  origin: "One production origin for all URLs",
  catering_gate: "Catering gated while unconfirmed",
  jsonld: "JSON-LD parses, no empty values",
  no_js: "Complete without JavaScript",
};
for (const [id, title] of Object.entries(CHECKS)) checks.set(id, { title, errors: 0 });
const err = (id, page, msg) => {
  errors.push({ id, page, msg });
  checks.get(id).errors++;
};
const warn = (page, msg) => warnings.push({ page, msg });

function* walk(p) {
  if (statSync(p).isFile()) return yield p;
  for (const e of readdirSync(p)) yield* walk(join(p, e));
}
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
const norm = (s) => decode(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const firstSentence = (s) => s.trim().split(/(?<=[.!?])\s+/)[0];
const digits = (s) => String(s).replace(/\D/g, "");

function visibleText(html) {
  return norm(
    html
      .replace(/<head[\s\S]*?<\/head>/i, " ")
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  );
}
function headText(html) {
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? "";
  const title = head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const desc = head.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? "";
  return norm(`${title} ${desc}`);
}

/* ---- Avoid terms ------------------------------------------------------ */
const avoidFile = join(ROOT, "docs", "seo", "avoid-terms.txt");
const avoid = existsSync(avoidFile)
  ? readFileSync(avoidFile, "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"))
      .map((l) => ({ src: l, re: new RegExp(l, "gi") }))
  : [];
if (!avoid.length) warn("-", "docs/seo/avoid-terms.txt missing or empty");

/* ---- Load pages -------------------------------------------------------- */
const pages = [];
for (const file of walk(dist)) {
  const rel = "/" + relative(dist, file).replace(/\\/g, "/");
  if (/\.html?$/i.test(file)) {
    const html = readFileSync(file, "utf8");
    const name = rel.replace(/index\.html$/, "");
    const nodes = [];
    for (const [i, b] of [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].entries()) {
      try {
        nodes.push(...[].concat(JSON.parse(b[1])));
      } catch (e) {
        err("jsonld", name, `JSON-LD block ${i + 1} is not valid JSON: ${e.message}`);
      }
    }
    pages.push({ name, html, nodes, text: visibleText(html), head: headText(html) });
  }
}
const sitemapPath = join(dist, "sitemap.xml");
const sitemap = existsSync(sitemapPath) ? readFileSync(sitemapPath, "utf8") : "";
const llmsPath = join(dist, "llms.txt");
const llms = existsSync(llmsPath) ? readFileSync(llmsPath, "utf8") : "";
if (!pages.length) {
  console.error("✖ no HTML pages found in dist");
  process.exit(2);
}

const typeOf = (n) => [].concat(n["@type"] ?? []);

/* ---- Per-page checks --------------------------------------------------- */
const F = (k) => FACTS[k].value;
const addr = F("address");
const expectedAddress = `${addr.line1}, ${addr.line2}, ${addr.city}, ${addr.state} ${addr.postalCode}`;
const phoneDigits = digits(F("phone"));
// When catering is confirmed with its own numbers, those are allowed too.
const ch = cfg.enquiry_channels ?? {};
const allowedPhones = [phoneDigits, digits(F("whatsapp"))].map((d) => d.slice(-10));
if (cfg.offer_catering === true) {
  for (const n of [ch.phone, ch.whatsapp]) if (n) allowedPhones.push(digits(n).slice(-10));
}
const phoneOk = (raw) => allowedPhones.includes(digits(raw).slice(-10));
const pending = pendingFacts();

for (const p of pages) {
  const { name, html, nodes, text, head } = p;

  /* 1 + 3: FAQ */
  const faqNode = nodes.find((n) => typeOf(n).includes("FAQPage"));
  const visible = [];
  for (const m of html.matchAll(/<details class="faq__item"[^>]*>\s*<summary>\s*<h3[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<\/summary>\s*<p class="faq__answer"[^>]*>([\s\S]*?)<\/p>/g)) {
    visible.push({ q: norm(m[1]), a: norm(m[2]) });
  }
  if (faqNode) {
    const schemaItems = (faqNode.mainEntity ?? []).map((e) => ({ q: norm(e.name ?? ""), a: norm(e.acceptedAnswer?.text ?? "") }));
    if (schemaItems.length !== visible.length) {
      err("faq_equal", name, `FAQ has ${schemaItems.length} items in JSON-LD but ${visible.length} visible`);
    }
    schemaItems.forEach((s, i) => {
      const v = visible[i];
      if (!v) return;
      if (s.q !== v.q) err("faq_equal", name, `question ${i + 1} differs: schema "${s.q}" vs page "${v.q}"`);
      if (s.a !== v.a) err("faq_equal", name, `answer ${i + 1} differs for "${s.q}"`);
    });
  } else if (visible.length) {
    err("faq_equal", name, "FAQ visible on the page but no FAQPage JSON-LD");
  }
  for (const v of visible) {
    const w = words(v.a);
    const fs = firstSentence(v.a);
    const fw = words(fs);
    if (w < 15 || w > 60) err("answer_first", name, `answer is ${w} words (needs 15 to 60): "${v.q}"`);
    if (fw < 15 || fw > 35) err("answer_first", name, `first sentence is ${fw} words (needs 15 to 35): "${v.q}"`);
    if (!/Brihadhee/.test(v.a)) err("answer_first", name, `answer does not name Brihadhee: "${v.q}"`);
    if (!/Brihadhee|பிரிஹதீ/.test(fs)) err("answer_first", name, `first sentence does not name the entity: "${v.q}"`);
  }
  // other question headings outside the FAQ accordion
  const outside = html.replace(/<details class="faq__item"[\s\S]*?<\/details>/g, "");
  for (const m of outside.matchAll(/<h([2-4])[^>]*>([^<]*[?？])<\/h\1>\s*<p[^>]*>([\s\S]*?)<\/p>/g)) {
    const w = words(norm(m[3]));
    if (w < 15 || w > 60 || !/Brihadhee/.test(m[3])) {
      err("answer_first", name, `question heading "${norm(m[2])}" is followed by a ${w}-word paragraph (needs 15 to 60 words naming Brihadhee)`);
    }
  }

  /* 2: NAP */
  const rest = nodes.find((n) => typeOf(n).includes("Restaurant"));
  if (rest) {
    if (rest.name !== F("name")) err("nap", name, `schema name "${rest.name}" != "${F("name")}"`);
    if (digits(rest.telephone) !== phoneDigits) err("nap", name, `schema telephone ${rest.telephone} != ${F("phone")}`);
    if (rest.email !== F("email")) err("nap", name, `schema email ${rest.email} != ${F("email")}`);
    const a = rest.address ?? {};
    const schemaAddr = `${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode}`;
    if (schemaAddr !== expectedAddress) err("nap", name, `schema address "${schemaAddr}" != "${expectedAddress}"`);
  } else {
    err("nap", name, "no Restaurant node in JSON-LD");
  }
  for (const m of text.matchAll(/(?:\+?\s?91[\s-]?)?\b\d{5}[\s-]?\d{5}\b/g)) {
    if (!phoneOk(m[0])) err("nap", name, `unexpected phone number on the page: "${m[0].trim()}"`);
  }
  for (const m of html.matchAll(/href="(?:tel:|https:\/\/wa\.me\/)([^"]+)"/g)) {
    if (!phoneOk(m[1])) err("nap", name, `tel/WhatsApp link ${m[1]} is not a confirmed number`);
  }
  for (const m of html.matchAll(/mailto:([^"?]+)/g)) {
    if (m[1] !== F("email")) err("nap", name, `mailto ${m[1]} != ${F("email")}`);
  }
  for (const m of text.matchAll(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g)) {
    if (m[0].replace(/[.]+$/, "") !== F("email")) err("nap", name, `unexpected email on the page: ${m[0]}`);
  }
  for (const m of text.matchAll(/W-41/g)) {
    const around = text.slice(Math.max(0, m.index - 4), m.index + 22);
    if (!/New W-41 \(Old W-124\)/.test(around)) err("nap", name, `address line written differently: "...${around}..."`);
  }
  if (/\b6000\d\d\b/.test(text) && !text.includes(addr.postalCode)) err("nap", name, "postal code differs from 600040");
  for (const m of text.matchAll(/\b6\d{5}\b/g)) {
    if (m[0] !== addr.postalCode) err("nap", name, `unexpected postal code ${m[0]}`);
  }

  /* 4: pending facts */
  for (const f of pending) {
    for (const probe of f.probes) {
      const hit = (text + " " + head).match(probe);
      if (hit) err("pending", name, `pending fact "${f.key}" appears on the page: "${hit[0]}"`);
    }
  }

  /* 5: avoid terms */
  for (const a of avoid) {
    a.re.lastIndex = 0;
    const hit = (text + " " + head).match(a.re);
    if (hit) err("avoid", name, `avoid-list term "${hit[0]}" (rule: ${a.src})`);
  }

  /* 6: superlatives (elements carrying data-claim-source are exempt) */
  const unsourced = html
    .replace(/<([a-z0-9]+)\b[^>]*data-claim-source[^>]*>[\s\S]*?<\/\1>/gi, " ");
  const claimText = visibleText(unsourced) + " " + head;
  for (const m of claimText.matchAll(/\b(best|no\.?\s?1|number\s+one|top[- ]rated|finest|greatest)\b|#1\b/gi)) {
    err("superlatives", name, `superlative "${m[0]}" without a data-claim-source annotation`);
  }

  /* 7: alt text */
  const seenAlt = new Map();
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    const alt = tag.match(/\balt="([^"]*)"/)?.[1];
    const isLightbox = /id="lightbox-image"/.test(tag);
    const decorative = /aria-hidden="true"|role="presentation"/.test(tag);
    if (alt === undefined) {
      err("alt", name, `image without alt attribute: ${tag.slice(0, 80)}`);
      continue;
    }
    if (isLightbox || decorative) continue;
    if (alt.trim().length < 5) {
      err("alt", name, `empty or too short alt: ${tag.slice(0, 80)}`);
      continue;
    }
    if (/class="[^"]*brand__logo/.test(tag)) continue; // the logo repeats in header and footer
    const key = alt.trim().toLowerCase();
    if (seenAlt.has(key)) err("alt", name, `repeated alt text: "${alt}"`);
    seenAlt.set(key, true);
  }

  /* 10: JSON-LD empties */
  (function scan(node, path) {
    if (Array.isArray(node)) return node.forEach((n, i) => scan(n, `${path}[${i}]`));
    if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node)) {
        if (v === null || v === "" || (Array.isArray(v) && v.length === 0) || (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0)) {
          err("jsonld", name, `empty value at ${path}.${k}`);
        }
        scan(v, `${path}.${k}`);
      }
    }
  })(nodes, "$");
  for (const n of nodes) if (!typeOf(n).length) err("jsonld", name, "node without @type");

  /* 11: complete without JavaScript */
  const h1s = (html.match(/<h1\b/g) ?? []).length;
  if (h1s !== 1) err("no_js", name, `expected exactly one H1 in the static HTML, found ${h1s}`);
  if (name === "/menu/") {
    const total = menu.categories.reduce((n, c) => n + c.items.length, 0);
    const got = (html.match(/class="menu-page__item"/g) ?? []).length;
    if (got !== total) err("no_js", name, `menu page lists ${got} items in HTML but menu.json has ${total}`);
    for (const c of menu.categories) {
      if (!html.includes(`id="${c.id}"`)) err("no_js", name, `menu category section "${c.id}" missing from the HTML`);
    }
  }
  if (name === "/") {
    const total = menu.categories.reduce((n, c) => n + c.items.length, 0);
    const got = (html.match(/class="dish"/g) ?? []).length;
    if (got !== total) err("no_js", name, `home menu has ${got} dishes in HTML but menu.json has ${total}`);
  }
}

/* ---- 8: one production origin ----------------------------------------- */
const home = pages.find((p) => p.name === "/");
const originOf = (u) => {
  try {
    return new URL(u).origin;
  } catch {
    return null;
  }
};
const prodOrigin = originOf(home?.html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "");
if (!prodOrigin) err("origin", "/", "home page has no valid canonical URL");
else {
  for (const p of pages) {
    const grab = (re) => p.html.match(re)?.[1];
    const urls = {
      canonical: grab(/<link rel="canonical" href="([^"]+)"/),
      "og:url": grab(/<meta property="og:url" content="([^"]+)"/),
      "og:image": grab(/<meta property="og:image" content="([^"]+)"/),
      "twitter:image": grab(/<meta name="twitter:image" content="([^"]+)"/),
    };
    for (const [k, u] of Object.entries(urls)) {
      if (!u) err("origin", p.name, `missing ${k}`);
      else if (originOf(u) !== prodOrigin) err("origin", p.name, `${k} origin ${originOf(u)} != ${prodOrigin}`);
    }
    if (urls.canonical && urls["og:url"] && urls.canonical !== urls["og:url"]) {
      err("origin", p.name, "canonical and og:url differ");
    }
    for (const n of p.nodes) {
      for (const key of ["@id", "url"]) {
        if (typeof n[key] === "string" && originOf(n[key]) !== prodOrigin) err("origin", p.name, `schema ${typeOf(n)[0]}.${key} origin differs: ${n[key]}`);
      }
      for (const img of [].concat(n.image ?? [])) {
        if (typeof img === "string" && originOf(img) !== prodOrigin) err("origin", p.name, `schema image origin differs: ${img}`);
      }
    }
  }
  for (const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (originOf(m[1]) !== prodOrigin) err("origin", "sitemap.xml", `loc origin differs: ${m[1]}`);
  }
  if (!sitemap) err("origin", "sitemap.xml", "sitemap.xml missing from the build");
}

/* ---- 9: catering gate --------------------------------------------------- */
if (cfg.offer_catering !== true) {
  if (pages.some((p) => p.name.startsWith("/catering"))) err("catering_gate", "/catering/", "catering page was built while offer_catering is not true");
  if (/\/catering/i.test(sitemap)) err("catering_gate", "sitemap.xml", "sitemap lists a catering URL while gated");
  if (/catering/i.test(llms)) err("catering_gate", "llms.txt", "llms.txt mentions catering while gated");
  for (const p of pages) {
    if (/href="[^"]*\/catering/i.test(p.html)) err("catering_gate", p.name, "page links to /catering while gated");
    if (/\bcatering\b/i.test(p.text)) err("catering_gate", p.name, "page text mentions catering while gated");
  }
}
// llms.txt also obeys the avoid list and the pending-fact probes
for (const a of avoid) {
  a.re.lastIndex = 0;
  const hit = llms.match(a.re);
  if (hit) err("avoid", "llms.txt", `avoid-list term "${hit[0]}"`);
}
for (const f of pending) {
  for (const probe of f.probes) {
    const hit = llms.match(probe);
    if (hit) err("pending", "llms.txt", `pending fact "${f.key}" appears: "${hit[0]}"`);
  }
}

/* ---- Report ------------------------------------------------------------ */
const today = new Date().toISOString().slice(0, 10);
const lines = [];
lines.push("# AEO lint report", "");
lines.push(`Generated by \`scripts/aeo-lint.mjs\` on ${today}. Pages checked: ${pages.map((p) => `\`${p.name}\``).join(", ")}, plus \`sitemap.xml\` and \`llms.txt\`.`, "");
lines.push(`**Result: ${errors.length ? `FAILED, ${errors.length} error(s)` : "PASSED"}**`, "");
lines.push("| Check | Result |", "|---|---|");
for (const [, c] of checks) lines.push(`| ${c.title} | ${c.errors ? `FAIL (${c.errors})` : "pass"} |`);
lines.push("");
lines.push("## Pending facts (not allowed on any page)", "");
lines.push("| Fact | Client must confirm |", "|---|---|");
for (const f of pending) lines.push(`| \`${f.key}\` | ${f.needs} |`);
lines.push("");
if (errors.length) {
  lines.push("## Errors", "");
  for (const e of errors) lines.push(`- [${e.id}] \`${e.page}\`: ${e.msg}`);
  lines.push("");
}
if (warnings.length) {
  lines.push("## Warnings", "");
  for (const w of warnings) lines.push(`- \`${w.page}\`: ${w.msg}`);
  lines.push("");
}
writeFileSync(REPORT, lines.join("\n"));

for (const w of warnings) console.warn(`⚠ ${w.page}: ${w.msg}`);
if (errors.length) {
  console.error(`✖ AEO lint failed: ${errors.length} problem(s). Report: ${relative(ROOT, REPORT)}\n`);
  for (const e of errors) console.error(`  [${e.id}] ${e.page}: ${e.msg}`);
  process.exit(1);
}
console.log(`✔ AEO lint passed (${pages.length} page(s)). Report: ${relative(ROOT, REPORT)}`);
