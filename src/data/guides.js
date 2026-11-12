/**
 * Informational guides (P1): /guides/what-are-nellai-meals/.
 *
 * Each question section opens with an answer-first paragraph (15 to 60 words,
 * naming Brihadhee; checked by scripts/aeo-lint.mjs), then goes deeper. The
 * question headings are claimed with claimQuestion() so no other route can ask
 * them as a Q&A (one Q&A per route, src/lib/answers.js).
 *
 * Two kinds of statement live here, kept apart on purpose:
 *  - general culinary background about Tirunelveli food (what sodhi or ulundhu
 *    kali is), written as general knowledge, never as a Brihadhee claim;
 *  - Brihadhee facts (dishes, prices, hours, address), always computed from
 *    menu-canonical.ts and entity-truth.ts.
 * Copy may contain contextual links as [anchor](/path/) (src/lib/inline-links.js).
 */
import { getFact, addressLine, openingTimes } from "./entity-truth.ts";
import { ROUTES } from "./site.js";
import { claimQuestion, list } from "../lib/answers.js";
import { category, allItems, rupees } from "../lib/menu-facts.js";
import { cateringEnabled, guests, liveCounters, corporate } from "./catering.js";
import { CATERING_DIET } from "../../config/seo-gates.ts";

const name = getFact("name");
const { open: OPEN, close: CLOSE, range: HOURS } = openingTimes();
const item = (n) => {
  const hit = allItems.find((i) => i.name === n);
  if (!hit) throw new Error(`[guides] menu item "${n}" not found in menu-canonical.ts`);
  return hit;
};
const lc = (s) => s.replace(/\.$/, "").replace(/^[A-Z]/, (c) => c.toLowerCase());
const num = (n) => n.toLocaleString("en-IN");

const sodhiMeals = item("Nellai Special Sodhi Meals");
const kali = item("Karuppatti Ulundhu Kali");
const idiyappamSodhi = item("Idiyappam Sodhi");
const sodhiIdly = item("Sodhi Idly");
const poppers = item("Karaikudi Paneer Poppers");
const idiyappam = category("idiyappam");
const idiCoconut = item("Idiyappam Coconut Milk");
const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const countWord = (n) => NUMBER_WORDS[n] ?? String(n);

const PATH = ROUTES.nellaiGuide;
const q = (text) => claimQuestion(PATH, text);

