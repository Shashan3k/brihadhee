/**
 * Lead capture shared by the form components and the Vercel function that
 * receives submissions (api/lead.js).
 *
 * validateLead() is the server-side gate: it trims, length-limits and checks every
 * field, and rejects submissions that fill the honeypot.
 */

export const FORM_TYPES = {
  corporate: "Corporate catering",
  event: "Event catering",
  planner: "Event planner partnership",
  general: "General enquiry",
  quote: "Catering quote",
};

// Keep the client bundle independent of internal verification notes. The lead
// tests compare both boundaries with config/client-verification.json.
export const QUOTE_MIN_GUESTS = 50;
export const QUOTE_MAX_GUESTS = 1500;

/** Bands accepted from previously rendered forms. */
export const HEADCOUNTS = ["50 to 100", "100 to 300", "300 to 600", "600 to 1,000", "1,000 to 1,500", "1,500+"];
const LEGACY_EVENT_HEADCOUNTS = HEADCOUNTS.filter((band) => !band.endsWith("+"));

/* ---- Quote builder (/catering-quote-chennai/) ----------------------------------
 * The fields the client asked for on the Wf call: event type, lunch or dinner,
 * occasion, headcount, the spend in mind, must-have dishes and whether service is
 * needed. No per-plate rupee figure appears anywhere: the spend options are tiers. */
export const QUOTE_EVENT_TYPES = ["Wedding", "Birthday", "Housewarming", "Engagement", "Baby shower", "Ear-piercing ceremony", "Get-together", "Other event"];
export const QUOTE_MEALS = ["Lunch", "Dinner", "Not sure yet"];
export const QUOTE_SPEND = [
  "Simple meal",
  "Festive spread",
  "Grand spread with live counters",
  "Not sure yet: suggest options",
];
export const QUOTE_SERVICE = ["Serving staff requested", "No serving staff requested", "Not sure yet"];
export const CORPORATE_STAFFED_EVENT = "One-off staffed office event";
export const CORPORATE_SERVICE = ["Recurring office meals", CORPORATE_STAFFED_EVENT, "One-off packed lunch order", "Not sure yet"];

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

const eventService = { label: "Serving staff preference", max: 40, required: false, oneOf: QUOTE_SERVICE };
const RESTAURANT_FIELDS = {
  ...FIELDS,
  organisation: { ...FIELDS.organisation, required: false },
  email: { ...FIELDS.email, label: "Email" },
  location: { ...FIELDS.location, required: false },
  headcount: { ...FIELDS.headcount, label: "Party size", required: false },
  date: { ...FIELDS.date, label: "Visit date" },
  message: { ...FIELDS.message, label: "Enquiry" },
};
const EVENT_FIELDS = {
  ...FIELDS,
  organisation: { ...FIELDS.organisation, label: "Event type" },
  email: { ...FIELDS.email, label: "Email" },
  location: { ...FIELDS.location, label: "Venue area in Chennai" },
  headcount: { ...FIELDS.headcount, label: "Estimated guests" },
  date: { ...FIELDS.date, label: "Event date" },
  service: eventService,
};
const PLANNER_FIELDS = {
  ...EVENT_FIELDS,
  organisation: { ...FIELDS.organisation, label: "Agency or company" },
  eventType: { label: "Event type", max: 120, required: false },
  service: { label: "Service requirements", max: 120, required: false },
};
const CORPORATE_FIELDS = {
  ...FIELDS,
  organisation: { ...FIELDS.organisation, label: "Company name" },
  headcount: { ...FIELDS.headcount, label: "Estimated meal count" },
  date: { ...FIELDS.date, label: "Preferred start or event date" },
  service: { label: "Catering requirement", max: 40, required: true, oneOf: CORPORATE_SERVICE },
};

/** Fields of the quote builder (formType "quote"). */
export const QUOTE_FIELDS = {
  name: { label: "Name", max: 80, required: true },
  phone: { label: "Phone", max: 20, required: true },
  email: { label: "Email", max: 120, required: false },
  eventType: { label: "Event type", max: 40, required: true, oneOf: QUOTE_EVENT_TYPES },
  meal: { label: "Meal", max: 20, required: true, oneOf: QUOTE_MEALS },
  occasion: { label: "Occasion", max: 120, required: false },
  guests: { label: "Guests", max: 20, required: true },
  date: { label: "Event date", max: 10, required: false },
  location: { label: "Venue area in Chennai", max: 120, required: true },
  spend: { label: "Spend in mind", max: 60, required: false, oneOf: QUOTE_SPEND },
  mustHave: { label: "Must-have dishes", max: 600, required: false },
  service: eventService,
  message: { label: "Venue and service notes", max: 1000, required: false },
};

const FIELDS_BY_FORM = {
  general: RESTAURANT_FIELDS,
  event: EVENT_FIELDS,
  planner: PLANNER_FIELDS,
  corporate: CORPORATE_FIELDS,
  quote: QUOTE_FIELDS,
};

export const HONEYPOT = "website";

const clean = (value, max) => {
  if (typeof value !== "string" && typeof value !== "number") return "";
  return String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
};

/** A relative page on this site, suitable for the email and form return link. */
export const leadPage = (value) =>
  typeof value === "string" && value.length <= 200 && /^\/(?:[\w-]+\/)*[\w-]*$/.test(value) ? value : "/";

