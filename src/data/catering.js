/**
 * Catering content (Pillar 2), derived from config/client-verification.json
 * and the confirmed `catering` fact in src/data/entity-truth.ts. Every block is
 * empty/null unless its flag is confirmed, and the page renders nothing for it.
 *
 * Allowed values (see config/client-verification.json `_allowed_values`):
 *   confirmed_events: house_function, pooja, birthday, baby_shower, housewarming,
 *                     ear_piercing, engagement, wedding, small_wedding, small_events
 *   menu_formats:     south_indian_meals, snack_boxes, banana_leaf_service,
 *                     live_counters, regional_menus
 *                     (the tiffin format is retired: client direction W11 to W13, 2026-11-11)
 *   prep_mode:        restaurant_delivered | on_site
 *   pricing_model:    per_plate | on_request
 *
 * Corporate catering (daily office catering, 1,000+ people a day) is a client service
 * since 2026-11-11 (keyword plan, client W13). Client names need permission first.
 */
import verification from "../../config/client-verification.json";
import { site } from "./site.js";
import { getFact, factOr } from "./entity-truth.ts";
import { qa, qaRoute } from "../lib/answers.js";
import { taCorporate } from "./faq-ta.js";

const STREET = getFact("street");
const PV = "100% pure vegetarian";
import { pageGraph, cateringServiceSchema, faqPageSchema, HOME_CRUMBS } from "../lib/schema.js";

const v = verification;

export const cateringEnabled = v.offer_catering === true;
export const CATERING_PATH = "/catering-services-chennai/";
export const PLANNER_PATH = "/event-planner-catering-partner/";
export const CORPORATE_PATH = "/corporate-catering-chennai/";

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
  get_together: { label: "Get-togethers", inline: "get-togethers", text: "Family get-togethers and private parties, at home or at a venue." },
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

/* Corporate catering and the end-to-end event service (verified facts). */
export const corporate = cateringEnabled ? factOr("corporateCatering", null) : null;
export const eventService = cateringEnabled ? factOr("eventService", null) : null;

/* ---- FAQ (event catering page): direct answer first, 35 to 60 words ------
 * One Q&A per route: corporate questions live on /corporate-catering-chennai/,
 * the location question on /about/. */
const faq = [];
const add = (question, answer) => faq.push(qa(question, answer));
const addr = () =>
  `${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.state} ${site.address.postalCode}`;
const NEAR = "Anna Nagar East";

if (cateringEnabled) {
  const G = guestRange ? `${fmt(guestRange.min)} to ${fmt(guestRange.max)} guests` : "your guests";
  const AREA = joinNatural(areas);
  const PHONE = contact.phone;
  if (eventIds.length) {
    add(
      "Does Brihadhee do wedding and event catering?",
      `Yes, Brihadhee does ${PV} wedding and event catering across ${AREA} for ${G}, from boutique weddings and betrothals to birthdays, housewarmings and family get-togethers. ` +
        `Its kitchen is at ${addr()}.`
    );
  }
  add(
    "Does Brihadhee provide end-to-end event catering?",
    `Yes, Brihadhee provides end-to-end event catering, covering ${eventService ? eventService.replace(/^end-to-end service: /, "") : "menu planning, cooking and serving"}, for ${G} with ${PV} food from its kitchen in ${NEAR}. ` +
      `One team handles the function from menu to service.`
  );
  if (formatIds.length) {
    add(
      "What kind of catering does Brihadhee provide?",
      `Brihadhee provides ${PV} catering with ${joinNatural(formatIds.map((id) => FORMATS[id].label.toLowerCase()))}, prepared by its kitchen in ${NEAR}, for ${G}. ` +
        (liveCounters.length ? `The ${liveCounters.length} live counters are ${joinNatural(liveCounters)}.` : "")
    );
    add(
      "Is Brihadhee catering pure vegetarian?",
      `Yes, Brihadhee catering is ${PV}, cooked by the same team as its pure vegetarian restaurant in ${NEAR}, for events of ${G}. ` +
        "Menus can mix Tirunelveli and Karaikudi specialties with North Indian and Indo-Chinese dishes, all without meat, egg or fish."
    );
  }
  if (eventIds.length) {
    add(
      "Which events does Brihadhee cater?",
      `Brihadhee caters ${joinNatural(eventIds.map((id) => EVENTS[id].inline))} across ${AREA}, with ${PV} menus from its kitchen in ${NEAR}. ` +
        `Events can range from ${G}.`
    );
  }
  if (areas.length) {
    add(
      "Does Brihadhee cater outside Anna Nagar?",
      `Yes, Brihadhee caters events across ${AREA}, not only in Anna Nagar, from its ${PV} restaurant kitchen in ${NEAR}, for ${G}. ` +
        "Tell the team your venue and date, and they will confirm the menu and per-plate price."
    );
  }
  if (contact.any) {
    add(
      "How do I book catering with Brihadhee?",
      `To book ${PV} catering with Brihadhee, send the quote form on this page, or call or WhatsApp ${PHONE} with your event, date, venue and guest count, from ${G}. ` +
        `The team in ${NEAR} will suggest a menu and live counters, then confirm the per-plate price.`
    );
  }
  if (v.pricing_model === "per_plate") {
    add(
      "How is Brihadhee catering priced?",
      `Brihadhee prices its ${PV} catering per plate, quoted for the menu and live counters you choose, so you know the full cost before you confirm. ` +
        `Call ${PHONE} or visit the restaurant in ${NEAR} for a quote for your event.`
    );
  }
}
export const faqs = qaRoute(CATERING_PATH, faq);

