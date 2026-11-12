/**
 * Build-time values shared by the sitemaps.
 *
 * BUILD_DATE is the date this build ran (YYYY-MM-DD, Asia/Kolkata), so the
 * sitemap <lastmod> moves forward on every deploy instead of staying on a
 * hand-typed date. WebPage.dateModified still uses CONTENT_UPDATED from
 * entity-truth.ts, the date the copy was last reviewed.
 */
import vercel from "../../vercel.json";

export const BUILD_DATE = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

/**
 * Paths that vercel.json permanently redirects on the production host (redirects
 * without a `has` host condition). They must never appear in a sitemap.
 */
export const REDIRECTED_PATHS = new Set(
  (vercel.redirects ?? [])
    .filter((r) => (r.permanent || r.statusCode === 301 || r.statusCode === 308) && !r.has && !r.source.includes(":"))
    .flatMap((r) => [r.source, r.source.endsWith("/") ? r.source.slice(0, -1) : `${r.source}/`])
);
