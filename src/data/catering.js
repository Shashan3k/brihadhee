/**
 * Catering content (Pillar 2), derived from config/client-verification.json
 * and the confirmed `catering` fact in src/data/entity-truth.ts. Every block is
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
import { getFact, factOr } from "./entity-truth.ts";
import { qa } from "../lib/answers.js";

const STREET = getFact("street");
const PV = "100% pure vegetarian";
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
    photo: { file: "idiyappam.jpg", alt: "Idiyappam served with coconut milk on a banana leaf, from the Brihadhee kitchen" },
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
  ? `Brihadhee is a pure vegetarian restaurant and caterer on ${STREET}, Chennai ${getFact("address").postalCode}, near Anna Nagar Tower Park.`
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
const add = (question, answer) => faq.push(qa(question, answer));
const addr = () =>
  `${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.state} ${site.address.postalCode}`;

if (cateringEnabled) {
  const G = guestRange ? `${fmt(guestRange.min)} to ${fmt(guestRange.max)} guests` : "your guests";
  const AREA = joinNatural(areas);
  const PHONE = contact.phone;
  add(
    "Does Brihadhee offer catering in Chennai?",
    `Yes, Brihadhee offers ${PV} event and function catering across ${AREA} for ${G}, from its restaurant kitchen on ${STREET}. ` +
      `It caters ${joinNatural(eventIds.map((id) => EVENTS[id].inline))}.`
  );
  if (formatIds.length) {
    add(
      "What kind of catering does Brihadhee provide?",
      `Brihadhee provides ${PV} catering with ${joinNatural(formatIds.map((id) => FORMATS[id].label.toLowerCase()))}, prepared by its kitchen on ${STREET}, for ${G}. ` +
        (liveCounters.length ? `The ${liveCounters.length} live counters are ${joinNatural(liveCounters)}.` : "")
    );
    add(
      "Is Brihadhee catering pure vegetarian?",
      `Yes, Brihadhee catering is ${PV}, cooked by the same team as its pure vegetarian restaurant on ${STREET}, for events of ${G}. ` +
        "Menus can mix Tirunelveli and Karaikudi specialties with North Indian and Indo-Chinese dishes, all without meat, egg or fish."
    );
  }
  if (eventIds.length) {
    add(
      "Which events does Brihadhee cater?",
      `Brihadhee caters ${joinNatural(eventIds.map((id) => EVENTS[id].inline))} across ${AREA}, with ${PV} menus from its kitchen on ${STREET}. ` +
        `Events can range from ${G}.`
    );
  }
  if (guestRange) {
    add(
      "How many guests can Brihadhee cater for?",
      `Brihadhee can cater for ${G}, from home functions to boutique weddings in ${AREA}, with ${PV} food from its kitchen on ${STREET}. ` +
        "Live counters for dosa, parotta and Nellai sodhi can be added to any of these events."
    );
  }
  if (areas.length) {
    add(
      "Does Brihadhee cater outside Anna Nagar?",
      `Yes, Brihadhee caters events across ${AREA}, not only in Anna Nagar, from its ${PV} restaurant kitchen on ${STREET}, for ${G}. ` +
        "Tell the team your venue and date, and they will confirm the menu and per-plate price."
    );
  }
  if (contact.any) {
    add(
      "How do I book catering with Brihadhee?",
      `To book ${PV} catering with Brihadhee, call ${PHONE} with your event type, date, venue and number of guests, from ${G}. ` +
        `The team at the restaurant on ${STREET} will suggest a menu and live counters, then confirm the per-plate price.`
    );
  }
  if (v.pricing_model === "per_plate") {
    add(
      "How is Brihadhee catering priced?",
      `Brihadhee prices its ${PV} catering per plate, quoted for the menu and live counters you choose, so you know the full cost before you confirm. ` +
        `Call ${PHONE} or visit the restaurant on ${STREET} for a quote for your event.`
    );
  }
  add(
    "Where is Brihadhee located?",
    `Brihadhee is at ${addr()}, near Anna Nagar Tower Park. ` +
      `Families and event planners can eat at the ${PV} restaurant before booking catering for their function.`
  );
}
export const faqs = faq;

/* ---- FAQ (event planner page) ----------------------------------------- */
const plannerFaq = [];
if (cateringEnabled) {
  const G = guestRange ? `${fmt(guestRange.min)} to ${fmt(guestRange.max)} guests` : "your guests";
  const AREA = joinNatural(areas);
  plannerFaq.push(
    qa(
      "Which pure veg caterer in Chennai works with event managers on boutique functions?",
      `Brihadhee, a ${PV} restaurant on ${STREET}, works with event management companies across ${AREA} on boutique functions and weddings for ${G}. ` +
        `It offers ${joinNatural(plannerModels)}, regional menus and per-plate pricing.`
    ),
    qa(
      "Can Brihadhee run white-label or co-branded live counters for my event company?",
      `Yes, Brihadhee runs ${joinNatural(plannerModels)} for event management companies, cooked by the team from its ${PV} kitchen on ${STREET}. ` +
        `The ${liveCounters.length} counters are ${joinNatural(liveCounters)}.`
    ),
    qa(
      "Why do event planners choose a boutique caterer like Brihadhee?",
      `Event planners choose Brihadhee for ${PV} menus customised for each client, live counters for dosa, parotta and Nellai sodhi, and per-plate pricing for ${G}. ` +
        `Planners deal directly with the team at the restaurant on ${STREET}.`
    ),
    qa(
      "How do event managers start a catering partnership with Brihadhee?",
      `Event managers can start a partnership with Brihadhee by calling ${contact.phone ?? "the restaurant"} with an upcoming event, guest count and venue. ` +
        `The team at the ${PV} restaurant on ${STREET} will propose a menu, live counters and per-plate pricing.`
    )
  );
}
export const plannerFaqs = plannerFaq;

/* ---- Page metadata ----------------------------------------------------- */
export const meta = {
  title: "Pure Veg Event Catering in Chennai | Brihadhee, Anna Nagar",
  description: `Pure veg catering by Brihadhee for seemantham, gruhapravesam, weddings and birthdays${guestRange ? `, ${fmt(guestRange.min)} to ${fmt(guestRange.max)} guests` : ""}, with live dosa counters.`,
  h1: "Pure Vegetarian Event and Wedding Catering in Chennai",
};

export const plannerMeta = {
  title: "Catering Partner for Event Planners in Chennai | Brihadhee",
  description: `Brihadhee partners with Chennai event planners: white-label or co-branded live counters and pure veg menus${guestRange ? ` for ${fmt(guestRange.min)} to ${fmt(guestRange.max)} guests` : ""}.`,
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
