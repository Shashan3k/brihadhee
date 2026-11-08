import { site } from "../data/site.js";
import { getFact, CONTENT_UPDATED } from "../data/entity-truth.ts";
import { MENU, MENU_SOURCE, UNPRICED_SIGNATURES } from "../data/menu-canonical.ts";

/**
 * /menu.json: machine-readable menu for AI agents, aggregators and apps.
 * Built from menu-canonical.ts (owner-confirmed menu PDF prices) at build time.
 * Unpriced signatures are listed separately with price null, never guessed.
 */
export function GET() {
  const items = MENU.flatMap((c) =>
    c.items.map((i) => ({
      name: i.name,
      description: i.description,
      price: i.price,
      currency: "INR",
      veg: i.diet === "veg",
      section: c.name,
      sectionId: c.id,
      url: `${site.url}/menu/#${c.id}`,
    }))
  );
  const body = {
    restaurant: getFact("name"),
    url: `${site.url}/`,
    diet: getFact("dietary"),
    address: getFact("address"),
    telephone: getFact("phone"),
    lastUpdated: CONTENT_UPDATED,
    priceSource: MENU_SOURCE,
    itemCount: items.length,
    items,
    signaturesWithoutPrice: UNPRICED_SIGNATURES.map((s) => ({ name: s.name, note: s.note, price: null })),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
