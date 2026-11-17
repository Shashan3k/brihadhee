/**
 * check:functions: every Vercel Function in api/ must load on Vercel.
 *
 * Vercel's Node builder compiles each .ts file a Function imports to .js but
 * leaves the `.ts` import specifier unchanged, so the deployed Function throws
 * ERR_MODULE_NOT_FOUND and every request returns FUNCTION_INVOCATION_FAILED.
 * Local Node strips TypeScript types, so tests pass while production fails.
 * That is how /api/lead broke from the 14 Nov 2026 release.
 *
 * This walks the static relative-import graph of each api/*.js entrypoint and
 * fails if any reachable import is a TypeScript file or does not resolve.
 *   node scripts/check-functions.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const API = join(ROOT, "api");
const TS = new Set([".ts", ".tsx", ".mts", ".cts"]);
/* Static `import … from "x"`, `export … from "x"`, bare `import "x"` and dynamic `import("x")`. */
const SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(?\s*)["'](\.{1,2}\/[^"']+)["']/g;

const rel = (p) => relative(ROOT, p).split("\\").join("/");
const problems = [];
let checked = 0;

function walk(file, chain, seen) {
  if (seen.has(file)) return;
  seen.add(file);
  checked++;
  for (const [, spec] of readFileSync(file, "utf8").matchAll(SPECIFIER)) {
    const target = join(dirname(file), spec);
    const path = [...chain, rel(file)].join(" → ");
    if (TS.has(extname(target))) {
      problems.push(`${path} imports "${spec}" (TypeScript). Move what the Function needs into a plain .js module.`);
      continue;
    }
    if (!existsSync(target)) {
      problems.push(`${path} imports "${spec}", which does not exist. Use the full file name with its extension.`);
      continue;
    }
    if (/\.(m?js)$/.test(target)) walk(target, [...chain, rel(file)], seen);
  }
}

const entries = existsSync(API) ? readdirSync(API).filter((f) => /\.(m?js)$/.test(f)).map((f) => join(API, f)) : [];
for (const entry of entries) walk(entry, [], new Set());

if (problems.length) {
  console.error(`✖ check:functions failed: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`✔ check:functions passed (${entries.length} Function(s), ${checked} module(s), no TypeScript imports)`);
