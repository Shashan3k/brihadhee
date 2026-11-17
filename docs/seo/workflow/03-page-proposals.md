# 03 Page proposals (not built)

Step 3 does not create new pages. These proposals cover P1 keywords whose tracker target is an `#anchor` while Google ranked a different page. Build one only when its trigger is met.

## P-01 Brihadhee Coffee Bar page

| Item | Detail |
|---|---|
| Proposed URL | `/coffee-bar-anna-nagar/` |
| Tracker IDs | SEO-P03 "Brihadhee Coffee Bar Anna Nagar" (P1), SEO-125 "Filter coffee Anna Nagar" (P1), SEO-P04 "filter coffee near Anna Nagar Tower Park" (P2), AI-298 |
| Current target | `/#coffee-bar`, a fragment. Google reports the URL, so the fragment can never rank on its own. |
| Evidence | 16 Nov sample: SEO-P03 ranked `/about/` at 9. SEO-125 wasn't checked, and SEO-P04's domain was absent from the top 30 while an Instagram post ranked 1st (xlsx `SEO rankings`). That sample came from Kaniyakulam, and the site was not yet re-indexed. |
| What Step 3 did first | The home H2 is now "Brihadhee Coffee Bar, Anna Nagar". `/about/` links to `/#coffee-bar` with the anchor "Brihadhee Coffee Bar". `/about/` no longer carries the exact "Brihadhee Anna Nagar" phrase (commits `a979b6e`, `a802863`). |
| Trigger to build | After Search Console shows `/` indexed with the new title, **two consecutive Anna Nagar checks** (`02-measurement-plan.md`, queries 7 and 8) still show a page other than `/` as the first official result for SEO-P03, or no official result for SEO-125. |
| Why a page might be needed | The topic is a named, location-specific offer. On home it's one short section among 15 topics, and the corporate page has a separate office coffee-bar section that competes for "coffee bar". |
| Risk | Thin content. The verified material is the drinks list and serving times. Build only if a page can carry about 300 words of verified, useful content without padding. |

**Outline (verified facts only; prices exactly as published on `/menu/#beverages`):**

1. **H1:** Brihadhee Coffee Bar in Anna Nagar East.
2. **Lead (40–60 words):** where it is (3rd Avenue, W-Block, near Anna Nagar Tower Park), the South Indian filter coffee brewed with a traditional filter, and serving during lunch and dinner, 11 AM to 11 PM daily.
3. **H2 Drinks and prices:** the 5 beverages from `menu-canonical.ts` (filter coffee, tea, lemon tea, plain milk, black coffee), with the GST note.
4. **H2 When to visit:** daily hours, lunch and dinner only, no breakfast (verified).
5. **H2 Find the Coffee Bar:** address, landmark and directions link (`/about/#find-us`).
6. **H2 Coffee bar for office events:** two sentences and a link to `/corporate-catering-chennai/#coffee-bar`.
7. **FAQ (FAQPage):** "Does Brihadhee serve filter coffee?" and "Where can I get filter coffee near Anna Nagar Tower Park?" Move these from `/menu/#faq-filter-coffee` and `/#coffee-bar` rather than duplicating them.
8. **Internal links in:** the home Coffee Bar section ("Visit the Coffee Bar page"), `/menu/#beverages` and the footer.
9. **Not included:** no "best" wording, no new prices, no seating or Wi-Fi claims (unverified).
