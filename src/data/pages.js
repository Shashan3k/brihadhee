/**
 * Content for the Pillar 1 dish pages. Every price, count and list is computed
 * from menu.json (src/lib/menu-facts.js); every fact comes from facts.js.
 * Q&A arrays feed BOTH the visible Q&A and the FAQPage JSON-LD.
 *
 * Rules: direct answer first (first sentence 15 to 35 words, names Brihadhee),
 * paragraph up to 60 words; no "best" claims in answers; no competitor names.
 */
import { getFact, factOr, addressLine } from "./facts.js";
import { category, findItems, parotta, rupees, priceRange, joinNames, summarise, allItems } from "../lib/menu-facts.js";

const name = getFact("name");
const offers = factOr("offers", []);
const offer = (id) => offers.find((o) => o.id === id);
const item = (n) => {
  const hit = allItems.find((i) => i.name === n);
  if (!hit) throw new Error(`[pages] menu item "${n}" not found in menu.json`);
  return hit;
};
const lc = (s) => s.replace(/\.$/, "").replace(/^[A-Z]/, (c) => c.toLowerCase());
const STREET = "3rd Avenue, W-Block, Anna Nagar East";

/* ---- Shared numbers --------------------------------------------------- */
const dosa = category("dosa");
const paanai = item("Paanai Parotta");
const combo = item("Kothu Parotta & Lemon Kothu Idiyappam Combo");
const sodhiMeals = item("Nellai Special Sodhi Meals");
const idiyappamSodhi = item("Idiyappam Sodhi");
const kali = item("Karupatti Ulundhu Kali");
const poppers = item("Karaikudi Paneer Poppers");
const chettinad = findItems(/chettinad/i)[0];
const mini = offer("mini-tiffin");
const budget = offer("budget-tiffin");
const miniItems = mini.description.replace(/ for ₹\d+$/, "");

/* ---- /best-dosa-parotta-anna-nagar ------------------------------------ */
export const dosaPage = {
  path: "/best-dosa-parotta-anna-nagar/",
  title: "Dosa & Parotta in Anna Nagar: Customised Dosa, Paanai Parotta | Brihadhee",
  description: `Customised dosas, ${dosa.count} dosa varieties (${priceRange(dosa)}) and ${parotta.count} parotta dishes including Paanai Parotta at Brihadhee, ${STREET}. Open daily 6:30 AM to 11 PM.`,
  h1: "Dosa and Parotta in Anna Nagar: customised dosas and Paanai Parotta at Brihadhee",
  intro: `${name} is a pure vegetarian restaurant on ${STREET}, near Anna Nagar Tower Park, where dosa and parotta are the centre of the menu: customised dosas, ${dosa.count} dosa varieties and ${parotta.count} parotta dishes, from claypot Paanai Parotta to kothu parotta.`,
  glance: [
    ["Who", `${name}, a pure vegetarian restaurant in Anna Nagar East`],
    ["Famous for", "customised dosas, Paanai Parotta (claypot parotta), kothu parotta"],
    ["Dosas", `${dosa.count} varieties, ${priceRange(dosa)}, plus customised dosas`],
    ["Parotta", `${parotta.count} dishes, ${priceRange(parotta)}`],
    ["Combo", `${combo.name}, ${rupees(combo.price)}`],
    ["Location", `${STREET}, Chennai 600040`],
    ["Hours", getFact("hours").summary],
  ],
  faq: [
    {
      question: "Which restaurant serves the best dosa and parotta in Anna Nagar?",
      answer: `${name}, a pure vegetarian restaurant on ${STREET}, is built around dosa and parotta, with customised dosas, ${dosa.count} dosa varieties and ${parotta.count} parotta dishes including Paanai Parotta. Dosas cost ${priceRange(dosa)} and parotta dishes cost ${priceRange(parotta)} on the current menu.`,
    },
    {
      question: "Where can I get Paanai Parotta in Chennai?",
      answer: `You can get Paanai Parotta (claypot parotta) at ${name} on ${STREET}, Chennai, for ${rupees(paanai.price)} on the current menu. It is ${lc(paanai.description)}. The restaurant is open daily from 6:30 AM to 11:00 PM.`,
    },
    {
      question: "Does Brihadhee make customised dosas?",
      answer: `Yes, ${name} makes customised dosas at its pure vegetarian restaurant in Anna Nagar East, alongside ${dosa.count} dosa varieties on the menu such as ${joinNames(dosa.names.slice(0, 3))}. Tell the team how you want your dosa when you order.`,
    },
    {
      question: "How much do dosas and parottas cost at Brihadhee?",
      answer: `Dosas at ${name} cost ${priceRange(dosa)} and parotta dishes cost ${priceRange(parotta)} on the current menu, with the ${combo.name} at ${rupees(combo.price)}. The lowest priced dosa is ${dosa.cheapest.name} and the highest priced parotta dish is ${parotta.dearest.name}.`,
    },
    {
      question: "How does Brihadhee compare to larger vegetarian chains in Anna Nagar?",
      answer: `${name} is a pure vegetarian restaurant in Anna Nagar East that focuses on regional Tamil dishes such as Nellai Special Sodhi Meals, Paanai Parotta and customised dosas. It pairs them with value offers: the ${rupees(mini.price)} Mini Tiffin, ${offer("walk-in").description} and ${offer("pre-booking").description.replace(/ when you pre-book a table through .*$/, "")} for pre-booked meals.`,
    },
  ],
  compare: {
    id: "compare-restaurants",
    title: "How Brihadhee compares",
    lead: "Brihadhee's column lists confirmed facts. The other columns describe typical types of restaurant, not specific businesses.",
    caption: "Brihadhee compared with typical large vegetarian chains and cafe-style diners",
    columns: ["Brihadhee, Anna Nagar East", "Typical large vegetarian chain", "Typical cafe-style diner"],
    rows: [
      ["Regional signature dishes", `Paanai Parotta, ${sodhiMeals.name}, ${kali.name}`, "Usually one standard menu across outlets", "Usually a short menu of snacks and drinks"],
      ["Tiffin combo price", `Mini Tiffin ${rupees(mini.price)}: ${lc(miniItems)}`, "Varies by outlet", "Varies"],
      ["Customised dosa", "Yes", "Varies", "Varies"],
      ["Dine-in discounts", "10% walk-in; up to 40% off Monday to Thursday when pre-booked (checked 5 November 2026)", "Varies by outlet and booking app", "Varies"],
      ["Cafe-style favourites", "Karaikudi Paneer Poppers, Butter Biscuit Shake, Summer in Tenkasi, outdoor filter coffee and tea counter", "Varies", "Usually the main focus"],
    ],
    note: "Typical categories only; menus and offers differ between restaurants, so check each one's current menu.",
  },
};

