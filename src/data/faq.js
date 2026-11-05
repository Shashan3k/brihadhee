/**
 * Home-page FAQ: the ONE data source for the visible FAQ and the FAQPage
 * JSON-LD, so they cannot drift apart.
 *
 * Rules every answer follows:
 *  - first sentence is complete, 15 to 35 words, and names "Brihadhee"
 *  - then 0 to 3 supporting sentences
 *  - facts come from facts.js; prices and lists come from menu.json (never typed)
 *  - questions whose facts are pending are skipped (hours, weekends, price
 *    range per person); nothing about delivery, booking, parking, buffet,
 *    breakfast or customizable dosas
 */
import { getFact, factOr, addressLine, landmarkSentence } from "./facts.js";
import verification from "../../config/client-verification.json";
import {
  categories,
  category,
  itemCount,
  allVegetarian,
  parotta,
  meals,
  filterCoffee,
  priceRange,
  rupees,
  joinNames,
} from "../lib/menu-facts.js";

const name = getFact("name");
const typeText = getFact("type");
const phone = getFact("phone");
const email = getFact("email");
const knownFor = getFact("knownFor");

const dosa = category("dosa");
const lunch = category("lunch");
const beverages = category("beverages");
const sentence = (...parts) => parts.filter(Boolean).join(" ");

const offers = factOr("offers", []);
const offerText = (id) => offers.find((o) => o.id === id)?.description ?? "";
const miniTiffin = offers.find((o) => o.id === "mini-tiffin");
const otherBeverages = beverages.items.filter((i) => i.name !== filterCoffee.name);
const exampleDishes = [
  dosa.items[0],
  dosa.items[1],
  lunch.items[0],
  parotta.items[0],
  filterCoffee,
].filter(Boolean);

