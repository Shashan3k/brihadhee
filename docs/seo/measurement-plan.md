# Brihadhee 90-day search and enquiry measurement plan

Prepared 14 November 2026. Day 0 is the authorized production release. The SEO lead owns the weekly scorecard and can record `NOT_VERIFIED` until each data owner supplies access or a dated export. Current Google rankings, indexing, demand, Maps interactions, lead counts, and AI-answer rates have no verified baseline in this workspace.

## Baseline and review cadence

1. Before release, archive the most recent 28 complete pre-release days available from Search Console, Google Business Profile, analytics, and operations. Keep dates and reporting time zone for each source. If a report has a lag, end its period on its latest complete day and record the gap.
2. Keep a weekly log by completed Monday–Sunday week in IST for operations, site changes, listing corrections and known issues. Keep each platform's native reporting dates in exports. Annotate holidays, promotions, outages, tracking changes and visible demand shifts.
3. At Days 30, 60 and 90, compare the latest 28 complete days with the saved baseline and preceding review window when both are comparable. Keep mobile and desktop visible. Show counts alongside rate changes and flag small samples, tracking discontinuities and missing data. Review year-over-year evidence only if a comparable historical period exists.
4. Agree commercial targets at the first review with enough baseline data. Track operational targets immediately. Inspect all 17 sitemap URLs, receive and verify a labelled end-to-end test quote, record a disposition for every received enquiry, and complete the answer panel with each attempt or access limitation recorded.

## Scorecard and ownership

| Outcome | Weekly and review-window measures | Source, grouping and owner |
|---|---|---|
| Non-branded organic visibility | Known-query clicks and impressions, CTR as clicks divided by impressions, leading landing pages, and priority queries with recorded impressions. Show counts for any change in CTR. | Search Console Performance, Search type Web, India. Keep mobile and desktop rows with a comparable combined view. SEO lead. |
| Priority query-to-page fit | Query, mapped URL, actual landing URL, clicks, impressions, CTR and average position for pages surfaced. Investigate persistent query/URL mismatch with enough impressions and matching intent. | Search Console query and page exports. Average position is a diagnostic aggregate. India is the report's country scope. SEO lead. |
| Local discovery and Maps engagement | Call button clicks, direction requests, site clicks and completed bookings where the provider reports them. Keep Search/Maps and device breakouts where the source supplies them. | Google Business Profile exports and partner or restaurant records. Observe listing platform and paid activity when interpreting changes. GBP owner. |
| Real enquiries and bookings | Unique valid and qualified catering enquiries by type and channel, unique valid restaurant enquiries, quotes issued, confirmed events or tables, and first-response time when logged. Show valid-to-qualified and qualified-to-quote counts and rates. | Catering inbox or approved CRM, call/WhatsApp dispositions and booking partner or operations confirmations. Catering and restaurant managers. |
| Site conversion steps | Accepted quote/enquiry submissions, booking-page visits from tagged controls and outbound partner clicks. Track organic landing page and source where available. Check the form against actual delivery. | GA4 DebugView at launch and standard aggregate reports thereafter, if configured. Developer and analytics owner. |
| Answer quality | Attempts, usable web answers, mentions, official-site citations, assessed answers and critical error counts by engine surface and prompt group. | Dated scripted panel with exact answers, citations and source evidence. SEO/AEO lead. |
| Release health | Canonical availability, indexed-state evidence, qualified lead delivery, and LCP, INP and CLS where real-user data meets reporting requirements. | HTTP checks, URL Inspection, email receipt plus platform diagnostics and Search Console/CrUX field data. Hosting owner and developer. |

### Query panel

Use the [keyword-to-page map](keyword-to-page-map.md) for boundaries. Preserve exact query rows where visible. For variant-group reporting, document the matches and use mutually exclusive grouping before adding counts.

| Group | Search terms to watch | Intended landing page |
|---|---|---|
| Local dining | `pure veg restaurant anna nagar`, `vegetarian restaurant anna nagar`, `south indian restaurant anna nagar`, `best veg restaurant anna nagar` | `/` |
| Dosa | `build your own dosa chennai`, `customizable dosa chennai`, `dosa anna nagar` | `/menu/dosa/` |
| Nellai lunch | `nellai meals anna nagar`, `veg lunch anna nagar` | `/menu/nellai-meals/` |
| Nellai definition | `what are nellai meals` | `/guides/what-are-nellai-meals/` |
| Event catering | `vegetarian catering chennai`, `south indian catering chennai`, `event catering chennai` | `/catering-services-chennai/` |
| Corporate | `corporate catering chennai`, `office lunch catering chennai`, `office lunch catering` | `/corporate-catering-chennai/` |
| Private functions | `small function catering chennai`, `birthday catering chennai`, `catering for 50 guests chennai` | `/small-function-catering-chennai/` |
| Quote | `catering quote chennai` | `/catering-quote-chennai/` |
| Brand | `brihadhee restaurant`, `brihadhee menu`, relevant brand variants | `/` for restaurant, `/menu/` for menu |

