# EPIC: UPEX Certification Readiness — Alignment Remediation

**Jira Key:** [DTS-98](https://diplo-track-sys.atlassian.net/browse/DTS-98)
**Priority:** Medium
**Status:** To Do
**Total Story Points:** 0

---

## Description

Close gaps for UPEX Galaxy Agentic Quality Engineer certification. See full plan at `.context/reports/alignment-remediation-plan-2026-07-07.md` (synced to graphify).

## Gaps to close

1. ***Allure reports*** — Add `allure-playwright` reporter + CI artifact generation
2. ***Xray integration*** — Wire Xray test management into Jira workflow
3. ***Late-Game testing (IQL Step 11)*** — Production smoke tests + health endpoint
4. ***a11y testing*** — axe-core Playwright integration
5. ***VCR framework*** — Value-Cost-Risk analysis reference

## Sprint allocation

Sprint A (NOW): Allure + a11y scaffolding + plan doc → graphify

Sprint B: Xray integration (depends on Jira plugin confirmation)

Sprint C: Late-Game smoke tests + monitoring

Sprint D: VCR framework + polish

---

## User Stories

| Key | Story | Points | Priority | Status |
| --- | ----- | ------ | -------- | ------ |
| [DTS-104](https://diplo-track-sys.atlassian.net/browse/DTS-104) | Allure reporter integration — test report visualization | - | Medium | Done |
| [DTS-105](https://diplo-track-sys.atlassian.net/browse/DTS-105) | Xray integration — fallback for cert demo (primary: Allure traceability) | - | Medium | To Do |
| [DTS-106](https://diplo-track-sys.atlassian.net/browse/DTS-106) | Late-Game production smoke tests (IQL Step 11) | - | Medium | Done |
| [DTS-107](https://diplo-track-sys.atlassian.net/browse/DTS-107) | a11y testing foundation — axe-core Playwright integration | - | Medium | Done |
| [DTS-108](https://diplo-track-sys.atlassian.net/browse/DTS-108) | VCR framework — Value-Cost-Risk analysis reference | - | Medium | Done |

---

## Planning

- [Feature Implementation Plan (Dev)](./feature-implementation-plan.md)
- [Feature Test Plan (QA)](./feature-test-plan.md)

---

## Metadata

- **Created:** 7/7/2026
- **Updated:** 7/7/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez

---

_Synced from Jira by sync-jira-issues_
