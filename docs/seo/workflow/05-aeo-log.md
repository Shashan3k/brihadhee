# 05 AEO log

Step 5, 16 November 2026, branch `seo-aeo-geo`. Not deployed.

**Goal:** every ANSWERED prompt (171) answered on its target page with a question heading, then a self-contained 40–60-word answer that states the verified fact first.

**Rules followed:**
- Existing answer rules in `src/lib/answers.js` and `aeo-lint`: names Brihadhee in the first sentence; fact answers at most 55 words.
- Each question appears on one page only.
- The full address appears once per page, and "100% pure vegetarian" at most twice per page.
- No "best" or superlatives. No new prices; every number comes from `menu-canonical.ts`, `entity-truth.ts` or `client-verification.json`.

## Commits

| Commit | Change |
|---|---|
| `8e3f5fb` | `ContentSection` gets `facts` (a short label/value table, reusing the at-a-glance styling) and `checked` (a visible "Last checked" date). The date is always the fact's verification date, never the build date. A sitewide footer line explains the three Tamil terms: sodhi (a Tirunelveli coconut milk stew), ulundhu kali (a sweet made with palm jaggery), paanai parotta (parotta and salna slow-cooked in a sealed pot). |
| `0283572` | Question headings and 40–60-word answer-first leads on the target blocks below. |

## Recorded failures, fixed first

1. **AI-058 "Where can I build my own dosa in Chennai?"** On 12 Nov, the AI Overview cited Instagram, not this page. `/menu/dosa/#how-it-works` now opens with the H2 **"How Do You Build Your Own Dosa at Brihadhee?"** and this lead:
   > "You build your own dosa at Brihadhee on 3rd Avenue, W-Block, Anna Nagar East, Chennai, near Anna Nagar Tower Park, daily from 11 AM to 11 PM. Choose a batter (₹120 to ₹145), add podi and toppings, pick a filling, then a ghee, butter or oil roast. The kitchen cooks it to order and serves it at your table."

   A fact table follows: the price range for each of the 4 steps, "What you pay" (batter plus add-ons, prices exclude 5% GST), "How it works", and "Where and when". **Last checked: 11 November 2026** (date the menu was received). The full step-by-step option list with prices stays below. Nothing is said about chutney or sambar with the dosa: the menu doesn't state it.
2. **AI-062 "Does Brihadhee cater for 50 guests?"** On 14 Nov, Gemini added an unsupported purity claim. `/small-function-catering-chennai/#from-50-guests` now opens with **"Does Brihadhee Cater Functions for 50 Guests?"**:
   > "Yes. Brihadhee caters pure vegetarian functions in Chennai from 50 guests, and up to 1,500 guests at a single event. Its Anna Nagar East team plans a South Indian menu for birthday parties, get-togethers and gruhapravesam (housewarming). Share your date, venue and headcount for a per-plate quote."

   The fact table lists only confirmed items:
   - minimum 50 guests;
   - largest single event 1,500;
   - area Chennai;
   - "Pure vegetarian catering for every order" (the wording approved under Q20 on 15 Nov);
   - price as a per-plate quote, linked to what shapes it;
   - the catering phone.

   **Last checked: 15 November 2026.** Nothing about staff, lead time, Jain or no-onion-no-garlic (Q31, Q32, Q16).

## Every ANSWERED prompt by target block

Heading and lead word count measured on the built HTML: the first paragraph after the target heading.

