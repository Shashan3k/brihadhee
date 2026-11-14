# Brihadhee SEO and AEO implementation handover

**14 November 2026 · Phase 9.** The integrated candidate passed the build, crawl and conversion checks and was released after owner authorization. All 17 sitemap routes and the tested duplicate-host redirects passed public checks. Live inbox receipt, analytics, Search Console coverage and listing corrections remain to be verified. The original AEO **63/100** was an editorial score and the remediation **85/100** was a self-assessment. Both scores concern the site's editorial quality. [Complete SEO audit](../../BRIHADHEE_COMPLETE_SEO_AUDIT.md) · [AEO audit](../audits/2026-11-12/AEO-AUDIT.md) · [AEO remediation](../audits/2026-11-12/AEO-REMEDIATION.md)

## Implementation and audit reconciliation

| Phase | Completed work and audit disposition | Main files |
|---|---|---|
| 1 · Baseline | Reconciled the audits with source and classified confirmed, unknown, owner and external work. The recovered HTTPS incident is historical. | `docs/seo/phase-progress.md` |
| 2 · Technical | Retained the static Astro architecture, canonical www domain, robots rules and legacy redirects. Prepared the explicit project-host 301. Production duplicate-host observation remains open until the release passes live rechecks. | `vercel.json`; existing `src/pages/robots.txt.js`, `sitemap*.js` and `src/layouts/Base.astro` verified |
| 3 · Intent | Disposed all 514 audit keyword IDs, mapped distinct search intents to the existing pages, and kept held terms and variants out of new landing pages. Actual query-to-page overlap and demand still require Search Console. | `docs/seo/keyword-to-page-map.md`, `route-map.md`, `src/data/catering.js` |
| 4 · Dining | Strengthened the Anna Nagar East dining journey, menu and prices, customized dosa ordering, Nellai lunch versus guide, dinner/family visit details and partner booking handoffs. Parking, accessibility and last order remain owner facts. | `src/data/pages.js`, `guides.js`, `spokes.js`; restaurant page templates and shared presentation components |
| 5 · Catering | Kept separate event, office, private-function, planner and quote journeys. Added fit-specific inputs and actionable failures. A fast valid submission no longer reports false success. Exact service terms, approved case studies and verified deployed receipt remain open. | `src/pages/[slug].astro`, `src/data/catering.js`, `src/data/spokes.js`, `src/components/LeadForm.astro`, `QuoteBuilder.astro`, `api/lead.js`, `src/lib/lead.js`, `scripts/lead.test.mjs` |
| 6 · Answers and schema | Preserved concise answers, scope qualifiers, exact food facts and language-aware FAQs. Corrected catering contact schema, menu add-on labels and breadcrumbs. Both `llms` files remain factual references. Historical Instagram-sourced wrong phone still needs an external correction and retest. | `src/data/faq.js`, `faq-ta.js`, `entity-truth.ts`, `src/lib/llms.js`, `schema.js`, `scripts/validate-schema.js`, `verify-seo-aeo-geo.mjs`, `docs/seo/ai-answer-testing.md`, query definitions |
| 7 · Local | Aligned onsite contact roles and map destination, added Metro walking directions, and audited existing images. The owner plan covers Google Business Profile, Instagram and channel listings with exact field edits. | `src/data/site.js`, `entity-truth.ts`, `src/components/AtAGlance.astro`, `Contact.astro`, `Footer.astro`, `src/pages/about.astro`, `docs/seo/local-seo-owner-action-plan.md` |
| 8 · Mobile | Deferred carousel image requests and corrected keyboard focus, navigation without JavaScript and sticky header clearance. The matched local homepage sample measured 405 KB to 276 KB in initial subresources and median LCP 2.45 s to 2.07 s. Real-user metrics remain unverified. | `src/components/Hero.astro`, `Nav.astro`, `Footer.astro`, `src/scripts/main.js`, `src/styles/global.css`, `main` focus targets in page templates |
| 9 · QA fixes | Restaurant enquiries now accept an optional normal party size or a menu question. Company and event venue fields apply to catering. The legacy general form payload still works. Restaurant versus catering submissions are measured separately, and internal booking-page clicks are separated from partner handoffs. | `src/components/LeadForm.astro`, `CallBar.astro`, `src/lib/lead.js`, `src/scripts/main.js`, `scripts/lead.test.mjs`, `docs/search-console-setup.md`, `docs/seo/route-map.md` |

