/**
 * /llms.txt: a plain-text, citation-friendly summary of CONFIRMED facts.
 * Generated at build time from src/data/site.js and (for catering) from the
 * gated values in src/data/catering.js, so it can never state more than the
 * pages do. Opening hours are intentionally absent until verified.
 */
import { site, hasHours } from "../data/site.js";
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

const a = site.address;
const address = `${a.line1}, ${a.line2}, ${a.city}, ${a.state} ${a.postalCode}`;
const entity = cateringEnabled
  ? "a vegetarian South Indian restaurant with a catering service"
  : "a vegetarian South Indian restaurant";

const lines = [];
const push = (...l) => lines.push(...l);

push(`# ${site.name}`, "");
push(
  `> ${site.name} (${site.nameTamil}) is ${entity} at W Block, Anna Nagar East, Chennai ${a.postalCode}, near Anna Tower and 3rd Avenue.`,
  ""
);

push("## Facts", "");
push(`- Name: ${site.name}`);
push(`- Type: ${entity}`);
push(`- Cuisine: Vegetarian South Indian`);
push(`- Address: ${address}`);
push(`- Landmarks: ${site.landmarks.join("; ")}`);
if (site.contact.phone) push(`- Phone: ${site.contact.phone}`);
if (site.contact.email) push(`- Email: ${site.contact.email}`);
if (hasHours) push(`- Hours: ${site.hours.summary}`);
push(`- Known for: customizable dosas, traditional filter coffee, banana-leaf meals`);
push("");

push("## Pages", "");
push(`- [Home and menu](${site.url}/): vegetarian South Indian restaurant in Anna Nagar, with the full menu`);
push(`- [Menu](${site.url}/#menu): dosas, idly, Tamil Nadu meals, parotta, beverages`);
push(`- [Location](${site.url}/#visit): address, landmarks and map`);
push(`- [FAQ](${site.url}/#faq): short answers about the restaurant`);
if (cateringEnabled) {
  push(`- [Catering](${site.url}/catering/): vegetarian South Indian catering from the Anna Nagar East kitchen`);
}
push("");

if (site.faqs.length) {
  push("## Restaurant questions", "");
  for (const f of site.faqs) push(`- ${f.question} ${f.answer}`);
  push("");
}

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
