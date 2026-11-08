/**
 * Q&A for the home page, /about/ and /menu/. Each array is the ONE source for
 * that page's visible Q&A and its FAQPage JSON-LD (they cannot drift apart).
 * Facts come from entity-truth.ts; prices and lists from menu-canonical.ts via
 * menu-facts.js. qa() enforces the answer-first rules (src/lib/answers.js).
 * Not answered (unverified): parking, delivery, the Google rating, late-night hours.
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
const hours = getFact("hours");
const opensAt = hours.short.split(" to ")[0];
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
const mini = offer("mini-tiffin");
const prices = allItems.map((i) => i.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
const riceDishes = findItems(/\brice$/i).map((i) => i.name);
const otherDrinks = beverages.items.filter((i) => i.name !== filterCoffee.name).map((i) => i.name);
const miniItems = mini.description.replace(/ for ₹\d+$/, "").replace(/, sambar and chutneys$/, "");

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
      `For a lighter breakfast, the ${rupees(mini.price)} Mini Tiffin brings ${miniItems} together.`,
    { id: "what-to-order" }
  ),
  qa(
    `How much does a meal at ${name} cost for two?`,
    `A meal at ${name}, the ${PV} restaurant on ${street}, costs about ${getFact("priceRange").text}. ` +
      `Every dish price is listed on the menu page, from ${rupees(minPrice)} to ${rupees(maxPrice)}.`,
    { id: "price-for-two" }
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
    `${name} is a family-friendly, ${PV} restaurant on ${street}, with dine-in for ${getFact("mealTimes")} from ${hours.short}. ` +
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
    `${getFact("founders").story} ` + `Today ${name} is a ${PV} restaurant on ${street}, open daily from ${hours.short}.`,
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
    `What are ${name}'s timings?`,
    `${name} is open every day from ${hours.short} on ${street}, serving ${getFact("mealTimes")}. ` +
      `The ${PV} restaurant starts the day with tiffin, including the ${rupees(mini.price)} Mini Tiffin, and keeps the same hours on weekends.`,
    { id: "timings" }
  ),
  qa(
    `Is ${name} open on Sundays?`,
    `Yes, ${name} is open on Sundays from ${hours.short}, the same hours as every other day, at its ${PV} restaurant on ${street}. ` +
      "The pre-booking discount of up to 40% applies Monday to Thursday only.",
    { id: "sundays" }
  ),
  qa(
    `Which areas is ${name} close to?`,
    `${name}, the ${PV} restaurant on ${street} (Chennai ${getFact("address").postalCode}), draws diners from ${list(getFact("nearbyAreas"))}. ` +
      `It sits near ${getFact("landmarks")[0]}, on the ${street.split(", Anna Nagar East")[0]} stretch.`,
    { id: "areas" }
  ),
  qa(
    `How do I contact ${name}?`,
    `Call ${name} on ${getFact("phone")} or email ${getFact("email")} about tables, offers or catering at its ${PV} restaurant on ${street}. ` +
      `The restaurant is open daily from ${hours.short}.`,
    { id: "contact" }
  ),
];

/* ---- /menu/ ---------------------------------------------------------------- */
export const menuFaq = [
  qa(
    `What is on the ${name} menu?`,
    `The ${name} menu lists ${itemCount} ${PV} dishes in ${categories.length} sections, from tiffin combos and ${dosa.count} dosa varieties to meals, parotta and sweets, served on ${street}. ` +
      `Prices run from ${rupees(minPrice)} to ${rupees(maxPrice)}.`,
    { id: "menu-overview" }
  ),
  qa(
    `Does ${name} serve filter coffee?`,
    `Yes, ${name} serves filter coffee for ${rupees(filterCoffee.price)} at its ${PV} restaurant on ${street}, along with ${list(otherDrinks)}. ` +
      `The restaurant has an outdoor filter coffee and tea counter, open from ${opensAt}.`,
    { id: "filter-coffee" }
  ),
  qa(
    `How much does a meal cost at ${name}?`,
    `Meals at ${name} cost ${priceRange(meals)} across ${meals.count} options, from ${meals.cheapest.name} to ${meals.dearest.name}, at its ${PV} restaurant on ${street}. ` +
      `Rice dishes such as ${list(riceDishes)} are listed separately on the menu.`,
    { id: "meal-cost" }
  ),
  qa(
    `Which tiffin items does ${name} serve?`,
    `${name} serves tiffin from ${opensAt} at its ${PV} restaurant on ${street}, including ${idly.count} idly and idiyappam dishes (${priceRange(idly)}) and ${dosa.count} dosa varieties. ` +
      `Tiffin favourites include ${list(idly.names.slice(0, 3))}.`,
    { id: "tiffin" }
  ),
];

/** Label for an optional non-English Q&A group (none at present). */
export const faqLanguageGroups = { ta: "Tamil" };
