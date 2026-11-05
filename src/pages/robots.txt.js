import { site } from "../data/site.js";

/**
 * robots.txt: everything is public. AI search and answer crawlers are listed
 * explicitly so the intent is clear and a future blanket rule cannot block them
 * by accident. /catering/ needs no rule of its own: it is crawlable whenever it
 * exists (it is only built when offer_catering is true).
 *
 * NOTE: crawlers read robots.txt only from the host root. While the site lives
 * at shashan3k.github.io/brihadhee/, this file is not at the root and will not
 * be honoured. It takes effect on a custom domain or a user/organisation site.
 */
const AI_AGENTS = [
  "OAI-SearchBot", // ChatGPT search index
  "ChatGPT-User", // ChatGPT fetching a page for a user
  "PerplexityBot", // Perplexity index
  "Perplexity-User",
  "ClaudeBot", // Anthropic crawler
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended", // controls Gemini use of Google-crawled content
];

export function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    ...AI_AGENTS.flatMap((ua) => [`User-agent: ${ua}`, "Allow: /", ""]),
    `Sitemap: ${site.url}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
