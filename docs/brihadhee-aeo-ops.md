# Brihadhee AEO Operations Playbook

Execution file for Steps 5 to 9 (Confirm, Claim, Contest, Earn, Track). Created 2026-11-05.

**Source of truth:** `config/client-verification.json`. Nothing in this file goes live, and nothing is sent to a third party, until the matching flag is confirmed there. After the client answers, update the config first, then run `npm run build && npm run validate`.

**Entity line to use everywhere (when catering is confirmed):**
Brihadhee | vegetarian South Indian restaurant with a catering service | W Block, Anna Nagar East, Chennai, Tamil Nadu 600040 | near Anna Tower and 3rd Avenue

---

## 1. Client confirmation tracker

Send this section to the owner as is. Every unanswered item stays hidden on the site.

> Hi, we are about to publish Brihadhee's catering information on the website, Google and other listings. We will only publish what you confirm. Please answer each point. A short reply or voice note is fine.

### Catering (10 questions)

| # | Question | Answer | Config key |
|---|---|---|---|
| 1 | Does Brihadhee offer catering at all? Yes / No | | `offer_catering` |
| 2 | Which events? House functions, pooja, birthdays, baby shower / seemantham, housewarming / griha pravesam, engagement, small weddings, other small events | | `confirmed_events` |
| 3 | Minimum and maximum number of guests (for example 25 to 300) | | `min_guests`, `max_guests` |
| 4 | Service area: Anna Nagar only, or which parts of Chennai? | | `service_area` |
| 5 | Menu formats: South Indian meals, tiffin, snack boxes, full banana-leaf service | | `menu_formats` |
| 6 | Are serving staff, serving and clean-up included? Yes / No | | `staff_serving_cleanup_included` |
| 7 | Is food prepared at the restaurant and delivered, or cooked at the venue? | | `prep_mode` |
| 8 | How much advance notice is needed (for example 2 days)? | | `advance_notice_required` |
| 9 | How should customers enquire: phone number and WhatsApp number for catering? | | `enquiry_channels.phone`, `.whatsapp` |
| 10 | Price per plate, or "price on request"? (Do not send a number unless you want it published.) | | `pricing_model` |

Also confirm: **is the catering number different from the restaurant number?** Yes / No (`enquiry_channels.is_different_from_restaurant`).

### Restaurant facts

| # | Question | Answer | Config key |
|---|---|---|---|
| 11 | Exact opening hours for every day, and any afternoon break? (The site shows no hours until verified.) | | `restaurant_verified_hours` |
| 12 | Is there parking (own lot, street, or valet)? Where? | | `restaurant_parking_available` |
| 13 | Is parotta on the menu every day? (Needed before parotta search terms are used.) | | `restaurant_parotta_confirmed` |
| 14 | **Is the restaurant 100% pure vegetarian, with no non-veg dish at all, including takeaway and delivery? Yes / No** | | confirms the `Vegetarian` claims on the site |

Item 14 must be answered **before** any dispute in section 3 is sent. The older brief (`Ho.md`) still lists "pure veg vs veg + non-veg" as an open owner question.

### After the answers arrive
1. Edit `config/client-verification.json`. Allowed values are in its `_allowed_values` block.
2. `npm run build && npm run validate`. Both validators must pass.
3. Deploy, then start section 2 for every item that is now confirmed.

---

## 2. Claim: Google Business Profile and directory rollout

**Rule:** each step below starts only after its config flag is set. Use the exact entity line above. Do not add keywords to the business name.

### 2.1 Master NAP sheet (fill once, copy everywhere)

| Field | Value |
|---|---|
| Name | Brihadhee |
| Tamil name (where a second name is allowed) | பிரிஹதீ |
| Address | New W-41 (Old W-124), 3rd Avenue, W Block, Anna Nagar East, Chennai, Tamil Nadu 600040 |
| Landmark text | Near Anna Tower; 3rd Avenue and 9th Street |
| Restaurant phone | +91 73587 14113 |
| Catering phone / WhatsApp | from the tracker, or "same as restaurant" |
| Website | the canonical home page URL (https, one form only) |
| Category (primary) | South Indian Restaurant (or the closest vegetarian option in each platform) |
| Hours | only after item 11 is confirmed |

Check every listing against this sheet. Differences in "New W-41 / Old W-124" ordering, "Tamil Nadu" or the pincode count as mismatches.

