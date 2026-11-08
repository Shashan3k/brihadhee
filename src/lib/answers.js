/**
 * Answer-first Q&A builder. Every visible Q&A on the site (and its FAQPage
 * JSON-LD twin) is created with qa(), which fails the build unless the answer:
 *  - is 35 to 60 words, with a first sentence of 15 to 35 words
 *  - names "Brihadhee"
 *  - names "3rd Avenue" or "Anna Nagar East"
 *  - states the pure vegetarian status
 *  - contains at least one concrete fact (a number, price or time)
 */
const FIRST_SENTENCE = /(?<=[.!?])(?<!\bNo\.)\s+/;

export function qa(question, answer, extra = {}) {
  const text = answer.replace(/\s+/g, " ").trim();
  const words = text.split(" ").length;
  const first = text.split(FIRST_SENTENCE)[0];
  const firstWords = first.split(" ").length;
  const fails = [];
  if (words < 35 || words > 60) fails.push(`${words} words (needs 35 to 60)`);
  if (firstWords < 15 || firstWords > 35) fails.push(`first sentence ${firstWords} words (needs 15 to 35)`);
  if (!/Brihadhee/.test(text)) fails.push('does not name "Brihadhee"');
  if (!/3rd Avenue|Anna Nagar East/.test(text)) fails.push('does not name "3rd Avenue" or "Anna Nagar East"');
  if (!/pure veg/i.test(text)) fails.push("does not state pure vegetarian status");
  if (!/\d/.test(text)) fails.push("has no concrete fact (number, price or time)");
  if (fails.length) throw new Error(`[answers] "${question}": ${fails.join("; ")}\n  ${text}`);
  return { question, answer: text, ...extra };
}

/** Readable list: "a, b and c". */
export const list = (items) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
