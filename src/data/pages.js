/**
 * Content for the Pillar 1 dish pages. Every price, count and list is computed
 * from menu-canonical.ts (src/lib/menu-facts.js); every fact comes from
 * entity-truth.ts. Q&A arrays feed BOTH the visible Q&A and the FAQPage JSON-LD,
 * and qa() enforces the answer-first rules (src/lib/answers.js).
 * No "best" claims in answers; no competitor names.
 */
import { getFact } from "./entity-truth.ts";
import { qa, list } from "../lib/answers.js";
import { category, findItems, parotta, rupees, priceRange, summarise, allItems, byo } from "../lib/menu-facts.js";

const name = getFact("name");
const STREET = getFact("street");
const PV = "100% pure vegetarian";
const postal = getFact("address").postalCode;
const offers = getFact("offers");
const offer = (id) => {
  const o = offers.find((x) => x.id === id);
  if (!o) throw new Error(`[pages] offer "${id}" missing in entity-truth.ts`);
  return o;
};
const item = (n) => {
  const hit = allItems.find((i) => i.name === n);
  if (!hit) throw new Error(`[pages] menu item "${n}" not found in menu-canonical.ts`);
  return hit;
};
const lc = (s) => s.replace(/\.$/, "").replace(/^[A-Z]/, (c) => c.toLowerCase());

/* ---- Shared numbers --------------------------------------------------- */
const dosa = category("dosa");
const paanai = item("Paanai Parotta");
const combo = item("Kothu Parotta & Lemon Kothu Idiyappam Combo");
const sodhiMeals = item("Nellai Special Sodhi Meals");
const idiyappamSodhi = item("Idiyappam Sodhi");
const kali = item("Karuppatti Ulundhu Kali");
const poppers = item("Karaikudi Paneer Poppers");
const kothu = findItems(/kothu parotta/i).filter((i) => i.name !== combo.name)[0];
const lunch = category("lunch");
const sodhiParts = sodhiMeals.description.replace(/\.$/, "");

/* ---- /best-dosa-parotta-anna-nagar ------------------------------------ */
export const dosaPage = {
  path: "/best-dosa-parotta-anna-nagar/",
  title: `Dosa & Paanai Parotta in Anna Nagar East | ${name}`,
  description: `Build-your-own dosas, ${dosa.count} dosa varieties (${priceRange(dosa)}) and ${parotta.count} parotta dishes, including Paanai Parotta, at ${name}, pure veg, Anna Nagar East.`,
  h1: `Dosa and Parotta in Anna Nagar: build your own dosa and Paanai Parotta at ${name}`,
  intro: `${name} is a ${PV} restaurant on ${STREET}, near Anna Nagar Tower Park, where dosa (dosai) and parotta are the centre of the menu: build-your-own dosas, ${dosa.count} dosa varieties and ${parotta.count} parotta dishes, from claypot Paanai Parotta to kothu parotta.`,
  glance: [
    ["Who", `${name}, a ${PV} restaurant in Anna Nagar East`],
    ["Famous for", "build-your-own dosas, Paanai Parotta (claypot parotta), kothu parotta"],
    ["Dosas", `${dosa.count} varieties, ${priceRange(dosa)}, plus build-your-own dosas`],
    ["Parotta", `${parotta.count} dishes, ${priceRange(parotta)}`],
    ["Combo", `${combo.name}, ${rupees(combo.price)}`],
    ["Location", `${STREET}, Chennai ${postal}`],
    ["Meals", getFact("mealTimes")],
  ],
  faq: [
    qa(
      "Which restaurant serves the best dosa and parotta in Anna Nagar?",
      `${name}, a ${PV} restaurant on ${STREET}, is built around dosa and parotta, with build-your-own dosas, ${dosa.count} dosa varieties and ${parotta.count} parotta dishes including Paanai Parotta. ` +
        `Dosas cost ${priceRange(dosa)} and parotta dishes cost ${priceRange(parotta)} on the current menu.`
    ),
    qa(
      "Where can I get Paanai Parotta in Chennai?",
      `You can get Paanai Parotta (claypot parotta) at ${name}, the ${PV} restaurant on ${STREET}, Chennai, for ${rupees(paanai.price)}. ` +
        `It is ${lc(paanai.description)}, and it is one of the dishes the restaurant is known for.`
    ),
    qa(
      `Can I build my own dosa at ${name}?`,
      `Yes, ${name} lets you build your own dosa at its ${PV} restaurant on ${STREET}, starting from one of ${byo.batterCount} batters priced from ${rupees(byo.batterMin)}. ` +
        `You then add toppings, a stuffing and a garnish, or order one of ${byo.suggestionCount} chef's suggestions from ${rupees(byo.suggestionMin)} to ${rupees(byo.suggestionMax)}.`
    ),
    qa(
      `How much do dosas and parottas cost at ${name}?`,
      `Dosas at ${name} cost ${priceRange(dosa)} and parotta dishes cost ${priceRange(parotta)} at its ${PV} restaurant on ${STREET}. ` +
        `The ${combo.name} is ${rupees(combo.price)}, and the lowest priced dosa is ${dosa.cheapest.name}.`
    ),
    qa(
      "Where can I get veg kothu parotta in Anna Nagar?",
      `${name} serves veg kothu parotta at its ${PV} restaurant on ${STREET}: ${kothu.name} for ${rupees(kothu.price)}, made as ${lc(kothu.description)}. ` +
        `The ${combo.name} costs ${rupees(combo.price)}.`
    ),
  ],
  compare: {
    id: "compare-restaurants",
    title: `How ${name} compares`,
    lead: `${name}'s column lists confirmed facts. The other columns describe typical types of restaurant, not specific businesses.`,
    caption: `${name} compared with typical large vegetarian chains and cafe-style diners`,
    columns: [`${name}, Anna Nagar East`, "Typical large vegetarian chain", "Typical cafe-style diner"],
    rows: [
      ["Regional signature dishes", `Paanai Parotta, ${sodhiMeals.name}, ${kali.name}`, "Usually one standard menu across outlets", "Usually a short menu of snacks and drinks"],
      ["Kothu combo", `${combo.name}, ${rupees(combo.price)}`, "Varies by outlet", "Varies"],
      ["Build your own dosa", "Yes", "Varies", "Varies"],
      ["Dine-in discounts", `${offer("walk-in").description}; ${offer("pre-booking").description}`, "Varies by outlet and booking app", "Varies"],
      ["Cafe-style favourites", "Karaikudi Paneer Poppers, Butter Biscuit Smoothie, Summer in Tenkasi, filter coffee", "Varies", "Usually the main focus"],
    ],
    note: "Typical categories only; menus and offers differ between restaurants, so check each one's current menu.",
  },
};

