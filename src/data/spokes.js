/**
 * Spoke pages from the 12 November keyword plan (section 6), added to the
 * existing hub-and-spoke site without renaming any live URL:
 *
 *   /small-function-catering-chennai/  priority 1 (section 1a): small and mid-size
 *                                      vegetarian catering from 50 guests
 *   /catering-quote-chennai/           quote and booking intent (3.9b), quote builder
 *   /family-dining-anna-nagar/         temple-visit and family-occasion dining (3.18, 3.19)
 *   /faq/                              brand answers not owned by another page (4.2, 4.7),
 *                                      plus an index of every page's Q&A block
 *   /no-onion-no-garlic-anna-nagar/    GATED (3.15 to 3.17, 4.8): built only when
 *                                      ENABLE_NO_ONION_NO_GARLIC_CLUSTER is on, or as a
 *                                      noindex draft in `astro dev` / SEO_GATES_PREVIEW=1
 *
 * Same rules as src/data/pages.js: one H1, title <= 60 and description <= 155
 * characters (scripts/check-seo.mjs), answer-first copy, every Q&A through qa() and
 * qaRoute() (src/lib/answers.js), facts only from entity-truth.ts, prices only from
 * menu-canonical.ts, and every claim the client has not confirmed behind a gate in
 * config/seo-gates.ts. No competitor names; no "best" claims outside question headings.
 */
import { getFact, addressLine, openingTimes } from "./entity-truth.ts";
import * as GATES from "../../config/seo-gates.ts";
import { ROUTES, href, telHref } from "./site.js";
import { qa, qaRoute, claimQuestion, list } from "../lib/answers.js";
import { taSmallFunctions } from "./faq-ta.js";
import verification from "../../config/client-verification.json";
import {
  cateringEnabled,
  corporateEnabled,
  guests,
  liveCounters,
  contact,
  eventService,
  joinNatural,
  eventIds,
  EVENTS,
  serviceAreas,
} from "./catering.js";
import { pageGraph, faqPageSchema, cateringServiceSchema, HOME_CRUMBS } from "../lib/schema.js";
import { byo, category, allItems, rupees, priceRange, summarise, filterCoffee, menuNotes } from "../lib/menu-facts.js";

/** Gated pages render as noindex drafts in `astro dev` or with SEO_GATES_PREVIEW=1. */
export const gatePreview =
  Boolean(import.meta.env?.DEV) || (typeof process !== "undefined" && process.env?.SEO_GATES_PREVIEW === "1");

const CD = GATES.CATERING_DIET;
const MIN = GATES.CATERING_MIN_GUESTS;
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const name = getFact("name");
const PV = "100% pure vegetarian";
const NEAR = "Anna Nagar East";
const STREET = getFact("street");
const ADDRESS = addressLine();
const phone = getFact("phone"); // restaurant number (family dining, FAQ)
/* The catering pages (small functions, quote) use the catering numbers (config enquiry_channels). */
const cPhone = contact.phone ?? phone;
const cWhatsapp = contact.whatsapp ?? getFact("whatsapp");
const recipeStory = getFact("recipeStory");
const { open: OPEN, close: CLOSE, range: HOURS } = openingTimes();
const num = (n) => n.toLocaleString("en-IN");

if (guests && guests.min !== MIN) {
  throw new Error(`[spokes] config/client-verification.json min_guests (${guests.min}) != CATERING_MIN_GUESTS (${MIN}) in config/seo-gates.ts`);
}

const offers = getFact("offers");
const offer = (id) => {
  const o = offers.find((x) => x.id === id);
  if (!o) throw new Error(`[spokes] offer "${id}" missing in entity-truth.ts`);
  return o;
};
const prebook = offer("pre-booking").description.replace(/ when you pre-book a table through .*$/, ""); // "up to 40% off Monday to Thursday"
const walkIn = offer("walk-in").description.replace(/ for walk-in dine-in$/, ""); // "10% off"
const bookingLabels = getFact("bookingLinks").map((b) => b.label);
const bookingAnd = list(bookingLabels);

const item = (n) => {
  const hit = allItems.find((i) => i.name === n);
  if (!hit) throw new Error(`[spokes] menu item "${n}" not found in menu-canonical.ts`);
  return hit;
};
const sodhiMeals = item("Nellai Special Sodhi Meals");
const paanai = item("Paanai Parotta");
const poppers = item("Karaikudi Paneer Poppers");
const kali = item("Karuppatti Ulundhu Kali");
const idiyappamSodhi = item("Idiyappam Sodhi");
const combos = category("combos");
const lunch = category("lunch");
const tnMeals = summarise(lunch.items.filter((i) => /TN Meals/.test(i.name)));
const batters = byo.steps.find((s) => s.name === "Batter").options;
const batterRange = priceRange(summarise(batters));
const dish = (i) => ({ name: i.name, price: rupees(i.price), note: i.description });
const svc = eventService ? eventService.replace(/^end-to-end service: /, "") : "menu planning, cooking and serving";
/* Not yet confirmed by the owner (config/client-verification.json): clean-up and
 * vessels, cooking on site or delivered, and the advance notice. Until each is
 * confirmed the copy says it is agreed on the quote call; it never guesses. */
