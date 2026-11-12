# Brihadhee answer engine optimization audit

**Date:** 12 November 2026. **Scope:** Customer questions and answer-engine responses only. The source brief is `keyword (1).md`, especially section 4. The earlier `GEO-ANALYSIS.md` is a separate, broader review; its 67/100 is **not** the AEO score.

## Result and scoring

**AEO website answer quality: 63/100.** This is a transparent editorial score for the current site's ability to answer the supplied questions. It is **not measured AI visibility or share of recommendations**. The limited live tests below are reported separately and are not extrapolated into this score.

| Criterion | Maximum | Awarded | Assessment |
|---|---:|---:|---|
| Coverage of customer questions | 30 | 18 | Core brand, menu and service questions covered; important catering buying, practical visit, dish-definition and local questions remain partial or unanswered |
| Factual accuracy and consistency | 25 | 15 | On-site hours/menu generally current; catering purity overclaim and conflicting external facts affect answers |
| Directness and extractability | 20 | 14 | Static HTML, clear headings and FAQs help; formulaic repeated details dilute short answers |
| Evidence supporting answers | 15 | 8 | Real menu, photos and reviews exist; catering scale and service claims lack enough attributable examples |
| Answer-to-action clarity | 10 | 8 | Booking, call and quote routes exist; some service terms and response channel remain vague |
| **Total** | **100** | **63** | **Manual website AEO score** |

Scoring rule: each criterion starts at zero; points represent observed completeness across the keyword document, accuracy against the project's confirmed facts, and whether a customer could use the answer without guessing. Gated questions are assessed as appropriately withheld, not as a mandate to publish unsupported claims. The score will change only after a new review, not automatically when edits ship.

## Live answer-engine tests

All tests were run 12 November 2026 with a fresh, unsigned in-app browser. Results can vary by time, account and location. Google displayed Chennai for the query but the browser's IP footer showed Kaniyakulam, so this is not a controlled Chennai-local user study.

| Engine | Exact query and observed result | Brihadhee mentioned? | Own website cited? | Accuracy |
|---|---|---|---|---|
| Google AI Overview | “where can I build my own dosa in Chennai” → recommended Brihadhee in Anna Nagar | **Yes** | **No**; visible citation was Instagram | Gave phone **95661 35405**, rather than the project's current restaurant phone **73587 14113**; also called it budget friendly |
| ChatGPT web response | “Where can I build my own dosa in Chennai? Please search the web and cite sources.” → recommended Dunk'd, Dosa Delights, Live Dosa, Krishna's Dosa Kadai and Coal Barbecues | **No** | **No** | It interpreted “build your own” as potentially a self-service cooking station, which Brihadhee does not claim; still missed Brihadhee's customer-selected batter/toppings offer |
| Perplexity | Submitted “Where can I build my own dosa in Chennai?” | **No usable result** | Unknown | A sign-in gate replaced the answer. No presence or absence conclusion is drawn |

One observation per available engine is a diagnostic example, not a recommendation rate. The project also has dated **9 November** tests in `docs/geo/visibility-log.csv`; those are historical and not combined with today's results. Google AI Overview and Google AI Mode are different products, so the prior AI Mode result is not a second Overview test.

The Google test is particularly instructive: Brihadhee was found, but Instagram supplied outdated contact and price positioning. The ChatGPT test shows a query interpretation issue. Make the site explicitly explain that guests choose ingredients and staff prepare the dosa; it is not a self-service cooking counter. Seek current third-party references that repeat the same accurate concept and contact details.

## Question coverage from section 4 of the keyword document

**Status key:** Answered = a clear, supported site answer; Partial = related content exists but a key fact or direct response is missing; Missing = no dependable on-site answer found; Gated = the brief itself requires business/kitchen confirmation before claiming it. “Best” and competitor questions cannot be answered as objective superiority claims; Brihadhee can state verifiable differentiators. Equivalent phrasings in English, Tamil and Tanglish share one underlying answer but still need natural language treatment.

### 4.1 Discovery questions

| Questions in the brief | Status | Evidence / gap |
|---|---|---|
| Best pure veg / South Indian restaurant in Anna Nagar for lunch or dinner; authentic Tamil meals; good dosa | Partial | Home, menu, Nellai and dinner pages establish suitability, but “best” is subjective; use verifiable specialties rather than self-awarded rank |
| Where to build/customise a dosa in Chennai or Anna Nagar | Answered | Dedicated dosa page explains customer choices; clarify that staff cook the selected combination |
| Nellai meals, sodhi and idiyappam in Chennai | Answered | Dedicated meals page and guide; verify exact current serving and time |
| Paanai Parotta, veg kothu parotta | Partial | Menu/dinner mention the dishes; Paanai needs a concise verified definition and serving details |
| Pure veg family lunch, large groups | Partial | Family page exists; group capacity, seating and booking practicalities not confirmed |
| Open late / dinner until 11 PM | Partial | 11 PM closing is clear; last order and evening dish availability are unknown |

