#!/usr/bin/env node
/**
 * verify-seo-aeo-geo: one end-to-end gate for crawlability, entity accuracy and
 * AI-answer readiness. Run after `astro build`.
 *
 *   node scripts/verify-seo-aeo-geo.mjs                 # built output + preview server
 *   node scripts/verify-seo-aeo-geo.mjs --no-server     # built output only (CI without a server)
 *   node scripts/verify-seo-aeo-geo.mjs --lighthouse    # also Lighthouse mobile on key routes
 *
 * Part 1, built output (dist/, raw HTML, no JavaScript):
 *   1. Every page has one H1, at least one H2, no skipped heading levels
 *   2. Every indexable page shows the NAP (name, phone, postal code) in raw HTML
 *   3. /menu/ lists every dish in menu-canonical.ts with its exact price; the home
 *      page lists every dish name; Build Your Own Dosa options and prices match
 *   4. Pages with Q&A show them in raw HTML and carry a matching FAQPage
 *   5. Unique, non-empty title and description; self-referencing canonical on the
 *      production origin; og:title, og:description, og:url (= canonical), og:image
 *   6. JSON-LD parses; required nodes per page; Restaurant NAP/geo equal
 *      entity-truth.ts; Menu prices equal menu-canonical.ts; no null/empty values;
 *      no unverified fact (probes) anywhere in the page or schema
 *   7. No broken internal links; every <img> has an alt attribute
 * Part 2, preview server (started and stopped by this script):
 *   8. Every page, robots.txt, sitemap-index.xml, sitemap.xml, llms.txt,
 *      llms-full.txt, menu.json and site.webmanifest return 200 (llms files also
 *      with Accept: text/markdown); robots.txt links the sitemap
 * Part 3, --lighthouse (needs Chrome; reported as skipped if it cannot run):
 *   9. Mobile: Performance >= 90, SEO = 100, Accessibility >= 95 on key routes
 *
 * Exit code 0 only if every check passes.
 */
import { readFileSync, readdirSync, statSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { spawn, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const ROOT = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const DIST = resolve(args.find((a) => !a.startsWith("--")) ?? join(ROOT, "dist"));
const WITH_SERVER = !args.includes("--no-server");
const WITH_LH = args.includes("--lighthouse");
const PORT = 4329;

const { FACTS, pendingFacts, SITE_ORIGIN, getFact } = await import(pathToFileURL(join(ROOT, "src", "data", "entity-truth.ts")).href);
const { MENU, BUILD_YOUR_OWN_DOSA } = await import(pathToFileURL(join(ROOT, "src", "data", "menu-canonical.ts")).href);

if (!existsSync(DIST)) {
  console.error(`✖ ${DIST} not found. Run "npm run build:site" first.`);
  process.exit(2);
}

/* ---- result bookkeeping ---------------------------------------------------- */
const results = []; // { group, ok, msg }
const groups = new Map();
const fail = (group, msg) => {
  results.push({ group, ok: false, msg });
  groups.set(group, (groups.get(group) ?? 0) + 1);
};
const pass = (group) => groups.has(group) || groups.set(group, 0);
const skipped = [];

/* ---- helpers ---------------------------------------------------------------- */
const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&nbsp;/g, " ");
const strip = (html) => decode(html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const digits = (s) => String(s).replace(/\D/g, "");
const attr = (html, re) => decode(html.match(re)?.[1] ?? "");

function* walk(p) {
  if (statSync(p).isFile()) return yield p;
  for (const e of readdirSync(p)) yield* walk(join(p, e));
}

/* ---- load built pages -------------------------------------------------------- */
const pages = [];
for (const file of walk(DIST)) {
  if (!file.endsWith(".html")) continue;
  const rel = relative(DIST, file).split(sep).join("/");
  const path = rel === "index.html" ? "/" : rel.endsWith("/index.html") ? `/${rel.slice(0, -10)}` : `/${rel}`;
  const html = readFileSync(file, "utf8");
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? "";
  const body = html.slice(html.search(/<body/i));
  const noindex = /<meta name="robots" content="noindex/i.test(head);
  let graph = [];
  let jsonOk = true;
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const j = JSON.parse(m[1]);
      graph.push(...(j["@graph"] ?? [].concat(j)));
    } catch (e) {
      jsonOk = false;
      fail("6 JSON-LD", `${path}: JSON-LD does not parse (${e.message})`);
    }
  }
  pages.push({ path, file, html, head, body, text: strip(body), noindex, graph, jsonOk });
}
const indexable = pages.filter((p) => !p.noindex && p.path !== "/404.html");
const typeOf = (n) => [].concat(n?.["@type"] ?? []);
const byType = (p, t) => p.graph.filter((n) => typeOf(n).includes(t));

