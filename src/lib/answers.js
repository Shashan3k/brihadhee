/**
 * Answer-first Q&A for AI Overviews, AI Mode, ChatGPT and Perplexity. Every
 * visible Q&A on the site (and its FAQPage JSON-LD twin) is created with qa()
 * and grouped per page with qaRoute(). Answer length follows the question
 * and is checked against the rendered HTML by scripts/aeo-lint.mjs.
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
 *   - LOCALITY ONCE: at least one answer on the page names Anna Nagar.
 *   - Address and dietary descriptor density are checked across the rendered page.
 *
 * Catering copy takes its diet wording from CATERING_DIET in config/seo-gates.ts
 * so it follows the approved service facts independently of restaurant copy.
 *
 * The visible "Last updated" line uses the route's content revision
 * (src/components/Faq.astro).
 */

/** Questions that want one fact back: yes/no, when, where, how much, how many. */
const FACT_QUESTION =
  /^(?:is|are|does|do|did|can|could|will|should i|has|have|where|when|what time|what (?:are .*timings|are .*hours|is the (?:minimum|address|phone number))|how much|how many|how far|how large|how big|which areas)\b/i;

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
const GENERIC_OPENING = /^(?:(?:yes|no)[.,]\s*)?(?:when it comes to|it is (?:important|worth) to note|it['’]s important to note|as a general rule|in today['’]s world)\b/i;

const wordCount = (s) => s.split(" ").filter(Boolean).length;
const FACT_QUESTION_TA = /எத்தனை|எங்கு|எங்கே|எவ்வளவு|எந்தெந்த|முடியுமா|செய்யுமா|செய்கிறதா/;
const FACT_QUESTION_TANGLISH = /\b(?:enga|eppo|evlo|ethana|mudiyuma)\b/i;
function inferredKind(question, lang) {
  const pattern = lang === "ta" ? FACT_QUESTION_TA : lang === "ta-Latn" ? FACT_QUESTION_TANGLISH : FACT_QUESTION;
  return pattern.test(question.trim()) ? "fact" : "explain";
}

/** Keep a leading yes/no with its answer and preserve the address abbreviation. */
export function firstAnswerSentence(answer) {
  const prefix = answer.match(/^(?:Yes|No)\.\s+/i)?.[0] ?? "";
  return prefix + answer.slice(prefix.length).split(/(?<=[.!?])(?<!\bNo\.)\s+/, 1)[0];
}

export function answerProblems(question, answer, { lang = "en", kind = inferredKind(question, lang) } = {}) {
  const E = ENTITY[lang];
  const L = LIMITS[kind];
  if (!E) return [`no Q&A rules for language "${lang}"`];
  if (!L) return [`unknown answer kind "${kind}" (fact or explain)`];
  const text = answer.replace(/\s+/g, " ").trim();
  const words = wordCount(text);
  const first = firstAnswerSentence(text);
  const firstWords = wordCount(first);
  const fails = [];
  if (kind === "fact" && GENERIC_OPENING.test(text)) fails.push("factual answer starts with a generic introduction");
  if (words > L.max) fails.push(`${words} words (a ${kind} answer is at most ${L.max})`);
  if (firstWords < L.first[0] || firstWords > L.first[1]) fails.push(`first sentence ${firstWords} words (a ${kind} answer needs ${L.first[0]} to ${L.first[1]})`);
  if (!E.re.test(first)) fails.push(`first sentence does not name "${E.label}"`);
  if (!/Brihadhee/.test(text)) fails.push('does not name "Brihadhee" (Latin script, for entity matching)');
  const sup = text.match(SUPERLATIVE);
  if (sup) fails.push(`superlative claim "${sup[0]}" in the answer`);
  return fails;
}

export function qa(question, answer, extra = {}) {
  const text = answer.replace(/\s+/g, " ").trim();
  const fails = answerProblems(question, text, extra);
  if (fails.length) throw new Error(`[answers] "${question}": ${fails.join("; ")}\n  ${text}`);
  return { question, answer: text, ...extra };
}

/** question (normalised) -> route that owns it, across every page in the build. */
const owners = new Map();
// Unicode-aware: letters, combining marks (Tamil vowel signs) and digits are kept.
export const questionKey = (q) => q.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, " ").trim();

/**
 * Claim a question for a route without an FAQ block (for example a guide's
 * question headings), so it cannot be asked as a Q&A on another route.
 */
export function claimQuestion(route, question) {
  const key = questionKey(question);
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

  if (!list.some((i) => /Anna Nagar|அண்ணா நகர/.test(i.answer))) {
    throw new Error(`[answers] ${route}: no answer names Anna Nagar; say where Brihadhee is at least once per page`);
  }
  return list;
}

/** Readable list: "a, b and c". */
export const list = (items) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