const cleanupKnown = typeof verification.staff_serving_cleanup_included === "boolean";
const cleanupLine = cleanupKnown
  ? verification.staff_serving_cleanup_included
    ? "Serving staff and clean-up are included."
    : "Serving and clean-up are arranged by you."
  : "Transport, vessels and clean-up are agreed for each function on the quote call.";
const leadTime = typeof verification.advance_notice_required === "string" && verification.advance_notice_required ? verification.advance_notice_required : null;
const corp = corporateEnabled ? getFact("corporateCatering") : null;

/* ======================================================================= *
 * /small-function-catering-chennai/  (keyword plan 3.9a, priority 1)       *
 * ======================================================================= */
const SMALL_IDS = ["birthday", "get_together", "housewarming", "baby_shower", "ear_piercing", "engagement", "house_function", "small_events", "small_wedding"];
const smallEvents = cateringEnabled ? SMALL_IDS.filter((id) => eventIds.includes(id)).map((id) => ({ id, ...EVENTS[id] })) : [];
const hasBirthday = smallEvents.some((e) => e.id === "birthday");

function buildSmallFunctions() {
  const path = ROUTES.smallFunctions;
  const quoteHref = `${href(ROUTES.cateringQuote)}#enquiry`;
  const title = `Small Function Catering in Chennai, ${MIN}+ Guests | ${name}`;
  const description = `${cap(CD)} catering for birthdays, housewarmings and family gatherings in Chennai from ${MIN} guests. Share your date, venue and headcount.`;
  const faq = qaRoute(path, [
    qa(
      "Who does small function catering in Anna Nagar?",
      `${name}, a restaurant in ${NEAR}, does small function catering from ${MIN} guests with ${CD} menus for birthdays, housewarmings and get-togethers. ` +
        `It is at ${ADDRESS}.`
    ),
    qa(
      `Does ${name} cater for ${MIN} guests?`,
      `Yes. ${name} caters for ${MIN} guests at a single event in Chennai. ` +
        `${MIN} is the event minimum and ${num(guests.max)} is the maximum. Share your date, venue and menu preferences with the catering team.`,
      { id: "what-is-the-minimum-guest-count-for-brihadhee-catering" }
    ),
    qa(
      "How much does vegetarian catering cost per plate in Chennai?",
      `${name} quotes ${CD} catering per plate for each function. ` +
        "The menu, headcount, counters and service requirements help shape the price. Share these details and what you plan to spend when you request a quote.",
      { kind: "explain" }
    ),
    qa(
      `What does ${name}'s end-to-end catering include?`,
      `${name}'s event team can handle ${svc}, with live counters available to discuss. ` + cleanupLine
    ),
    qa(
      `How far ahead should I book catering for ${MIN} guests?`,
      leadTime
        ? `Book ${name} catering at least ${leadTime} ahead of your function. Call ${cPhone} to check your date.`
        : `${name} has not published a fixed booking lead time, so call ${cPhone} as soon as your date is set. ` +
            `The team confirms whether it can take your date and guest count.`
    ),
    hasBirthday &&
      qa(
        `Can ${name} cater a birthday party for ${MIN} guests in Chennai?`,
        `Yes. ${name} caters birthday parties across Chennai from ${MIN} guests, with a live dosa counter available to discuss. ` +
          `Send the quote form with your date, venue and guest count, or call ${cPhone}.`
      ),
    ...taSmallFunctions,
  ]);

  return {
    path,
    title,
    description,
    h1: `Small Function Catering in Chennai, From ${MIN} Guests`,
    eyebrow: "Small functions · Chennai",
    intro: `${name} provides ${CD} catering for birthdays, housewarmings and family get-togethers across Chennai from ${MIN} guests. Share your date, venue and estimated headcount with the Anna Nagar East team to discuss a South Indian menu for your gathering.`,
    tamil: "பிறந்தநாள் விழா கேட்டரிங் சென்னை · சைவ கேட்டரிங் சென்னை · சைவ கேட்டரிங் அண்ணா நகர்",
    cta: "quote",
    primaryAction: { label: "Request a small-function quote", shortLabel: "Function quote", href: quoteHref, event: "quote_cta_click" },
    showDirections: false,
    glanceTitle: "Small function catering at a glance",
    glance: [
      ["Starting guest count", `${MIN} guests per event`],
      ["Functions", smallEvents.map((e) => e.label).join(", ")],
      ["Food", `${CD} regional menus; live counters for ${joinNatural(liveCounters)}`],
      ["Service to discuss", svc],
      ["Price", "a per-plate quote for each function, after you share the details"],
      ["Area", joinNatural(serviceAreas)],
    ],
    sections: [
      {
        id: "from-50-guests",
        title: `Planning a Function for ${MIN} Guests`,
        lead: `For a family function from ${MIN} guests, start with the date, venue and estimated headcount. If you are planning a smaller celebration, [ask about family dining and group seating](${ROUTES.familyDining}).`,
        items: [
          {
            title: "At home or in a hall",
            text: "Tell the team where guests will eat, when the meal should be served and whether you need help with serving or a live counter. Confirm the setup and service details for your venue in the quote.",
          },
          {
            title: "A South Indian menu for your gathering",
            text: `Discuss dishes from Tirunelveli and Karaikudi, such as Nellai sodhi or ${kali.name}, and tell the team which dishes matter most to your guests.`,
          },
          {
            title: "A live build-your-own dosa counter",
            text: `Guests can [build their own dosa](${ROUTES.dosa}) at a live counter: ${byo.batterCount} batters, podis, fillings and a ghee, butter or oil roast, made to order by the kitchen team.`,
          },
        ],
      },
      {
        id: "occasions",
        title: "Small Functions We Cater",
        lead: `${name} caters ${joinNatural(smallEvents.map((e) => e.inline))} across Chennai, from ${MIN} guests.`,
        tint: true,
        items: smallEvents.map((e) => ({ title: e.label, text: e.text })),
      },
      {
        id: "catering-price",
        title: "How the Per-Plate Quote Works",
        lead: `${name} quotes each function separately. The headcount, meal, dishes, live counters and serving requirements shape the quote. Share your planned spend if you have one.`,
        links: [{ label: "See what to include in a catering quote", href: `${href(ROUTES.cateringQuote)}#what-to-send` }],
      },
      {
        id: "get-a-quote",
        title: "Get a Quote for Your Function",
        lead: "Share the occasion, date, venue and estimated guest count. Include your meal and service preferences so the team can discuss a menu and per-plate quote.",
        tint: true,
        links: [
          { label: "Request a small-function quote", href: quoteHref, primary: true },
          ...(contact.telHref ? [{ label: `Call ${cPhone}`, href: contact.telHref }] : []),
        ],
      },
    ],
    faqTitle: "Small function catering questions",
    faq,
    related: [
      { label: "Event and wedding catering in Chennai", href: href(ROUTES.eventCatering) },
      ...(corporateEnabled ? [{ label: `${cap(CD)} corporate catering in Chennai`, href: href(ROUTES.corporateCatering) }] : []),
      { label: "Pure veg restaurant in Anna Nagar", href: href("/") },
      { label: "Family dining in Anna Nagar", href: href(ROUTES.familyDining) },
    ],
    schema: () =>
      pageGraph({
        path,
        title,
        description,
        crumbs: [...HOME_CRUMBS, { name: "Catering", path: ROUTES.eventCatering }, { name: "Small function catering", path }],
        extras: [
          cateringServiceSchema({
            areas: serviceAreas,
            phone: contact.phone,
            path,
            serviceType: "Event catering",
            name: `${name} Small Function Catering`,
            description: `${cap(CD)} catering in Chennai from ${MIN} guests for ${joinNatural(smallEvents.map((e) => e.inline))}, with regional menus and live counters to discuss.`,
            offerCatalog: smallEvents.map((e) => ({ name: `${e.label} catering`, description: e.text })),
            guests: { min: MIN },
            audience: [{ "@type": "Audience", audienceType: "Families planning small functions" }],
          }),
          faqPageSchema(path, faq),
        ],
      }),
  };
}
export const smallFunctionsPage = cateringEnabled && guests && smallEvents.length ? buildSmallFunctions() : null;

