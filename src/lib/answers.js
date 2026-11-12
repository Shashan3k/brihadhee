/**
 * Answer-first Q&A for AI Overviews, AI Mode, ChatGPT and Perplexity. Every
 * visible Q&A on the site (and its FAQPage JSON-LD twin) is created with qa()
 * and grouped per page with qaRoute(), which together fail the build unless:
 *
 *  qa(): every answer
 *   - is 35 to 60 words, with a first sentence of 15 to 35 words that answers the
 *     question and names "Brihadhee" (the passage an engine lifts must stand alone)
 *   - names Anna Nagar (the locality), states the pure vegetarian status, and
 *     contains a concrete fact (a number, price or time)
 *
 *  qaRoute(route, items): every page
 *   - ONE Q&A PER ROUTE: a question may appear on one route only. Asking it on a
 *     second route fails the build (the dist check is in scripts/aeo-lint.mjs).
 *   - the FIRST answer on the page states the full street address; the others do
 *     not repeat the street or door number ("Anna Nagar East" is enough)
 *
 * Tamil Q&As (extra { lang: "ta" }) follow the same shape with Tamil markers:
 * the first sentence names பிரிஹதீ, the answer also carries "Brihadhee" in Latin
 * script (entity matching), names அண்ணா நகர் and states சுத்த சைவ; 25 to 60 words,
 * because Tamil packs more into each word. No answer, in either language, may
 * make a superlative claim (best / சிறந்த): questions may ask it, answers state facts.
 *
 * The visible "Last updated" line under each Q&A block comes from
 * CONTENT_UPDATED in entity-truth.ts (src/components/Faq.astro).
 */
import { addressLine } from "../data/entity-truth.ts";

const FIRST_SENTENCE = /(?<=[.!?])(?<!\bNo\.)\s+/;
/** Street-level detail that only the first answer on a page may carry. */
const STREET_DETAIL = /W-41|W-124|W-Block|Ward 100|600040/;

const RULES = {
  en: { min: 35, name: /Brihadhee/, nameLabel: "Brihadhee", area: /Anna Nagar/, areaLabel: "Anna Nagar", veg: /pure veg/i },
  ta: { min: 25, name: /பிரிஹதீ/, nameLabel: "பிரிஹதீ", area: /அண்ணா நகர/, areaLabel: "அண்ணா நகர் (any case form)", veg: /சுத்த சைவ/ },
};
const SUPERLATIVE = /\b(?:best|finest|greatest|top[- ]rated|no\.?\s?1|number one)\b|#1\b|சிறந்த|நம்பர்\s*1|முதல்\s*தர/i;

export function qa(question, answer, extra = {}) {
  const lang = extra.lang ?? "en";
  const R = RULES[lang];
  if (!R) throw new Error(`[answers] "${question}": no Q&A rules for language "${lang}"`);
  const text = answer.replace(/\s+/g, " ").trim();
  const words = text.split(" ").length;
  const first = text.split(FIRST_SENTENCE)[0];
  const firstWords = first.split(" ").length;
  const fails = [];
  if (words < R.min || words > 60) fails.push(`${words} words (needs ${R.min} to 60)`);
  if (firstWords < 15 || firstWords > 35) fails.push(`first sentence ${firstWords} words (needs 15 to 35)`);
  if (!R.name.test(first)) fails.push(`first sentence does not name "${R.nameLabel}"`);
  if (!/Brihadhee/.test(text)) fails.push('does not name "Brihadhee" (Latin script, for entity matching)');
  if (!R.area.test(text)) fails.push(`does not name "${R.areaLabel}"`);
  if (!R.veg.test(text)) fails.push("does not state pure vegetarian status");
  if (!/\d/.test(text)) fails.push("has no concrete fact (number, price or time)");
  const sup = text.match(SUPERLATIVE);
  if (sup) fails.push(`superlative claim "${sup[0]}" in the answer`);
  if (fails.length) throw new Error(`[answers] "${question}": ${fails.join("; ")}\n  ${text}`);
  return { question, answer: text, ...extra };
}

/** question (normalised) -> route that owns it, across every page in the build. */
const owners = new Map();
// Unicode-aware: letters, combining marks (Tamil vowel signs) and digits are kept.
const norm = (q) => q.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, " ").trim();

/**
 * Claim a question for a route without an FAQ block (for example a guide's
 * question headings), so it cannot be asked as a Q&A on another route.
 */
export function claimQuestion(route, question) {
  const key = norm(question);
  const owner = owners.get(key);
  if (owner && owner !== route) throw new Error(`[answers] "${question}" is on ${owner} and ${route}: one Q&A per route`);
  owners.set(key, route);
  return question;
}

/**
 * Register a page's Q&A list. Returns the same items, so a page can write
 *   export const faq = qaRoute("/about/", [qa(...), qa(...)]);
 */
export function qaRoute(route, items) {
  const list = items.filter(Boolean);
  const full = addressLine();
  list.forEach((item, i) => {
    claimQuestion(route, item.question);
    if (i === 0 && !item.answer.includes(full)) {
      throw new Error(`[answers] ${route}: the first Q&A ("${item.question}") must state the full address: ${full}`);
    }
    if (i > 0 && STREET_DETAIL.test(item.answer)) {
      throw new Error(`[answers] ${route}: "${item.question}" repeats the street address; only the first Q&A on a page states it`);
    }
  });
  return list;
}

/** Readable list: "a, b and c". */
export const list = (items) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
