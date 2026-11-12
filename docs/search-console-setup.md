# Search Console, Bing Webmaster Tools and IndexNow setup

For www.brihadhee.com. About 30 minutes. Needs access to the domain's DNS settings (where brihadhee.com was bought, or Vercel DNS if the domain uses Vercel nameservers).

## 1. Google Search Console (domain property)

1. Go to https://search.google.com/search-console and sign in with the Google account that owns the Business Profile.
2. **Add property → Domain** → type `brihadhee.com` (no https, no www). A domain property covers www, non-www, http and https together.
3. Google shows a TXT record like `google-site-verification=abc123…`. Copy it.
4. Add it as a **TXT record** on the root (`@`) of brihadhee.com in your DNS panel (Vercel: Project → Settings → Domains → brihadhee.com → DNS records, or your registrar).
5. Back in Search Console, click **Verify**. DNS can take a few minutes to an hour; retry if it fails.
6. **Users and permissions:** add the marketing lead as "Full" user. Keep the owner as "Owner".

## 2. Submit the sitemap

1. Search Console → **Sitemaps** → enter `sitemap-index.xml` → Submit.
2. Status should become "Success" within a day. It lists the indexable pages (drafts, noindex and privacy pages are left out on purpose).

## 3. Request indexing for the first 10 URLs

Search Console → **URL inspection** (top bar) → paste each URL → **Request indexing**. Google allows roughly 10–12 requests a day, so do these first:

1. https://www.brihadhee.com/
2. https://www.brihadhee.com/menu/
3. https://www.brihadhee.com/about/
4. https://www.brihadhee.com/book-a-table/
5. https://www.brihadhee.com/best-dosa-parotta-anna-nagar/
6. https://www.brihadhee.com/nellai-meals-south-indian-veg-anna-nagar/
7. https://www.brihadhee.com/catering-services-chennai/
8. https://www.brihadhee.com/event-planner-catering-partner/
9. The next new page you publish (for example /menu/dosa/)
10. The next new page after that

After each new page goes live, inspect and request indexing for it the same day.

## 4. Check these reports weekly

- **Performance → Search results:** filter queries containing "brihadhee" (brand), and track the 20 priority keywords from `docs/strategy/competitor-attack-plan.md` section 6.2.
- **Pages (Indexing):** every sitemap URL should be "Indexed". Investigate "Crawled – currently not indexed" and "Duplicate" messages.
- **Enhancements / Rich results:** FAQ, breadcrumbs, and any structured-data errors.
- **Links:** new referring sites (KPI: referring domains).
- **Search generative AI setting:** leave on "Include" so Brihadhee stays eligible for AI Overviews and AI Mode.

## 5. Old hosts

`brihadhee.vercel.app` already redirects to www (vercel.json). The GitHub Pages copy (`shashan3k.github.io/brihadhee/`) declares www.brihadhee.com as canonical, so Google consolidates it. Do not add the github.io site as a separate property.

## 6. Bing Webmaster Tools (also feeds Copilot, DuckDuckGo and ChatGPT's Bing results)

1. Go to https://www.bing.com/webmasters and sign in.
2. Choose **Import from Google Search Console**. It copies the verified site and sitemap in one step.
3. If import is not possible: add `https://www.brihadhee.com`, verify with the DNS CNAME/TXT option, then submit `https://www.brihadhee.com/sitemap-index.xml` under Sitemaps.
4. Check **URL Inspection** for the home page.

## 7. IndexNow (instant pings to Bing, Yandex and others)

1. Generate a key at https://www.bing.com/indexnow/getstarted (or any 32-character string of letters and numbers).
2. Vercel → Project → Settings → Environment Variables → add `INDEXNOW_KEY` = your key (Production). Redeploy.
3. Check `https://www.brihadhee.com/<your-key>.txt` shows the key.
4. After each deploy with new or changed pages, from the project folder:
   ```bash
   INDEXNOW_KEY=<your-key> npm run indexnow
   ```
   or only the changed pages: `INDEXNOW_KEY=<your-key> npm run indexnow -- /menu/ /book-a-table/`
   To check first without sending anything: `INDEXNOW_KEY=<your-key> npm run indexnow -- --dry-run` prints the exact payload (every URL in `dist/sitemap.xml`).
5. Google does not use IndexNow. Use URL inspection in Search Console for Google.

## 8. Google Analytics 4

1. https://analytics.google.com → Admin → Create property "Brihadhee website" (India, INR, Asia/Kolkata) → Web stream for `https://www.brihadhee.com`.
2. Copy the Measurement ID (`G-…`) into Vercel as `PUBLIC_GA4_ID` and redeploy. The privacy page updates itself.
3. Admin → Events: mark `click_call`, `click_whatsapp`, `book_table_click` and `catering_quote_submit` as **key events** (conversions).
4. Link GA4 to Search Console (Admin → Product links → Search Console links).

Events the site sends: `click_call` (any tel: link, including the mobile CTA bar), `click_whatsapp` (any WhatsApp link), `book_table_click` (`/book-a-table/` and partner booking links), `catering_quote_submit` (a quote or enquiry form accepted by `/api/lead`, with `form_type` and `headcount`; no personal data), `directions_click`, `order_click` (Swiggy/Zomato links, once added), `quote_cta_click` (the mobile bar's Get a quote button on catering pages), `menu_filter_use` (menu tabs).
