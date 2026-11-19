# 16 GEO: answer-engine run plan and press pitch pack (21 Nov 2026)

This is Phase 5 of the live-repo prompt. **Nothing was sent, and no AI answer was recorded.** This machine can't reach the answer engines with a clean location, and `CLAUDE.md` forbids filling the visibility log without evidence.

## A. Monthly answer-engine run (owner or developer, on a normal network)

Run it on the dates in `10-30-60-90-plan.md`. The first run should be **before day 0 + 30**.

**Setup:**
1. Use a phone browser, signed out, with the location set to Chennai.
2. Run each prompt **3 times** in each engine:
   - Google AI Mode
   - AI Overviews (in normal search)
   - ChatGPT search
   - Perplexity
   - Gemini
   - Copilot
3. Log every answer as one row in `docs/geo/visibility-log.csv`, using the columns defined in `10-30-60-90-plan.md`. Save each full answer or screenshot to `docs/seo/workflow/evidence/geo/` and put that path in `notes`.
4. Classify each row as one of:
   - brand mention
   - third-party citation
   - brihadhee.com citation
5. For each wrong fact in an answer, find its likely source in `docs/geo/presence-audit.csv` and add a row to `docs/geo/corrections-log.csv`.

**Prompt set for the first run.** These are the 12 that best match the money pages. The IDs refer to `docs/geo/query-panel.csv` or are new; use the exact wording.

| # | Prompt | Owning page |
|---|---|---|
| 1 | Recommend a pure vegetarian South Indian restaurant in Anna Nagar, Chennai for a family lunch. | `/`, `/family-dining-anna-nagar/` |
| 2 | Where can I get a customized dosa in Chennai? | `/menu/dosa/` |
| 3 | Where can I try Nellai sodhi meals in Chennai? | `/menu/nellai-meals/` |
| 4 | Where can I eat paanai parotta in Anna Nagar? | `/parotta-anna-nagar/` |
| 5 | Suggest a vegetarian restaurant in Anna Nagar East open for dinner till 11 pm. | `/veg-dinner-anna-nagar/` |
| 6 | Tell me about Brihadhee in Anna Nagar. What is it known for? | `/`, `/about/` |
| 7 | What are Brihadhee's timings and phone number? | `/about/` |
| 8 | Which Chennai restaurant can cater vegetarian food for 50 people? | `/small-function-catering-chennai/` |
| 9 | Recommend a vegetarian caterer in Chennai for a housewarming of 100 guests. | `/catering-services-chennai/` |
| 10 | Who provides daily vegetarian office lunch catering in Chennai? | `/corporate-catering-chennai/` |
| 11 | How do I get a catering quote from Brihadhee? | `/catering-quote-chennai/` |
| 12 | Is Brihadhee pure veg? | `/`, `/faq/` |

## B. Press and roundup pitches (owner sends; adapt each one, no mass mailing)

**Rules** (`CLAUDE.md` and `07-offsite/citation-and-pr-plan.md`):
- No "first in Chennai", "only", "best", ratings or catering rates.
- Invite writers to visit at their own expense, or with clear disclosure.
- Send to a named writer at one outlet at a time.
- Log each pitch (date, outlet, contact, pitch, response, published link) in the outreach sheet described in `docs/geo/earn-playbook.md` §3.

**Facts used** (all verified in `src/data/entity-truth.ts` or `config/client-verification.json`):
- **Founders:** Rakesh (an auditor) and Eashwer (a lawyer)
- **Build Your Own Dosa:** guests choose the batter and ingredients; kitchen staff cook it to order. It is not self-service.
- **Food:** Nellai Special Sodhi Meals, Paanai Parotta and Karaikudi Paneer Poppers. 100% pure vegetarian. Lunch and dinner, 11 AM to 11 PM daily.
- **Catering:** vegetarian, 50 to 1,500 guests per event, plus 1,000+ meals a day for corporate clients.

### Pitch 1: Build Your Own Dosa (food writers: The Hindu MetroPlus, Times of India Chennai, The New Indian Express)

> **Subject:** A dosa you design yourself, in Anna Nagar East
>
> Hi [Name],
>
> At Brihadhee, a pure vegetarian South Indian restaurant in Anna Nagar East, guests build their own dosa. They choose the batter and the ingredients, and the kitchen cooks it to order at the table. It isn't a self-service station.
>
> Brihadhee was started by Rakesh and Eashwer, an auditor and a lawyer, who wanted to serve regional Tamil vegetarian food from family recipes. The menu also carries Nellai Special Sodhi Meals and Paanai Parotta.
>
> If the format interests you for a column, you're welcome to visit. We'd ask only that any hosted meal is disclosed. Facts and the full menu: https://www.brihadhee.com/menu/dosa/
>
> Thank you,
> [Owner name], Brihadhee, +91 73587 14113

### Pitch 2: Nellai sodhi meals (regional-food writers, food newsletters, Slurrp, LBB)

> **Subject:** Tirunelveli-style sodhi meals in Anna Nagar
>
> Hi [Name],
>
> Sodhi, the mild coconut-milk gravy of Tirunelveli (Nellai) home cooking, is rarely on Chennai restaurant menus. Brihadhee in Anna Nagar East serves it as the Nellai Special Sodhi Meals at lunch, alongside other Tamil vegetarian dishes cooked from family recipes.
>
> If you're writing about regional Tamil food in Chennai, we'd be glad to share how the meal is put together. A short explainer is here: https://www.brihadhee.com/guides/what-are-nellai-meals/
>
> Thank you,
> [Owner name], Brihadhee

*Check before sending:* "rarely on Chennai restaurant menus" is a judgement. Keep it only if the writer's own research agrees, or change it to "is not common on".

### Pitch 3: Small-function catering (wedding and event planners, apartment and community newsletters)

> **Subject:** Vegetarian catering for functions from 50 guests, Anna Nagar
>
> Hi [Name],
>
> Brihadhee, a pure vegetarian South Indian restaurant in Anna Nagar East, caters vegetarian functions from 50 to 1,500 guests: housewarmings, baby showers, birthdays, engagements, weddings and get-togethers. The same kitchen already supplies more than 1,000 meals a day to corporate clients. Live counters and regional menus are available, and every quote is built around the guest count and menu.
>
> If your readers or clients plan smaller functions, our details are here: https://www.brihadhee.com/small-function-catering-chennai/
>
> Thank you,
> [Owner name], Brihadhee catering, +91 94442 24999

## C. What this phase leaves for the owner

1. Run section A once and commit the log rows with their evidence.
2. Choose 2–3 named writers from `docs/geo/outreach-targets.md` and send pitches 1–3. Adapt each one; don't copy-paste to everyone.
3. Record every response, including no reply after 14 days.
