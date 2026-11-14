import assert from "node:assert/strict";
import { test } from "node:test";
import verification from "../config/client-verification.json" with { type: "json" };
import { handleLead } from "../api/lead.js";
import { indiaDate, leadPage, leadSubject, QUOTE_MAX_GUESTS, QUOTE_MIN_GUESTS, validateLead } from "../src/lib/lead.js";

const now = Date.parse("2026-11-12T18:31:00Z");
const env = {
  RESEND_API_KEY: "test-key",
  LEAD_TO_EMAIL: "lead@example.test, manager@example.test",
  LEAD_FROM_EMAIL: "Brihadhee <leads@example.test>",
};
const quote = {
  formType: "quote", page: "/catering-quote-chennai/", name: "Test customer", phone: "+91 98765 43210",
  eventType: "Birthday", meal: "Not sure yet", guests: "50", location: "Anna Nagar",
  message: "<script>alert(1)</script>",
};
const corporate = {
  formType: "corporate", page: "/corporate-catering-chennai/", name: "Test customer", phone: "09876543210",
  organisation: "Example office", service: "Recurring office meals", headcount: "18", location: "Guindy",
};
const event = {
  formType: "event", page: "/catering-services-chennai/", name: "Test customer", phone: "(044) 2620 4222",
  organisation: "Wedding", service: "Serving staff requested", headcount: "1500", location: "Kilpauk",
};
const planner = {
  ...event, formType: "planner", page: "/event-planner-catering-partner/", organisation: "Example agency",
  eventType: "Wedding", service: "Live counters at the venue",
};
const general = {
  ...event, formType: "general", page: "/about/", headcount: "50 to 100", source: "Google Search",
};
const validate = (input) => validateLead(input, { now });

function request(body, html = false) {
  return new Request("https://www.brihadhee.com/api/lead", {
    method: "POST",
    headers: {
      "Content-Type": html ? "application/x-www-form-urlencoded" : "application/json",
      Accept: html ? "text/html" : "application/json",
    },
    body: typeof body === "string" ? body : html ? new URLSearchParams(body) : JSON.stringify(body),
  });
}

test("event, quote and planner headcounts use the approved event range", () => {
  assert.equal(QUOTE_MIN_GUESTS, verification.min_guests);
  assert.equal(QUOTE_MAX_GUESTS, verification.max_guests);
  for (const payload of [quote, event, planner]) {
    const field = payload.formType === "quote" ? "guests" : "headcount";
    for (const count of ["50", "1500"]) assert.equal(validate({ ...payload, [field]: count }).ok, true);
    for (const count of ["49", "1501", "50.5", "5e2", "1,000", "0x50", "1e2junk"]) {
      assert.ok(validate({ ...payload, [field]: count }).errors[field], `${payload.formType}: ${count}`);
    }
  }
  assert.equal(validate(planner).lead.service, "Live counters at the venue");
  assert.equal(validate(event).lead.service, "Serving staff requested");
});

test("recurring meal counts and corporate event counts are validated for their service", () => {
  assert.equal(validate(corporate).ok, true);
  assert.equal(validate({ ...corporate, headcount: "1501" }).ok, true);
  assert.match(validate({ ...corporate, headcount: "0" }).errors.headcount, /at least 1/);
  assert.ok(validate({ ...corporate, service: "Other" }).errors.service);
  assert.ok(validate({ ...corporate, service: "" }).errors.service);
  assert.ok(validate({ ...corporate, service: "One-off staffed office event" }).errors.headcount);
  assert.ok(validate({ ...corporate, service: "One-off staffed office event", headcount: "1501" }).errors.headcount);
  assert.equal(validate({ ...corporate, service: "One-off staffed office event", headcount: "50" }).ok, true);
  assert.equal(validate({ ...corporate, service: "One-off packed lunch order" }).ok, true);
});

test("general enquiry and supported previously rendered forms keep working", () => {
  assert.equal(validate(general).lead.source, "Google Search");
  assert.equal(validate({ ...event, startedAt: "", headcount: "50 to 100" }).ok, true);
  const { service, ...oldCorporate } = corporate;
  assert.equal(validate({ ...oldCorporate, startedAt: "", headcount: "50 to 100" }).ok, true);
  assert.equal(validate({ ...quote, startedAt: String(now), service: "No, food only" }).lead.service, "No serving staff requested");
  assert.equal(validate({ ...quote, startedAt: "", eventType: "Corporate" }).ok, true);
  assert.ok(validate({ ...quote, eventType: "Corporate" }).errors.eventType);
});

test("restaurant enquiries work for a small party or a menu question without venue or company details", () => {
  const dining = { formType: "general", page: "/about/", name: "Test diner", phone: "9876543210", message: "Can you seat six for lunch?" };
  const group = validate({ ...dining, headcount: "6" });
  assert.equal(group.lead.headcount, "6");
  assert.match(leadSubject(group.lead), /Test diner, 6$/);
  const menu = validate({ ...dining, message: "I'd like to ask about dosas." });
  assert.equal(menu.ok, true);
  assert.match(leadSubject(menu.lead), /Test diner$/);
  assert.ok(validate({ ...dining, headcount: "0" }).errors.headcount);
  assert.ok(validate({ ...dining, message: "" }).errors.message);
});

