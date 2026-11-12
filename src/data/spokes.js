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
import { ROUTES, href } from "./site.js";
import { qa, qaRoute, claimQuestion, list } from "../lib/answers.js";
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
import { byo, category, allItems, rupees, priceRange, summarise, filterCoffee } from "../lib/menu-facts.js";

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
const bookingOr = bookingLabels.length > 1 ? `${bookingLabels.slice(0, -1).join(", ")} or ${bookingLabels.at(-1)}` : bookingLabels.join("");

const item = (n) => {
  const hit = allItems.find((i) => i.name === n);
  if (!hit) throw new Error(`[spokes] menu item "${n}" not found in menu-canonical.ts`);
  return hit;
};
const sodhiMeals = item("Nellai Special Sodhi Meals");
const paanai = item("Paanai Parotta");
const poppers = item("Karaikudi Paneer Poppers");
const lunch = category("lunch");
const tnMeals = summarise(lunch.items.filter((i) => /TN Meals/.test(i.name)));
const batters = byo.steps.find((s) => s.name === "Batter").options;
const batterRange = priceRange(summarise(batters));
const dish = (i) => ({ name: i.name, price: rupees(i.price), note: i.description });
const svc = eventService ? eventService.replace(/^end-to-end service: /, "") : "menu planning, cooking and serving";

/* ======================================================================= *
 * /small-function-catering-chennai/  (keyword plan 3.9a, priority 1)       *
 * ======================================================================= */
const SMALL_IDS = ["birthday", "get_together", "housewarming", "baby_shower", "ear_piercing", "engagement", "house_function", "small_events", "small_wedding"];
const smallEvents = cateringEnabled ? SMALL_IDS.filter((id) => eventIds.includes(id)).map((id) => ({ id, ...EVENTS[id] })) : [];
const hasBirthday = smallEvents.some((e) => e.id === "birthday");

