/**
 * /llms.txt: a plain-text, citation-friendly summary of CONFIRMED facts.
 * Generated at build time from src/data/facts.js (confirmed facts only),
 * menu.json (computed prices) and, for catering, the gated values in
 * src/data/catering.js, so it can never state more than the pages do.
 * Pending facts (hours, price range per person, rating) are absent.
 */
import { site } from "../data/site.js";
import { getFact, addressLine, landmarkSentence } from "../data/facts.js";
import { faqItems } from "../data/faq.js";
import { categories, priceRange, itemCount, allVegetarian } from "../lib/menu-facts.js";
import {
  cateringEnabled,
  opening,
  events,
  formats,
  guests,
  serviceAreas,
  contact as cateringContact,
  faqs as cateringFaqs,
} from "../data/catering.js";

const a = getFact("address");
const name = getFact("name");
const entity = cateringEnabled
  ? `${getFact("type")} with a catering service`
  : getFact("type");

const lines = [];
const push = (...l) => lines.push(...l);

push(`# ${name}`, "");
push(
  `> ${name} (${getFact("nameTamil")}) is a ${entity} at W Block, Anna Nagar East, Chennai ${a.postalCode}, near Anna Tower and 3rd Avenue.`,
  ""
);

push("## Facts", "");
push(`- Name: ${name}`);
push(`- Type: ${entity}`);
push(`- Cuisine: ${getFact("cuisine")}`);
push(`- Address: ${addressLine()}`);
push(`- Landmarks: ${landmarkSentence()}`);
push(`- Phone and WhatsApp: ${getFact("phone")}`);
push(`- Email: ${getFact("email")}`);
push(`- Meal times: ${getFact("mealTimes")}`);
push(`- Dine-in: ${getFact("dineIn") ? "yes" : "no"}`);
push(`- Family-friendly: ${getFact("familyFriendly") ? "yes" : "no"}`);
push(`- Alcohol: ${getFact("alcohol")}`);
push(`- Known for: ${getFact("knownFor").join(", ")}`);
push(`- Menu: ${itemCount} items${allVegetarian ? ", all vegetarian" : ""}`);
push("");

push("## Pages", "");
push(`- [Home](${site.url}/): vegetarian South Indian restaurant in Anna Nagar East, with FAQ and location`);
push(`- [Menu and prices](${site.url}/menu/): every dish with its price, by category`);
push(`- [Location](${site.url}/#visit): address, landmarks and map`);
push(`- [FAQ](${site.url}/#faq): short answers about the restaurant`);
if (cateringEnabled) {
  push(`- [Catering](${site.url}/catering/): vegetarian South Indian catering from the Anna Nagar East kitchen`);
}
push("");

push("## Menu price ranges", "");
for (const c of categories) push(`- ${c.name}: ${priceRange(c)} (${c.count} items)`);
push("");

push("## Restaurant questions", "");
for (const f of faqItems.filter((i) => i.lang === "en")) push(`- ${f.question} ${f.answer}`);
push("");

if (cateringEnabled) {
  push("## Catering", "");
  if (opening) push(opening, "");
  if (events.length) push(`- Events: ${events.map((e) => e.label).join(", ")}`);
  if (formats.length) push(`- Formats: ${formats.map((f) => f.label).join(", ")}`);
  if (guests) push(`- Guests: ${guests.range.replace(/^Brihadhee caters for /, "")}`);
  if (serviceAreas.length) push(`- Areas served: ${serviceAreas.join(", ")}`);
  if (cateringContact.phone) push(`- Catering phone: ${cateringContact.phone}`);
  if (cateringFaqs.length) {
    push("", "### Catering questions", "");
    for (const f of cateringFaqs) push(`- ${f.question} ${f.answer}`);
  }
  push("");
}

export function GET() {
  return new Response(lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
