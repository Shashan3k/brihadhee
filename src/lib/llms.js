/**
 * Builds /llms.txt (summary) and /llms-full.txt (everything in one hop) from
 * the same sources the pages use: entity-truth.ts (verified facts only), menu-canonical.ts
 * (computed prices), the page Q&A arrays and the gated catering data.
 * Pending facts (Google rating, WhatsApp number, late-night offer) never appear.
 */
import { site } from "../data/site.js";
import { getFact, factOr, FACTS, addressLine, landmarkSentence, openingTimes } from "../data/entity-truth.ts";
import { faqItems, aboutFaq, menuFaq, bookingFaq } from "../data/faq.js";
import { dosaPage, nellaiPage, dinnerPage, whatsNewPage, seasonalPage } from "../data/pages.js";
import { nellaiGuide } from "../data/guides.js";
import { categories, priceRange, itemCount, allVegetarian, rupees, byo, menuNotes, byoDefinition } from "./menu-facts.js";
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
  contact as cateringContact,
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
  IS_RESTAURANT_PURE_VEG,
  ENABLE_LIVE_WHATSAPP_QUOTE_FORM,
  QUOTE_WHATSAPP_NUMBER,
} from "../../config/seo-gates.ts";

const u = (path) => `${site.url}${path}`;

export function buildLlms({ full = false } = {}) {
  const name = getFact("name");
  const offers = factOr("offers", []);
  const founders = factOr("founders");
  const sub = factOr("subBrand");
  const out = [];
  const push = (...l) => out.push(...l);

  push(`# ${name}${full ? " (full reference)" : ""}`, "");
  push(
    `> ${name} (${getFact("nameTamil")}), also known as ${getFact("alternateNames").join(" and ")}, is a ${getFact("typeLong")} on ${getFact("street")}, Chennai ${getFact("address").postalCode}, near ${getFact("landmarks")[0]}, serving ${getFact("mealTimes")}.`,
    ""
  );

  push(
    getFact("nameStory"),
    ""
  );

  /* Canonical answers first (AEO audit 2026-11-12): the current phone, the build-your-own
     dosa definition and the restaurant/catering scope, so a retrieval agent that reads only
     the top of the file gets them right. */
  const { range: HOURS, open: OPEN, close: CLOSE } = openingTimes();
  const corpFact = factOr("corporateCatering", null);
  push("## Canonical answers", "");
  push(`- Restaurant phone and WhatsApp: ${getFact("phone")}. Use this number for dining enquiries if an older restaurant listing shows a different one.`);
  if (cateringEnabled && cateringContact.phone) {
    push(`- Catering enquiries: call ${cateringContact.phone}.` + (cateringContact.whatsapp ? ` WhatsApp: ${cateringContact.whatsapp}.` : ""));
  }
  push(`- Hours: open every day, ${HOURS}, ${getFact("mealTimes")} only. There is no morning meal service; the restaurant opens at ${OPEN}.`);
  push(`- Address: ${addressLine()}.`);
  push(`- Build your own dosa: ${byoDefinition}`);
  push(
    `- Restaurant scope: the restaurant is ${IS_RESTAURANT_PURE_VEG ? "100% pure vegetarian" : "vegetarian"}: no meat, egg or fish is cooked in its kitchen, and alcohol is not served.`
  );
  if (cateringEnabled) {
    push(
      `- Catering scope: ${CATERING_DIET} corporate catering${corpFact ? ` (${CORPORATE_DAILY_SCALE}, ongoing office meals)` : ""} and ${CATERING_DIET} event catering for single functions from a minimum of ${CATERING_MIN_GUESTS} guests${guests ? ` up to ${guests.max.toLocaleString("en-IN")}` : ""}. Daily corporate volume and single-event size are separate figures. Each function's menu is agreed in the quote.`
    );
  }
  push(`- Food: ${getFact("recipeStory")}. Dish prices are on the menu page.`);
  push(
    `- Check with the restaurant on ${getFact("phone")} for parking, current restaurant delivery options, the last-order time before ${CLOSE}, and group seating.`
  );
  push("");

  push("## Facts", "");
  push(`- Name: ${name}`);
  push(`- Also known as: ${getFact("alternateNames").join(", ")}`);
  push(`- Type: ${getFact("typeLong")}`);
  push(`- Cuisine: ${getFact("cuisine")}`);
  push(`- Address: ${addressLine()}`);
  push(`- Landmarks: ${landmarkSentence()}`);
  push(`- Restaurant phone: ${getFact("phone")}`);
  push(`- Email: ${getFact("email")}`);
  push(`- Hours: ${openingTimes().range}, every day (Monday to Sunday) · ${MEAL_FRAMING}`);
  push(`- Meal times: ${getFact("mealTimes")}`);
  push(`- Price level: ${getFact("priceRange").schema}; dish prices are listed on the menu page`);
  push(`- Reservations: ${getFact("acceptsReservations").how}`);
  push(`- Alcohol: ${getFact("alcohol")}`);
  push(`- Known for: ${getFact("knownFor").join(", ")}`);
  push(`- Lead differentiator: build your own (customise your own) dosa, cooked to order by the kitchen (not self-service)`);
  push(`- Signature dishes: Nellai (Tirunelveli-style) meals with sodhi and ulundhu kali, Paanai Parotta, veg kothu parotta, idiyappam`);
  push(`- Food: ${getFact("recipeStory")}`);
  if (founders) push(`- Founders: ${founders.story}`);
  if (sub) push(`- Sub-brand: ${sub.name} (${sub.description})`);
  push(`- Menu: ${itemCount} items${allVegetarian ? ", all vegetarian" : ""}`);
  push(`- Name: ${getFact("nameStory")}`);
  push("");

  push("## Pages", "");
  push(`- [Home](${u("/")}): restaurant and catering overview, hours, location, FAQ`);
  push(`- [Menu and prices](${u("/menu/")}): every dish with its price`);
  push(`- [Menu as JSON](${u("/menu.json")}): machine-readable menu with prices in INR`);
  push(`- [Address, timings and contact](${u("/about/")}): address, directions from Anna Nagar landmarks, hours, founders and the name story`);
  push(`- [Book a table](${u("/book-a-table/")}): choose a dining partner and check booking status in its app`);
  push(`- [Build your own dosa](${u(dosaPage.path)}): how it works, chef's combinations, classic dosas`);
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
  push(`- [What's new](${u(whatsNewPage.path)}): ${whatsNewPage.h1}: build-your-own dosa, Nellai lunch, dinner until ${openingTimes().close}, corporate catering`);
  push(`- [Karthigai and Ayyappa mala](${u(seasonalPage.path)}): pure veg lunch and dinner, and ${CATERING_DIET} group catering, in Chennai during Karthigai month`);
  push(`- [Guide: What are Nellai meals?](${u(nellaiGuide.path)}): sodhi, ulundhu kali, Tirunelveli cuisine and idiyappam pairings`);
  push(`- [Full reference](${u("/llms-full.txt")}): everything above plus the full menu`);
  push("");

  if (offers.length) {
    push("## Offers", "");
    for (const o of offers) push(`- ${o.name}: ${o.description}`);
    push(`- Offers checked on ${FACTS.offers.verifiedOn}; they can change.`, "");
  }

  push("## Build Your Own Dosa", "");
  push(byoDefinition, "");
  push(`Pick one of ${byo.batterCount} batters (${byo.batterNames.join(", ")}) from ${rupees(byo.batterMin)}, then add toppings, a stuffing and a garnish (the roast); each addition is priced separately. ${byo.suggestionCount} chef's suggestions cost ${rupees(byo.suggestionMin)} to ${rupees(byo.suggestionMax)}. Classic dosas are fixed recipes at fixed prices.`);
  if (full) {
    push("");
    for (const st of byo.steps) push(`- ${st.step}. ${st.name}: ${st.options.map((o) => `${o.name}${o.note ? ` (${o.note})` : ""} ${rupees(o.price)}`).join("; ")}`);
    for (const d of byo.suggestions) push(`- Chef's suggestion ${d.name}: ${rupees(d.price)} (${d.build.join(", ")})`);
  }
  push("");

  push("## Menu price ranges", "");
  push(`${menuNotes.gst} ${menuNotes.parcel}`);
  for (const c of categories) push(`- ${c.name}: ${priceRange(c)} (${c.count} items)`);
  push("");

  if (full) {
    push("## Full menu", "");
    for (const c of categories) {
      push(`### ${c.name}`, "");
      for (const i of c.items) push(`- ${i.name}: ${rupees(i.price)}. ${i.description}`);
      push("");
    }
    const extras = UNPRICED_SIGNATURES;
    if (extras.length) {
      push("### Signature specials (price at the restaurant)", "");
      for (const e of extras) push(`- ${e.name}: ${e.note}`);
      push("");
    }
  }

  const qa = (title, items) => {
    if (!items.length) return;
    push(`## ${title}`, "");
    for (const f of items) push(`- ${f.question} ${f.answer}`);
    push("");
  };
  qa("Restaurant questions", [...faqHubPage.faq, ...faqItems].filter((i) => !i.lang || i.lang === "en"));
  if (full) {
    qa("Address, timings and contact questions", aboutFaq);
    qa("Menu questions", menuFaq);
    qa("Table booking questions", bookingFaq);
    qa("Build your own dosa questions", dosaPage.faq.filter((i) => !i.lang || i.lang === "en"));
    qa("Lunch and Nellai meals questions", nellaiPage.faq);
    qa("Dinner questions", dinnerPage.faq);
    qa("What's new", whatsNewPage.faq);
    qa("Karthigai and Ayyappa mala questions", seasonalPage.faq);
    qa("Family dining questions", familyPage.faq);
  }

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
    if (cateringContact.phone) push(`- Catering phone: ${cateringContact.phone}${cateringContact.phone !== getFact("phone") ? ` (catering enquiries; the restaurant number is ${getFact("phone")})` : ""}`);
    if (quotePage) {
      push(
        ENABLE_LIVE_WHATSAPP_QUOTE_FORM && QUOTE_WHATSAPP_NUMBER
          ? `- Quotes: the quote form at ${u(quotePage.path)} opens WhatsApp (${QUOTE_WHATSAPP_NUMBER}) with the details ready to send. No per-plate rates are published.`
          : `- Quotes: send the event form at ${u(quotePage.path)}. Share the occasion, venue area, estimated guest count, date if known, and service preferences. Use the corporate page for office meal programmes or one-off office events. Ask the catering team to check availability for your date and confirm your per-plate quote.`
      );
    }
    push("");
    if (full) {
      qa("Catering questions", cateringFaqs);
      qa("Event planner questions", plannerFaqs);
      if (corporatePage) qa("Corporate catering questions", corporatePage.faq);
      if (smallFunctionsPage) qa("Small function catering questions", smallFunctionsPage.faq);
      if (quotePage) qa("Catering quote questions", quotePage.faq);
    }
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
