# Brihadhee AEO and GEO implementation

14 November 2026 · Local candidate based on `219a198` · Ready for source review

The Astro site now presents one set of dining facts, a separately described vegetarian catering service and an unambiguous Build Your Own Dosa answer. The existing Coffee Bar edits are included in the worktree and were covered by the browser checks. This candidate is local, with production evidence recorded separately below.

## Implementation

| Area | Change |
|---|---|
| Business facts | Reused `src/data/entity-truth.ts` for the canonical site and entity IDs, restaurant diet, dining phone, exact menu definition and regular dining hours. The separately approved catering contact comes from `config/client-verification.json`. The existing Q20 gate in `config/seo-gates.ts` sets the published catering classification to **vegetarian**. |
| Locations and contacts | Matched the full door-number address to both the owner record and the live first-party address and Restaurant schema. The address is **New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Ward 100, Main Road, Anna Nagar East, Chennai, Tamil Nadu 600040, India**. A page with a visit or contact section links to it from the footer. Other pages carry the address in the footer. Dining is **+91 73587 14113**, **11:00 AM to 11:00 PM daily for lunch and dinner only**. Catering enquiries use **+91 94442 24999**. |
| Dosa and page intent | The homepage FAQ, `/menu/dosa/`, reusable menu section, Menu JSON-LD and both references share the owner's supplied definition. The dosa page answers what it is, what customers can choose, who cooks it and where to order it. Existing FAQ anchors are preserved. The answer says that guests choose their batter and ingredients and kitchen staff cook to order and serve the dosa at the table. The Nellai guide still explains the food and links to the lunch menu. The catering hub describes event arrangements and links to the quote path. |
| Entity graph | The first HTML response contains `https://www.brihadhee.com/#restaurant` on every generated page. The homepage and five catering routes also carry `https://www.brihadhee.com/#catering` as a Schema.org `Service`, with the Restaurant as its provider. Four specialist nodes point to the shared service and carry their own contact and offer details. The quote page uses the shared node as its subject. Restaurant hours use Schema.org day URLs and the menu points to its canonical page. The inline serializer escapes opening angle brackets. [Schema.org Service](https://schema.org/Service) · [Service relationship](https://schema.org/isRelatedTo) |
| Reference files | Existing Astro endpoints build UTF-8 `llms.txt` and `llms-full.txt`. The concise file places the H1, summary and verified answers before links to the primary pages. The full file adds menus, offers and detailed Q&As. Both use the same answer block and link to built destinations. The before and after short files were 13,659 and 3,901 bytes respectively. [llms.txt format](https://llmstxt.org/) |
| Lint and regression protection | The existing linter checks rendered FAQ text and language against its schema. It applies the factual first-sentence and total limits and checks common contradictory business claims, including Tamil dining time ranges. It counts the address and exact diet wording in readable DOM text, including user-expandable answers. It skips authored hidden content, scripts and metadata for density. Restaurant and catering phone labels are checked even in split term/value markup. Source checks and `npm test` cover positive and negative cases alongside the existing build and preview checks. `ultrahtml` was already installed through Astro and is declared directly for these scripts. |

Use [owner confirmations](client-confirmations.md#j-phone-numbers-owner-direction-2026-11-12) and the [live address and hours page](https://www.brihadhee.com/about/) to verify the contact roles and location. The attached research was used for entity and answer design. The handover uses the source-backed 80 priced dishes and current audit measurements.

## Before and after

Counts use readable static text including FAQ disclosures. The address count uses the verified new door number as a marker.

| Page | Live address mentions → candidate | Live exact English diet descriptor → candidate |
|---|---:|---:|
| `/` | 4 → 1 | 6 → 2 |
| `/about/` | 6 → 1 | 3 → 1 |
| `/menu/dosa/` | 2 → 1 | 1 → 1 |
| `/catering-services-chennai/` | 3 → 1 | 0 → 0 |

The live homepage and catering hub had no shared catering ID in their captured HTML. The candidate publishes one shared identity linked to the page-specific service where applicable. The live homepage and dosa page had customized-dosa copy and the candidate uses the exact approved definition in the designated FAQ and definition section.

## Validation

| Check | Status | Evidence |
|---|---|---|
| Production-mode build | PASS | `npm run build` produced 19 HTML pages, 17 sitemap canonicals, 104 top-level JSON-LD nodes and zero SEO warnings. |
| AEO lint, claim gates and facts | PASS | All 19 pages and text outputs passed. The fact guard checked 26 outputs and guarded 11 pending facts. The compliance pass checked 35 prohibited-claim rules and eight active gates. |
| Automated tests and type check | PASS | `npm test` ran 21 tests, including nine new AEO tests. `npm run typecheck` exited zero. |
| End-to-end preview | PASS | All eight required `npm run verify` groups passed with loopback access. The first restricted run passed its static groups and could not start the preview server. |
| Structured data and entity IDs | PASS | Repository validation covered all pages. The official Schema.org vocabulary cross-check covered 28 types and 2,412 property checks. In Schema Markup Validator code mode, the generated homepage, menu and catering hub graphs each returned zero errors and zero warnings. [Schema Markup Validator](https://validator.schema.org/) |
| Google rich-result eligibility | NOT RUN | Verified the documented Restaurant and breadcrumb fields against the candidate. The anonymous Rich Results Test code submission returned “Something went wrong. Log in and try again.” Google retired FAQ rich results in May 2026. [Local business guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business) · [Breadcrumb guidance](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) · [Google Search updates](https://developers.google.com/search/updates#may-2026) |
| Reference file consistency | PASS | Both files passed exact answer, link, UTF-8 and HTTP content-type checks. Both SHA-256 hashes matched across repeated builds. |
| Local canonicals, links and noindex | PASS | The 17 sitemap URLs match the live sitemap inventory. The build checked 1,638 internal links. Privacy and the 404 page remain out of the sitemap. The gated dietary route remains excluded. |
| Local browser regressions and conversion | PASS | Chrome 157 covered 13 routes at 360, 390, 768, 1280 and 1440 px. It checked overflow, headings, form labels, keyboard navigation, the Coffee Bar jump, booking links and mocked successful enquiries. An additional check covered all five catering routes at 320, 390 and 1440 px, including field focus and form retention on 422, a phone fallback on 502, and reset on 200. With JavaScript disabled, the mobile menu fallback and keyboard operation of the dosa FAQ passed. |
| Production sample and redirects | PASS | The homepage, address, dosa, catering hub, robots, both sitemaps and both reference endpoints returned 200 during the baseline fetch. Apex and HTTP redirected with 308, the Vercel alias and both legacy paths redirected with 301, and the gated dietary and arbitrary missing routes returned 404. Privacy returned 200 with noindex. [Live sitemap](https://www.brihadhee.com/sitemap.xml) |
| Complete production HTTP sweep | FAIL | The later full check could not complete because this network reset TLS connections. The candidate's local route and sitemap checks passed. |
| Lighthouse, full outbound link sweep and production enquiry delivery | NOT RUN | Responsive and functional checks were run locally. Live booking, phone calls and email delivery require an authorized production test. |
| Search Console indexing and AI answers for this candidate | NOT RUN | The candidate has no live release. The earlier AEO scores describe editorial reviews. Use the existing query panel for new mentions, citations and factual accuracy. [AI-answer checklist](ai-answer-testing.md) · [Google AI guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) |

## Release checks and remaining work

1. After release approval, verify the 17 sitemap URLs and the two UTF-8 references over HTTPS. Sample the apex and Vercel redirects, both legacy routes, privacy noindex and a real 404. Confirm the candidate IDs and answers in the returned HTML.
2. Run URL mode for the homepage, menu and catering hub in [Schema Markup Validator](https://validator.schema.org/). Run smartphone URL mode for the homepage, `/about/`, `/menu/dosa/` and the catering hub in [Google Rich Results Test](https://search.google.com/test/rich-results). For a pre-release check, paste the corresponding generated `dist` HTML in Code mode. Record detected types, critical issues and warnings separately.
3. Use Search Console URL Inspection for those canonical URLs. Save the live crawl result, last indexed fetch, selected canonical and any reasons in Page indexing. Then use the [AI-answer checklist](ai-answer-testing.md) to repeat the exact dosa, location, timings and catering questions in Chennai. Record mentions and official-site citations separately and capture any stale number with its source.
4. The owner can check the phone on Instagram, Business Profile and dining listings using the [owner action plan](local-seo-owner-action-plan.md). A labelled deployed enquiry still needs an inbox receipt and an assigned callback owner. Catering purity, specific dietary accommodations, last-order time and unpublished event terms remain approval-gated.

## Files created

| File | Purpose |
|---|---|
| `scripts/aeo-rules.mjs` | Shared DOM, fact, density, schema relationship and reference checks. |
| `scripts/aeo.test.mjs` | Nine regression tests for the added rules. |
| `docs/seo/aeo-architecture-report.md` | Implementation, verification evidence and release handover. |

## Files modified

These are the tracked candidate changes. The prior Coffee Bar edits overlap the homepage, Hero, page and catering data, and the generated link matrix.

| File | Change |
|---|---|
| `.github/workflows/check.yml` | Runs the unit suite in the existing CI job. |
| `api/lead.js` | Uses the shared contact role and E.164 formatter for HTML failure recovery. |
| `astro.config.mjs` | Reads the canonical site origin from the verified facts. |
| `config/seo-gates.ts` | Keeps Q20 and the shared scope check and removes duplicate hours and restaurant diet flags. |
| `docs/seo/aeo-lint-report.md` | Regenerated rendered-page and reference results. |
| `docs/seo/internal-link-matrix.md` | Regenerated link counts for the current candidate. |
| `docs/seo/phase-progress.md` | Records the follow-up after the original nine phases. |
| `docs/seo/route-map.md` | Documents shared and specialist entities and authoritative address sections. |
| `package.json` | Adds the AEO tests to the npm test command and declares the parser used by the checks. |
| `package-lock.json` | Records the already installed parser as a direct development dependency. |
| `scripts/aeo-lint.mjs` | Checks actual readable HTML, FAQ equality, density, canonical references and visible definition placement. |
| `scripts/validate-schema.js` | Verifies entity identity, hours, contact scope, relationships and the menu definition. |
| `scripts/verify-seo-compliance.ts` | Reads the canonical hours and shares the scoped catering rule. |
| `src/components/About.astro` | Uses concise street context and the verified restaurant dietary statement. |
| `src/components/AtAGlance.astro` | Uses concise location and separates restaurant cuisine from catering service. |
| `src/components/BuildYourOwnDosa.astro` | Uses the exact definition in the reusable menu section. |
| `src/components/Faq.astro` | Preserves explicit explanation classification for rendered validation. |
| `src/components/Footer.astro` | Links to a visible address section where one is on the page. |
| `src/components/Hero.astro` | Keeps the existing Coffee Bar anchor link in the hero. |
| `src/data/catering.js` | Shares the approved contact resolver and uses locality context in answers. Includes the pre-existing removal of the corporate coffee image. |
| `src/data/entity-truth.ts` | Owns verified contacts, IDs, hours, restaurant diet, the dosa definition and the canonical answers. |
| `src/data/faq-ta.js` | Updates the validation notes for existing Tamil and Tanglish FAQs. |
| `src/data/faq.js` | Uses the canonical dosa definition on the homepage and refers visitors to the address section. |
| `src/data/guides.js` | Uses the verified restaurant diet and concise local context in the Nellai guide. |
| `src/data/pages.js` | Updates dosa questions and restaurant and catering scope wording while retaining Coffee Bar. |
| `src/data/site.js` | Uses the verified address and phone format in the existing site helpers. |
| `src/data/spokes.js` | Reduces address and descriptor repetition while preserving quote and restaurant context. |
| `src/layouts/Base.astro` | Uses the safe JSON-LD serializer in the existing server-rendered layout. |
| `src/lib/answers.js` | Exposes the same answer rules to source and rendered validation. |
| `src/lib/llms.js` | Builds the canonical answers and short page directory, with detailed menus and Q&As in the full reference. |
| `src/lib/menu-facts.js` | Reuses the verified definition and removes competing versions. |
| `src/lib/schema.js` | Emits the shared catering graph and its specialist relationships and aligns Restaurant and Menu data. |
| `src/pages/[slug].astro` | Links the event and planner footer to the local address section. |
| `src/pages/about.astro` | Preserves the authoritative address section and directions and reduces duplicate copy. |
| `src/pages/index.astro` | Links the footer to Visit and retains the existing Coffee Bar section. |
| `src/pages/seasonal/karthigai-ayyappa-pure-veg.astro` | Reuses the restaurant diet and clarifies the summary scope. |

**Diff for review.** Most business logic remains in the existing facts, content and schema modules. The bulk of the new code is in the rendered checks and their regression tests. The report, QA checks and existing Coffee Bar work can be reviewed together in the local diff.