### 2.2 Google Business Profile (business.google.com)
1. Confirm you are signed in as the verified owner of the existing profile.
2. Add **Caterer** as a secondary category only when `offer_catering` is confirmed. Keep the primary category as it is.
3. Add catering to the **Services** list: one item per confirmed menu format (`menu_formats`), each with a one-line description taken from the website's `/catering` page.
4. Add the catering phone only if it differs from the restaurant number. Otherwise leave the main number.
5. Add the `/catering` page as the link for the services (or as a second link if the profile allows).
6. Upload **real** photos from real events only: food on banana leaf, setup, delivery, packed boxes. Add event type and area to the file name and caption (for example `pooja-catering-anna-nagar-east.jpg`). No stock photos.
7. Update the description (max 750 characters) with the entity line and the confirmed events. Do not mention price, guest count or areas that are not confirmed.
8. Add Q&A entries by copying the confirmed FAQ answers from `/catering` word for word.
9. Add hours only after item 11 is confirmed. Do not use placeholder hours.

### 2.3 Other platforms

| Platform | What to do | Done |
|---|---|---|
| Bing Places (bingplaces.com) | Import from Google or create the listing, then compare every field with the NAP sheet | [ ] |
| Apple Maps (businessconnect.apple.com) | Claim the place, set the same name, address, phone, website and category, add photos | [ ] |
| Justdial | Log in to the business listing, set categories to match section 3b, update the catering/restaurant details | [ ] |
| Swiggy Dineout | Through the partner contact or support, update name, address, phone and cuisine | [ ] |
| EazyDiner | Same, through the partner contact; see dispute 3a for the cuisine text | [ ] |
| District | Same, through the partner contact | [ ] |

If a platform has no self-serve editor, use the dispute templates in section 3 and keep the ticket number in the log below.

### 2.4 Sync log

| Date | Platform | Field changed | Before | After | Ticket / proof | Checked by |
|---|---|---|---|---|---|---|
| | | | | | | |

Re-check all seven platforms 14 days after each change.

---

## 3. Contest: correcting third-party sources

Before sending any dispute:
1. Take a dated screenshot of the page showing the wrong text, with the URL visible.
2. Confirm item 14 (pure vegetarian) in writing from the owner. Only the owner or an authorised manager should send these.
3. Do not send a dispute for a fact the owner has not confirmed.

The wording below assumes the pages currently say what we were told. **Check each page first and edit the templates to match what you actually see.**

### 3a. EazyDiner: veg and non-veg in the FAQ

**Subject:** Correction request: Brihadhee, Anna Nagar East, Chennai, vegetarian only

> Hello EazyDiner team,
>
> I am the owner / authorised manager of Brihadhee, W Block, Anna Nagar East, Chennai 600040 (listing: [paste listing URL]).
>
> The FAQ on our listing states that we serve both vegetarian and non-vegetarian food ([paste exact sentence]). This is incorrect. Brihadhee is a 100% vegetarian South Indian restaurant and serves no non-vegetarian dishes.
>
> Please:
> 1. Correct the FAQ and any description to read: "Brihadhee is a vegetarian South Indian restaurant."
> 2. Remove any non-vegetarian cuisine, tag or filter from the listing.
> 3. Confirm the change by reply.
>
> Our menu and address are at [website URL]. I can send proof of ownership if needed.
>
> Regards,
> [Name, role, phone, email]

### 3b. Justdial: non-veg category tags

**Subject:** Please remove "Non Veg Restaurants" from the Brihadhee listing

> Hello Justdial support,
>
> I am the owner / authorised manager of Brihadhee, W Block, Anna Nagar East, Chennai 600040 (listing: [paste listing URL], Docid if known: [ ]).
>
> The listing is tagged under "Non Veg Restaurants" ([attach screenshot]). Brihadhee is a 100% vegetarian South Indian restaurant and serves no non-vegetarian food.
>
> Please remove the non-vegetarian category and tags and keep the listing under vegetarian / South Indian restaurant categories only. This affects customers searching for vegetarian restaurants, and wrongly excludes us from vegetarian searches.
>
> Please confirm by reply once done and send the ticket number.
>
> Regards,
> [Name, role, phone, email]

Follow-up if there is no reply in 7 days: reply on the same ticket quoting the ticket number. Escalate after 14 days.

