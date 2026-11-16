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
 *   3. Visible FAQ answers use the source fact/explain limits and name the entity
 *   4. No pending fact is rendered (probes from src/data/entity-truth.ts)
 *   5. No phrase from docs/seo/avoid-terms.txt, with one exception (the exact
 *      question NEGATIVE_FAQ_QUESTION in config/seo-gates.ts), on any
 *      surface: visible text, <title>, every meta tag, alt/title/aria-label
 *      attributes, link and image URLs, JSON-LD, and every text output
 *      (llms.txt, llms-full.txt, menu.json, sitemaps, robots.txt, manifest)
 *   6. No "best", "No.1" or "top-rated" claim without a data-claim-source annotation
 *   7. Every image has non-empty, non-repeating alt text (lightbox image and
 *      repeated brand logos exempt)
 *   8. Canonical, og:url, og:image, sitemap and schema URLs share one origin
 *   9. Catering is absent from the build and the sitemap while offer_catering is false
 *  10. JSON-LD parses and has no empty values
 *  11. Pages are complete without JavaScript (one H1, menu items present in the HTML)
 *  12. One Q&A per route and a visible "Last updated" line for each block
 *  13. Visible business facts and density, with hidden DOM excluded
 *  14. Both UTF-8 llms reference files reflect canonical facts and built links
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { answerProblems, questionKey } from "../src/lib/answers.js";
import { addressLine, BYO_DEFINITION, canonicalAnswerLines, cateringContacts, FACTS, getFact, pendingFacts, SITE_ORIGIN } from "../src/data/entity-truth.ts";
import { MENU } from "../src/data/menu-canonical.ts";
import { stripPermittedNegatives, EMIT_FAQPAGE } from "../config/seo-gates.ts";
import { decodeHtml as decode, llmsProblems, normalizeText, pageCopyProblems, readPageCopy } from "./aeo-rules.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const dist = resolve(process.argv[2] ?? join(ROOT, "dist"));
const REPORT = join(ROOT, "docs", "seo", "aeo-lint-report.md");

const cfg = JSON.parse(readFileSync(join(ROOT, "config", "client-verification.json"), "utf8"));
const menu = { categories: MENU };

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
  answer_first: "Direct FAQ answers (factual 5–30 words first, 55 words total)",
  pending: "No pending fact rendered",
  avoid: "No avoid-list terms",
  superlatives: "No unsourced superlatives",
  alt: "Image alt text present and unique",
  origin: "One production origin for all URLs",
  catering_gate: "Catering gated while unconfirmed",
  jsonld: "JSON-LD parses, no empty values",
  no_js: "Complete without JavaScript",
  faq_route: "One Q&A per route, Last updated shown",
  facts: "Rendered business facts are consistent",
  density: "At most one visible address and two exact dietary descriptors per language",
  llms: "UTF-8 reference files use canonical answers and link to built content",
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
const norm = (s) => normalizeText(decode(s).replace(/<[^>]+>/g, ""));
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
/** Percent-decode URL-encoded runs (Tamil or spaces in a link) without throwing. */
const urlDecode = (s) =>
  s.replace(/(?:%[0-9a-f]{2})+/gi, (run) => {
    try {
      return decodeURIComponent(run);
    } catch {
      return run;
    }
  });
/**
 * Everything a person, crawler or AI agent can read on a page, for the
 * zero-exception avoid list: the visible text (tags removed, so a phrase split
 * across tags still matches) plus the raw markup with only executable
 * <script> and <style> blocks dropped. The markup carries the <title>, every
 * meta tag, alt/title/aria-label attributes, link and image URLs, and JSON-LD.
 */
function surfaceText(html, text) {
  const markup = html
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<script\b(?![^>]*type="application\/(?:ld\+)?json")[^>]*>[\s\S]*?<\/script>/gi, " ");
  return `${text}\n${urlDecode(decode(markup))}`;
}
/** Built text files other than HTML that crawlers and AI agents fetch. */
const TEXT_OUTPUT = /\.(?:txt|json|xml|webmanifest)$/i;

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

