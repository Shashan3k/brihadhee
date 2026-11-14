/**
 * POST /api/lead: catering quote and enquiry form (Vercel Function, Node runtime).
 *
 * Validates the submission with the same rules as the form (src/lib/lead.js),
 * then emails it to the owner through Resend. Nothing is stored on the website.
 *
 * Environment variables (Vercel > Project > Settings > Environment Variables):
 *   RESEND_API_KEY   required. API key from resend.com
 *   LEAD_TO_EMAIL    required. Where leads go (comma-separated for several)
 *   LEAD_FROM_EMAIL  optional. A sender on a domain verified in Resend, e.g.
 *                    "Brihadhee website <leads@brihadhee.com>". Defaults to
 *                    Resend's test sender, which only delivers to the Resend
 *                    account owner's own address.
 *
 * Responses: JSON for fetch() callers ({ ok, errors? }); for a plain HTML form
 * post, an accessible result page with a link back to the enquiry.
 */
import verification from "../config/client-verification.json" with { type: "json" };
import { getFact } from "../src/data/entity-truth.ts";
import { validateLead, leadPage, leadSummary, leadSubject } from "../src/lib/lead.js";

const MAX_BODY = 16 * 1024;

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function htmlResult(status, page, formType, errors = {}) {
  const sent = status === 200;
  const invalid = status === 400 || status === 422;
  const title = sent ? "Enquiry submitted" : invalid ? "Check your enquiry details" : "Enquiry could not be submitted";
  const details = sent ? "The Brihadhee team will review your request and contact you about the details you provided."
    : invalid ? "Return to the form to update your details and try again."
    : "Try again, or call the Brihadhee team to share your enquiry.";
  const number = formType === "general" ? getFact("phone") : verification.enquiry_channels.phone;
  const call = !sent && !invalid && number
    ? `<p><a href="tel:${number.replace(/[^+\d]/g, "")}">Call ${escapeHtml(number)}</a></p>` : "";
  const errorList = Object.values(errors).map((message) => `<li>${escapeHtml(message)}</li>`).join("");
  const anchor = page === "/" ? "" : "#enquiry";

  return new Response(`<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>${title} | Brihadhee</title>
<style>body { font-family: system-ui, sans-serif; line-height: 1.55; margin: 2rem auto; max-width: 40rem; padding: 0 1rem; } a { color: #235238; } a:focus-visible { outline: 2px solid; outline-offset: 3px; }</style>
</head><body><main>
<h1>${title}</h1><p>${details}</p>${errorList ? `<ul>${errorList}</ul>` : ""}
${call}<p><a href="${escapeHtml(page)}${anchor}">${page === "/" ? "Return to Brihadhee" : "Return to the enquiry form"}</a></p>
</main></body></html>`, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

async function readBody(request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY) throw new Error("too_large");
  const raw = await request.text();
  if (Buffer.byteLength(raw) > MAX_BODY) throw new Error("too_large");
  const type = (request.headers.get("content-type") || "").split(";", 1)[0].trim().toLowerCase();
  if (type === "application/x-www-form-urlencoded") return Object.fromEntries(new URLSearchParams(raw));
  if (type !== "application/json") throw new Error("unsupported_body");
  const input = JSON.parse(raw);
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("invalid_body");
  return input;
}

async function sendEmail(lead, env) {
  const text = leadSummary(lead);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.LEAD_FROM_EMAIL || "Brihadhee website <onboarding@resend.dev>",
      to: env.LEAD_TO_EMAIL.split(",").map((s) => s.trim()).filter(Boolean),
      ...(lead.email ? { reply_to: lead.email } : {}),
      subject: leadSubject(lead),
      text,
      html: `<pre style="font:14px/1.5 system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
    }),
  });
  if (!res.ok) throw new Error(`resend_${res.status}`);
}

export async function handleLead(request, env = process.env, now = Date.now()) {
  const wantsJson = (request.headers.get("accept") || "").includes("application/json");

  let input;
  try {
    input = await readBody(request);
  } catch {
    return wantsJson ? json(400, { ok: false, error: "bad_request" }) : htmlResult(400, "/", "general");
  }

  const result = validateLead(input, { now });
  const page = leadPage(input.page);
  if (!result.ok && result.spam) return wantsJson ? json(200, { ok: false }) : htmlResult(422, page, input.formType);
  if (!result.ok) return wantsJson ? json(422, { ok: false, errors: result.errors }) : htmlResult(422, page, input.formType, result.errors);

  if (!env.RESEND_API_KEY || !env.LEAD_TO_EMAIL) {
    console.error("[lead] RESEND_API_KEY or LEAD_TO_EMAIL is not set; lead not delivered");
    return wantsJson ? json(503, { ok: false, error: "not_configured" }) : htmlResult(503, page, result.lead.formType);
  }
  try {
    await sendEmail(result.lead, env);
  } catch (e) {
    console.error("[lead] email failed:", e.message);
    return wantsJson ? json(502, { ok: false, error: "send_failed" }) : htmlResult(502, page, result.lead.formType);
  }
  return wantsJson ? json(200, { ok: true }) : htmlResult(200, page, result.lead.formType);
}

export function POST(request) {
  return handleLead(request);
}

export function GET() {
  return json(405, { ok: false, error: "method_not_allowed" });
}
