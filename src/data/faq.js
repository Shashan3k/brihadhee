/**
 * Q&A for the home page, /about/ and /menu/. Each array is the ONE source for
 * that page's visible Q&A and its FAQPage JSON-LD (they cannot drift apart).
 * Facts come from entity-truth.ts; prices and lists from menu-canonical.ts via
 * menu-facts.js. qa() enforces the answer-first rules and qaRoute() the
 * one-Q&A-per-route and address-once rules (src/lib/answers.js).
 * Not answered (unverified): cost for two, parking, delivery, the Google rating, the last-order time.
 */
import { getFact, FACTS, addressLine, landmarkSentence, openingTimes, longDate } from "./entity-truth.ts";
import { qa, qaRoute, list } from "../lib/answers.js";
import { taHome } from "./faq-ta.js";
import { CATERING_DIET } from "../../config/seo-gates.ts";
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
  summarise,
} from "../lib/menu-facts.js";

const name = getFact("name");
const PV = "100% pure vegetarian";
const AREA = "Anna Nagar East";
const phone = getFact("phone");
const email = getFact("email");
const { range: HOURS, open: OPEN, close: CLOSE } = openingTimes();
const ADDRESS = addressLine();
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
const bookingApps = list(getFact("bookingLinks").map((b) => b.label));