test("fast autofill and no-JavaScript submissions are accepted; filled honeypots are discarded", () => {
  assert.equal(validate({ ...quote, startedAt: String(now) }).ok, true);
  assert.equal(validate({ ...quote, startedAt: "" }).ok, true);
  assert.equal(validate(quote).ok, true);
  assert.equal(validate({ ...quote, website: "spam" }).spam, true);
});

test("dates are optional, real calendar dates, and compared with the Chennai date", () => {
  assert.equal(indiaDate(now - 120_000), "2026-11-12");
  assert.equal(indiaDate(now), "2026-11-13");
  assert.equal(validate({ ...quote, date: "2026-11-13" }).ok, true);
  assert.equal(validate({ ...quote, date: "" }).ok, true);
  for (const date of ["2026-11-12", "2027-02-29", "2027-02-30", "2027-04-31", "2027-02-28x", "2027-2-28"]) {
    assert.ok(validate({ ...quote, date }).errors.date, date);
  }
  assert.equal(validate({ ...quote, date: "2028-02-29" }).ok, true);
});

test("Indian phone formats are normalized and unrelated characters are rejected", () => {
  for (const phone of ["9876543210", "+91 98765 43210", "09123456789", "+91 (44) 2620-4222", "(044) 2620 4222"]) {
    assert.match(validate({ ...quote, phone }).lead.phone, /^\+91 \d{5} \d{5}$/);
  }
  for (const phone of ["98765A43210", "0987654321x", "+44 7777777777", "1234"]) {
    assert.ok(validate({ ...quote, phone }).errors.phone, phone);
  }
});

test("the enquiry return path cannot leave the site", () => {
  for (const unsafe of ["//evil", "/a//b", "/%2Fevil", "/\\evil", "https://evil.test", "/about/?anything=x", "/about/#enquiry"]) {
    assert.equal(leadPage(unsafe), "/", unsafe);
  }
  assert.equal(leadPage("/catering-quote-chennai/"), "/catering-quote-chennai/");
  assert.equal(leadPage("/about"), "/about");
});

test("malformed bodies and invalid fields return actionable failures", async () => {
  for (const body of ["null", "[]", "true", "42", "{broken json", JSON.stringify({ message: "£".repeat(9000) })]) {
    const response = await handleLead(request(body), {}, now);
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { ok: false, error: "bad_request" });
  }
  const response = await handleLead(request({ ...quote, phone: [], guests: "49" }), {}, now);
  assert.equal(response.status, 422);
  assert.deepEqual(Object.keys((await response.json()).errors).sort(), ["guests", "phone"]);
});

test("JSON success follows a Resend acceptance and the honeypot never sends", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => new Response("{}", { status: 200 }));
  const spam = await handleLead(request({ ...quote, website: "spam" }), env, now);
  assert.notEqual((await spam.json()).ok, true);
  assert.equal(fetch.mock.callCount(), 0);

  const response = await handleLead(request({ ...quote, email: "customer@example.test" }), env, now);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(fetch.mock.callCount(), 1);
  const [url, options] = fetch.mock.calls[0].arguments;
  assert.equal(url, "https://api.resend.com/emails");
  const email = JSON.parse(options.body);
  assert.deepEqual(email.to, ["lead@example.test", "manager@example.test"]);
  assert.equal(email.reply_to, "customer@example.test");
  assert.match(email.text, /Venue and service notes: <script>/);
  assert.match(email.html, /&lt;script&gt;/);
  assert.doesNotMatch(email.html, /<script>/);
});

test("no-JavaScript requests receive visible results without echoing personal details", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("{}", { status: 200 }));
  const sent = await handleLead(request(quote, true), env, now);
  assert.equal(sent.status, 200);
  assert.match(sent.headers.get("Content-Type"), /text\/html/);
  assert.match(sent.headers.get("X-Robots-Tag"), /noindex/);
  assert.equal(sent.headers.get("Cache-Control"), "no-store");
  const result = await sent.text();
  assert.match(result, /Enquiry submitted/);
  assert.match(result, /href="\/catering-quote-chennai\/#enquiry"/);
  assert.doesNotMatch(result, /Test customer|<script>|98765/);

  const invalid = await handleLead(request({ ...quote, page: "//evil", guests: "49" }, true), env, now);
  assert.equal(invalid.status, 422);
  const validation = await invalid.text();
  assert.match(validation, /Brihadhee caters events from 50 guests/);
  assert.match(validation, /href="\/"/);
  assert.doesNotMatch(validation, /\/\/evil|href="tel:/);
});

test("missing Resend config and provider failure offer a suitable telephone fallback", async (t) => {
  t.mock.method(console, "error", () => {});
  const fetch = t.mock.method(globalThis, "fetch", async () => new Response("{}", { status: 500 }));
  const unavailable = await handleLead(request(general, true), {}, now);
  assert.equal(unavailable.status, 503);
  assert.match(await unavailable.text(), /href="tel:\+917358714113"/);
  assert.equal(fetch.mock.callCount(), 0);

  const error = await handleLead(request(quote, true), env, now);
  assert.equal(error.status, 502);
  assert.match(await error.text(), /href="tel:\+919444224999"/);
  const jsonError = await handleLead(request(quote), env, now);
  assert.equal(jsonError.status, 502);
  assert.deepEqual(await jsonError.json(), { ok: false, error: "send_failed" });
  assert.equal(fetch.mock.callCount(), 2);
});
