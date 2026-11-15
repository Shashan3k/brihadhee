/** Parotta dining guide. Names, descriptions and prices come from the approved
 * menu; general restaurant questions remain on their existing owning routes. */
import { category, summarise, rupees, priceRange } from "../lib/menu-facts.js";
import { getFact } from "./entity-truth.ts";
import { ROUTES } from "./site.js";
import { qa, qaRoute } from "../lib/answers.js";

export const parottaDishes = summarise([
  ...category("parotta").items.filter((dish) => /parotta/i.test(dish.name)),
  ...category("starters").items.filter((dish) => /parotta/i.test(dish.name)),
]);
const dish = (name) => {
  const match = parottaDishes.items.find((item) => item.name === name);
  if (!match) throw new Error(`Missing approved parotta dish: ${name}`);
  return match;
};
const paanai = dish("Paanai Parotta");
const kothu = dish("Special Kothu Parotta");
const salna = dish("Parotta Salna (2 pcs)");
const madurai = dish("Madurai Salna Parotta");
export const parottaLunchCombo = category("combos").items.find((item) => item.name === "Kothu Parotta & Lemon Kothu Idiyappam Combo");
const lower = (text) => text.charAt(0).toLowerCase() + text.slice(1);

export const parottaPage = {
  path: ROUTES.parotta,
  title: "Vegetarian Parotta in Anna Nagar | Brihadhee Chennai",
  description: "Explore Paanai Parotta, veg kothu parotta and vegetarian salna at Brihadhee, Anna Nagar East. See menu prices, daily hours and directions near Anna Tower.",
  h1: "Vegetarian Parotta in Anna Nagar",
  intro: `Brihadhee serves vegetarian parotta on ${getFact("street")}, Chennai, near ${getFact("landmarks")[0]}. Choose from ${paanai.name}, ${kothu.name}, salna parotta and more. Compare the ${parottaDishes.count} dishes below, priced ${priceRange(parottaDishes)} before GST.`,
  faq: qaRoute(ROUTES.parotta, [
    qa("Where can I get vegetarian parotta in Anna Nagar?",
      `Brihadhee serves vegetarian parotta on 3rd Avenue in Anna Nagar East, Chennai, near ${getFact("landmarks")[0]}. The menu includes ${paanai.name}, ${kothu.name} and parotta with vegetarian salna.`),
    qa("Does Brihadhee serve parotta?",
      `Yes. Brihadhee lists ${parottaDishes.count} vegetarian parotta dishes, priced ${priceRange(parottaDishes)} before GST. These include ${paanai.name}, ${kothu.name}, salna parotta and the Madras Bhel Parotta starter. Ask the restaurant about availability when you visit.`),
    qa("Where can I get Paanai Parotta in Chennai?",
      `Brihadhee in Anna Nagar East, Chennai, lists ${paanai.name} (claypot parotta) for ${rupees(paanai.price)} before GST. The restaurant is near ${getFact("landmarks")[0]}.`),
    qa("What is Paanai Parotta at Brihadhee?",
      `At Brihadhee, ${paanai.name} is ${lower(paanai.description)} It costs ${rupees(paanai.price)} before GST. For salna served alongside parotta, choose ${salna.name} or ${madurai.name}.`),
    qa("Where can I get veg kothu parotta in Anna Nagar?",
      `Brihadhee in Anna Nagar East serves ${kothu.name} for ${rupees(kothu.price)} before GST. It is ${lower(kothu.description)} The restaurant menu is vegetarian.`),
    qa("Does Brihadhee serve parotta with vegetarian salna?",
      `Yes. Brihadhee serves ${salna.name} for ${rupees(salna.price)} and ${madurai.name} for ${rupees(madurai.price)}, both with vegetarian salna. ${paanai.name} has salna layered into the pot with paneer and mushroom. Prices exclude GST.`),
  ]),
};
