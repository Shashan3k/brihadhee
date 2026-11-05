/**
 * Catering content (Pillar 2), derived from config/client-verification.json
 * and the confirmed `catering` fact in src/data/facts.js. Every block is
 * empty/null unless its flag is confirmed, and the page renders nothing for it.
 *
 * Allowed values (see config/client-verification.json `_allowed_values`):
 *   confirmed_events: house_function, pooja, birthday, baby_shower, housewarming,
 *                     ear_piercing, engagement, wedding, small_wedding, small_events
 *   menu_formats:     south_indian_meals, tiffin, snack_boxes, banana_leaf_service,
 *                     live_counters, regional_menus
 *   prep_mode:        restaurant_delivered | on_site
 *   pricing_model:    per_plate | on_request
 *
 * Guardrail: no corporate or office-lunch vendor content (client decision).
 */
import verification from "../../config/client-verification.json";
import { site } from "./site.js";
import { getFact, factOr } from "./facts.js";
import { pageGraph, cateringServiceSchema, faqPageSchema, HOME_CRUMBS } from "../lib/schema.js";

const v = verification;

export const cateringEnabled = v.offer_catering === true;
export const CATERING_PATH = "/catering-services-chennai/";
export const PLANNER_PATH = "/event-planner-catering-partner/";

const cat = factOr("catering", null);
const liveCounters = cat?.liveCounters ?? [];

const EVENTS = {
  house_function: { label: "House functions", inline: "house functions", text: "Family functions at home, with a regional vegetarian menu." },
  pooja: { label: "Pooja", inline: "poojas", text: "Pooja and religious functions with a pure vegetarian menu." },
  baby_shower: { label: "Seemantham (baby shower)", inline: "seemantham (baby shower)", text: "Seemantham and valaikaapu functions, with traditional South Indian dishes." },
  housewarming: { label: "Gruhapravesam (housewarming)", inline: "gruhapravesam (housewarming)", text: "Gruhapravesam catering with a traditional pure vegetarian spread." },
  ear_piercing: { label: "Ear piercing ceremonies", inline: "ear piercing ceremonies", text: "Ear piercing (kaadhu kuthu) functions for family and guests." },
  engagement: { label: "Betrothals and engagements", inline: "betrothals", text: "Betrothal and engagement functions, with live counters if you want them." },
  wedding: { label: "Boutique weddings", inline: "boutique weddings", text: "Boutique and mid-size weddings, with regional menus and live counters." },
  small_wedding: { label: "Small weddings", inline: "small weddings", text: "Small weddings with a regional vegetarian menu." },
  birthday: { label: "Birthday parties", inline: "birthday parties", text: "Birthday parties at home or at a hall, including live dosa counters." },
  small_events: { label: "Small events", inline: "small events", text: "Small functions and get-togethers." },
};

const FORMATS = {
  live_counters: {
    label: "Live food counters",
    text: `Live counters for ${liveCounters.join(", ")}, run by the Brihadhee kitchen team at your venue.`,
    photo: { file: "dosa.jpg", alt: "Dosa from the Brihadhee kitchen, the kind served at a live dosa counter" },
  },
  regional_menus: {
    label: "Regional vegetarian menus",
    text: "Menus built around Tirunelveli (Nellai) and Karaikudi dishes, from sodhi meals to karupatti ulundhu kali, customised for your event.",
    photo: { file: "meals.jpg", alt: "Regional South Indian vegetarian meal from the Brihadhee kitchen, served on a banana leaf" },
  },
  south_indian_meals: {
    label: "South Indian meals",
    text: "Vegetarian meals, served the way the restaurant serves them.",
    photo: { file: "meals.jpg", alt: "South Indian meal served on a banana leaf with rice, papad and sides, from the Brihadhee kitchen" },
  },
  tiffin: {
    label: "Tiffin",
    text: "Tiffin for events, such as idiyappam and dosa.",
    photo: { file: "tiffin.jpg", alt: "Idiyappam served with coconut milk on a banana leaf, from the Brihadhee kitchen" },
  },
  snack_boxes: {
    label: "Snack boxes",
    text: "Snack boxes for small gatherings.",
    photo: null,
    placeholderAlt: "Photo of a Brihadhee snack box to be added",
  },
  banana_leaf_service: {
    label: "Full banana-leaf service",
    text: "A traditional full banana-leaf meal.",
    photo: { file: "meals.jpg", alt: "South Indian meal served on a round banana leaf at Brihadhee" },
  },
};

