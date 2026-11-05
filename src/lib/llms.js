/**
 * Builds /llms.txt (summary) and /llms-full.txt (everything in one hop) from
 * the same sources the pages use: facts.js (confirmed facts only), menu.json
 * (computed prices), the page Q&A arrays and the gated catering data.
 * Pending facts (Google rating, WhatsApp number, late-night offer) never appear.
 */
import { site } from "../data/site.js";
import { getFact, factOr, FACTS, addressLine, landmarkSentence } from "../data/facts.js";
import { faqItems } from "../data/faq.js";
import { dosaPage, nellaiPage } from "../data/pages.js";
import { categories, priceRange, itemCount, allVegetarian, rupees } from "./menu-facts.js";
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
} from "../data/catering.js";

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
    `> ${name} (${getFact("nameTamil")}), also known as ${getFact("alternateNames").join(" and ")}, is a ${getFact("typeLong")} on 3rd Avenue, W-Block, Anna Nagar East, Chennai ${getFact("address").postalCode}, near ${getFact("landmarks")[0]}. Open daily 6:30 AM to 11:00 PM.`,
    ""
  );

  push("## Facts", "");
  push(`- Name: ${name}`);
  push(`- Also known as: ${getFact("alternateNames").join(", ")}`);
  push(`- Type: ${getFact("typeLong")}`);
  push(`- Cuisine: ${getFact("cuisine")}`);
  push(`- Address: ${addressLine()}`);
  push(`- Landmarks: ${landmarkSentence()}`);
  push(`- Serves diners from: ${getFact("nearbyAreas").join(", ")}`);
  push(`- Phone: ${getFact("phone")}`);
  push(`- Email: ${getFact("email")}`);
  push(`- Hours: ${getFact("hours").summary}`);
  push(`- Meal times: ${getFact("mealTimes")}`);
  push(`- Price range: ${getFact("priceRange").text}`);
  push(`- Reservations: ${getFact("acceptsReservations").how}`);
  push(`- Alcohol: ${getFact("alcohol")}`);
  push(`- Known for: ${getFact("knownFor").join(", ")}`);
  if (founders) push(`- Founders: ${founders.story}`);
  if (sub) push(`- Sub-brand: ${sub.name} (${sub.description})`);
  push(`- Menu: ${itemCount} items${allVegetarian ? ", all vegetarian" : ""}`);
  push("");

  push("## Pages", "");
  push(`- [Home](${u("/")}): restaurant and catering overview, hours, location, FAQ`);
  push(`- [Menu and prices](${u("/menu/")}): every dish with its price`);
  push(`- [Dosa and parotta](${u(dosaPage.path)}): customised dosas, Paanai Parotta, kothu parotta`);
  push(`- [Nellai meals](${u(nellaiPage.path)}): Nellai Special Sodhi Meals, Karupatti Ulundhu Kali, Mini Tiffin`);
  if (cateringEnabled) {
    push(`- [Catering](${u(CATERING_PATH)}): pure vegetarian event and wedding catering in Chennai`);
    push(`- [Event planner partner](${u(PLANNER_PATH)}): catering partner for event management companies`);
  }
  push(`- [Full reference](${u("/llms-full.txt")}): everything above plus the full menu`);
  push("");

  if (offers.length) {
    push("## Offers", "");
    for (const o of offers) push(`- ${o.name}: ${o.description}`);
    push(`- Offers checked on ${FACTS.offers.verifiedOn}; they can change.`, "");
  }

  push("## Menu price ranges", "");
  for (const c of categories) push(`- ${c.name}: ${priceRange(c)} (${c.count} items)`);
  push("");

  if (full) {
    push("## Full menu", "");
    for (const c of categories) {
      push(`### ${c.name}`, "");
      for (const i of c.items) push(`- ${i.name}: ${rupees(i.price)}. ${i.description}`);
      push("");
    }
    const extras = factOr("signatureExtras", []);
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
  qa("Restaurant questions", faqItems.filter((i) => i.lang === "en"));
  if (full) {
    qa("Dosa and parotta questions", dosaPage.faq);
    qa("Nellai meals questions", nellaiPage.faq);
  }

  if (cateringEnabled) {
    push("## Catering", "");
    if (opening) push(opening, "");
    if (events.length) push(`- Events: ${events.map((e) => e.label).join(", ")}`);
    if (guests) push(`- Guests: ${guests.min} to ${guests.max}`);
    if (serviceAreas.length) push(`- Area served: ${serviceAreas.join(", ")}`);
    if (formats.length) push(`- Formats: ${formats.map((f) => f.label).join(", ")}`);
    if (liveCounters.length) push(`- Live counters: ${liveCounters.join(", ")}`);
    if (plannerModels.length) push(`- For event planners: ${plannerModels.join(", ")}`);
    if (pricingText) push(`- Pricing: ${pricingText}`);
    if (cateringContact.phone) push(`- Catering phone: ${cateringContact.phone}`);
    push("");
    if (full) {
      qa("Catering questions", cateringFaqs);
      qa("Event planner questions", plannerFaqs);
    }
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
