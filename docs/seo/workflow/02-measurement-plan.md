# 02 Measurement plan: 20 priority queries, monthly

Written 16 November 2026. **Why:** Google reported the 16 Nov live sample (13 queries, 4 positions) as taken from Kaniyakulam, not Chennai, so local results aren't comparable. Its evidence column holds re-runnable search URLs rather than captures. This plan replaces it as the baseline. The ground rules apply: a blank field means unverified, and no position, mention or citation is entered without a screenshot path, URL or pasted text.

## Fixed conditions (every check, every month)

| Item | Setting |
|---|---|
| Location | Physically in **Anna Nagar East, Chennai**, within about 1 km of Anna Nagar Tower Park. No VPN. Phone location services on. The Google results footer must read Anna Nagar or Chennai. Screenshot it. If it shows anywhere else, stop and record "location not confirmed". |
| Device | **Android phone, Chrome Incognito** (primary). Optional second pass on a desktop Chrome Incognito window on the same Wi-Fi, recorded as a separate row. |
| Signed-out state | Google, Gemini and Perplexity: signed out in a fresh incognito window. ChatGPT Search: signed out at chatgpt.com with Search on. If sign-in is forced, use a dedicated test account with memory, history and custom instructions off, and record "signed in: test account". |
| Language and region | Google `hl=en`, `gl=in`. Do not add `&near=` or other location parameters. |
| Time | Same window each month, **12:00–14:00 IST on a weekday**. Record the exact time (needed for LOCATION_DEPENDENT and "open now" behaviour). |
| Order | Run Google Web first, then AI Overview (same results page), AI Mode, ChatGPT Search, Gemini, Perplexity. Use a fresh window or chat per query so earlier answers don't carry over. |
| Cadence | Monthly, first weekday of the month. Also one extra run **2 weeks after roadmap task 3.0** (Search Console re-indexing) and **2 weeks after each on-page release**. |

## The 20 queries (exact wording, type exactly as written)