For the wider file review, the source diff from workspace baseline commit `626a518` includes `api/lead.js`, `vercel.json`, `package.json`, the schema and site validation scripts, and the following areas. Review the workspace diff and include the new lead test and deliverable files in the intended review. The workspace also contains untracked historical research and recorded audio, which can be left out of the release change set.

| Area | Files modified across the integrated work |
|---|---|
| Shared components | `About.astro`, `AtAGlance.astro`, `CallBar.astro`, `Contact.astro`, `ContentSection.astro`, `Footer.astro`, `Hero.astro`, `LeadForm.astro`, `Nav.astro`, `PageHeader.astro`, `QuoteBuilder.astro`, `SpokePage.astro`, `Visit.astro` |
| Data and helpers | `src/data/{catering,faq,faq-ta,guides,pages,site,spokes}.js`, `entity-truth.ts`, `src/lib/{lead,llms,schema}.js` |
| Page templates and styles | `src/layouts/Base.astro`, `src/pages/{404,[slug],about,book-a-table,index,menu,privacy,veg-dinner-anna-nagar,whats-new}.astro`, the Nellai guide, dosa, Nellai lunch and seasonal templates, `src/scripts/main.js`, `src/styles/global.css` |
| Checks and handover | `scripts/validate-schema.js`, `scripts/verify-seo-aeo-geo.mjs`, `scripts/lead.test.mjs`, SEO ledger, route/keyword and answer panels, regenerated AEO and internal link reports, owner listing plan and the three Phase 9 deliverables |

## Release candidate route inventory

All 17 generated sitemap locations are on `https://www.brihadhee.com`. Each serves one H1 in HTML, a self canonical, an indexable robots directive, a unique title/description in the candidate, and valid schema. The public snapshot listed the same 17 URLs. Its HTTP availability and metadata do not establish Google indexing.

| Sitemap URL path | Customer intent |
|---|---|
| `/` | Local restaurant and brand discovery |
| `/menu/` | Current menu and prices |
| `/menu/dosa/` | Build-your-own and classic dosa |
| `/menu/nellai-meals/` | Nellai lunch, meals and visit |
| `/veg-dinner-anna-nagar/` | Evening dining |
| `/family-dining-anna-nagar/` | Family dining and group enquiries |
| `/about/` | Address, directions, hours and restaurant contact |
| `/book-a-table/` | Booking partner selection |
| `/faq/` | Business answers and topic links |
| `/whats-new/` | Dated restaurant updates |
| `/seasonal/karthigai-ayyappa-pure-veg/` | Seasonal vegetarian dining guidance |
| `/guides/what-are-nellai-meals/` | Informational dish definition |
| `/catering-services-chennai/` | Chennai vegetarian event catering |
| `/small-function-catering-chennai/` | Smaller private functions from 50 guests |
| `/catering-quote-chennai/` | Compare quote requirements and submit |
| `/event-planner-catering-partner/` | Agency and planner enquiries |
| `/corporate-catering-chennai/` | Office meals, packed orders and staffed events |

`/privacy/` and generated `/404.html` have noindex and are intentionally absent. The unapproved dietary route is absent from the build and returned 404 on production. `robots.txt` references `sitemap-index.xml`, whose child is `sitemap.xml`. Legacy paths redirect and utility files, including `menu.json` and the two `llms` files, are outside the page sitemap.

## Verification

