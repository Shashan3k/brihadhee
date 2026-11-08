/**
 * IndexNow key file, served at /<INDEXNOW_KEY>.txt so Bing and Yandex can
 * verify that pings from scripts/indexnow.mjs come from the site owner.
 * Built only when INDEXNOW_KEY is set (Vercel env var); otherwise no file.
 */
const KEY = (process.env.INDEXNOW_KEY ?? "").trim();

export function getStaticPaths() {
  return /^[A-Za-z0-9-]{8,128}$/.test(KEY) ? [{ params: { indexnowKey: KEY } }] : [];
}

export function GET() {
  return new Response(KEY, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
