/**
 * Content for the restaurant pages (home, /menu/dosa/, /menu/nellai-meals/,
 * /veg-dinner-anna-nagar/), following the on-page SEO blueprint of 2026-11-11:
 * one H1, title <= 60 characters, meta description <= 155 characters (both
 * enforced by scripts/check-seo.mjs), and answer-first copy under every H2 and
 * H3: the first sentence answers the heading.
 *
 * Every price, count and list is computed from menu-canonical.ts
 * (src/lib/menu-facts.js); every fact comes from entity-truth.ts. Q&A arrays feed
 * BOTH the visible Q&A and the FAQPage JSON-LD, and qa() enforces the
 * answer-first rules (src/lib/answers.js). No "best" claims in copy (question
 * headings only); no competitor names; lunch and dinner only.
 */
import { getFact, factOr, openingTimes, monthYear, RESTAURANT_DIET as PV, FACTS } from "./entity-truth.ts";
import { ROUTES, href, telHref } from "./site.js";
import { cateringEnabled, corporate, corporatePage, guests, liveCounters } from "./catering.js";
import { qa, qaRoute, list } from "../lib/answers.js";
import { taDosa, taNellai } from "./faq-ta.js";
import { CATERING_DIET, CATERING_MIN_GUESTS, MEAL_FRAMING } from "../../config/seo-gates.ts";
import { category, findItems, rupees, priceRange, summarise, allItems, byo, filterCoffee, BYO_DEFINITION, menuNotes, customizedLabel } from "../lib/menu-facts.js";

const name = getFact("name");
const STREET = getFact("street");
const postal = getFact("address").postalCode;
const landmark = getFact("landmarks")[0];
const phone = getFact("phone");
const recipeStory = getFact("recipeStory");
const { open: OPEN, close: CLOSE, range: HOURS } = openingTimes();
/* "Last checked" dates on fact tables: the verification date of the facts shown, never the build date. */
const MENU_CHECKED = "2026-11-11"; // MENU_SOURCE in menu-canonical.ts: new menu.pdf received 2026-11-11
const HOURS_CHECKED = FACTS.hours.verifiedOn;
const offers = getFact("offers");
const offer = (id) => {
  const o = offers.find((x) => x.id === id);
  if (!o) throw new Error(`[pages] offer "${id}" missing in entity-truth.ts`);
  return o;
};
const item = (n) => {
  const hit = allItems.find((i) => i.name === n);
  if (!hit) throw new Error(`[pages] menu item "${n}" not found in menu-canonical.ts`);
  return hit;
};
const lc = (s) => s.replace(/\.$/, "").replace(/^[A-Z]/, (c) => c.toLowerCase());
const num = (n) => n.toLocaleString("en-IN");
const dish = (i) => ({ name: i.name, price: rupees(i.price), note: i.description });
const bookingApps = "Swiggy Dineout, EazyDiner or District";
const eazyDiner = getFact("bookingLinks").find((b) => b.label === "EazyDiner");

/* ---- Shared numbers --------------------------------------------------- */
const dosa = category("dosa");
const lunch = category("lunch");
const combos = category("combos");
const idiyappam = category("idiyappam");
const paanai = item("Paanai Parotta");
const combo = item("Kothu Parotta & Lemon Kothu Idiyappam Combo");
const sodhiMeals = item("Nellai Special Sodhi Meals");
const idiyappamSodhi = item("Idiyappam Sodhi");
const sodhiIdly = item("Sodhi Idly");
const kali = item("Karuppatti Ulundhu Kali");
const poppers = item("Karaikudi Paneer Poppers");
const kothu = item("Special Kothu Parotta");
const kothuChapathi = item("Special Kothu Chapathi");
const idiCoconut = item("Idiyappam Coconut Milk");
const idiLemon = item("Lemon Kothu Idiyappam");
const idiTomato = item("Tomato Kothu Idiyappam");
const kothuIdiyappam = idiyappam.items.filter((i) => /kothu/i.test(i.name));
const dinnerParotta = summarise(findItems(/parotta/i).filter((i) => i.category !== combos.name));
const tnMeals = summarise(lunch.items.filter((i) => /TN Meals/.test(i.name)));
const sodhiParts = sodhiMeals.description.replace(/\.$/, "");
const batters = byo.steps.find((s) => s.name === "Batter").options;
const batterBy = (re) => {
  const b = batters.find((o) => re.test(o.note ?? ""));
  if (!b) throw new Error(`[pages] no Build Your Own Dosa batter matches ${re}`);
  return b;
};
const batterRange = priceRange(summarise(batters));
const dearestSuggestion = [...byo.suggestions].sort((a, b) => b.price - a.price)[0];
const suggestionRange = `${rupees(byo.suggestionMin)} to ${rupees(byo.suggestionMax)}`;
const counterHasDosa = liveCounters.some((c) => /build your own dosa/i.test(c));
/** Cheapest option of a Build Your Own Dosa step ("Topping", "Stuffing", "Garnish"), as "₹15". */
const stepFrom = (step) => {
  const st = byo.steps.find((s) => s.name === step);
  if (!st) throw new Error(`[pages] Build Your Own Dosa step "${step}" not found in menu-canonical.ts`);
  return rupees(Math.min(...st.options.map((o) => o.price)));
};