| Verification | Result |
|---|---|
| `npm run build` | **Pass.** 19 built HTML pages, 17 sitemap entries, 98 valid JSON-LD nodes and zero SEO warnings. AEO lint, fact and claim gates, 1,629 internal links and contextual links passed. External links were outside the build’s checker. |
| `npm run verify`, `npm run typecheck`, `npm test` | **Pass.** Eight verification groups, typecheck and 12 lead tests. Verification used IPv4 localhost. |
| Browser review | **Pass.** Chrome 157 checked 12 restaurant and catering routes at 360, 390, 768, 1280 and 1440 px. No horizontal overflow or input-label failure. Keyboard focus, fallback navigation, carousel controls, quote jumps, mapped directions, partner links and separate booking/submission events passed. A six-guest restaurant enquiry submitted to a mock. A second run on all five catering routes at 320, 390 and 1440 px passed mocked 200, 422 and 502 states, retries and corporate and planner payload checks. |
| Visual review and partner destinations | Reviewed 390 and 1440 px snapshots of home, quote and booking. Public EazyDiner and District endpoints returned 200. Swiggy returned 403 to direct curl, so verify its Anna Nagar East outlet and booking availability on a phone. |
| Fact and answer review | Confirmed 11 AM–11 PM daily with lunch and dinner only, Anna Nagar East address and restaurant **+91 73587 14113** versus catering **+91 94442 24999**. The staff cook diner-selected dosa. Nellai menu facts match the menu. One event is **50–1,500** guests. **1,000+** describes existing daily corporate service. Automated WhatsApp and stronger dietary claims are gated. |
| Read-only production GET/HEAD, 14 November | **17/17** sitemap URLs returned 200, one H1 and self canonical, with no noindex header. HTTPS apex and HTTP www redirected to canonical www with 308. Both legacy restaurant URLs returned 301. Both live sitemap files and robots were readable. Privacy returned 200 with noindex and the dietary draft 404. `GET /api/lead` returned 405, which confirms method handling. |
| Pre-release parity and alternate host | Production titles differed on `/menu/` and `/catering-services-chennai/`. The Vercel project alias root and `/menu/` served 200 with indexable meta and a canonical pointing to www. The release resolved these observations as recorded below. |

## Remaining work by owner and type

The first authorized release, `9a4fc23`, passed GitHub Actions and Vercel. The updated menu and event catering titles were live and all 17 sitemap URLs returned 200. The project hostname root and no-slash paths initially redirected, while slash-terminated paths served noindexed copies. Vercel's route compiler reproduced the mismatch. The follow-up `ac731ad` passed both hosted checks and 17 local routing assertions. Seven live requests then returned 301 to www, including the root, nested paths with trailing slashes, sitemap and a URL with a query parameter. The production requests used one network. [First production build](https://github.com/Shashan3k/brihadhee/actions/runs/43580304518) · [Redirect follow-up](https://github.com/Shashan3k/brihadhee/actions/runs/43580549431)

| Priority | Classification and owner | Requirement and exit evidence |
|---|---|---|
| P1 | Release follow-up · hosting and developer | Repeat the verified www and project-host paths from a second network and record status, Location and headers. Verify preview protection or noindex independently if a public preview is used. |
| P0 | Code/operations · hosting and catering manager | Verify owner-approved Resend sender and recipients and one labelled test lead from the deployed form. Match accepted response to one actual inbox receipt and a named callback owner. Verify configured events separately. |
| P0 | Search Console · property owner and SEO lead | Grant access, export pre-release evidence, run the sitemap and URL Inspection steps below and capture Google’s selected canonicals. No current indexing, ranking or query-to-page cannibalization is verified. |
| P1 | Google Business Profile · owner or manager | Check dining Call, Directions, Reserve, seven-day and special hours, address/pin, category, website, current menu and photos. Correct dated conflicts where present and record public rechecks. [Local owner plan](local-seo-owner-action-plan.md) |
| P1 | Content approvals · operations | Confirm last order, parking, entry/seating/accessibility, group size and delivery/takeaway. Confirm catering lead times, prep and staffing/setup/cleanup, costs and price inclusions, and Q19/Q20 before stronger claims. Approve one office and one private-event example with real counts, dates, menus and original photos. [Owner decisions](client-confirmations.md) |
| P1 | External authority · owner and marketing | Check Instagram’s retired contact and correct conflicting Zomato, magicpin, District and other relevant merchant facts. Keep genuine reviews. Use documented cases, original restaurant photos and independent local partnerships. Repeat the fixed AEO panel after verifying the underlying sources. [Local owner plan](local-seo-owner-action-plan.md) · [AEO checklist](ai-answer-testing.md) |
| P2 | Technical measurement · developer and SEO | Obtain production mobile/desktop field LCP, INP and CLS. Watch the slash variant of `/menu/` in Google’s indexed evidence before changing routing. Use measured query/lead data for further content changes. [Measurement plan](measurement-plan.md) |