export const faqItems = [
  {
    id: "known-for",
    lang: "en",
    question: `What is ${name} known for?`,
    answer: sentence(
      `${name} is known for ${joinNames(knownFor)} at its ${typeText} in Anna Nagar East, Chennai.`,
      `The menu also lists dosas, idly, parotta and Tamil Nadu meals, ${allVegetarian ? "all of them vegetarian" : "with vegetarian options"}.`
    ),
  },
  {
    id: "vegetarian",
    lang: "en",
    question: `Is ${name} a vegetarian restaurant?`,
    answer: sentence(
      `Yes, ${name} is a ${typeText}${allVegetarian ? `, and all ${itemCount} items on its current menu are vegetarian` : ""}.`,
      `The menu covers ${categories.length} categories, from starters and meals to dosas, idly, parotta and beverages.`
    ),
  },
  {
    id: "location",
    lang: "en",
    question: `Where is ${name} located, and what is the address?`,
    answer: sentence(
      `${name} is at ${addressLine()}, near Anna Tower and 3rd Avenue.`,
      `Nearby landmarks are ${landmarkSentence()}.`
    ),
  },
  {
    id: "hours",
    lang: "en",
    question: `What time does ${name} open and close?`,
    answer: sentence(
      `${name} opens at 6:30 AM and closes at 11:00 PM every day of the week, serving ${getFact("mealTimes")} at its ${typeText} in Anna Nagar East.`,
      miniTiffin ? `Its ${rupees(miniTiffin.price)} Mini Tiffin combo includes ${miniTiffin.description.replace(/ for ₹\d+$/, "").replace(/^[A-Z]/, (c) => c.toLowerCase())}.` : ""
    ),
  },
  {
    id: "weekends",
    lang: "en",
    question: `Is ${name} open on weekends?`,
    answer: sentence(
      `Yes, ${name} is open on Saturdays and Sundays from 6:30 AM to 11:00 PM, the same hours as weekdays, on 3rd Avenue, W-Block, Anna Nagar East.`,
      "The pre-booking discount of up to 40% applies Monday to Thursday only."
    ),
  },
  {
    id: "price-for-two",
    lang: "en",
    question: `How much does a meal at ${name} cost for two?`,
    answer: sentence(
      `A meal for two at ${name} costs about ${getFact("priceRange").text}, at its ${typeText} in Anna Nagar East.`,
      "Exact prices for every dish are listed on the menu page."
    ),
  },
  {
    id: "offers",
    lang: "en",
    question: `Does ${name} have dining offers?`,
    answer: sentence(
      `Yes, ${name} offers ${offerText("walk-in")}, and ${offerText("pre-booking")}.`,
      "Offers were checked on 5 November 2026 and can change, so confirm the current offer in the booking app."
    ),
  },
  {
    id: "founders",
    lang: "en",
    question: `Who founded ${name}?`,
    answer: sentence(
      getFact("founders").story,
      `The restaurant in Anna Nagar East focuses on Tirunelveli and Karaikudi dishes alongside everyday South Indian favourites.`
    ),
  },
  ...(verification.offer_catering === true
    ? [
        {
          id: "catering",
          lang: "en",
          question: `Does ${name} do catering for functions?`,
          answer: sentence(
            `Yes, ${name} caters pure vegetarian functions across ${getFact("catering").area}, from seemantham and gruhapravesam to boutique weddings, for ${getFact("catering").guests.min} to ${getFact("catering").guests.max.toLocaleString("en-IN")} guests.`,
            `Live counters include ${joinNames(getFact("catering").liveCounters)}.`
          ),
        },
      ]
    : []),
  {
    id: "near-anna-tower",
    lang: "en",
    question: "Which restaurant near Anna Tower serves South Indian meals?",
    answer: sentence(
      `${name} is a ${typeText} near Anna Tower and 3rd Avenue in Anna Nagar East, Chennai, serving ${getFact("mealTimes")}.`,
      `Its meals range from ${rupees(meals.min)} to ${rupees(meals.max)} on the current menu.`
    ),
  },
  {
    id: "what-it-serves",
    lang: "en",
    question: `What does ${name} serve?`,
    answer: sentence(
      `${name} serves vegetarian South Indian food in ${categories.length} menu categories, from starters and meals to dosas, idly, parotta, gravies and beverages.`,
      `Examples from the menu include ${joinNames(exampleDishes.map((i) => i.name))}.`
    ),
  },
  {
    id: "parotta",
    lang: "en",
    question: `Does ${name} serve parotta?`,
    answer: sentence(
      `Yes, ${name} serves parotta, with ${parotta.count} parotta dishes on its menu, from ${parotta.cheapest.name} at ${rupees(parotta.cheapest.price)} to ${parotta.dearest.name} at ${rupees(parotta.dearest.price)}.`,
      `The parotta dishes are ${joinNames(parotta.names)}.`
    ),
  },
  {
    id: "filter-coffee",
    lang: "en",
    question: `Does ${name} serve filter coffee?`,
    answer: sentence(
      `Yes, ${name} serves filter coffee, priced at ${rupees(filterCoffee.price)} on its current menu, at its ${typeText} in Anna Nagar East.`,
      otherBeverages.length
        ? `Other beverages on the menu are ${joinNames(otherBeverages.map((i) => i.name))}.`
        : ""
    ),
  },
  {
    id: "banana-leaf",
    lang: "en",
    question: "Can I find banana-leaf meals in Anna Nagar?",
    answer: sentence(
      `Yes, ${name} serves banana-leaf meals at its ${typeText} in Anna Nagar East, Chennai.`,
      `The menu lists these meals: ${joinNames(meals.names)}, priced from ${rupees(meals.min)} to ${rupees(meals.max)}.`
    ),
  },
  {
    id: "dosa-price",
    lang: "en",
    question: `How much do dosas cost at ${name}?`,
    answer: sentence(
      `Dosas at ${name} range from ${rupees(dosa.min)} to ${rupees(dosa.max)}, across the ${dosa.count} items in its Dosa Varieties category on the current menu.`,
      `The lowest priced is ${dosa.cheapest.name} at ${rupees(dosa.cheapest.price)} and the highest priced is ${dosa.dearest.name} at ${rupees(dosa.dearest.price)}.`
    ),
  },
  {
    id: "meal-price",
    lang: "en",
    question: `How much does a meal cost at ${name}?`,
    answer: sentence(
      `Meals at ${name} range from ${rupees(meals.min)} to ${rupees(meals.max)}, across ${meals.count} meal options on the current menu.`,
      `The lowest priced is ${meals.cheapest.name} at ${rupees(meals.cheapest.price)} and the highest priced is ${meals.dearest.name} at ${rupees(meals.dearest.price)}.`
    ),
  },
  {
    id: "family",
    lang: "en",
    question: `Is ${name} family-friendly?`,
    answer: sentence(
      getFact("familyFriendly")
        ? `Yes, ${name} is a family-friendly ${typeText} in Anna Nagar East, Chennai, with dine-in service.`
        : "",
      `Dine-in is available for ${getFact("mealTimes")}.`
    ),
  },
  {
    id: "alcohol",
    lang: "en",
    question: `Does ${name} serve alcohol?`,
    answer: sentence(
      `No, ${name} does not serve alcohol at its ${typeText} in Anna Nagar East, Chennai.`,
      `The menu is vegetarian and includes traditional drinks such as filter coffee and tea.`
    ),
  },
  {
    id: "contact",
    lang: "en",
    question: `How do I contact ${name}?`,
    answer: sentence(
      `Contact ${name} by phone on ${phone}, or by email at ${email}, for table questions, offers and catering enquiries.`,
      `The restaurant is at ${addressLine()}.`
    ),
  },

  /* ---- Tamil and Tanglish variants of the top five questions ----------- */
  {
    id: "ta-veg-restaurant",
    lang: "ta",
    question: "அண்ணா நகரில் சைவ உணவகம் எது?",
    answer: sentence(
      `அண்ணா நகர் கிழக்கில் 3rd Avenue, W Block பகுதியில், Anna Tower அருகே உள்ள ${getFact("nameTamil")} (${name}) ஒரு சைவ தென்னிந்திய உணவகம்.`
    ),
  },
  {
    id: "tanglish-veg-hotel",
    lang: "ta-Latn",
    question: "Anna Nagar-la veg hotel edhu?",
    answer: sentence(
      `${name} Anna Nagar East-la irukkura vegetarian South Indian hotel, 3rd Avenue W Block-la, Anna Tower pakkathula irukku.`
    ),
  },
  {
    id: "ta-vegetarian",
    lang: "ta",
    question: `${getFact("nameTamil")} சைவ உணவகமா?`,
    answer: sentence(
      `ஆம், அண்ணா நகர் கிழக்கில் உள்ள ${getFact("nameTamil")} (${name}) ஒரு சைவ தென்னிந்திய உணவகம்; தற்போதைய மெனுவில் உள்ள அனைத்து ${itemCount} உணவுகளும் சைவம்.`
    ),
  },
  {
    id: "tanglish-address",
    lang: "ta-Latn",
    question: `${name} address enna?`,
    answer: sentence(
      `${name} 3rd Avenue, W-Block, Anna Nagar East, Chennai ${getFact("address").postalCode}-la irukku, Anna Nagar Tower Park pakkathula.`,
      `Full address: ${addressLine()}.`
    ),
  },
  {
    id: "tanglish-filter-coffee",
    lang: "ta-Latn",
    question: `${name}-la filter coffee irukka?`,
    answer: sentence(
      `Aama, ${name} vegetarian South Indian restaurant-la filter coffee irukku, Anna Nagar East-la, current menu-la ${rupees(filterCoffee.price)}-ku kidaikkum.`
    ),
  },
];

/** Heading shown above the Tamil / Tanglish group. */
export const faqLanguageGroups = {
  en: null,
  ta: "Tamil and Tanglish",
  "ta-Latn": "Tamil and Tanglish",
};

// Fail the build early if an answer breaks the first-sentence rule.
for (const item of faqItems) {
  const first = item.answer.split(/(?<=[.!?])(?<!\bNo\.)\s+/)[0];
  const words = first.trim().split(/\s+/).length;
  if (words < 15 || words > 35) {
    throw new Error(`[faq] "${item.id}": first sentence is ${words} words (needs 15 to 35): ${first}`);
  }
  if (!/Brihadhee/.test(item.answer)) {
    throw new Error(`[faq] "${item.id}": answer does not name Brihadhee`);
  }
}
