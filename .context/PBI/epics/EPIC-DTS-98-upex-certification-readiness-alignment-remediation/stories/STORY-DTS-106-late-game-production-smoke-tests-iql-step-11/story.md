# Late-Game production smoke tests (IQL Step 11)

**Jira Key:** [DTS-106](https://diplo-track-sys.atlassian.net/browse/DTS-106)
**Epic:** [DTS-98](https://diplo-track-sys.atlassian.net/browse/DTS-98) (UPEX Certification Readiness — Alignment Remediation)
**Type:** Story
**Status:** Done
**Priority:** Medium
**Story Points:** -

---

## Overview

## Goal

Implement IQL Step 11 (Production Deployment & Smoke Tests) to close Late-Game testing gap.

## Done

- `tests/e2e/production-smoke.test.ts` — health endpoint check + login page load
- `tests/e2e/a11y-smoke.test.ts` — basic accessibility smoke
- `@axe-core/playwright` installed + `checkA11y()` helper in `@dts/test-kit`
- `@atc` decorator enriched with Jira story linking → Allure TMS links
- Traceability matrix generator built + CI artifact

## Remaining for Done

- [ ] Wire smoke tests to run post-deploy in staging CI
- [ ] Add `GET /api/health` to the app server in client repo (if not present)
- [ ] Document IQL Step 11 in methodology reference

## See

- `.context/reports/alignment-remediation-plan-2026-07-07.md` Sprint C
- IQL Methodology: Late-Game Phase → Step 11

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
