# 12 Measurement wiring check (21 Nov 2026)

Branch `seo-next-2026-11-21`, cut from `main` at `0d706c1`. This is Phase 1 of `BRIHADHEE-MASTER-PROMPT-LIVE-REPO.md`. **No site code changed in this step.**

## Baseline on this branch

| Check | Result |
|---|---|
| `npm ci` | 192 packages (Node v24.13.0) |
| `npm test` | 33 pass, 0 fail, 1 skipped (the skipped test needs `dist/`) |
| `npm run typecheck` | Pass |
| `npm run build` | Pass. All 10 gates passed: 92 JSON-LD nodes on 20 pages, 18 URLs in the sitemap, 1,854 internal links, 0 SEO warnings |

## Is GA4 ready the moment `PUBLIC_GA4_ID` is set? Yes.

**Method.** I built the site locally with `PUBLIC_GA4_ID=G-TEST000000` and `INDEXNOW_KEY=testkey12345`, then rebuilt without them. Neither value was committed.

| What | Result |
|---|---|
| gtag loader | Present on **19 of 19** built HTML pages, with the given ID (`src/layouts/Base.astro:112-113`) |
| Privacy page | Switches to "We use Google Analytics 4 to count visits and taps…". Nothing needs editing. |
| IndexNow key file | `/testkey12345.txt` is built and contains the key |
| Key events | Each is listed below |

**Where each key event is sent from:**

| GA4 event | Fired by | Meta Pixel twin |
|---|---|---|
| `click_call` | Any `tel:` link (`src/scripts/main.js:644`), e.g. CallBar, LeadForm, QuoteBuilder | Contact (call) |
| `click_whatsapp` | Any `wa.me` / `api.whatsapp.com` link (`main.js:645`) | Contact (whatsapp) |
| `directions_click` | Any Google Maps link (`main.js:646`), e.g. the Footer | FindLocation |
| `book_table_click` | EazyDiner, Swiggy Dineout or District links (`main.js:647`) | Schedule |
| `restaurant_enquiry_submit` | A successful general-form submit (`main.js:594`) | Lead |
| `catering_quote_submit` | A successful catering-form submit, with a headcount band (`main.js:595`) | Lead |

**Two supporting events (not key events):**
- `book_table_view_click`: fires on taps on links to the site's own `/book-a-table/` page (`main.js:648`, the CallBar "Book" button). It is separate from `book_table_click`, which counts taps that go to a booking partner.
- `quote_cta_click`: fires on "Get a quote" buttons (CallBar, `[slug].astro`, `spokes.js`).

Keep both as ordinary events. They show intent, but they aren't bookings or enquiries.

## Still open: owner and account actions

| ID | Action | Why it can't be done here |
|---|---|---|
| D2 | Confirm `RESEND_API_KEY`, `LEAD_TO_EMAIL` and `LEAD_FROM_EMAIL` in Vercel, then send one test enquiry on `/catering-quote-chennai/` | Needs Vercel access |
| D3 | Create the GA4 property, set `PUBLIC_GA4_ID` in Vercel, redeploy, then mark the six events above as key events | Needs the Google account |
| — | Live check of `/api/lead` (should return 405 on GET) | brihadhee.com is blocked from this network. All four live requests (`/`, `/api/lead`, `/robots.txt`, `/sitemap-index.xml`) failed to connect. That's consistent with `09-final-review.md` item 4, and it is **not** evidence of an outage. |

## What is counted

**From the day D3 is done:**
- the six key events above
- sessions and landing pages (GA4)

**Still not counted after D3:**
- phone calls placed from Google Maps or listings. These show only in Business Profile Performance and are reported separately.
- WhatsApp messages started outside the site
- walk-ins