/* ======================================================================= *
 * /catering-quote-chennai/  (keyword plan 3.9b)                            *
 * ======================================================================= */
const whatsappQuote = GATES.ENABLE_LIVE_WHATSAPP_QUOTE_FORM && GATES.QUOTE_WHATSAPP_NUMBER ? GATES.QUOTE_WHATSAPP_NUMBER : null;
if (GATES.ENABLE_LIVE_WHATSAPP_QUOTE_FORM && !GATES.QUOTE_WHATSAPP_NUMBER) {
  throw new Error("[spokes] ENABLE_LIVE_WHATSAPP_QUOTE_FORM is on but QUOTE_WHATSAPP_NUMBER is empty (Q19, config/seo-gates.ts)");
}

function buildQuote() {
  const path = ROUTES.cateringQuote;
  const title = `Catering Quote in Chennai for ${MIN}+ Guests | ${name}`;
  const description = `Request a ${CD} catering quote in Chennai for events from ${MIN} guests. Share your date, venue, guest count, menu and service requirements.`;
  const reply = whatsappQuote ? "follows up on WhatsApp" : "follows up by phone";
  const whatToSend = claimQuestion(path, "What Do I Need to Tell a Caterer to Get a Quote?");
  const faq = qaRoute(path, [
    qa(
      `How can I request a catering quote from ${name}?`,
      `Use the ${name} event quote form with the occasion, Chennai venue area, estimated guest count from ${MIN}, and date if known. ` +
        (whatsappQuote
          ? "The form opens WhatsApp with your details ready to send."
          : `Add menu and serving preferences for the catering team, or call ${cPhone} to discuss them.`),
      { id: "how-do-i-get-a-catering-quote-from-brihadhee" }
    ),
    qa(
      `What happens after I send ${name} a catering enquiry?`,
      `${name}'s catering team ${reply} to discuss the menu, venue, service and per-plate quote. ` +
        "Your event is booked after you and the team confirm availability and agree the details."
    ),
    qa(
      `Does ${name} provide serving staff with catering?`,
      `${name} can provide serving as part of its end-to-end event service. ` +
        `Tell the team whether you need staff and confirm the scope in your quote. ${cleanupLine}`
    ),
    whatsappQuote
      ? qa(
          `Can I send a catering enquiry to ${name} on WhatsApp?`,
          `Yes. The quote form on this page sends your details to ${name}'s catering team on WhatsApp at ${whatsappQuote}, for functions from ${MIN} guests. ` +
            `The team replies with a menu and a per-plate price.`
        )
      : qa(
          `Can I send a catering enquiry to ${name} on WhatsApp?`,
          `Yes. WhatsApp ${name}'s catering team on ${cWhatsapp} with your event, date, venue and guest count (from ${MIN}). ` +
            "Use WhatsApp to message the team directly. Enquiries sent through the form are followed up by phone."
        ),
    qa(
      `What is on a ${CD} catering menu for ${MIN} people?`,
      `Brihadhee's Anna Nagar East team can discuss dishes such as Nellai sodhi, ${kali.name} and ${paanai.name} for ${MIN} guests. ` +
        "Ask about a live build-your-own dosa counter and confirm the final menu in your quote."
    ),
  ]);

  return {
    path,
    title,
    description,
    h1: `Get a ${cap(CD)} Catering Quote in Chennai`,
    eyebrow: "Catering quote · Chennai",
    intro: `Share your event date, Chennai venue and estimated headcount from ${MIN} guests. Brihadhee ${reply} to discuss the ${CD} menu, service requirements and per-plate quote.`,
    cta: "quote",
    primaryAction: { label: "Go to the quote form", shortLabel: "Quote form", href: "#enquiry", event: "quote_cta_click" },
    showDirections: false,
    builder: {
      whatsappNumber: whatsappQuote,
      min: MIN,
      fallbackWhatsapp: whatsappQuote ? null : cWhatsapp,
    },
    sections: [
      {
        id: "what-to-send",
        title: whatToSend,
        lead: `Tell Brihadhee what you are planning, where and when it will take place, and how many guests you expect. Add any preferences that will help the team put together a quote.`,
        items: [
          { title: "Event, date and venue", text: "Give the occasion, date or approximate timing and venue area in Chennai. Add your meal time if you know it." },
          { title: "Headcount and meal", text: `An estimated guest count from ${MIN} is enough to start. Indicate lunch or dinner and note any must-have dishes or dietary requirements for discussion.` },
          { title: "Serving and setup", text: "Tell the team if you need help with serving or live counters. Ask what the quote covers for setup, transport, vessels and clean-up." },
        ],
      },
      {
        id: "price-factors",
        title: "What Shapes Your Per-Plate Quote",
        lead: "The guest count, menu, live counters and service requirements all affect the quote. Share your planned spend per guest if you have one so the team can discuss suitable options.",
        items: [
          { title: "Menu and counters", text: "The dishes, number of guests and any live counter service help the team work out the menu and quantities." },
          { title: "Venue and service", text: "Share the location and the support you need at the venue. Ask the team to confirm what is included in the quote." },
        ],
      },
      {
        id: "how-quotes-work",
        title: `How a ${name} Catering Quote Works`,
        lead: `Send your enquiry, discuss the proposed menu and service with ${name}, then review the agreed details before booking.`,
        tint: true,
        items: [
          { title: "1. Send the details", text: whatsappQuote ? "Fill in the form; it opens WhatsApp with your details ready to send." : `Fill in the form, or call ${cPhone}.` },
          { title: "2. Review the proposal", text: `Discuss a ${CD} menu, any live counters and the service scope with the team.` },
          { title: "3. Confirm before booking", text: "Agree availability, menu, service and per-plate pricing with the team." },
        ],
      },
    ],
    faqTitle: "Catering quote questions",
    faq,
    related: [
      { label: `Small function catering from ${MIN} guests`, href: href(ROUTES.smallFunctions) },
      { label: "Event and wedding catering in Chennai", href: href(ROUTES.eventCatering) },
      ...(corporateEnabled ? [{ label: "Request recurring office lunch catering", href: `${href(ROUTES.corporateCatering)}#enquiry` }] : []),
      { label: "Catering for event planners", href: href(ROUTES.plannerPartner) },
      { label: "Pure veg restaurant in Anna Nagar", href: href("/") },
    ],
    schema: () =>
      pageGraph({
        path,
        title,
        description,
        crumbs: [...HOME_CRUMBS, { name: "Catering", path: ROUTES.eventCatering }, { name: "Catering quote", path }],
        extras: [faqPageSchema(path, faq)],
      }),
  };
}
export const quotePage = cateringEnabled && guests ? buildQuote() : null;

