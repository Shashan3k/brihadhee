import vercel from "../../vercel.json";

/**
 * Paths that vercel.json permanently redirects on the production host (redirects
 * without a `has` host condition). They must never appear in a sitemap.
 */
export const REDIRECTED_PATHS = new Set(
  (vercel.redirects ?? [])
    .filter((r) => (r.permanent || r.statusCode === 301 || r.statusCode === 308) && !r.has && !r.source.includes(":"))
    .flatMap((r) => [r.source, r.source.endsWith("/") ? r.source.slice(0, -1) : `${r.source}/`])
);
