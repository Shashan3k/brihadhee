/**
 * Content for the Pillar 1 dish pages. Every price, count and list is computed
 * from menu-canonical.ts (src/lib/menu-facts.js); every fact comes from
 * entity-truth.ts. Q&A arrays feed BOTH the visible Q&A and the FAQPage JSON-LD,
 * and qa() enforces the answer-first rules (src/lib/answers.js).
 * No "best" claims in answers; no competitor names.
 */
import { getFact } from "./entity-truth.ts";
import { qa, list } from "../lib/answers.js";
import { category, findItems, parotta, rupees, priceRange, summarise, allItems } from "../lib/menu-facts.js";

const name = getFact("name");
const STREET = getFact("street");
const PV = "100% pure vegetarian";
const hours = getFact("hours");
const opensAt = hours.short.split(" to ")[0];
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
const kali = item("Karuppati Ulundhu Kali");
const poppers = item("Karaikudi Paneer Poppers");
const kothu = findItems(/kothu parotta/i).filter((i) => i.name !== combo.name)[0];
const mini = offer("mini-tiffin");
const budget = offer("budget-tiffin");
const miniItems = mini.description.replace(/ for ₹\d+$/, "");
const sodhiParts = sodhiMeals.description.replace(/\.$/, "");

/* ---- /best-dosa-parotta-anna-nagar ------------------------------------ */
export const dosaPage = {
  path: "/best-dosa-parotta-anna-nagar/",
  title: `Dosa & Paanai Parotta in Anna Nagar East | ${name}`,
  description: `Customised dosas, ${dosa.count} dosa varieties (${priceRange(dosa)}) and ${parotta.count} parotta dishes, including Paanai Parotta, at ${name}, pure veg, Anna Nagar East.`,
  h1: `Dosa and Parotta in Anna Nagar: customised dosas and Paanai Parotta at ${name}`,
  intro: `${name} is a ${PV} restaurant on ${STREET}, near Anna Nagar Tower Park, where dosa (dosai) and parotta are the centre of the menu: customised dosas, ${dosa.count} dosa varieties and ${parotta.count} parotta dishes, from claypot Paanai Parotta to kothu parotta.`,
  glance: [
    ["Who", `${name}, a ${PV} restaurant in Anna Nagar East`],
    ["Famous for", "customised dosas, Paanai Parotta (claypot parotta), kothu parotta"],
    ["Dosas", `${dosa.count} varieties, ${priceRange(dosa)}, plus customised dosas`],
    ["Parotta", `${parotta.count} dishes, ${priceRange(parotta)}`],
    ["Combo", `${combo.name}, ${rupees(combo.price)}`],
    ["Location", `${STREET}, Chennai ${postal}`],
    ["Hours", hours.summary],
  ],
  faq: [
    qa(
      "Which restaurant serves the best dosa and parotta in Anna Nagar?",
      `${name}, a ${PV} restaurant on ${STREET}, is built around dosa and parotta, with customised dosas, ${dosa.count} dosa varieties and ${parotta.count} parotta dishes including Paanai Parotta. ` +
        `Dosas cost ${priceRange(dosa)} and parotta dishes cost ${priceRange(parotta)} on the current menu.`
    ),
    qa(
      "Where can I get Paanai Parotta in Chennai?",
      `You can get Paanai Parotta (claypot parotta) at ${name}, the ${PV} restaurant on ${STREET}, Chennai, for ${rupees(paanai.price)}. ` +
        `It is ${lc(paanai.description)}, and the restaurant is open daily from ${hours.short}.`
    ),
    qa(
      `What is a customised dosa at ${name}?`,
      `A customised dosa at ${name} is a dosa made to your choice at the table, served at its ${PV} restaurant on ${STREET}. ` +
        `It sits alongside ${dosa.count} menu dosa varieties such as ${list(dosa.names.slice(0, 3))}, priced from ${rupees(dosa.min)}.`
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
      ["Tiffin combo price", `Mini Tiffin ${rupees(mini.price)}: ${lc(miniItems)}`, "Varies by outlet", "Varies"],
      ["Customised dosa", "Yes", "Varies", "Varies"],
      ["Dine-in discounts", `${offer("walk-in").description}; ${offer("pre-booking").description}`, "Varies by outlet and booking app", "Varies"],
      ["Cafe-style favourites", "Karaikudi Paneer Poppers, Butter Biscuit Smoothie, Summer in Tenkasi, outdoor filter coffee and tea counter", "Varies", "Usually the main focus"],
    ],
    note: "Typical categories only; menus and offers differ between restaurants, so check each one's current menu.",
  },
};

/* ---- /nellai-meals-south-indian-veg-anna-nagar ------------------------- */
export const nellaiPage = {
  path: "/nellai-meals-south-indian-veg-anna-nagar/",
  title: `Nellai Sodhi Meals & Mini Tiffin in Anna Nagar | ${name}`,
  description: `Nellai Special Sodhi Meals (${rupees(sodhiMeals.price)}), ${kali.name} and the ${rupees(mini.price)} Mini Tiffin at ${name}, pure veg, Anna Nagar East. Open from ${opensAt}.`,
  h1: "Nellai Sodhi meals and regional South Indian vegetarian food in Anna Nagar",
  intro: `${name} serves Tirunelveli (Nellai) and Karaikudi dishes at its ${PV} restaurant on ${STREET}: the ${sodhiMeals.name}, a Nellai virundhu-style meal, at ${rupees(sodhiMeals.price)}, ${kali.name} at ${rupees(kali.price)}, and the ${rupees(mini.price)} Mini Tiffin from ${opensAt}.`,
  glance: [
    ["Who", `${name}, a ${PV} restaurant in Anna Nagar East`],
    ["Regional focus", "Tirunelveli (Nellai) and Karaikudi"],
    ["Signature meal", `${sodhiMeals.name}, ${rupees(sodhiMeals.price)}`],
    ["Sweet", `${kali.name}, ${rupees(kali.price)}`],
    ["Breakfast", `Mini Tiffin ${rupees(mini.price)}; ${budget.description}`],
    ["Location", `${STREET}, Chennai ${postal}`],
    ["Hours", hours.summary],
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
        `The Tirunelveli-style meal comes with rice, sodhi, sambar, rasam, kootu, poriyal and ${lc(kali.name)}, and the restaurant opens at ${opensAt}.`
    ),
    qa(
      `What is in the Nellai Special Sodhi Meals at ${name}?`,
      `The ${sodhiMeals.name} at ${name} include ${sodhiParts.toLowerCase()}, for ${rupees(sodhiMeals.price)}. ` +
        `It is served at the ${PV} restaurant on ${STREET}.`
    ),
    qa(
      "What is the best budget mini tiffin for breakfast in Anna Nagar East?",
      `${name}'s Mini Tiffin costs ${rupees(mini.price)} and includes ${lc(miniItems)}, served from ${opensAt} at its ${PV} restaurant on ${STREET}. ` +
        `Budget tiffin options start from ${rupees(budget.price)}.`
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
export const signatureMenu = { paanai, combo, sodhiMeals, kali, poppers, idiyappamSodhi, mini, budget, dosa, parotta: summarise(parotta.items) };