/* ======================================================================= *
 * /family-dining-anna-nagar/  (keyword plan 3.18, 3.19)                    *
 * Temple naming waits for Q24; "premium" waits for Q22.                   *
 * ======================================================================= */
function buildFamily() {
  const path = ROUTES.familyDining;
  const title = `Pure Veg Family Restaurant in Anna Nagar | ${name}`;
  const description = `Plan a vegetarian family lunch, birthday or anniversary dinner at ${name} in Anna Nagar East. View the menu and call ahead for group seating.`;
  const temple = GATES.ENABLE_NAMED_TEMPLE && GATES.NEARBY_TEMPLE ? GATES.NEARBY_TEMPLE : null;
  const faq = qaRoute(path, [
    qa(
      `Is ${name} good for families and groups?`,
      `Yes. ${name} is a family-friendly, ${PV} restaurant in ${NEAR}, open for lunch and dinner every day from ${HOURS}. ` +
        `For a large group, call ${phone} before you come so the team can arrange seating.`,
      { id: "families-groups" }
    ),
    qa(
      "Which Anna Nagar restaurant suits a family lunch after a temple visit?",
      `${name}, in ${NEAR}, suits a family lunch after a temple visit: it opens at ${OPEN} daily, and no meat, egg or fish is cooked in its kitchen. ` +
        `Its ${sodhiMeals.name} cost ${rupees(sodhiMeals.price)}, served on a banana leaf.`
    ),
    qa(
      "Which vegetarian restaurant in Anna Nagar is good for a birthday or anniversary dinner?",
      `${name}, in ${NEAR}, serves dinner every day until ${CLOSE} and takes table pre-bookings for birthdays and anniversaries on ${bookingAnd}. ` +
        `Pre-booked tables get ${prebook}.`
    ),
  ]);

  return {
    path,
    title,
    description,
    h1: "A Pure Veg Family Restaurant in Anna Nagar East",
    eyebrow: "Family dining · Anna Nagar East",
    intro: `${name} is a ${PV} family restaurant in ${NEAR}, open every day from ${HOURS} for lunch and dinner. No meat, egg or fish is cooked in its kitchen and alcohol is not served, so vegetarian families can order anything on the menu.`,
    menuHref: href(ROUTES.menu),
    primaryAction: { label: "Book a family table", href: href(ROUTES.book) },
    glanceTitle: `Family dining at ${name}: summary`,
    glance: [
      ["Who", `${name}, a ${PV} restaurant in ${NEAR}`],
      ["Open", `${HOURS} daily · ${GATES.MEAL_FRAMING}`],
      ["Food", recipeStory],
      ["Good for", "lunch after a morning temple visit, birthdays, anniversaries and weekend family meals"],
      ["Booking", `pre-book on ${bookingAnd}, or walk in`],
      ["Offers", `${walkIn} for walk-in diners; ${prebook} when pre-booked`],
      ["Location", `${STREET}, Chennai ${getFact("address").postalCode}`],
    ],
    sections: [
      {
        id: "after-temple",
        title: "Family Lunch After a Morning Temple Visit",
        lead:
          `${name} opens at ${OPEN} every day, so families can sit down to a ${PV} lunch after a morning temple visit: no meat, egg or fish is cooked in its kitchen, and lunch runs from the ${sodhiMeals.name} (${rupees(sodhiMeals.price)}) to Tamil Nadu meals (${priceRange(tnMeals)}).` +
          (temple ? ` ${temple.name} is on ${temple.where}.` : ""),
        dishes: [dish(sodhiMeals), ...lunch.items.filter((i) => /TN Meals/.test(i.name)).map(dish)],
        links: [{ label: "Veg lunch and Nellai meals in Anna Nagar", href: href(ROUTES.lunch) }],
      },
      {
        id: "celebrations",
        title: "Birthday and Anniversary Dinners",
        lead: `For a birthday or anniversary dinner at ${name}, choose a date and time through one of the booking partners. For a large group, call ahead so the restaurant can check seating for your party.`,
        tint: true,
        items: smallFunctionsPage ? [
          {
            title: `Celebrating with ${MIN} or more guests?`,
            text: `For a family function of ${MIN} guests or more, ${name} caters at your home or venue: see [small function catering in Chennai](${ROUTES.smallFunctions}).`,
          },
        ] : [],
        links: [{ label: `Veg dinner in Anna Nagar until ${CLOSE}`, href: href(ROUTES.dinner) }],
      },
      {
        id: "family-favourites",
        title: `What Families Order at ${name}`,
        lead: `At ${name}, everyone at the table can build their own dosa from ${byo.batterCount} batters (${batterRange}), and the table can share Nellai meals, ${paanai.name} and ${poppers.name}.`,
        dishes: [paanai, poppers, filterCoffee].map(dish),
        links: [
          { label: "Build your own dosa", href: href(ROUTES.dosa) },
          { label: "Full menu with prices", href: href(ROUTES.menu) },
        ],
      },
      {
        id: "family-booking",
        title: "Booking a Table for a Family Group",
        lead: `When you call about a group table at ${name}, share your date, preferred time and party size so the team can check seating. For a regular table, use ${bookingAnd} or walk in. See [the address and directions](${ROUTES.about}#find-us) before you leave.`,
        tint: true,
        links: [
          { label: "How to book a table", href: href(ROUTES.book), primary: true },
          { label: "Call about group seating", href: telHref },
        ],
      },
    ],
    faqTitle: "Family dining questions",
    faq,
    related: [
      { label: "Pure veg restaurant in Anna Nagar", href: href("/") },
      { label: "Nellai meals in Anna Nagar", href: href(ROUTES.lunch) },
      { label: "Veg dinner in Anna Nagar", href: href(ROUTES.dinner) },
      { label: "Brihadhee questions and answers", href: href(ROUTES.faq) },
      ...(smallFunctionsPage ? [{ label: "Small function catering in Chennai", href: href(ROUTES.smallFunctions) }] : []),
    ],
    schema: () =>
      pageGraph({
        path,
        title,
        description,
        crumbs: [...HOME_CRUMBS, { name: "Family dining", path }],
        extras: [faqPageSchema(path, faq)],
      }),
  };
}
export const familyPage = buildFamily();

