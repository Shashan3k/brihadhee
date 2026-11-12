/**
 * Facts computed from src/data/menu-canonical.ts at build time. Copy and schema that
 * quote prices or lists use these helpers, so a price change in menu-canonical.ts
 * changes the text everywhere. Never type these numbers by hand.
 */
import { MENU, CURRENCY, BUILD_YOUR_OWN_DOSA, MENU_NOTES } from "../data/menu-canonical.ts";

const currency = CURRENCY;
export const rupees = (n) => `${currency}${n}`;

const byPrice = (a, b) => a.price - b.price;

function categoryFacts(cat) {
  const items = cat.items.map((i) => ({ ...i, category: cat.name }));
  const sorted = [...items].sort(byPrice);
  return {
    id: cat.id,
    name: cat.name,
    blurb: cat.blurb,
    items,
    count: items.length,
    min: sorted[0].price,
    max: sorted[sorted.length - 1].price,
    cheapest: sorted[0],
    dearest: sorted[sorted.length - 1],
    allVeg: items.every((i) => i.diet === "veg"),
    names: items.map((i) => i.name),
  };
}

export const categories = MENU.map(categoryFacts);
export const category = (id) => {
  const c = categories.find((x) => x.id === id);
  if (!c) throw new Error(`[menu-facts] no menu category "${id}"`);
  return c;
};

export const allItems = categories.flatMap((c) => c.items);
export const itemCount = allItems.length;
export const allVegetarian = allItems.every((i) => i.diet === "veg");

/** "₹95 to ₹170" */
export const priceRange = (c) => `${rupees(c.min)} to ${rupees(c.max)}`;

/** Group an arbitrary item list into the same shape as a category. */
export function summarise(items) {
  if (!items.length) throw new Error("[menu-facts] cannot summarise an empty item list");
  const sorted = [...items].sort(byPrice);
  return {
    items,
    count: items.length,
    min: sorted[0].price,
    max: sorted[sorted.length - 1].price,
    cheapest: sorted[0],
    dearest: sorted[sorted.length - 1],
    names: items.map((i) => i.name),
  };
}

/** Items whose name matches a pattern, across every category. */
export const findItems = (re) => allItems.filter((i) => re.test(i.name));

export const parotta = summarise(findItems(/parotta/i));
export const meals = summarise(findItems(/\bmeals\b/i));
export const filterCoffee = (() => {
  const hit = allItems.find((i) => /^filter coffee$/i.test(i.name));
  if (!hit) throw new Error('[menu-facts] "Filter Coffee" not found in menu-canonical.ts');
  return hit;
})();

export const joinNames = (names) =>
  names.length <= 1
    ? names.join("")
    : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

export const currencySymbol = currency;

/* ---- Build Your Own Dosa (page 1 of the menu) ---------------------------- */
/**
 * Guest-facing wording for each printed menu step (on-page blueprint, 2026-11-11).
 * The menu's own order and options are kept; only the headings change. The menu's
 * "Garnish" is the ghee, butter or oil the dosa is roasted in, hence "roast".
 * A new step on the menu without wording here fails the build.
 */
const BYO_WORDING = {
  batter: { label: "Pick your base", text: (o) => `Choose one of ${o.length} batters, ${rupeeRange(o)}.` },
  topping: { label: "Finish with podi and toppings", text: (o) => `Add any of ${o.length} podis and toppings, from +${rupees(minOf(o))} each.` },
  stuffing: { label: "Add fillings", text: (o) => `Add a filling: ${o.length} options, from +${rupees(minOf(o))}.` },
  garnish: { label: "Choose your roast", text: (o) => `Roast it in ghee, butter or oil: ${o.length} options, from +${rupees(minOf(o))}.` },
};
const minOf = (o) => Math.min(...o.map((x) => x.price));
const rupeeRange = (o) => {
  const lo = minOf(o);
  const hi = Math.max(...o.map((x) => x.price));
  return lo === hi ? rupees(lo) : `${rupees(lo)} to ${rupees(hi)}`;
};

export const byo = (() => {
  const steps = BUILD_YOUR_OWN_DOSA.steps.map((s) => {
    const w = BYO_WORDING[s.name.toLowerCase()];
    if (!w) throw new Error(`[menu-facts] Build Your Own Dosa step "${s.name}" has no guest-facing wording in BYO_WORDING`);
    return { ...s, label: w.label, text: w.text(s.options) };
  });
  const step = (n) => steps.find((s) => s.name.toLowerCase() === n);
  const batters = step("batter").options;
  const sugg = [...BUILD_YOUR_OWN_DOSA.suggestions].sort((a, b) => a.price - b.price);
  return {
    steps,
    suggestions: BUILD_YOUR_OWN_DOSA.suggestions,
    batterCount: batters.length,
    batterMin: Math.min(...batters.map((b) => b.price)),
    batterNames: batters.map((b) => b.name),
    counts: Object.fromEntries(steps.map((s) => [s.name.toLowerCase(), s.options.length])),
    suggestionCount: sugg.length,
    suggestionMin: sugg[0].price,
    suggestionMax: sugg[sugg.length - 1].price,
    cheapestSuggestion: sugg[0],
  };
})();
export const menuNotes = MENU_NOTES;

/**
 * The canonical definition of Build Your Own Dosa (AEO audit 2026-11-12: one
 * answer engine read "build your own" as a self-service cooking station). The
 * guest chooses from the menu; the kitchen cooks. Used word for word on the home
 * page, the dosa page, the home FAQ and both llms files.
 */
export const BYO_DEFINITION = {
  sentence:
    "At Brihadhee, build-your-own dosa means you choose the batter, podi and toppings, filling and roast from the menu, and the kitchen cooks your dosa to order and serves it at your table.",
  notSelfService: "It is a chef-cooked custom dosa, not a self-service cooking station.",
};
export const byoDefinition = `${BYO_DEFINITION.sentence} ${BYO_DEFINITION.notSelfService}`;
