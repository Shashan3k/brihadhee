#!/usr/bin/env node
/**
 * check:seo (page-level rules). Run after astro build; validate-schema.js and
 * aeo-lint.mjs cover JSON-LD, FAQ text, NAP and answer format.
 *
 *   node scripts/check-seo.mjs [distDir]      (default: dist)
 *
 * Errors (exit 1):
 *  - missing or duplicate <title> / meta description
 *  - missing <html lang>, not exactly one <h1>
 *  - missing canonical, or canonical not on the production origin
 *  - an indexable page missing from the sitemap, or a noindex page in it
 *  - a sitemap URL with no built page
 *  - orphan page: in the sitemap but linked from no other page
 *  - robots.txt without a Sitemap line, or pointing to a missing file
 *  - hreflang alternates that are not reciprocal
 *  - title longer than 60 characters or meta description longer than 155
 *    (on-page blueprint, 2026-11-11)
 * Warnings: title shorter than 30 characters, description shorter than 70.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");
const dist = resolve(process.argv[2] ?? join(ROOT, "dist"));
// GitHub Pages (base "/brihadhee") was turned off on 2026-11-11; every build uses the root.
const BASE = "";
const { SITE_ORIGIN } = await import(pathToFileURL(join(ROOT, "src", "data", "entity-truth.ts")).href);
const SKIP = new Set(["404.html"]); // not indexable by design

const errors = [];
const warnings = [];
const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const len = (s) => [...s].length;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}
/** dist file -> site path ("/menu/"). */
function pathOf(file) {
  const rel = relative(dist, file).replaceAll("\\", "/");
  if (rel === "index.html") return "/";
  return rel.endsWith("/index.html") ? `/${rel.slice(0, -"index.html".length)}` : `/${rel}`;
}
/** href (absolute, root-relative or with base) -> site path without base, hash or query; null if external. */
function sitePath(href, fromPath) {
  if (/^(mailto:|tel:|javascript:|data:|#)/i.test(href)) return null;
  let url;
  try {
    url = new URL(href, `${SITE_ORIGIN}${BASE}${fromPath}`);
  } catch {
    return null;
  }
  if (url.origin !== SITE_ORIGIN) return null;
  let p = url.pathname;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length) || "/";
  return p;
}

const pages = walk(dist)
  .filter((f) => !SKIP.has(relative(dist, f).replaceAll("\\", "/")))
  .map((file) => {
    const html = readFileSync(file, "utf8");
    const path = pathOf(file);
    const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "");
    const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim() ?? "");
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";
    const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";
    const lang = html.match(/<html[^>]*\blang="([^"]+)"/)?.[1] ?? "";
    const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
    const links = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((m) => sitePath(decode(m[1]), path)).filter(Boolean);
    const hreflang = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({
      lang: m[1],
      href: m[2],
    }));
    const keywordsTag = /<meta name="keywords"/i.test(html);
    const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1] ?? "";
    return { file, path, title, desc, canonical, noindex: /noindex/i.test(robots), lang, h1, links, hreflang, keywordsTag, ogUrl };
  });

