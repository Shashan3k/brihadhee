/**
 * Segment a Search Console "Performance on Search" export the same way every time.
 *
 *   node scripts/gsc-segment.mjs <export-dir> [<previous-export-dir>]
 *
 * <export-dir> is the unzipped ZIP from Search Console > Performance > Export
 * (Chart.csv, Queries.csv, Pages.csv, Devices.csv, Countries.csv, Filters.csv).
 * With a second folder, every table adds the change against that period. Compare
 * only complete, equal-length periods with the same filters (country, search type).
 *
 * Reading the numbers (Search Console help 7576553, 7042828, 17011259):
 *  - Totals come from Chart.csv. Query rows leave out anonymized queries, so the
 *    query tables add up to less than the totals.
 *  - Queries, countries, devices and dates are aggregated by property; pages by
 *    page. Page impressions can add up to more than the property total.
 *  - Position is the topmost position of any brihadhee.com link, averaged.
 *  - The query table never says which URL appeared for a query. For that, export
 *    the Queries tab with a page filter, or use the API with query + page.
 *
 * Clusters map each query to the page meant to answer it (docs/seo/workflow/11-gsc-baseline.md).
 * Keep the rules stable between periods; if you change them, re-run the older export too.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const BRAND = /brihad|brihadee|bradhi|bragathi|beyond curry/i;
/** [cluster, page that should answer it, test]. First match wins, so order matters. */
const CLUSTERS = [
  ["brand: menu", "/menu/", (q) => BRAND.test(q) && /menu/.test(q)],
  ["brand: reviews, photos, offers", "/ (links out to reviews)", (q) => BRAND.test(q) && /review|photo|offer|rating/.test(q)],
  ["brand: name and location", "/", (q) => BRAND.test(q)],
  ["catering", "/catering-services-chennai/ and spokes", (q) => /cater/.test(q)],
  ["not a fit: non-veg or other cuisines", "none", (q) => /non[ -]?veg|multi ?cuisine|north indian|telugu|malayali|broadway|chinese/.test(q)],
  ["not a fit: breakfast or tiffin", "none (lunch and dinner only)", (q) => /breakfast|tiffin/.test(q)],
  ["dosa", "/menu/dosa/", (q) => /dosa/.test(q)],
  ["parotta", "/parotta-anna-nagar/", (q) => /parotta/.test(q)],
  ["lunch and meals", "/menu/nellai-meals/", (q) => /lunch|\bmeals?\b|thali|under \d+/.test(q)],
  ["dinner", "/veg-dinner-anna-nagar/", (q) => /dinner/.test(q)],
  ["family", "/family-dining-anna-nagar/", (q) => /family/.test(q)],
  ["veg restaurant in Anna Nagar", "/", (q) => /\bveg|vegetarian/.test(q) && /anna ?nagar|annanagar/.test(q)],
  ["South Indian restaurant", "/", (q) => /south ?indian/.test(q)],
  ["restaurants in Anna Nagar (any cuisine)", "/ (low fit: list intent, Maps)", (q) => /anna ?nagar|annanagar/.test(q)],
  ["near me", "/ (Maps and Business Profile)", (q) => /near me|nearby/.test(q)],
  ["other", "unmapped", () => true],
];

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.replace(/^﻿/, ""), r[i] ?? ""])));
}

function load(dir) {
  const read = (name) => {
    const p = join(dir, name);
    return existsSync(p) ? parseCsv(readFileSync(p, "utf8")) : [];
  };
  const num = (r) => ({ c: Number(r.Clicks), i: Number(r.Impressions), p: Number(r.Position) });
  const chart = read("Chart.csv").map((r) => ({ date: r.Date, ...num(r) }));
  return {
    dir,
    filters: read("Filters.csv").map((r) => `${r.Filter}: ${r.Value}`),
    chart,
    queries: read("Queries.csv").map((r) => ({ key: r["Top queries"].toLowerCase(), ...num(r) })),
    pages: read("Pages.csv").map((r) => ({ key: r["Top pages"], ...num(r) })),
    devices: read("Devices.csv").map((r) => ({ key: r.Device, ...num(r) })),
    countries: read("Countries.csv").map((r) => ({ key: r.Country, ...num(r) })),
  };
}

/** Sum clicks and impressions; position is impression-weighted (an approximation across queries). */
function sum(rows) {
  const c = rows.reduce((s, r) => s + r.c, 0);
  const i = rows.reduce((s, r) => s + r.i, 0);
  const p = i ? rows.reduce((s, r) => s + r.p * r.i, 0) / i : 0;
  return { c, i, p, n: rows.length };
}
const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(2)}%` : "–");
const delta = (a, b, digits = 0) => {
  if (b === undefined) return "";
  const d = a - b;
  return ` (${d >= 0 ? "+" : ""}${d.toFixed(digits)})`;
};

function segments(data) {
  const out = new Map(CLUSTERS.map(([name, page]) => [name, { page, rows: [] }]));
  for (const q of data.queries) {
    const [name] = CLUSTERS.find(([, , test]) => test(q.key));
    out.get(name).rows.push(q);
  }
  return out;
}

function table(title, header, lines) {
  console.log(`\n### ${title}\n`);
  console.log(`| ${header.join(" | ")} |`);
  console.log(`| ${header.map(() => "---").join(" | ")} |`);
  for (const l of lines) console.log(`| ${l.join(" | ")} |`);
}

