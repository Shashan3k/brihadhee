#!/usr/bin/env node
/**
 * Ping IndexNow (shared by Bing, Yandex and others) with changed URLs after a deploy.
 *
 *   INDEXNOW_KEY=xxxx node scripts/indexnow.mjs                 # every URL in dist/sitemap.xml
 *   INDEXNOW_KEY=xxxx node scripts/indexnow.mjs /menu/ /about/  # only these paths
 *   INDEXNOW_KEY=xxxx node scripts/indexnow.mjs --dry-run       # print the payload, send nothing
 *
 * No key = skip (exit 0). The key file must already be live at
 * https://www.brihadhee.com/<key>.txt (built by src/pages/[indexnowKey].txt.js
 * when INDEXNOW_KEY is set at build time), so run this AFTER the deploy finishes.
 * Google does not use IndexNow; use Search Console for Google.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");
const key = (process.env.INDEXNOW_KEY ?? "").trim();
if (!key) {
  console.log("IndexNow: INDEXNOW_KEY not set, skipping.");
  process.exit(0);
}

const { SITE_ORIGIN } = await import(pathToFileURL(join(ROOT, "src", "data", "entity-truth.ts")).href);
const host = new URL(SITE_ORIGIN).host;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
let urls = args.filter((a) => a !== "--dry-run").map((p) => new URL(p, SITE_ORIGIN).href);
if (!urls.length) {
  const sitemap = join(ROOT, "dist", "sitemap.xml");
  if (!existsSync(sitemap)) {
    console.error("IndexNow: dist/sitemap.xml not found. Run `npm run build` first or pass paths.");
    process.exit(1);
  }
  urls = [...readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
urls = urls.filter((u) => new URL(u).host === host);
if (!urls.length) {
  console.log("IndexNow: no URLs on", host);
  process.exit(0);
}

const payload = { host, key, keyLocation: `${SITE_ORIGIN}/${key}.txt`, urlList: urls };
if (dryRun) {
  console.log(`IndexNow (dry run): would POST ${urls.length} URL(s) to https://api.indexnow.org/indexnow`);
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});
// 200 = accepted, 202 = accepted (key check pending). Anything else is a failure.
if (res.status === 200 || res.status === 202) {
  console.log(`IndexNow: submitted ${urls.length} URL(s) (HTTP ${res.status}).`);
} else {
  console.error(`IndexNow: HTTP ${res.status} ${await res.text()}`);
  process.exit(1);
}
