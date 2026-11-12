# AEO remediation against the 12 November 2026 audit

**Date:** 12 November 2026. **Audit:** `AEO-AUDIT.md` in this folder (63/100). This note records what changed on the site and gives a self-assessed re-score on the same rubric. It is **not** an independent review: the audit says the score changes only after a new review, and no answer engine has been re-tested yet.

## What changed

| Audit item | Change | Where |
|---|---|---|
| P0 purity scope (`src/data/faq.js:70`) | The restaurant answer says the restaurant kitchen is 100% pure vegetarian. Catering is described as `CATERING_DIET` ("vegetarian") everywhere while `IS_CATERING_PURE_VEG` is off: FAQ text, FAQPage JSON-LD, Tamil answers and both llms files. New `/faq/` answer: "Does Brihadhee serve non-veg food?" | `faq.js`, `faq-ta.js`, `spokes.js`, `catering.js`, `llms.js` |
| P0 phone, hours, price framing | The llms files open with a "Canonical answers" block: current phone (supersedes older numbers), 11 AM to 11 PM lunch and dinner only, address, positioning on home-style recipes rather than price. The /about/ contact answer says other numbers are out of date. The legacy number is not printed anywhere. | `llms.js`, `faq.js` |
| P1 `qa()` verbosity | The rules now depend on the question. Fact questions get a 5 to 30-word first sentence and at most 55 words. Explain questions get 8 to 35 words and at most 80. "Yes." or "No." can lead the first sentence. Removed: the 35-word minimum, and the requirement that every answer repeat Anna Nagar, pure veg and a number. Now enforced per page: the address appears in at most one answer, Anna Nagar at least once, and the "100% pure vegetarian" descriptor in at most two answers per language. `aeo-lint.mjs` checks the built pages the same way. | `answers.js`, `scripts/aeo-lint.mjs` |
| P1 build-your-own dosa misread | One canonical definition ("you choose ... the kitchen cooks your dosa to order and serves it at your table ... not a self-service cooking station") appears at the top of `/menu/dosa/`, on the home page, in the home FAQ and in both llms files. The dosa page adds classic vs custom, pricing and the step-by-step order, plus a FAQ: "Is build-your-own dosa a self-service counter?" | `menu-facts.js` (`BYO_DEFINITION`), `pages.js`, `faq.js`, `llms.js` |
| P0/P1 action clarity | `/book-a-table/` says the website takes no bookings, partner apps show the status, and to call for group seating. It gains a 3-question FAQ with JSON-LD. The quote page says the form is emailed and answered with a call, and that there is no automated WhatsApp reply. Every catering enquiry answer ends with a callback, not a promise. | `book-a-table.astro`, `faq.js`, `spokes.js`, `catering.js` |
| P2 dish definitions, first visit | New answers cover what Paanai Parotta is and what to pair it with, what to eat with idiyappam, ghee roast vs paper roast vs podi dosa (the menu has no paper roast, and the answer says so), lunch combos, and what a first-timer should order. `/faq/` gains a "First visit" section linking real menu items. All of it comes from `menu-canonical.ts`. | `pages.js`, `faq.js`, `spokes.js` |
| P1 catering buying answers | One answer separates the two scales: 1,000+ corporate meals a day vs one event from 50 up to 1,500 guests. Other additions: an end-to-end scope answer (transport, vessels and clean-up confirmed on the quote call), price variables with no rupee rate, a lead-time answer ("not published, call"), and a corporate 5-point checklist section with a matching FAQ. | `catering.js`, `spokes.js`, `[slug].astro` |
| Local comparison | New `/faq/` answer: "How is Brihadhee different from other pure veg restaurants in Anna Nagar?" It gives verifiable differentiators only, with no competitor names and no ranking. | `spokes.js` |
| Unconfirmed operations | Parking, delivery, last order, group seating and catering lead time are answered as "not published, call +91 73587 14113" (catering: +91 94442 24999). No value is invented. The parking guard now blocks parking *claims* rather than the word itself, matching `validate-seo-guardrails.js`. The no-onion page still returns 404. | `spokes.js`, `faq.js`, `entity-truth.ts`, `docs/seo/avoid-terms.txt` |
| Tamil and Tanglish | Tamil answers were rewritten to open with a direct answer in everyday wording (ஹோட்டல், மீல்ஸ், கேட்டரிங்), and catering answers say சைவ, not சுத்த சைவ. New: சென்னையில் சிறந்த சைவ கேட்டரிங் எது?, a 50-guest catering Q&A, and the Tanglish "Anna Nagar la dosa customise panna mudiyuma?" | `faq-ta.js` |

Verification on 12 November 2026:
- `npm run build` passes all 9 checks: guardrails, facts, schema, AEO lint, SEO, compliance, links and the link matrix.
- `npm run verify` passes 8 of 8 checks.
- All 17 sitemap routes return 200, `/no-onion-no-garlic-anna-nagar/` returns 404, and both llms files return 200.
- FAQ JSON-LD still equals the visible FAQ on every page (AEO lint check 1).

## Re-score (self-assessed, same rubric)

| Criterion | Max | Audit | Now | Why it moved, and what still caps it |
|---|---:|---:|---:|---|
| Coverage of customer questions | 30 | 18 | 26 | Dish definitions, first-visit, catering scope, scale, price variables, lead time, booking, delivery, parking and Tamil/Tanglish are now answered. Still missing: permitted client names, a proven wedding sample menu, and real answers (not "call") for parking, delivery and last order. |
| Factual accuracy and consistency | 25 | 15 | 21 | The purity contradiction is gone and the site is consistent. Still capped by the outdated phone and morning hours on Instagram, Google Business Profile and directories, which only the owner can correct. |
| Directness and extractability | 20 | 14 | 19 | Short direct first sentences, no forced filler, the address once per page, and a canonical BYO definition. |
| Evidence supporting answers | 15 | 8 | 9 | The checklist is grounded in confirmed process facts. Still no case studies, approved client names, event photos or current third-party corroboration. |
| Answer-to-action clarity | 10 | 8 | 10 | Booking status, quote flow, callback (no automated WhatsApp) and a phone for each unknown. |
| **Total** | **100** | **63** | **85** | |

**Why not 95 yet:** the remaining points depend on owner facts and external evidence, not on site code.

- Answer Q20 (catering purity) and confirm parking, delivery, last order, group capacity, catering lead time and clean-up/vessel inclusions.
- Approve one or two catering case studies (date, size, menu, photos) and the client names that can be shown.
- Correct the phone and hours on Instagram, the Google Business Profile and the major listings.
- Re-run the fixed answer-engine query panel from a documented Chennai context and log the results.
