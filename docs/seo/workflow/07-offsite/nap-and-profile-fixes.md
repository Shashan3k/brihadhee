# NAP and profile fixes

Prepared 16 November 2026. "Current" values come from `docs/geo/presence-audit.csv` (seen 5 Nov 2026), `docs/seo/local-seo-owner-action-plan.md` (14 Nov snapshots) and `docs/geo/claims-watchlist.md`. Blank or "unknown" means it wasn't observable. Check it on the platform before changing anything.

**Correct values (single source: [`/about/#facts`](https://www.brihadhee.com/about/#facts))**

| Field | Value |
|---|---|
| Name | Brihadhee |
| Address | New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Ward 100, Main Road, Anna Nagar East, Chennai, Tamil Nadu 600040 |
| Dining phone | +91 73587 14113 (also WhatsApp) |
| Catering phone | +91 94442 24999, labelled for catering only |
| Hours | Monday to Sunday, 11 AM to 11 PM, lunch and dinner only |
| Food | Pure vegetarian; no meat, egg or fish; no alcohol |
| Website | https://www.brihadhee.com/ |
| Menu | https://www.brihadhee.com/menu/ |

**Who does it:**
- **Owner:** the business owner or whoever holds the platform login.
- **Owner + support:** submit a correction through the platform's business support.
- **Dev:** a website change.

## Re-check of 17 November 2026

Method: curl with a Chrome user agent, reading server HTML and JSON-LD. No logins. Full notes: [`../evidence/2026-11-17/listings.md`](../evidence/2026-11-17/listings.md). Dated rows: `docs/geo/corrections-log.csv`.

| Row | Status on 17 Nov |
|---|---|
| #1 Instagram 95661 35405 | **Still seen** in an "Order Now" post caption. Seen only through a summarising fetch; the raw page was blocked. |
| #3 Justdial | **Changed.** A "Brihadhee" listing now exists, with 11 AM–11 PM hours but address typos ("New Now, 41( Old Now 124"), breakfast in its boilerplate, and no website. The Beyond Curry listing still says "18th Main Road" (Q26, don't edit). |
| #4 Zomato | **Still wrong:** call number `tel:+919444224999`; highlights now also say "Brunch" besides "Breakfast". Address, hours and "Vegetarian only" match. |
| #5 District | **Still wrong:** call number 94442 24999. The "6 PM–6 AM" window wasn't in today's HTML, but that's not confirmed fixed. |
| #6 Swiggy Dineout | **Still wrong:** address. **New:** phone 94442 24999, and "Parking available" (gated, Q27). |
| #7 magicpin | **Still wrong:** hours "11:30 AM – 2:00 PM" and phone 94442 24999. |
| #8 EazyDiner | **Still wrong:** "serves both veg and non veg food" and 06:30 AM. **New:** its schema telephone is EazyDiner's own number. |
| #9 Apple Maps | **Still wrong:** name and phone (94442 24999 shown). The address is now full, but adds an unverified landmark, "Opposite Sea Shell". |
| #10, 13, 14 Bing Places, TripAdvisor, HappyCow | Not observable (JavaScript shells or blocked) |
| **All** | **No listing links to https://www.brihadhee.com/**, and none shows +91 73587 14113 as its call number. Add the website everywhere. |

Before changing call numbers, see `owner-questions.md` D8: older notes called 94442 24999 "primary"; direction J (12 Nov) made 73587 14113 the main number.

## Fix table (priority order)

| # | Profile | Field | Current value (if known) | Correct value | Who |
|---|---|---|---|---|---|
| 1 | **Instagram @brihadhee** | Bio, contact or Call button, any old "Order Now" action, pinned posts, Highlights | **+91 95661 35405**: Google AI Overview cited it from Instagram (12 Nov). The correction log also recorded it in an old Order Now action. | +91 73587 14113 for dining; catering number only in a catering highlight | Owner |
| 1b | Instagram @brihadhee | Bio link | Links to the Google listing (`g.co/kgs/…`) | `https://www.brihadhee.com/menu/dosa/` or `/about/#facts` (then pin a Build Your Own Dosa post) | Owner |
| 1c | Instagram @brihadhee | Bio hours and address | Unknown (truncated bio) | "Open daily 11 AM–11 PM · 3rd Avenue, W-Block, Anna Nagar East" | Owner |
| 2 | **Google Business Profile / Maps** | Address | Missing "East" | Add **Anna Nagar East** | Owner |
| 2b | Google Business Profile | Hours, holiday hours, categories, attributes, menu | Hours unknown | See [`google-business-profile.md`](google-business-profile.md) | Owner |
| 2c | Google Business Profile | Tamil name | Shows ப்ரிஹதீ; the site uses பிரிஹதீ | Match the signboard. Ask the owner which spelling is official. | Owner |
| 3 | **Justdial** | Listing identity | **No listing named Brihadhee.** The only match is **"Beyond Curry By Brihadhee"**, at New W41, Old W124, W Block, 3rd Avenue, *18th Main Road*, Anna Nagar, rated 4.5 from 246 reviews | **OWNER CONFIRMATION (Q26):** is Beyond Curry the owner's own delivery brand at this address? If yes: claim it, label it as Brihadhee's sub-brand, and fix the address (3rd Avenue, not 18th Main Road). Separately, create or claim a **Brihadhee** restaurant listing. If no: report it to Justdial. **Don't edit until Q26 is answered.** | Owner |
| 4 | **Zomato** | Dining Call number | +91 94442 24999 (catering number) | +91 73587 14113 | Owner + support |
| 4b | Zomato | Meal-type tags | "Breakfast" tag | Remove breakfast; lunch and dinner | Owner + support |
| 4c | Zomato | Delivery and takeaway fields | Present; not confirmed | Leave or remove according to Q25 | Owner (after Q25) |
| 5 | **District (Zomato group)** | Call number | +91 94442 24999 (5 Nov) | +91 73587 14113 | Owner + support |
| 5b | District | Offer time window | "6 PM–6 AM" | Inside 11 AM–11 PM, or remove | Owner |
| 6 | **Swiggy Dineout** | Address | "Plot No.41, 3Road Avenue, W Block, Anna Nagar" | Full correct address | Owner + support |
| 6b | Swiggy Dineout | Parking | Claims parking | Remove unless the owner confirms parking (Q27) | Owner |
| 7 | **magicpin** | Call number | +91 94442 24999 | +91 73587 14113 | Owner + support |
| 7b | magicpin | Hours | "11:30 AM – 2:00 PM" | 11 AM – 11 PM daily | Owner + support |
| 8 | **EazyDiner** | Veg FAQ and dietary tag | FAQ: "Brihadhee serves both veg and non veg food." | Pure vegetarian; no meat, egg or fish | Owner + support |
| 8b | EazyDiner | Hours | 06:30 AM – 11:00 PM | 11 AM – 11 PM | Owner + support |
| 9 | **Apple Maps** (Apple Business Connect) | Name | "Brihadhee Pure Veg Restaurant" | Brihadhee | Owner (claim in Apple Business Connect) |
| 9b | Apple Maps | Address | "124, Block W, Anna Nagar, Chennai 600040" (old number only) | Full address with W-41 / W-124 and 3rd Avenue | Owner |
| 9c | Apple Maps | Phone | +91 94442 24999 (catering) | +91 73587 14113 | Owner |
| 10 | **Bing Places** | Address | "Anna Nagar 3rd Avenue, Chennai 600040" (no W-41/W-124, no W-Block) | Full address | Owner (import from Google in Bing Places) |
| 10b | Bing Places | Website | Unknown | https://www.brihadhee.com/ | Owner |
| 11 | **IndiaRestros** | Phones on the dining card | Both numbers shown together | Dining number first; catering labelled | Owner + support |
| 12 | **Facebook** | Page | No page found (facebook.com/brihadhee unavailable) | If a page exists under another handle, apply the same NAP. If none exists, creating one is optional. | Owner |
| 13 | **TripAdvisor** | Listing | Not found | Optional: create a listing with the correct NAP (TripAdvisor is a common AI citation source) | Owner |
| 14 | **HappyCow** | Listing | Not on the Chennai list | Submit as a vegetarian restaurant (see citation plan #5) | Owner |
| 15 | **YouTube "Brihadhee Restaurant" channel** | Ownership, about text | Ownership **not confirmed**; 8 subscribers | If it's the owner's: add the site link, address and hours. If not: report impersonation. | Owner |
| 16 | **WhatsApp Business** | Profile name, address, hours, catalog | Not observable from outside | Correct values above. The catalog shows only menu items with current prices. | Owner |
| 17 | **Third-party videos** (Zameer bytes "Rs.24 mini tiffin, morning"; Sri 70mm "500+ Dosai") | Claims | Morning mini tiffin; 500+ dosai | These can't be edited. Politely ask each creator for a pinned comment with current facts (lunch and dinner from 11 AM; build your own dosa). Never ask for removal or offer payment. | Owner |
| 18 | **Old website copies** | `shashan3k.github.io/brihadhee/` | Now 404 | Done (GitHub Pages turned off 11 Nov). Request removal of old URLs in Search Console if they still appear. | Dev / owner |

## Order of work

1. **This week:** Instagram (#1), the Google profile (#2), Zomato and District numbers (#4, #5), and the EazyDiner veg claim (#8). These feed the AI answers already recorded.
2. **Next:** Apple Maps (#9), Bing Places (#10), magicpin (#7), Swiggy Dineout (#6).
3. **After the owner answers:** Justdial (#3, Q26), delivery fields (#4c, Q25), parking (#6b, Q27).
4. **After each fix:** screenshot the corrected field with the date into `docs/seo/workflow/evidence/profiles/`, and mark it closed in `docs/geo/claims-watchlist.md`.
