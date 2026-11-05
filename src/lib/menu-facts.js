/**
 * Facts computed from src/data/menu.json at build time. Copy and schema that
 * quote prices or lists use these helpers, so a price change in menu.json
 * changes the text everywhere. Never type these numbers by hand.
 */
import menu from "../data/menu.json";

const currency = menu.currency ?? "₹";
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

export const categories = menu.categories.map(categoryFacts);
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
  if (!hit) throw new Error('[menu-facts] "Filter Coffee" not found in menu.json');
  return hit;
})();

export const joinNames = (names) =>
  names.length <= 1
    ? names.join("")
    : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

export const currencySymbol = currency;
