/**
 * Q&A for the home page, /about/ and /menu/. Each array is the ONE source for
 * that page's visible Q&A and its FAQPage JSON-LD (they cannot drift apart).
 * Facts come from entity-truth.ts; prices and lists from menu-canonical.ts via
 * menu-facts.js. qa() enforces the answer-first rules (src/lib/answers.js).
 * Not answered (unverified): opening hours, cost for two, parking, delivery, the Google rating.
 * Retired by client direction (2026-11-11): morning service and the ₹80 combo.
 */
import { getFact, FACTS, addressLine, landmarkSentence } from "./entity-truth.ts";
import { qa, list } from "../lib/answers.js";
import {
  categories,
  category,
  itemCount,
  allItems,
  meals,
  filterCoffee,
  findItems,
  priceRange,
  rupees,
} from "../lib/menu-facts.js";

const name = getFact("name");
const street = getFact("street");
const PV = "100% pure vegetarian";
const phone = getFact("phone");
const offers = getFact("offers");
const offer = (id) => {
  const o = offers.find((x) => x.id === id);
  if (!o) throw new Error(`[faq] offer "${id}" missing in entity-truth.ts`);
  return o;
};
const item = (n) => {
  const hit = allItems.find((i) => i.name === n);
  if (!hit) throw new Error(`[faq] menu item "${n}" missing in menu-canonical.ts`);
  return hit;
};
const longDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const dosa = category("dosa");
const idly = category("idly");
const beverages = category("beverages");
const paanai = item("Paanai Parotta");
const sodhi = item("Nellai Special Sodhi Meals");
const prices = allItems.map((i) => i.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
const riceDishes = findItems(/\brice$/i).map((i) => i.name);
const otherDrinks = beverages.items.filter((i) => i.name !== filterCoffee.name).map((i) => i.name);

/* ---- Home (brand hub) ---------------------------------------------------- */
export const faqItems = [
  qa(
    `Is ${name} a pure vegetarian restaurant?`,
    `Yes, ${name} on ${street} is a ${PV} restaurant, and all ${itemCount} dishes on its current menu are vegetarian, with no meat, egg or fish. ` +
      "Some booking and listing sites tag it as non-veg, which is wrong; the menu itself is entirely pure veg.",
    { id: "pure-veg" }
  ),
  qa(
    `What should I order at ${name}?`,
    `${name}, the ${PV} restaurant on ${street}, is known for customised dosas, Paanai Parotta (${rupees(paanai.price)}), the ${sodhi.name} (${rupees(sodhi.price)}) and filter coffee (${rupees(filterCoffee.price)}). ` +
      `For lunch, start with the ${sodhi.name}, a Tirunelveli-style meal built around sodhi.`,
    { id: "what-to-order" }
  ),
  qa(
    `How much do dishes cost at ${name}?`,
    `Dishes at ${name}, the ${PV} restaurant on ${street}, cost ${rupees(minPrice)} to ${rupees(maxPrice)} on the current menu. ` +
      `Meals cost ${priceRange(meals)}, and every dish price is listed on the menu page.`,
    { id: "dish-prices" }
  ),
  qa(
    `Does ${name} have dining offers?`,
    `Yes, ${name}, the ${PV} restaurant on ${street}, offers ${offer("walk-in").description}. ` +
      `It also gives ${offer("pre-booking").description}. ` +
      `Offers were checked on ${longDate(FACTS.offers.verifiedOn)} and can change, so confirm them in the booking app.`,
    { id: "offers" }
  ),
  qa(
    `Is ${name} good for families and groups?`,
    `${name} is a family-friendly, ${PV} restaurant on ${street}, with dine-in for ${getFact("mealTimes")}. ` +
      `Groups can pre-book a table through Swiggy Dineout, EazyDiner or District, and dishes on the menu start at ${rupees(minPrice)}.`,
    { id: "families-groups" }
  ),
  qa(
    `What is ${getFact("subBrand").name}?`,
    `${getFact("subBrand").name} is a ${getFact("subBrand").description} brand from ${name}, the ${PV} restaurant on ${street}. ` +
      `The restaurant itself focuses on South Indian food, with ${dosa.count} dosa varieties and Tirunelveli and Karaikudi dishes on its menu.`,
    { id: "beyond-curry" }
  ),
  qa(
    `Who founded ${name}?`,
    `${getFact("founders").story} ` + `Today ${name} is a ${PV} restaurant on ${street}, serving ${getFact("mealTimes")}.`,
    { id: "founders" }
  ),
];

/* ---- /about/ (location, hours, directions) ------------------------------- */
export const aboutFaq = [
  qa(
    `Where is ${name} located?`,
    `${name} is at ${addressLine()}, near Anna Nagar Tower Park. ` +
      `The ${PV} restaurant's nearest landmarks are ${landmarkSentence()}.`,
    { id: "location" }
  ),
  qa(
    `Which meals does ${name} serve?`,
    `${name} serves ${getFact("mealTimes")} at its ${PV} restaurant on ${street}. ` +
      `The menu runs from dosas and Paanai Parotta to Tamil Nadu meals and the ${sodhi.name}. For today's opening hours, call ${phone}.`,
    { id: "timings" }
  ),
  qa(
    `Which areas is ${name} close to?`,
    `${name}, the ${PV} restaurant on ${street} (Chennai ${getFact("address").postalCode}), draws diners from ${list(getFact("nearbyAreas"))}. ` +
      `It sits near ${getFact("landmarks")[0]}, on the ${street.split(", Anna Nagar East")[0]} stretch.`,
    { id: "areas" }
  ),
  qa(
    `How do I contact ${name}?`,
    `Call ${name} on ${phone} or email ${getFact("email")} about tables, offers or catering at its ${PV} restaurant on ${street}. ` +
      `Pre-booked tables get up to 40% off from Monday to Thursday.`,
    { id: "contact" }
  ),
];

/* ---- /menu/ ---------------------------------------------------------------- */
export const menuFaq = [
  qa(
    `What is on the ${name} menu?`,
    `The ${name} menu lists ${itemCount} ${PV} dishes in ${categories.length} sections, from ${dosa.count} dosa varieties and kothu combos to meals, parotta and sweets, served on ${street}. ` +
      `Prices run from ${rupees(minPrice)} to ${rupees(maxPrice)}.`,
    { id: "menu-overview" }
  ),
  qa(
    `Does ${name} serve filter coffee?`,
    `Yes, ${name} serves filter coffee for ${rupees(filterCoffee.price)} at its ${PV} restaurant on ${street}, along with ${list(otherDrinks)}. ` +
      `The restaurant also has an outdoor filter coffee and tea counter.`,
    { id: "filter-coffee" }
  ),
  qa(
    `How much does a meal cost at ${name}?`,
    `Meals at ${name} cost ${priceRange(meals)} across ${meals.count} options, from ${meals.cheapest.name} to ${meals.dearest.name}, at its ${PV} restaurant on ${street}. ` +
      `Rice dishes such as ${list(riceDishes)} are listed separately on the menu.`,
    { id: "meal-cost" }
  ),
  qa(
    `Which idly and idiyappam dishes does ${name} serve?`,
    `${name} serves ${idly.count} idly and idiyappam dishes (${priceRange(idly)}) at its ${PV} restaurant on ${street}, alongside ${dosa.count} dosa varieties. ` +
      `They include ${list(idly.names.slice(0, 3))}.`,
    { id: "idly-idiyappam" }
  ),
];

/** Label for an optional non-English Q&A group (none at present). */
export const faqLanguageGroups = { ta: "Tamil" };
