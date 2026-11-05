# Brihadhee GEO programme: plan, monitoring and 90-day schedule

Created 2026-11-05. Files in this folder:

| File | Purpose |
|---|---|
| `entity-sheet.md` | Canonical descriptor, facts, disambiguation, `sameAs` list |
| `presence-audit.csv` | One row per source (listings, social, articles): what is right and wrong |
| `competitor-benchmark.csv` | Five named competitors (analysis only; never on the site) |
| `own-gbp-social-guides.md` | GBP, website, social and guide-page briefs |
| `earn-playbook.md` | Claim and contest, reviews, outreach, creators, community |
| `outreach-targets.md` | Researched outlets and creators |
| `query-panel.csv` | 55 queries (English, Tamil, Tanglish) |
| `visibility-log.csv` | Empty log; one row per engine, query and run |
| `corrections-log.csv` | Wrong facts found and their fixes |
| `catering-geo.md` | Gated until catering is confirmed |

## Rules
Honest only (no fake, bought, incentivised or gated reviews; no fake accounts or undisclosed paid mentions; no hidden text for AI). Confirmed-only claims. Collaborations carry ASCI disclosure. No superlatives published by Brihadhee. Customizable dosas are not pushed. Catering is gated.

## What the client must confirm or provide
- Opening hours, any afternoon break, holiday closures
- Final production domain (custom domain or free host)
- A **dated** Google rating and review count from the Business Profile
- Written confirmation that the restaurant is 100% vegetarian (needed before the directory disputes)
- Whether customizable dosas are available now and how they work
- Photos with permission to publish (target 20+ for Google, real dishes, interior, exterior)
- Spelling variants customers use for "Brihadhee"
- Links to Instagram, Facebook, YouTube, Zomato, Swiggy, Justdial, EazyDiner, Magicpin, TripAdvisor, and owner access to claim them
- A named person at the front desk for the review QR card and replies
- Creator tasting budget (free meals or fee)
- Parotta availability, parking, table booking (only if the owner wants them mentioned)
- Whether catering is offered (unlocks `catering-geo.md`)

## Monitoring panel (Step 6)
- **Queries:** `query-panel.csv`, 55 rows.
- **Engines:** Google (AI Overviews / AI Mode), ChatGPT with search, Perplexity, Gemini, Claude with search.
- **Protocol:** each query three times per engine, from a Chennai location (or a Chennai VPN/device), signed out, new session each time. Log date, engine, query, and the fields in `visibility-log.csv`.
- **Metrics (compute monthly):**
  - mention rate = runs where Brihadhee is mentioned / all runs
  - citation rate = runs where the Brihadhee site or Business Profile is cited / all runs
  - average position among listed places when mentioned
  - fact accuracy rate = runs with all stated facts correct / runs that mention Brihadhee
  - share of voice vs each named competitor = runs mentioning that competitor / all runs
- **Baseline first**, then repeat monthly. **Status: not started.** The engines cannot be queried from this working environment, so the first run needs a person with access (about 55 queries x 5 engines x 3 runs = 825 runs; start with the 25 discovery, local and brand queries to cut that to about 375).
- An automated API runner is optional and costs money plus API keys; build it only if the owner asks.

## Step 7: what to fix, by symptom
| Symptom | Check and fix |
|---|---|
| Not mentioned at all | Business Profile strength (category, photos, reviews), then listicle and creator coverage |
| Mentioned with wrong facts | Trace the source it used, correct it there, log it in `corrections-log.csv` |
| Mentioned but not linked | Strengthen the matching page and its answer-first copy (AEO work) |
| Competitors always listed instead | Compare photos, reviews, article mentions, menu page, and close the largest gap |

## 30 / 60 / 90 day plan
- **Days 1 to 30:** entity sheet adopted; listing audit and fixes; Business Profile complete (menu, 20+ photos, weekly post); baseline panel run; review QR card live; disputes sent once vegetarian status is confirmed.
- **Days 31 to 60:** guide pages written with the chef and published (when the domain is final); first creator tastings and article pitches; corrections log in use; schema `sameAs` filled.
- **Days 61 to 90:** second panel run, compared with the baseline; double down on what moved mentions; plan catering GEO if it has been confirmed.

## Acceptance checks
- [ ] Every audited listing has matching name, address, phone, hours and descriptor
- [ ] Business Profile complete: menu, 20+ photos, weekly posts
- [ ] Baseline visibility log exists, and a second round shows measured change
- [ ] No known wrong facts remain in AI answers (corrections log shows each fix)
- [ ] All reviews organic and requested compliantly; all collaborations disclosed
- [ ] Nothing on the site or in outreach makes an unconfirmed claim

## First three actions with the biggest expected impact
1. **Complete and verify the Google Business Profile** (hours, menu, 20+ real photos, descriptor, weekly posts). It feeds Maps and most AI answers for local queries, and a dated rating can then be shown on the site.
2. **Correct the wrong third-party facts**, starting with the EazyDiner veg and non-veg FAQ and Justdial's non-veg tag, after the owner confirms vegetarian status in writing. The EazyDiner listing was the only Brihadhee result seen in the benchmark search for "South Indian restaurant Anna Nagar", so it is likely a source for answer engines (not yet tested).
3. **Start the compliant review process** (table QR card, same ask for every guest). The benchmark shows Brihadhee has only 5 reviews on EazyDiner against competitors with thousands on Google, so review volume is the largest visible gap.