Classify the brand on known query strings using a saved case-insensitive rule, starting with `(?i)(brihadhee|brihadhe+|brihadee)`. Review spelling variants manually and remove matches for unrelated entities. Save revisions to the rule and apply the same version to each comparison period. Exclude unrelated temple queries. Keep the unclassified or hidden query share separate. Anonymized queries and export limits prevent treating the difference between property totals and branded rows as measured non-branded demand. Query rows with no visible data are unknown. [Search Console Performance report](https://support.google.com/webmasters/answer/7576553)

### Business Profile and conversion

- For the verified restaurant profile, save an export of each available field and date window. Where the owner can tag a website link, use stable, non-personal parameters such as `utm_source=google&utm_medium=organic&utm_campaign=gbp`. Log the start date. Report profile clicks separately from resulting site sessions. A Call button click is a contact attempt. Provider confirmations and operating records support actual bookings. [Google Business Profile Performance](https://support.google.com/business/answer/9918094)
- Log a received lead using an internal ID, received date, first known channel, landing or form type when available, service type, date or guest band when known, and disposition. A valid lead is a genuine relevant request with a usable way to reply. A qualified lead meets the agreed service and location fit and gives enough detail to follow up. Keep incomplete genuine enquiries flagged for follow-up. Deduplicate one customer request received through multiple channels. Exclude spam, tests and duplicate requests from business totals. Keep contact details in the restricted operations record. Use aggregate counts in the scorecard.
- Confirm the Phase 9 event cutover in DebugView if GA4 is configured. `catering_quote_submit` records a server-accepted catering form, and `restaurant_enquiry_submit` records a server-accepted restaurant enquiry. `book_table_view_click` records navigation to the booking page through a tagged control. `book_table_click` records an outbound partner click in the candidate. Calls, WhatsApp links and partner clicks are proxies. Use inbox or booking confirmation for outcomes. Earlier builds used `catering_quote_submit` for general enquiries and `book_table_click` for both onsite and outbound booking clicks. Use only a historical segment with verifiable comparable parameters or start a new series at the cutover. [Setup and analytics](../search-console-setup.md)

### Answer-engine panel

Use the nine verbatim questions and optional language checks in the [AI-answer checklist](ai-answer-testing.md). First attempt all nine on each available surface: Google AI Overviews, Google AI Mode, ChatGPT web, Perplexity and web-grounded Gemini. This is up to 45 combinations per batch. Record unavailable surfaces and feature absence, and follow the checklist's fresh-session and Chennai context controls. Run a production baseline before release if available, record the deployed candidate after release and use two independent retest dates initially. Continue monthly and retest a specific error after its source correction.

Show mentions and official-site citations out of usable web answers, and materially accurate answers out of assessed answers. Track wrong restaurant or catering phone, address, hours, diner versus kitchen roles, event capacity, daily office meal volume, invented dietary promises, and booking or quote confirmation by affected source. A generic correct informational answer can omit the restaurant. Record AI-surface evidence separately from general Google clicks. Keep the earlier 63/100 editorial audit and 85/100 self-review in the historical record. [Google AI features and website guidance](https://developers.google.com/search/docs/appearance/ai-features)

## Decision rules

- Escalate an inaccessible canonical route, a wrong contact or a failed live enquiry to the developer or owner when observed. Keep the exact URL, time and evidence. Record validation after correction.
- Investigate a persistent discovery, CTR or lead change only after aligning the dates, intent, device and source data. For a page/query mismatch, review real query-to-page rows before changing titles, internal links or canonicalization.
- Revisit fields and quote copy when valid enquiry records show specific recurring gaps. Revisit listing call or directions actions when a field is demonstrably wrong or interaction data supports a check.
- At Day 90 record which comparisons were measurable, which data remain unavailable and which decisions are supported. Keep any effect claim linked to the underlying observations and known concurrent changes. [Roadmap](30-60-90-day-roadmap.md)
