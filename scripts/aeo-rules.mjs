import { parse, DOCUMENT_NODE, ELEMENT_NODE, TEXT_NODE } from "ultrahtml";
import { CATERING_ID, RESTAURANT_ID, SITE_ORIGIN, addressLine, cateringContacts, getFact, factOr, toE164 } from "../src/data/entity-truth.ts";
import { CATERING_PURITY_CLAIM, IS_CATERING_PURE_VEG } from "../config/seo-gates.ts";

const namedEntities = { amp: "&", apos: "'", quot: '"', lt: "<", gt: ">", nbsp: " ", ndash: "–", mdash: "—" };
export function decodeHtml(text) {
  return text.replace(/&(?:#(\d+)|#x([\da-f]+)|(amp|apos|quot|lt|gt|nbsp|ndash|mdash));/gi, (match, decimal, hex, name) => {
    if (name) return namedEntities[name.toLowerCase()];
    const point = decimal ? Number(decimal) : Number.parseInt(hex, 16);
    return point <= 0x10ffff ? String.fromCodePoint(point) : match;
  });
}

export const normalizeText = (text) => text.replace(/\s+/g, " ").trim();
const classes = (node) => (node.attributes.class ?? "").split(/\s+/);
const NON_CONTENT = new Set(["head", "script", "style", "template", "svg", "iframe"]);
const BLOCKS = new Set(["address", "article", "aside", "blockquote", "button", "dd", "details", "div", "dl", "dt", "fieldset",
  "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "label", "li", "main", "nav", "ol",
  "option", "p", "section", "summary", "table", "td", "th", "ul"]);
const hidden = (node) => NON_CONTENT.has(node.name) || "hidden" in node.attributes ||
  node.attributes["aria-hidden"]?.toLowerCase() === "true" ||
  classes(node).some((className) => className === "visually-hidden" || className === "sr-only") ||
  /(?:^|;)\s*(?:display\s*:\s*none|visibility\s*:\s*hidden)\b/i.test(node.attributes.style ?? "");

/** Read static copy and authored visibility. Closed details are readable by opening them. */
export function readPageCopy(html) {
  const blocks = [];
  const faqs = [];
  const questionHeadings = [];
  const ids = new Set();
  let buffer = "";

  function flush(lang, location) {
    const text = normalizeText(buffer);
    if (text) blocks.push({ text, lang, location });
    buffer = "";
  }

  function visit(node, context) {
    if (node.type === TEXT_NODE) {
      buffer += decodeHtml(node.value);
      return;
    }
    if (node.type !== ELEMENT_NODE && node.type !== DOCUMENT_NODE) return;
    if (node.type === DOCUMENT_NODE) {
      node.children.forEach((child) => visit(child, context));
      flush(context.lang, context.location);
      return;
    }
    const { attributes, name } = node;
    if (attributes.id) ids.add(decodeHtml(attributes.id));
    if (hidden(node)) return;
    if (name === "br") {
      buffer += " ";
      return;
    }
    const { lang, location, faq } = context;
    const nextLang = attributes.lang || lang;
    const nextLocation = attributes.id ? `#${attributes.id}` : location;
    const boundary = BLOCKS.has(name) || nextLang !== lang || nextLocation !== location;
    if (boundary) flush(lang, location);
    const firstBlock = blocks.length;
    const nextFaq = name === "details" && classes(node).includes("faq__item") ? { location: nextLocation } : faq;
    node.children.forEach((child) => visit(child, { lang: nextLang, location: nextLocation, faq: nextFaq }));
    if (boundary) flush(nextLang, nextLocation);
    if (/^h[2-4]$/.test(name) || (name === "p" && nextFaq && classes(node).includes("faq__answer"))) {
      const text = blocks.slice(firstBlock).map((block) => block.text).join(" ");
      if (classes(node).includes("faq__q") && nextFaq) {
        nextFaq.q = text;
        nextFaq.lang = /^en\b/i.test(nextLang) ? "en" : nextLang;
      }
      else if (name === "p") Object.assign(nextFaq, { a: text, answerLang: /^en\b/i.test(nextLang) ? "en" : nextLang, kind: attributes["data-answer-kind"] });
      else if (/[?？]$/.test(text)) questionHeadings.push({ text, location: nextLocation });
    }
    if (nextFaq !== faq && nextFaq.q && nextFaq.a) faqs.push(nextFaq);
  }

  visit(parse(html), { lang: "en", location: "" });
  return { blocks, faqs, questionHeadings, ids, text: blocks.map(({ text }) => text).join(" ") };
}

