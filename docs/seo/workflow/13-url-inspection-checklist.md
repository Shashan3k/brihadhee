# 13 URL Inspection checklist (21 Nov 2026)

This is Phase 2 of the live-repo prompt. It supports `owner-questions.md` **D4** (Search Console) and **D5** (the exports).

**Why it matters.** `11-gsc-baseline.md` cause 1: 11 of the 18 sitemap URLs had zero impressions, and the root cause needs URL Inspection.

**Rule (`CLAUDE.md`).** Leave a cell blank until there is evidence. Each row needs a screenshot saved to `docs/seo/workflow/evidence/url-inspection/` (path in the last column).

**Order.** Request indexing for the D4 ten first. They're marked **R** and listed first. Repeat requests don't help, and there's a daily quota.

| # | URL (from the built sitemap, 21 Nov) | Request indexing | URL is on Google? | Google-selected canonical | Last crawl | Page indexing reason (if not indexed) | Evidence path |
|---|---|---|---|---|---|---|---|
| 1 | https://www.brihadhee.com/ | R | | | | | |
| 2 | https://www.brihadhee.com/menu/ | R | | | | | |
| 3 | https://www.brihadhee.com/menu/nellai-meals/ | R | | | | | |
| 4 | https://www.brihadhee.com/menu/dosa/ | R | | | | | |
| 5 | https://www.brihadhee.com/parotta-anna-nagar/ | R | | | | | |
| 6 | https://www.brihadhee.com/veg-dinner-anna-nagar/ | R | | | | | |
| 7 | https://www.brihadhee.com/family-dining-anna-nagar/ | R | | | | | |
| 8 | https://www.brihadhee.com/about/ | R | | | | | |
| 9 | https://www.brihadhee.com/catering-services-chennai/ | R | | | | | |
| 10 | https://www.brihadhee.com/corporate-catering-chennai/ | R | | | | | |
| 11 | https://www.brihadhee.com/small-function-catering-chennai/ | | | | | | |
| 12 | https://www.brihadhee.com/catering-quote-chennai/ | | | | | | |
| 13 | https://www.brihadhee.com/book-a-table/ | | | | | | |
| 14 | https://www.brihadhee.com/faq/ | | | | | | |
| 15 | https://www.brihadhee.com/guides/what-are-nellai-meals/ | | | | | | |
| 16 | https://www.brihadhee.com/event-planner-catering-partner/ | | | | | | |
| 17 | https://www.brihadhee.com/seasonal/karthigai-ayyappa-pure-veg/ | | | | | | |
| 18 | https://www.brihadhee.com/whats-new/ | | | | | | |

**Old URLs to watch.** They should drop out of Search Console:
- `http://www.brihadhee.com/` (308 to https)
- `/nellai-meals-south-indian-veg-anna-nagar/` (301 to `/menu/nellai-meals/`)

## What to do with the results

| URL Inspection says | Likely cause | Fix |
|---|---|---|
| "Discovered – currently not indexed" | Crawl priority | Add one more contextual link from `/` or `/menu/`. Check `docs/seo/internal-link-matrix.md` for pages with fewer than 3 inbound links. |
| "Crawled – currently not indexed" | Google sees too little unique value | Compare the page's opening answer with `/`'s. Make sure it answers a question the homepage doesn't. |
| "Duplicate, Google chose different canonical" | Consolidation onto `/` | Note which URL Google chose. Then differentiate the title, H1 and opening answer. Don't add canonicals that point elsewhere. |
| "Page with redirect" or a 404 | Old URL in the index | No action. Google is catching up (`11-gsc-baseline.md` §3). |

**Then.** When the D5 exports arrive, run `node scripts/gsc-segment.mjs <new export> <old export>` and record the qualified-cluster numbers in a new `NN-gsc-28d.md`.
