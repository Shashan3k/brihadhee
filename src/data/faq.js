/**
 * Q&A for the home page, /about/ and /menu/. Each array is the ONE source for
 * that page's visible Q&A and its FAQPage JSON-LD (they cannot drift apart).
 * Facts come from entity-truth.ts; prices and lists from menu-canonical.ts via
 * menu-facts.js. qa() sizes each answer to its question and qaRoute() keeps one
 * Q&A per route, the address once per page and the "100% pure vegetarian"
 * descriptor out of answers that are not about diet (src/lib/answers.js).
 *
 * Scope: "100% pure vegetarian" describes the restaurant and its kitchen.
 * Catering is described with CATERING_DIET ("vegetarian" until the owner answers
 * Q20, config/seo-gates.ts IS_CATERING_PURE_VEG).
 *
 * Unverified, so answered only with "call to check" and never with a value:
 * parking, delivery, the last-order time (on /faq/ and the dinner page).
 * Not answered at all: cost for two, the Google rating.
 */
import { getFact, FACTS, addressLine, landmarkSentence, openingTimes, longDate } from "./entity-truth.ts";
import { qa, qaRoute, list } from "../lib/answers.js";
import { taHome } from "./faq-ta.js";
import { CATERING_DIET, CATERING_MIN_GUESTS } from "../../config/seo-gates.ts";
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
  byo,
  customizedDosaDefinition,
  menuNotes,
} from "../lib/menu-facts.js";

const name = getFact("name");
const PV = "100% pure vegetarian";
const AREA = "Anna Nagar East";
const phone = getFact("phone");
const email = getFact("email");
const { range: HOURS, open: OPEN } = openingTimes();
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
const bookingLabels = getFact("bookingLinks").map((b) => b.label);
const bookingOr = `${bookingLabels.slice(0, -1).join(", ")} or ${bookingLabels.at(-1)}`;
const corporate = getFact("corporateCatering");