const list = (a) => (Array.isArray(a) ? a : []);
const known = (map, ids) => Object.keys(map).filter((id) => list(ids).includes(id));
export const joinNatural = (items) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

const eventIds = cateringEnabled ? known(EVENTS, v.confirmed_events) : [];
const formatIds = cateringEnabled ? known(FORMATS, v.menu_formats) : [];
const areas = cateringEnabled ? list(v.service_area).filter(Boolean) : [];
const min = Number.isFinite(v.min_guests) ? v.min_guests : null;
const max = Number.isFinite(v.max_guests) ? v.max_guests : null;
const guestRange = cateringEnabled && min !== null && max !== null && min <= max ? { min, max } : null;
const fmt = (n) => n.toLocaleString("en-IN");

/* Catering contact: the catering numbers if different, else the restaurant's. */
const ch = v.enquiry_channels ?? {};
function resolveChannel(own, restaurant) {
  if (!cateringEnabled) return null;
  if (ch.is_different_from_restaurant === true) return own || null;
  if (ch.is_different_from_restaurant === false) return own || restaurant || null;
  return null;
}
const phone = resolveChannel(ch.phone, site.contact.phone);
const whatsapp = resolveChannel(ch.whatsapp, site.contact.whatsapp);

export const contact = {
  phone,
  whatsapp,
  telHref: phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : "",
  whatsappHref: whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : "",
  any: Boolean(phone || whatsapp),
};

/* ---- Section data (null/empty = section hidden) ----------------------- */

export const opening = eventIds.length
  ? `Brihadhee provides pure vegetarian catering for ${joinNatural(
      eventIds.map((id) => EVENTS[id].inline)
    )} across ${joinNatural(areas.length ? areas : ["Chennai"])}, from its kitchen in Anna Nagar East.`
  : null;

export const entityLine = cateringEnabled
  ? "Brihadhee is a pure vegetarian restaurant and caterer on 3rd Avenue, W-Block, Anna Nagar East, Chennai 600040, near Anna Nagar Tower Park."
  : null;

export const events = eventIds.map((id) => ({ label: EVENTS[id].label, text: EVENTS[id].text }));
export const formats = formatIds.map((id) => ({ id, ...FORMATS[id] }));
export { liveCounters };
export const plannerModels = cat?.plannerModels ?? [];
export const pricingText = cat?.pricing ?? null;

const prepText =
  v.prep_mode === "restaurant_delivered"
    ? "We prepare the food in our Anna Nagar East kitchen and deliver it to you."
    : v.prep_mode === "on_site"
      ? "We cook on site at your venue."
      : null;
const serviceTail =
  v.staff_serving_cleanup_included === true
    ? " Serving staff and clean-up are included."
    : v.staff_serving_cleanup_included === false
      ? " Serving and clean-up are arranged by you."
      : "";

/* How it works needs a way to enquire and a known preparation mode. */
export const steps =
  contact.any && prepText
    ? [
        { title: "Enquiry", text: "Call us with your event, date and number of guests." },
        { title: "Menu selection", text: "Choose your regional menu and live counters." },
        { title: "Confirmation", text: "We confirm the menu, per-plate price and date with you." },
        { title: "Service", text: `${prepText}${serviceTail}` },
      ]
    : [];
export const advanceNotice =
  cateringEnabled && typeof v.advance_notice_required === "string" && v.advance_notice_required
    ? v.advance_notice_required
    : null;
export const freshlyPrepared = cateringEnabled && prepText !== null;

