#!/usr/bin/env node
/**
 * check:facts. Fails (exit 1) if any public output carries a placeholder or a
 * pending (unverified) fact.
 *
 *   node scripts/check-facts.mjs [distDir]      (default: dist)
 *
 * Scans every built file a visitor, crawler or AI agent can read: HTML, llms
 * files, robots.txt, sitemaps and menu.json.
 *  1. Placeholder text: TODO, TBD, "undefined", "NaN", "[object Object]",
 *     and a bare "null" shown as page text.
 *  2. Probes of every UNVERIFIED fact in src/data/entity-truth.ts (for example
 *     "500 varieties", "parking", the old WhatsApp number, "late night").
 *  2b. RETIRED_TERMS from entity-truth.ts: positioning the client ruled out
 *     (breakfast, tiffin, Mini Tiffin, "500 varieties", cheap/budget). The one
 *     exception is the exact question NEGATIVE_FAQ_QUESTION (config/seo-gates.ts),
 *     "Does Brihadhee serve breakfast?", answered "No ..." on /faq/.
 *  3. JSON files: no null or placeholder values, except fields listed in
 *     ALLOWED_NULL (an unpriced dish has price null on purpose).
 *
 * The first guard is in entity-truth.ts itself: getFact() throws on an
 * unverified fact, so `astro build` fails before this script even runs.
 * This script catches values that slip in another way (hand-typed copy).
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative, extname } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");
const dist = resolve(process.argv[2] ?? join(ROOT, "dist"));
if (!existsSync(dist)) {
  console.error(`✖ check:facts: ${dist} not found. Run astro build first.`);
  process.exit(1);
}
const { pendingFacts, RETIRED_TERMS } = await import(pathToFileURL(join(ROOT, "src", "data", "entity-truth.ts")).href);
const { stripPermittedNegatives } = await import(pathToFileURL(join(ROOT, "config", "seo-gates.ts")).href);

const SCAN = new Set([".html", ".txt", ".xml", ".json", ".webmanifest"]);
const PLACEHOLDERS = [
  { re: /\bTODO\b/, label: "TODO placeholder" },
  { re: /\bTBD\b/, label: "TBD placeholder" },
  { re: /\bundefined\b/, label: '"undefined" rendered' },
  { re: /\bNaN\b/, label: '"NaN" rendered' },
  { re: /\[object Object\]/, label: '"[object Object]" rendered' },
];
// JSON paths (dot form, array indexes as *) that may legitimately be null.
const ALLOWED_NULL = new Set(["signaturesWithoutPrice.*.price"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (SCAN.has(extname(name))) out.push(p);
  }
  return out;
}

/** Visible text of an HTML page plus JSON-LD and meta content (where facts also live). */
function htmlText(html) {
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const meta = [...html.matchAll(/<meta[^>]+content="([^"]*)"/g)].map((m) => m[1]);
  const body = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
  return { body, extra: [...ld, ...meta].join("\n") };
}

function jsonNulls(value, path = [], out = []) {
  if (value === null) {
    const key = path.map((p) => (typeof p === "number" ? "*" : p)).join(".");
    if (!ALLOWED_NULL.has(key)) out.push(path.join("."));
  } else if (Array.isArray(value)) value.forEach((v, i) => jsonNulls(v, [...path, i], out));
  else if (typeof value === "object") for (const [k, v] of Object.entries(value)) jsonNulls(v, [...path, k], out);
  return out;
}

const errors = [];
const pending = pendingFacts();
const files = walk(dist);

for (const file of files) {
  const rel = relative(dist, file).replaceAll("\\", "/");
  const raw = readFileSync(file, "utf8");
  let text = raw;
  if (file.endsWith(".html")) {
    const { body, extra } = htmlText(raw);
    text = `${body}\n${extra}`;
    if (/(?:^|\s)null(?:\s|$)/.test(body)) errors.push(`${rel}: bare "null" shown as page text`);
  }
  if (file.endsWith(".json") || file.endsWith(".webmanifest")) {
    try {
      for (const p of jsonNulls(JSON.parse(raw))) errors.push(`${rel}: null value at ${p}`);
    } catch (e) {
      errors.push(`${rel}: invalid JSON (${e.message})`);
    }
  }
  for (const { re, label } of PLACEHOLDERS) if (re.test(text)) errors.push(`${rel}: ${label}`);
  const retiredScan = stripPermittedNegatives(text); // drops only the exact FAQ question on /faq/
  for (const { re, why } of RETIRED_TERMS) {
    const m = retiredScan.match(re);
    if (m) errors.push(`${rel}: retired positioning "${m[0]}" appears (${why}; client direction 2026-11-11)`);
  }
  for (const f of pending) {
    for (const probe of f.probes) {
      const m = text.match(probe);
      if (m) errors.push(`${rel}: pending fact "${f.key}" appears ("${m[0]}"). Owner must confirm: ${f.needs}`);
    }
  }
}

if (errors.length) {
  console.error(`✖ check:facts failed (${errors.length} problem(s) in ${files.length} file(s)):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✔ check:facts passed (${files.length} file(s), ${pending.length} pending fact(s) guarded)`);