/* ======================================================================= *
 * /faq/  (keyword plan 4.2 and 4.7)                                        *
 * Only questions no other page owns (one Q&A per route), plus an index of *
 * every page's Q&A block, so the hub never duplicates a spoke's answer.   *
 * ======================================================================= */
function buildFaqHub() {
  const path = ROUTES.faq;
  const title = `${name} FAQ: Timings, Dosa, Catering | Anna Nagar`;
  const description = `Answers about ${name}, the pure veg South Indian restaurant in Anna Nagar East: lunch and dinner only, ${OPEN} to ${CLOSE}, dosa, catering and bookings.`;
  const faq = qaRoute(path, [
    /* The single permitted mention of the retired service: the exact question in
       config/seo-gates.ts, answered without repeating the word. */
    qa(GATES.NEGATIVE_FAQ_QUESTION, `No. ${name} serves lunch and dinner only, from ${HOURS} every day.`, { id: GATES.NEGATIVE_FAQ_ID }),
    qa(
      `Does ${name} serve non-veg food?`,
      `No. ${name}'s restaurant is ${PV}: no meat, egg or fish is cooked in its kitchen, and alcohol is not served. ` +
        `Its catering is ${CD}, and each function's menu is agreed in the quote.`
    ),
    qa(
      `What makes ${name} different?`,
      `${name} is a ${PV} South Indian restaurant in ${NEAR} where diners choose their dosa ingredients and the kitchen cooks each dosa to order. ` +
        `The menu also features ${sodhiMeals.name}, a Tirunelveli lunch with coconut milk stew, and Karaikudi dishes such as ${poppers.name}.`,
      { id: "how-is-brihadhee-different-from-other-pure-veg-restaurants-i" }
    ),
    qa(
      `Is ${name} related to the Brihadeeswarar Temple?`,
      `No. ${name} is a restaurant in Anna Nagar East, Chennai, and is not affiliated with the Brihadeeswarar Temple in Thanjavur. ` +
        `Its name is a tribute to the temple and its Chola architecture.`
    ),
    qa(
      `Is ${name} on Swiggy or Zomato?`,
      `Yes. ${name} has its own listings on Zomato and Swiggy Dineout, as well as EazyDiner and District. ` + `Its full menu, with every price, is on this website.`
    ),
    qa(
      `Does ${name} deliver food?`,
      `${name} has not confirmed a delivery service on its website, so call ${phone} to check current delivery and parcel options for your area. ` +
        `${menuNotes.parcel}`
    ),
    qa(
      `Is there parking at ${name}?`,
      `${name} has not published parking details yet, so call ${phone} before you visit to ask about parking near the restaurant at your time. ` +
        `Directions from nearby landmarks are on the address and contact page.`
    ),
  ]);
  const topic = (label, route) => ({ label, href: `${href(route)}#faq` });
  return {
    path,
    title,
    description,
    h1: `${name} Questions and Answers`,
    eyebrow: "FAQ · Anna Nagar East",
    intro: `Short answers about ${name}, the ${PV} South Indian restaurant in ${NEAR}, Chennai, open every day from ${HOURS} for lunch and dinner only. Listings that still show a morning opening time are out of date. Each topic below links to the page with the full answers.`,
    menuHref: href(ROUTES.menu),
    sections: [
      {
        id: "first-visit",
        title: `A First Visit to ${name}: What to Order`,
        lead: `On a first visit to ${name}, order by meal: the ${sodhiMeals.name} at lunch, and build-your-own dosa or ${paanai.name} at dinner. Everything below is on the current menu, with its price.`,
        items: [
          {
            title: "Lunch",
            text: `The [${sodhiMeals.name}](${ROUTES.lunch}) (${rupees(sodhiMeals.price)}): a Tirunelveli banana-leaf meal with sodhi and ${kali.name}. For something lighter, Tamil Nadu meals cost ${priceRange(tnMeals)}; for a quick lunch, a dine-in combo costs ${priceRange(combos)} (lunch only).`,
          },
          {
            title: "Dinner",
            text: `A [build-your-own dosa](${ROUTES.dosa}) from ${byo.batterCount} batters (${batterRange}), or [${paanai.name}](${ROUTES.dinner}) (${rupees(paanai.price)}), parotta slow-cooked with salna in a sealed pot.`,
          },
          {
            title: "To share",
            text: `${idiyappamSodhi.name} (${rupees(idiyappamSodhi.price)}), idiyappam in a coconut milk stew, or ${poppers.name} (${rupees(poppers.price)}).`,
          },
          {
            title: "To finish",
            text: `${filterCoffee.name} (${rupees(filterCoffee.price)}), or ${kali.name} (${rupees(kali.price)}) if you skipped the Nellai meal. ${menuNotes.gst}`,
          },
        ],
        links: [{ label: "Full menu with prices", href: href(ROUTES.menu), primary: true }],
      },
    ],
    faqTitle: `${name}: quick answers`,
    faq,
    topics: [
      topic(`What ${name} is and what to order`, "/"),
      topic("Address, timings and Sunday hours", ROUTES.about),
      { id: "faq-can-i-book-a-table-at-brihadhee", label: "How to book a table and check confirmation", href: `${href(ROUTES.book)}#how-to-book` },
      topic("Menu, prices and filter coffee", ROUTES.menu),
      topic("Build your own dosa", ROUTES.dosa),
      topic("Nellai meals and veg lunch", ROUTES.lunch),
      { label: "What Nellai meals are", href: `${href(ROUTES.nellaiGuide)}#what-are-nellai-meals` },
      topic(`Dinner until ${CLOSE}`, ROUTES.dinner),
      topic("Family dining", ROUTES.familyDining),
      ...(smallFunctionsPage ? [topic(`Small function catering from ${MIN} guests`, ROUTES.smallFunctions)] : []),
      ...(quotePage ? [topic("Catering quotes", ROUTES.cateringQuote)] : []),
      ...(cateringEnabled ? [topic("Event and wedding catering", ROUTES.eventCatering)] : []),
      ...(corporateEnabled ? [topic("Corporate catering", ROUTES.corporateCatering)] : []),
    ],
    schema: () =>
      pageGraph({
        path,
        title,
        description,
        crumbs: [...HOME_CRUMBS, { name: "FAQ", path }],
        extras: [faqPageSchema(path, faq)],
      }),
  };
}
export const faqHubPage = buildFaqHub();