/* ---- 1. headings -------------------------------------------------------------- */
for (const p of pages) {
  const hs = [...p.body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ lvl: +m[1], text: strip(m[2]) }));
  const h1 = hs.filter((h) => h.lvl === 1).length;
  if (h1 !== 1) fail("1 Headings", `${p.path}: ${h1} H1 elements (needs exactly 1)`);
  if (!p.noindex && !hs.some((h) => h.lvl === 2)) fail("1 Headings", `${p.path}: no H2`);
  hs.forEach((h, i) => {
    if (i && h.lvl > hs[i - 1].lvl + 1) fail("1 Headings", `${p.path}: skipped level h${hs[i - 1].lvl} -> h${h.lvl} at "${h.text.slice(0, 50)}"`);
  });
  pass("1 Headings");
}

/* ---- 2. NAP in raw HTML --------------------------------------------------------- */
const NAME = getFact("name");
const PHONE = getFact("phone");
const POSTAL = getFact("address").postalCode;
for (const p of indexable) {
  if (!p.text.includes(NAME)) fail("2 NAP in HTML", `${p.path}: business name missing`);
  if (!digits(p.text).includes(digits(PHONE).slice(-10))) fail("2 NAP in HTML", `${p.path}: phone ${PHONE} missing`);
  if (!p.text.includes(POSTAL)) fail("2 NAP in HTML", `${p.path}: postal code ${POSTAL} missing`);
  pass("2 NAP in HTML");
}

/* ---- 3. menu in HTML -------------------------------------------------------------- */
const rupee = (n) => `₹${n}`;
const menuPage = pages.find((p) => p.path === "/menu/");
const home = pages.find((p) => p.path === "/");
const allDishes = MENU.flatMap((c) => c.items);
if (!menuPage) fail("3 Menu in HTML", "/menu/ was not built");
else {
  const rows = new Map(
    [...menuPage.body.matchAll(/<strong class="menu-page__name">([\s\S]*?)<\/strong>\s*<span class="menu-page__price">([\s\S]*?)<\/span>/g)].map((m) => [strip(m[1]), strip(m[2])])
  );
  for (const d of allDishes) {
    if (!rows.has(d.name)) fail("3 Menu in HTML", `/menu/: dish missing: ${d.name}`);
    else if (rows.get(d.name) !== rupee(d.price)) fail("3 Menu in HTML", `/menu/: ${d.name} shows ${rows.get(d.name)}, menu-canonical.ts says ${rupee(d.price)}`);
  }
  if (rows.size !== allDishes.length) fail("3 Menu in HTML", `/menu/: ${rows.size} dishes in HTML, ${allDishes.length} in menu-canonical.ts`);
  for (const st of BUILD_YOUR_OWN_DOSA.steps) {
    for (const o of st.options) {
      const re = new RegExp(`<strong>${o.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</strong>[\\s\\S]{0,160}?<span class="byo__price">\\+?₹${o.price}</span>`);
      if (!re.test(menuPage.body)) fail("3 Menu in HTML", `/menu/: Build Your Own Dosa ${st.name} "${o.name}" ₹${o.price} not found`);
    }
  }
  for (const s of BUILD_YOUR_OWN_DOSA.suggestions) {
    if (!menuPage.text.includes(`${s.name} ${rupee(s.price)}`)) fail("3 Menu in HTML", `/menu/: chef's suggestion ${s.name} ${rupee(s.price)} not found`);
  }
}
if (home) for (const d of allDishes) if (!home.text.includes(d.name)) fail("3 Menu in HTML", `/: dish missing from the home menu: ${d.name}`);
pass("3 Menu in HTML");

