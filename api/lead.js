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
 * post (no JavaScript) a 303 back to the page with ?lead=sent|invalid|error#enquiry.
 * Spam (honeypot or too-fast submit) gets a quiet success so bots learn nothing.
 */
import { validateLead, leadSummary, FORM_TYPES } from "../src/lib/lead.js";

const MAX_BODY = 16 * 1024;

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

async function readBody(request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY) throw new Error("too_large");
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return JSON.parse(raw || "{}");
  return Object.fromEntries(new URLSearchParams(raw));
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
      subject: `${FORM_TYPES[lead.formType]}: ${lead.name}, ${lead.headcount} (${lead.location})`,
      text,
      html: `<pre style="font:14px/1.5 system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
    }),
  });
  if (!res.ok) throw new Error(`resend_${res.status}`);
}

export async function handleLead(request, env = process.env, now = Date.now()) {
  const wantsJson = (request.headers.get("accept") || "").includes("application/json");
  const back = (page, status) =>
    new Response(null, { status: 303, headers: { Location: `${page}?lead=${status}#enquiry`, "Cache-Control": "no-store" } });

  let input;
  try {
    input = await readBody(request);
  } catch {
    return wantsJson ? json(400, { ok: false, error: "bad_request" }) : back("/", "invalid");
  }

  const result = validateLead(input, { now });
  const page = result.ok ? result.lead.page : /^\/[\w\-/]*$/.test(String(input.page || "")) ? input.page : "/";
  if (!result.ok && result.spam) return wantsJson ? json(200, { ok: true }) : back(page, "sent");
  if (!result.ok) return wantsJson ? json(422, { ok: false, errors: result.errors }) : back(page, "invalid");

  if (!env.RESEND_API_KEY || !env.LEAD_TO_EMAIL) {
    console.error("[lead] RESEND_API_KEY or LEAD_TO_EMAIL is not set; lead not delivered");
    return wantsJson ? json(503, { ok: false, error: "not_configured" }) : back(page, "error");
  }
  try {
    await sendEmail(result.lead, env);
  } catch (e) {
    console.error("[lead] email failed:", e.message);
    return wantsJson ? json(502, { ok: false, error: "send_failed" }) : back(page, "error");
  }
  return wantsJson ? json(200, { ok: true }) : back(page, "sent");
}

export function POST(request) {
  return handleLead(request);
}

export function GET() {
  return json(405, { ok: false, error: "method_not_allowed" });
}
