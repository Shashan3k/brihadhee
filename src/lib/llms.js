/**
 * Builds /llms.txt (summary) and /llms-full.txt (everything in one hop) from
 * the same sources the pages use: entity-truth.ts (verified facts only), menu-canonical.ts
 * (computed prices), the page Q&A arrays and the gated catering data.
 * The short file is a directory. The full file includes menus, offers and FAQs.
 */
import { site, NAME_SPELLINGS, NAME_TAMIL_VARIANT } from "../data/site.js";
import { getFact, factOr, FACTS, canonicalAnswerLines, landmarkSentence, openingTimes, FACTS_LAST_CONFIRMED, longDate } from "../data/entity-truth.ts";
import { faqItems, aboutFaq, menuFaq, bookingFaq } from "../data/faq.js";
import { homePage, dosaPage, nellaiPage, dinnerPage, whatsNewPage, seasonalPage } from "../data/pages.js";
import { nellaiGuide } from "../data/guides.js";
import { parottaPage } from "../data/parotta.js";
import { categories, priceRange, itemCount, allVegetarian, rupees, byo, menuNotes } from "./menu-facts.js";
import { UNPRICED_SIGNATURES } from "../data/menu-canonical.ts";
import {
  cateringEnabled,
  CATERING_PATH,
  PLANNER_PATH,
  opening,
  events,
  formats,
  guests,
  serviceAreas,
  liveCounters,
  plannerModels,
  pricingText,
  faqs as cateringFaqs,
  plannerFaqs,
  CORPORATE_PATH,
  corporatePage,
} from "../data/catering.js";
import { smallFunctionsPage, quotePage, familyPage, faqHubPage, noOnionPage } from "../data/spokes.js";
import {
  CATERING_DIET,
  CATERING_MIN_GUESTS,
  CORPORATE_DAILY_SCALE,
  MEAL_FRAMING,
  ENABLE_LIVE_WHATSAPP_QUOTE_FORM,
  QUOTE_WHATSAPP_NUMBER,
} from "../../config/seo-gates.ts";

const u = (path) => `${site.url}${path}`;