## Search Console validation

1. Verify access to `brihadhee.com` or the canonical URL-prefix property. Export the available pre-release Page indexing, Performance, Links, and Core Web Vitals evidence. Check Manual actions and Security issues. Verify the existing sitemap index submission or submit it if needed and log last read, status and discovered URLs. [Sitemaps report](https://support.google.com/webmasters/answer/7451001)
2. Inspect all 17 exact canonical URLs above. Start with home, menu, dosa and Nellai lunch, then booking and the event/corporate/quote pages. Record date, last crawl, fetch, crawl allowed, indexing allowed, indexed state and reason, user-declared canonical and Google-selected canonical. Use Live Test for the release HTML, screenshot and fetch behaviour. Keep the indexed result separate. [URL Inspection](https://support.google.com/webmasters/answer/9012289)
3. Investigate any exclusion against raw/current output. The privacy/noindex, dietary 404 and legacy redirects are expected. Check the alternate hostname and `/menu` versus `/menu/` if Search Console exposes them. Request indexing selectively once a priority canonical is materially updated and passes the live test. Repeat for genuinely unresolved URLs as crawl evidence comes in.

## Deployment verification checklist

- [ ] Owner reviews candidate copy, approved claims, the planned change set and new tests. Hosting records the previous working deployment for rollback. Release only after explicit authorization.
- [ ] Verify project root/build command and environment variable names in Vercel. `RESEND_API_KEY` and `LEAD_TO_EMAIL` are required for lead delivery. Verify an approved sender in `LEAD_FROM_EMAIL` where needed and the optional `PUBLIC_GA4_ID` and `PUBLIC_META_PIXEL_ID` settings. Keep secret values out of reports.
- [ ] From two network paths, verify HTTPS www, apex and HTTP redirects, both legacy paths, and the Vercel project hostname root and a subpage. The candidate expects a single 301 on the public alias to the equivalent www URL. For a secured or accessible preview, ensure unauthenticated content is either protected or served with a noindex header. Confirm canonical production pages have neither a noindex header nor meta.
- [ ] GET all 17 sitemap routes and their metadata plus robots, sitemap index, sitemap child, `menu.json`, both `llms` files, privacy and the gated dietary path. Compare the candidate’s titles, site facts, phone roles and rendered quote copy. Verify privacy noindex and an actual HTTP 404 on the gated route. Check the deployed build identifier/platform revision.
- [ ] Check the live mobile Call and Directions destinations, the three reservation partners for the correct outlet, and the catering quote paths. Record the host and outlet without completing an actual customer reservation.
- [ ] After owner coordination, submit one clearly labelled test quote and verify one accepted response, one inbox receipt, who follows up, and one analytics submission if enabled. Verify a separate restaurant enquiry event and separate booking click proxies in DebugView or equivalent. Exclude test traffic from business reporting.
- [ ] If a priority page becomes inaccessible or enquiry delivery fails after release, capture evidence and decide with the owner whether to repair or restore the previous deployment. After smoke tests pass, start Search Console and the dated measurement panel.