const dosa = category("dosa");
const idly = category("idly");
const idiyappam = category("idiyappam");
const idlyAll = summarise([...idly.items, ...idiyappam.items]);
const beverages = category("beverages");
const paanai = item("Paanai Parotta");
const sodhi = item("Nellai Special Sodhi Meals");
const poppers = item("Karaikudi Paneer Poppers");
const prices = allItems.map((i) => i.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
const riceDishes = findItems(/\brice$/i).map((i) => i.name);
const otherDrinks = beverages.items.filter((i) => i.name !== filterCoffee.name).map((i) => i.name);

/* ---- Home / (brand hub) --------------------------------------------------- */
export const faqItems = qaRoute("/", [
  qa(
    `What is ${name} in Anna Nagar?`,
    `${name} is a ${PV} South Indian restaurant and ${CATERING_DIET} caterer in ${AREA}, Chennai, known for build-your-own dosa and the ${sodhi.name}, open daily from ${HOURS}. ` +
      `It is at ${ADDRESS}.`,
    { id: "what-is-brihadhee" }
  ),
  qa(
    `Is ${name} pure veg?`,
    `Yes, ${name} is ${PV}: there is no meat, egg or fish on its restaurant menu or its catering menus, in ${AREA} or anywhere in Chennai. ` +
      `All ${itemCount} dishes on the current menu are vegetarian, alcohol is not served, and listings that tag it as non-veg are wrong.`,
    { id: "pure-veg" }
  ),
  qa(
    `What should I order at ${name}?`,
    `At ${name}, the ${PV} restaurant in ${AREA}, order a build-your-own dosa, the ${sodhi.name} at lunch (${rupees(sodhi.price)}) and ${paanai.name} at dinner (${rupees(paanai.price)}). ` +
      `Add ${poppers.name} (${rupees(poppers.price)}) and finish with filter coffee (${rupees(filterCoffee.price)}).`,
    { id: "what-to-order" }
  ),
  /* "Is Brihadhee good for families and groups?" moved to /family-dining-anna-nagar/ (src/data/spokes.js),
     the page that now owns the family-dining intent (one Q&A per route). */
  qa(
    `What is ${getFact("subBrand").name}?`,
    `${getFact("subBrand").name} is a ${getFact("subBrand").description} brand from ${name}, the ${PV} restaurant in ${AREA}. ` +
      `The restaurant itself focuses on South Indian food, with build-your-own dosa, ${dosa.count} classic dosas and Tirunelveli and Karaikudi dishes on its menu.`,
    { id: "beyond-curry" }
  ),
  qa(
    `How much do dishes cost at ${name}?`,
    `Dishes at ${name}, the ${PV} restaurant in ${AREA}, cost ${rupees(minPrice)} to ${rupees(maxPrice)} on the current menu. ` +
      `Meals cost ${priceRange(meals)}, and every dish price is listed on the menu page.`,
    { id: "dish-prices" }
  ),
  qa(
    `Does ${name} have dining offers?`,
    `Yes, ${name}, the ${PV} restaurant in ${AREA}, offers ${offer("walk-in").description}. ` +
      `It also gives ${offer("pre-booking").description}. ` +
      `Offers were checked on ${longDate(FACTS.offers.verifiedOn)} and can change, so confirm them in the booking app.`,
    { id: "offers" }
  ),
  qa(
    `Who founded ${name}?`,
    `${getFact("founders").story} ` + `Today ${name} is a ${PV} restaurant in ${AREA}, serving ${getFact("mealTimes")} every day from ${HOURS}.`,
    { id: "founders" }
  ),
  ...taHome,
]);

/* ---- /about/ (address, timings, contact) ---------------------------------- */
export const aboutFaq = qaRoute("/about/", [
  qa(
    `Where is ${name} located?`,
    `${name} is at ${ADDRESS}, near Anna Nagar Tower Park. ` + `The ${PV} restaurant's nearest landmarks are ${landmarkSentence()}.`,
    { id: "location" }
  ),
  qa(
    `What are ${name}'s timings?`,
    `${name} is open every day from ${HOURS}, serving ${PV} lunch and dinner at its restaurant in ${AREA}. ` +
      `Lunch is served from ${OPEN}, dinner runs until ${CLOSE}, and tables can be pre-booked on ${bookingApps}.`,
    { id: "timings" }
  ),
  qa(
    `What meals does ${name} serve?`,
    `${name} serves ${PV} South Indian lunch and dinner from ${HOURS} every day at its restaurant in ${AREA}. ` +
      `Lunch centres on the ${sodhi.name} and Tamil Nadu meals, and dinner on build-your-own dosa, ${paanai.name} and idiyappam.`,
    { id: "meals" }
  ),
  qa(
    `Is ${name} open on Sundays?`,
    `Yes, ${name} is open on Sundays from ${HOURS}, like every other day of the week, serving ${PV} lunch and dinner in ${AREA}. ` +
      `Weekend tables can be pre-booked on ${bookingApps}, or you can walk in.`,
    { id: "sundays" }
  ),
  qa(
    `Which areas is ${name} close to?`,
    `${name}, the ${PV} restaurant in ${AREA}, draws diners from ${list(getFact("nearbyAreas"))}. ` +
      `It sits near Anna Nagar Tower Park, and this page has Google Maps directions from ${getFact("directionLandmarks").length} nearby landmarks.`,
    { id: "areas" }
  ),
  qa(
    `How do I contact ${name}?`,
    `Call or WhatsApp ${name}, the ${PV} restaurant in ${AREA}, on ${phone}, or email ${email}, about tables, offers or catering. ` +
      `Pre-booked tables get up to 40% off from Monday to Thursday.`,
    { id: "contact" }
  ),
]);

/* ---- /menu/ ---------------------------------------------------------------- */
export const menuFaq = qaRoute("/menu/", [
  qa(
    `What is on the ${name} menu?`,
    `The ${name} menu lists ${itemCount} dishes, all ${PV}, in ${categories.length} sections, from build-your-own dosa and ${dosa.count} classic dosas to lunch meals, parotta and filter coffee. ` +
      `Prices run from ${rupees(minPrice)} to ${rupees(maxPrice)} at ${ADDRESS}.`,
    { id: "menu-overview" }
  ),
  qa(
    `Does ${name} serve filter coffee?`,
    `Yes, ${name} serves filter coffee for ${rupees(filterCoffee.price)} at its ${PV} restaurant in ${AREA}, along with ${list(otherDrinks)}. ` +
      `Filter coffee is served every day from ${HOURS}, with lunch and dinner.`,
    { id: "filter-coffee" }
  ),
  qa(
    `How much does a meal cost at ${name}?`,
    `Meals at ${name} cost ${priceRange(meals)} across ${meals.count} options, from ${meals.cheapest.name} to ${meals.dearest.name}, at its ${PV} restaurant in ${AREA}. ` +
      `Rice dishes such as ${list(riceDishes)} are listed separately on the menu.`,
    { id: "meal-cost" }
  ),
  qa(
    `Which idly and idiyappam dishes does ${name} serve?`,
    `${name} serves ${idly.count} idly dishes and ${idiyappam.count} idiyappam dishes (${priceRange(idlyAll)}) at its ${PV} restaurant in ${AREA}, alongside ${dosa.count} classic dosas. ` +
      `They include ${list([idly.names[0], idly.names[1], idiyappam.names[0]])}.`,
    { id: "idly-idiyappam" }
  ),
]);

/** Heading of the Tamil Q&A group (src/data/faq-ta.js). */
export const faqLanguageGroups = { ta: "அடிக்கடி கேட்கப்படும் கேள்விகள்" };
