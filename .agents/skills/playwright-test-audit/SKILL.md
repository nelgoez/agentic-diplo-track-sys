---
name: playwright-test-audit
description: Scans Playwright test suites against the 2026 consolidated best-practices checklist. Produces a scored report (PASS/WARN/FAIL per item) covering authentication, locators, fixtures, test tags, flakiness prevention, CI/CD config, debugging setup, visual regression, API mocking, and test data hygiene. Triggers on: `audit playwright tests`, `playwright test audit`, `run playwright quality check`, `escanear tests de playwright`, `test health check`, `are my tests well written?`, `validate playwright test suite`. Use when opening an existing Playwright project for the first time, before a release to QA, or when reviewing a PR that modifies test files. Do NOT use for: writing new tests (use playwright-best-practices), debugging a single failing test (use playwright-cli), or unit-test design (use unit-testing).
license: MIT
metadata:
  author: internal
  version: "1.0"
---

# Playwright Test Audit

Scans existing Playwright test suites against the 2026 consolidated best-practices checklist — automated scoring, no manual review needed.

## How it works

1. Load `references/audit-checklist.md` — the complete checklist with check commands.
2. Find all Playwright test files (`*.spec.ts`, `*.spec.tsx`) and config files (`playwright.config.ts`, `playwright.prod.config.ts`).
3. Also check for `.github/workflows/*playwright*` or similar CI definitions.
4. For each file, evaluate every audit check that applies to it.
5. Produce a structured report (table format or JSON) with PASS / PASS-N/A / WARN / FAIL per item + score + remediation hint.

## Audit sections

| Section | Checks | Config | Tests | CI |
|---------|--------|--------|-------|----|
| §1 Authentication | 4 | ✓ | ✓ | ✓ |
| §2 Locators | 3 | ✓ | ✓ | |
| §3 Fixtures + POM | 3 | ✓ | ✓ | |
| §4 Test Tags | 3 | ✓ | ✓ | ✓ |
| §5 Flakiness Prevention | 3 | ✓ | ✓ | |
| §6 CI/CD | 3 | ✓ | | ✓ |
| §7 Visual Regression | 2 | ✓ | ✓ | |
| §8 API Mocking | 2 | | ✓ | |
| §9 Debugging | 2 | ✓ | | |
| §10 Test Data | 3 | | ✓ | |

**Total: 28 checks.** Each maps to a concrete file-grep pattern; none require a running browser.

## Output format

```
═══════════════════════════════════════════
  Playwright Test Audit Report
  Target: <project-root>
  Date:   <timestamp>
  Score:  <N>/<M> passed (X WARN, Y FAIL)
═══════════════════════════════════════════

§1 Authentication  [PASS: 2/4  WARN: 1  FAIL: 1]
  ✅ 1.1 storageState out of git (config)
  ✅ 1.2 Worker-scoped fixture (auth.ts)
  ⚠️  1.3 CI secrets injection (workflow) — credentials visible in job env
  ❌ 1.4 No hardcoded credentials (spec) — literal password in prod-smoke.spec.ts

...

§5 Flakiness Prevention  [FAIL: 1/3]
  ✅ 5.1 Web-first assertions used
  ✅ 5.2 retries configured
  ❌ 5.3 waitForSelector found in prod-smoke.spec.ts — use getByTestId().toBeVisible()

═══════════════════════════════════════════
  Remediation plan:
  1. Replace waitForSelector with getByTestId().toBeVisible()
  2. Move credentials to CI secrets
═══════════════════════════════════════════
```

The agent reads `references/scoring-rubric.md` for exact scoring rules and edge-case treatment (N/A items, partial credit).

## When to use

- Onboarding a new Playwright project — first thing to run.
- Before a QA release — catches structural issues before manual cycles.
- PR review that touches `*.spec.ts` or `playwright.config.*` — gate check.
