/**
 * Catering page content, derived ONLY from config/client-verification.json.
 * Nothing here is a claim by itself: every block is returned empty/null until
 * the owner confirms the matching flag, and the page renders nothing for it.
 *
 * Allowed values (see config/client-verification.json `_allowed_values`):
 *   confirmed_events: house_function, pooja, birthday, baby_shower,
 *                     housewarming, engagement, small_wedding, small_events
 *   menu_formats:     south_indian_meals, tiffin, snack_boxes, banana_leaf_service
 *   prep_mode:        restaurant_delivered | on_site
 *   pricing_model:    per_plate | on_request
 */
import verification from "../../config/client-verification.json";
import { site } from "./site.js";
import { pageGraph, cateringServiceSchema, faqPageSchema, HOME_CRUMBS } from "../lib/schema.js";

const v = verification;

export const cateringEnabled = v.offer_catering === true;

const EVENTS = {
  house_function: {
    label: "House functions",
    inline: "house functions",
    text: "House function catering in Anna Nagar for family gatherings at home.",
  },
  pooja: {
    label: "Pooja",
    inline: "poojas",
    text: "Pooja catering in Anna Nagar with a vegetarian South Indian menu.",
  },
  birthday: {
    label: "Birthdays",
    inline: "birthdays",
    text: "Birthday party catering in Anna Nagar, including birthdays at home.",
  },
  baby_shower: {
    label: "Baby shower / seemantham",
    inline: "baby showers (seemantham)",
    text: "Baby shower and seemantham catering in Anna Nagar and Chennai.",
  },
  housewarming: {
    label: "Housewarming / griha pravesam",
    inline: "housewarmings (griha pravesam)",
    text: "Housewarming and griha pravesam catering in Chennai.",
  },
  engagement: {
    label: "Engagement",
    inline: "engagements",
    text: "Engagement catering in Anna Nagar.",
  },
  small_wedding: {
    label: "Small weddings",
    inline: "small weddings",
    text: "Catering for small weddings in Chennai.",
  },
  small_events: {
    label: "Small events",
    inline: "small events",
    text: "Small function catering in Anna Nagar.",
  },
};

const FORMATS = {
  south_indian_meals: {
    label: "South Indian meals",
    text: "Vegetarian meals catering in Anna Nagar, served the way the restaurant serves them.",
    photo: {
      file: "meals.jpg",
      alt: "South Indian meal served on a banana leaf with rice, papad and sides, from the Brihadhee kitchen",
    },
  },
  tiffin: {
    label: "Tiffin",
    text: "Tiffin catering for events in Chennai, such as idiyappam and dosa.",
    photo: {
      file: "tiffin.jpg",
      alt: "Idiyappam served with coconut milk on a banana leaf, from the Brihadhee kitchen",
    },
  },
  snack_boxes: {
    label: "Snack boxes",
    text: "Snack boxes for small gatherings.",
    photo: null, // no real photo yet: the page shows a labelled placeholder
    placeholderAlt: "Photo of a Brihadhee snack box to be added",
  },
  banana_leaf_service: {
    label: "Full banana-leaf service",
    text: "Banana leaf catering in Chennai: a traditional full banana-leaf meal.",
    photo: {
      file: "meals.jpg",
      alt: "South Indian meal served on a round banana leaf at Brihadhee",
    },
  },
};

const list = (a) => (Array.isArray(a) ? a : []);
// Keep the canonical order of the map regardless of the order in the config.
const known = (map, ids) => Object.keys(map).filter((id) => list(ids).includes(id));
const joinNatural = (items) =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

const eventIds = cateringEnabled ? known(EVENTS, v.confirmed_events) : [];
const formatIds = cateringEnabled ? known(FORMATS, v.menu_formats) : [];
const areas = cateringEnabled ? list(v.service_area).filter(Boolean) : [];
const min = Number.isFinite(v.min_guests) ? v.min_guests : null;
const max = Number.isFinite(v.max_guests) ? v.max_guests : null;
const guestRange =
  cateringEnabled && min !== null && max !== null && min <= max ? { min, max } : null;

/* Catering contact: the catering numbers if different, else the restaurant's. */
const ch = v.enquiry_channels ?? {};
function resolveChannel(own, restaurant) {
  if (!cateringEnabled) return null;
  if (ch.is_different_from_restaurant === true) return own || null;
  if (ch.is_different_from_restaurant === false) return own || restaurant || null;
  return null; // unknown whether the catering number differs: show nothing
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
  ? `Brihadhee provides vegetarian South Indian catering for ${joinNatural(
      eventIds.map((id) => EVENTS[id].inline)
    )} from its kitchen in Anna Nagar East.`
  : null;

/* Entity sentence, only meaningful once catering is confirmed. */
export const entityLine = cateringEnabled
  ? "Brihadhee is a vegetarian South Indian restaurant with a catering service at W Block, Anna Nagar East, Chennai 600040, near Anna Tower and 3rd Avenue."
  : null;

export const events = eventIds.map((id) => ({
  label: EVENTS[id].label,
  text: EVENTS[id].text,
}));
export const formats = formatIds.map((id) => ({ id, ...FORMATS[id] }));

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
        { title: "Enquiry", text: "Call or WhatsApp us with your event, date and number of guests." },
        { title: "Menu selection", text: "Choose from the menu formats listed above." },
        { title: "Confirmation", text: "We confirm the menu and date with you." },
        { title: "Service", text: `${prepText}${serviceTail}` },
      ]
    : [];
