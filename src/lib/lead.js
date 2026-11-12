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
};

export const HEADCOUNTS = ["Under 50", "50 to 100", "100 to 300", "300 to 600", "600 to 1,000", "1,000 to 1,500", "1,500+"];

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
  for (const [key, f] of Object.entries(FIELDS)) {
    lead[key] = clean(input[key], f.max);
    if (f.required && !lead[key]) errors[key] = `${f.label} is required`;
  }

  lead.formType = Object.hasOwn(FORM_TYPES, input.formType) ? input.formType : "general";

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
    ...Object.entries(FIELDS)
      .filter(([key]) => lead[key])
      .map(([key, f]) => `${f.label}: ${lead[key]}`),
  ].join("\n");
}