| Target | Prompt IDs | Heading now | Lead words (before → after) | Status |
|---|---|---|---|---|
| `/` | AI-007, AI-052, AI-068, AI-076, AI-144 | Brihadhee : Pure Veg South Indian Restaurant in Anna Nagar East | 9 → 9 | Answered on the same page by #faq-what-is-brihadhee (47 words) |
| `/#coffee-bar` | AI-296, AI-298 | Brihadhee Coffee Bar, Anna Nagar | 36 → 51 | **Block rewritten** |
| `/#faq-pure-veg` | AI-006, AI-029, AI-037, AI-101 | Is Brihadhee pure veg? | 41 → 41 | Already answered (question heading, answer-first) |
| `/#faq-ta-veg-restaurant` | AI-046, AI-047, AI-049, AI-050, AI-087, AI-088 | அண்ணா நகரில் சைவ தென்னிந்திய உணவு எங்கு கிடைக்கும்? | 28 → 28 | Already answered (Tamil / Tanglish Q&A; Tamil carries more per word) |
| `/#faq-what-is-brihadhee` | AI-028, AI-080, AI-099, AI-100, AI-107 | What is Brihadhee in Anna Nagar? | 47 → 47 | Already answered (question heading, answer-first) |
| `/about/#faq-contact` | AI-036 | How do I contact Brihadhee? | 35 → 47 | **Block rewritten** |
| `/about/#faq-sundays` | AI-024, AI-104, AI-217 | Is Brihadhee open on Sundays? | 35 → 45 | **Block rewritten** |
| `/about/#find-us` | AI-008, AI-009, AI-010, AI-030, AI-054, AI-056, AI-065, AI-067, AI-074, AI-075, AI-079, AI-094 | Where Is Brihadhee in Anna Nagar? | 18 → 57 | **Block rewritten** |
| `/about/#hours` | AI-025, AI-031, AI-057, AI-078, AI-102 | What Are Brihadhee's Opening Hours? | 67 → 57 | **Block rewritten** |
| `/book-a-table/#how-to-book` | AI-041, AI-066, AI-140, AI-174, AI-283 | How Do I Book a Table at Brihadhee? | 39 → 56 | **Block rewritten** |
| `/catering-quote-chennai/#enquiry` | AI-064, AI-194, AI-246, AI-247, AI-249, AI-287 | How Do I Request a Catering Quote from Brihadhee? | 27 → 50 | **Block rewritten** |
| `/catering-services-chennai/` | AI-119, AI-120, AI-146, AI-189, AI-228 | Pure Vegetarian Event and Wedding Catering in Chennai | 42 → 42 | Already answered: page H1 + lead, plus the page's own Q&A |
| `/catering-services-chennai/#end-to-end` | AI-122, AI-149, AI-167 | What Does Brihadhee's End-to-End Event Catering Cover? | 27 → 50 | **Block rewritten** |
| `/catering-services-chennai/#faq-does-brihadhee-cater-outside-anna-nagar` | AI-061 | Where can I find vegetarian catering in Anna Nagar? | 37 → 42 | **Block rewritten** |
| `/catering-services-chennai/#live-dosa-counter` | AI-299 | Can Brihadhee Run a Live Dosa Counter at a Wedding? | 40 → 40 | **Block rewritten** |
| `/corporate-catering-chennai/` | AI-106, AI-118, AI-147, AI-164, AI-168 | Pure Vegetarian Corporate Catering and Office Lunches in Chennai | 40 → 40 | Already answered: page H1 + lead, plus the page's own Q&A |
| `/corporate-catering-chennai/#choose-a-caterer` | AI-121, AI-170 | How Do You Choose a Corporate Caterer in Chennai? | 17 → 53 | **Block rewritten** |
| `/corporate-catering-chennai/#enquiry` | AI-286 | How Do I Get a Corporate Catering Quote from Brihadhee? | 37 → 50 | **Block rewritten** |
| `/corporate-catering-chennai/#faq-corporate-clients` | AI-148, AI-259 | Which companies has Brihadhee catered for? | 24 → 44 | **Block rewritten** |
| `/corporate-catering-chennai/#faq-office-coffee-bar` | AI-297 | Can Brihadhee set up a coffee bar for an office event in Chennai? | 38 → 54 | **Block rewritten** |
| `/corporate-catering-chennai/#process` | AI-063 | How Does Corporate Catering with Brihadhee Work? | 19 → 49 | **Block rewritten** |
| `/corporate-catering-chennai/#scale` | AI-117 | Can Brihadhee Cater 1,000+ Office Meals a Day? | 26 → 52 | **Block rewritten** |
| `/family-dining-anna-nagar/` | AI-015, AI-016, AI-038, AI-077, AI-142, AI-251, AI-252, AI-262, AI-274, AI-280 | A Pure Veg Family Restaurant in Anna Nagar East | 49 → 49 | Already answered: page H1 + lead, plus the page's own Q&A |
| `/faq/` | AI-044, AI-143, AI-195 | Brihadhee Questions and Answers | 39 → 39 | Already answered: page H1 + lead, plus the page's own Q&A |
| `/faq/#faq-how-is-brihadhee-different-from-other-pure-veg-restaurants-i` | AI-059, AI-135, AI-136 | What makes Brihadhee different? | 50 → 50 | Already answered (question heading, answer-first) |
| `/faq/#faq-meal-times` | AI-103 | Does Brihadhee serve breakfast? | 15 → 44 | **Block rewritten** |
| `/faq/#first-visit` | AI-138, AI-161 | What Should I Order on a First Visit to Brihadhee? | 34 → 48 | **Block rewritten** |
| `/guides/what-are-nellai-meals/#what-are-nellai-meals` | AI-060, AI-131, AI-156, AI-157, AI-160, AI-162 | What Are Nellai Meals? | 38 → 51 | **Block rewritten** |
| `/menu/` | AI-032, AI-093 | Brihadhee Menu and Prices | 38 → 38 | Already answered: page H1 + lead, plus the page's own Q&A |
| `/menu/#faq-filter-coffee` | AI-013, AI-014, AI-055 | Does Brihadhee serve filter coffee? | 37 → 45 | **Block rewritten** |
| `/menu/#faq-meal-cost` | AI-018 | How much does a meal cost at Brihadhee? | 38 → 44 | **Block rewritten** |
| `/menu/#faq-ta-filter-coffee` | AI-092 | அண்ணா நகரில் ஃபில்டர் காபி எங்கு கிடைக்கும்? | 20 → 20 | Already answered (Tamil / Tanglish Q&A; Tamil carries more per word) |
| `/menu/#faq-ta-parotta` | AI-090 | அண்ணா நகரில் பானை பரோட்டா எங்கு கிடைக்கும்? | 23 → 23 | Already answered (Tamil / Tanglish Q&A; Tamil carries more per word) |
| `/menu/#price-table` | AI-033 | What Do Dishes Cost at Brihadhee? | 6 → 42 | **Block rewritten** |
| `/menu/dosa/` | AI-005, AI-019, AI-043, AI-058, AI-069, AI-150, AI-151 | Build Your Own Dosa at Brihadhee, Anna Nagar | 48 → 48 | Already answered: page H1 + lead, plus the page's own Q&A |
| `/menu/dosa/#classic-dosas` | AI-071, AI-072, AI-153, AI-154 | Which Classic Dosas Does Brihadhee Serve? | 20 → 51 | **Block rewritten** |
| `/menu/dosa/#faq-ta-byo-dosa` | AI-048 | சென்னையில் என் விருப்பப்படி தோசை ஆர்டர் செய்ய முடியுமா? | 38 → 38 | Already answered (Tamil / Tanglish Q&A; Tamil carries more per word) |
| `/menu/dosa/#faq-tanglish-byo-dosa` | AI-125 | Anna Nagar la dosa customise panna mudiyuma? | 33 → 33 | Already answered (Tamil / Tanglish Q&A; Tamil carries more per word) |
| `/menu/dosa/#how-it-works` | AI-105, AI-109, AI-152, AI-188, AI-260 | How Do You Build Your Own Dosa at Brihadhee? | 42 → 59 | **Block rewritten** |
| `/menu/nellai-meals/` | AI-011, AI-012, AI-070, AI-097, AI-110, AI-113, AI-137, AI-163, AI-254, AI-255, AI-256 | Veg Lunch and Nellai Meals in Anna Nagar | 40 → 40 | Already answered: page H1 + lead, plus the page's own Q&A |
| `/menu/nellai-meals/#faq-ta-nellai-meals` | AI-051, AI-091, AI-185, AI-186 | அண்ணா நகரில் நெல்லை மீல்ஸ் எங்கு கிடைக்கும்? | 40 → 40 | Already answered (Tamil / Tanglish Q&A; Tamil carries more per word) |
| `/menu/nellai-meals/#home-style-lunch` | AI-276 | What Does Brihadhee Serve for a Tamil Home-Style Lunch? | 34 → 51 | **Block rewritten** |
| `/menu/nellai-meals/#sodhi-meals` | AI-261 | What Is in Brihadhee's Nellai Special Sodhi Meals? | 29 → 58 | **Block rewritten** |
| `/parotta-anna-nagar/` | AI-020, AI-021, AI-022, AI-073, AI-096, AI-114, AI-130, AI-158 | Vegetarian Parotta in Anna Nagar | 39 → 39 | Already answered: page H1 + lead, plus the page's own Q&A |
| `/small-function-catering-chennai/` | AI-062, AI-169, AI-193, AI-243, AI-244, AI-245 | Small Function Catering in Chennai, From 50 Guests | 38 → 38 | Already answered: page H1 + lead, plus the page's own Q&A |
| `/small-function-catering-chennai/#from-50-guests` | AI-271, AI-272 | Does Brihadhee Cater Functions for 50 Guests? | 30 → 47 | **Block rewritten** |
| `/small-function-catering-chennai/#menu-for-50-guests` | AI-295 | What Goes on a Pure Vegetarian Catering Menu for 50 Guests? | 38 → 38 | **Block rewritten** |
| `/small-function-catering-chennai/#occasions` | AI-273, AI-282 | Which Small Functions Does Brihadhee Cater? | 20 → 50 | **Block rewritten** |
| `/veg-dinner-anna-nagar/` | AI-281 | Vegetarian Dinner in Anna Nagar, Open Till 11 PM | 38 → 38 | Already answered: page H1 + lead, plus the page's own Q&A |
| `/veg-dinner-anna-nagar/#dinner-favourites` | AI-159 | What Is on Brihadhee's Dinner Menu? | 22 → 57 | **Block rewritten** |
| `/veg-dinner-anna-nagar/#late-dinner` | AI-115, AI-134, AI-176, AI-264 | Is Brihadhee Open for Dinner Until 11 PM? | 29 → 50 | **Block rewritten** |

