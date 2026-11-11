#!/usr/bin/env node
/**
 * check:links. Fails (exit 1) on a broken internal link or asset.
 *
 *   node scripts/check-links.mjs [distDir]              internal links only (no network; used in build)
 *   node scripts/check-links.mjs [distDir] --external   also request every external link (warnings only)
 *
 * Internal = root-relative, relative, or absolute on the production origin.
 * Each must resolve to a built file (path, path/index.html or path.html),
 * and a #fragment must match an id on the target page.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const external = args.includes("--external");
const dist = resolve(args.find((a) => !a.startsWith("--")) ?? join(ROOT, "dist"));
// GitHub Pages (base "/brihadhee") was turned off on 2026-11-11; every build uses the root.
const BASE = "";
const { SITE_ORIGIN } = await import(pathToFileURL(join(ROOT, "src", "data", "entity-truth.ts")).href);

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}
function pathOf(file) {
  const rel = relative(dist, file).replaceAll("\\", "/");
  if (rel === "index.html") return "/";
  return rel.endsWith("/index.html") ? `/${rel.slice(0, -"index.html".length)}` : `/${rel}`;
}
function fileFor(path) {
  const clean = decodeURIComponent(path).replace(/^\//, "");
  for (const c of [clean, join(clean, "index.html"), `${clean.replace(/\/$/, "")}.html`]) {
    const f = join(dist, c);
    if (existsSync(f) && statSync(f).isFile()) return f;
  }
  return null;
}
const idCache = new Map();
function ids(file) {
  if (!idCache.has(file)) idCache.set(file, new Set([...readFileSync(file, "utf8").matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])));
  return idCache.get(file);
}

const errors = [];
const externals = new Map();
const pages = walk(dist);
let checked = 0;

for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const from = pathOf(file);
  const refs = [...html.matchAll(/<(?:a|link|img|script|source|iframe)\b[^>]*?\b(?:href|src)="([^"]+)"/g)].map((m) => decode(m[1]));
  const srcsets = [...html.matchAll(/\bsrcset="([^"]+)"/g)].flatMap((m) => m[1].split(",").map((s) => s.trim().split(/\s+/)[0]));
  for (const ref of [...refs, ...srcsets]) {
    if (!ref || /^(mailto:|tel:|javascript:|data:)/i.test(ref)) continue;
    let url;
    try {
      url = new URL(ref, `${SITE_ORIGIN}${BASE}${from}`);
    } catch {
      errors.push(`${from}: unparsable link "${ref}"`);
      continue;
    }
    if (url.origin !== SITE_ORIGIN) {
      if (/^https?:$/.test(url.protocol)) {
        if (!externals.has(url.href)) externals.set(url.href, from);
      }
      continue;
    }
    checked++;
    let p = url.pathname;
    // Absolute links on the production origin (canonical, og:url) never carry the
    // GitHub Pages base; only root-relative and relative links must.
    const absolute = /^https?:\/\//i.test(ref);
    if (BASE && absolute) {
      if (p.startsWith(BASE)) p = p.slice(BASE.length) || "/";
    } else if (BASE) {
      if (!p.startsWith(BASE)) {
        errors.push(`${from}: link "${ref}" is missing the ${BASE} base path`);
        continue;
      }
      p = p.slice(BASE.length) || "/";
    }
    const target = fileFor(p);
    if (!target) {
      errors.push(`${from}: broken link "${ref}"`);
      continue;
    }
    const frag = url.hash.slice(1);
    if (frag && frag !== "top" && target.endsWith(".html") && !ids(target).has(decodeURIComponent(frag)))
      errors.push(`${from}: "${ref}" points to missing #${frag}`);
  }
}

if (external) {
  for (const [href, from] of externals) {
    try {
      const res = await fetch(href, { method: "GET", redirect: "manual", signal: AbortSignal.timeout(10000) });
      if (res.status >= 400) console.warn(`  ⚠ ${from}: ${href} returned HTTP ${res.status}`);
    } catch (e) {
      console.warn(`  ⚠ ${from}: ${href} failed (${e.name})`);
    }
  }
}

if (errors.length) {
  console.error(`✖ check:links failed (${errors.length} broken):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `✔ check:links passed (${checked} internal link(s) on ${pages.length} page(s); ${externals.size} external${external ? " checked" : " not fetched (use --external)"})`
);