export const guests = guestRange
  ? {
      range: `Brihadhee caters for ${fmt(guestRange.min)} to ${fmt(guestRange.max)} guests.`,
      min: guestRange.min,
      max: guestRange.max,
      examples: [
        guestRange.min <= 50 && "Catering for 50 guests in Chennai",
        guestRange.min <= 100 && guestRange.max >= 100 && "Catering for 100 guests in Anna Nagar",
        guestRange.max >= 500 && "Catering for 500 guests in Chennai",
      ].filter(Boolean),
    }
  : null;
export const serviceAreas = areas;

export const plannerSection = cateringEnabled && contact.any;

/* ---- FAQ (flagship page): direct answer first, 40 to 60 words ---------- */
const faq = [];
const add = (question, answer) => faq.push({ question, answer });
const addr = () =>
  `${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.state} ${site.address.postalCode}`;

if (cateringEnabled) {
  add(
    "Does Brihadhee offer catering in Chennai?",
    `Yes, Brihadhee offers pure vegetarian event and function catering across ${joinNatural(areas)} from its restaurant kitchen in Anna Nagar East. ` +
      `It caters ${joinNatural(eventIds.map((id) => EVENTS[id].inline))}${guestRange ? `, for ${fmt(guestRange.min)} to ${fmt(guestRange.max)} guests` : ""}.`
  );
  if (formatIds.length) {
    add(
      "What kind of catering does Brihadhee provide?",
      `Brihadhee provides pure vegetarian catering with ${joinNatural(formatIds.map((id) => FORMATS[id].label.toLowerCase()))}, prepared by its Anna Nagar East kitchen. ` +
        (liveCounters.length ? `Live counters include ${joinNatural(liveCounters)}, and menus can mix South Indian, North Indian and Indo-Chinese dishes.` : "")
    );
    add(
      "Is Brihadhee catering pure vegetarian?",
      "Yes, Brihadhee catering is 100% pure vegetarian, from the same kitchen as its pure vegetarian restaurant in Anna Nagar East, Chennai. " +
        "Menus can include Tirunelveli and Karaikudi specialties, North Indian and Indo-Chinese dishes, with no non-vegetarian items."
    );
  }
  if (eventIds.length) {
    add(
      "Which events does Brihadhee cater?",
      `Brihadhee caters ${joinNatural(eventIds.map((id) => EVENTS[id].inline))} in ${joinNatural(areas)}, from its pure vegetarian kitchen in Anna Nagar East. ` +
        "Families can book directly, and event management companies can book Brihadhee as their catering partner."
    );
  }
  if (guestRange) {
    add(
      "How many guests can Brihadhee cater for?",
      `Brihadhee can cater for ${fmt(guestRange.min)} to ${fmt(guestRange.max)} guests, which covers home functions, mid-size halls and boutique weddings in ${joinNatural(areas)}. ` +
        "Live counters for dosa, parotta and Nellai sodhi can be added to the menu for any of these events."
    );
  }
  if (areas.length) {
    add(
      "Does Brihadhee cater outside Anna Nagar?",
      `Yes, Brihadhee caters events across ${joinNatural(areas)}, not only in Anna Nagar, from its restaurant kitchen on 3rd Avenue, W-Block, Anna Nagar East. ` +
        "Tell the team your venue and date when you call, and they will confirm the menu and per-plate price."
    );
  }
  if (contact.any) {
    add(
      "How do I book catering with Brihadhee?",
      `To book pure vegetarian catering with Brihadhee, call ${contact.phone} with your event type, date, venue and number of guests. ` +
        "The team will suggest a regional menu and live counters, then confirm the per-plate price and the booking with you."
    );
  }
  if (v.pricing_model === "per_plate") {
    add(
      "How is Brihadhee catering priced?",
      `Brihadhee prices catering per plate, quoted for the menu and live counters you choose, so you know the full cost before you confirm. ` +
        `Call ${contact.phone ?? "the restaurant"} with your guest count and menu to get the per-plate quote for your event.`
    );
  }
  add(
    "Where is Brihadhee located?",
    `Brihadhee is at ${addr()}, near Anna Nagar Tower Park. ` +
      "Families and event planners can visit the restaurant to taste the menu before booking catering for their function."
  );
}
export const faqs = faq;