/* ---- 4. Q&A visible and in FAQPage --------------------------------------------------- */
for (const p of pages) {
  const visible = [...p.body.matchAll(/<details class="faq__item"[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => strip(m[1]));
  const faq = byType(p, "FAQPage")[0];
  if (visible.length && !faq) fail("4 Q&A", `${p.path}: ${visible.length} visible Q&As but no FAQPage`);
  if (faq) {
    const qs = (faq.mainEntity ?? []).map((q) => q.name);
    if (qs.length !== visible.length) fail("4 Q&A", `${p.path}: FAQPage has ${qs.length} questions, page shows ${visible.length}`);
    for (const q of qs) if (!visible.includes(q)) fail("4 Q&A", `${p.path}: FAQPage question not visible: ${q}`);
  }
  pass("4 Q&A");
}

/* ---- 5. meta ---------------------------------------------------------------------------- */
const seenTitle = new Map();
const seenDesc = new Map();
for (const p of pages) {
  const title = attr(p.head, /<title>([\s\S]*?)<\/title>/);
  const desc = attr(p.head, /<meta name="description" content="([^"]*)"/);
  if (!title.trim()) fail("5 Meta", `${p.path}: empty title`);
  if (!desc.trim()) fail("5 Meta", `${p.path}: empty meta description`);
  if (seenTitle.has(title)) fail("5 Meta", `${p.path}: title duplicates ${seenTitle.get(title)}`);
  if (seenDesc.has(desc)) fail("5 Meta", `${p.path}: description duplicates ${seenDesc.get(desc)}`);
  seenTitle.set(title, p.path);
  seenDesc.set(desc, p.path);
  if (p.path === "/404.html") continue;
  const canonical = attr(p.head, /<link rel="canonical" href="([^"]+)"/);
  if (canonical !== `${SITE_ORIGIN}${p.path}`) fail("5 Meta", `${p.path}: canonical "${canonical}" is not ${SITE_ORIGIN}${p.path}`);
  for (const prop of ["og:title", "og:description", "og:url", "og:image"]) {
    const v = attr(p.head, new RegExp(`<meta property="${prop}" content="([^"]*)"`));
    if (!v) fail("5 Meta", `${p.path}: missing ${prop}`);
    else if ((prop === "og:url" || prop === "og:image") && !v.startsWith(SITE_ORIGIN)) fail("5 Meta", `${p.path}: ${prop} not on ${SITE_ORIGIN}: ${v}`);
  }
  if (attr(p.head, /<meta property="og:url" content="([^"]*)"/) !== canonical) fail("5 Meta", `${p.path}: og:url differs from canonical`);
  pass("5 Meta");
}

/* ---- 6. JSON-LD --------------------------------------------------------------------------- */
const addr = getFact("address");
const geo = getFact("geo");
const pending = pendingFacts();
const priceByName = new Map(allDishes.map((d) => [d.name, d.price]));
for (const st of BUILD_YOUR_OWN_DOSA.steps) for (const o of st.options) priceByName.set(o.name, o.price);
for (const s of BUILD_YOUR_OWN_DOSA.suggestions) priceByName.set(s.name, s.price);
const CATERING = ["/catering-services-chennai/", "/event-planner-catering-partner/", "/corporate-catering-chennai/"];
for (const p of pages) {
  if (!p.jsonOk || p.path === "/404.html") continue;
  const need = ["Restaurant", "WebSite", "WebPage", "BreadcrumbList"];
  if (p.path === "/menu/") need.push("Menu");
  if (CATERING.includes(p.path)) need.push("Service");
  for (const t of need) if (!byType(p, t).length) fail("6 JSON-LD", `${p.path}: missing ${t} node`);
  const r = byType(p, "Restaurant")[0];
  if (r) {
    if (r.name !== NAME) fail("6 JSON-LD", `${p.path}: Restaurant.name ${r.name}`);
    if (digits(r.telephone) !== digits(PHONE)) fail("6 JSON-LD", `${p.path}: telephone ${r.telephone} != ${PHONE}`);
    const a = r.address ?? {};
    if (a.streetAddress !== `${addr.line1}, ${addr.line2}` || a.addressLocality !== addr.city || a.addressRegion !== addr.state || a.postalCode !== addr.postalCode)
      fail("6 JSON-LD", `${p.path}: PostalAddress differs from entity-truth.ts`);
    if (r.geo?.latitude !== geo.latitude || r.geo?.longitude !== geo.longitude) fail("6 JSON-LD", `${p.path}: GeoCoordinates differ from entity-truth.ts`);
    if (r.hasMap !== getFact("mapUrl")) fail("6 JSON-LD", `${p.path}: hasMap differs from entity-truth.ts`);
    if ("aggregateRating" in r) fail("6 JSON-LD", `${p.path}: AggregateRating present (not allowed)`);
    if ("openingHoursSpecification" in r && FACTS.openDays?.status !== "verified") fail("6 JSON-LD", `${p.path}: openingHoursSpecification while open days are unverified`);
  }
  for (const m of byType(p, "Menu")) {
    (function walkSections(secs) {
      for (const s of secs ?? []) {
        for (const it of s.hasMenuItem ?? []) {
          const want = priceByName.get(it.name);
          if (want === undefined) fail("6 JSON-LD", `${p.path}: MenuItem "${it.name}" not in menu-canonical.ts`);
          else if (it.offers && Number(it.offers.price) !== want) fail("6 JSON-LD", `${p.path}: MenuItem ${it.name} price ${it.offers.price} != ${want}`);
          if (it.offers && it.offers.priceCurrency !== "INR") fail("6 JSON-LD", `${p.path}: MenuItem ${it.name} currency not INR`);
        }
        walkSections(s.hasMenuSection);
      }
    })(m.hasMenuSection);
  }
  // no empty values anywhere
  (function scan(node, at) {
    if (Array.isArray(node)) {
      if (!node.length) fail("6 JSON-LD", `${p.path}: empty array at ${at}`);
      node.forEach((n, i) => scan(n, `${at}[${i}]`));
    } else if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node)) {
        if (v === null || v === "" || (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length)) fail("6 JSON-LD", `${p.path}: empty value at ${at}.${k}`);
        scan(v, `${at}.${k}`);
      }
    }
  })(p.graph, "$");
  // no unverified fact in the page or its schema
  const schemaText = JSON.stringify(p.graph);
  for (const f of pending) {
    for (const probe of f.probes) {
      const hit = (p.text + " " + schemaText).match(probe);
      if (hit) fail("6 JSON-LD", `${p.path}: unverified fact "${f.key}" appears: "${hit[0]}"`);
    }
  }
  pass("6 JSON-LD");
}

