# Scoring Rubric — Playwright Test Audit

## Outcome values

| Label | Meaning | Counts toward |
|-------|---------|---------------|
| **PASS** | Check passes cleanly | Numerator + denominator |
| **PASS-N/A** | Check skipped — feature not used (e.g. no visual tests → §7 N/A) | Denominator only (no penalty) |
| **WARN** | Check partially passes or minor violation found | Denominator only |
| **FAIL** | Check clearly fails | Denominator only |

## Score calculation

```
raw_score = (PASS_count) / (total - PASS_N/A_count)
weighted_score = sum(PASS_weighted) / sum(total_weighted)
```

Both raw and weighted scores are reported. Weighted uses the section weights from `audit-checklist.md` §Weighting.

## Multi-file checks

Some checks scan multiple files (config + tests + CI). The per-file result is aggregated:

- If ANY file FAILs → check is FAIL
- If no FAILs but ANY file WARNs → check is WARN
- If all files PASS → check is PASS
- If no applicable files exist → PASS-N/A

## Edge cases

| Situation | Rule |
|-----------|------|
| No test files found | All checks become PASS-N/A. Report says "No Playwright tests detected." |
| No CI workflow found | CI-scoped checks become PASS-N/A |
| No config found | Config-scoped checks become PASS-N/A |
| Single spec file with no POM | §3.1 → FAIL, §3.2 → PASS-N/A, §3.3 → PASS-N/A |
| Mixed locator patterns | §2.2 → WARN if some `getByTestId` and some `page.locator`. FAIL if ALL are CSS/XPath. |
| `testIdAttribute` default used (not explicit) | §2.1 → WARN (works but undocumented convention) |

## Report format

Full report:

```
═══════════════════════════════════════════
  Playwright Test Audit Report
  Target: <project-root>
  Date:   <timestamp>
  Score:  <N>/<M> passed (X FAIL)
═══════════════════════════════════════════

§1 Authentication  [PASS: 2/4]
  ✅ 1.1 Title — evidence
  ✅ 1.2 Title — evidence
  ❌ 1.3 Title — evidence + hint

...

═══════════════════════════════════════════
  Remediation plan (ordered by impact):

  1. [weight] issue — fix command / action
═══════════════════════════════════════════
```

Short summary (for CI comment):

```
**Playwright Audit**: N/M passed (X FAIL)
  ⚠️  §1 Auth: missing storageState config
  ❌  §5 Flakiness: waitForSelector in prod-smoke.spec.ts
```