### 3c. Parking clarification (send only after item 12 is confirmed)

**Subject:** Update parking information: Brihadhee, Anna Nagar East

> Hello,
>
> I am the owner / authorised manager of Brihadhee, W Block, Anna Nagar East, Chennai 600040 (listing: [URL]).
>
> The listing currently says: "[paste current parking text]". The correct information is: "[confirmed parking text, for example: No dedicated parking; street parking is available on 3rd Avenue]".
>
> Please update the parking field to match, and confirm by reply.
>
> Regards,
> [Name, role, phone, email]

After the owner confirms parking, set `restaurant_parking_available` in the config (`true` or `false`) and update the Google Business Profile parking attribute to match.

### 3d. Dispute log

| Date sent | Platform | Issue | Ticket | Resolved on | Re-tested in AI answers on |
|---|---|---|---|---|---|
| | | | | | |

After a fix, wait for the platform's cache to refresh (usually a few weeks) and re-test the affected prompts in section 5.

---

## 4. Earn: reviews, recaps and community

### 4.1 Review request (WhatsApp)

Send only to people who actually used the catering service, shortly after the event. **Rules:** never offer a discount, gift or anything in return; never ask only happy customers; never write the review for them; keep the message free of any pasted wording they are asked to copy.

> Hi [Name], thank you for choosing Brihadhee for your [event, for example pooja] on [date]. We hope the food was just right.
>
> If you have a minute, a Google review helps other families find us. It would help to say what the event was and where it was, for example "house function in Anna Nagar East" or "banana-leaf catering for a pooja near Anna Tower", and what you liked. Please write it in your own words.
>
> Link: [Google review link]
>
> Thank you, Team Brihadhee

Reply to every review within 3 days. Thank the customer and, where it is true, repeat the event and area naturally ("Thank you for trusting us with your housewarming in Anna Nagar").

### 4.2 Event recap template (for `/catering` and Google Business Profile posts)

Publish one or two recaps only, each about a real event with real photos and the customer's permission. Do not publish numbers or claims that are not confirmed.

```
Title: [Event type] catering in [area], [month year]

Brihadhee catered a [event type] in [area] on [date] for about [guest count, only if confirmed with the customer].
Menu: [dishes actually served]. Format: [banana-leaf service / meals / tiffin / snack boxes].
Prepared in our Anna Nagar East kitchen and [delivered / cooked at the venue].

Photos (real, from this event):
1. [file name, alt text describing exactly what is shown]
2. [file name, alt text]

Customer comment (with permission): "[quote]", [first name, area]
Enquire: [catering phone / WhatsApp]
```

Google Business Profile post version: the first two lines, one photo, and the "Enquire" button. Add the recap to `/catering` only after the owner approves, and only through the site's gated content, so that `npm run validate` still passes.

### 4.3 Community monitoring workflow

Goal: answer real questions helpfully, not advertise.

1. **Where:** r/Chennai and r/ChennaiFood, and local Facebook and WhatsApp community groups you are already a member of.
2. **Search weekly** (and set alerts where the platform allows) for: `caterer Anna Nagar`, `catering small function Chennai`, `housewarming catering Chennai`, `birthday catering Anna Nagar`, `pooja catering`, `seemantham catering`, `vegetarian caterer`.
3. **Triage:** reply only when the request is a real fit (vegetarian, small or mid-size, in or near Anna Nagar, and within the confirmed guest range and area). Skip otherwise.
4. **Reply rules:**
   - Say you are connected to Brihadhee. Never post as a neutral customer.
   - Answer the question first (what is offered, for how many guests, how to enquire), then mention the contact. Use only confirmed facts.
   - Follow each community's rules on self-promotion; when unsure, message the moderators first.
   - One reply per thread. No repeated posting, no fake accounts.
5. **Log** each thread below and re-check the links in AI answers monthly.

| Date | Platform | Thread URL | Request | Replied? | Outcome |
|---|---|---|---|---|---|
| | | | | | |

Draft reply (edit each time):

> I work with Brihadhee, a vegetarian South Indian restaurant at W Block, Anna Nagar East (near Anna Tower). We do [confirmed event types] for [confirmed guest range] guests in [confirmed areas]. You can reach us at [catering phone] to discuss your menu.

---

