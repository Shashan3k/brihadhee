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
import { CATERING_DIET, ENABLE_BRAHMIN_RELIGIOUS_FUNCTIONS } from "../../config/seo-gates.ts";

const STREET = getFact("street");
const PV = "100% pure vegetarian";
/** Catering diet word: "vegetarian" until the owner answers Q20 (config/seo-gates.ts). */
const CD = CATERING_DIET;
const CDcap = CD.charAt(0).toUpperCase() + CD.slice(1);
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
  pooja: { label: "Pooja", inline: "poojas", text: `Pooja functions with a ${CD} menu.` },
  /* "Seemantham" is a Brahmin-function term, gated by Q23 (config/seo-gates.ts); valaikaapu is the general Tamil word. */
  baby_shower: ENABLE_BRAHMIN_RELIGIOUS_FUNCTIONS
    ? { label: "Seemantham (baby shower)", inline: "seemantham (baby shower)", text: "Seemantham and valaikaapu functions, with traditional South Indian dishes." }
    : { label: "Valaikaapu (baby shower)", inline: "valaikaapu (baby shower)", text: "Valaikaapu and baby shower functions, with traditional South Indian dishes." },
  housewarming: { label: "Gruhapravesam (housewarming)", inline: "gruhapravesam (housewarming)", text: `Gruhapravesam catering with a traditional ${CD} spread.` },
  ear_piercing: { label: "Ear piercing ceremonies", inline: "ear piercing ceremonies", text: "Ear piercing (kaadhu kuthu) functions for family and guests." },
  engagement: { label: "Betrothals and engagements", inline: "betrothals", text: "Betrothal and engagement functions, with live counters if you want them." },
  wedding: { label: "Boutique weddings", inline: "boutique weddings", text: "Boutique and mid-size weddings, with regional menus and live counters." },
  small_wedding: { label: "Small weddings", inline: "small weddings", text: "Small weddings with a regional vegetarian menu." },
  birthday: { label: "Birthday parties", inline: "birthday parties", text: "Birthday meals for gatherings at home or in a hall, with a live dosa counter available to discuss." },
  get_together: { label: "Get-togethers", inline: "get-togethers", text: "Family get-togethers and private parties, at home or at a venue." },
  small_events: { label: "Small events", inline: "small events", text: "Small functions and get-togethers." },
};