const dosa = category("dosa");
const idly = category("idly");
const idiyappam = category("idiyappam");
const combos = category("combos");
const idlyAll = summarise([...idly.items, ...idiyappam.items]);
const beverages = category("beverages");
const paanai = item("Paanai Parotta");
const sodhi = item("Nellai Special Sodhi Meals");
const idiyappamSodhi = item("Idiyappam Sodhi");
const poppers = item("Karaikudi Paneer Poppers");
const prices = allItems.map((i) => i.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
const riceDishes = findItems(/\brice$/i).map((i) => i.name);
const otherDrinks = beverages.items.filter((i) => i.name !== filterCoffee.name).map((i) => i.name);
const batterRange = priceRange(summarise(byo.steps.find((s) => s.name === "Batter").options));
const gst = menuNotes.gst.replace(/^Prices exclude /, "").replace(/\.$/, ""); // "5% GST"
const num = (n) => n.toLocaleString("en-IN");

/* ---- Home / (brand hub) --------------------------------------------------- */
export const faqItems = qaRoute("/", [
  qa(
    `What is ${name} in Anna Nagar?`,
    `${name} is a ${PV} South Indian restaurant in ${AREA}, Chennai, open every day from ${HOURS} for lunch and dinner. ` +
      `It is known for customized dosa and the ${sodhi.name}, and its kitchen also runs ${CATERING_DIET} corporate and event catering. ` +
      `It is at ${ADDRESS}.`,
    { id: "what-is-brihadhee" }
  ),
  /* P0 (AEO audit 2026-11-12, src/data/faq.js:70): the restaurant answer no longer
     extends the pure-veg guarantee to catering, which stays CATERING_DIET until Q20. */
  qa(
    `Is ${name} pure veg?`,
    `Yes. ${name}'s restaurant in ${AREA} is ${PV}: no meat, egg or fish is cooked in its kitchen, and alcohol is not served. ` +
      `Its catering is ${CATERING_DIET}, with the menu for each function agreed in the quote.`,
    { id: "pure-veg" }
  ),
  /* "Customized Dosa" is the home page's name for the offer (client direction, 2026-11-13);
     /menu/dosa/ explains it as build-your-own dosa. */
  qa(
    `What is a customized dosa at ${name}?`,
    `${customizedDosaDefinition} Batters cost ${batterRange}, and each addition is priced separately.`,
    { id: "customized-dosa" }
  ),
  qa(
    `What should a first-timer order at ${name}?`,
    `On a first visit to ${name}, order the ${sodhi.name} (${rupees(sodhi.price)}) at lunch, or a customized dosa and ${paanai.name} (${rupees(paanai.price)}) at dinner. ` +
      `Share ${idiyappamSodhi.name} (${rupees(idiyappamSodhi.price)}) or ${poppers.name} (${rupees(poppers.price)}), and finish with filter coffee (${rupees(filterCoffee.price)}). ` +
      `For a quicker lunch, the ${combos.count} dine-in combos cost ${priceRange(combos)}.`,
    { id: "what-to-order" }
  ),
  /* "Is Brihadhee good for families and groups?" lives on /family-dining-anna-nagar/ (src/data/spokes.js). */
  qa(
    `What is ${getFact("subBrand").name}?`,
    `${getFact("subBrand").name} is ${name}'s brand for ${getFact("subBrand").description}. ` +
      `The restaurant itself serves South Indian food, led by customized dosa and Tirunelveli and Karaikudi dishes.`,
    { id: "beyond-curry" }
  ),
  qa(
    `How much do dishes cost at ${name}?`,
    `Dishes at ${name} cost ${rupees(minPrice)} to ${rupees(maxPrice)} on the current menu, before ${gst}. ` +
      `Meals cost ${priceRange(meals)}, and every price is on the menu page.`,
    { id: "dish-prices" }
  ),
  qa(
    `Does ${name} have dining offers?`,
    `Yes. ${name} gives ${offer("walk-in").description}, and ${offer("pre-booking").description}. ` +
      `Offers were checked on ${longDate(FACTS.offers.verifiedOn)} and can change.`,
    { id: "offers" }
  ),
  qa(`Who founded ${name}?`, `${getFact("founders").story} Its kitchen serves ${getFact("recipeStory")}.`, { id: "founders" }),
  qa(
    `Does ${name} do catering?`,
    `Yes. ${name} runs ${CATERING_DIET} corporate catering for more than ${num(corporate.dailyCovers)} meals a day, and event catering for functions from a minimum of ${CATERING_MIN_GUESTS} guests. ` +
      `The ${AREA} kitchen prepares corporate meals; confirm preparation and service arrangements for your event in the quote.`,
    { id: "catering" }
  ),
  ...taHome,
]);

/* ---- /about/ (address, timings, contact) ---------------------------------- */
export const aboutFaq = qaRoute("/about/", [
  qa(`Where is ${name} located?`, `${name} is at ${ADDRESS}. Nearby landmarks: ${landmarkSentence()}.`, { id: "location" }),
  qa(
    `What are ${name}'s timings?`,
    `${name} in Anna Nagar is open every day from ${HOURS}, for lunch and dinner. ` +
      `The last-order time is not published, so call ${phone} if you plan to arrive late.`,
    { id: "timings" }
  ),
  qa(
    `What meals does ${name} serve?`,
    `${name} serves lunch and dinner only, from ${HOURS}. ` +
      `Lunch centres on the ${sodhi.name} and Tamil Nadu meals; dinner on build-your-own dosa, ${paanai.name} and idiyappam.`,
    { id: "meals" }
  ),
  qa(
    `Is ${name} open on Sundays?`,
    `Yes. ${name} is open on Sundays from ${HOURS}, like every other day of the week. ` + `Weekend tables can be pre-booked on ${bookingApps}, or you can walk in.`,
    { id: "sundays" }
  ),
  qa(
    `Which areas is ${name} close to?`,
    `${name} is in ${AREA}, near ${getFact("landmarks")[0]}. ` +
      `Use the directions on this page if you are coming from Anna Nagar East Metro or other nearby landmarks.`,
    { id: "areas" }
  ),
  qa(
    `How do I contact ${name}?`,
    `Call or WhatsApp the ${name} restaurant on ${phone}, or email ${email}. ` +
      `Use this number for restaurant enquiries if an older dining listing shows a different one. Brihadhee has a separate contact for catering.`,
    { id: "contact" }
  ),
]);

/* ---- /menu/ ---------------------------------------------------------------- */
export const menuFaq = qaRoute("/menu/", [
  qa(
    `What is on the ${name} menu?`,
    `The ${name} menu in ${AREA} lists ${itemCount} vegetarian dishes in ${categories.length} sections, from build-your-own dosa and ${dosa.count} classic dosas to lunch meals, parotta, idiyappam and filter coffee. ` +
      `Prices run from ${rupees(minPrice)} to ${rupees(maxPrice)}, before ${gst}.`,
    { id: "menu-overview" }
  ),
  qa(
    `Does ${name} serve filter coffee?`,
    `Yes. ${name} serves filter coffee for ${rupees(filterCoffee.price)}, with lunch and dinner from ${HOURS}. ` + `${list(otherDrinks)} are also on the menu.`,
    { id: "filter-coffee" }
  ),
  qa(
    `How much does a meal cost at ${name}?`,
    `Meals at ${name} cost ${priceRange(meals)}, from ${meals.cheapest.name} to ${meals.dearest.name}. ` + `Rice dishes such as ${list(riceDishes)} are listed separately.`,
    { id: "meal-cost" }
  ),
  qa(
    `Which idly and idiyappam dishes does ${name} serve?`,
    `${name} serves ${idly.count} idly dishes and ${idiyappam.count} idiyappam dishes, priced ${priceRange(idlyAll)}. ` +
      `They include ${list([idly.names[0], idly.names[1], idiyappam.names[0]])}, served for lunch and dinner from ${OPEN}.`,
    { id: "idly-idiyappam" }
  ),
]);

/* ---- /book-a-table/ ---------------------------------------------------------- */
const prebook = offer("pre-booking").description.replace(/ when you pre-book a table through .*$/, ""); // "up to 40% off Monday to Thursday"
const walkIn = offer("walk-in").description.replace(/ for walk-in dine-in$/, ""); // "10% off"
export const bookingFaq = qaRoute("/book-a-table/", [
  qa(
    `How can I book a table at ${name}?`,
    `Book a table at ${name} in ${AREA} through ${bookingOr}. ` +
      `Choose the date, time and party size, then check the partner's booking status before you travel. For group seating, call the restaurant on ${phone}.`,
    { id: "is-a-table-booking-at-brihadhee-confirmed-instantly" }
  ),
  qa(
    `Can ${name} seat a large group?`,
    `Call ${name} on ${phone} before a large group visits, so the team can confirm seating for your date and time. ` +
      `Seating capacity is not published; for ${CATERING_MIN_GUESTS} or more guests at your own venue, ask about catering.`
  ),
  qa(
    `Do I need to book a table at ${name}?`,
    `No. Walk-ins are welcome at ${name} every day from ${HOURS}, and walk-in diners get ${walkIn}. ` + `Pre-booking gets ${prebook}.`
  ),
]);

/** Heading of the Tamil Q&A group (src/data/faq-ta.js). */
export const faqLanguageGroups = { ta: "அடிக்கடி கேட்கப்படும் கேள்விகள்" };
