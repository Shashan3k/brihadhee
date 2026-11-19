# 15 AEO gap check against the 12 Nov Keyword Plan (21 Nov 2026)

This is Phase 4 of the live-repo prompt. **No site code changed. No ungated AEO gap was found.**

## Method

I matched all **147 questions** in Sections 4.1–4.9 of the Keyword Plan (from an external keyword coverage map) against `docs/seo/aeo-coverage.csv` (299 queries) by token overlap. The threshold was ≥ 0.6, after removing stop words and the brand and place names.

## Result

145 of the 147 questions matched a row in `aeo-coverage.csv`:

| Disposition in `aeo-coverage.csv` | Questions |
|---|---|
| ANSWERED | 67 |
| APPROVAL_GATED | 45 |
| TRACK_ONLY | 19 |
| OWNER_CONFIRMATION | 8 |
| LOCATION_DEPENDENT | 6 |

The two that didn't match:
- **"What is Brihadhee in Anna Nagar?"** It is made only of brand and stop words, so the matcher can't score it. The site answers it in the entity description (`entity-truth.ts` `brandDescription`) on `/` and `/about/`.
- **One gated no-onion question.** It stays behind Q11–Q14.

## Conclusion

Every Keyword Plan question whose facts are confirmed is already answered on one route. The rest are gated (owner approval pack, `owner-questions.md` §B) or measure-only. New AEO copy waits for owner approvals, not engineering. Writing answers now would break `CLAUDE.md` (gated topics and "best" claims).
