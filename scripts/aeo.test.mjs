import assert from "node:assert/strict";
import { test } from "node:test";
import { answerProblems, firstAnswerSentence } from "../src/lib/answers.js";
import { BYO_DEFINITION, CATERING_ID, RESTAURANT_ID, SITE_ORIGIN, addressLine, canonicalAnswerLines, cateringContacts, getFact } from "../src/data/entity-truth.ts";
import { cateringRelationshipProblems, factProblems, llmsProblems, pageCopyProblems, phoneRoleProblems, readPageCopy } from "./aeo-rules.mjs";

const hoursQuestion = "When does Brihadhee open?";
const directAnswer = "Brihadhee opens at 11 AM for lunch and dinner.";

test("direct answers accept leading Yes or No with periods or commas", () => {
  for (const prefix of ["", "Yes. ", "No. ", "Yes, ", "No, "]) {
    const answer = prefix + directAnswer;
    assert.equal(firstAnswerSentence(`${answer} Visit us in Anna Nagar.`), answer);
    assert.deepEqual(answerProblems(hoursQuestion, answer), []);
  }
  assert.equal(firstAnswerSentence("Brihadhee is at New No. W-41, Anna Nagar East. Get directions."), "Brihadhee is at New No. W-41, Anna Nagar East.");
});

test("factual FAQs enforce first-sentence and total word limits without applying them to detailed explanations", () => {
  const longAnswer = `${directAnswer} ${"Extra context helps readers plan their visit. ".repeat(8)}`;
  assert.match(answerProblems(hoursQuestion, longAnswer).join(" "), /at most 55/);
  assert.match(answerProblems(hoursQuestion, `Brihadhee ${"word ".repeat(32)}opens daily.`).join(" "), /first sentence 35 words/);
  assert.match(answerProblems(hoursQuestion, "Brihadhee is open.").join(" "), /first sentence 3 words/);
  assert.match(answerProblems(hoursQuestion, "Yes. When it comes to Brihadhee, opening is at 11 AM.").join(" "), /generic introduction/);
  assert.match(answerProblems(hoursQuestion, "It is important to note that Brihadhee opens at 11 AM.").join(" "), /generic introduction/);
  assert.deepEqual(answerProblems("How do I plan a visit?", longAnswer), []);
  assert.deepEqual(answerProblems("அண்ணா நகரில் தோசை எங்கே கிடைக்கும்?", "பிரிஹதீ (Brihadhee) அண்ணா நகர் கிழக்கில் தோசை வழங்குகிறது.", { lang: "ta" }), []);
  assert.match(answerProblems("Anna Nagar la dosa customise panna mudiyuma?", `${directAnswer} ${"Extra family visit details. ".repeat(13)}`, { lang: "ta-Latn" }).join(" "), /at most 55/);
});

test("visible FAQ extraction ignores concealed DOM and includes answers in closed details", () => {
  const copy = readPageCopy(`<main>
    <details class="faq__item" id="faq-hours"><summary><h3 class="faq__q">${hoursQuestion}</h3></summary>
      <p class="faq__answer" data-answer-kind="explain">${directAnswer} <span hidden>Hidden</span></p></details>
    <div style="display: none !important"><details class="faq__item">
      <summary><h3 class="faq__q">Hidden question?</h3></summary><p class="faq__answer">Hidden answer.</p></details></div>
    <h2 id="editorial">Can I plan a visit?</h2><p>Call ahead.</p>
    </main>`);
  assert.deepEqual(copy.faqs, [{ location: "#faq-hours", q: hoursQuestion, a: directAnswer, lang: "en", answerLang: "en", kind: "explain" }]);
  assert.deepEqual(copy.questionHeadings, [{ location: "#editorial", text: "Can I plan a visit?" }]);
  assert.doesNotMatch(copy.text, /Hidden/);
});

test("duplicate street addresses are counted at page level, excluding metadata and hidden copies", () => {
  const address = addressLine();
  const html = `<head><title>${address}</title><script type="application/ld+json">${JSON.stringify({ address })}</script></head>
    <main><address>${address.replaceAll(", ", "<br>")}</address>
    <!-- ${address} --><template><p>${address}</p></template>
    <p hidden>${address}</p><div aria-hidden="true"><p>${address}</p></div>
    <p class="visually-hidden">${address}</p><p style="visibility: hidden">${address}</p>
    <p>3rd Avenue, W-Block, Anna Nagar East.</p></main>`;
  assert.deepEqual(pageCopyProblems(readPageCopy(html)), []);
  assert.match(pageCopyProblems(readPageCopy(`${html}<footer><address>${address}</address></footer>`))[0].message, /appears 2 times/);
  assert.match(pageCopyProblems(readPageCopy(`${html}<p>W Block, Anna Nagar East, Chennai, Tamil Nadu 600040</p>`))[0].message, /appears 2 times/);
});

test("exact vegetarian wording is counted separately by visible language", () => {
  const copy = `<html lang="en-IN"><body>
    <p>100&#37; <strong>pure</strong> vegetarian and 100% pure vegetarian</p>
    <section lang="ta"><p>100% சுத்த சைவ</p><p>100% சுத்த சைவ</p></section>
    <aside hidden>100% pure vegetarian 100% pure vegetarian</aside>`;
  assert.deepEqual(pageCopyProblems(readPageCopy(`${copy}</body></html>`)), []);
  assert.match(pageCopyProblems(readPageCopy(`${copy}<p>100% pure vegetarian</p></body></html>`))[0].message, /3 times in en/);
  assert.match(pageCopyProblems(readPageCopy(`${copy}<p lang="ta-IN">100% சுத்த சைவ</p></body></html>`))[0].message, /3 times in ta/);
});