const [curDir, prevDir] = process.argv.slice(2);
if (!curDir) {
  console.error("Usage: node scripts/gsc-segment.mjs <export-dir> [<previous-export-dir>]");
  process.exit(2);
}
const cur = load(curDir);
const prev = prevDir ? load(prevDir) : null;

const span = (d) => (d.chart.length ? `${d.chart[0].date} to ${d.chart.at(-1).date} (${d.chart.length} days with data)` : "no Chart.csv");
console.log(`## Search Console segments: ${span(cur)}${prev ? ` vs ${span(prev)}` : ""}`);
console.log(`\nFilters: ${cur.filters.join("; ") || "none recorded"}${prev ? ` | previous: ${prev.filters.join("; ")}` : ""}`);

const tot = sum(cur.chart), ptot = prev ? sum(prev.chart) : null;
const qtot = sum(cur.queries);
table("Totals (Chart.csv, by property)", ["Metric", "Value"], [
  ["Clicks", `${tot.c}${delta(tot.c, ptot?.c)}`],
  ["Impressions", `${tot.i}${delta(tot.i, ptot?.i)}`],
  ["CTR", pct(tot.c, tot.i)],
  ["Query rows cover", `${qtot.i} of ${tot.i} impressions (${pct(qtot.i, tot.i)}), ${qtot.c} of ${tot.c} clicks; the rest are anonymized queries`],
]);

const brand = (d) => {
  const b = d.queries.filter((q) => BRAND.test(q.key));
  const nb = d.queries.filter((q) => !BRAND.test(q.key));
  return { b: sum(b), nb: sum(nb) };
};
const bc = brand(cur), bp = prev ? brand(prev) : null;
table("Branded vs non-branded (query rows only)", ["Segment", "Queries", "Clicks", "Impressions", "CTR", "Avg position (weighted)"], [
  ["Branded", bc.b.n, `${bc.b.c}${delta(bc.b.c, bp?.b.c)}`, `${bc.b.i}${delta(bc.b.i, bp?.b.i)}`, pct(bc.b.c, bc.b.i), `${bc.b.p.toFixed(1)}${delta(bc.b.p, bp?.b.p, 1)}`],
  ["Non-branded", bc.nb.n, `${bc.nb.c}${delta(bc.nb.c, bp?.nb.c)}`, `${bc.nb.i}${delta(bc.nb.i, bp?.nb.i)}`, pct(bc.nb.c, bc.nb.i), `${bc.nb.p.toFixed(1)}${delta(bc.nb.p, bp?.nb.p, 1)}`],
]);

const sc = segments(cur), sp = prev ? segments(prev) : null;
table("Query clusters and the page meant to answer them", ["Cluster", "Target page", "Queries", "Clicks", "Impressions", "CTR", "Avg position (weighted)"],
  [...sc].filter(([, v]) => v.rows.length || sp?.get(v)?.rows.length).sort((a, b) => sum(b[1].rows).i - sum(a[1].rows).i).map(([name, v]) => {
    const s = sum(v.rows), p = sp ? sum(sp.get(name).rows) : null;
    return [name, v.page, s.n, `${s.c}${delta(s.c, p?.c)}`, `${s.i}${delta(s.i, p?.i)}`, pct(s.c, s.i), `${s.p.toFixed(1)}${p && p.i ? delta(s.p, p.p, 1) : ""}`];
  }));

const byKey = (rows, key) => rows.find((r) => r.key === key);
const dim = (title, rows, prows) => table(title, ["Row", "Clicks", "Impressions", "CTR", "Position"], rows.map((r) => {
  const p = prows ? byKey(prows, r.key) : undefined;
  return [r.key, `${r.c}${p ? delta(r.c, p.c) : ""}`, `${r.i}${p ? delta(r.i, p.i) : ""}`, pct(r.c, r.i), `${r.p}${p ? delta(r.p, p.p, 2) : ""}`];
}));
dim("Pages (aggregated by page; can exceed the property total)", cur.pages, prev?.pages);
dim("Devices", cur.devices, prev?.devices);
dim("Countries", cur.countries, prev?.countries);

const top = (name, n = 8) => sc.get(name).rows.sort((a, b) => b.i - a.i).slice(0, n).map((q) => `${q.key} (${q.i} impr, pos ${q.p})`).join("; ");
console.log(`\nTop non-branded queries by cluster:`);
for (const [name] of CLUSTERS) if (!name.startsWith("brand") && sc.get(name).rows.length) console.log(`- ${name}: ${top(name)}`);