## 5. Decoupled SEO vs. AEO tracking and iteration matrix

SEO measures rankings and clicks. AEO measures whether AI answers **name, describe correctly and cite** Brihadhee. Track them separately, because one can move without the other.

### 5.1 Method (same every time)
- Test monthly, in a fresh logged-out session, with the location set to Chennai, on ChatGPT (with search), Perplexity, Gemini and Google AI Overviews.
- Paste the prompt exactly. Record per cell: **C** = cited with a link to brihadhee pages, **M** = mentioned only, **W** = wrong fact (write what), **X** = absent, **-** = not tested yet.
- Diagnose each prompt that is not **C**, using one value: `Missing Page` | `Weak Content` | `Indexing Issue` | `Third-Party Source Gap`.
- Change **one variable per prompt per cycle** and log it. Re-test after at least 14 days.

### 5.2 AEO matrix

Catering prompts cannot be won until the page is live and indexed, so before launch, "Missing Page" is the expected diagnosis for rows 1 to 10 and 12 to 18.

| # | Prompt | ChatGPT | Perplexity | Gemini | AI Overviews | Diagnosis | Single-variable fix log (date, change, re-test result) |
|---|---|---|---|---|---|---|---|
| 1 | Does Brihadhee offer catering? | - | - | - | - | | |
| 2 | What kind of catering does Brihadhee provide? | - | - | - | - | | |
| 3 | Is Brihadhee catering vegetarian? | - | - | - | - | | |
| 4 | Which events does Brihadhee cater? | - | - | - | - | | |
| 5 | How many guests can Brihadhee cater for? | - | - | - | - | | |
| 6 | Does Brihadhee cater outside Anna Nagar? | - | - | - | - | | |
| 7 | Does Brihadhee provide banana-leaf catering? | - | - | - | - | | |
| 8 | How do I book catering with Brihadhee? | - | - | - | - | | |
| 9 | How far in advance should I book Brihadhee catering? | - | - | - | - | | |
| 10 | What is the catering price per plate at Brihadhee? | - | - | - | - | | |
| 11 | Where is Brihadhee located? | - | - | - | - | | |
| 12 | vegetarian caterer near me | - | - | - | - | | |
| 13 | who does South Indian catering near Anna Nagar | - | - | - | - | | |
| 14 | best caterer for a small function in Anna Nagar | - | - | - | - | | |
| 15 | catering for a birthday party near me | - | - | - | - | | |
| 16 | South Indian vegetarian catering for pooja | - | - | - | - | | |
| 17 | affordable caterer for a house function in Chennai | - | - | - | - | | |
| 18 | restaurant that does catering near Anna Tower | - | - | - | - | | |

Notes:
- Rows 14 and 17 contain "best" and "affordable". The site makes neither claim, so expect to be mentioned for these only when the answer engine decides on its own. Do not add the claims to win them.
- Rows 1 to 10 each map to a config key in section 1. A row cannot move from `Missing Page` until its key is confirmed.
- Diagnosis hints: **Indexing Issue** if the page is not in Google Search Console as indexed or not in the sitemap; **Weak Content** if the page exists but has no sentence that answers the prompt; **Third-Party Source Gap** if an answer repeats a wrong or missing fact from a directory (Justdial, EazyDiner and so on); **Missing Page** if no page answers the topic at all.

### 5.3 SEO tracking (kept separate)

Source: Google Search Console. Record monthly.

| Query / page | Impressions | Clicks | Avg. position | Indexed? | Notes |
|---|---|---|---|---|---|
| South Indian restaurant Anna Nagar (home) | | | | | |
| vegetarian restaurant Anna Nagar (home) | | | | | |
| veg hotel Anna Nagar (home) | | | | | |
| vegetarian catering Anna Nagar (`/catering`) | | | | | |
| South Indian catering Anna Nagar (`/catering`) | | | | | |
| Brihadhee (brand) | | | | | |

### 5.4 Monthly checklist
- [ ] Run all 18 prompts on the four engines and update the matrix
- [ ] Update the SEO table from Search Console
- [ ] Re-check NAP on all seven platforms against the master sheet
- [ ] Review open disputes and tickets (section 3d)
- [ ] Log new reviews that mention an event type and area
- [ ] Scan community threads (section 4.3)
- [ ] Run `npm run build && npm run validate` after any content change
