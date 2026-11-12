/**
 * Lead capture: the ONE definition of the quote/enquiry form, shared by the form
 * component (src/components/LeadForm.astro) and the Vercel function that receives
 * it (api/lead.js). Plain JavaScript with no imports, so both can load it.
 *
 * validateLead() is the server-side gate: it trims, length-limits and checks every
 * field, and rejects bots (filled honeypot, or submitted faster than a person can).
 */

export const FORM_TYPES = {
  corporate: "Corporate catering",
  event: "Event catering",
  general: "General enquiry",
  quote: "Catering quote",
};

/** Catering minimum (client, Wf call). Must equal CATERING_MIN_GUESTS in config/seo-gates.ts
 *  (scripts/verify-seo-compliance.ts checks it); kept as a literal so this file has no imports. */
export const QUOTE_MIN_GUESTS = 50;
export const QUOTE_MAX_GUESTS = 20000;

/** No band under the 50-guest minimum (keyword plan section 7). */
export const HEADCOUNTS = ["50 to 100", "100 to 300", "300 to 600", "600 to 1,000", "1,000 to 1,500", "1,500+"];

/* ---- Quote builder (/catering-quote-chennai/) ----------------------------------
 * The fields the client asked for on the Wf call: event type, lunch or dinner,
 * occasion, headcount, the spend in mind, must-have dishes and whether service is
 * needed. No per-plate rupee figure appears anywhere: the spend options are tiers. */
export const QUOTE_EVENT_TYPES = ["Corporate", "Wedding", "Birthday", "Small function / get-together"];
export const QUOTE_MEALS = ["Lunch", "Dinner"];
export const QUOTE_SPEND = [
  "Simple meal",
  "Festive spread",
  "Grand spread with live counters",
  "Not sure yet: suggest options",
];
export const QUOTE_SERVICE = ["Yes, with serving staff", "No, food only"];

export const SOURCES = [
  "Google Search",
  "Google Maps",
  "AI Assistant: ChatGPT, Gemini, Perplexity",
  "Instagram",
  "Swiggy Dineout, EazyDiner or District",
  "Friend or colleague",
  "Ate at the restaurant",
  "Other",
];

/** Field limits. `required` fields must be present for every form type. */
export const FIELDS = {
  name: { label: "Name", max: 80, required: true },
  organisation: { label: "Company / Event type", max: 120, required: true },
  phone: { label: "Phone", max: 20, required: true },
  email: { label: "Work email", max: 120, required: false },
  location: { label: "Location in Chennai", max: 120, required: true },
  headcount: { label: "Estimated headcount", max: 20, required: true },
  date: { label: "Service date", max: 10, required: false },
  source: { label: "How did you hear about us?", max: 60, required: false },
  message: { label: "Anything else", max: 1000, required: false },
};

/** Fields of the quote builder (formType "quote"). */
export const QUOTE_FIELDS = {
  name: { label: "Name", max: 80, required: true },
  phone: { label: "Phone", max: 20, required: true },
  email: { label: "Email", max: 120, required: false },
  eventType: { label: "Event type", max: 40, required: true, oneOf: QUOTE_EVENT_TYPES },
  meal: { label: "Lunch or dinner", max: 10, required: true, oneOf: QUOTE_MEALS },
  occasion: { label: "Occasion", max: 120, required: false },
  guests: { label: "Guests", max: 6, required: true },
  date: { label: "Event date", max: 10, required: false },
  location: { label: "Venue area in Chennai", max: 120, required: true },
  spend: { label: "Spend in mind", max: 60, required: false, oneOf: QUOTE_SPEND },
  mustHave: { label: "Must-have dishes", max: 600, required: false },
  service: { label: "Serving staff", max: 40, required: true, oneOf: QUOTE_SERVICE },
};

const fieldsFor = (formType) => (formType === "quote" ? QUOTE_FIELDS : FIELDS);

/** Seconds a person needs at minimum to fill the form; faster posts are bots. */
export const MIN_FILL_SECONDS = 3;
export const HONEYPOT = "website";

const clean = (v, max) =>
  String(v ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);

