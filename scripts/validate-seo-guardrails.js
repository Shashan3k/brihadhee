#!/usr/bin/env node
/**
 * SEO guardrail validator.
 *
 * Scans rendered HTML (default: dist/**) and any markdown files passed on the
 * command line, and exits 1 if it finds claims that config/client-verification.json
 * says are not confirmed.
 *
 * Usage:
 *   node scripts/validate-seo-guardrails.js            # scans dist/
 *   node scripts/validate-seo-guardrails.js dist README.md docs/
 *
 * Run after `astro build`, e.g. in CI or a pre-commit hook.
 * Planning docs that legitimately list forbidden terms (Key.md, Ho.md) are
 * never scanned.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative, basename } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const CONFIG_PATH = join(ROOT, "config", "client-verification.json");
const SKIP_FILES = new Set(["key.md", "ho.md"]);
const SCAN_EXT = new Set([".html", ".htm", ".md", ".mdx", ".txt"]);

/* ---- Rules ------------------------------------------------------------ */

const FORBIDDEN_KEYWORDS = [
  "best catering in Chennai",
  "wedding catering Chennai",
  "catering services in Chennai",
  "bulk catering Chennai",
  "large-scale catering",
  "large scale catering",
  "mass catering",
  "non-vegetarian catering",
  "non vegetarian catering",
  "multi-cuisine catering",
  "multi cuisine catering",
  "corporate catering",
  "office lunch catering",
];

const COMPETITORS = ["Saraswathi", "Sindhu", "Arusuvai"];

// 11 AM to 11 PM in its common spellings (11 AM – 11 PM, 11:00 AM - 11:00 PM, ...)
const HOURS_RE =
  /\b11(?::00)?\s*(?:a\.?m\.?)\s*(?:to|-|–|—|until)\s*11(?::00)?\s*(?:p\.?m\.?)/i;

const CATERING_RE = /\bcater(?:ing|er|ers|s|ed)?\b/i;
const CUSTOM_DOSA_RE = /\bcustomi[sz](?:e|able|ed)\s+dosas?\b|\bbuild\s+your\s+own\s+dosa\b/i;
const PAROTTA_KEYWORD_RE = /\b(?:veg\s+)?parotta\s+(?:in\s+)?anna\s+nagar\b/i;
const PARKING_KEYWORD_RE =
  /\b(?:anna\s+nagar\s+parking|parking\s+(?:in|near)\s+anna\s+nagar|(?:with|free|ample)\s+parking|parking\s+(?:available|facility|facilities))\b/i;

/* ---- Helpers ---------------------------------------------------------- */

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) fatal(`Missing ${relative(ROOT, CONFIG_PATH)}`);
  let cfg;
  try {
    cfg = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  } catch (e) {
    fatal(`Invalid JSON in ${relative(ROOT, CONFIG_PATH)}: ${e.message}`);
  }
  const required = [
    "offer_catering", "confirmed_events", "min_guests", "max_guests",
    "service_area", "menu_formats", "staff_serving_cleanup_included",
    "prep_mode", "advance_notice_required", "enquiry_channels",
    "pricing_model", "restaurant_verified_hours",
    "restaurant_parking_available", "restaurant_parotta_confirmed",
  ];
  const missing = required.filter((k) => !(k in cfg));
  if (missing.length) fatal(`Config is missing keys: ${missing.join(", ")}`);
  if (typeof cfg.offer_catering !== "boolean") fatal("offer_catering must be a boolean");
  return cfg;
}

function fatal(msg) {
  console.error(`✖ ${msg}`);
  process.exit(2);
}

function* walk(path) {
  const st = statSync(path);
  if (st.isFile()) {
    yield path;
    return;
  }
  for (const entry of readdirSync(path)) {
    if (entry === "node_modules" || entry === ".git") continue;
    yield* walk(join(path, entry));
  }
}

const extOf = (f) => (f.match(/\.[^.]+$/)?.[0] ?? "").toLowerCase();

/** Drop <script>/<style> blocks except JSON-LD (structured data counts as content). */
function toScannable(file, text) {
  if (!/\.html?$/i.test(file)) return text;
  return text
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<script\b(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/gi, " ");
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

/* ---- Main ------------------------------------------------------------- */

const cfg = loadConfig();
const targets = process.argv.slice(2);
if (!targets.length) targets.push("dist");

const problems = [];
let scanned = 0;

for (const t of targets) {
  const abs = resolve(t);
  if (!existsSync(abs)) fatal(`Path not found: ${t} (run \`npm run build\` first?)`);
  for (const file of walk(abs)) {
    if (!SCAN_EXT.has(extOf(file))) continue;
    if (SKIP_FILES.has(basename(file).toLowerCase())) continue;
    scanned++;
    const rel = relative(ROOT, file);
    const text = toScannable(file, readFileSync(file, "utf8"));
    const flag = (rule, re, msg) => {
      const flags = re.flags.includes("g") ? re.flags : re.flags + "g";
      for (const m of text.matchAll(new RegExp(re.source, flags))) {
        problems.push({ rule, file: rel, line: lineOf(text, m.index), match: m[0], msg });
      }
    };
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    for (const kw of FORBIDDEN_KEYWORDS) {
      flag("forbidden-keyword", new RegExp(esc(kw).replace(/\s+/g, "\\s+"), "i"), "Forbidden broad/unconfirmed keyword");
    }
    for (const c of COMPETITORS) {
      flag("competitor-brand", new RegExp(`\\b${esc(c)}\\b`, "i"), "Competitor brand name");
    }
    if (cfg.restaurant_verified_hours === null) {
      flag("unverified-hours", HOURS_RE, "Hardcoded 11 AM to 11 PM while restaurant_verified_hours is null");
    }
    if (cfg.offer_catering === false) {
      flag("unconfirmed-catering", CATERING_RE, "Catering claim while offer_catering is false");
    }
    if (cfg.customizable_dosas_confirmed !== true) {
      flag("unconfirmed-custom-dosa", CUSTOM_DOSA_RE, "Customizable-dosa claim while customizable_dosas_confirmed is not true");
    }
    if (cfg.restaurant_parotta_confirmed !== true) {
      flag("unconfirmed-parotta", PAROTTA_KEYWORD_RE, "Parotta keyword while restaurant_parotta_confirmed is not true");
    }
    if (cfg.restaurant_parking_available !== true) {
      flag("unconfirmed-parking", PARKING_KEYWORD_RE, "Parking claim while restaurant_parking_available is not true");
    }
  }
}

if (problems.length) {
  console.error(`✖ SEO guardrails failed: ${problems.length} problem(s) in ${scanned} file(s)\n`);
  for (const p of problems) {
    console.error(`  [${p.rule}] ${p.file}:${p.line}  "${p.match}"\n      ${p.msg}`);
  }
  process.exit(1);
}
console.log(`✔ SEO guardrails passed (${scanned} file(s) scanned)`);
