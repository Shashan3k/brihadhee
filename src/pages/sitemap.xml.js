import { site, ROUTES } from "../data/site.js";
import { REDIRECTED_PATHS } from "../lib/build-info.js";
import { CONTENT_UPDATED } from "../data/entity-truth.ts";
import verification from "../../config/client-verification.json";
import { corporateEnabled } from "../data/catering.js";
import { smallFunctionsPage, quotePage, noOnionPage } from "../data/spokes.js";

// Generated at build time. Lists only built, indexable pages: noindex pages
// (privacy, 404, gated drafts), gated pages whose gate is off
// (config/seo-gates.ts) and every path vercel.json redirects are left out.
//
// <lastmod> is the date the page's content was last reviewed (CONTENT_UPDATED in
// entity-truth.ts, or a page's own `updated` date), not the build date: a
// lastmod that moves on every deploy tells crawlers nothing, so they learn to
// ignore it.
export function GET() {
  const catering = verification.offer_catering === true;
  const pages = [
    { path: "/", priority: "1.0" },
    { path: "/menu/", priority: "0.9" },
    { path: ROUTES.dosa, priority: "0.9" },
    { path: ROUTES.lunch, priority: "0.8" },
    { path: ROUTES.dinner, priority: "0.8" },
    { path: ROUTES.familyDining, priority: "0.8" },
    { path: "/about/", priority: "0.8" },
    { path: "/book-a-table/", priority: "0.8" },
    { path: ROUTES.faq, priority: "0.7" },
    { path: ROUTES.whatsNew, priority: "0.7" },
    { path: ROUTES.seasonal, priority: "0.7" },
    { path: ROUTES.nellaiGuide, priority: "0.6" },
    ...(catering
      ? [
          { path: "/catering-services-chennai/", priority: "0.9" },
          ...(smallFunctionsPage ? [{ path: ROUTES.smallFunctions, priority: "0.9" }] : []),
          ...(quotePage ? [{ path: ROUTES.cateringQuote, priority: "0.8" }] : []),
          { path: "/event-planner-catering-partner/", priority: "0.8" },
          ...(corporateEnabled ? [{ path: ROUTES.corporateCatering, priority: "0.9" }] : []),
        ]
      : []),
    // Gated: only when its gate is on (a draft is noindex and never listed).
    ...(noOnionPage && !noOnionPage.noindex ? [{ path: ROUTES.noOnionNoGarlic, priority: "0.8" }] : []),
  ].filter((p) => !REDIRECTED_PATHS.has(p.path));

  const entries = pages
    .map(
      (p) =>
        `  <url>\n    <loc>${site.url}${p.path}</loc>\n    <lastmod>${p.updated ?? CONTENT_UPDATED}</lastmod>\n    <priority>${p.priority}</priority>\n  </url>`
    )
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
