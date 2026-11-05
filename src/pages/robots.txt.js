import { site } from "../data/site.js";

/**
 * robots.txt: everything is public. AI search, user-fetch AND training
 * crawlers are listed explicitly: the owner decided on 2026-11-05 to allow
 * GPTBot, ClaudeBot and Google-Extended (see docs/seo/ai-crawler-policy.md). Listing the search agents keeps a future
 * blanket rule from blocking them by accident. /catering/ needs no rule of its
 * own: it is crawlable whenever it exists (it is only built when
 * offer_catering is true).
 *
 * NOTE: crawlers read robots.txt only from the host root. While the site lives
 * at shashan3k.github.io/brihadhee/, this file is not at the root and will not
 * be honoured. It takes effect on a custom domain or a user/organisation site.
 */
const AI_AGENTS = [
  "GPTBot", // OpenAI training (allowed by owner decision)
  "OAI-SearchBot", // ChatGPT search index
  "ChatGPT-User", // ChatGPT fetching a page for a user
  "PerplexityBot", // Perplexity index
  "Perplexity-User",
  "ClaudeBot", // Anthropic training (allowed by owner decision)
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended", // Gemini use of Google-crawled content (allowed by owner decision)
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