export function buildLlms({ full = false } = {}) {
  const name = getFact("name");
  const offers = factOr("offers", []);
  const founders = factOr("founders");
  const out = [];
  const push = (...l) => out.push(...l);

  push(`# ${name}${full ? " (full reference)" : ""}`, "");
  push(
    `> ${name} (${getFact("nameTamil")}) is a South Indian vegetarian restaurant in Anna Nagar East, Chennai, serving ${getFact("mealTimes")}. It is known for Build Your Own Dosa and Nellai meals.`,
    ""
  );
  push("**Canonical answers**", "", ...canonicalAnswerLines(), "", `Facts last confirmed with the owner: ${longDate(FACTS_LAST_CONFIRMED)}. Full verified list: ${u("/about/#facts")}`, "");

  if (full) {
    push("## Facts", "");
    push(`- Also spelt: ${[...NAME_SPELLINGS, NAME_TAMIL_VARIANT].join(", ")}`);
    push(`- Cuisine: ${getFact("cuisine")}`);
    push(`- Landmarks: ${landmarkSentence()}`);
    push(`- Email: ${getFact("email")}`);
    push(`- Dining schedule: ${getFact("hours").summary}. ${MEAL_FRAMING}.`);
    push(`- Reservations: ${getFact("acceptsReservations").how}`);
    push(`- Alcohol: ${getFact("alcohol")}`);
    push(`- Food: ${getFact("recipeStory")}.`);
    if (founders) push(`- Founders: ${founders.story}`);
    // No sub-brand line: Beyond Curry stays out of machine-readable files until the owner answers Q26.
    push(`- Menu: ${itemCount} items${allVegetarian ? ", all vegetarian" : ""}`, "");
    push(getFact("nameStory"), "");
  }

  push("## Pages", "");
  push(`- [Home](${u("/")}): restaurant${cateringEnabled ? " and catering" : ""} overview, hours, location, FAQ`);
  push(`- [Menu and prices](${u("/menu/")}): dine-in dishes and listed prices`);
  push(`- [Coffee Bar](${u(`/#${homePage.coffeeBar.id}`)}): drinks at the restaurant${corporatePage ? " and a link for office events" : ""}`);
  push(`- [Menu as JSON](${u("/menu.json")}): machine-readable menu with prices in INR`);
  push(`- [Address, timings and contact](${u("/about/")}): address, directions from Anna Nagar landmarks, hours, founders and the name story`);
  push(`- [Verified facts](${u("/about/#facts")}): name, address, phones, hours, food, catering range and area, booking, with verification dates`);
  push(`- [Book a table](${u("/book-a-table/")}): choose a dining partner and check booking status in its app`);
  push(`- [Build your own dosa](${u(dosaPage.path)}): how it works, chef's combinations, classic dosas`);
  push(`- [Vegetarian parotta in Anna Nagar](${u(parottaPage.path)}): parotta varieties and prices, vegetarian salna, kothu and Paanai Parotta, and directions`);
  push(`- [Lunch and Nellai meals](${u(nellaiPage.path)}): Nellai Special Sodhi Meals, Tamil home-style lunch, office lunch`);
  push(`- [Dinner until ${openingTimes().close}](${u(dinnerPage.path)}): Paanai Parotta, veg kothu parotta, idiyappam, Karaikudi Paneer Poppers`);
  push(`- [Family dining](${u(familyPage.path)}): family lunch after a temple visit, birthday and anniversary dinners, table booking`);
  push(`- [FAQ](${u(faqHubPage.path)}): lunch and dinner only, the name, listings, table booking, and links to every page's answers`);
  if (noOnionPage && !noOnionPage.noindex) push(`- [No onion, no garlic](${u(noOnionPage.path)}): dishes made without onion and garlic, build your own dosa your way`);
  if (cateringEnabled) {
    push(`- [Event catering](${u(CATERING_PATH)}): end-to-end ${CATERING_DIET} event and wedding catering in Chennai`);
    if (smallFunctionsPage) push(`- [Small function catering](${u(smallFunctionsPage.path)}): ${CATERING_DIET} catering for birthdays, housewarmings and get-togethers from ${CATERING_MIN_GUESTS} guests`);
    if (quotePage) push(`- [Catering quote](${u(quotePage.path)}): send the event type, estimated guest count, Chennai venue area, date if known, and menu and service preferences`);
    if (corporatePage) push(`- [Corporate catering](${u(CORPORATE_PATH)}): daily office lunches, bulk meals, employee meal programmes and corporate events`);
    push(`- [Event planner partner](${u(PLANNER_PATH)}): catering partner for event management companies`);
  }
  push(`- [What's new](${u(whatsNewPage.path)}): build-your-own dosa, Nellai lunch, dinner until ${openingTimes().close}${corporatePage ? ", corporate catering" : ""}`);
  push(`- [Karthigai and Ayyappa mala](${u(seasonalPage.path)}): pure veg lunch and dinner in Chennai${seasonalPage.sections.some(({ id }) => id === "group-catering") ? `, plus ${CATERING_DIET} group catering` : ""}`);
  push(`- [Guide: What are Nellai meals?](${u(nellaiGuide.path)}): sodhi, ulundhu kali, Tirunelveli cuisine and idiyappam pairings`);
  if (!full) {
    push("", "## Optional", "", `- [Full reference](${u("/llms-full.txt")}): full menu, offers, and customer questions`);
    return out.join("\n").trimEnd() + "\n";
  }
  push("");

  if (offers.length) {
    push("## Offers", "");
    for (const o of offers) push(`- ${o.name}: ${o.description}`);
    push(`- Offers checked on ${FACTS.offers.verifiedOn}; they can change.`, "");
  }

  push("## Build Your Own Dosa", "");
  push(`Pick one of ${byo.batterCount} batters (${byo.batterNames.join(", ")}) from ${rupees(byo.batterMin)}, then add toppings, a stuffing and a garnish (the roast); each addition is priced separately. ${byo.suggestionCount} chef's suggestions cost ${rupees(byo.suggestionMin)} to ${rupees(byo.suggestionMax)}. Classic dosas are fixed recipes at fixed prices.`);
  push("");
  for (const st of byo.steps) push(`- ${st.step}. ${st.name}: ${st.options.map((o) => `${o.name}${o.note ? ` (${o.note})` : ""} ${rupees(o.price)}`).join("; ")}`);
  for (const d of byo.suggestions) push(`- Chef's suggestion ${d.name}: ${rupees(d.price)} (${d.build.join(", ")})`);
  push("");

  push("## Menu price ranges", "");
  push(`${menuNotes.gst} ${menuNotes.parcel}`);
  for (const c of categories) push(`- ${c.name}: ${priceRange(c)} (${c.count} items)`);
  push("");

  push("## Full menu", "");
  for (const c of categories) {
    push(`### ${c.name}`, "");
    for (const i of c.items) push(`- ${i.name}: ${rupees(i.price)}. ${i.description}`);
    push("");
  }
  if (UNPRICED_SIGNATURES.length) {
    push("### Signature specials (price at the restaurant)", "");
    for (const e of UNPRICED_SIGNATURES) push(`- ${e.name}: ${e.note}`);
    push("");
  }

  const qa = (title, items) => {
    if (!items.length) return;
    push(`## ${title}`, "");
    for (const f of items) push(`- ${f.question} ${f.answer}`);
    push("");
  };
  qa("Restaurant questions", [...faqHubPage.faq, ...faqItems].filter((i) => !i.lang || i.lang === "en"));
  qa("Address, timings and contact questions", aboutFaq);
  qa("Menu questions", menuFaq);
  qa("Table booking questions", bookingFaq);
  qa("Build your own dosa questions", dosaPage.faq.filter((i) => !i.lang || i.lang === "en"));
  qa("Lunch and Nellai meals questions", nellaiPage.faq);
  qa("Dinner questions", dinnerPage.faq);
  qa("Parotta questions", parottaPage.faq);
  qa("What's new", whatsNewPage.faq);
  qa("Karthigai and Ayyappa mala questions", seasonalPage.faq);
  qa("Family dining questions", familyPage.faq);

  if (cateringEnabled) {
    push("## Catering", "");
    if (opening) push(opening, "");
    if (events.length) push(`- Events: ${events.map((e) => e.label).join(", ")}`);
    push(`- Diet: ${CATERING_DIET} catering. Confirm preparation and service arrangements for the event in the quote.`);
    if (guests) push(`- Guests: ${guests.min} to ${guests.max} (minimum ${CATERING_MIN_GUESTS} guests per function)`);
    if (serviceAreas.length) push(`- Area served: ${serviceAreas.join(", ")}`);
    if (formats.length) push(`- Formats: ${formats.map((f) => f.label).join(", ")}`);
    if (liveCounters.length) push(`- Live counters: ${liveCounters.join(", ")}`);
    const corp = factOr("corporateCatering", null);
    if (corp) push(`- Corporate catering: ${corp.description}, ${CORPORATE_DAILY_SCALE}`);
    const corpAreas = factOr("corporateAreas", []);
    if (corpAreas.length) push(`- Corporate catering areas: ${corpAreas.join(", ")}`);
    const evs = factOr("eventService", null);
    if (evs) push(`- Event service: ${evs}`);
    if (plannerModels.length) push(`- For event planners: ${plannerModels.join(", ")}`);
    if (pricingText) push(`- Pricing: ${pricingText}`);
    if (quotePage) {
      push(
        ENABLE_LIVE_WHATSAPP_QUOTE_FORM && QUOTE_WHATSAPP_NUMBER
          ? `- Quotes: the quote form at ${u(quotePage.path)} opens WhatsApp (${QUOTE_WHATSAPP_NUMBER}) with the details ready to send. No per-plate rates are published.`
          : `- Quotes: send the event form at ${u(quotePage.path)}. Share the occasion, venue area, estimated guest count, date if known, and service preferences. Use the corporate page for office meal programmes or one-off office events. Ask the catering team to check availability for your date and confirm your per-plate quote.`
      );
    }
    push("");
    qa("Catering questions", cateringFaqs);
    qa("Event planner questions", plannerFaqs);
    if (corporatePage) qa("Corporate catering questions", corporatePage.faq);
    if (smallFunctionsPage) qa("Small function catering questions", smallFunctionsPage.faq);
    if (quotePage) qa("Catering quote questions", quotePage.faq);
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