Blocks rewritten: 31 of 51; prompts covered: 171

**Other blocks changed but not ANSWERED targets:**
- Home lunch and dinner leads, which gained the sodhi, ulundhu kali and paanai parotta glosses.
- `/faq/#first-visit` lead, which gained the sodhi and paanai parotta glosses.

**Hard facts in short tables or lists, with a Last checked date:**

| Facts | Where | Last checked (source) |
|---|---|---|
| Hours | `/about/#hours` table | 11 Nov 2026 (`FACTS.hours.verifiedOn`) |
| Address | `/about/#find-us` | 5 Nov 2026 (`FACTS.address.verifiedOn`) |
| Build Your Own Dosa | `/menu/dosa/#how-it-works` | 11 Nov 2026 (menu source) |
| Catering capacity, area and diet | `/small-function-catering-chennai/#from-50-guests` | 15 Nov 2026 (Q20) |
| Late dinner | `/veg-dinner-anna-nagar/#late-dinner` | 11 Nov 2026 |

The existing lists were left as they were: the quote page's "50–1,500 guests per event", the "What Shapes Your Per-Plate Quote" factors, the Nellai meal contents and the guide's sodhi and ulundhu kali sections.

## LOCATION_DEPENDENT prompts (10)

| IDs | Target | What the page now answers directly |
|---|---|---|
| AI-023, 179, 284 ("open now") | `/about/#hours` | "Open every day, Monday to Sunday, from 11 AM to 11 PM, serving lunch and dinner only", a day-by-day table and Last checked |
| AI-026, 027, 177 ("near me") | `/about/#find-us` | Street, landmarks (Anna Nagar Tower Park, 3rd Avenue and 9th Street, Aadhaar Seva Kendra), "open every day from 11 AM to 11 PM", phone and directions links |
| AI-178 | `/menu/dosa/` | How-it-works lead: street, landmark and daily hours |
| AI-180 | `/menu/nellai-meals/` | Home-style lunch lead: "served daily from 11 AM on 3rd Avenue, W-Block, Anna Nagar East" |
| AI-181 | `/veg-dinner-anna-nagar/` | "Yes. Brihadhee serves dinner every day until 11 PM on 3rd Avenue, W-Block, Anna Nagar East, near Anna Nagar Tower Park" |
| AI-182 ("caterers near me") | `/catering-services-chennai/` | Area (Chennai), Anna Nagar East base and catering phone. Real-world results still depend on the searcher's location, which the measurement plan records. |

