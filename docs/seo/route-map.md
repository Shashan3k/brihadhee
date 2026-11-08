# Route map and Key.md cluster coverage (Stage 2, 2026-11-07)

Canonical origin: `https://www.brihadhee.com`. Every route is pre-rendered static HTML (Astro `output: "static"`); no route needs JavaScript to show its content.

## Routes

| Route | Primary keyword cluster | Intent | JSON-LD types (one @graph) | Render mode |
|---|---|---|---|---|
| `/` | Brand / navigational ("brihadhee anna nagar", "brihadhee restaurant", "pure veg restaurant in Anna Nagar") | Brand hub: who, what, where, both pillars | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static |
| `/menu/` | "brihadhee menu", "restaurant menu with prices Anna Nagar", tiffin and filter coffee | Look up dishes and prices | Restaurant, WebSite, WebPage, BreadcrumbList, Menu (MenuSection, MenuItem, Offer INR), FAQPage | Static |
| `/about/` | "brihadhee address", "brihadhee timings", "near Anna Nagar Tower", local area terms | Location, hours, directions, founders | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static |
| `/best-dosa-parotta-anna-nagar/` | "best dosa in Anna Nagar", "customised dosa", "paanai parotta", "veg kothu parotta" | Dish discovery: dosa and parotta | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static |
| `/nellai-meals-south-indian-veg-anna-nagar/` | "Nellai meals", "sodhi", "ulundhu kali", "mini tiffin Anna Nagar" | Regional dishes and breakfast | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static |
| `/catering-services-chennai/` | Catering and events (families) | Book function catering | Restaurant, WebSite, WebPage, BreadcrumbList, Service, FAQPage | Static (built only while catering is confirmed) |
| `/event-planner-catering-partner/` | Catering partner for event management companies | B2B event partnership | Restaurant, WebSite, WebPage, BreadcrumbList, Service, FAQPage | Static (same gate) |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/site.webmanifest` | Machine endpoints | Discovery | n/a | Generated at build |

No street, ZIP or landmark doorway pages. Each Q&A question appears on one route only.

## Key.md clusters

| Key.md cluster | Where it lives | Notes |
|---|---|---|
| Brand / navigational: brihadhee anna nagar, restaurant, menu, timings, address, contact number, mini tiffin, dosa, nellai meals | `/`, `/menu/`, `/about/`, dish pages | |
| Brand: brihadhee reviews | Skipped | Google rating unverified (no dated source) |
| Brand: table booking | `/` (offers, families Q&A) | Pre-booking via Swiggy Dineout, EazyDiner, District only |
| Brand: order online, swiggy, zomato, instagram | Skipped | Listings and profiles not confirmed as owner-controlled (`sameAs` is null) |
| Brand: beyond curry by brihadhee | `/` (services card, Q&A) | |
| Spelling variants (brihadhi, brihadee, பிரிஹாதீ...) | Skipped on page | Not stuffed into copy; add confirmed variants to `alternateNames` in entity-truth.ts |
| Primary: pure veg / South Indian / vegetarian / dosa restaurant in Anna Nagar, family restaurant, budget restaurant | `/`, `/best-dosa-parotta-anna-nagar/` | "best ..." is used only as a question heading, never as a claim |
| Primary: tiffin centre, best breakfast in Anna Nagar | `/nellai-meals.../` (Mini Tiffin), `/menu/` (tiffin Q&A) | |
| Stretch (aggregator-dominated head terms) | Skipped | Owned by aggregators; not worth a page |
| Secondary: 500 varieties of dosa | **Skipped** | Unverified: the menu lists 11 dosa items (entity-truth.ts probe blocks the claim) |
| Secondary: customised dosa, dosa varieties, mini tiffin, pure veg restaurant in Chennai, Nellai meals, Tirunelveli-style meals, paanai parotta, veg kothu parotta | Dish pages, `/menu/` | |
| Secondary: authentic / traditional / home-style Tamil food | `/nellai-meals.../` intro | Described, not claimed as "authentic" in answers |
| Long-tail tiffin: idli, ghee podi idli, mini idli sambar, sodhi idli, idiyappam, kothu idiyappam, filter coffee | `/menu/` | Pongal, vada, poori, kuzhi paniyaram are not on the canonical menu (only inside the Mini Tiffin) |
| Long-tail dosa types (masala, ghee roast, podi, rava, ...) | `/menu/`, dosa page list | Only the 11 types on the menu |
| Long-tail meals and mains: veg meals, Nellai meals, executive meals, banana leaf meals, ulundhu kali, sodhi, kothu parotta, paanai parotta, paneer poppers | `/menu/`, dish pages | |
| Price and use-case: cheap breakfast, budget meals, under ₹300 for two, family lunch, group dining, kid-friendly | `/` (price for two, families), `/nellai-meals.../` (Mini Tiffin) | |
| Time and occasion: early breakfast, morning tiffin, Sunday breakfast, weekend family lunch | `/about/` (timings, Sundays) | |
| Time: late-night dosa | **Skipped** | Late-night offer unverified (contradicts the 11 PM close) |
| Service: takeaway, parcel, delivery | **Skipped** | Not confirmed |
| Seasonal pure-veg demand (Purattasi, Navaratri, Karthigai, Ayyappa) | Skipped for now | Good future content once the owner confirms seasonal menus |
| Local: Anna Nagar East / West, Shenoy Nagar, Kilpauk, Mogappair, Thirumangalam | `/about/` (areas Q&A) | Other Key.md areas not listed in the verified facts |
| Landmarks: Anna Nagar Tower / Tower Park, 3rd Avenue, W Block | `/about/`, `/`, every answer | Metro stations and VR Mall not used (no verified distance) |
| High-intent: near me, open now | All pages carry NAP, hours and geo | "open now" depends on the engine; hours are in schema |
| High-intent: parking | **Skipped** | Parking unverified |
| Tamil / Tanglish | `/about/` Tamil line; "dosai", "Nellai virundhu", "tiffin" in copy | Natural use only; no keyword lists |
| Competitor-adjacent | **Skipped** | Rule: no competitor names on the site |
| AEO discovery, brand, dish-definition questions | Q&A on `/`, `/menu/`, `/about/`, dish pages | 39 answer-first Q&As built by `qa()` (7 home, 4 menu, 5 about, 5 dosa, 5 Nellai, 9 catering, 4 event planner); each names Brihadhee, the street, pure veg status and a concrete fact |
| AEO: Is Brihadhee on Swiggy or Zomato / does it deliver / parking | Skipped | Unverified |
| GEO entities and topic clusters | `/llms.txt`, `/llms-full.txt`, schema, summary boxes | |
| Catering clusters | `/catering-services-chennai/`, `/event-planner-catering-partner/` | Corporate / office vendor intent excluded by owner decision |

## Added 2026-11-08

| Route | Purpose | Indexed? | JSON-LD |
|---|---|---|---|
| `/book-a-table/` | How to reserve: walk-in offer, partner pre-booking (EazyDiner linked; Swiggy Dineout and District named until their URLs are confirmed), groups | Yes (in sitemap) | Restaurant, WebSite, WebPage, BreadcrumbList |
| `/privacy/` | What the site stores; analytics paragraph switches with `PUBLIC_GA4_ID` | noindex, not in sitemap | same base graph |
| `/404` | Helpful links | noindex | same base graph |
| `/menu.json` | Machine-readable menu (name, price, INR, veg, section, url, lastUpdated) | n/a | n/a |
| `/sitemap-index.xml` | Points to `/sitemap.xml`; robots.txt now references the index | n/a | n/a |
| `/<INDEXNOW_KEY>.txt` | IndexNow key file, built only when the env var is set | n/a | n/a |

Planned routes from the 2026-11-08 brief (not built yet; see `docs/strategy/competitor-attack-plan.md` section 3.1): `/menu/dosa/` (will absorb `/best-dosa-parotta-anna-nagar/` with a 301), `/menu/dosa/[slug]/`, `/menu/mini-tiffin/`, `/menu/nellai-meals/` (will absorb the Nellai page), `/menu/tiffin/`, `/menu/parotta-kothu/`, `/menu/filter-coffee/`, `/location/anna-nagar/` (will absorb the location part of `/about/`), `/guides/*`, `/events/group-dining/`, `/reviews/`, `/faq/`. Gated: `/order/` (Swiggy/Zomato URLs), `/ta/` (human Tamil copy), `/compare/*` (dated competitor data; never named on the site).