/** Indian mobile or landline: 10 digits after an optional +91 / 0. */
const phoneDigits = (v) => {
  const d = String(v).replace(/\D/g, "");
  if (/^(?:91)?[6-9]\d{9}$/.test(d)) return d.slice(-10);
  if (/^0?\d{10}$/.test(d)) return d.slice(-10);
  return null;
};

/**
 * Validate a submitted lead.
 * @param {Record<string, unknown>} input  raw form fields
 * @param {{ now?: number }} [opts]
 * @returns {{ ok: true, lead: object } | { ok: false, spam?: true, errors: Record<string, string> }}
 */
export function validateLead(input, { now = Date.now() } = {}) {
  const errors = {};

  // Bots: a filled honeypot, or a post faster than MIN_FILL_SECONDS after the page loaded.
  if (clean(input[HONEYPOT], 200)) return { ok: false, spam: true, errors: {} };
  const started = Number(input.startedAt);
  if (!Number.isFinite(started) || now - started < MIN_FILL_SECONDS * 1000) return { ok: false, spam: true, errors: {} };

  const lead = {};
  lead.formType = Object.hasOwn(FORM_TYPES, input.formType) ? input.formType : "general";
  for (const [key, f] of Object.entries(fieldsFor(lead.formType))) {
    lead[key] = clean(input[key], f.max);
    if (f.required && !lead[key]) errors[key] = `${f.label} is required`;
    else if (lead[key] && f.oneOf && !f.oneOf.includes(lead[key])) errors[key] = `Choose a ${f.label.toLowerCase()} option`;
  }
  if (lead.formType === "quote" && lead.guests) {
    const n = Number(lead.guests);
    if (!Number.isInteger(n)) errors.guests = "Enter the number of guests";
    else if (n < QUOTE_MIN_GUESTS) errors.guests = `Brihadhee caters functions from ${QUOTE_MIN_GUESTS} guests`;
    else if (n > QUOTE_MAX_GUESTS) errors.guests = "Enter the number of guests";
    else lead.guests = String(n);
  }

  if (lead.phone) {
    const d = phoneDigits(lead.phone);
    if (!d) errors.phone = "Enter a 10-digit Indian phone number";
    else lead.phone = `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  }
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) errors.email = "Enter a valid email address";
  if (lead.headcount && !HEADCOUNTS.includes(lead.headcount)) errors.headcount = "Choose a headcount";
  if (lead.source && !SOURCES.includes(lead.source)) errors.source = "Choose an option";
  if (lead.date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lead.date) || Number.isNaN(Date.parse(`${lead.date}T00:00:00Z`))) errors.date = "Enter a valid date";
    else if (Date.parse(`${lead.date}T23:59:59Z`) < now - 86_400_000) errors.date = "Choose a date from today onwards";
  }

  const page = clean(input.page, 200);
  lead.page = /^\/[\w\-/]*$/.test(page) ? page : "/";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, lead };
}

/** Plain-text summary of a lead (email body and WhatsApp hand-off). */
export function leadSummary(lead) {
  return [
    `${FORM_TYPES[lead.formType]} enquiry from the website (${lead.page})`,
    "",
    ...Object.entries(fieldsFor(lead.formType))
      .filter(([key]) => lead[key])
      .map(([key, f]) => `${f.label}: ${lead[key]}`),
  ].join("\n");
}

/** Email subject line for a lead. */
export function leadSubject(lead) {
  const size = lead.formType === "quote" ? `${lead.guests} guests` : lead.headcount;
  return `${FORM_TYPES[lead.formType]}: ${lead.name}, ${size} (${lead.location})`;
}

/**
 * WhatsApp message for the quote builder, used when ENABLE_LIVE_WHATSAPP_QUOTE_FORM
 * is on (config/seo-gates.ts). Takes raw form fields; only quote fields are used.
 */
export function quoteWhatsAppText(fields) {
  const lines = ["Hi Brihadhee, I'd like a catering quote."];
  for (const [key, f] of Object.entries(QUOTE_FIELDS)) {
    const v = clean(fields[key], f.max);
    if (v) lines.push(`${f.label}: ${v}`);
  }
  return lines.join("\n");
}
