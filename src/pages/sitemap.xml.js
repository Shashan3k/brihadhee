import { site, ROUTES } from "../data/site.js";
import { BUILD_DATE, REDIRECTED_PATHS } from "../lib/build-info.js";
import verification from "../../config/client-verification.json";
import { corporateEnabled } from "../data/catering.js";

// Generated at build time. Lists only built, indexable pages: noindex pages
// (privacy, 404), gated pages and every path vercel.json redirects are left out.
export function GET() {
  const pages = [
    { path: "/", priority: "1.0" },
    { path: "/menu/", priority: "0.9" },
    { path: ROUTES.dosa, priority: "0.9" },
    { path: ROUTES.lunch, priority: "0.8" },
    { path: ROUTES.dinner, priority: "0.8" },
    { path: "/about/", priority: "0.8" },
    { path: "/book-a-table/", priority: "0.8" },
    { path: ROUTES.whatsNew, priority: "0.7" },
    { path: ROUTES.seasonal, priority: "0.7" },
    { path: ROUTES.nellaiGuide, priority: "0.6" },
    ...(verification.offer_catering === true
      ? [
          { path: "/catering-services-chennai/", priority: "0.9" },
          { path: "/event-planner-catering-partner/", priority: "0.8" },
          ...(corporateEnabled ? [{ path: ROUTES.corporateCatering, priority: "0.9" }] : []),
        ]
      : []),
  ].filter((p) => !REDIRECTED_PATHS.has(p.path));

  const entries = pages
    .map(
      (p) =>
        `  <url>\n    <loc>${site.url}${p.path}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n    <priority>${p.priority}</priority>\n  </url>`
    )
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