/* ---- Home / ------------------------------------------------------------- */
export const homePage = {
  path: ROUTES.home,
  title: `${name} Anna Nagar | Pure Veg South Indian Dosa Restaurant`,
  description: `${name}, Anna Nagar East: pure veg South Indian lunch and dinner, customized dosa and Nellai meals. Open ${OPEN}–${CLOSE} daily. See menu or book a table.`,
  /* The hero combines the restaurant name and category in one H1. */
  h1: "Pure Veg South Indian Restaurant in Anna Nagar East",
  glance: [
    ["Open", `${HOURS} daily · ${MEAL_FRAMING}`],
    ["Food", "100% pure veg South Indian"],
    ["Location", `${STREET}, near ${landmark}`],
    ["Famous for", getFact("knownFor").join(", ")],
  ],
  /* "Customized Dosa" replaces "Build your own dosa" on the home page (client direction,
     2026-11-13). The offer is the same; /menu/dosa/ explains it. */
  byo: {
    id: "home-dosa",
    eyebrow: "Signature",
    title: "Customized Dosa, Your Way",
    lead: `Pick one of ${byo.batterCount} batters (${batterRange}) and choose your toppings, filling and roast. The kitchen cooks your dosa to order. You can also order one of ${byo.suggestionCount} chef's combinations for ${suggestionRange}.`,
    links: [{ label: "How customized dosa works", href: href(ROUTES.dosa), primary: true }],
    image: { name: "dosa", alt: "Golden dosa with visible filling and three bowls of sides", caption: "A dosa from the Brihadhee kitchen" },
  },
  lunch: {
    id: "home-lunch",
    eyebrow: "Lunch",
    title: "Lunch: Nellai Meals and Tamil Home-Style Food",
    lead: `${name} serves lunch from ${OPEN} every day: the ${sodhiMeals.name} (${rupees(sodhiMeals.price)}), a Tirunelveli-style banana-leaf meal with sodhi (a coconut milk stew) and ulundhu kali (a palm-jaggery sweet), and Tamil Nadu meals (${priceRange(tnMeals)}), all ${recipeStory}. New to Tirunelveli food? Read [what Nellai meals, sodhi and ulundhu kali are](${ROUTES.nellaiGuide}).`,
    links: [{ label: "Lunch and Nellai meals", href: href(ROUTES.lunch), primary: true }],
    image: { name: "meals", alt: "Nellai-style South Indian lunch with rice and sides on a banana leaf at Brihadhee", caption: "Lunch on a banana leaf" },
    tint: true,
  },
  dinner: {
    id: "home-dinner",
    eyebrow: "Dinner",
    title: `Dinner Until ${CLOSE}`,
    lead: `For dinner at ${name}, choose customized dosa, ${paanai.name} (${rupees(paanai.price)}; parotta and salna slow-cooked in a sealed pot), veg kothu parotta, idiyappam or ${poppers.name}, with filter coffee to finish. The restaurant closes at ${CLOSE} daily.`,
    links: [
      { label: "Explore the dinner menu", href: href(ROUTES.dinner), primary: true },
      { label: "Parotta varieties and prices", href: href(ROUTES.parotta) },
    ],
  },
  coffeeBar: {
    id: "coffee-bar",
    title: "Brihadhee Coffee Bar, Anna Nagar",
    lead: `Find South Indian filter coffee at ${name}'s Coffee Bar near ${landmark} in Anna Nagar East, open with the restaurant from ${HOURS} daily. We brew it with a traditional filter and serve it during lunch and dinner; filter coffee costs ${rupees(filterCoffee.price)}. ${menuNotes.gst}`,
    dishes: category("beverages").items.map(dish),
    links: [
      { label: "See the drinks menu", href: `${href(ROUTES.menu)}#beverages`, primary: true },
      { label: "Directions to Brihadhee", href: `${href(ROUTES.about)}#find-us` },
      ...(corporatePage?.coffeeBar
        ? [{ label: "Coffee bar for office events", href: `${href(ROUTES.corporateCatering)}#${corporatePage.coffeeBar.id}` }]
        : []),
    ],
    tint: true,
  },
  catering:
    cateringEnabled && corporate && guests
      ? {
          id: "home-catering",
          eyebrow: "Catering",
          title: "Catering for Offices and Events",
          lead: `${name}'s kitchen caters ${CATERING_DIET} food for offices and events across Chennai: corporate catering for more than ${num(corporate.dailyCovers)} meals a day, end-to-end event catering for ${num(guests.min)} to ${num(guests.max)} guests, and [small function catering from ${CATERING_MIN_GUESTS} guests](${ROUTES.smallFunctions}). Event management companies can also book ${name} as a [catering partner for event planners](${ROUTES.plannerPartner}).`,
          tint: true,
          cards: true,
          items: [
            {
              title: "Corporate catering for offices",
              text: `Daily ${CATERING_DIET} office meals for more than ${num(corporate.dailyCovers)} people a day, cooked in the same kitchen as the restaurant.`,
              link: { label: "Corporate catering", href: href(ROUTES.corporateCatering) },
            },
            {
              title: "End-to-end event catering",
              text: `Menu planning, cooking, serving and setup can be discussed for weddings, birthdays and family functions of ${num(guests.min)} to ${num(guests.max)} guests. Live counter options include ${list(liveCounters.map(customizedLabel))}.`,
              link: { label: "Event catering", href: href(ROUTES.eventCatering) },
            },
            {
              title: `Get a catering quote`,
              text: `Share the event type, Chennai venue area, date if known, and a guest count from ${CATERING_MIN_GUESTS}. Include any menu or serving needs so the team can discuss what to quote.`,
              link: { label: "Catering quote", href: href(ROUTES.cateringQuote) },
            },
          ],
        }
      : null,
};

