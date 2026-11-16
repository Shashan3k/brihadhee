## Brihadhee SEO/AEO/GEO ground rules

Site: brihadhee.com, pure-veg South Indian restaurant and caterer, Anna Nagar East, Chennai. Branch for this work: `seo-aeo-geo`. Never push, merge or deploy. Stack and commands: `docs/seo/workflow/00-stack.md`.

**Tracker statuses** (`docs/seo/keyword-tracker.csv`)
- TARGET and SUPPORTING_VARIANT drive page work.
- TRACK_ONLY is measure-only. No "best" claims.
- OWNER_CONFIRMATION, HOLD and APPROVAL_GATED are never published until the owner approves.
- EXCLUDED is never targeted.
- LOCATION_DEPENDENT needs the search location and time recorded.
- SOURCE_NOTE rows are CSV fragments, not keywords.

**Claims**
- Use only facts already verified on the site or in `docs/`.
- Gated topics: onion/garlic-free, Jain, Brahmin/Iyer/Iyengar wording, delivery, takeaway, Swiggy, Zomato, parking, Hindi/Hinglish copy, 2,000-guest catering, the word "premium", seasonal or fasting menus, the Beyond Curry sub-brand.
- Never write "best", "No.1" or award claims, catering rates (explain what moves the price instead), or invented ratings or reviews.
- No AggregateRating schema without verified, dated platform data.

**Data**
- Never fill a Google position, mentioned or cited field without evidence (URL, screenshot path or pasted text). Blank means unverified.

**Hand-off**
- Every step writes to `docs/seo/workflow/NN-name.md`. Anything blocked goes to `docs/seo/workflow/owner-questions.md`.