/* ---- FAQ (event planner page) ----------------------------------------- */
const plannerFaq = [];
if (cateringEnabled) {
  const G = guestRange ? `${fmt(guestRange.min)} to ${fmt(guestRange.max)} guests` : "your guests";
  const AREA = joinNatural(areas);
  plannerFaq.push(
    qa(
      "Which pure veg caterer in Chennai works with event managers on boutique functions?",
      `Brihadhee, a ${PV} restaurant and caterer, works with event management companies across ${AREA} on boutique functions and weddings for ${G}. ` +
        `Its kitchen is at ${addr()}.`
    ),
    qa(
      "Can Brihadhee run white-label or co-branded live counters for my event company?",
      `Yes, Brihadhee runs ${joinNatural(plannerModels)} for event management companies, cooked by the team from its ${PV} kitchen in ${NEAR}. ` +
        `The ${liveCounters.length} counters are ${joinNatural(liveCounters)}.`
    ),
    qa(
      "Why do event planners choose a boutique caterer like Brihadhee?",
      `Event planners choose Brihadhee for ${PV} menus customised for each client, live counters for dosa, parotta and Nellai sodhi, and per-plate pricing for ${G}. ` +
        `Planners deal directly with the team at the restaurant in ${NEAR}.`
    ),
    qa(
      "How do event managers start a catering partnership with Brihadhee?",
      `Event managers can start a partnership with Brihadhee by calling ${contact.phone ?? "the restaurant"} with an upcoming event, guest count and venue. ` +
        `The team at the ${PV} restaurant in ${NEAR} will propose a menu, live counters and per-plate pricing.`
    )
  );
}
export const plannerFaqs = qaRoute(PLANNER_PATH, plannerFaq);

/* ---- Page metadata ----------------------------------------------------- */
export const meta = {
  title: "Event & Wedding Catering in Chennai | Brihadhee",
  description: "End-to-end veg catering for weddings, birthdays and get-togethers in Chennai. Menu planning, cooking, serving and setup by one team. Get a quote.",
  h1: "End-to-End Event Catering in Chennai",
};

export const plannerMeta = {
  title: "Catering Partner for Event Planners in Chennai | Brihadhee",
  description: `Brihadhee partners with Chennai event planners: white-label or co-branded live counters and pure veg menus${guestRange ? ` for ${fmt(guestRange.min)} to ${fmt(guestRange.max)} guests` : ""}.`,
  h1: "Pure Veg Catering Partner for Event Management Companies in Chennai",
};