/* ---- /menu/dosa/ (was /best-dosa-parotta-anna-nagar/, 301) ------------- */
const CLASSIC_DOSAS = [
  { title: "Kal Dosa", item: item("Kal Dosa (2 pcs)") },
  { title: "Ghee Roast", item: item("Ghee Roast") },
  { title: "Ghee Podi Dosa", item: item("Ghee Podi Dosa") },
  { title: "Rava Dosa", item: item("Rava Dosa") },
  { title: "Ghee Masala Dosa", item: item("Ghee Masala Dosa") },
  { title: "Ragi Dosa", batter: batterBy(/ragi/i), grain: "ragi" },
  { title: "Navadhaniya Dosa", batter: batterBy(/navadhan/i), grain: "navadhaniya (nine-grain)" },
  { title: "Madurai Malli Dosa", item: item("Madurai Malli Dosa") },
];
const ghee = item("Ghee Roast");
const gheePodi = item("Ghee Podi Dosa");
const plain = item("Plain Dosa");
const popularDosaAdditions = byo.steps.flatMap(({ options }) =>
  options.filter(({ name }) => ["Small Onion", "Cheese", "Paneer Chettinadu", "Mushroom Truffle"].includes(name))
);
const classicNames = new Set(CLASSIC_DOSAS.filter((d) => d.item).map((d) => d.item.name));
const otherDosas = dosa.items.filter((i) => !classicNames.has(i.name));

export const dosaPage = {
  path: ROUTES.dosa,
  title: `Build Your Own Dosa in Chennai | ${name}, Anna Nagar`,
  description: `Choose your batter, roast, fillings and podi, and we cook your dosa your way. Build your own dosa at ${name}, Anna Nagar. Lunch and dinner daily.`,
  h1: `Build Your Own Dosa at ${name}, Anna Nagar`,
  /* Lead with the location and ordering experience for first-time visitors. */
  intro: `At ${name} in Anna Nagar East, Chennai, you can build your own dosa by choosing the batter, podi and toppings, filling and roast. The kitchen cooks it to order and serves it at your table. Visit for lunch or dinner from ${HOURS} every day.`,
  glance: [
    ["Who", `${name}, a ${PV} restaurant in Anna Nagar East`],
    ["Batters", `${byo.batterCount} batters, ${batterRange}`],
    ["Add-ons", `${byo.counts.topping} podis and toppings, ${byo.counts.stuffing} fillings, ${byo.counts.garnish} roasts (ghee, butter or oil)`],
    ["Chef's combinations", `${byo.suggestionCount} builds, ${suggestionRange}`],
    ["Classic dosas", `${dosa.count} on the menu, ${priceRange(dosa)}`],
    ["Hours", `${HOURS} daily, lunch and dinner`],
    ["Location", `${STREET}, Chennai ${postal}`],
  ],
  definition: {
    id: "what-is-byo-dosa",
    title: `What Is Build Your Own Dosa at ${name}?`,
    lead: BYO_DEFINITION,
    items: [
      {
        title: "Classic dosa or build-your-own?",
        text: `At ${name}, a classic dosa, such as the ${item("Ghee Roast").name} or ${item("Ghee Masala Dosa").name}, is a fixed recipe at a fixed price (${dosa.count} on the menu, ${priceRange(dosa)}). A build-your-own dosa starts from a batter and you choose every addition. The ${byo.suggestionCount} chef's combinations sit in between: ready-made builds with a printed price (${suggestionRange}).`,
      },
      {
        title: "How a custom dosa is priced",
        text: `You pay for the batter (${batterRange}) plus each addition you pick: podi and toppings from +${stepFrom("Topping")}, fillings from +${stepFrom("Stuffing")} and a roast from +${stepFrom("Garnish")}. ${menuNotes.gst}`,
      },
      {
        title: "What to tell your server",
        text: `Tell your server your batter, podi and toppings, filling and roast. You can also order ${byo.cheapestSuggestion.name} by name: the menu lists ${list(byo.cheapestSuggestion.build)} at ${rupees(byo.cheapestSuggestion.price)} before GST. The kitchen cooks your dosa to order and brings it to your table. ${menuNotes.prep}`,
      },
    ],
  },
  howItWorks: {
    id: "how-it-works",
    title: `How Do You Build Your Own Dosa at ${name}?`,
    /* Recorded failure (AI-058, 12 Nov): answer engines cited Instagram, not this page. Lead = where + steps + what is included. */
    lead: `You build your own dosa at ${name} on ${STREET}, Chennai, near ${landmark}, daily from ${HOURS}. Choose a batter (${batterRange}), add podi and toppings, pick a filling, then a ghee, butter or oil roast. The kitchen cooks it to order and serves it at your table.`,
    facts: [
      ["Step 1: batter", `${batters.length} batters, ${batterRange}`],
      ...byo.steps.filter((s) => s.name !== "Batter").map((s, i) => [`Step ${i + 2}: ${s.label.toLowerCase()}`, `${s.options.length} options, from +${stepFrom(s.name)} each`]),
      ["What you pay", `The batter plus each add-on you pick. ${menuNotes.gst}`],
      ["How it works", "Mix and match the four choices into one personalised, customizable dosa, cooked to order"],
      ["Where and when", `${STREET}, Chennai ${postal}, near ${landmark}. ${HOURS} daily, lunch and dinner`],
    ],
    checked: MENU_CHECKED,
  },
  combinations: {
    id: "combinations",
    title: "Chef’s Dosa Combinations",
    lead: `${name}'s chef has ${byo.suggestionCount} ready-made builds for ${suggestionRange}, from ${byo.cheapestSuggestion.name} to ${dearestSuggestion.name}; each lists exactly what goes into it.`,
  },
  classics: {
    id: "classic-dosas",
    title: `Which Classic Dosas Does ${name} Serve?`,
    lead: `Besides build-your-own dosa, ${name} serves ${dosa.count} classic dosas from ${rupees(dosa.min)} to ${rupees(dosa.max)}, each a fixed recipe at a fixed price: ${list(CLASSIC_DOSAS.filter((d) => d.item).map((d) => d.item.name))}. Ragi and navadhaniya dosas are made from the build-your-own batters, as described below.`,
    items: [
      ...CLASSIC_DOSAS.map((d) =>
        d.item
          ? { title: d.title, text: `${name}'s ${d.item.name} costs ${rupees(d.item.price)}: ${lc(d.item.description)}.` }
          : {
              title: d.title,
              text: `${name} makes ${d.grain} dosa through Build Your Own Dosa: pick the ${d.batter.name} batter (${d.batter.note}, ${rupees(d.batter.price)}), then add podi, a filling and your roast.`,
            }
      ),
      ...(otherDosas.length
        ? [{ title: "Also on the menu", text: `${name} also serves ${list(otherDosas.map((i) => `${i.name} (${rupees(i.price)})`))}.` }]
        : []),
      ...(popularDosaAdditions.length
        ? [{
            title: "Choose toppings and fillings for your dosa",
            text: `For a customized dosa, start with a batter and choose additions from the [Build Your Own Dosa menu](#how-it-works): ${list(popularDosaAdditions.map((option) => `${option.name} (+${rupees(option.price)})`))}. Choose how you want it roasted and the kitchen will cook your order.`,
          }]
        : []),
    ],
  },
  liveCounter:
    cateringEnabled && guests && counterHasDosa
      ? {
          id: "dosa-live-counter",
          title: "Build-Your-Own Dosa Live Counter at Your Event",
          lead: `${name} brings Build Your Own Dosa to your event as a live counter, run by its own kitchen team, for ${num(guests.min)} to ${num(guests.max)} guests across Chennai. Event management companies can run it under their own brand as a [white-label or co-branded live counter](${ROUTES.plannerPartner}).`,
          links: [{ label: "Event catering", href: href(ROUTES.eventCatering), primary: true }],
          tint: true,
        }
      : null,
  faq: qaRoute(ROUTES.dosa, [
    qa(
      "Where can I build my own dosa in Chennai?",
      `You can build your own dosa at ${name} in Anna Nagar East, Chennai, near ${landmark}. Choose the batter, podi and toppings, filling and roast. The kitchen cooks it to order and serves it at your table.`,
      { id: "which-restaurant-in-anna-nagar-lets-you-customise-your-dosa" }
    ),
    qa(
      "Can customers choose the dosa batter and ingredients?",
      `Yes. ${name} has ${byo.batterCount} batters (${batterRange}) to choose from, plus podi and toppings, fillings and roast options. ` +
        `You can also order one of ${byo.suggestionCount} chef's combinations for ${suggestionRange}.`,
      { id: "can-i-build-my-own-dosa-at-brihadhee" }
    ),
    qa(
      "Do customers cook their own dosa?",
      `No. The ${name} kitchen cooks your dosa to order and brings it to your table. Guests pick the ingredients when they order.`,
      { id: "is-build-your-own-dosa-at-brihadhee-a-self-service-counter" }
    ),
    qa(
      "Which restaurant serves the best dosa in Anna Nagar?",
      `${name} serves ${dosa.count} classic dosas and build-your-own dosa in Anna Nagar East. ` +
        `Try the ${ghee.name} for a crisp dosa, the ${gheePodi.name} for a spiced topping, or choose your own batter and fillings. Dosas are served at lunch and dinner from ${HOURS}.`
    ),
    qa(
      `How much does a dosa cost at ${name}?`,
      `Classic dosas at ${name} cost ${priceRange(dosa)}. ` +
        `A build-your-own dosa costs the batter (${batterRange}) plus each addition, and the chef's combinations cost ${suggestionRange}, before ${menuNotes.gst.replace(/^Prices exclude /, "").replace(/\.$/, "")}.`
    ),
    qa(
      "What is the difference between ghee roast, paper roast and podi dosa?",
      `At ${name}, the ${ghee.name} (${rupees(ghee.price)}) is a ${lc(ghee.description)}, and the ${gheePodi.name} (${rupees(gheePodi.price)}) is a ${lc(gheePodi.description)}. ` +
        `The menu does not list a separate paper roast; for a plain crisp dosa, order the ${plain.name} (${rupees(plain.price)}), or build one and choose your roast.`,
      { kind: "explain" }
    ),
    ...taDosa,
  ]),
};

