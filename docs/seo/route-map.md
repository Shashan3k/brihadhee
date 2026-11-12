# Route map and Key.md cluster coverage (Stage 2, 2026-11-07; updated 2026-11-11)

Canonical origin: `https://www.brihadhee.com` (`brihadhee.vercel.app` and the bare `brihadhee.com` 301 to it in `vercel.json`). Sitemap `<lastmod>` is the build date; redirected paths are never in the sitemap. Every route is pre-rendered static HTML (Astro `output: "static"`); no route needs JavaScript to show its content.

**2026-11-11, client direction W11 to W13** (`docs/seo/client-confirmations.md` section F): lunch and dinner only, 11:00 AM to 11:00 PM. Breakfast, tiffin, Mini Tiffin, the 6:30 AM opening, budget or cheap framing and "500+ dosa varieties" are hard-blocked on every surface (`docs/seo/avoid-terms.txt`). No route, slug, title or Q&A may target them. Corporate catering is now a client service.

## Routes

| Route | Primary keyword cluster | Intent | JSON-LD types (one @graph) | Render mode |
|---|---|---|---|---|
| `/` | Brand / navigational ("brihadhee anna nagar", "brihadhee restaurant", "pure veg restaurant in Anna Nagar") | Brand hub: who, what, where, both pillars | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static |
| `/menu/` | "brihadhee menu", "restaurant menu with prices Anna Nagar", build-your-own dosa, filter coffee | Look up dishes and prices | Restaurant, WebSite, WebPage, BreadcrumbList, Menu (MenuSection, MenuItem, Offer INR), FAQPage | Static |
| `/about/` | "brihadhee address", "brihadhee timings", "near Anna Nagar Tower", local area terms | Location, hours, directions, founders | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static |
| `/menu/dosa/` (was `/best-dosa-parotta-anna-nagar/`, now a 301 in `vercel.json`) | "build your own dosa Chennai", "customised dosa", "best dosa in Anna Nagar" (question heading only), classic dosas | Build Your Own Dosa: definition, the 4 menu steps, chef's combinations, 8 classic dosas, live counter | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static (blueprint 2026-11-11) |
| `/menu/nellai-meals/` (was `/nellai-meals-south-indian-veg-anna-nagar/`, now a 301) | "veg lunch Anna Nagar", "Nellai meals", "Nellai Special Sodhi Meals", "sodhi", "ulundhu kali", "grandma-style Tamil meals" | Lunch from 11 AM: Nellai meals, Tamil home-style lunch, family and office lunch, booking | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static (blueprint 2026-11-11) |
| `/veg-dinner-anna-nagar/` | "veg dinner Anna Nagar", "dinner open till 11 pm Anna Nagar", "family dinner restaurant Anna Nagar", "paanai parotta", "veg kothu parotta" | Dinner until 11 PM: favourites (dosa, parotta, idiyappam, poppers), family and group dinners, late dinner, reserve | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static (built 2026-11-11; holds parotta until `/menu/parotta-kothu/` exists) |
| `/corporate-catering-chennai/` | "corporate catering Chennai", "pure veg corporate catering Chennai", "office catering Chennai", "bulk lunch catering Chennai", area modifiers (OMR, Guindy, Tidel Park and others in one section) | HR, admin and facilities buyers: scale, services, sample menus, process, food safety, areas, quote form | Restaurant, WebSite, WebPage, BreadcrumbList, Service, FAQPage | Static (built 2026-11-12; same catering gate) |
| `/whats-new/` | "what's new at Brihadhee", "brihadhee new menu" | Dated page (Article): the current offer stated positively; never names a retired service | Restaurant, WebSite, WebPage, BreadcrumbList, Article, FAQPage | Static (built 2026-11-12) |
| `/seasonal/karthigai-ayyappa-pure-veg/` | "Ayyappa mala vegetarian food Chennai", "Karthigai pure veg restaurant Chennai", "Karthigai Deepam family lunch Chennai" | Seasonal, time-bound (reuse yearly); onion and garlic, pooja catering and a seasonal menu stay "ask the team" until confirmed | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static (built 2026-11-12) |
| `/guides/what-are-nellai-meals/` | "what are Nellai meals", "what is sodhi", "what is ulundhu kali", "Tirunelveli cuisine", "what goes with idiyappam" | Dish definitions (P1 guide); the dish-definition questions live here only, and `/menu/nellai-meals/` links to it | Restaurant, WebSite, WebPage, BreadcrumbList, Article | Static (built 2026-11-12) |
| `/catering-services-chennai/` | End-to-end event catering (families, 50 to 1,500 guests) | Book function catering | Restaurant, WebSite, WebPage, BreadcrumbList, Service, FAQPage | Static (built only while catering is confirmed) |
| `/event-planner-catering-partner/` | Catering partner for event management companies | B2B event partnership | Restaurant, WebSite, WebPage, BreadcrumbList, Service, FAQPage | Static (same gate) |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/site.webmanifest` | Machine endpoints | Discovery | n/a | Generated at build |

No street, ZIP or landmark doorway pages. Each Q&A question appears on one route only (enforced by `qaRoute()` in `src/lib/answers.js` and `aeo-lint` check 12); the full address appears only in the first Q&A on each page.

## Active P1 routes (client direction W11 to W13, 2026-11-11)

Approved and in scope. `/veg-dinner-anna-nagar/` (2026-11-11) and `/corporate-catering-chennai/` (2026-11-12) are built (see Routes). **The others are not built yet**: each gets a sitemap, `llms.txt` and navigation link only when its page ships, so nothing links to a missing page. Keywords come from `SEO_RANKING_STRATEGY.md` section 3.2 and the page specs in section 5.

| Route | Primary keyword cluster | Intent | JSON-LD types (one @graph) | Status |
|---|---|---|---|---|

## Key.md clusters

| Key.md cluster | Where it lives | Notes |
|---|---|---|
| Brand / navigational: brihadhee anna nagar, restaurant, menu, timings, address, contact number, dosa, nellai meals | `/`, `/menu/`, `/about/`, dish pages | |
| Brand: brihadhee reviews | Skipped | Google rating unverified (no dated source) |
| Brand: table booking | `/` (offers, families Q&A) | Pre-booking via Swiggy Dineout, EazyDiner, District only |
| Brand: order online, swiggy, zomato, instagram | Skipped | Listings and profiles not confirmed as owner-controlled (`sameAs` is null) |
| Brand: beyond curry by brihadhee | `/` (services card, Q&A) | |
| Spelling variants (brihadhi, brihadee, பிரிஹாதீ...) | Skipped on page | Not stuffed into copy; add confirmed variants to `alternateNames` in entity-truth.ts |
| Primary: pure veg / South Indian / vegetarian / dosa restaurant in Anna Nagar, family restaurant | `/`, `/best-dosa-parotta-anna-nagar/` | "best ..." is used only as a question heading, never as a claim. Price-led terms are retired (client W11 to W13) |
| Primary: morning-service and price-led head terms | **Retired** | Client direction W11 to W13: lunch and dinner only; hard-blocked in `avoid-terms.txt` |
| Stretch (aggregator-dominated head terms) | Skipped | Owned by aggregators; not worth a page |
| Secondary: dosa variety-count claims | **Retired** | Not a client claim (the menu lists 11 dosa items); hard-blocked |
| Secondary: build-your-own dosa, customised dosa, dosa varieties, pure veg restaurant in Chennai, Nellai meals, Tirunelveli-style meals, paanai parotta, veg kothu parotta, Karaikudi paneer poppers | Dish pages, `/menu/` | |
| Secondary: authentic / traditional / home-style Tamil food | `/nellai-meals.../` intro | Described, not claimed as "authentic" in answers |
| Long-tail dishes: idli, ghee podi idli, mini idli sambar, sodhi idli, idiyappam, kothu idiyappam, filter coffee | `/menu/` | Only dishes on the canonical menu (`new menu.pdf`), served at lunch and dinner |
| Long-tail dosa types (masala, ghee roast, podi, rava, ...) | `/menu/`, dosa page list | Only the 11 types on the menu |
| Long-tail meals and mains: veg meals, Nellai meals, executive meals, banana leaf meals, ulundhu kali, sodhi, kothu parotta, paanai parotta, paneer poppers | `/menu/`, dish pages | |
| Use-case: family lunch, family dinner, group dining, kid-friendly | `/` (families Q&A), `/menu/nellai-meals/`, `/veg-dinner-anna-nagar/` | Price-led use-case terms are retired and hard-blocked |
| Time and occasion: lunch, dinner, open till 11 PM, weekend family lunch | `/about/` (timings), `/menu/nellai-meals/`, `/veg-dinner-anna-nagar/` | Morning terms retired. Open daily confirmed 2026-11-11; the last-order time is still pending |
| Time: late-night dosa | **Skipped** | Late-night offer unverified (contradicts the 11 PM close) |
| Service: takeaway, parcel, delivery | **Skipped** | Not confirmed |
| Seasonal pure-veg demand (Karthigai, Ayyappa; later Purattasi, Navaratri) | `/seasonal/karthigai-ayyappa-pure-veg/` (P1, not built) | Purattasi and Navaratri get sections ahead of September and October 2027 |
| Local: Anna Nagar East / West, Shenoy Nagar, Kilpauk, Mogappair, Thirumangalam | `/about/` (areas Q&A) | Other Key.md areas not listed in the verified facts |
| Landmarks: Anna Nagar Tower / Tower Park, 3rd Avenue, W Block | `/about/`, `/`, every answer | Metro stations and VR Mall not used (no verified distance) |
| High-intent: near me, open now | All pages carry NAP, hours and geo | "open now" depends on the engine; hours are in schema |
| High-intent: parking | **Skipped** | Parking unverified |
| Tamil / Tanglish | `/about/` Tamil line; "dosai", "Nellai virundhu" in copy | Natural use only; no keyword lists. Tamil morning-service terms are hard-blocked |
| Competitor-adjacent | **Skipped** | Rule: no competitor names on the site |
| AEO discovery, brand, dish-definition questions | Q&A on `/`, `/menu/`, `/about/`, dish pages | 39 answer-first Q&As built by `qa()` (7 home, 4 menu, 5 about, 5 dosa, 5 Nellai, 9 catering, 4 event planner); each names Brihadhee, the street, pure veg status and a concrete fact |
| AEO: Is Brihadhee on Swiggy or Zomato / does it deliver / parking | Skipped | Unverified |
| GEO entities and topic clusters | `/llms.txt`, `/llms-full.txt`, schema, summary boxes | |
| Catering clusters | `/catering-services-chennai/` (end-to-end event catering), `/event-planner-catering-partner/`, `/corporate-catering-chennai/` | Corporate and office catering is a client service (W13, 1,000+ meals a day) |

## Added 2026-11-08

| Route | Purpose | Indexed? | JSON-LD |
|---|---|---|---|
| `/book-a-table/` | How to reserve: walk-in offer, partner pre-booking (EazyDiner linked; Swiggy Dineout and District named until their URLs are confirmed), groups | Yes (in sitemap) | Restaurant, WebSite, WebPage, BreadcrumbList |
| `/privacy/` | What the site stores; analytics paragraph switches with `PUBLIC_GA4_ID` | noindex, not in sitemap | same base graph |
| `/404` | Helpful links | noindex | same base graph |
| `/menu.json` | Machine-readable menu (name, price, INR, veg, section, url, lastUpdated) | n/a | n/a |
| `/sitemap-index.xml` | Points to `/sitemap.xml`; robots.txt now references the index | n/a | n/a |
| `/<INDEXNOW_KEY>.txt` | IndexNow key file, built only when the env var is set | n/a | n/a |

Planned routes from the 2026-11-08 brief (not built yet; see `docs/strategy/competitor-attack-plan.md` section 3.1): `/menu/dosa/[slug]/`, `/menu/parotta-kothu/`, `/menu/filter-coffee/`, `/location/anna-nagar/` (will absorb the location part of `/about/`), `/guides/*`, `/events/group-dining/`, `/reviews/`, `/faq/`. Gated: `/order/` (Swiggy/Zomato URLs), `/ta/` (human Tamil copy), `/compare/*` (dated competitor data; never named on the site).

## Navigation and internal links (2026-11-12)

- Header: Menu, Build Your Own Dosa, Lunch & Nellai Meals, Dinner, Catering (dropdown: Corporate Catering, Event Catering, Event Planner Partner), Visit & Contact. The dropdown is a `<details>` element, so it works without JavaScript. Footer lists every link flat, plus Book a Table, the guide, What's New, Karthigai & Ayyappa Mala and Privacy.
- Contextual links: `scripts/check-internal-links.mjs` (part of `npm run check:links`) counts links inside `<main>` only. Money pages need links from 3+ other pages; every indexable page needs at least one; generic anchors ("click here", "read more") fail. The current matrix is in `docs/seo/internal-link-matrix.md`.
- Copy can carry in-prose links as `[anchor](/path/)` (`src/lib/inline-links.js`); only site-relative links are rendered.
- Tamil Q&As (`src/data/faq-ta.js`, heading அடிக்கடி கேட்கப்படும் கேள்விகள்): two each on `/`, `/menu/dosa/`, `/menu/nellai-meals/` and `/corporate-catering-chennai/`, under the same one-Q&A-per-route rule.