function buildSmallFunctions() {
  const path = ROUTES.smallFunctions;
  const title = `Small Function Catering in Chennai, ${MIN}+ Guests | ${name}`;
  const description = `${cap(CD)} catering for birthdays, housewarmings and get-togethers in Chennai from ${MIN} guests, cooked in ${name}'s Anna Nagar kitchen. Get a quote.`;
  const faq = qaRoute(path, [
    qa(
      "Who does small function catering in Anna Nagar?",
      `${name}, the ${PV} restaurant in ${NEAR}, does small function catering from ${MIN} guests: ${CD} food for birthdays, housewarmings and get-togethers, cooked in its own kitchen. ` +
        `It is at ${ADDRESS}.`
    ),
    qa(
      `What is the minimum guest count for ${name} catering?`,
      `${name} caters functions from a minimum of ${MIN} guests across Chennai, with ${CD} food cooked in the kitchen of its ${PV} restaurant in ${NEAR}. ` +
        `The same team caters functions of up to ${num(guests.max)} guests, and each quote is built for the event.`
    ),
    qa(
      "How much does vegetarian catering cost per plate in Chennai?",
      `At ${name}, the ${PV} restaurant in ${NEAR}, ${CD} catering is quoted per plate for each function from ${MIN} guests, not from a fixed rate card. ` +
        `The price depends on the guest count, lunch or dinner, the dishes and live counters, serving staff and the spend you have in mind.`
    ),
    hasBirthday &&
      qa(
        `Can ${name} cater a birthday party for ${MIN} guests in Chennai?`,
        `Yes, ${name} caters birthday parties across Chennai from ${MIN} guests, with ${CD} food from its ${PV} restaurant kitchen in ${NEAR} and a live build-your-own dosa counter if you want one. ` +
          `Send the quote form with your date, venue and guest count, or call ${cPhone}.`
      ),
  ]);

  return {
    path,
    title,
    description,
    h1: `Small Function Catering in Chennai, From ${MIN} Guests`,
    eyebrow: "Small functions · Chennai",
    intro: `${name}, a ${PV} restaurant in ${NEAR}, caters small and mid-size functions across Chennai from ${MIN} guests up to ${num(guests.max)}: ${CD} food cooked in its own restaurant kitchen, with ${svc} by one team.`,
    tamil: "பிறந்தநாள் விழா கேட்டரிங் சென்னை · சைவ கேட்டரிங் சென்னை · சைவ கேட்டரிங் அண்ணா நகர்",
    cta: "quote",
    quoteHref: href(ROUTES.cateringQuote),
    glanceTitle: `${name} small function catering: summary`,
    glance: [
      ["Who", `${name}, a ${PV} restaurant in ${NEAR}`],
      ["Guests", `from ${MIN}, up to ${num(guests.max)}`],
      ["Functions", smallEvents.map((e) => e.label).join(", ")],
      ["Food", `${CD}, cooked in the restaurant kitchen; live counters for ${joinNatural(liveCounters)}`],
      ["Service", svc],
      ["Price", "a per-plate quote for each function, after you share the details"],
      ["Area", joinNatural(serviceAreas)],
    ],
    sections: [
      {
        id: "from-50-guests",
        title: `Catering From ${MIN} Guests, Cooked in a Restaurant Kitchen`,
        lead: `${name} takes catering orders from ${MIN} guests, so a birthday, housewarming or family get-together is cooked by the same kitchen that serves its restaurant on ${STREET}. If your guest list is closer to ${MIN} than 500, the food is still the restaurant's own: ${recipeStory}.`,
        items: [
          {
            title: "One team from menu to service",
            text: `${name}'s end-to-end service covers ${svc}, so the team that plans your menu also cooks it and serves your guests.`,
          },
          {
            title: "Dishes your guests already know",
            text: `Menus are built around the restaurant's Tirunelveli and Karaikudi dishes, from Nellai sodhi to karupatti ulundhu kali, with live counters for ${joinNatural(liveCounters)}.`,
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
        title: "What Sets the Price of Your Catering",
        lead: `${name} builds a quote for each function instead of selling fixed per-plate packages, so five details set the price: the guest count, lunch or dinner, the occasion and dishes, serving staff, and the spend you have in mind.`,
        items: [
          { title: "1. Guest count", text: `How many guests you expect, from ${MIN}. A range is fine if the final number is not fixed yet.` },
          { title: "2. Lunch or dinner", text: "Whether the function is a lunch or a dinner, which shapes the menu the team suggests." },
          { title: "3. Occasion and dishes", text: `The occasion and the dishes you want, including live counters such as build-your-own dosa or ${paanai.name}.` },
          { title: "4. Serving staff", text: `Whether you need ${name}'s team to serve and set up at the venue, as part of its end-to-end service.` },
          {
            title: "5. The spend you have in mind",
            text: `Tell the team roughly what you plan to spend per guest, and the menu is shaped around it. ${name} publishes no fixed rates, because each quote is built from these five details.`,
          },
        ],
      },
      {
        id: "get-a-quote",
        title: "Get a Quote for Your Function",
        lead: `Send ${name} your event type, lunch or dinner, guest count, must-have dishes and whether you need serving staff, and the team at its restaurant in ${NEAR} calls you back with a menu and a per-plate price.`,
        tint: true,
        links: [
          { label: "Build your catering quote", href: href(ROUTES.cateringQuote), primary: true },
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
            description: `${cap(CD)} catering in Chennai from ${MIN} guests for ${joinNatural(smallEvents.map((e) => e.inline))}, cooked in ${name}'s restaurant kitchen in ${NEAR}: ${svc}.`,
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
  const description = `Request a ${CD} catering quote from ${name}, Anna Nagar: share the event, lunch or dinner, guests from ${MIN}, must-have dishes and serving needs.`;
  const reply = whatsappQuote ? "replies on WhatsApp with a menu and a per-plate price" : "calls you back with a menu and a per-plate price";
  const whatToSend = claimQuestion(path, "What Do I Need to Tell a Caterer to Get a Quote?");
  const faq = qaRoute(path, [
    qa(
      `How do I get a catering quote from ${name}?`,
      `To get a catering quote from ${name}, the ${PV} restaurant in ${NEAR}, send the form on this page with your event, guest count from ${MIN} and must-have dishes. ` +
        `Its kitchen is at ${ADDRESS}.`
    ),
    qa(
      `Does ${name} provide serving staff with catering?`,
      `Yes, ${name}'s end-to-end catering includes ${svc}, for functions of ${MIN} to ${num(guests.max)} guests across Chennai, with food from its ${PV} restaurant kitchen in ${NEAR}. ` +
        "Tell the team in the quote form whether you need serving staff."
    ),
    whatsappQuote
      ? qa(
          `Can I send a catering enquiry to ${name} on WhatsApp?`,
          `Yes, the quote form on this page sends your details to ${name}'s catering team on WhatsApp at ${whatsappQuote}, for functions from ${MIN} guests. ` +
            `The team at its ${PV} restaurant in ${NEAR} replies with a menu and a per-plate price.`
        )
      : qa(
          `Can I send a catering enquiry to ${name} on WhatsApp?`,
          `Yes, you can WhatsApp ${name}'s catering team on ${cWhatsapp}, at its ${PV} restaurant in ${NEAR}, with your event, date, venue and guest count from ${MIN}. ` +
            "The team then suggests a menu and confirms a per-plate price."
        ),
    qa(
      `What is on a ${CD} catering menu for ${MIN} people?`,
      `A ${name} catering menu for ${MIN} guests is built from its ${PV} restaurant's dishes, such as Nellai sodhi, karupatti ulundhu kali and ${paanai.name}. ` +
        `Live counters for build-your-own dosa can be added, and the final menu and per-plate price are agreed with the team in ${NEAR}.`
    ),
  ]);

  return {
    path,
    title,
    description,
    h1: `Get a ${cap(CD)} Catering Quote in Chennai`,
    eyebrow: "Catering quote · Chennai",
    intro: `Tell ${name} about your function in one form: the event type, lunch or dinner, the occasion, your guest count from ${MIN}, the spend you have in mind, must-have dishes and whether you need serving staff. The team at its ${PV} restaurant in ${NEAR} ${reply}.`,
    cta: "quote",
    builder: {
      whatsappNumber: whatsappQuote,
      min: MIN,
      fallbackWhatsapp: whatsappQuote ? null : cWhatsapp,
    },
    sections: [
      {
        id: "what-to-send",
        title: whatToSend,
        lead: `To quote a function, ${name} needs seven details: the event type, lunch or dinner, the occasion, the guest count, the spend you have in mind, any must-have dishes, and whether you need serving staff.`,
        items: [
          { title: "Event type", text: "Corporate, wedding, birthday, or a small function or get-together." },
          { title: "Lunch or dinner", text: "The meal sets the menu the team proposes." },
          { title: "Occasion", text: "A housewarming, an engagement or a team celebration: the occasion guides the dishes." },
          { title: "Guest count", text: `From ${MIN} guests. An estimate is fine.` },
          { title: "The spend you have in mind", text: "A rough figure per guest, so the menu fits it. No rates are published; every quote is built for the event." },
          { title: "Must-have dishes", text: `Dishes your family or team expects, such as Nellai sodhi, ${paanai.name} or a build-your-own dosa counter.` },
          { title: "Serving staff", text: "Whether the team should serve and set up at the venue." },
        ],
      },
      {
        id: "how-quotes-work",
        title: `How a ${name} Catering Quote Works`,
        lead: `A catering quote from ${name} takes three steps: you send the details, the team suggests a menu and live counters, then it confirms the menu, date and per-plate price with you.`,
        tint: true,
        items: [
          { title: "1. Send the details", text: whatsappQuote ? "Fill in the form; it opens WhatsApp with your details ready to send." : `Fill in the form, or call ${cPhone}.` },
          { title: "2. Menu and live counters", text: `The team suggests a ${CD} menu and live counters for ${joinNatural(liveCounters)}.` },
          { title: "3. Confirmation", text: "The team confirms the menu, the per-plate price and the date with you." },
        ],
      },
    ],
    faqTitle: "Catering quote questions",
    faq,
    related: [
      { label: `Small function catering from ${MIN} guests`, href: href(ROUTES.smallFunctions) },
      { label: "Event and wedding catering in Chennai", href: href(ROUTES.eventCatering) },
      ...(corporateEnabled ? [{ label: `${cap(CD)} corporate catering in Chennai`, href: href(ROUTES.corporateCatering) }] : []),
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
  const description = `Family lunch after a temple visit, birthday dinners and weekend meals at ${name}, a pure veg restaurant in Anna Nagar East, open ${OPEN} to ${CLOSE} daily.`;
  const temple = GATES.ENABLE_NAMED_TEMPLE && GATES.NEARBY_TEMPLE ? GATES.NEARBY_TEMPLE : null;
  const faq = qaRoute(path, [
    qa(
      `Is ${name} good for families and groups?`,
      `Yes, ${name} is a family-friendly, ${PV} restaurant in ${NEAR}, with dine-in for lunch and dinner every day from ${HOURS}. ` +
        `It is at ${ADDRESS}.`,
      { id: "families-groups" }
    ),
    qa(
      "Which Anna Nagar restaurant suits a family lunch after a temple visit?",
      `${name}, a ${PV} restaurant in ${NEAR}, suits a family lunch after a temple visit: it opens at ${OPEN} daily, and no meat, egg or fish is cooked in its kitchen. ` +
        `Its ${sodhiMeals.name} cost ${rupees(sodhiMeals.price)}, served on a banana leaf.`
    ),
    qa(
      "Which vegetarian restaurant in Anna Nagar is good for a birthday or anniversary dinner?",
      `${name}, a ${PV} restaurant in ${NEAR}, serves dinner every day until ${CLOSE} and takes table pre-bookings for birthdays and anniversaries on ${bookingAnd}. ` +
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
        lead: `${name} serves dinner every day until ${CLOSE}, so a birthday or anniversary dinner can run into the evening: pre-book a table on ${bookingAnd} for ${prebook}, or walk in for ${walkIn}.`,
        tint: true,
        items: [
          {
            title: `Celebrating with ${MIN} or more guests?`,
            text: `For a family function of ${MIN} guests or more, ${name} caters at your home or venue: see [small function catering in Chennai](${ROUTES.smallFunctions}).`,
          },
        ],
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
        lead: `Book a family table at ${name} on ${bookingAnd}, call ${phone}, or walk in: pre-booked tables get ${prebook}, and walk-in diners get ${walkIn}.`,
        tint: true,
        links: [{ label: "How to book a table", href: href(ROUTES.book), primary: true }],
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
    qa(
      GATES.NEGATIVE_FAQ_QUESTION,
      `No. ${name} serves lunch and dinner only, from ${HOURS} every day, at its ${PV} South Indian restaurant in ${NEAR}, Chennai. ` + `It is at ${ADDRESS}.`,
      { id: GATES.NEGATIVE_FAQ_ID }
    ),
    qa(
      `Is ${name} related to the Brihadeeswarar Temple?`,
      `No, ${name} is a ${PV} South Indian restaurant in ${NEAR}, Chennai, and is not affiliated with the Brihadeeswarar Temple in Thanjavur. ` +
        `Its name is a tribute to the temple and its Chola architecture, and the restaurant is open every day from ${HOURS}.`
    ),
    qa(
      `Is ${name} on Swiggy or Zomato?`,
      `Yes, ${name}, the ${PV} restaurant in ${NEAR}, has its own listings on Zomato and Swiggy Dineout, as well as EazyDiner and District. ` +
        `Its full menu, with every price, is on this website, and the restaurant is open every day from ${HOURS}.`
    ),
    qa(
      `Can I book a table at ${name}?`,
      `Yes, you can pre-book a table at ${name}, the ${PV} restaurant in ${NEAR}, on ${bookingOr}, or call ${phone}. ` +
        `Pre-booked tables get ${prebook}, and walk-in diners get ${walkIn}.`
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
    faqTitle: `${name}: quick answers`,
    faq,
    topics: [
      topic(`What ${name} is and what to order`, "/"),
      topic("Address, timings and Sunday hours", ROUTES.about),
      topic("Menu, prices and filter coffee", ROUTES.menu),
      topic("Build your own dosa", ROUTES.dosa),
      topic("Nellai meals and veg lunch", ROUTES.lunch),
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
      `Yes, at ${name}, the ${PV} restaurant in ${NEAR}, you can build your own dosa without onion and garlic: choose one of ${byo.batterCount} batters and skip the ${list(onionGarlicToppings)}. ` +
        `Ask the team which podis suit you; dosas are served from ${HOURS}.`
    ),
    showJain &&
      qa(
        `Is ${name} Jain friendly?`,
        `${name}, the ${PV} restaurant in ${NEAR}, offers no onion, no garlic options ${avail}, and guests who also avoid root vegetables can tell the team when they order. ` +
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