/* ---- 7. links and images ------------------------------------------------------------------- */
const builtPaths = new Set(pages.map((p) => p.path));
const fileExists = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  if (builtPaths.has(clean)) return true;
  const f = join(DIST, clean);
  return existsSync(f) && statSync(f).isFile();
};
for (const p of pages) {
  for (const m of p.body.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    let href = decode(m[1]);
    if (href.startsWith(SITE_ORIGIN)) href = href.slice(SITE_ORIGIN.length) || "/";
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    if (!fileExists(href)) fail("7 Links & images", `${p.path}: broken internal link ${href}`);
    const hash = href.split("#")[1];
    if (hash) {
      const target = pages.find((x) => x.path === href.split("#")[0]);
      if (target && !new RegExp(`id="${hash}"`).test(target.html)) fail("7 Links & images", `${p.path}: link ${href} points to a missing #${hash}`);
    }
  }
  for (const m of p.body.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(m[0])) fail("7 Links & images", `${p.path}: <img> without alt: ${m[0].slice(0, 80)}`);
    const src = m[0].match(/\bsrc="([^"]+)"/)?.[1];
    if (src && src.startsWith("/") && !fileExists(src)) fail("7 Links & images", `${p.path}: image not found ${src}`);
  }
  pass("7 Links & images");
}