/** Indian mobile or landline: 10 digits after an optional +91 / 0. */
const phoneDigits = (v) => {
  const compact = v.replace(/[\s().-]/g, "");
  return /^(?:(?:\+?91)|0)?\d{10}$/.test(compact) ? compact.slice(-10) : null;
};

const indiaCalendar = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
});

export function indiaDate(now = Date.now()) {
  const parts = Object.fromEntries(indiaCalendar.formatToParts(now).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

const isRealDate = (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
};

const eventGuestError = (count) => {
  if (count < QUOTE_MIN_GUESTS) return `Brihadhee caters events from ${QUOTE_MIN_GUESTS} guests`;
  if (count > QUOTE_MAX_GUESTS) return `Enter a guest count up to ${QUOTE_MAX_GUESTS.toLocaleString("en-IN")}`;
  return "";
};

// Earlier quote forms sent these choices with a startedAt field. Preserve those
// submissions during rollout while keeping the updated choices focused on event enquiries.
const LEGACY_QUOTE_CHOICES = {
  eventType: { Corporate: "Corporate", "Small function / get-together": "Get-together" },
  service: { "Yes, with serving staff": QUOTE_SERVICE[0], "No, food only": QUOTE_SERVICE[1] },
};

/**
 * Validate a submitted lead.
 * @param {Record<string, unknown>} input  raw form fields
 * @param {{ now?: number }} [opts]
 * @returns {{ ok: true, lead: object } | { ok: false, spam?: true, errors: Record<string, string> }}
 */
export function validateLead(input, { now = Date.now() } = {}) {
  const errors = {};

  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, errors: {} };
  if (clean(input[HONEYPOT], 200)) return { ok: false, spam: true, errors: {} };

  const formType = typeof input.formType === "string" && Object.hasOwn(FORM_TYPES, input.formType) ? input.formType : "general";
  const lead = { formType };
  const legacyQuote = formType === "quote" && Object.hasOwn(input, "startedAt");
  const legacyCorporate = formType === "corporate" && Object.hasOwn(input, "startedAt") && !Object.hasOwn(input, "service") && HEADCOUNTS.includes(input.headcount);
  for (const [key, field] of Object.entries(FIELDS_BY_FORM[formType])) {
    const raw = clean(input[key]);
    const choices = legacyQuote && LEGACY_QUOTE_CHOICES[key];
    const legacyChoice = choices && Object.hasOwn(choices, raw) ? choices[raw] : "";
    lead[key] = legacyChoice || raw.slice(0, field.max);
    if (field.required && !raw && !(legacyCorporate && key === "service")) errors[key] = `${field.label} is required`;
    else if (raw && field.oneOf && !legacyChoice && !field.oneOf.includes(raw)) errors[key] = `Choose a ${field.label.toLowerCase()} option`;
  }

  const countField = formType === "quote" ? "guests" : "headcount";
  const count = clean(input[countField]);
  const usesEventRange = formType !== "corporate" || lead.service === CORPORATE_STAFFED_EVENT;
  if (count) {
    if (formType === "general") {
      if (HEADCOUNTS.includes(count)) {
        lead.headcount = count;
      } else if (!/^\d+$/.test(count) || !Number.isSafeInteger(Number(count)) || Number(count) < 1) {
        errors.headcount = "Enter a positive whole number";
      } else {
        lead.headcount = String(Number(count));
      }
    } else if (!legacyCorporate && !(formType === "event" && Object.hasOwn(input, "startedAt") && LEGACY_EVENT_HEADCOUNTS.includes(count))) {
      const number = Number(count);
      const rangeError = usesEventRange ? eventGuestError(number) : "";
      if (!/^\d+$/.test(count) || !Number.isSafeInteger(number)) errors[countField] = "Enter a whole number";
      else if (rangeError) errors[countField] = rangeError;
      else if (!usesEventRange && number < 1) errors[countField] = "Enter a meal count of at least 1";
      else lead[countField] = String(number);
    }
  }
  if (formType === "general" && !lead.message && !lead.headcount && !lead.organisation) {
    errors.message = "Tell us what you would like to ask the restaurant";
  }

  if (lead.phone) {
    const d = phoneDigits(clean(input.phone));
    if (!d) errors.phone = "Enter a 10-digit Indian phone number";
    else lead.phone = `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  }
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) errors.email = "Enter a valid email address";
  if (lead.source && !SOURCES.includes(clean(input.source))) errors.source = "Choose an option";
  if (lead.date) {
    if (!isRealDate(clean(input.date))) errors.date = "Enter a valid date";
    else if (lead.date < indiaDate(now)) errors.date = "Choose a date from today onwards";
  }

  lead.page = leadPage(input.page);

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, lead };
}

/** Plain-text summary of a lead (email body and WhatsApp hand-off). */
export function leadSummary(lead) {
  return [
    `${FORM_TYPES[lead.formType]} enquiry from the website (${lead.page})`,
    "",
    ...Object.entries(FIELDS_BY_FORM[lead.formType])
      .filter(([key]) => lead[key])
      .map(([key, f]) => `${f.label}: ${lead[key]}`),
  ].join("\n");
}

/** Email subject line for a lead. */
export function leadSubject(lead) {
  const size = lead.formType === "quote" ? `${lead.guests} guests` : lead.headcount;
  return `${FORM_TYPES[lead.formType]}: ${lead.name}${size ? `, ${size}` : ""}${lead.location ? ` (${lead.location})` : ""}`.replace(/[\r\n\t]+/g, " ");
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