test("claims keep the restaurant's purity separate from vegetarian catering", () => {
  assert.deepEqual(factProblems("Brihadhee's restaurant is 100% pure vegetarian. It provides vegetarian event catering."), []);
  assert.deepEqual(factProblems("Brihadhee prepares vegetarian catering in its 100% pure vegetarian restaurant kitchen."), []);
  for (const claim of ["Brihadhee offers pure vegetarian event catering.", "Catering is 100% pure vegetarian.", "சுத்த சைவ கேட்டரிங்"]) {
    assert.match(factProblems(claim, { allowCateringPurity: false }).join(" "), /catering purity/);
    assert.deepEqual(factProblems(claim, { allowCateringPurity: true }), []);
  }
  assert.match(factProblems("Brihadhee serves chicken.").join(" "), /restaurant diet/);
  assert.match(factProblems("Catering offers non-vegetarian meals.").join(" "), /catering diet/);
});

test("contradiction checks catch stale phone roles, hours, address and dosa preparation", () => {
  const restaurantPhone = getFact("phone");
  const cateringPhone = cateringContacts().phone;
  assert.deepEqual(phoneRoleProblems(`Restaurant phone: ${restaurantPhone} · Catering enquiries: call ${cateringPhone}.`), []);
  assert.deepEqual(factProblems(`Daily from 11:00 AM to 11:00 PM. ${BYO_DEFINITION}`), []);
  assert.match(phoneRoleProblems(`Restaurant phone: ${cateringPhone}`).join(" "), /approved contact for that role/);
  assert.match(phoneRoleProblems(`Catering phone: ${restaurantPhone}`).join(" "), /approved contact for that role/);
  const wrongCatering = readPageCopy(`<dl id="summary"><dt>Catering phone</dt><dd><a href="tel:unused">${restaurantPhone}</a></dd></dl>`);
  assert.equal(pageCopyProblems(wrongCatering)[0].location, "#summary");
  assert.match(pageCopyProblems(wrongCatering)[0].message, /approved contact for that role/);
  const stalePhone = restaurantPhone.replace(/\d$/, (digit) => String((Number(digit) + 1) % 10));
  assert.match(factProblems(`Call ${stalePhone}`).join(" "), /unverified phone/);
  assert.match(factProblems("Open 10 AM–10 PM.").join(" "), /differ from/);
  assert.deepEqual(factProblems("தினமும் காலை 11 மணி முதல் இரவு 11 மணி வரை திறந்திருக்கும்."), []);
  assert.match(factProblems("காலை 10 மணி முதல் இரவு 11 மணி வரை திறந்திருக்கும்.").join(" "), /differ from/);
  assert.match(factProblems("Brihadhee closes at 10 PM.").join(" "), /conflicts with the dining hours/);
  assert.match(factProblems("Closed on Sunday.").join(" "), /opening days/);
  assert.match(factProblems("Open 24/7.").join(" "), /round-the-clock/);
  assert.match(factProblems("W-44, Chennai 600041").join(" "), /unverified restaurant street number.*unverified restaurant postal code/);
  assert.match(factProblems("Customers cook their own dosa.").join(" "), /attributed to the kitchen/);
  assert.match(factProblems("This is a self-service cooking station.").join(" "), /attributed to the kitchen/);
  assert.deepEqual(factProblems("It is not a self-service cooking station."), []);
  assert.deepEqual(factProblems("Do customers cook their own dosa?"), []);
});

test("catering schema uses Service, a stable provider and a reference from each specialist service", () => {
  const shared = { "@type": "Service", "@id": CATERING_ID, provider: { "@id": RESTAURANT_ID } };
  const specific = { ...shared, "@id": `${SITE_ORIGIN}/corporate-catering-chennai/#service`, isRelatedTo: { "@id": CATERING_ID } };
  assert.deepEqual(cateringRelationshipProblems(shared, { shared: true }), []);
  assert.deepEqual(cateringRelationshipProblems(specific), []);
  const invalid = { ...specific, "@type": "CateringService", provider: { "@id": CATERING_ID }, isRelatedTo: null, address: {} };
  const messages = cateringRelationshipProblems(invalid).join(" ");
  assert.match(messages, /Schema.org Service/);
  assert.match(messages, /Service.provider/);
  assert.match(messages, /Service.isRelatedTo/);
  assert.match(messages, /location, hours/);
  assert.match(cateringRelationshipProblems(specific, { shared: true }).join(" "), /shared catering @id/);
});

test("llms checks reject stale or misplaced canonical answers, broken and missing links, and later contradictions", () => {
  const answerLines = canonicalAnswerLines();
  const url = `${SITE_ORIGIN}/`;
  const config = { expectedAnswers: answerLines, knownLinks: new Set([url]), requiredLinks: [url] };
  const body = `# Brihadhee\n\n> South Indian restaurant in Anna Nagar East.\n\n**Canonical answers**\n\n${answerLines.join("\n")}\n\n## Pages\n\n- [Home](${url})\n`;
  assert.deepEqual(llmsProblems(body, config), []);
  assert.match(llmsProblems(body.replace("11 AM to 11 PM", "10 AM to 11 PM"), config).join(" "), /canonical answers are stale/);
  assert.match(llmsProblems(body.replace("**Canonical answers**", "## Pages"), config).join(" "), /canonical answers label/);
  assert.match(llmsProblems(body.replace(`[Home](${url})`, `[Home](${url}old/)`), config).join(" "), /built canonical page.*missing canonical link/);
  assert.match(llmsProblems(`${body}- Dining hours: open 24/7.\n`, config).join(" "), /round-the-clock/);
});