### 4.2 Brand questions

| Questions | Status | Evidence / gap |
|---|---|---|
| What is Brihadhee, where, famous for, what to order, dosa customization, Nellai meals, Beyond Curry | Answered | Home/About/menu/FAQs have direct answers; keep the current menu as source |
| Pure veg / non-veg | **Contradictory** | Restaurant purity is supported, but homepage FAQ extends the guarantee to all catering menus while catering policy remains gated |
| Hours and breakfast | Answered on site | 11 AM–11 PM and lunch/dinner only are clear; older external records conflict |
| Open Sunday | Partial | Site says daily; older GBP/verification notes differ. Confirm days against owner and GBP |
| Good? family/group suitability | Partial | Positioning and public reviews exist; avoid promising facilities or an objective rating not verified |
| Delivery, parking | Missing | Project FAQ source explicitly marks these unverified; directory claims alone are insufficient |
| Table booking | Answered | `/book-a-table/` provides the booking route; clarify whether a request is instant confirmation |
| Swiggy/Zomato | Partial | Third-party listings exist; direct current availability/links should be confirmed and answered |
| Corporate/event catering, how many guests | Answered with evidence gap | Dedicated pages and minimum 50 guests; distinguish current daily output from maximum event capacity |
| Which companies are catered to | Missing | No approved client list or case study names; require permission |
| End-to-end event catering | Partial | Service is claimed; exact inclusions, staffing, setup and cleanup need definition |

### 4.3 Dish and definition questions

| Questions | Status | Evidence / gap |
|---|---|---|
| What is build-your-own/customized dosa, how to customize, how many types | Answered / partial | Dosa page explains current batter/option system; distinguish classic menu items from possible combinations and explain ordering in one short answer |
| What are Nellai meals and sodhi | Answered | Dedicated guide and menu answer these directly |
| Ulundhu kali, paanai parotta, kothu idiyappam | Partial | Items are named; individual short definitions, ingredients and serving context need chef verification |
| Ghee roast vs paper roast, podi dosa, Tirunelveli cuisine generally | Missing or weak | Site is a menu, not an authoritative general cuisine guide; cover only where Brihadhee has firsthand expertise |
| First-time order, what goes with idiyappam, typical Tamil veg lunch | Partial | “What should I order?” and meals copy help; add practical pairing/first-visit guidance using real menu items |

### 4.4 Catering questions

| Questions | Status | Evidence / gap |
|---|---|---|
| What is end-to-end/full-service catering; what is included | Partial | Page says end-to-end and mentions staff/live counters; inclusions, transport, vessels, setup and cleanup need precise scope |
| Choosing a corporate/office caterer; birthday planning | Partial | Brand service content exists; practical checklist from Brihadhee's experience is thin |
| Corporate/veg cost per head | Partial | Site says quotes vary by headcount/menu/service; this is appropriate. Add tax/travel/inclusion factors after confirmation; do not invent a rate |
| Booking lead time for wedding or 50 people | Missing | Owner confirmation required |
| South Indian veg wedding menu | Partial | Menu provides dishes; a proven sample event menu is absent |
| Can a caterer handle 1,000 daily | Partial | Brihadhee makes the claim; clarify actual current volume and provide evidence |

### 4.5 and 4.6 Local, voice and language questions

| Questions | Status | Evidence / gap |
|---|---|---|
| Anna Nagar food scene, popular dishes, vegetarian suitability | Partial | Brihadhee's local positioning exists; no need for generic “best of Anna Nagar” filler |
| Reservations | Answered for Brihadhee | Booking page; avoid claiming which other restaurants take reservations |
| Parking | Missing | Do not infer from a directory tag |
| Dinner after 9 PM | Partial | Hours are present; last order unknown |
| “Near me”, English voice variants | Partial | Location and service facts support the answer; actual engine display depends on user location |
| Tanglish and Tamil dosa/Nellai/vegetarian/catering questions | Partial | Some Tamil answers exist, but not all variations have a natural direct answer; fluent review needed. Translation alone does not establish answer-engine presence |

### 4.7 Draft answer snippets

The draft table is a set of proposed answers, not proof they were published. Timings, breakfast, dosa, Nellai, corporate/event service, minimum 50 and quote inputs now have site answers. Pure-veg scope is contradictory. No-onion/no-garlic and Jain drafts are gated. The draft quote text promises WhatsApp replies, while the current site describes a form and callback/email-led workflow; state only the verified current flow. The brief's “Does Brihadhee serve non-veg?” needs separate restaurant and catering scopes.

### 4.8 Dietary questions

All discovery, dish suitability, brand, catering and multilingual questions about **no onion, no garlic, Jain, satvik, root vegetables and live dosa counters for weddings** are **gated or partial**, including whether specific dosa, idli, sambar, chutney, podi, parotta or Nellai meals qualify. There is no confirmed ingredient and preparation audit. The gated landing page correctly returns 404. Publishing confident “yes” answers now would lower factual accuracy. Generic definitions of Jain/satvik food can be written carefully, but they do not prove Brihadhee can serve them. Marwari identity should not be equated with one dietary rule.