/* ---- /menu/nellai-meals/ (was /nellai-meals-south-indian-veg-anna-nagar/, 301) */
export const nellaiPage = {
  path: ROUTES.lunch,
  title: `Veg Lunch & Nellai Meals in Anna Nagar | ${name}`,
  description: `See prices for ${sodhiMeals.name}, Tamil Nadu meals and dine-in lunch combos at ${name}, Anna Nagar East. Lunch starts at ${OPEN} daily.`,
  h1: "Veg Lunch and Nellai Meals in Anna Nagar",
  intro: `${name} serves a ${PV} lunch every day from ${OPEN} on ${STREET}: the ${sodhiMeals.name} (${rupees(sodhiMeals.price)}), a Tirunelveli-style meal, and Tamil Nadu meals, all ${recipeStory}.`,
  glance: [
    ["Who", `${name}, a South Indian vegetarian restaurant in Anna Nagar East`],
    ["Lunch from", `${OPEN}, every day`],
    ["Signature meal", `${sodhiMeals.name}, ${rupees(sodhiMeals.price)}`],
    ["Tamil Nadu meals", `${tnMeals.count} meals, ${priceRange(tnMeals)}`],
    ["Sweet", `${kali.name}, ${rupees(kali.price)}`],
    ["Location", `${STREET}, Chennai ${postal}`],
  ],
  sodhiSection: {
    id: "sodhi-meals",
    title: `What Is in ${name}'s ${sodhiMeals.name}?`,
    lead: `${name}'s ${sodhiMeals.name} (${rupees(sodhiMeals.price)}) are a Tirunelveli (Nellai) banana-leaf lunch served daily from ${OPEN}. The plate has ${lc(sodhiParts)}. Sodhi is a coconut milk stew; ${kali.name} is a sweet made with palm jaggery.`,
    image: { name: "meals", alt: "Rice, papad and small bowls of sides on a banana-leaf plate", caption: "A banana-leaf lunch at Brihadhee" },
    items: [
      {
        title: "Sodhi",
        text: `Sodhi is a Tirunelveli-style coconut milk stew. ${name} serves it in the ${sodhiMeals.name}, as ${idiyappamSodhi.name} (${rupees(idiyappamSodhi.price)}) and as ${sodhiIdly.name} (${rupees(sodhiIdly.price)}). Read [our guide to sodhi and Nellai meals](${ROUTES.nellaiGuide}).`,
      },
      {
        title: kali.name,
        text: `${kali.name} is a Tirunelveli sweet of black urad dal and palm jaggery. It comes with the ${sodhiMeals.name}, or on its own for ${rupees(kali.price)}.`,
      },
      {
        title: "What Comes with the Meal",
        text: `The menu lists ${lc(sodhiParts)}. Compare it with the [other lunch dishes and prices](${ROUTES.menu}#lunch).`,
      },
    ],
  },
  homeStyle: {
    id: "home-style-lunch",
    title: `What Does ${name} Serve for a Tamil Home-Style Lunch?`,
    lead: `${name}'s lunch is ${recipeStory}, served daily from ${OPEN} on ${STREET}: ${tnMeals.count} Tamil Nadu meals (${priceRange(tnMeals)}) and the ${sodhiMeals.name} (${rupees(sodhiMeals.price)}). For a quicker office lunch, ${combos.count} dine-in combos cost ${priceRange(combos)}, at lunch only.`,
    dishes: lunch.items.filter((i) => i.name !== sodhiMeals.name).map(dish),
    tint: true,
    items: [
      {
        title: "Dine-in combos, lunch only",
        text: `${name} serves ${combos.count} dine-in combos at lunch only, ${priceRange(combos)}.`,
        dishes: combos.items.map((i) => ({ name: i.name, price: rupees(i.price) })),
      },
    ],
  },
  family: {
    id: "family-lunch",
    title: "Family and Weekend Group Lunch",
    lead: `${name} is family-friendly and open every day, weekends included, from ${OPEN}. Groups can pre-book a table on ${bookingApps} for ${offer("pre-booking").description.replace(/ when you pre-book a table through .*$/, "")}, and walk-in diners get ${offer("walk-in").description.replace(/ for walk-in dine-in$/, "")}. During Karthigai, see [pure veg meals for Karthigai and Ayyappa mala](${ROUTES.seasonal}). For lunch after a temple visit or a family celebration, see [family dining in Anna Nagar](${ROUTES.familyDining}).`,
    links: [{ label: "Book a table", href: href(ROUTES.book), primary: true }],
  },
  office:
    cateringEnabled && corporate
      ? {
          id: "office-lunch",
          title: "Office Lunch in Anna Nagar",
          lead: `Coming in with colleagues? Walk in for lunch at ${name} on ${STREET}, or [book a table](${ROUTES.book}) for your group. For meals delivered to your workplace, see [corporate catering in Chennai](${ROUTES.corporateCatering}).`,
          tint: true,
        }
      : null,
  booking: {
    id: "lunch-hours",
    title: "Lunch Hours and Table Booking",
    lead: `${name} serves lunch from ${OPEN} every day. The dine-in combos are available at lunch. For the restaurant address, see [directions to Brihadhee](${ROUTES.about}#find-us).`,
    links: [
      { label: "How to book a table", href: href(ROUTES.book), primary: true },
      ...(eazyDiner ? [{ label: "Book on EazyDiner", href: eazyDiner.url, external: true }] : []),
    ],
  },
  faq: qaRoute(ROUTES.lunch, [
    qa(
      `What are Nellai meals at ${name}?`,
      `At ${name}, Nellai meals are the ${sodhiMeals.name} (${rupees(sodhiMeals.price)}): a Tirunelveli-style banana-leaf lunch built around sodhi, a coconut milk stew. ` +
        `It ends with ${kali.name}, a sweet of black urad dal and palm jaggery.`
    ),
    qa(
      "Where can I get Nellai meals in Chennai?",
      `${name} in Anna Nagar East, Chennai, serves the ${sodhiMeals.name} (${rupees(sodhiMeals.price)}) at lunch every day from ${OPEN}. The restaurant is near ${landmark}.`
    ),
    qa(
      "Where can I get a pure veg lunch in Anna Nagar East?",
      `${name} serves a ${PV} lunch in Anna Nagar East every day from ${OPEN}. ` +
        `Choose the ${sodhiMeals.name} (${rupees(sodhiMeals.price)}), ${list(tnMeals.names)} (${priceRange(tnMeals)}), or a lunch-only dine-in combo (${priceRange(combos)}).`
    ),
    qa(
      `Does ${name} have lunch combos?`,
      `Yes. ${name} serves ${combos.count} dine-in combos at lunch only, priced ${priceRange(combos)}. ` +
        `They include the ${combos.cheapest.name} and the ${combo.name}. ${menuNotes.prep}`
    ),
    ...taNellai,
  ]),
};