/* ======================================================================= *
 * /no-onion-no-garlic-anna-nagar/  GATED (keyword plan 3.15 to 3.17, 4.8)  *
 * Tier 1 no onion no garlic (lead), tier 2 satvik, tier 3 Jain-friendly    *
 * (ENABLE_JAIN_FRIENDLY_CLAIMS). Hindi lines wait for Q17. In a draft      *
 * (gate off) every unconfirmed part is shown with a draft marker.         *
 * ======================================================================= */
export const noOnionLive = GATES.ENABLE_NO_ONION_NO_GARLIC_CLUSTER;
const nogDishes = [...GATES.NO_ONION_NO_GARLIC_DISHES];
if (noOnionLive && (!nogDishes.length || !GATES.NO_ONION_NO_GARLIC_AVAILABILITY)) {
  throw new Error(
    "[spokes] ENABLE_NO_ONION_NO_GARLIC_CLUSTER is on, but NO_ONION_NO_GARLIC_DISHES or NO_ONION_NO_GARLIC_AVAILABILITY is empty (Q12, config/seo-gates.ts)"
  );
}
if (GATES.ENABLE_JAIN_FRIENDLY_CLAIMS && !noOnionLive) {
  throw new Error("[spokes] ENABLE_JAIN_FRIENDLY_CLAIMS needs ENABLE_NO_ONION_NO_GARLIC_CLUSTER (config/seo-gates.ts)");
}