### 4.9 Catering quote, occasions and lunch

| Questions | Status | Evidence / gap |
|---|---|---|
| Small-function catering, 50-person minimum | Answered | Dedicated page and FAQ; verify same minimum across all service types |
| Quote inputs, service staff, variable cost | Answered / partial | Quote page captures key requirements; response channel and what staff service includes need clarity |
| WhatsApp quote request | Missing for current site | Brief describes a planned flow. Do not claim it is live without verification |
| How far ahead for 50 guests | Missing | Owner fact needed |
| Temple-visit/family occasion dining | Partial | Family and seasonal content fit; do not assert suitability for every observance |
| Lunch combos and quick office lunch | Partial | Menu includes combos, but current contents, hours and expected speed need a direct answer |
| Brihadhee vs Geetham / better family dinner | Partial | No objective superiority answer. Compare verified characteristics only, without inventing competitor facts |

## Accuracy and answer design issues

1. **Critical scope error:** `src/data/faq.js:70` states that no meat, egg or fish is present on *all catering menus*. `IS_CATERING_PURE_VEG` remains off. Fix visible text and generated FAQ schema/summary together.
2. **Current facts versus older sources:** Google AI Overview supplied an outdated number. External directory descriptions still contain breakfast or conflicting hours. Correct owner-controlled listings and source content; historical customer reviews should remain historical.
3. **FAQ verbosity:** The `qa()` helper requires 35–60 English words, a 15–35-word first sentence and repeated entity facts. This makes simple answers less direct. Let answer length follow the question. “No. Brihadhee serves lunch and dinner, from 11 AM to 11 PM” is a complete breakfast answer.
4. **Unproved operational details:** Parking, delivery, last orders, booking lead time and full-service catering inclusions cannot be filled from assumptions.
5. **Definition ambiguity:** “Build your own” can be read as a self-service station. Explicitly say the guest selects batter and additions and Brihadhee's kitchen prepares it.

## Extractability and citation assessment

**Strengths:** All 17 sitemap pages returned 200 and matched the current build; content is visible in rendered HTML, canonical URLs are correct, headings describe topics, internal links connect relevant pages and visible FAQs match generated structured data. The current menu is sourced from one canonical file. This makes on-site answers straightforward to retrieve.

**Limitations:** A technically retrievable answer is not necessarily selected by an engine. The Google Overview used Instagram, while ChatGPT chose other businesses. Repeating a first-party claim in schema, FAQs, llms files and multiple pages does not create independent corroboration. First-party case studies and current third-party descriptions will help the engines verify distinctive claims. Structured data should describe visible facts; FAQ markup does not guarantee special presentation.

Google's current guide says AI features use Search's core retrieval and quality systems and recommends useful firsthand content. It does not prescribe special AI markup or fixed answer lengths. [Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

## Prioritized AEO action plan

| Priority | Action | What a completed answer would contain |
|---|---|---|
| P0 | Correct restaurant/catering purity scope | A clear restaurant answer and a separately approved catering policy |
| P0 | Fix outdated contact and breakfast/hours information at owner-controlled sources | Same current restaurant phone, hours and menu across site, GBP, Instagram and major listings |
| P1 | Clarify build-your-own dosa in one direct sentence near the top of the dosa page | Guest chooses current batter/ingredients; staff prepare it; current menu choices and price method |
| P1 | Complete small-function and corporate catering buying answers | 50+ minimum, actual service inclusions, lead times, quote inputs, price variables, response process |
| P1 | Add verifiable catering examples | Approved event size, date, menu, operational details and original imagery |
| P1 | Resolve practical visit questions | Sunday, last orders, parking, delivery, booking confirmation and group seating from owner facts |
| P2 | Improve dish definitions and first-visit advice | Chef-verified Paanai, ulundhu kali and kothu idiyappam explanations and useful pairings |
| P2 | Remove forced FAQ filler; review Tamil answers | Short direct responses where possible; natural Tamil/Tanglish wording |
| P2 | Repeat a fixed answer-engine query panel and record leads | Date, prompt, location, engine, mention, own-site citation, source and factual errors; separate referral/self-reported leads |
| Hold | Publish Jain/no-onion/no-garlic claims | Only after dish, accompaniments, spice mixes and preparation are confirmed |

For measurement, rerun the **same** brand, dosa, Nellai, 50-person catering, corporate and family-dinner questions across platforms from a documented Chennai context. Keep branded and non-branded prompts separate. Record answers and citations, then tally the number of tested prompts; do not infer a percentage from one response.

**Owner confirmations required:** catering purity and sourcing; Sunday hours; restaurant and catering phone roles; last order; delivery; parking; group capacity; service inclusions; lead times; terms; current combo details; permitted client names; dietary capabilities. None should be invented merely to close a content gap.

This report is an audit. No website content or external listing was changed.