/* ---- /veg-dinner-anna-nagar/ (new P1 route) ---------------------------- */
export const dinnerPage = {
  path: ROUTES.dinner,
  title: `Veg Dinner in Anna Nagar, Open Till ${CLOSE} | ${name}`,
  description: `Plan a vegetarian dinner at ${name}, Anna Nagar East, with Paanai Parotta, dosa or idiyappam. Open until ${CLOSE} daily. Call ahead if arriving late.`,
  h1: `Vegetarian Dinner in Anna Nagar, Open Till ${CLOSE}`,
  intro: `Plan a ${PV} dinner at ${name} on ${STREET}, near ${landmark}. Choose from customized dosa, ${paanai.name}, veg kothu parotta and idiyappam. The restaurant closes at ${CLOSE} daily.`,
  glance: [
    ["Who", `${name}, a ${PV} restaurant in Anna Nagar East`],
    ["Restaurant hours", `${HOURS} daily`],
    ["Build your own dosa", `${byo.batterCount} batters, ${batterRange}`],
    ["Parotta", `${dinnerParotta.count} dishes, ${priceRange(dinnerParotta)}`],
    ["Idiyappam", `${idiyappam.count} dishes, ${priceRange(idiyappam)}`],
    ["Location", `${STREET}, Chennai ${postal}`],
  ],
  favourites: {
    id: "dinner-favourites",
    title: `What Is on ${name}'s Dinner Menu?`,
    lead: `${name}'s dinner menu centres on build-your-own dosa, ${paanai.name} (${rupees(paanai.price)}; parotta and salna slow-cooked in a sealed pot), veg kothu parotta and idiyappam, served until ${CLOSE} daily. Kothu idiyappam is ${lc(idiLemon.description)} (${rupees(idiLemon.price)}) or ${lc(idiTomato.description)} (${rupees(idiTomato.price)}). See [the full menu and prices](${ROUTES.menu}) for every other dish.`,
    items: [
      {
        title: "Build-Your-Own Dosa",
        text: `Build your own dosa from ${byo.batterCount} batters (${batterRange}), then add podi, a filling and a ghee, butter or oil roast; ${byo.suggestionCount} chef's combinations cost ${suggestionRange}.`,
        link: { label: "How to order a customized dosa", href: href(ROUTES.dosa) },
      },
      {
        title: "Paanai Parotta",
        text: `${name}'s ${paanai.name} costs ${rupees(paanai.price)}: ${lc(paanai.description)}.`,
        link: { label: "Compare our parotta dishes", href: href(ROUTES.parotta) },
      },
      {
        title: "Veg Kothu Parotta & Paneer Kothu Parotta",
        text: `${name}'s veg kothu parotta is the ${kothu.name} (${rupees(kothu.price)}): ${lc(kothu.description)}, so it is also a paneer kothu parotta. The ${kothuChapathi.name} (${rupees(kothuChapathi.price)}) is the same dish made with chapathi.`,
      },
      {
        title: "Idiyappam, Kothu Idiyappam & Idiyappam Sodhi",
        text: `At ${name}, kothu idiyappam is the tossed version of the rice noodle dish. Choose ${idiLemon.name} (${rupees(idiLemon.price)}) for lemon and curry leaves, or ${idiTomato.name} (${rupees(idiTomato.price)}) for tangy tomato masala. For a coconut milk stew, order ${idiyappamSodhi.name} instead.`,
        dishes: idiyappam.items.map((i) => ({ name: i.name, price: rupees(i.price) })),
      },
      {
        title: "Karaikudi Paneer Poppers & Filter Coffee",
        text: `${name}'s ${poppers.name} cost ${rupees(poppers.price)}: ${lc(poppers.description)}. Finish with ${filterCoffee.name} at ${rupees(filterCoffee.price)}.`,
      },
    ],
  },
  family: {
    id: "family-dinner",
    title: "Family and Group Dinners",
    lead: `For dinner with family or friends, check [table booking options](${ROUTES.book}) for your group or see [family dining at ${name}](${ROUTES.familyDining}) for birthday and anniversary meals. Ayyappa devotees can read about [pure veg dining during Karthigai and Ayyappa mala](${ROUTES.seasonal}).`,
    tint: true,
  },
  late: {
    id: "late-dinner",
    title: `Is ${name} Open for Dinner Until ${CLOSE}?`,
    lead: `Yes. ${name} serves dinner every day until ${CLOSE} on ${STREET}, near ${landmark}. If you plan to arrive after 9 PM, call ${phone} to check the kitchen's last order time, and see [directions to the restaurant](${ROUTES.about}#find-us) before you set out.`,
    checked: HOURS_CHECKED,
    links: [{ label: "Call the restaurant", href: telHref }],
  },
  reserve: {
    id: "reserve",
    title: "Reserve a Table",
    lead: `Reserve a dinner table at ${name} on ${bookingApps}, call ${phone}, or walk in; walk-in diners get ${offer("walk-in").description.replace(/ for walk-in dine-in$/, "")}.`,
    links: [
      { label: "How to book a table", href: href(ROUTES.book), primary: true },
      ...(eazyDiner ? [{ label: "Book on EazyDiner", href: eazyDiner.url, external: true }] : []),
    ],
    tint: true,
  },
  faq: qaRoute(ROUTES.dinner, [
    qa(
      `What does ${name} serve with idiyappam?`,
      `${name} in Anna Nagar East serves idiyappam with sweet coconut milk as ${idiCoconut.name} (${rupees(idiCoconut.price)}). For a coconut milk stew, choose ${idiyappamSodhi.name} (${rupees(idiyappamSodhi.price)}). ` +
        `For a fuller plate, order kothu idiyappam: ${list(kothuIdiyappam.map((i) => i.name))} (${priceRange(summarise(kothuIdiyappam))}).`
    ),
    qa(
      `Is ${name} open for dinner after 9 PM?`,
      `Yes. ${name} is open after 9 PM and closes at ${CLOSE} every day. ` +
        `The last-order time is not published; call ${phone} to check before you set out.`
    ),
  ]),
};

