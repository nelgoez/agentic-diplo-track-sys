# Allure reporter integration — test report visualization

**Jira Key:** [DTS-104](https://diplo-track-sys.atlassian.net/browse/DTS-104)
**Epic:** [DTS-98](https://diplo-track-sys.atlassian.net/browse/DTS-98) (UPEX Certification Readiness — Alignment Remediation)
**Type:** Story
**Status:** Done
**Priority:** Medium
**Story Points:** -

---

## Overview

## Goal

Add Allure reporting to the Playwright test suite so UPEX certification checklist item "Links to Allure reports" is met.

## Done

- `allure-playwright` installed as devDependency
- `playwright.config.ts` configured with conditional Allure reporter when `ALLURE_DIR` env var is set
- GitHub Actions CI workflow generates Allure report on every push to staging
- Report uploaded as CI artifact
- `bun run test:e2e` with `ALLURE_DIR=allure-results` produces valid report
- `bun run allure:generate` converts results to HTML
- `bun run allure:open` serves report locally

## Files changed

- `package.json` — added `allure-playwright`, `allure-commandline`
- `playwright.config.ts` — conditional Allure reporter
- `.github/workflows/planning-ci.yml` — Allure report job

## See

- `.context/reports/alignment-remediation-plan-2026-07-07.md` Sprint A

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Out Of Scope](./out-of-scope.md)
- [Implementation Plan (Dev)](./implementation-plan.md)
- [Acceptance Test Plan (QA)](./acceptance-test-plan.md)
- [Acceptance Test Results (QA)](./acceptance-test-results.md)

---

## Metadata

- **Created:** 7/7/2026
- **Updated:** 7/7/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez

---

_Synced from Jira by sync-jira-issues_