/** Structured data for the catering pages: confirmed facts only. */
/* Offer catalogue for the event catering Service: one entry per confirmed kind of event. */
const FAMILY_EVENTS = ["baby_shower", "housewarming", "ear_piercing", "engagement", "get_together", "house_function", "small_events"];
const eventCatalog = [
  eventIds.includes("wedding") && { name: "Wedding catering", description: EVENTS.wedding.text },
  eventIds.includes("birthday") && { name: "Birthday catering", description: EVENTS.birthday.text },
  eventIds.some((id) => FAMILY_EVENTS.includes(id)) && {
    name: "Family function catering",
    description: `Pure vegetarian catering for ${joinNatural(eventIds.filter((id) => FAMILY_EVENTS.includes(id)).map((id) => EVENTS[id].inline))}.`,
  },
].filter(Boolean);

export function cateringSchema() {
  return pageGraph({
    path: CATERING_PATH,
    title: meta.title,
    description: meta.description,
    crumbs: [...HOME_CRUMBS, { name: "Catering", path: CATERING_PATH }],
    extras: [cateringServiceSchema({ areas, phone: contact.phone, serviceType: "Event catering", offerCatalog: eventCatalog }), faqPageSchema(CATERING_PATH, faqs)],
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
    extras: [
      cateringServiceSchema({
        areas,
        phone: contact.phone,
        path: PLANNER_PATH,
        serviceType: "Event catering",
        name: "Brihadhee Catering Partner for Event Planners",
        description: "Pure vegetarian live counters and regional menus for event management companies in Chennai, white-label or co-branded, with per-plate pricing.",
        audience: [{ "@type": "BusinessAudience", audienceType: "Event management companies" }],
      }),
      faqPageSchema(PLANNER_PATH, plannerFaqs),
    ],
  });
}

/* ======================================================================= *
 * /corporate-catering-chennai/ (client confirmed 2026-11-12) and the new  *
 * end-to-end sections of /catering-services-chennai/. Answer-first copy:  *
 * the first sentence under every heading answers it. Facts only from      *
 * entity-truth.ts and menu-canonical.ts (via menu-facts.js).              *
 * ======================================================================= */
import { byo, category } from "../lib/menu-facts.js";
import { ROUTES, href } from "./site.js";

const corpAreas = cateringEnabled ? factOr("corporateAreas", []) : [];
const corpProcess = cateringEnabled ? factOr("corporateProcess", []) : [];
const corpServices = cateringEnabled ? factOr("corporateServices", []) : [];
const safety = cateringEnabled ? factOr("foodSafety", null) : null;
const fssai = factOr("fssaiLicence", null);
const DAILY = corporate ? `${fmt(corporate.dailyCovers)}+` : null;
const lunchCat = cateringEnabled ? category("lunch") : null;
const mealDesc = (n) => lunchCat?.items.find((i) => i.name === n)?.description?.replace(/\.$/, "") ?? "";
const lc1 = (t) => t.charAt(0).toLowerCase() + t.slice(1);
const hasService = (re) => corpServices.some((x) => re.test(x));

export const corporateEnabled = Boolean(cateringEnabled && corporate);

export const corporateMeta = {
  title: "Pure Veg Corporate Catering in Chennai | Brihadhee",
  description: `Pure veg corporate catering in Chennai, serving ${DAILY ?? "1,000+"} people every day. Daily office lunches, bulk meals and corporate events. Request a quote today.`,
  h1: "Pure Veg Corporate Catering in Chennai",
};