/* ---- /nellai-meals-south-indian-veg-anna-nagar ------------------------- */
export const nellaiPage = {
  path: "/nellai-meals-south-indian-veg-anna-nagar/",
  title: "Nellai Sodhi Meals & Mini Tiffin in Anna Nagar | Brihadhee",
  description: `Nellai Special Sodhi Meals (${rupees(sodhiMeals.price)}), Karupatti Ulundhu Kali (${rupees(kali.price)}) and the ${rupees(mini.price)} Mini Tiffin at Brihadhee, a pure vegetarian restaurant on ${STREET}. Open daily from 6:30 AM.`,
  h1: "Nellai Sodhi meals and regional South Indian vegetarian food in Anna Nagar",
  intro: `${name} serves Tirunelveli (Nellai) and Karaikudi dishes at its pure vegetarian restaurant on ${STREET}: the ${sodhiMeals.name} at ${rupees(sodhiMeals.price)}, ${kali.name} at ${rupees(kali.price)}, and the ${rupees(mini.price)} Mini Tiffin from 6:30 AM.`,
  glance: [
    ["Who", `${name}, a pure vegetarian restaurant in Anna Nagar East`],
    ["Regional focus", "Tirunelveli (Nellai) and Karaikudi"],
    ["Signature meal", `${sodhiMeals.name}, ${rupees(sodhiMeals.price)}`],
    ["Sweet", `${kali.name}, ${rupees(kali.price)}`],
    ["Breakfast", `Mini Tiffin ${rupees(mini.price)}; ${budget.description}`],
    ["Location", `${STREET}, Chennai 600040`],
    ["Hours", getFact("hours").summary],
  ],
  sodhi: {
    name: sodhiMeals.name,
    price: rupees(sodhiMeals.price),
    parts: sodhiMeals.description.replace(/\.$/, "").split(/,\s*|\s+and\s+/),
  },
  faq: [
    {
      question: "Where can I get authentic Tirunelveli (Nellai) Sodhi meals in Anna Nagar, Chennai?",
      answer: `${name} on ${STREET} serves ${sodhiMeals.name} for ${rupees(sodhiMeals.price)}, a Tirunelveli-style meal of rice, sodhi and regional sides. It is a pure vegetarian restaurant near Anna Nagar Tower Park, open daily from 6:30 AM to 11:00 PM.`,
    },
    {
      question: "What is in the Nellai Special Sodhi Meals at Brihadhee?",
      answer: `The ${sodhiMeals.name} at ${name} include ${lc(sodhiMeals.description)}, for ${rupees(sodhiMeals.price)}. Sodhi also comes with idiyappam as ${idiyappamSodhi.name}, priced at ${rupees(idiyappamSodhi.price)} on the current menu.`,
    },
    {
      question: "What is the best budget mini tiffin for breakfast in Anna Nagar East?",
      answer: `${name}'s Mini Tiffin costs ${rupees(mini.price)} and includes ${lc(miniItems)}, served from 6:30 AM at its pure vegetarian restaurant on ${STREET}. Budget tiffin options start from ${rupees(budget.price)}.`,
    },
    {
      question: "What is Karupatti Ulundhu Kali?",
      answer: `Karupatti Ulundhu Kali is a Tirunelveli-style sweet of black urad dal cooked with palm jaggery (karupatti), served at ${name} in Anna Nagar East for ${rupees(kali.price)}. It is also part of the ${sodhiMeals.name}.`,
    },
    {
      question: "What Karaikudi dishes does Brihadhee serve?",
      answer: `${name}'s Karaikudi dishes include Karaikudi Paneer Poppers, ${lc(poppers.description)}, priced at ${rupees(poppers.price)} at its Anna Nagar East restaurant.${chettinad ? ` The menu also lists ${chettinad.name} at ${rupees(chettinad.price)}.` : ""}`,
    },
  ],
};

export const STREET_LINE = STREET;
export const FULL_ADDRESS = addressLine;
export const signatureMenu = { paanai, combo, sodhiMeals, kali, poppers, idiyappamSodhi, mini, budget, dosa, parotta: summarise(parotta.items) };