/* ---- Per page --------------------------------------------------------- */
for (const p of pages) {
  const at = p.path;
  if (!p.title) errors.push(`${at}: missing <title>`);
  else if (len(p.title) > 60) errors.push(`${at}: title is ${len(p.title)} chars (max 60): "${p.title}"`);
  else if (len(p.title) < 30) warnings.push(`${at}: title is ${len(p.title)} chars (aim 30–60)`);
  if (!p.desc) errors.push(`${at}: missing meta description`);
  else if (len(p.desc) > 155) errors.push(`${at}: description is ${len(p.desc)} chars (max 155): "${p.desc}"`);
  else if (len(p.desc) < 70) warnings.push(`${at}: description is ${len(p.desc)} chars (aim 70–155)`);
  if (!p.lang) errors.push(`${at}: <html> has no lang attribute`);
  if (p.h1 !== 1) errors.push(`${at}: ${p.h1} <h1> elements (need exactly 1)`);
  if (p.keywordsTag) errors.push(`${at}: has a <meta name="keywords"> tag (ignored by Google, reads as stuffing)`);
  if (p.ogUrl && p.canonical && p.ogUrl !== p.canonical) errors.push(`${at}: og:url ${p.ogUrl} does not match canonical ${p.canonical}`);
  if (!p.noindex) {
    if (!p.canonical) errors.push(`${at}: missing canonical`);
    else if (p.canonical !== `${SITE_ORIGIN}${p.path}`)
      errors.push(`${at}: canonical is ${p.canonical}, expected ${SITE_ORIGIN}${p.path}`);
  }
}
for (const field of ["title", "desc"]) {
  const seen = new Map();
  for (const p of pages.filter((x) => !x.noindex && x[field])) {
    if (seen.has(p[field])) errors.push(`${p.path}: duplicate ${field === "desc" ? "description" : "title"} (also on ${seen.get(p[field])})`);
    else seen.set(p[field], p.path);
  }
}

/* ---- Sitemap ---------------------------------------------------------- */
const sitemapFile = join(dist, "sitemap.xml");
const sitemap = existsSync(sitemapFile)
  ? [...readFileSync(sitemapFile, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  : (errors.push("sitemap.xml missing"), []);
const inSitemap = new Set(sitemap.map((u) => (u.startsWith(SITE_ORIGIN) ? u.slice(SITE_ORIGIN.length) : u)));
const byPath = new Map(pages.map((p) => [p.path, p]));
for (const path of inSitemap) {
  const page = byPath.get(path);
  if (!page) errors.push(`sitemap lists ${path} but no page was built`);
  else if (page.noindex) errors.push(`sitemap lists noindex page ${path}`);
}
for (const p of pages) if (!p.noindex && !inSitemap.has(p.path)) errors.push(`${p.path}: indexable page missing from sitemap`);

const index = join(dist, "sitemap-index.xml");
if (!existsSync(index)) errors.push("sitemap-index.xml missing");
else if (!readFileSync(index, "utf8").includes(`${SITE_ORIGIN}/sitemap.xml`)) errors.push("sitemap-index.xml does not list sitemap.xml");

/* ---- robots.txt ------------------------------------------------------- */
const robotsFile = join(dist, "robots.txt");
if (!existsSync(robotsFile)) errors.push("robots.txt missing");
else {
  const robots = readFileSync(robotsFile, "utf8");
  const sm = robots.match(/^Sitemap:\s*(\S+)/m)?.[1];
  if (!sm) errors.push("robots.txt has no Sitemap line");
  else if (!existsSync(join(dist, new URL(sm).pathname.slice(1)))) errors.push(`robots.txt Sitemap ${sm} not built`);
  if (/^Disallow:\s*\/\s*$/m.test(robots)) errors.push("robots.txt disallows the whole site");
}

/* ---- Orphans ---------------------------------------------------------- */
const linkedFrom = new Map();
for (const p of pages) for (const l of p.links) if (l !== p.path) linkedFrom.set(l, (linkedFrom.get(l) ?? 0) + 1);
for (const path of inSitemap) if (path !== "/" && !linkedFrom.get(path)) errors.push(`${path}: orphan (no internal link from another page)`);

/* ---- hreflang reciprocity -------------------------------------------- */
for (const p of pages) {
  for (const alt of p.hreflang) {
    const target = byPath.get(sitePath(alt.href, p.path) ?? "");
    if (!target) errors.push(`${p.path}: hreflang ${alt.lang} points to missing page ${alt.href}`);
    else if (!target.hreflang.some((a) => sitePath(a.href, target.path) === p.path))
      errors.push(`${p.path}: hreflang ${alt.lang} -> ${target.path} is not reciprocal`);
  }
}

for (const w of warnings) console.warn(`  ⚠ ${w}`);
if (errors.length) {
  console.error(`✖ check:seo failed (${errors.length} problem(s)):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✔ check:seo passed (${pages.length} page(s), ${inSitemap.size} in sitemap, ${warnings.length} warning(s))`);