export const corporatePage = corporateEnabled
  ? {
      path: CORPORATE_PATH,
      intro: `Brihadhee runs ${PV} corporate catering across Chennai, serving more than ${fmt(corporate.dailyCovers)} people every day from its restaurant kitchen on ${STREET}: daily office lunches, bulk lunch orders, employee meal programmes and office events.`,
      glance: [
        ["Who", `Brihadhee, a ${PV} restaurant and caterer on ${STREET}`],
        ["Scale", `more than ${fmt(corporate.dailyCovers)} people served every day`],
        ["Services", corpServices.join(", ")],
        ["Areas", joinNatural(corpAreas)],
        ["Start", corpProcess.map((p, i) => `${i + 1}. ${p.title}`).join(", ")],
        ["Pricing", pricingText ?? "On enquiry"],
      ],
      scale: {
        id: "scale",
        title: `Serving ${DAILY} People Every Day Across Chennai`,
        lead: `Brihadhee cooks for more than ${fmt(corporate.dailyCovers)} people every day, so its kitchen is built for daily office volume. Every meal is ${PV} and cooked by the same team that runs the restaurant on ${STREET}.`,
        items: [
          {
            title: "Daily Capacity and Scale",
            text: `The kitchen already serves more than ${fmt(corporate.dailyCovers)} people a day across Chennai, so adding your team does not change how the food is cooked. For one-off bulk orders and events, Brihadhee also caters ${guests ? `${fmt(guests.min)} to ${fmt(guests.max)}` : "large"} guests.`,
          },
          {
            title: "Restaurant-Kitchen Quality for Offices",
            text: `Office meals come from a working restaurant, not a contract canteen: the sambar, kootu, poriyal and Nellai sodhi your team eats are the same recipes served to diners in Anna Nagar East, ${lc1(getFact("recipeStory"))}. Your admin team can taste them at the restaurant before the first order.`,
          },
        ],
      },
      services: {
        id: "services",
        title: "Corporate Catering Services",
        lead: `Brihadhee offers four corporate catering services, all ${PV}: daily office lunch supply, bulk lunch catering, employee meal programmes, and office parties and corporate events.`,
        tint: true,
        items: [
          hasService(/daily office lunch/) && {
            title: "Daily Office Lunch Supply",
            text: "A fixed daily lunch for your office, packed in the Brihadhee kitchen and delivered to an agreed time slot. Your team gets a South Indian meal on a rotating menu, on the days your office works.",
          },
          hasService(/bulk lunch/) && {
            title: "Bulk Lunch Catering",
            text: "One-off or occasional bulk lunches for training days, audits, offsites, all-hands meetings and client visits. Send the headcount, the address and the time, and the order arrives packed and ready to serve.",
          },
          hasService(/employee meal/) && {
            title: "Employee Meal Programmes",
            text: "A recurring meal programme for your employees, planned with HR or admin: the menu cycle, portions and delivery times are agreed up front, and the headcount can change as your team grows.",
          },
          hasService(/office parties|corporate events/) && {
            title: "Office Parties and Corporate Events",
            text: `Festival lunches, team celebrations and product launches, with live counters for ${joinNatural(liveCounters)}. Events can run from ${guests ? `${fmt(guests.min)} to ${fmt(guests.max)}` : "a few dozen to several hundred"} guests.`,
          },
        ].filter(Boolean),
      },
      menus: {
        id: "menus",
        title: "Sample Pure Veg Corporate Menus",
        lead: "These sample menus are built from dishes Brihadhee already serves at its restaurant; your final menu, portions and per-plate price are agreed with your team before the trial week.",
        items: [
          {
            title: "Standard South Indian Office Lunch",
            text: `A balanced weekday lunch based on the restaurant's Tamil Nadu meals: ${lc1(mealDesc("Limited TN Meals"))}. It is the default for daily office lunch supply.`,
          },
          {
            title: "Nellai Special Sodhi Meals Day",
            text: `A weekly special based on the Nellai Special Sodhi Meals: ${lc1(mealDesc("Nellai Special Sodhi Meals"))}. It gives a rotating menu one day your team looks forward to.`,
          },
          {
            title: "Executive & Celebration Menu",
            text: `For leadership lunches, client visits and celebrations: the Executive TN Meals (${lc1(mealDesc("Executive TN Meals (Unlimited)"))}), with add-ons such as Karaikudi Paneer Poppers, Paanai Parotta or a live Build Your Own Dosa counter.`,
          },
        ],
      },
      process: {
        id: "process",
        title: "How We Work With Your Office",
        lead: `Starting corporate catering with Brihadhee takes ${corpProcess.length} steps, from the first enquiry to daily service on a rotating menu.`,
        tint: true,
        items: corpProcess.map((p, i) => ({ title: `${i + 1}. ${p.title}`, text: p.text })),
      },
      safety: safety
        ? {
            id: "food-safety",
            title: "Food Safety, Hygiene and Punctuality",
            lead: `Brihadhee cooks every corporate meal in its FSSAI-licensed restaurant kitchen on ${STREET}, packs it in the kitchen and delivers it to the time slot agreed with your office. Because it is a working restaurant as well as a caterer, the same kitchen standards apply to an office lunch as to a plate served to a diner, and because the kitchen is ${PV}, there is no risk of meat, egg or fish reaching a vegetarian employee's plate.`,
            dishes: safety.points.map((x) => ({ name: x })),
            note: fssai
              ? `FSSAI licence number: ${fssai}.`
              : "The FSSAI licence number is shared with your admin or procurement team on request.",
          }
        : null,
      areas: corpAreas.length
        ? {
            id: "areas",
            title: "Areas We Serve in Chennai",
            lead: `Brihadhee delivers corporate catering to offices in ${joinNatural(corpAreas)}, from its kitchen on ${STREET}. That covers the IT corridor along OMR (Tidel Park, Taramani, Perungudi, Sholinganallur and Siruseri), Guindy and Ambit IT Park, the Ambattur Industrial Estate and offices around Anna Nagar. If your office is elsewhere in Chennai, send your location through the quote form and the team will confirm whether it can be served.`,
            tint: true,
            dishes: corpAreas.map((a) => ({ name: a })),
          }
        : null,
      faq: qaRoute(CORPORATE_PATH, [
        qa(
          "Does Brihadhee do corporate catering?",
          `Yes, Brihadhee does ${PV} corporate catering across Chennai, serving more than ${fmt(corporate.dailyCovers)} people every day with daily office lunches, bulk meals, employee meal programmes and office events. ` +
            `Its kitchen is at ${addr()}.`
        ),
        qa(
          "How many people can Brihadhee cater for?",
          `Brihadhee caters for more than ${fmt(corporate.dailyCovers)} people every day through its corporate catering, and for ${guests ? `${fmt(guests.min)} to ${fmt(guests.max)}` : "large groups of"} guests at a single wedding, birthday or family function, all ${PV}. ` +
            `Every meal comes from its restaurant kitchen in ${NEAR}, Chennai.`
        ),
        qa(
          "Which caterers in Chennai supply pure veg office lunches every day?",
          `Brihadhee, a ${PV} restaurant and caterer in ${NEAR}, supplies daily office lunches across Chennai to ${corpAreas.length} areas, from Guindy and Ambattur Industrial Estate to the OMR IT corridor. ` +
            `Lunches rotate through a set menu cycle agreed with each office.`
        ),
        qa(
          "How does Brihadhee start a corporate catering account?",
          `Brihadhee starts a corporate catering account in ${corpProcess.length} steps, beginning with an enquiry about your office location and daily headcount. ` +
            `Your team then tastes the menu at its ${PV} kitchen in ${NEAR}, runs a trial week, and moves to daily service on a rotating menu.`
        ),
        qa(
          "Is Brihadhee's corporate catering kitchen FSSAI licensed?",
          `Yes, Brihadhee cooks every corporate meal in its FSSAI-licensed, ${PV} restaurant kitchen in ${NEAR}, where no meat, egg or fish is cooked. ` +
            `Meals are packed in the kitchen and delivered to an agreed time slot, for more than ${fmt(corporate.dailyCovers)} people every day.`
        ),
        qa(
          "How much does corporate catering from Brihadhee cost?",
          `Brihadhee prices corporate catering per plate, quoted for your menu, headcount and delivery location, from its ${PV} kitchen in ${NEAR}. ` +
            `Send your daily headcount through the quote form or call ${contact.phone}, and the team replies with a per-plate price.`
        ),
        qa(
          "Does Brihadhee deliver corporate lunches to OMR and Tidel Park?",
          `Yes, Brihadhee delivers ${PV} corporate lunches to offices on OMR, including Tidel Park, Taramani, Perungudi, Sholinganallur and Siruseri, from its kitchen in ${NEAR}. ` +
            `It serves more than ${fmt(corporate.dailyCovers)} people every day across ${corpAreas.length} Chennai areas.`
        ),
        qa(
          "Can my office try Brihadhee before signing up for daily catering?",
          `Yes, every new office starts with a kitchen tasting at Brihadhee's ${PV} restaurant in ${NEAR}, followed by a trial week at your office. ` +
            `Your team rates the food, portions and delivery timing during the ${corpProcess.length}-step start, before daily service begins.`
        ),
        qa(
          "Can Brihadhee cater office parties and corporate events in Chennai?",
          `Yes, Brihadhee caters office parties and corporate events across Chennai with ${PV} menus from its kitchen in ${NEAR}, including live counters. ` +
            `Counters include ${joinNatural(liveCounters)}, for ${guests ? `${fmt(guests.min)} to ${fmt(guests.max)}` : "your"} guests.`
        ),
        ...taCorporate,
      ]),
    }
  : null;