/* ---- /nellai-meals-south-indian-veg-anna-nagar ------------------------- */
export const nellaiPage = {
  path: "/nellai-meals-south-indian-veg-anna-nagar/",
  title: `Nellai Sodhi Meals & Veg Lunch in Anna Nagar | ${name}`,
  description: `Nellai Special Sodhi Meals (${rupees(sodhiMeals.price)}), Tamil Nadu meals (${priceRange(lunch)}) and ${kali.name} for lunch at ${name}, pure veg, Anna Nagar East.`,
  h1: "Nellai sodhi meals and pure veg lunch in Anna Nagar",
  intro: `${name} serves Tirunelveli (Nellai) and Karaikudi dishes for lunch at its ${PV} restaurant on ${STREET}: the ${sodhiMeals.name}, a Nellai virundhu-style meal, at ${rupees(sodhiMeals.price)}, Tamil Nadu meals from ${rupees(lunch.min)}, and ${kali.name} at ${rupees(kali.price)}.`,
  glance: [
    ["Who", `${name}, a ${PV} restaurant in Anna Nagar East`],
    ["Regional focus", "Tirunelveli (Nellai) and Karaikudi"],
    ["Signature meal", `${sodhiMeals.name}, ${rupees(sodhiMeals.price)}`],
    ["Sweet", `${kali.name}, ${rupees(kali.price)}`],
    ["Lunch", `${lunch.count} lunch dishes, ${priceRange(lunch)}`],
    ["Location", `${STREET}, Chennai ${postal}`],
    ["Meals", getFact("mealTimes")],
  ],
  sodhi: {
    name: sodhiMeals.name,
    price: rupees(sodhiMeals.price),
    parts: sodhiParts.split(/,\s*|\s+and\s+/),
  },
  faq: [
    qa(
      "Where can I get Nellai meals in Chennai?",
      `${name} serves the ${sodhiMeals.name} for ${rupees(sodhiMeals.price)} at its ${PV} restaurant on ${STREET}, Chennai. ` +
        `The Tirunelveli-style meal comes with rice, sodhi, sambar, rasam, kootu, poriyal and ${lc(kali.name)}.`
    ),
    qa(
      `What is in the Nellai Special Sodhi Meals at ${name}?`,
      `The ${sodhiMeals.name} at ${name} include ${sodhiParts.toLowerCase()}, for ${rupees(sodhiMeals.price)}. ` +
        `It is served at the ${PV} restaurant on ${STREET}.`
    ),
    qa(
      "Where can I get a pure veg lunch in Anna Nagar East?",
      `${name} serves a ${PV} lunch on ${STREET}, with ${lunch.count} lunch dishes from ${rupees(lunch.min)} to ${rupees(lunch.max)}. ` +
        `The ${sodhiMeals.name} (${rupees(sodhiMeals.price)}) is the regional signature; ${list(lunch.names.filter((n) => n !== sodhiMeals.name).slice(0, 2))} are simpler options.`
    ),
    qa(
      "What is sodhi?",
      `Sodhi is a Tirunelveli-style coconut milk stew, and ${name} serves it at its ${PV} restaurant on ${STREET} with idiyappam as ${idiyappamSodhi.name} for ${rupees(idiyappamSodhi.price)}. ` +
        `It is also part of the ${sodhiMeals.name} at ${rupees(sodhiMeals.price)}.`
    ),
    qa(
      `What is ${kali.name}?`,
      `${kali.name} is a Tirunelveli-style sweet of black urad dal cooked with palm jaggery (karuppatti), served at ${name}, the ${PV} restaurant on ${STREET}, for ${rupees(kali.price)}. ` +
        `It also comes with the ${sodhiMeals.name}.`
    ),
  ],
};

export const STREET_LINE = STREET;
export const signatureMenu = { paanai, combo, sodhiMeals, kali, poppers, idiyappamSodhi, lunch, dosa, parotta: summarise(parotta.items) };
