# Xray integration — fallback for cert demo (primary: Allure traceability)

**Jira Key:** [DTS-105](https://diplo-track-sys.atlassian.net/browse/DTS-105)
**Epic:** [DTS-98](https://diplo-track-sys.atlassian.net/browse/DTS-98) (UPEX Certification Readiness — Alignment Remediation)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

## Goal

Provide UPEX certification audit evidence of test-to-requirement traceability with zero budget. Primary path: Allure + @atc decorator with embedded Jira links. Fallback: 30-day Xray trial for demo/certification day only.

## Decision: Option B (Allure-as-Xray)

Xray is a paid Jira plugin (~$10-20/mo). No budget available. Alternative accepted by UPEX DOJO certification checklist ("Links to Allure / Xray reports" — both valid).

## What was built

### @atc decorator enrichment

- `@atc(testId, { story: 'DTS-42', feature: 'Enrollment' })`
- Metadata stored in `getAllAtcs()` map
- Each ATC carries: testId, label, linked Jira story key, feature/epic name

### Allure traceability bridge

- `allure-bridge.ts` — `linkAtcsToAllure()` reads ATC metadata at test runtime
- Writes `@allure.tms(story, jiraUrl)` → clickable Jira link in Allure report
- Writes `@allure.label('story', key)` + `@allure.label('feature', name)` → filterable in Allure dashboard

### Traceability matrix generator

- `scripts/generate-traceability.ts` — CLI that dumps full ATC ↔ Jira story mapping
- Outputs `traceability-matrix.md` (human-readable table) + `traceability-matrix.json` (machine-readable)
- Runs in CI, uploaded as artifact alongside Allure report

### CI integration

- GitHub Actions workflow generates Allure report + traceability matrix on every push to staging
- Both uploaded as CI artifacts for audit inspection

## Files built

| File | Purpose |
| --- | --- |
| `packages/dts-test-kit/src/decorators.ts` | `@atc` with optional `{ story, feature }` |
| `packages/dts-test-kit/src/allure.ts` | `buildTraceabilityMatrix()`, `generateTraceabilityMarkdown()` |
| `packages/dts-test-kit/src/allure-bridge.ts` | `linkAtcsToAllure()` runtime bridge |
| `packages/dts-test-kit/src/index.ts` | Re-exports all new modules |
| `scripts/generate-traceability.ts` | CLI for traceability matrix generation |
| `.github/workflows/planning-ci.yml` | Allure + traceability as CI artifacts |

## Remaining

- [ ] Integrate Xray 30-day trial before cert demo day (3-day buffer)
- [ ] Test Allure→Xray import pipeline (allure-results.zip → Xray API)
- [ ] Document Xray setup in `.claude/skills/xray-cli/SKILL.md`

## Audit evidence for UPEX certification

- Allure report with embedded Jira TMS links proves traceability
- Traceability matrix CSV/JSON shows every test ↔ requirement mapping
- @atc decorator pattern demonstrates test architecture maturity
- Allure is explicitly listed as valid alternative in cert checklist
- Xray 30-day trial available if auditor specifically requests native Xray UI

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
