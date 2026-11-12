# Master brief (2026-11-08): status and where each part lives

This maps the "Master Context Prompt" (SEO, AEO, GEO and Google Business Profile) onto the existing site. We kept the current Astro site and its fact guard (`src/data/entity-truth.ts`) instead of rebuilding, as agreed. Nothing unconfirmed is published; the build fails if it is.

## The one thing that matters most

**Update 2026-11-12:** checked live: www.brihadhee.com now serves the current build (canonical on `https://www.brihadhee.com/`, the current URL set in its sitemap). The note below is kept for history.

~~**The live site is out of date.** www.brihadhee.com (Vercel) still serves an older build. That old build is what the brief audited: its canonical points to `shashan3k.github.io/brihadhee/` and it has a `meta keywords` tag. The code in this repo fixes both. Deploy it, then turn GitHub Pages off (see `docs/owner-todo.md`, section E).~~

## Homepage findings from the brief (section 2)

| # | Finding | Status in code |
|---|---|---|
| 1 | Canonical and `og:url` on github.io | **Fixed.** Every page is canonical to `https://www.brihadhee.com/...`; `check:seo` fails if canonical or `og:url` is off-domain or they differ. The Pages deploy workflow is now a build-and-check job only |
| 2 | Spammy `meta keywords` | **Removed.** `check:seo` fails if the tag comes back |
| 3 | H1 is the brand name only | **Fixed.** H1 reads "Brihadhee, pure vegetarian South Indian restaurant and caterer in Anna Nagar East, Chennai" |
| 4 | Unattributed "What diners say" | **Removed.** Replaced by a link to Google Maps. Real reviews show only when added with name, date and permission. Ratings stay hidden until confirmed |
| 5 | No listing links | **Added** Google Maps and EazyDiner links in the footer, Instagram icon, and `sameAs` (Instagram, EazyDiner). Swiggy, Zomato, District and Justdial wait for confirmed URLs |
| 6 | No structured data | Already present: one JSON-LD graph per page (Restaurant, Menu, FAQPage, BreadcrumbList, WebSite, WebPage; Restaurant doubles as the organisation node). `validate-schema.js` checks it against the facts |
| 7 | URL styles | Existing URLs kept; nothing renamed, so no redirects needed |
| 8 | Long, repetitive FAQ answers | Already rewritten: every answer is 35–60 words, answer-first, enforced by `qa()` in `src/lib/answers.js` |
| 9 | Machine-made Tamil FAQ | Already removed. Tamil returns only with human-written copy |
| 10 | Hours wording | One source (`entity-truth.ts`), identical everywhere |
| 11 | `mailto:` form | Kept; phone, directions and labelled fields beside it. WhatsApp waits for a confirmed number |
| 13 | Same meta and OG description | Home now has a separate social description |
| 14 | Alt text | Kept |

## Section 3: pages

**Built (indexable):** `/`, `/menu/`, `/best-dosa-parotta-anna-nagar/`, `/nellai-meals-south-indian-veg-anna-nagar/`, `/catering-services-chennai/`, `/event-planner-catering-partner/`, `/about/` (location, timings, directions, founders), `/book-a-table/`.
**Built (noindex utility):** `/privacy/`, `/404`.
**Machine-readable:** `/robots.txt`, `/sitemap-index.xml`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, `/menu.json`, IndexNow key file (only when a key is set).

**Not built yet, and why:**

| Page | Blocked on |
|---|---|
| `/order/` | Swiggy and Zomato store links, and whether takeaway runs (owner-todo B7, B9) |
| `/location/anna-nagar-east/` | Measured walking times and parking (B3, B25). `/about/` covers address, map and landmarks meanwhile |
| `/reviews/` | At least a few permissioned reviews (C5). An empty page would be thin |
| `/faq/` | The FAQs already live on the pages they belong to, with matching FAQPage schema. A separate page would duplicate them |
| `/menu/mini-tiffin/` and other dish pages | Chef's descriptions (B21) so the pages have something unique to say |
| `/beyond-curry/` | How customers order Beyond Curry (B22) |
| `/guides/*` | Owner facts for each guide; drafts would stay noindex anyway |
| Area pages, comparison pages | Doorway risk; not planned |