export const nellaiGuide = {
  path: PATH,
  published: "2026-11-12",
  title: "What Are Nellai Meals? Sodhi, Ulundhu Kali, Tirunelveli Food",
  description: `What are Nellai meals? A guide to sodhi, ulundhu kali, idiyappam and Tirunelveli food, and where to eat a Nellai meal in Chennai at ${name}.`,
  h1: "What Are Nellai Meals? A Guide to Sodhi, Ulundhu Kali and Tirunelveli Food",
  intro: `Nellai meals are Tirunelveli-style vegetarian lunches from the far south of Tamil Nadu, built around sodhi, a coconut milk stew, and finished with ulundhu kali. This guide explains each dish, what Tirunelveli food is known for, and where ${name} serves it in Anna Nagar, Chennai.`,
  sections: [
    {
      id: "what-are-nellai-meals",
      title: q("What Are Nellai Meals?"),
      answer: `Nellai meals are Tirunelveli-style vegetarian lunches served on a banana leaf: rice with sambar, rasam, kootu and poriyal, built around sodhi, a coconut milk stew, and finished with ulundhu kali. In Chennai, ${name} serves them as the [${sodhiMeals.name}](${ROUTES.lunch}) for ${rupees(sodhiMeals.price)}.`,
      paras: [
        "Nellai is the short, everyday name for Tirunelveli, the district in the far south of Tamil Nadu, and a Nellai meal is the lunch its homes and wedding halls are known for. The idea is the same as any South Indian banana-leaf meal, with rice at the centre and a run of curries around it, but the flavours lean on coconut, gentle spice and palm jaggery rather than heat.",
        `At ${name} the plate is the ${sodhiMeals.name}: ${lc(sodhiMeals.description)}. It is served for lunch from ${OPEN}, every day, at the 100% pure vegetarian restaurant in Anna Nagar East, alongside simpler Tamil Nadu meals for a lighter lunch.`,
      ],
    },
    {
      id: "what-is-sodhi",
      title: q("What Is Sodhi?"),
      answer: `Sodhi is a Tirunelveli-style stew of vegetables simmered in coconut milk, mildly spiced with green chilli and ginger and finished with lemon. ${name} serves it in the ${sodhiMeals.name}, with idiyappam as ${idiyappamSodhi.name} (${rupees(idiyappamSodhi.price)}) and with idly as ${sodhiIdly.name} (${rupees(sodhiIdly.price)}).`,
      paras: [
        "Sodhi is gentle rather than fiery. The coconut milk carries the flavour, and the sourness comes from lemon squeezed in at the end, not from tamarind as in a kuzhambu. In Tirunelveli it is a celebration dish, traditionally part of wedding feasts, and it is eaten with rice, idiyappam or idly.",
        "Because it is mild, sodhi works well next to something sharper, which is why a Nellai meal sets it beside sambar, rasam and a pickle. On its own with soft idiyappam it makes a complete, light meal at any time of the day the kitchen is open.",
      ],
    },
    {
      id: "what-is-ulundhu-kali",
      title: q("What Is Ulundhu Kali?"),
      answer: `Ulundhu kali is a soft, thick sweet of black urad dal cooked with karuppatti, the dark palm jaggery of southern Tamil Nadu. ${name} serves ${kali.name} for ${rupees(kali.price)} on its own, and as part of the ${sodhiMeals.name} at its restaurant in Anna Nagar East.`,
      paras: [
        "Kali means a dish cooked and stirred until it holds together, and ulundhu is urad dal, the same lentil used in idly and dosa batter. Cooked with karuppatti, made from the sap of the palmyra trees that grow across the dry south of Tamil Nadu, it turns deep brown and tastes of caramel and roasted lentils, and it is traditionally eaten with a little gingelly oil.",
        "On a Nellai meal it is the sweet, served with the rice and curries, so there is something rich to balance the sour rasam and the cooling buttermilk.",
      ],
    },
    {
      id: "tirunelveli-cuisine",
      title: q("What Is Tirunelveli Cuisine Known For?"),
      answer: `Tirunelveli cuisine is known for coconut-rich vegetarian dishes such as sodhi, palm jaggery sweets such as ulundhu kali, and the famous Tirunelveli halwa. In Chennai, ${name} serves the first two at its 100% pure vegetarian restaurant in Anna Nagar East.`,
      paras: [
        "The district sits between the Western Ghats and the sea, and its cooking reflects both: coconut in stews and kootu, palm jaggery from the palmyra trees of the dry plains, and a preference for gentle, layered flavours over heavy spice.",
        `Tirunelveli halwa, a glossy wheat halwa, is the sweet the town is famous for, but it is not on ${name}'s menu. The restaurant's Nellai dishes are the sodhi meal, ulundhu kali and sodhi with idiyappam or idly, served next to dishes from Karaikudi, further north in Chettinad, such as ${poppers.name} (${rupees(poppers.price)}).`,
      ],
    },
    {
      id: "idiyappam-pairings",
      title: q("What Goes Best with Idiyappam?"),
      answer: `Idiyappam goes well with sweetened coconut milk, with sodhi, or chopped and tossed as kothu idiyappam with lemon or tomato. ${name} serves it ${countWord(idiyappam.count)} ways, from ${idiCoconut.name} (${rupees(idiCoconut.price)}) to ${idiyappamSodhi.name} (${rupees(idiyappamSodhi.price)}), at its pure vegetarian restaurant in Anna Nagar East.`,
      paras: [
        "Idiyappam, or string hoppers, are steamed nests of fine rice noodles, light enough to soak up a stew. Sodhi is the classic Tirunelveli pairing; coconut milk with a little sugar is the gentlest; and kothu idiyappam, the strands chopped and tossed on a hot griddle, turns them into a meal of their own.",
      ],
      dishes: idiyappam.items.map((i) => ({ name: i.name, price: rupees(i.price), note: i.description })),
    },
    {
      id: "where-to-eat",
      title: "Where to Eat Nellai Meals in Chennai",
      answer: `${name} serves Nellai meals at ${addressLine()}, near Anna Nagar Tower Park. It is open every day from ${HOURS}, and lunch starts at ${OPEN}.`,
      paras: [
        `The restaurant is 100% pure vegetarian: no meat, egg or fish is cooked in its kitchen, and alcohol is not served. That matters for a Nellai meal, which is vegetarian by tradition, and it makes the restaurant an easy choice for families, office teams and anyone eating vegetarian for a festival or a vow.`,
        `Lunch is the usual way in, but sodhi is also on the menu at dinner as ${idiyappamSodhi.name} and ${sodhiIdly.name}, so you can try it after work as well. Groups can pre-book a table on ${list(getFact("bookingLinks").map((b) => b.label))}, and walk-in diners get ${getFact("offers").find((o) => o.id === "walk-in")?.description.replace(/ for walk-in dine-in$/, "") ?? "a discount"}.`,
        `See every lunch dish and price on the [lunch and Nellai meals page](${ROUTES.lunch}), check the [full menu with prices](${ROUTES.menu}), or [book a table](${ROUTES.book}) for a family lunch. For dinner, the kitchen also serves [build-your-own dosa](${ROUTES.dosa}) and [Paanai Parotta until ${CLOSE}](${ROUTES.dinner}).`,
      ],
    },
    ...(cateringEnabled && guests
      ? [
          {
            id: "nellai-catering",
            title: "Nellai Food at Your Function",
            answer: `${name}'s event catering brings Nellai cooking to functions across Chennai for ${num(guests.min)} to ${num(guests.max)} guests, with live counters for ${list(liveCounters)}.`,
            paras: [
              `See [${CATERING_DIET} event catering in Chennai](${ROUTES.eventCatering}) for weddings, birthdays and family functions, where one team handles menu planning, cooking, serving and setup.` +
                (corporate
                  ? ` Offices can add a weekly Nellai Special Sodhi Meals day through [corporate catering](${ROUTES.corporateCatering}), which serves more than ${num(corporate.dailyCovers)} people every day.`
                  : ""),
            ],
          },
        ]
      : []),
  ],
};