function buildNoOnion() {
  const path = ROUTES.noOnionNoGarlic;
  const draft = !noOnionLive;
  const showJain = GATES.ENABLE_JAIN_FRIENDLY_CLAIMS || draft;
  const showHindi = GATES.ENABLE_HINDI_COPY || draft;
  const avail = GATES.NO_ONION_NO_GARLIC_AVAILABILITY ?? "on request";
  const dishText = nogDishes.length ? list(nogDishes) : "the dishes the kitchen confirms";
  const dishShort = nogDishes.length ? list(nogDishes.slice(0, 2)) : "selected dishes";
  const hasOnionGarlic = (i) => /onion|garlic/i.test(`${i.name} ${i.description ?? ""}`);
  const onionGarlicDishes = allItems.filter(hasOnionGarlic).map((i) => i.name);
  const onionGarlicToppings = byo.steps.flatMap((st) => st.options).filter((o) => /onion|garlic/i.test(o.name)).map((o) => o.name);
  const title = `No Onion No Garlic Food in Anna Nagar | ${name}`;
  const description = `South Indian food without onion and garlic at ${name}, Anna Nagar East: ${dishShort} ${avail}, and build your own dosa your way. Open ${OPEN} to ${CLOSE}.`;
  const tiersQ = claimQuestion(path, "What Is the Difference Between Jain, Satvik and No Onion No Garlic Food?");
  const faq = qaRoute(path, [
    qa(
      `Does ${name} serve food without onion and garlic?`,
      `Yes, ${name}, the ${PV} restaurant in ${NEAR}, can prepare ${dishShort} without onion and garlic ${avail}; tell the team when you order. ` + `It is at ${ADDRESS}.`
    ),
    qa(
      `Can I get a no onion no garlic dosa at ${name}?`,
      `Yes. At ${name} you can build your own dosa without onion and garlic: choose one of ${byo.batterCount} batters and skip the ${list(onionGarlicToppings)}. ` +
        `Ask the team which podis suit you; dosas are served from ${HOURS}.`
    ),
    showJain &&
      qa(
        `Is ${name} Jain friendly?`,
        `${name} offers no onion, no garlic options ${avail}, and guests who also avoid root vegetables can tell the team when they order. ` +
          `It does not call its kitchen Jain, so ask about each dish; it is open from ${HOURS}.`
      ),
  ]);
  return {
    path,
    draft,
    noindex: draft,
    draftNote: draft
      ? "Draft, not published: this page goes live only when the owner answers questions 11 to 14 of the 12 November keyword plan (which dishes, on request or always, shared tawa and podi). The Jain section also needs questions 13 and 14, and the Hindi lines question 17. Turn it on in config/seo-gates.ts."
      : null,
    title,
    description,
    h1: "No Onion, No Garlic South Indian Food in Anna Nagar",
    eyebrow: "No onion, no garlic · Anna Nagar East",
    intro: `${name}, a ${PV} restaurant in ${NEAR}, can prepare ${dishText} without onion and garlic ${avail}, for lunch and dinner from ${HOURS}. Tell the team when you order.`,
    menuHref: href(ROUTES.menu),
    glanceTitle: `No onion, no garlic at ${name}: summary`,
    glance: [
      ["Who", `${name}, a ${PV} restaurant in ${NEAR}`],
      ["Without onion and garlic", `${dishText}, ${avail}`],
      ["Build your own dosa", `${byo.batterCount} batters; skip the ${list(onionGarlicToppings)}`],
      ["Hours", `${HOURS} daily · ${GATES.MEAL_FRAMING}`],
    ],
    sections: [
      {
        id: "no-onion-no-garlic",
        title: "Dishes Made Without Onion and Garlic",
        lead: `${name} can make these dishes without onion and garlic ${avail}: ${dishText}.`,
        dishes: nogDishes.map((n) => ({ name: n })),
        note: `These dishes contain onion or garlic as listed on the menu: ${list(onionGarlicDishes)}. Ask the team about any other dish before you order.`,
      },
      {
        id: "build-your-own-dosa-no-onion",
        title: "Build Your Own Dosa Without Onion and Garlic",
        lead: `With build your own dosa you choose every part: pick one of ${byo.batterCount} batters (${batterRange}), skip the ${list(onionGarlicToppings)}, and ask the team which podis and fillings are made without garlic.`,
        tint: true,
        links: [{ label: "How build your own dosa works", href: href(ROUTES.dosa) }],
      },
      {
        id: "jain-satvik-difference",
        title: tiersQ,
        lead: "No onion no garlic food leaves out onion and garlic. Satvik (sattvic) cooking, which in Tamil Nadu often means temple-style food, also leaves them out and keeps the food simple. Jain food goes further: it also leaves out root vegetables such as potato, carrot, radish and beetroot, and many Jains limit fermented batters such as idli and dosa batter.",
        items: [
          { title: "No onion, no garlic", text: `${name} offers this ${avail} for ${dishText}.` },
          { title: "Satvik", text: `At ${name}, satvik means the no onion, no garlic dishes above; tell the team about anything else you avoid.` },
          ...(showJain
            ? [
                {
                  title: draft && !GATES.ENABLE_JAIN_FRIENDLY_CLAIMS ? "Jain-friendly (draft: waits for questions 13 and 14)" : "Jain-friendly, on request",
                  text: `Guests who also avoid root vegetables can tell the team when they order. ${name} does not describe its kitchen as Jain, so ask about each dish.`,
                },
              ]
            : []),
        ],
      },
    ],
    languages: {
      tamil: "வெங்காயம் பூண்டு இல்லாத உணவு அண்ணா நகர் · பூண்டு இல்லாத உணவு அண்ணா நகர் · சாத்வீக உணவு சென்னை",
      hindi: showHindi ? "बिना प्याज लहसुन का खाना चेन्नई · बिना प्याज लहसुन का रेस्टोरेंट अन्ना नगर · सात्विक भोजन चेन्नई" : null,
      hinglish: showHindi ? `bina pyaz lahsun ka khana Chennai · satvik bhojan Chennai${showJain ? " · Jain khana Anna Nagar" : ""}` : null,
      hindiDraft: draft && !GATES.ENABLE_HINDI_COPY,
    },
    faqTitle: "No onion, no garlic questions",
    faq,
    related: [
      { label: "Pure veg restaurant in Anna Nagar", href: href("/") },
      { label: "Build your own dosa", href: href(ROUTES.dosa) },
      { label: "Family dining in Anna Nagar", href: href(ROUTES.familyDining) },
    ],
    schema: () =>
      pageGraph({
        path,
        title,
        description,
        crumbs: [...HOME_CRUMBS, { name: "No onion, no garlic", path }],
        extras: [faqPageSchema(path, faq)],
      }),
  };
}
/* Built only when it can be rendered: live gate, or a dev/preview draft. */
export const noOnionPage = noOnionLive || gatePreview ? buildNoOnion() : null;