/* ---- Load pages and text outputs ---------------------------------------- */
const pages = [];
const outputs = []; // llms.txt, llms-full.txt, menu.json, sitemaps, robots.txt, manifest
for (const file of walk(dist)) {
  const rel = "/" + relative(dist, file).replace(/\\/g, "/");
  if (/\.html?$/i.test(file)) {
    const html = readFileSync(file, "utf8");
    const name = rel.replace(/index\.html$/, "");
    const nodes = [];
    for (const [i, b] of [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].entries()) {
      try {
        const parsed = JSON.parse(b[1]);
        if (parsed && parsed["@graph"]) nodes.push(...parsed["@graph"].map((n) => ({ "@context": parsed["@context"], ...n })));
        else nodes.push(...[].concat(parsed));
      } catch (e) {
        err("jsonld", name, `JSON-LD block ${i + 1} is not valid JSON: ${e.message}`);
      }
    }
    const copy = readPageCopy(html);
    pages.push({ name, html, nodes, copy, text: copy.text, head: headText(html), surface: surfaceText(html, copy.text) });
  } else if (TEXT_OUTPUT.test(file) && !rel.startsWith("/_astro/")) {
    outputs.push({ name: rel.slice(1), text: urlDecode(readFileSync(file, "utf8")) });
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
const F = getFact;
const expectedAddress = addressLine();
const phoneDigits = digits(F("phone"));
// When catering is confirmed with its own numbers, those are allowed too.
const allowedPhones = [phoneDigits, digits(F("whatsapp"))].map((d) => d.slice(-10));
for (const n of Object.values(cateringContacts())) if (n) allowedPhones.push(digits(n).slice(-10));
// The careers contact (Rakesh) on the home page, once the owner confirms the number.
if (FACTS.careersContact?.status === "verified" && FACTS.careersContact.value?.phone) {
  allowedPhones.push(digits(FACTS.careersContact.value.phone).slice(-10));
}
const phoneOk = (raw) => allowedPhones.includes(digits(raw).slice(-10));
const pending = pendingFacts();
const faqOwners = new Map(); // question -> page that shows it
function registerQuestion(page, question, location = "") {
  const key = questionKey(question);
  const owner = faqOwners.get(key);
  if (owner && owner !== page) err("faq_route", page, `${location} question also on ${owner}: "${question}"`.trim());
  faqOwners.set(key, page);
}

for (const p of pages) {
  const { name, html, nodes, copy, text, head } = p;
  for (const { rule, location, message } of pageCopyProblems(copy)) {
    err(rule, name, location ? `${location}: ${message}` : message);
  }

  /* 1 + 3: FAQ */
  const faqNode = nodes.find((n) => typeOf(n).includes("FAQPage"));
  const visible = copy.faqs;
  if (faqNode) {
    const schemaItems = (faqNode.mainEntity ?? []).map((e) => ({
      q: normalizeText(e.name ?? ""), a: normalizeText(e.acceptedAnswer?.text ?? ""),
      lang: e.inLanguage ?? "en", answerLang: e.acceptedAnswer?.inLanguage ?? "en",
    }));
    if (schemaItems.length !== visible.length) {
      err("faq_equal", name, `FAQ has ${schemaItems.length} items in JSON-LD but ${visible.length} visible`);
    }
    schemaItems.forEach((s, i) => {
      const v = visible[i];
      if (!v) return;
      if (s.q !== v.q) err("faq_equal", name, `question ${i + 1} differs: schema "${s.q}" vs page "${v.q}"`);
      if (s.a !== v.a) err("faq_equal", name, `answer ${i + 1} differs for "${s.q}"`);
      if (s.lang !== v.lang || s.answerLang !== v.answerLang || v.lang !== v.answerLang) {
        err("faq_equal", name, `rendered and schema languages must agree for "${v.q}"`);
      }
    });
  } else if (visible.length && EMIT_FAQPAGE) {
    err("faq_equal", name, "FAQ visible on the page but no FAQPage JSON-LD");
  }
  if (faqNode && !EMIT_FAQPAGE) err("faq_equal", name, "FAQPage JSON-LD present while EMIT_FAQPAGE is off");
  if (visible.length && !/Last updated:\s*[A-Z][a-z]+ \d{4}/.test(text)) err("faq_route", name, 'Q&A shown without a visible "Last updated: Month YYYY" line');
  for (const { q, a, answerLang, kind, location } of visible) {
    registerQuestion(name, q, location);
    for (const problem of answerProblems(q, a, { lang: answerLang, kind })) {
      err("answer_first", name, `${location} "${q}": ${problem}`.trim());
    }
  }
  for (const heading of copy.questionHeadings) registerQuestion(name, heading.text, heading.location);

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
  for (const m of html.matchAll(/href="(?:tel:|https:\/\/wa\.me\/)([^"?]+)/g)) {
    if (!phoneOk(m[1])) err("nap", name, `tel/WhatsApp link ${m[1]} is not a confirmed number`);
  }
  for (const m of html.matchAll(/mailto:([^"?]+)/g)) {
    if (m[1] !== F("email")) err("nap", name, `mailto ${m[1]} != ${F("email")}`);
  }
  for (const m of text.matchAll(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g)) {
    if (m[0].replace(/[.]+$/, "") !== F("email")) err("nap", name, `unexpected email on the page: ${m[0]}`);
  }

  /* 4: pending facts */
  for (const f of pending) {
    for (const probe of f.probes) {
      const hit = (text + " " + head).match(probe);
      if (hit) err("pending", name, `pending fact "${f.key}" appears on the page: "${hit[0]}"`);
    }
  }

  /* 5: avoid terms, zero exceptions: text, title, meta, attributes, URLs, JSON-LD */
  for (const a of avoid) {
    a.re.lastIndex = 0;
    const hit = stripPermittedNegatives(p.surface).match(a.re);
    if (hit) err("avoid", name, `avoid-list term "${hit[0]}" (rule: ${a.src})`);
  }

  /* 6: superlatives (elements carrying data-claim-source are exempt) */
  // Question headings are queries, not claims ("Which restaurant serves the
  // best dosa...?"), so they are exempt; answers and all other copy are not.
  const unsourced = html
    .replace(/<([a-z0-9]+)\b[^>]*data-claim-source[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<h([2-4])\b[^>]*>[^<]*\?<\/h\1>/gi, " ");
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
    if (got !== total) err("no_js", name, `menu page lists ${got} items in HTML but menu-canonical.ts has ${total}`);
    for (const c of menu.categories) {
      if (!html.includes(`id="${c.id}"`)) err("no_js", name, `menu category section "${c.id}" missing from the HTML`);
    }
  }
  if (name === "/") {
    const total = menu.categories.reduce((n, c) => n + c.items.length, 0);
    const got = (html.match(/class="dish"/g) ?? []).length;
    if (got !== total) err("no_js", name, `home menu has ${got} dishes in HTML but menu-canonical.ts has ${total}`);
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
  if (pages.some((p) => /catering/.test(p.name))) err("catering_gate", "catering pages", "a catering page was built while offer_catering is not true");
  if (/catering/i.test(sitemap)) err("catering_gate", "sitemap.xml", "sitemap lists a catering URL while gated");
  if (/catering/i.test(llms)) err("catering_gate", "llms.txt", "llms.txt mentions catering while gated");
  for (const p of pages) {
    if (/href="[^"]*catering/i.test(p.html)) err("catering_gate", p.name, "page links to a catering page while gated");
    if (/\bcatering\b/i.test(p.text)) err("catering_gate", p.name, "page text mentions catering while gated");
  }
}

/* Canonical llms answers and the destinations published beside them. */
const knownLinks = new Set();
for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const page = pages.find(({ name: path }) => url === `${SITE_ORIGIN}${path}`);
  if (!page) continue;
  if (!page.html.includes(`<link rel="canonical" href="${url}">`) || /<meta name="robots" content="noindex/i.test(page.html)) continue;
  knownLinks.add(url);
  for (const id of page.copy.ids) knownLinks.add(`${url}#${id}`);
}
for (const { name } of outputs) {
  if (name === "menu.json" || name === "llms-full.txt") knownLinks.add(`${SITE_ORIGIN}/${name}`);
}
const expectedAnswers = canonicalAnswerLines();
const requiredPaths = ["/", "/menu/", "/menu/dosa/", "/about/", "/book-a-table/"];
if (cfg.offer_catering === true) requiredPaths.push("/catering-services-chennai/");
for (const name of ["llms.txt", "llms-full.txt"]) {
  const full = name === "llms-full.txt";
  try {
    const body = new TextDecoder("utf-8", { fatal: true }).decode(readFileSync(join(dist, name)));
    const requiredLinks = [...requiredPaths, ...(full ? [] : ["/llms-full.txt"])].map((path) => SITE_ORIGIN + path);
    for (const problem of llmsProblems(body, { expectedAnswers, knownLinks, requiredLinks, full })) err("llms", name, problem);
  } catch (e) {
    err("llms", name, `cannot read UTF-8 output: ${e.message}`);
  }
}
for (const name of ["/", "/menu/", "/menu/dosa/"]) {
  const page = pages.find((p) => p.name === name);
  if (!page?.copy.text.includes(BYO_DEFINITION)) err("facts", name, "missing visible canonical Build Your Own Dosa definition");
  if (name === "/" && !page?.copy.faqs.some(({ a }) => a === BYO_DEFINITION)) {
    err("facts", name, "homepage FAQ must use the canonical Build Your Own Dosa definition");
  }
}
// Every other text output (llms.txt, llms-full.txt, menu.json, sitemaps,
// robots.txt, manifest) obeys the avoid list and the pending-fact probes too.
for (const o of outputs) {
  for (const a of avoid) {
    a.re.lastIndex = 0;
    const hit = stripPermittedNegatives(o.text).match(a.re);
    if (hit) err("avoid", o.name, `avoid-list term "${hit[0]}" (rule: ${a.src})`);
  }
  for (const f of pending) {
    for (const probe of f.probes) {
      const hit = o.text.match(probe);
      if (hit) err("pending", o.name, `pending fact "${f.key}" appears: "${hit[0]}"`);
    }
  }
}

/* ---- Report ------------------------------------------------------------ */
const today = new Date().toISOString().slice(0, 10);
const lines = [];
lines.push("# AEO lint report", "");
lines.push(`Generated by \`scripts/aeo-lint.mjs\` on ${today}. Pages checked: ${pages.map((p) => `\`${p.name}\``).join(", ")}, plus ${outputs.map((o) => `\`${o.name}\``).join(", ")}.`, "");
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