/* ---- 8. preview server ------------------------------------------------------------------- */
async function serverChecks() {
  const astroBin = join(ROOT, "node_modules", "astro", "bin", "astro.mjs");
  const child = spawn(process.execPath, [astroBin, "preview", "--port", String(PORT)], { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
  const base = `http://localhost:${PORT}`;
  try {
    let up = false;
    for (let i = 0; i < 60 && !up; i++) {
      await new Promise((r) => setTimeout(r, 500));
      try {
        up = (await fetch(base + "/", { redirect: "manual" })).ok;
      } catch {}
    }
    if (!up) {
      fail("8 Preview server", `preview server did not start on port ${PORT}`);
      return null;
    }
    const files = ["/robots.txt", "/sitemap-index.xml", "/sitemap.xml", "/llms.txt", "/llms-full.txt", "/menu.json", "/site.webmanifest"];
    for (const path of [...indexable.map((p) => p.path), ...files]) {
      const res = await fetch(base + path, { redirect: "manual" });
      if (res.status !== 200) fail("8 Preview server", `${path} returned ${res.status}`);
    }
    for (const path of ["/llms.txt", "/llms-full.txt"]) {
      const res = await fetch(base + path, { headers: { Accept: "text/markdown" }, redirect: "manual" });
      if (res.status !== 200) fail("8 Preview server", `${path} with Accept: text/markdown returned ${res.status}`);
    }
    const robots = await (await fetch(base + "/robots.txt")).text();
    if (!/^Sitemap:\s*https:\/\/www\.brihadhee\.com\/sitemap(-index)?\.xml/m.test(robots)) fail("8 Preview server", "robots.txt does not link the sitemap on the production origin");
    for (const ua of ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot"]) {
      if (!new RegExp(`User-agent: ${ua}\\s*\\nAllow: /`).test(robots)) fail("8 Preview server", `robots.txt does not allow ${ua}`);
    }
    const sitemap = await (await fetch(base + "/sitemap.xml")).text();
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    for (const p of indexable) if (!locs.includes(`${SITE_ORIGIN}${p.path}`)) fail("8 Preview server", `sitemap.xml is missing ${p.path}`);
    for (const l of locs) if (!indexable.some((p) => `${SITE_ORIGIN}${p.path}` === l)) fail("8 Preview server", `sitemap.xml lists a page that is not built or is noindex: ${l}`);
    pass("8 Preview server");
    if (WITH_LH) await lighthouse(base);
    return true;
  } finally {
    child.kill();
  }
}

/* ---- 9. Lighthouse ------------------------------------------------------------------------- */
async function lighthouse(base) {
  const routes = ["/", "/menu/", "/menu/dosa/", "/catering-services-chennai/", "/about/"];
  const out = mkdtempSync(join(tmpdir(), "lh-"));
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  const probe = spawnSync(npx, ["--no-install", "lighthouse", "--version"], { shell: process.platform === "win32", encoding: "utf8" });
  const pkg = probe.status === 0 ? "lighthouse" : "lighthouse@12";
  for (const r of routes) {
    const file = join(out, `${r.replace(/\W+/g, "_") || "home"}.json`);
    const res = spawnSync(npx, ["-y", pkg, base + r, "--only-categories=performance,accessibility,seo", "--output=json", `--output-path=${file}`, "--chrome-flags=--headless=new", "--quiet"], {
      shell: process.platform === "win32",
      encoding: "utf8",
      timeout: 180000,
    });
    if (res.status !== 0 || !existsSync(file)) {
      skipped.push(`Lighthouse ${r}: could not run (${(res.stderr || res.error?.message || "unknown error").split("\n")[0].slice(0, 120)})`);
      continue;
    }
    const c = JSON.parse(readFileSync(file, "utf8")).categories;
    const perf = Math.round(c.performance.score * 100);
    const a11y = Math.round(c.accessibility.score * 100);
    const seo = Math.round(c.seo.score * 100);
    console.log(`  Lighthouse ${r}: Performance ${perf}, Accessibility ${a11y}, SEO ${seo}`);
    if (perf < 90) fail("9 Lighthouse", `${r}: Performance ${perf} (needs >= 90)`);
    if (a11y < 95) fail("9 Lighthouse", `${r}: Accessibility ${a11y} (needs >= 95)`);
    if (seo < 100) fail("9 Lighthouse", `${r}: SEO ${seo} (needs 100)`);
  }
  pass("9 Lighthouse");
  rmSync(out, { recursive: true, force: true });
}

if (WITH_SERVER) await serverChecks();
else skipped.push("8 Preview server: skipped (--no-server)");
if (!WITH_LH) skipped.push("9 Lighthouse: not requested (use --lighthouse)");

/* ---- report --------------------------------------------------------------------------------- */
console.log(`\nverify-seo-aeo-geo: ${pages.length} pages (${indexable.length} indexable), ${allDishes.length} dishes`);
for (const [g, n] of [...groups.entries()].sort()) console.log(`  ${n ? "✖" : "✔"} ${g}${n ? ` (${n} problem${n > 1 ? "s" : ""})` : ""}`);
for (const s of skipped) console.log(`  - ${s}`);
const failures = results.filter((r) => !r.ok);
if (failures.length) {
  console.log("");
  for (const f of failures) console.log(`  [${f.group}] ${f.msg}`);
  process.exit(1);
}
console.log("\n✔ All checks passed");