export const advanceNotice =
  cateringEnabled && typeof v.advance_notice_required === "string" && v.advance_notice_required
    ? v.advance_notice_required
    : null;
export const freshlyPrepared = cateringEnabled && prepText !== null;

const inRange = (n) => guestRange && guestRange.min <= n && n <= guestRange.max;
const atAnnaNagar = areas.some((a) => /anna\s*nagar/i.test(a));
export const guests = guestRange
  ? {
      range: `Brihadhee caters for ${guestRange.min} to ${guestRange.max} guests.`,
      examples: [
        inRange(50) && "Catering for 50 people in Chennai",
        inRange(100) && atAnnaNagar && "Catering for 100 people in Anna Nagar",
      ].filter(Boolean),
    }
  : null;
export const serviceAreas = areas;

export const plannerSection = cateringEnabled && contact.any;

/* ---- FAQ: only confirmed answers, direct answer in sentence 1 ---------- */
const faq = [];
const add = (question, answer) => faq.push({ question, answer });
const KITCHEN = "from its vegetarian South Indian restaurant kitchen in Anna Nagar East, Chennai";

if (cateringEnabled) {
  add(
    "Does Brihadhee offer catering?",
    "Yes, Brihadhee offers vegetarian South Indian catering from its restaurant kitchen in Anna Nagar East, Chennai."
  );
  if (formatIds.length) {
    add(
      "What kind of catering does Brihadhee provide?",
      `Brihadhee provides vegetarian South Indian catering from its Anna Nagar East kitchen in these formats: ${joinNatural(
        formatIds.map((id) => FORMATS[id].label.toLowerCase())
      )}.`
    );
    add(
      "Is Brihadhee catering vegetarian?",
      "Yes, Brihadhee catering is vegetarian South Indian food from a vegetarian restaurant in Anna Nagar East, Chennai."
    );
  }
  if (eventIds.length) {
    add(
      "Which events does Brihadhee cater?",
      `Brihadhee caters ${joinNatural(eventIds.map((id) => EVENTS[id].inline))} ${KITCHEN}.`
    );
  }
  if (guestRange) {
    add(
      "How many guests can Brihadhee cater for?",
      `Brihadhee can cater for ${guestRange.min} to ${guestRange.max} guests at events ${KITCHEN}.`
    );
  }
  if (areas.length) {
    add(
      "Does Brihadhee cater outside Anna Nagar?",
      `Brihadhee caters in ${joinNatural(areas)} ${KITCHEN}.`
    );
  }
  if (formatIds.includes("banana_leaf_service")) {
    add(
      "Does Brihadhee provide banana-leaf catering?",
      `Yes, Brihadhee provides full banana-leaf service for catering ${KITCHEN}.`
    );
  }
  const channels = [
    contact.phone && `call ${contact.phone}`,
    contact.whatsapp && `message ${contact.whatsapp} on WhatsApp`,
  ].filter(Boolean);
  if (channels.length) {
    add(
      "How do I book catering with Brihadhee?",
      `To book vegetarian South Indian catering with Brihadhee for your event, ${channels.join(" or ")}.`
    );
  }
  if (advanceNotice) {
    add(
      "How far in advance should I book Brihadhee catering?",
      `Brihadhee asks customers to book catering ${advanceNotice} in advance of the event, through its vegetarian South Indian restaurant in Anna Nagar East.`
    );
  }
  if (v.pricing_model === "per_plate") {
    add(
      "What is the catering price per plate at Brihadhee?",
      "Brihadhee quotes catering prices per plate, so call or WhatsApp its Anna Nagar East restaurant for the rate for your menu."
    );
  } else if (v.pricing_model === "on_request") {
    add(
      "What is the catering price per plate at Brihadhee?",
      "Brihadhee catering prices are on request, so call or WhatsApp its Anna Nagar East restaurant for a quote for your event."
    );
  }
  add(
    "Where is Brihadhee located?",
    `Brihadhee is at ${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.state} ${site.address.postalCode}, near Anna Tower and 3rd Avenue.`
  );
}
export const faqs = faq;

/* ---- Page metadata (fixed by the brief) -------------------------------- */
export const meta = {
  title: "Brihadhee Catering | Vegetarian South Indian Catering in Anna Nagar, Chennai",
  description:
    "Vegetarian South Indian catering from Brihadhee in Anna Nagar East, Chennai, for house functions, poojas, birthdays and small events. Call to enquire.",
  h1: "Vegetarian South Indian Catering in Anna Nagar, Chennai",
  keywords: [
    "Brihadhee catering Anna Nagar",
    "vegetarian catering Anna Nagar",
    "South Indian catering Anna Nagar",
    "South Indian vegetarian catering Chennai",
    "catering service Anna Nagar East",
    "சைவ கேட்டரிங் அண்ணா நகர்",
    "சைவ கேட்டரிங் சென்னை",
    "samayal catering Chennai",
  ],
};

/** Structured data for /catering: confirmed facts only (see src/lib/schema.js). */
export function cateringSchema() {
  return pageGraph({
    path: "/catering/",
    title: meta.title,
    description: meta.description,
    crumbs: [...HOME_CRUMBS, { name: "Catering", path: "/catering/" }],
    extras: [
      cateringServiceSchema({ areas, phone: contact.phone }),
      faqPageSchema("/catering/", faq),
    ],
  });
}