## What remains blocked

- **75 APPROVAL_GATED and OWNER_CONFIRMATION prompts:** no public copy was written. Drafts, marked DO NOT PUBLISH and linked to Q11–Q14, Q16, Q17, Q21, Q22, Q25, Q27, Q31–Q34, Q36 and Q37, are in [`05-gated-drafts.md`](05-gated-drafts.md).
- **AI-144 (Beyond Curry):** blocked on Q26. **AI-143 (Swiggy or Zomato):** delivery wording blocked on Q25. **AI-247 (WhatsApp quote):** blocked on Q19. Existing copy was left as it is (see the drafts file).
- **AI-153 "difference between ghee roast and paper roast":** paper roast is EXCLUDED, so the answer covers only the dosas on the menu.
- **Page-level targets** (the page itself, no anchor) keep their keyword H1s. Turning H1s into questions would weaken the primary keyword. Each page's lead (38–49 words) and its own Q&A answer these prompts.
- **Tamil and Tanglish Q&A** (20–40 words) were not lengthened. Tamil carries more meaning per word, and the existing answers pass the answer rules.

## Verification

- `npm run build`: all checks pass, including the facts guard. The guard rejected "no breakfast service" on `/about/`, so that wording was removed.
- `npm test`: 30 of 30 passed. `npm run typecheck`: passed.
- `npm run verify`: checks 1–7 pass. Check 8 (preview server) timed out on the known 40-second start-up on /mnt/c; it was verified by hand in Step 4.
- 360 px render of `/small-function-catering-chennai/`, `/menu/dosa/` and `/about/`: no horizontal overflow, and the fact tables and footer glossary are readable.

## Skills used

`anthropic-skills:aeo`, `claude-seo:seo-geo` and `claude-seo:seo-content` apply. Their rules (answer-first, 40–60-word self-contained passages, entity named in the first sentence, no superlatives) were applied through the repo's own answer rules and `aeo-lint`. The skill files were not loaded separately.
