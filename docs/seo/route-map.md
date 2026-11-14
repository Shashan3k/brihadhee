# Route map and search intent

The [Phase 3 keyword-to-page map](keyword-to-page-map.md) is the current reference for keyword ownership, priorities, and the disposition of all 514 audit rows. This route map records the site's page structure.

**2026-11-12, keyword plan of 12 November (`keyword (1).md`):** the plan's section 6 pages map onto the live URLs, which were kept (no renames, no new redirects): Build Your Own Dosa = `/menu/dosa/`, Lunch / Meals = `/menu/nellai-meals/`, Dinner = `/veg-dinner-anna-nagar/`, Event Catering = `/catering-services-chennai/`, Corporate Catering = `/corporate-catering-chennai/`. New spokes: `/small-function-catering-chennai/`, `/catering-quote-chennai/`, `/family-dining-anna-nagar/`, `/faq/`, and the gated `/no-onion-no-garlic-anna-nagar/`. Gates live in `config/seo-gates.ts`; section 7 is enforced by `scripts/verify-seo-compliance.ts`. Catering copy says "vegetarian catering" until Q20.

The canonical origin is `https://www.brihadhee.com`. Phase 2 observed a live apex redirect and prepared the automatic Vercel hostname correction for deployment. Page sitemap `<lastmod>` uses the reviewed content date. Redirected routes are excluded. The Astro build pre-renders the public page content as static HTML. See the [Phase 2 verification log](phase-progress.md#phase-2--technical-seo-implementation-13-november-2026).

**2026-11-11, client direction W11 to W13** (`docs/seo/client-confirmations.md` section F): lunch and dinner only, 11:00 AM to 11:00 PM. Breakfast, tiffin, Mini Tiffin, the 6:30 AM opening, budget or cheap framing and "500+ dosa varieties" are hard-blocked on every surface (`docs/seo/avoid-terms.txt`). No route, slug, title or Q&A may target them. Corporate catering is now a client service.

## Routes

| Route | Primary keyword cluster | Intent | JSON-LD types (one @graph) | Render mode |
|---|---|---|---|---|
| `/` | Brand / navigational ("brihadhee anna nagar", "brihadhee restaurant", "pure veg restaurant in Anna Nagar") | Brand hub: who, what, where, both pillars | Restaurant, WebSite, WebPage, FAQPage | Static |
| `/menu/` | Brihadhee menu, restaurant menu with prices Anna Nagar, current dish names | Look up dishes and prices, with links to the dosa and lunch pages | Restaurant, WebSite, WebPage, BreadcrumbList, Menu (MenuSection, MenuItem, Offer INR), FAQPage | Static |
| `/about/` | "brihadhee address", "brihadhee timings", "near Anna Nagar Tower", local area terms | Location, hours, directions, founders | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static |
| `/book-a-table/` | Brihadhee table booking, reserve a table in Anna Nagar | Choose a verified booking partner or call about a group | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static |
| `/menu/dosa/` (legacy `/best-dosa-parotta-anna-nagar/` redirects here) | Build your own dosa Chennai, customizable dosa, best dosa in Anna Nagar, classic dosas | Learn how the kitchen prepares custom orders and choose a dosa for a visit | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static (blueprint 2026-11-11) |
| `/menu/nellai-meals/` (legacy `/nellai-meals-south-indian-veg-anna-nagar/` redirects here) | Nellai meals Anna Nagar, veg lunch Anna Nagar, Nellai Special Sodhi Meals, home-style Tamil lunch | Choose a dine-in lunch, including meals with colleagues, and book or visit | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static (blueprint 2026-11-11) |
| `/veg-dinner-anna-nagar/` | Veg dinner Anna Nagar, dinner open till 11 pm Anna Nagar, dosa or parotta for dinner | Check evening dishes, hours and booking | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static (built 2026-11-11) |
| `/corporate-catering-chennai/` | Corporate catering Chennai, vegetarian corporate catering, office lunch catering, bulk lunch catering, approved service areas | HR, admin and facilities buyers evaluating recurring meals or corporate events | Restaurant, WebSite, WebPage, BreadcrumbList, Service, FAQPage | Static (built 2026-11-12, catering gate) |
| `/whats-new/` | "what's new at Brihadhee", "brihadhee new menu" | Dated page (Article): the current offer stated positively; never names a retired service | Restaurant, WebSite, WebPage, BreadcrumbList, Article, FAQPage | Static (built 2026-11-12) |
| `/seasonal/karthigai-ayyappa-pure-veg/` | "Ayyappa mala vegetarian food Chennai", "Karthigai pure veg restaurant Chennai", "Karthigai Deepam family lunch Chennai" | Seasonal, time-bound (reuse yearly); onion and garlic, pooja catering and a seasonal menu stay "ask the team" until confirmed | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static (built 2026-11-12) |
| `/guides/what-are-nellai-meals/` | What are Nellai meals, what is sodhi, what is ulundhu kali, Tirunelveli cuisine, idiyappam pairings | Learn dish definitions and follow the link to the lunch page to plan a visit | Restaurant, WebSite, WebPage, BreadcrumbList, Article | Static (built 2026-11-12) |
| `/catering-services-chennai/` | Vegetarian catering Chennai, South Indian event catering, wedding catering, live dosa counters for events | Evaluate general event catering for 50 to 1,500 guests | Restaurant, WebSite, WebPage, BreadcrumbList, Service, FAQPage | Static (built only while catering is confirmed) |
| `/small-function-catering-chennai/` | Small function catering Chennai, birthday catering, private parties and 50+ guest menu planning | Choose catering for a confirmed family occasion | Restaurant, WebSite, WebPage, BreadcrumbList, Service (Offer eligibleQuantity >= 50 guests), FAQPage | Static (built 2026-11-12, catering gate) |
| `/catering-quote-chennai/` | Catering quote Chennai, catering enquiry, catering price per plate | Understand quote inputs and enquire via `/api/lead`. Automated WhatsApp hand-off is gated. | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static (built 2026-11-12, catering gate) |
| `/family-dining-anna-nagar/` | "family restaurant Anna Nagar veg", "veg restaurant near temple Anna Nagar", "family lunch after temple visit", "birthday dinner veg restaurant Anna Nagar" | Owns the family-dining intent (the home page's family Q&A moved here); no temple named until Q24 | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static (built 2026-11-12) |
| `/faq/` | Brand questions from 4.2 and 4.7 that no other page owns: "Does Brihadhee serve breakfast?" (the one permitted mention; answer "No"), the Brihadeeswarar name, Swiggy/Zomato, table booking | Answer hub plus an index linking to every page's own Q&A block (no duplicated answers) | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | Static (built 2026-11-12) |
| `/no-onion-no-garlic-anna-nagar/` | Tier 1 no onion no garlic, tier 2 satvik, tier 3 Jain-friendly (3.15 to 3.17, 4.8) | Dietary spoke | Restaurant, WebSite, WebPage, BreadcrumbList, FAQPage | **Gated** (`ENABLE_NO_ONION_NO_GARLIC_CLUSTER`, Q11 to Q14): not built in production; noindex draft in `npm run dev` |
| `/event-planner-catering-partner/` | Catering partner for event management companies | B2B event partnership | Restaurant, WebSite, WebPage, BreadcrumbList, Service, FAQPage | Static (same gate) |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/site.webmanifest` | Machine endpoints | Discovery | n/a | Generated at build |

The address and directions page covers verified nearby areas. Each Q&A question appears on one route only, enforced by `qaRoute()` in `src/lib/answers.js` and `aeo-lint` check 12. The full address appears only in the first Q&A on each page.

## Utility routes and owner gates

| Route | Purpose | Crawl or index eligibility |
|---|---|---|
| `/privacy/` | Privacy and optional analytics disclosure | Noindex and outside the page sitemap |
| `/404.html` | Custom missing-page HTML | Noindex and outside the page sitemap |
| `/menu.json` | Machine-readable canonical menu and prices | Generated endpoint outside the page sitemap |
| `/sitemap-index.xml` | Points to `/sitemap.xml` and is referenced from robots.txt | Discovery endpoint |
| `/<INDEXNOW_KEY>.txt` | IndexNow key file | Generated when the environment variable is set |

The page sitemap lists eligible routes. Google indexing requires Search Console verification. The existing booking profiles and social links serve their own channels. Delivery, takeaway, parking, last order, and named temple details need confirmation. The [keyword-to-page map](keyword-to-page-map.md#fact-checks-and-exclusions) covers held claims and the retired terms from older briefs.

## Navigation and internal links (2026-11-12)

- Header: Menu, Build Your Own Dosa, Lunch & Nellai Meals, Dinner, Catering (dropdown: Corporate Catering, Event Catering, Event Planner Partner), Visit & Contact. The dropdown is a `<details>` element, so it works without JavaScript. Footer lists every link flat, plus Book a Table, the guide, What's New, Karthigai & Ayyappa Mala and Privacy.
- Contextual links: `scripts/check-internal-links.mjs` (part of `npm run check:links`) counts links inside `<main>` only. Money pages need links from 3+ other pages; every indexable page needs at least one; generic anchors ("click here", "read more") fail. The current matrix is in `docs/seo/internal-link-matrix.md`.
- Copy can carry in-prose links as `[anchor](/path/)` (`src/lib/inline-links.js`); only site-relative links are rendered.
- Tamil Q&As (`src/data/faq-ta.js`, heading அடிக்கடி கேட்கப்படும் கேள்விகள்): two each on `/`, `/menu/dosa/`, `/menu/nellai-meals/` and `/corporate-catering-chennai/`, under the same one-Q&A-per-route rule.