/* ---- /whats-new/ (dated freshness page, P1) ------------------------------
 * States the current offer positively. It never names retired services: the
 * hard block in docs/seo/avoid-terms.txt has no exceptions. */
const WHATS_NEW_DATE = "2026-11-12";
const NEW_MONTH = monthYear(WHATS_NEW_DATE);
export const whatsNewPage = {
  path: ROUTES.whatsNew,
  published: WHATS_NEW_DATE,
  title: `What's New at ${name} — ${NEW_MONTH} | Anna Nagar`,
  description: `Build-your-own dosa, Nellai Special Sodhi Meals for lunch, dinner until ${CLOSE}${corporate ? ` and ${num(corporate.dailyCovers)}+ corporate meals a day` : ""}: what's new at ${name}, Anna Nagar.`,
  h1: `What's New at ${name} — ${NEW_MONTH}`,
  intro: `In ${NEW_MONTH}, ${name}, the ${PV} South Indian restaurant in Anna Nagar East, serves lunch and dinner every day from ${HOURS}, with a new menu led by build-your-own dosa.`,
  sections: [
    {
      id: "new-dosa",
      title: "Build Your Own Dosa Leads the New Menu",
      lead: `Build your own dosa now opens ${name}'s menu: pick one of ${byo.batterCount} batters (${batterRange}), add podi and toppings, a filling and a ghee, butter or oil roast, or order one of ${byo.suggestionCount} chef's combinations for ${suggestionRange}.`,
      links: [{ label: "How build your own dosa works", href: href(ROUTES.dosa), primary: true }],
      image: { name: "dosa", alt: "Folded dosa with a visible layer of filling beside bowls of sides", caption: "A dosa from the Brihadhee kitchen" },
    },
    {
      id: "new-lunch",
      title: "Nellai Special Sodhi Meals for Lunch",
      lead: `Lunch at ${name} centres on the ${sodhiMeals.name} (${rupees(sodhiMeals.price)}), a Tirunelveli-style banana-leaf meal built around sodhi, served from ${OPEN} every day alongside Tamil Nadu meals (${priceRange(tnMeals)}).`,
      links: [{ label: "Lunch and Nellai meals", href: href(ROUTES.lunch), primary: true }],
      tint: true,
    },
    {
      id: "new-dinner",
      title: `Dinner Until ${CLOSE}`,
      lead: `${name} serves dinner every day until ${CLOSE}: build-your-own dosa, ${paanai.name} (${rupees(paanai.price)}), veg kothu parotta, idiyappam and ${poppers.name}.`,
      links: [{ label: `Dinner until ${CLOSE}`, href: href(ROUTES.dinner), primary: true }],
    },
    ...(cateringEnabled && corporate
      ? [
          {
            id: "new-corporate",
            title: `Corporate Catering for ${num(corporate.dailyCovers)}+ People a Day`,
            lead: `${name}'s kitchen supplies ${CATERING_DIET} corporate catering for more than ${num(corporate.dailyCovers)} people every day across Chennai: daily office lunches, bulk meals, employee meal programmes and office events.`,
            links: [{ label: "Corporate catering", href: href(ROUTES.corporateCatering), primary: true }],
            tint: true,
          },
        ]
      : []),
    {
      id: "current-hours",
      title: `Open Every Day, ${HOURS}`,
      lead: `${name} is open every day, Monday to Sunday, from ${HOURS}, for lunch and dinner. These are the current hours; listings that show other timings are out of date.`,
      links: [{ label: "Address, timings and contact", href: href(ROUTES.about) }],
    },
    {
      id: "new-quote",
      title: "Quotes and WhatsApp on the Website",
      lead: `Use the ${name} catering quote form for functions from ${CATERING_MIN_GUESTS} guests. For tables and other dining enquiries, WhatsApp the restaurant on ${phone}.`,
      links: [{ label: "Get a catering quote", href: href(ROUTES.cateringQuote) }],
      tint: true,
    },
  ],
  faq: qaRoute(ROUTES.whatsNew, [
    qa(
      `What's new at ${name} in ${NEW_MONTH}?`,
      `In ${NEW_MONTH}, ${name}, the pure veg restaurant in Anna Nagar East, leads its new menu with build-your-own dosa, serves Nellai Special Sodhi Meals at lunch and stays open until ${CLOSE}.`
    ),
  ]),
};

