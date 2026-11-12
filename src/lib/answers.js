/**
 * Answer-first Q&A for AI Overviews, AI Mode, ChatGPT and Perplexity. Every
 * visible Q&A on the site (and its FAQPage JSON-LD twin) is created with qa()
 * and grouped per page with qaRoute(). Answer length follows the question
 * (AEO audit 2026-11-12, issue 3: fixed 35-to-60-word answers padded simple
 * replies with repeated address and brand filler).
 *
 *  qa(question, answer, { kind }): every answer
 *   - opens with a first sentence that answers the question on its own and names
 *     the entity ("Brihadhee"; Tamil answers பிரிஹதீ). "Yes." / "No." may come
 *     first: "No. Brihadhee serves lunch and dinner only, from 11 AM to 11 PM."
 *     counts as one sentence.
 *   - kind "fact" (yes/no, time, place, count or price questions):
 *       first sentence 5 to 30 words, whole answer at most 55 words (the full
 *       street address alone is 22 words)
 *   - kind "explain" (what is, how, why, what to order, comparisons):
 *       first sentence 8 to 35 words, whole answer at most 80 words
 *     The kind is inferred from the question (FACT_QUESTION below) unless set.
 *   - carries "Brihadhee" in Latin script (entity matching, Tamil answers too)
 *   - makes no superlative claim (best / சிறந்த): questions may ask it, answers
 *     state facts
 *
 *  qaRoute(route, items): every page
 *   - ONE Q&A PER ROUTE: a question may appear on one route only. Asking it on a
 *     second route fails the build (the dist check is in scripts/aeo-lint.mjs).
 *   - ADDRESS AT MOST ONCE: street-level detail (door number, W-Block, ward,
 *     postcode) may appear in one answer per page, never repeated.
 *   - LOCALITY ONCE: at least one answer on the page names Anna Nagar.
 *   - NO DESCRIPTOR STUFFING: the "100% pure vegetarian" brand descriptor may
 *     appear in at most MAX_DESCRIPTOR answers per page and language. Say it
 *     where the question is about diet or identity, not in every answer.
 *
 * Restaurant and catering scopes stay separate: "100% pure vegetarian" describes
 * the restaurant and its kitchen; catering copy uses CATERING_DIET from
 * config/seo-gates.ts (scripts/verify-seo-compliance.ts enforces the wording).
 *
 * The visible "Last updated" line under each Q&A block comes from
 * CONTENT_UPDATED in entity-truth.ts (src/components/Faq.astro).
 */

/** Sentence break, except after a leading "Yes." or "No." (the first sentence carries on). */
export const FIRST_SENTENCE = /(?<=[.!?])(?<!\b(?:No|Yes)\.)\s+/;
/** Street-level detail that only one answer on a page may carry. */
const STREET_DETAIL = /W-41|W-124|W-Block|Ward 100|600040/;
/** The brand descriptor that used to be stuffed into every answer. */
const DESCRIPTOR = /100% (?:pure veg|சுத்த சைவ)/i;
export const MAX_DESCRIPTOR = 2;

/** Questions that want one fact back: yes/no, when, where, how much, how many. */
const FACT_QUESTION =
  /^(?:is|are|does|do|did|can|could|will|should i|has|have|where|when|what time|what are .*timings|how much|how many|how far|how large|how big|what is the minimum|which areas)\b/i;

export const LIMITS = {
  fact: { first: [5, 30], max: 55 },
  explain: { first: [8, 35], max: 80 },
};

const ENTITY = {
  en: { re: /Brihadhee/, label: "Brihadhee" },
  "ta-Latn": { re: /Brihadhee/, label: "Brihadhee" },
  ta: { re: /பிரிஹதீ/, label: "பிரிஹதீ" },
};
const SUPERLATIVE = /\b(?:best|finest|greatest|top[- ]rated|no\.?\s?1|number one)\b|#1\b|சிறந்த|நம்பர்\s*1|முதல்\s*தர/i;

const wordCount = (s) => s.split(" ").filter(Boolean).length;

export function qa(question, answer, extra = {}) {
  const lang = extra.lang ?? "en";
  const E = ENTITY[lang];
  if (!E) throw new Error(`[answers] "${question}": no Q&A rules for language "${lang}"`);
  const kind = extra.kind ?? (lang === "en" && FACT_QUESTION.test(question.trim()) ? "fact" : "explain");
  const L = LIMITS[kind];
  if (!L) throw new Error(`[answers] "${question}": unknown kind "${kind}" (fact or explain)`);
  const text = answer.replace(/\s+/g, " ").trim();
  const words = wordCount(text);
  const first = text.split(FIRST_SENTENCE)[0];
  const firstWords = wordCount(first);
  const fails = [];
  if (words > L.max) fails.push(`${words} words (a ${kind} answer is at most ${L.max})`);
  if (firstWords < L.first[0] || firstWords > L.first[1]) fails.push(`first sentence ${firstWords} words (a ${kind} answer needs ${L.first[0]} to ${L.first[1]})`);
  if (!E.re.test(first)) fails.push(`first sentence does not name "${E.label}"`);
  if (!/Brihadhee/.test(text)) fails.push('does not name "Brihadhee" (Latin script, for entity matching)');
  const sup = text.match(SUPERLATIVE);
  if (sup) fails.push(`superlative claim "${sup[0]}" in the answer`);
  if (fails.length) throw new Error(`[answers] "${question}": ${fails.join("; ")}\n  ${text}`);
  const { kind: _k, ...rest } = extra;
  return { question, answer: text, ...rest };
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
  list.forEach((item) => claimQuestion(route, item.question));
  if (!list.length) return list;

  const withStreet = list.filter((i) => STREET_DETAIL.test(i.answer));
  if (withStreet.length > 1) {
    throw new Error(`[answers] ${route}: the street address appears in ${withStreet.length} answers (${withStreet.map((i) => `"${i.question}"`).join(", ")}); state it once per page`);
  }
  if (!list.some((i) => /Anna Nagar|அண்ணா நகர/.test(i.answer))) {
    throw new Error(`[answers] ${route}: no answer names Anna Nagar; say where Brihadhee is at least once per page`);
  }
  const byLang = new Map();
  for (const i of list) {
    if (!DESCRIPTOR.test(i.answer)) continue;
    const l = i.lang ?? "en";
    byLang.set(l, [...(byLang.get(l) ?? []), i.question]);
  }
  for (const [l, qs] of byLang) {
    if (qs.length > MAX_DESCRIPTOR) {
      throw new Error(`[answers] ${route}: "100% pure vegetarian" is repeated in ${qs.length} ${l} answers (max ${MAX_DESCRIPTOR}): ${qs.map((q) => `"${q}"`).join(", ")}`);
    }
  }
  return list;
}

/** Readable list: "a, b and c". */
export const list = (items) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
