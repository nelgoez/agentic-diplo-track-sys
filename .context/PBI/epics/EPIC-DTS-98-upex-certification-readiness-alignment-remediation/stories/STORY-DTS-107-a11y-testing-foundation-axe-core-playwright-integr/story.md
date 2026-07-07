# a11y testing foundation — axe-core Playwright integration

**Jira Key:** [DTS-107](https://diplo-track-sys.atlassian.net/browse/DTS-107)
**Epic:** [DTS-98](https://diplo-track-sys.atlassian.net/browse/DTS-98) (UPEX Certification Readiness — Alignment Remediation)
**Type:** Story
**Status:** Done
**Priority:** Medium
**Story Points:** -

---

## Overview

## Goal

Add automated accessibility testing to the Playwright suite.

## Done

- `@axe-core/playwright` added to devDependencies
- `checkA11y()` and `assertNoA11yViolations()` helpers in `@dts/test-kit` at `packages/dts-test-kit/src/a11y.ts`
- Basic smoke test at `tests/e2e/a11y-smoke.test.ts`
- Re-exported from `@dts/test-kit` index

## Remaining

- [ ] Add a11y checks to critical user flows (login, enrollment, admin dashboard)
- [ ] Set a11y violation threshold for CI (fail build on critical violations)
- [ ] Document a11y testing pattern in KATA architecture reference

## See

- `.context/reports/alignment-remediation-plan-2026-07-07.md` Sprint D

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