const FORMATS = {
  live_counters: {
    label: "Live food counters",
    text: `Live counters for ${liveCounters.join(", ")}, run by the Brihadhee kitchen team at your venue.`,
    photo: { file: "dosa.jpg", alt: "Folded golden dosa with filling and three small bowls of sides" },
  },
  regional_menus: {
    label: "Regional vegetarian menus",
    text: "Menus built around Tirunelveli (Nellai) and Karaikudi dishes, from sodhi meals to karupatti ulundhu kali, customised for your event.",
    photo: { file: "meals.jpg", alt: "Rice, papad and bowls of sides arranged on a banana-leaf plate" },
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
  hasPhone: Boolean(phone),
  hasWhatsApp: Boolean(whatsapp),
};

/* ---- Section data (null/empty = section hidden) ----------------------- */

export const opening = eventIds.length
  ? `Brihadhee provides ${CD} catering for ${eventIds.includes("wedding") ? "weddings and family functions" : "family functions"} across ${joinNatural(areas.length ? areas : ["Chennai"])}. The Anna Nagar East team plans regional South Indian menus around Tirunelveli and Karaikudi dishes${liveCounters.length ? ", with live counters available to discuss for your event" : ""}.`
  : null;

export const entityLine = cateringEnabled
  ? `Brihadhee is a pure vegetarian restaurant on ${STREET}, Chennai ${getFact("address").postalCode}, near Anna Nagar Tower Park. Its kitchen also does ${CD} catering for functions and offices.`
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

/* The enquiry steps are useful even while the preparation mode is pending. */
export const steps =
  contact.any
    ? [
        { title: "Send your event details", text: "Share the occasion, date, venue and estimated guest count. Say whether it is lunch or dinner and which live counters or dishes you are considering." },
        { title: "Discuss the menu and service", text: "Tell the team what you need at the venue. Ask how the food will be prepared and what the quote covers for serving, transport, vessels and clean-up." },
        { title: "Review the quote", text: "Confirm the menu, service scope, date and per-plate price with the team before booking." },
        ...(prepText ? [{ title: "Preparation and service", text: `${prepText}${serviceTail}` }] : []),
      ]
    : [];
export const advanceNotice =
  cateringEnabled && typeof v.advance_notice_required === "string" && v.advance_notice_required
    ? v.advance_notice_required
    : null;
export const freshlyPrepared = cateringEnabled && prepText !== null;

export const guests = guestRange
  ? {
      range: `Brihadhee caters for ${fmt(guestRange.min)} to ${fmt(guestRange.max)} guests at a single event.`,
      min: guestRange.min,
      max: guestRange.max,
    }
  : null;
export const serviceAreas = areas;

export const plannerSection = cateringEnabled && contact.any;

/* Corporate catering and the end-to-end event service (verified facts). */
export const corporate = cateringEnabled ? factOr("corporateCatering", null) : null;
export const eventService = cateringEnabled ? factOr("eventService", null) : null;

/* ---- FAQ (event catering page): direct answer first, sized to the question --
 * One Q&A per route: corporate questions live on /corporate-catering-chennai/,
 * the location question on /about/. */
const faq = [];
const add = (question, answer, options) => faq.push(qa(question, answer, options));
const addr = () =>
  `${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.state} ${site.address.postalCode}`;
const NEAR = "Anna Nagar East";

/* Service details the owner has not confirmed yet (client-verification.json) are
 * answered as "agreed on the quote call", never guessed. */
const cleanupLine =
  v.staff_serving_cleanup_included === true
    ? "Serving staff and clean-up are included."
    : v.staff_serving_cleanup_included === false
      ? "Serving and clean-up are arranged by you."
      : "Transport, vessels and clean-up are agreed for each function, so confirm them on the quote call.";

if (cateringEnabled) {
  const G = guestRange ? `${fmt(guestRange.min)} to ${fmt(guestRange.max)} guests` : "your guests";
  const AREA = joinNatural(areas);
  const PHONE = contact.phone;
  const SVC = eventService ? eventService.replace(/^end-to-end service: /, "") : "menu planning, cooking and serving";
  if (eventIds.length) {
    add(
      "Does Brihadhee do wedding and event catering?",
      `Yes. Brihadhee caters weddings and events across ${AREA} for ${G}, from boutique weddings and betrothals to birthdays, housewarmings and get-togethers. ` +
        `Its kitchen is at ${addr()}.`
    );
  }
  add(
    "Does Brihadhee provide end-to-end event catering?",
      `Yes. Brihadhee can handle ${SVC} for events of ${G} across ${AREA}. ` +
      (liveCounters.length ? `Live counters can be added. ` : "") +
      cleanupLine
  );
  if (formatIds.length) {
    add(
      "What kind of catering does Brihadhee provide?",
      `Brihadhee provides ${CD} catering with ${joinNatural(formatIds.map((id) => FORMATS[id].label.toLowerCase()))}, planned by its Anna Nagar East restaurant team. ` +
        (liveCounters.length ? `The ${liveCounters.length} live counters are ${joinNatural(liveCounters)}.` : "")
    );
    add(
      `Is Brihadhee catering ${CD}?`,
      `Yes. Brihadhee offers ${CD} event menus through its restaurant team. ` +
        "Menus can mix Tirunelveli and Karaikudi specialties with North Indian and Indo-Chinese dishes, agreed with you for each function."
    );
  }
  if (eventIds.length) {
    add(
      "Which events does Brihadhee cater?",
      `Brihadhee caters ${joinNatural(eventIds.map((id) => EVENTS[id].inline))} across ${AREA}, for ${G}.`
    );
  }
  if (areas.length && PHONE) {
    add(
      `Where can I find ${CD} catering in Anna Nagar?`,
      `Brihadhee's Anna Nagar East team provides ${CD} event catering across ${AREA}, including Anna Nagar. ` +
        `Call the catering team on ${PHONE} with your venue area, date and headcount to discuss a menu and check availability.`,
      { id: "does-brihadhee-cater-outside-anna-nagar" }
    );
  }
  if (contact.any) {
    add(
      "How do I book catering with Brihadhee?",
      `To book catering with Brihadhee, send the quote form on this page, or call or WhatsApp ${PHONE} with your event, date, venue and guest count (from ${fmt(guestRange?.min ?? 50)}). ` +
        "The team follows up to discuss the menu and per-plate quote before booking."
    );
    add(
      "How far ahead should I book catering with Brihadhee?",
      advanceNotice
        ? `Book Brihadhee catering at least ${advanceNotice} ahead of your function. Call ${PHONE} to check your date.`
        : `Brihadhee has not published a fixed lead time for event catering, so call ${PHONE} as soon as your date is set. ` +
            "The team confirms whether it can take your date, venue and guest count."
    );
  }
  if (v.pricing_model === "per_plate") {
    add(
      "How is Brihadhee catering priced?",
      "Brihadhee quotes catering per plate based on the menu, guest count, live counters and service you request. " +
        "Ask the team to confirm what the quote includes before you book."
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
      `Which ${CD} caterer in Chennai works with event managers on boutique functions?`,
      `Brihadhee, a restaurant in ${NEAR}, works with event management companies across ${AREA} as a ${CD} caterer for boutique functions and weddings of ${G}. ` +
        `Its kitchen is at ${addr()}.`
    ),
    qa(
      "Can Brihadhee run white-label or co-branded live counters for my event company?",
      `Yes. Brihadhee runs ${joinNatural(plannerModels)} for event management companies, staffed by its own kitchen team. ` +
        `The ${liveCounters.length} counters are ${joinNatural(liveCounters)}.`
    ),
    qa(
      "What can event planners specify in a catering brief?",
      `Event planners can give Brihadhee their client's menu preferences, branding model and live counter requirements. ` +
        "Include the event schedule, venue, guest estimate and who will coordinate access and setup."
    ),
    qa(
      "How do event managers start a catering partnership with Brihadhee?",
      `Event managers can send Brihadhee a partnership enquiry or call ${contact.phone ?? "the restaurant"} with their event date, guest count and venue. ` +
        "Share the company name, counter or menu preferences and how the event is branded."
    )
  );
}
export const plannerFaqs = qaRoute(PLANNER_PATH, plannerFaq);

/* ---- Page metadata ----------------------------------------------------- */
export const meta = {
  title: `${CDcap} Event & Wedding Catering in Chennai | Brihadhee`,
  description: `${CDcap} event and wedding catering in Chennai with regional South Indian menus, live counters and per-plate quotes from Brihadhee.`,
  h1: `${CDcap} Event and Wedding Catering in Chennai`,
};

export const plannerMeta = {
  title: "Catering Partner for Event Planners in Chennai | Brihadhee",
  description: `Plan ${CD} menus and white-label or co-branded live counters for Chennai events with Brihadhee. Send your agency's event brief.`,
  h1: "Catering Partner for Event Planners in Chennai",
};

/** Structured data for the catering pages: confirmed facts only. */
/* Offer catalogue for the event catering Service: one entry per confirmed kind of event. */
const FAMILY_EVENTS = ["baby_shower", "housewarming", "ear_piercing", "engagement", "get_together", "house_function", "small_events"];
const eventCatalog = [
  eventIds.includes("wedding") && { name: "Wedding catering", description: EVENTS.wedding.text },
  eventIds.includes("birthday") && { name: "Birthday catering", description: EVENTS.birthday.text },
  eventIds.some((id) => FAMILY_EVENTS.includes(id)) && {
    name: "Family function catering",
    description: `${CDcap} catering for ${joinNatural(eventIds.filter((id) => FAMILY_EVENTS.includes(id)).map((id) => EVENTS[id].inline))}.`,
  },
].filter(Boolean);

export { eventCatalog, eventIds, EVENTS, guestRange };

export function cateringSchema() {
  return pageGraph({
    path: CATERING_PATH,
    title: meta.title,
    description: meta.description,
    crumbs: [...HOME_CRUMBS, { name: "Catering", path: CATERING_PATH }],
    extras: [
      cateringServiceSchema({
        areas,
        phone: contact.phone,
        serviceType: "Event catering",
        description: `${CDcap} event and wedding catering in Chennai with regional menus and live counters. Agree the event service and per-plate price in the quote.`,
        offerCatalog: eventCatalog,
        guests: guestRange,
      }),
      faqPageSchema(CATERING_PATH, faqs),
    ],
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
        description: `${CDcap} live counters and regional menus for event management companies in Chennai, white-label or co-branded, with per-plate pricing.`,
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
const corpClients = cateringEnabled ? factOr("corporateClients", []) : [];
/* Names led with in copy: the most widely known, but only while they stay in the client list. */
const clientLead = ["Nestlé", "Prodapt", "HungerBox"].filter((n) => corpClients.includes(n));
const safety = cateringEnabled ? factOr("foodSafety", null) : null;
const fssai = factOr("fssaiLicence", null);
const DAILY = corporate ? `${fmt(corporate.dailyCovers)}+` : null;
const lunchCat = cateringEnabled ? category("lunch") : null;
const drinksCat = cateringEnabled ? category("beverages") : null;
const mealDesc = (n) => lunchCat?.items.find((i) => i.name === n)?.description?.replace(/\.$/, "") ?? "";
const lc1 = (t) => t.charAt(0).toLowerCase() + t.slice(1);
const mealDescOf = (cat, n) => cat?.items.find((i) => i.name === n)?.description?.replace(/\.$/, "") ?? n;
const hasService = (re) => corpServices.some((x) => re.test(x));

export const corporateEnabled = Boolean(cateringEnabled && corporate);

export const corporateMeta = {
  title: `${CDcap} Corporate Catering in Chennai | Brihadhee`,
  description: `${CDcap} office lunch catering, bulk meals and recurring employee meal programmes in Chennai. Share your office location and headcount for a quote.`,
  h1: `${CDcap} Corporate Catering and Office Lunches in Chennai`,
};

export const corporatePage = corporateEnabled
  ? {
      path: CORPORATE_PATH,
      intro: `Brihadhee supplies ${CD} office lunches and recurring employee meals across Chennai. For a one-off packed bulk lunch or a staffed office event, share the date and headcount so the team can discuss what you need.`,
      glance: [
        ["Who", `Brihadhee, a ${PV} restaurant on ${STREET} with a ${CD} catering service`],
        ["Daily corporate volume", `${DAILY} people served per day across the corporate catering operation`],
        ["Services", corpServices.join(", ")],
        ["Areas", joinNatural(corpAreas)],
        ...(corpClients.length ? [["Clients", `Companies Brihadhee has catered for include ${joinNatural(corpClients)}`]] : []),
        ["Start", corpProcess.map((p, i) => `${i + 1}. ${p.title}`).join(", ")],
        ["Pricing", pricingText ?? "On enquiry"],
      ],
      scale: {
        id: "scale",
        title: "Daily Office Meal Volume",
        lead: `Brihadhee serves ${DAILY} people per day across its corporate catering operation. Share your headcount and delivery schedule so the team can confirm capacity for your office.`,
        items: [
          {
            title: "One-off events",
            text: guests
              ? `A single catered event has its own guest range of ${fmt(guests.min)} to ${fmt(guests.max)}. For a staffed office celebration, see [event catering](/catering-services-chennai/) or discuss it with the corporate team.`
              : "For a staffed office celebration, share your guest count, date and venue with the corporate team.",
          },
          {
            title: "The restaurant kitchen",
            text: `The team cooks office meals at Brihadhee's restaurant kitchen on ${STREET}. Your admin or HR team can discuss a tasting when planning a recurring service.`,
          },
        ],
      },
      clients: corpClients.length
        ? {
            id: "clients",
            title: "Companies We Have Catered For",
            lead:
              `Brihadhee has catered corporate events and office meals for ${corpClients.length} companies` +
              (clientLead.length ? `, including ${clientLead.join(", ")} and ${corpClients.length - clientLead.length} more.` : "."),
            names: corpClients,
          }
        : null,
      /* Coffee bar for office events and meetings (client direction, 2026-11-14).
       * Drinks come from the restaurant's beverages menu; no prices, since catering is quoted per event. */
      coffeeBar: drinksCat
        ? {
            id: "coffee-bar",
            title: "Coffee Bar for Office Events",
            lead: `Brihadhee sets up a coffee bar for office events, meetings and celebrations, serving South Indian filter coffee alongside the other hot drinks from its restaurant menu. Share your guest count, venue and serving times when you ask for a quote.`,
            dishes: drinksCat.items.map((i) => ({ name: i.name, note: i.description?.replace(/\.$/, "") })),
            items: [
              {
                title: "Filter coffee, the South Indian way",
                text: `The coffee bar is built around filter coffee (${lc1(mealDescOf(drinksCat, "Filter Coffee")).replace(/^south/, "South")}), the same filter coffee guests order at the restaurant on ${STREET}.`,
              },
              {
                title: "With lunch or on its own",
                text: "Add the coffee bar to a catered office lunch or event, or book it for a meeting, training day or client visit. Tell the team how many people to expect and when.",
              },
            ],
            image: { name: "coffee", alt: "Filter coffee in a steel tumbler and davara" },
            links: [{ label: "Ask about the coffee bar", href: "#enquiry", primary: true }],
          }
        : null,
      services: {
        id: "services",
        title: "Corporate Catering Services",
        lead: `Choose recurring office lunches, a packed bulk meal order or a staffed office event. Brihadhee offers ${CD} menus for each service.`,
        tint: true,
        items: [
          hasService(/daily office lunch/) && {
            title: "Daily Office Lunch Supply",
            text: "For regular workdays, share the number of meals, office address, delivery days and preferred lunch window. Agree the menu rotation and delivery slot with the team.",
          },
          hasService(/bulk lunch/) && {
            title: "Bulk Lunch Catering",
            text: "For a packed lunch order for a training day, meeting or client visit, share the date, venue, meal count and delivery window.",
          },
          hasService(/employee meal/) && {
            title: "Employee Meal Programmes",
            text: "HR and admin teams can discuss menu rotation, portions, dietary requirements and how headcount will vary during the week.",
          },
          hasService(/office parties|corporate events/) && {
            title: "Office Parties and Corporate Events",
            text: `For a staffed festival lunch or team celebration, share the venue, guest count and meal time. Tell the team which live counters or serving setup you are considering.`,
          },
        ].filter(Boolean),
      },
      menus: {
        id: "menus",
        title: `Sample ${CDcap} Corporate Menus`,
        lead: "These sample menus are built from dishes Brihadhee already serves at its restaurant; your final menu, portions and per-plate price are agreed with your team before the trial week.",
        items: [
          {
            title: "Standard South Indian Office Lunch",
            text: `A weekday lunch example based on the restaurant's Tamil Nadu meals: ${lc1(mealDesc("Limited TN Meals"))}.`,
          },
          {
            title: "Nellai Special Sodhi Meals Day",
            text: `A menu rotation example based on the Nellai Special Sodhi Meals: ${lc1(mealDesc("Nellai Special Sodhi Meals"))}.`,
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
            lead: `Brihadhee prepares and packs corporate meals in its FSSAI-licensed restaurant kitchen on ${STREET}. For recurring office meals, agree the delivery time slot and discuss any dietary requirements with the team.`,
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
      checklist: {
        id: "choose-a-caterer",
        title: "Choosing a Corporate Caterer in Chennai: a 5-Point Checklist",
        lead: "Before arranging recurring office lunches, discuss daily volume, kitchen practices, menu rotation, delivery timing and the trial.",
        tint: true,
        items: [
          { title: "1. Daily volume for your site", text: "Share your usual and peak meal counts. For more than one office, provide the headcount and delivery window at each site." },
          { title: "2. Kitchen hygiene and licence", text: `Ask where the food is cooked and see the kitchen. Brihadhee cooks in its FSSAI-licensed restaurant kitchen on ${STREET}, and shares the licence number with your admin team on request.` },
          { title: "3. Menu rotation", text: "Ask how often the menu changes. Brihadhee runs a rotating menu, with special days such as Nellai Special Sodhi Meals built into the cycle." },
          { title: "4. Delivery punctuality", text: "Ask for an agreed delivery slot for each office. Brihadhee packs meals in its kitchen and delivers them to the time slot agreed with you." },
          { title: "5. A tasting and a trial", text: "Discuss a kitchen tasting and one-week trial so your office can assess the proposed menu, portions and delivery timing." },
        ],
      },
      faq: qaRoute(CORPORATE_PATH, [
        qa(
          "Does Brihadhee do corporate catering?",
          `Yes. Brihadhee runs ${CD} corporate catering across Chennai, serving more than ${fmt(corporate.dailyCovers)} people every day with office lunches, bulk meals, employee meal programmes and office events. ` +
            `Its kitchen is at ${addr()}.`
        ),
        /* Scale distinction (AEO audit 2026-11-12, 4.2 and 4.4): daily corporate volume is not single-event capacity. */
        qa(
          "How many people can Brihadhee cater for?",
          `Brihadhee serves ${DAILY} people per day across its corporate catering operation. ` +
            (guests ? `A single event has a separate guest range of ${fmt(guests.min)} to ${fmt(guests.max)}. ` : "") +
            "Share your office headcount to check capacity for your site."
        ),
        qa(
          `How do I choose a corporate caterer in Chennai?`,
          `Brihadhee suggests checking five things: the daily volume a caterer already handles, its kitchen hygiene and licence, menu rotation, delivery punctuality, and whether you can taste and trial before signing. ` +
            `Brihadhee answers these with ${fmt(corporate.dailyCovers)}+ meals a day, an FSSAI-licensed kitchen, a rotating menu, agreed delivery slots, and a tasting plus a trial week.`,
          { kind: "explain" }
        ),
        qa(
          `Which caterers in Chennai supply ${CD} office lunches every day?`,
          `Brihadhee, a restaurant in ${NEAR}, supplies daily ${CD} office lunches to ${corpAreas.length} Chennai areas, from Guindy and Ambattur Industrial Estate to the OMR IT corridor. ` +
            `Lunches rotate through a menu cycle agreed with each office.`
        ),
        qa(
          "How does Brihadhee's corporate catering work?",
          `For regular office lunches, give Brihadhee your Chennai office location, daily meal count and delivery schedule. ` +
            `Discuss a tasting at its Anna Nagar East kitchen and a one-week trial before agreeing a rotating menu and delivery slot. You can also enquire about a packed bulk lunch or a staffed office event.`,
          { id: "how-does-brihadhee-start-a-corporate-catering-account" }
        ),
        qa(
          "Is Brihadhee's corporate catering kitchen FSSAI licensed?",
          `Yes. Brihadhee cooks every corporate meal in its FSSAI-licensed, ${PV} restaurant kitchen in ${NEAR}, where no meat, egg or fish is cooked. ` +
            `Meals are packed in the kitchen and delivered to an agreed time slot.`
        ),
        qa(
          "How much does corporate catering from Brihadhee cost?",
          `Brihadhee prices corporate catering per plate, quoted for your menu, headcount and delivery location. ` +
            "Share your meal schedule and whether the order is recurring or one-off so the team can discuss the quote."
        ),
        qa(
          "Does Brihadhee deliver corporate lunches to OMR and Tidel Park?",
          `Yes. Brihadhee delivers ${CD} corporate lunches to offices on OMR, including Tidel Park, Taramani, Perungudi, Sholinganallur and Siruseri. ` +
            `It serves ${corpAreas.length} Chennai areas in all.`
        ),
        qa(
          "Can my office try Brihadhee before signing up for daily catering?",
          `Yes. Brihadhee offers a kitchen tasting in ${NEAR} and a one-week trial for office meal programmes. ` +
            "Discuss timing and arrangements with the team before daily service begins."
        ),
        qa(
          "Can Brihadhee cater office parties and corporate events in Chennai?",
          `Yes. Brihadhee caters office parties and corporate events across Chennai with ${CD} menus and live counters available to discuss. ` +
            `Staffed events have a guest range of ${guests ? `${fmt(guests.min)} to ${fmt(guests.max)}` : "50 guests and up"}.`
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
        name: `Brihadhee ${CDcap} Corporate Catering`,
        description: `${CDcap} corporate catering in Chennai: daily office lunches, bulk lunch catering, employee meal programmes and corporate events. Brihadhee serves ${DAILY} people per day across its corporate catering operation.`,
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
      title: "Event Catering Services to Discuss",
      lead: `Brihadhee can handle ${eventService.replace(/^end-to-end service: /, "")} for events across Chennai. Tell the team what you need and agree which services the quote will cover.`,
      items: [
        steps4.includes("menu planning") && { title: "Menu planning", text: `Choose a regional menu with the team: Tirunelveli and Karaikudi dishes, South Indian meals, North Indian and Indo-Chinese options, and the live counters you want, all ${CD}.` },
        steps4.includes("cooking") && { title: "Cooking", text: `The food is cooked by the team that runs the restaurant on ${STREET}, from the same recipes guests eat there.` },
        steps4.includes("serving") && { title: "Serving", text: "Discuss how food should be served at the function, and whether your event needs serving staff or live counter service." },
        steps4.includes("setup") && { title: "Setup", text: "Tell the team about your venue so you can agree the serving area, counter setup and access arrangements." },
      ].filter(Boolean),
      note: "Confirm the preparation arrangements and what the quote covers for staffing, transport, vessels and clean-up with the catering team.",
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