const PHONE = /(?<!\d)(?:\+?91[\s-]*)?[6-9]\d{4}[\s-]?\d{5}(?!\d)/g;
const ROLE_PHONE = /(?:(?<role>restaurant|dining|catering)\s+phone(?:\s+number)?\s*[:?]?\s*|(?:(?<contactRole>restaurant|dining|catering)\s+(?:enquiries|contact)|call\s+(?<callRole>catering|restaurant))\s*:\s*)(?:call\s+)?(?=\+?\d)/gi;
const RESTAURANT_NONVEG = /\bnon[\s-]?veg(?:etarian)?\s+(?:South Indian\s+)?restaurant\b|\b(?:the restaurant|Brihadhee(?:['’]s (?:restaurant|kitchen))?)\s+(?:also\s+)?(?:(?:serves?|offers?|cooks?)\s+(?:meat|eggs?|fish|chicken|mutton)|(?:is|serves?|offers?|cooks?)\s+non[\s-]?veg(?:etarian)?)\b/i;
const CATERING_NONVEG = /\bnon[\s-]?veg(?:etarian)?\s+(?:event\s+|wedding\s+|corporate\s+)?catering\b|\bcatering\s+(?:also\s+)?(?:serves?|offers?|includes?)\s+(?:non[\s-]?veg(?:etarian)?|meat|eggs?|fish|chicken|mutton)\b/i;
const CUSTOMER_COOKS = /\b(?:guests|customers|diners|you)\s+(?:(?:can|will|get to)\s+)?(?:cook|prepare|make|fry)(?:s)?\s+(?:(?:an?|their|your|the)(?:\s+own)?\s+)?(?:customi[sz]ed\s+)?dosas?\b/i;
const SELF_SERVICE = /\bself[- ]service (?:cooking station|dosa (?:station|counter))\b|\bDIY cooking\b|\bcook[- ]your[- ]own dosa\b|\bcustomer[- ]operated dosa counter\b/i;
const EXCLUDED_SELF_SERVICE = /\b(?:not|no|never|isn['’]t)\s+(?:an?\s+|the\s+)?self[- ]service (?:cooking station|dosa (?:station|counter))\b/gi;

const address = getFact("address");
const comparableAddress = (text) => text.toLowerCase().replace(/[.,–-]/g, " ").replace(/\s+/g, " ").trim();
const STREET_NUMBER = /\bW[-–\s]+\d+\b/gi;
const streetNumbers = [...address.line1.matchAll(STREET_NUMBER)].map(([number]) => comparableAddress(number));
const [avenue, block, locality] = getFact("street").split(", ");
const cityLine = `${address.city}, ${address.state} ${address.postalCode}`;
const shortAddresses = [`${block}, ${locality}`, `${block}, ${avenue}, ${locality}`].map((part) => comparableAddress(`${part}, ${cityLine}`));
const hours = getFact("hours");
const CLOCK_12 = String.raw`(?:0?[1-9]|1[0-2])(?::[0-5]\d)?\s*[ap]\.?m\.?`;
const CLOCK_24 = String.raw`(?:[01]?\d|2[0-3]):[0-5]\d`;
const CLOCK = `(?:${CLOCK_12}|${CLOCK_24})`;
const CLOCK_TA = String.raw`(காலை|மதியம்|மாலை|இரவு)\s*(0?[1-9]|1[0-2])(?::([0-5]\d))?\s*மணி`;
const HOUR_RANGE = new RegExp(String.raw`(?<![\d:])(${CLOCK})\s*(?:to|[-–—])\s*(${CLOCK})(?![\d:])`, "gi");
const HOUR_LABEL = new RegExp(String.raw`\b(opens?|closes?|opening(?: time)?|closing(?: time)?)\s*(?:at\s+|is\s+|:\s*)?(${CLOCK})(?![\d:])`, "gi");
const HOUR_RANGE_TA = new RegExp(`${CLOCK_TA}\\s*முதல்\\s*${CLOCK_TA}\\s*வரை`, "g");
const DAY_CLOSED = /\bclosed\s+(?:every\s+|on\s+)?(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)s?\b/i;
const ALL_HOURS = /\b(?:open(?:ing hours)?\s*[:–-]?\s*(?:for\s+)?24[\s-]*hours|open around the clock|open (?:24\s*\/\s*7|all day and night))\b/i;
const clock24 = (time) => {
  const [, hour, minutes = "00", meridiem] = time.match(/(\d+)(?::(\d+))?\s*([ap])?/i);
  const value = meridiem ? Number(hour) % 12 + (meridiem.toLowerCase() === "p" ? 12 : 0) : Number(hour);
  return `${String(value).padStart(2, "0")}:${minutes}`;
};

/** Business contradictions in prose. Link targets and schema are checked separately. */
export function factProblems(text, { allowCateringPurity = IS_CATERING_PURE_VEG } = {}) {
  if (/[?？]$/.test(text)) return [];
  const problems = [];
  const { phone: cateringPhone, whatsapp: cateringWhatsApp } = cateringContacts();
  const restaurant = getFact("phone");
  const allowed = [restaurant, getFact("whatsapp"), cateringPhone, cateringWhatsApp, factOr("careersContact")?.phone]
    .filter(Boolean).map(toE164);
  for (const [raw] of text.matchAll(PHONE)) {
    const digits = raw.replace(/\D/g, "");
    if (!allowed.includes(`+${digits.length === 10 ? "91" + digits : digits}`)) problems.push(`unverified phone number "${raw}"`);
  }
  if (RESTAURANT_NONVEG.test(text)) problems.push("restaurant diet contradicts the verified vegetarian scope");
  if (CATERING_NONVEG.test(text)) problems.push("catering diet contradicts the verified vegetarian scope");
  if (!allowCateringPurity && CATERING_PURITY_CLAIM.test(text)) problems.push("catering purity claim exceeds the verified vegetarian scope (Q20)");
  // The canonical answer expressly excludes self-service. Questions are not claims.
  if (CUSTOMER_COOKS.test(text) || SELF_SERVICE.test(text.replace(EXCLUDED_SELF_SERVICE, ""))) {
    problems.push("dosa preparation must be attributed to the kitchen");
  }
  for (const [raw, opens, closes] of text.matchAll(HOUR_RANGE)) {
    if (clock24(opens) !== hours.opens || clock24(closes) !== hours.closes) problems.push(`hours "${raw}" differ from "${hours.short}"`);
  }
  for (const [raw, openPart, openHour, openMinute = "00", closePart, closeHour, closeMinute = "00"] of text.matchAll(HOUR_RANGE_TA)) {
    const opens = clock24(`${openHour}:${openMinute} ${openPart === "காலை" ? "am" : "pm"}`);
    const closes = clock24(`${closeHour}:${closeMinute} ${closePart === "காலை" ? "am" : "pm"}`);
    if (opens !== hours.opens || closes !== hours.closes) problems.push(`hours "${raw}" differ from "${hours.short}"`);
  }
  for (const [raw, action, value] of text.matchAll(HOUR_LABEL)) {
    if (clock24(value) !== (/^clos/i.test(action) ? hours.closes : hours.opens)) problems.push(`"${raw}" conflicts with the dining hours`);
  }
  const closedDay = text.match(DAY_CLOSED)?.[1];
  if (closedDay && hours.days.some(({ day }) => day.toLowerCase() === closedDay.toLowerCase())) {
    problems.push(`"closed ${closedDay}" conflicts with the verified opening days`);
  }
  if (ALL_HOURS.test(text)) problems.push("round-the-clock opening conflicts with the verified dining hours");
  for (const [raw] of text.matchAll(STREET_NUMBER)) {
    if (!streetNumbers.includes(comparableAddress(raw))) problems.push(`unverified restaurant street number "${raw}"`);
  }
  for (const [raw] of text.matchAll(/\b6\d{5}\b/g)) {
    if (raw !== address.postalCode) problems.push(`unverified restaurant postal code "${raw}"`);
  }
  return problems;
}

export function phoneRoleProblems(text) {
  const problems = [];
  for (const { groups, index, 0: label } of text.matchAll(ROLE_PHONE)) {
    const role = (groups.role ?? groups.contactRole ?? groups.callRole).toLowerCase();
    const [raw] = text.slice(index + label.length).match(PHONE) ?? [];
    const expected = role === "catering" ? cateringContacts().phone : getFact("phone");
    if (raw && raw.replace(/\D/g, "").slice(-10) !== expected?.replace(/\D/g, "").slice(-10)) {
      problems.push(`${role} phone "${raw}" differs from the approved contact for that role`);
    }
  }
  return problems;
}

const DESCRIPTOR = /\b100\s*%\s*pure\s+vegetarian\b|100\s*%\s*சுத்த\s+சைவ/gi;
function addressCount(text) {
  const count = [...text.matchAll(STREET_NUMBER)].filter(([number]) => comparableAddress(number) === streetNumbers[0]).length;
  const normalized = comparableAddress(text);
  return count + shortAddresses.reduce((total, short) => total + normalized.split(short).length - 1, 0);
}

export function pageCopyProblems(copy) {
  const problems = copy.blocks.flatMap(({ text, location }, index) => {
    const next = copy.blocks[index + 1];
    const labelAndValue = next?.location === location && /^(?:restaurant|dining|catering)\s+phone$/i.test(text)
      ? `${text} ${next.text}` : text;
    return [...factProblems(text), ...phoneRoleProblems(labelAndValue)]
      .map((message) => ({ rule: "facts", message, location }));
  });
  // Count a street address printed with line breaks or split across neighbouring blocks.
  const addressTotal = Math.max(addressCount(copy.text), copy.blocks.reduce((n, { text }) => n + addressCount(text), 0));
  if (addressTotal > 1) problems.push({ rule: "density", message: `physical address appears ${addressTotal} times (max 1)` });
  const normalized = comparableAddress(copy.text);
  const streetLocation = copy.blocks.find(({ text }) => [...text.matchAll(STREET_NUMBER)]
    .some(([number]) => comparableAddress(number) === streetNumbers[0]));
  if (streetLocation && !normalized.includes(comparableAddress(addressLine()))) {
    const { location } = streetLocation;
    problems.push({ rule: "facts", message: `street address must match "${addressLine()}"`, location });
  }
  const byLang = new Map();
  for (const { text, lang } of copy.blocks) {
    const count = [...text.matchAll(DESCRIPTOR)].length;
    const language = lang.toLowerCase().split("-")[0];
    byLang.set(language, (byLang.get(language) ?? 0) + count);
  }
  for (const [lang, count] of byLang) {
    if (count > 2) problems.push({ rule: "density", message: `vegetarian descriptor appears ${count} times in ${lang} copy (max 2)` });
  }
  return problems;
}

export function cateringRelationshipProblems(service, { shared = false } = {}) {
  const problems = [];
  if (service["@type"] !== "Service") problems.push("catering entity must use Schema.org Service");
  if (service.provider?.["@id"] !== RESTAURANT_ID) problems.push(`Service.provider must reference ${RESTAURANT_ID}`);
  if (shared) {
    if (service["@id"] !== CATERING_ID) problems.push(`shared catering @id must be ${CATERING_ID}`);
  } else if (service.isRelatedTo?.["@id"] !== CATERING_ID) {
    problems.push(`Service.isRelatedTo must reference ${CATERING_ID}`);
  }
  if (["address", "geo", "openingHoursSpecification", "openingHours", "hasMenu", "priceRange"].some((property) => property in service)) {
    problems.push("Service must keep restaurant location, hours and dining claims on the Restaurant entity");
  }
  return problems;
}

export function llmsProblems(body, { expectedAnswers, knownLinks, requiredLinks, full = false }) {
  const problems = [];
  const name = getFact("name");
  const [heading, summary, label, answers] = body.split("\n\n", 4);
  if (heading !== `# ${name}${full ? " (full reference)" : ""}` || !/^> [^\n]+$/.test(summary ?? "") || label !== "**Canonical answers**") {
    problems.push("expected H1, one-line summary and canonical answers label before the link sections");
  }
  if (answers !== expectedAnswers.join("\n")) problems.push("canonical answers are stale, incomplete or out of order");
  const links = new Set();
  for (const [, raw] of body.matchAll(/\[[^\]\n]+\]\(([^)\n]*)\)/g)) {
    links.add(raw);
    if (!raw.startsWith(`${SITE_ORIGIN}/`) || !knownLinks.has(raw)) problems.push(`link does not target a built canonical page, asset or anchor: ${raw}`);
  }
  for (const link of requiredLinks) if (!links.has(link)) problems.push(`missing canonical link: ${link}`);
  for (const line of body.split("\n")) {
    const answer = line.replace(/^- [^?]+\?\s+/, "");
    problems.push(...factProblems(answer), ...phoneRoleProblems(answer));
  }
  return problems;
}