/* ---- /seasonal/karthigai-ayyappa-pure-veg/ (time-bound, reuse yearly) -----
 * Only verified facts. Onion- and garlic-free cooking, pooja catering and a
 * seasonal menu are pending facts (entity-truth.ts noOnionGarlic, poojaCatering,
 * karthigaiSpecial): the copy says "ask the team" until each is confirmed. */
const noOnionGarlic = factOr("noOnionGarlic", null);
const poojaCatering = factOr("poojaCatering", null);
const karthigaiSpecial = factOr("karthigaiSpecial", null);
const onionGarlicDishes = allItems.filter((i) => /onion|garlic/i.test(i.name)).map((i) => i.name);
const onionGarlicToppings = byo.steps.flatMap((st) => st.options).filter((o) => /onion|garlic/i.test(o.name)).map((o) => o.name);
const liveDosaGroups = cateringEnabled && guests;
export const seasonalPage = {
  path: ROUTES.seasonal,
  title: `Karthigai & Ayyappa Mala Pure Veg Food, Chennai | ${name}`,
  description: `Plan a pure veg lunch or dinner for Karthigai and Ayyappa mala at ${name} in Anna Nagar East, Chennai. See the menu and opening hours.`,
  h1: "Pure Veg Food for Karthigai and Ayyappa Mala in Chennai",
  intro: `${name} is a pure vegetarian restaurant in Anna Nagar East, Chennai. Families and Ayyappa devotees can eat lunch and dinner there every day from ${HOURS} through Karthigai month, mid-November to mid-December.`,
  sections: [
    {
      id: "ayyappa-mala",
      title: `Is ${name} Suitable During Ayyappa Mala?`,
      lead: noOnionGarlic
        ? `${name}'s restaurant is ${PV}. The kitchen can cook dishes without onion and garlic on request for devotees observing the 41-day Ayyappa mala vratham. Alcohol is not served.`
        : `${name}'s restaurant is ${PV}. No meat, egg or fish is cooked in its kitchen in Anna Nagar East, and alcohol is not served. Some dishes contain onion or garlic. Ask which dishes suit you if you avoid them during the 41-day Ayyappa mala vratham.`,
      dishes: noOnionGarlic ? [] : [...onionGarlicDishes, ...onionGarlicToppings.map((t) => `${t} (dosa topping)`)].map((n) => ({ name: n })),
      note: noOnionGarlic ? "" : `Dishes and toppings above contain onion or garlic. Call or WhatsApp ${phone} to check others.`,
    },
    ...(karthigaiSpecial
      ? [{ id: "karthigai-special", title: karthigaiSpecial.name, lead: karthigaiSpecial.detail, tint: true }]
      : []),
    {
      id: "karthigai-lunch",
      title: "Karthigai Month Lunch at Brihadhee",
      lead: `${name} serves vegetarian lunch from ${OPEN}, seven days a week: the ${sodhiMeals.name} (${rupees(sodhiMeals.price)}), Tamil Nadu meals (${priceRange(tnMeals)}) and ${kali.name} (${rupees(kali.price)}), a Tirunelveli sweet of black urad dal and palm jaggery. To learn more about these dishes, read [what Nellai meals are](${ROUTES.nellaiGuide}).`,
      links: [{ label: "Lunch and Nellai meals", href: href(ROUTES.lunch), primary: true }],
      tint: true,
      image: { name: "meals", alt: "A banana-leaf plate with rice, papad and bowls of South Indian sides", caption: "A pure veg banana-leaf lunch" },
    },
    {
      id: "karthigai-deepam",
      title: "Karthigai Deepam Family Lunch and Dinner",
      lead: `For a Karthigai Deepam family meal, ${name} takes table bookings on ${list(getFact("bookingLinks").map((b) => b.label))}, and serves lunch and dinner from ${HOURS}. On festival days, call ${phone} to check before you set out.`,
      links: [{ label: "Book a table", href: href(ROUTES.book), primary: true }],
    },
    {
      id: "devotee-dinner",
      title: "Pure Veg Dinner for Families and Devotees",
      lead: `${name} serves vegetarian dinner until ${CLOSE}: build-your-own dosa, idiyappam with coconut milk, ${idiyappamSodhi.name} and ${paanai.name}, with filter coffee to finish.`,
      links: [{ label: `Dinner until ${CLOSE}`, href: href(ROUTES.dinner), primary: true }],
      tint: true,
    },
    ...(liveDosaGroups
      ? [
          {
            id: "group-catering",
            title: "Group Catering in Chennai During Karthigai",
            lead: poojaCatering
              ? `${name} caters ${CATERING_DIET} Ayyappa poojas, bhajans and family get-togethers across Chennai for ${num(guests.min)} to ${num(guests.max)} guests, with live counters for ${list(liveCounters)}.`
              : `${name} caters ${CATERING_DIET} family get-togethers and functions across Chennai for ${num(guests.min)} to ${num(guests.max)} guests, with live counters for ${list(liveCounters)}. For a group with specific dietary needs, use the catering quote form to check what the team can provide.`,
            links: [
              { label: "Event catering", href: href(ROUTES.eventCatering), primary: true },
              { label: "Get a catering quote", href: href(ROUTES.cateringQuote) },
            ],
          },
        ]
      : []),
  ],
  faq: qaRoute(ROUTES.seasonal, [
    qa(
      "Where can Ayyappa devotees eat pure veg food in Anna Nagar?",
      `Ayyappa devotees can eat at ${name}, a pure vegetarian restaurant in Anna Nagar East where no meat, egg or fish is cooked. Alcohol is not served.`
    ),
    noOnionGarlic
      ? qa(
          `Does ${name} cook without onion and garlic?`,
          `Yes, ${name}, the pure vegetarian restaurant in Anna Nagar East, cooks dishes without onion and garlic on request for devotees observing the Ayyappa mala. ` +
            `Tell the restaurant team when you order. For an event, ask separately about your menu and preparation requirements on the catering quote form.`
        )
      : qa(
          `Does ${name} use onion and garlic?`,
          `Yes. Some dishes at ${name} contain onion or garlic, such as ${list([...onionGarlicDishes, ...onionGarlicToppings].slice(0, 2))}. ` +
            `If you avoid them during the Ayyappa mala, call ${phone} or ask the team which dishes suit you before ordering.`
        ),
    ...(liveDosaGroups
      ? [
          qa(
            `Can ${name} cater a Karthigai get-together in Chennai?`,
            `Yes. ${name} caters ${CATERING_DIET} family get-togethers across Chennai for ${num(guests.min)} to ${num(guests.max)} guests, with live counters for build-your-own dosa and Paanai Parotta. ` +
              `Use the catering quote form to share your date, venue and estimated guest count.`
          ),
        ]
      : []),
  ]),
};
