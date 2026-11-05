# OWN: what Brihadhee controls (GEO Step 3)

Everything here uses only confirmed facts from `docs/geo/entity-sheet.md`. Do not mention hours, price range, parking, table booking, customizable dosas or catering until the client confirms them.

## 1. Google Business Profile (most important)

Signed in as the verified owner at business.google.com. Record every change in `docs/geo/presence-audit.csv`.

| Field | Action | Notes |
|---|---|---|
| Primary category | Decide from evidence (below) | |
| Secondary categories | Add the other of "South Indian restaurant" / "Vegetarian restaurant", plus others that are true | Do not add "Caterer" until catering is confirmed |
| Business name | Exactly "Brihadhee" | No keywords |
| Description | The 100-word descriptor from the entity sheet (limit is 750 characters) | No superlatives, no hours, no price claims |
| Hours | Enter only after the owner verifies them | Wrong hours cost more than missing hours |
| Attributes | Tick only true ones: dine-in, family-friendly, vegetarian options, no alcohol | Do not tick parking or reservations until confirmed |
| Menu | Enter every dish with price from the menu file, or link the website menu page | Keep identical to `src/data/menu.json` |
| Photos | 20+ real photos: dishes (dosa, parotta, meals, filter coffee), interior, exterior with signage, banana-leaf meals | Descriptive file names; upload from the owner's phone with permission |
| Posts | One post a week: a dish photo, the dish name, "Anna Nagar East", a Call button | No offers unless real |
| Q&A | Seed the owner's own questions and answer them with confirmed facts (vegetarian, address, landmarks, meal times, alcohol) | |
| Website link | Final production domain (pending; interim github.io) | Update when the domain is decided |
| Appointment / booking links | Leave empty | Booking is unconfirmed |
| Reviews | Reply to all, see `docs/geo/earn-playbook.md` | |

**Primary category decision (still open).** The benchmark could not read any competitor's categories (Google Maps was not reachable), so there is no evidence to copy. Method: in Google Maps, from Chennai, search "South Indian restaurant Anna Nagar" and "vegetarian restaurant Anna Nagar", open the top 5 results each and write their primary category in `competitor-benchmark.csv`. Working hypothesis, to be replaced by that evidence: primary "South Indian restaurant" (matches cuisine searches) with "Vegetarian restaurant" as secondary. Owner decides.

## 2. Website
Keep the SEO and AEO work. After each profile is verified, add it to `sameAs` in schema (list in the entity sheet). Do not add unverified or wrong third-party pages.

## 3. Social (Instagram and Facebook)
- Bio: the 50-word descriptor, the address, phone, and a link to the website.
- Posts: real dish photos with the specific dish name from the menu and "Anna Nagar East" in the caption where natural. No "best", no hashtags that name competitors.
- Highlights: Menu, Visit (address and landmarks), Meals on banana leaf.
- Pin: a post with the address and Directions button on the GBP.
- No posting of customer photos without permission; no giveaways that require reviews.

## 4. Citable guide pages (3 to 5) at `/guides/...`

AI engines cite pages that explain things. These pages must come from what the kitchen really knows, so they are **briefs for the owner or chef to answer first**, not finished copy. No invented history or "since" claims. Not built until the owner has reviewed the draft and the final domain is chosen.

For each page: first sentence answers the question in 15 to 35 words and names Brihadhee; short sections; real photos with specific alt text; link to the menu.

| Page | URL idea | Dishes from the menu to cover | Questions for the chef (answers needed before writing) |
|---|---|---|---|
| Dosa varieties explained | /guides/dosa-varieties | Kal Dosa, Plain Dosa, Ghee Roast, Ghee Podi Dosa, Rava Dosa, Ghee Masala Dosa, Ragi Dosa, Navadhaniya Dosa, Madurai Malli Dosa, Pesarattu Dosa, Onion Podi Uthappam | What batter, thickness and texture does each use? Which are crisp and which soft? What does each come with? Where do the names come from (only what the chef actually knows)? |
| Tamil Nadu meals explained | /guides/tamil-nadu-meals | Mini Meals, Limited TN Meals, Executive TN Meals (Unlimited), Nellai Special Sodhi Meals | What comes with each meal, in order? What does "unlimited" cover? What is a sodhi meal? |
| How a banana-leaf meal is served and eaten | /guides/banana-leaf-meal | The meals above | How is the leaf laid out and in what order are items served? How should a first-timer eat it? Is each meal served on banana leaf, or only some? |
| Parotta, salna and kothu parotta | /guides/parotta-salna-kothu | Parotta Salna, Special Kothu Parotta, Paanai Parotta, Madurai Salna Parotta, Chilli Parotta, Special Kothu Chapathi, Madras Bhel Parotta | What is the difference between each? What is salna made of (vegetarian version)? Is parotta available all day? (also needed for the parotta flag) |
| Optional: filter coffee | /guides/filter-coffee | Filter Coffee, served in a steel tumbler and davara | How is it brewed and served at Brihadhee? Which beans or blend (only if the owner wants to share)? |

## 5. Social and GBP checklist for the front desk
- [ ] Name, address, phone identical everywhere (copy from the entity sheet)
- [ ] Descriptor pasted word for word on every profile
- [ ] 20+ real photos on GBP, with dish names in the captions
- [ ] Weekly GBP post scheduled
- [ ] Review QR card on the table and bill (see the earn playbook)