export function corporateSchema() {
  return pageGraph({
    path: CORPORATE_PATH,
    title: corporateMeta.title,
    description: corporateMeta.description,
    crumbs: [...HOME_CRUMBS, { name: "Corporate catering", path: CORPORATE_PATH }],
    extras: [
      cateringServiceSchema({
        areas,
        phone: contact.phone,
        path: CORPORATE_PATH,
        serviceType: "Corporate catering",
        name: "Brihadhee Pure Veg Corporate Catering",
        description: `Pure vegetarian corporate catering in Chennai for more than ${fmt(corporate.dailyCovers)} people a day: daily office lunch supply, bulk lunch catering, employee meal programmes, and office parties and corporate events.`,
        audience: [{ "@type": "BusinessAudience", audienceType: "Companies, HR and office administration teams" }],
      }),
      faqPageSchema(CORPORATE_PATH, corporatePage.faq),
    ],
  });
}

/* ---- New sections on /catering-services-chennai/ ------------------------ */
const steps4 = eventService ? eventService.replace(/^end-to-end service: /, "").split(/,\s*|\s+and\s+/) : [];
export const endToEnd = cateringEnabled && eventService
  ? {
      id: "end-to-end",
      title: "What End-to-End Catering Includes",
      lead: `End-to-end catering from Brihadhee means one team handles ${eventService.replace(/^end-to-end service: /, "")} for your function, for ${guests ? `${fmt(guests.min)} to ${fmt(guests.max)}` : "your"} guests across Chennai.`,
      items: [
        steps4.includes("menu planning") && { title: "Menu planning", text: "Choose a regional menu with the team: Tirunelveli and Karaikudi dishes, South Indian meals, North Indian and Indo-Chinese options, and the live counters you want, all pure vegetarian." },
        steps4.includes("cooking") && { title: "Cooking", text: `The food is cooked by the team that runs the restaurant on ${STREET}, from the same recipes guests eat there.` },
        steps4.includes("serving") && { title: "Serving", text: "Brihadhee's team serves your guests at the function and runs the live counters." },
        steps4.includes("setup") && { title: "Setup", text: "The team sets up the serving area and counters at your venue before guests arrive." },
      ].filter(Boolean),
    }
  : null;

export const liveDosaCounter = cateringEnabled && liveCounters.some((c) => /build your own dosa/i.test(c))
  ? {
      id: "live-dosa-counter",
      title: "Live Build-Your-Own Dosa Counter at Your Event",
      lead: `Brihadhee runs a live Build Your Own Dosa counter at your event: guests pick one of ${byo.batterCount} batters, add podi, a filling and a ghee, butter or oil roast, and the counter team makes each dosa to order.`,
      tint: true,
      dishes: byo.steps.map((st) => ({ name: `${st.label}`, note: st.options.map((o) => o.name).join(", ") })),
      links: [{ label: "See how Build Your Own Dosa works", href: href(ROUTES.dosa) }],
    }
  : null;