## Sections 5–11, 13–18: plans and where they are

| Brief section | Document |
|---|---|
| Keyword map, priority, landing pages | `docs/strategy/competitor-attack-plan.md` sections 3.1, 6.2; `docs/seo/route-map.md` |
| Competitors (Saravana Bhavan, A2B, Karthik Tiffin Centre, Sree Akshayam, Dosa.in and others) | `docs/strategy/competitor-attack-plan.md` section 1; `docs/geo/competitor-benchmark.csv` |
| AI prompts to win and monthly log | `docs/seo/aeo-query-set.csv`, `docs/seo/aeo-accuracy-log.csv`, `docs/geo/query-panel.csv`, `docs/geo/visibility-log.csv` |
| Entity plan, name confusion | `docs/geo/entity-sheet.md`; `llms.txt` |
| Google Business Profile, steps A to U | `docs/strategy/gbp-update-guide.md` (ordered list for the owner at the end) |
| Citations, bloggers, press, outreach templates | `docs/geo/outreach-targets.md`, `docs/geo/earn-playbook.md` |
| Content engine, Reels, posts, videos | `docs/strategy/competitor-attack-plan.md` sections 3.3–3.10 |
| KPI dashboard | `docs/strategy/competitor-attack-plan.md` section 5 |
| Search Console, Bing, GA4, IndexNow | `docs/search-console-setup.md` |
| Facts to confirm | `docs/owner-todo.md` |
| Days 1–90 | `docs/strategy/competitor-attack-plan.md` section 4 |
| Days 91–180 | Below |

## Days 91–180 (extends the 90-day plan)

| Weeks | Work | Owner | Measure |
|---|---|---|---|
| 13–16 | Publish dish pages and guides whose facts are now confirmed; one internal link from each to `/menu/` and `/about/` | Developer, owner for facts | Pages indexed; impressions per page |
| 13–20 | Catering: add real event photos and a confirmed per-plate range, if the owner agrees to publish one | Owner, marketing | Catering enquiries per month |
| 15–22 | Creator and press round 2 (catering and Nellai food angles) | Marketing | Referring domains; branded searches |
| 17–24 | Seasonal pages only for real offers (Pongal, Margazhi) with end dates | Marketing | Clicks during the season |
| Monthly | AI prompt log, listing consistency check, review count and reply rate | Marketing | Citations for the 10 prompts |
| Week 26 | Review: drop or merge pages with no impressions; refresh menu prices | Developer, owner | — |

Forecasts stay as ranges (see competitor plan 6.7). Nothing here guarantees rankings.

## Top 10 actions for the next 30 days

1. Deploy the current code to Vercel.
2. Turn off GitHub Pages; check the canonical in Search Console.
3. Verify the domain in Search Console and Bing; submit `sitemap-index.xml`.
4. Owner answers B1 (which phone Google shows) and B3 (parking): both conflict across listings today.
5. Fix the GBP phone, hours, categories and description (GBP guide steps A–G).
6. Upload the first 30 real photos to GBP (step L).
7. Put review QR cards on tables and bills; no discounts for reviews.
8. Reply to every new review within 48 hours.
9. Send Swiggy and Zomato links (B7) so `/order/` can be built.
10. Start the monthly AI prompt log with a baseline this week.

## Not verified in this pass

- **Lighthouse scores** were not measured; there is no Lighthouse install in this project. Run PageSpeed Insights on the live URL after deploying and record mobile and desktop scores.
- **Listing conflicts** stay open: Google shows 073587 14113 while the site uses 94442 24999; Swiggy and EazyDiner disagree on parking.
- **Instagram and EazyDiner** are linked because the brief names them; the owner should still confirm both accounts are theirs.