/* ---- FAQ (event planner page) ----------------------------------------- */
const plannerFaq = [];
if (cateringEnabled) {
  plannerFaq.push(
    {
      question: "Which pure veg caterer in Chennai works with event managers on boutique functions?",
      answer:
        `Brihadhee, a pure vegetarian restaurant in Anna Nagar East, works with event management companies across ${joinNatural(areas)} on boutique functions and weddings for ${guestRange ? `${fmt(guestRange.min)} to ${fmt(guestRange.max)}` : "your"} guests. ` +
        `It offers ${joinNatural(plannerModels)}, regional menus and per-plate pricing.`,
    },
    {
      question: "Can Brihadhee run white-label or co-branded live counters for my event company?",
      answer:
        `Yes, Brihadhee runs ${joinNatural(plannerModels)} for event management companies, so the counter can carry your brand or both brands. ` +
        `Counters include ${joinNatural(liveCounters)}, cooked by the Brihadhee kitchen team at the venue.`,
    },
    {
      question: "Why do event planners choose a boutique caterer like Brihadhee?",
      answer:
        "Event planners choose Brihadhee for menus that can be customised for each client, live counters for dosa, parotta and Nellai sodhi, and per-plate pricing quoted before booking. " +
        "Planners deal directly with the Brihadhee team, from the first menu call to the event day.",
    },
    {
      question: "How do event managers start a catering partnership with Brihadhee?",
      answer:
        `Event managers can start a partnership with Brihadhee by calling ${contact.phone ?? "the restaurant"} with an upcoming event, guest count and venue. ` +
        "The team will propose a regional menu, live counters and per-plate pricing for the event, and confirm the booking with you.",
    }
  );
}
export const plannerFaqs = plannerFaq;

/* ---- Page metadata ----------------------------------------------------- */
export const meta = {
  title: "Pure Veg Event Catering in Chennai | Brihadhee, Anna Nagar",
  description: `Pure vegetarian catering by Brihadhee, Anna Nagar East: seemantham, gruhapravesam, ear piercing, betrothals, boutique weddings and birthdays${guestRange ? `, ${fmt(guestRange.min)} to ${fmt(guestRange.max)} guests` : ""}, with live dosa and parotta counters.`,
  h1: "Pure Vegetarian Event and Wedding Catering in Chennai",
  keywords: [
    "Brihadhee catering",
    "pure veg catering Chennai",
    "vegetarian catering Anna Nagar",
    "seemantham catering Chennai",
    "gruhapravesam catering Chennai",
    "live dosa counter catering Chennai",
    "சைவ கேட்டரிங் சென்னை",
    "சைவ கேட்டரிங் அண்ணா நகர்",
  ],
};

export const plannerMeta = {
  title: "Catering Partner for Event Planners in Chennai | Brihadhee",
  description: `Brihadhee partners with event management companies in Chennai: white-label or co-branded live counters, regional pure veg menus and per-plate pricing${guestRange ? ` for ${fmt(guestRange.min)} to ${fmt(guestRange.max)} guests` : ""}.`,
  h1: "Pure Veg Catering Partner for Event Management Companies in Chennai",
};

/** Structured data for the catering pages: confirmed facts only. */
export function cateringSchema() {
  return pageGraph({
    path: CATERING_PATH,
    title: meta.title,
    description: meta.description,
    crumbs: [...HOME_CRUMBS, { name: "Catering", path: CATERING_PATH }],
    extras: [cateringServiceSchema({ areas, phone: contact.phone }), faqPageSchema(CATERING_PATH, faq)],
  });
}

export function plannerSchema() {
  return pageGraph({
    path: PLANNER_PATH,
    title: plannerMeta.title,
    description: plannerMeta.description,
    crumbs: [
      ...HOME_CRUMBS,
      { name: "Catering", path: CATERING_PATH },
      { name: "Event planner partner", path: PLANNER_PATH },
    ],
    extras: [cateringServiceSchema({ areas, phone: contact.phone }), faqPageSchema(PLANNER_PATH, plannerFaq)],
  });
}