| # | Tracker ID | Exact query or prompt | Priority, status | Expected official page | Why it's in the panel |
|---|---|---|---|---|---|
| 1 | SEO-001 | brihadhee anna nagar | P1 TARGET | `/` | Wrong page on 16 Nov (`/catering-services-chennai/`, position 11) |
| 2 | SEO-002 | brihadhee restaurant | P1 TARGET | `/` | Brand |
| 3 | SEO-003 | brihadhee menu | P1 TARGET | `/menu/` | Wrong page on 16 Nov (`/menu/nellai-meals/`, position 7) |
| 4 | SEO-004 | brihadhee timings | P1 TARGET | `/about/` (#hours) | Accuracy: 6:30 AM and "closed Sundays" errors |
| 5 | SEO-010 | brihadhee contact number | P1 TARGET | `/about/` | Accuracy: outdated 95661 35405 |
| 6 | AI-100 | What is Brihadhee in Anna Nagar? | P2 ANSWERED | `/` (#faq-what-is-brihadhee) | Brand answer accuracy |
| 7 | SEO-P03 | Brihadhee Coffee Bar Anna Nagar | P1 TARGET | `/` (#coffee-bar) | Wrong page on 16 Nov (`/about/`, position 9) |
| 8 | SEO-125 | Filter coffee Anna Nagar | P1 TARGET | `/` (#coffee-bar) | Coffee Bar, unbranded |
| 9 | SEO-032 | pure veg restaurant in Anna Nagar | P1 TARGET | `/` | Core unbranded restaurant query |
| 10 | SEO-033 | South Indian restaurant in Anna Nagar | P1 TARGET | `/` | Core unbranded restaurant query |
| 11 | SEO-282 | pure veg restaurant near me | P2 LOCATION_DEPENDENT | `/` | Near me (location and time required) |
| 12 | SEO-284 | dosa near me | P2 LOCATION_DEPENDENT | `/menu/dosa/` | Near me |
| 13 | SEO-P01 | Build Your Own Dosa Chennai | P1 TARGET | `/menu/dosa/` | Signature concept, absent from top 30 on 16 Nov |
| 14 | AI-058 | Where can I build my own dosa in Chennai? | P1 ANSWERED | `/menu/dosa/` | AI Overview recommended Brihadhee on 12 Nov but cited Instagram |
| 15 | SEO-085 | Nellai meals Anna Nagar | P1 TARGET | `/menu/nellai-meals/` | Lunch offer |
| 16 | AI-060 | What are Nellai meals? | P1 ANSWERED | `/guides/what-are-nellai-meals/` | Informational AEO |
| 17 | SEO-P06 | vegetarian catering Chennai | P1 TARGET | `/catering-services-chennai/` | Catering hub, absent from top 30 |
| 18 | SEO-P07 | vegetarian catering Anna Nagar | P1 TARGET | `/catering-services-chennai/` | Page 2 (position 12) from a non-Chennai location |
| 19 | SEO-151 | corporate catering Chennai | P1 TARGET | `/corporate-catering-chennai/` | Corporate catering |
| 20 | SEO-224 | catering for 50 guests Chennai | P1 TARGET | `/small-function-catering-chennai/` | Small functions (27 P1 rows on this page) |

Run all 20 on **all six surfaces**: Google Web, Google AI Overview, Google AI Mode, ChatGPT Search, Gemini and Perplexity. That's 120 checks a month. An AI Overview that doesn't appear is recorded as "No AI Overview shown", not left blank.

## What to capture

**Google Web (xlsx sheet `SEO rankings`)**

| Field | Rule |
|---|---|
| Checked on | Date plus time (IST) |
| Location / device | Location shown in the Google footer, device, browser, "signed out" |
| Google position | Count **organic web results only**, top to bottom across pages. Do not count ads, the local pack, AI Overview, People also ask, video, image or "Things to know" blocks. Enter the position of the **first `brihadhee.com` result**. Blank plus a note "not in top 30" if absent after 3 pages. |
| Google results page | 1, 2 or 3 |
| Ranking page | The exact URL opened by **clicking** the result. Not inferred from the breadcrumb. |
| Local pack | Separate note: is Brihadhee in the map pack, and in which slot? |
| Other Brihadhee results | Instagram, Zomato, Swiggy and others with their positions (shows who outranks the site) |
| Evidence link | Path to full-page screenshots: `docs/seo/workflow/evidence/YYYY-MM/<ID>_google.png`, including the footer that shows the location |

**AI surfaces (xlsx sheet `AEO tracking`, one row per engine)**

| Field | Rule |
|---|---|
| Engine checked | Google AI Overview, Google AI Mode, ChatGPT Search, Gemini or Perplexity, plus the model or mode shown |
| Brihadhee mentioned? | Yes or No, from the captured answer only |
| Official page cited? | Yes (with the exact `brihadhee.com` URL), "domain only", or No. List every other cited source URL in Notes. |
| Answer list position | Brihadhee's position in a recommendation list, or "n/a (single answer)" |
| Facts correct? | Check against the site: phone +91 73587 14113 (dining) and +91 94442 24999 (catering), 11 AM–11 PM daily, lunch and dinner only, address 3rd Avenue, W-Block, Anna Nagar East, pure vegetarian. Catering is 50–1,500 guests per event, and 1,000+ corporate meals a day. Flag every error word for word (e.g. "closed on Sundays", "breakfast", "100% Jain"). |
| Location / mode | Signed-out state, search on or off, location shown if any |
| Evidence link | Screenshot of the full answer with sources expanded, plus a share link where the engine offers one, plus the answer text pasted into `evidence/YYYY-MM/<ID>_<engine>.md` |

**Also record every month:** Search Console Performance (Web, India, last 28 days) for the 20 queries (clicks, impressions, CTR, average position) and the page each one maps to. Average position is a period average and doesn't replace the dated capture.

## How results are read

- A position counts only when the location footer confirms Anna Nagar or Chennai.
- **Wrong-page fixed** means the first official URL equals the expected page for queries 1, 3 and 7 on two consecutive runs.
- **AI citation won** means the official URL is cited, not just the brand mentioned.
- **Accuracy fixed** means no factual error in the answer, even if it is uncited.
- TRACK_ONLY rows (such as "best dosa in Anna Nagar") may be added as extra observations but never drive page work.
