# Exam enrollment + grading E2E tests

**Jira Key:** [DTS-83](https://diplo-track-sys.atlassian.net/browse/DTS-83)
**Epic:** [DTS-60](https://diplo-track-sys.atlassian.net/browse/DTS-60) (Integration Tests + E2E Suite)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Exam enrollment + grading E2E tests

> [!NOTE] ***Core domain.*** Tests the exam lifecycle end-to-end.

## Objective

E2E tests for exam enrollment, eligibility check, and grade recording.

## Test scenarios

### Eligibility

- [ ] Student eligible → GET /enrollments/eligibility/:id returns eligible: true
- [ ] Student not eligible → eligible: false with breakdown
- [ ] Override applied → previously ineligible becomes eligible

### Exam enrollment

- [ ] POST /enrollments with exam*date → exam*status=inscripto
- [ ] Duplicate enrollment for same date → error
- [ ] Not eligible student → rejected with eligibility explanation
- [ ] Missing/exam_date → 400 validation

### Grade recording

- [ ] PUT /enrollments/:id/grade with grade=7 → exam_status=aprobado
- [ ] PUT /enrollments/:id/grade with grade=2 → exam_status=desaprobado
- [ ] Grade < 1 or > 10 → 400
- [ ] Grade on non-inscripto enrollment → error

### Exam history

- [ ] GET /enrollments?studentId=:id returns attempts sorted by date desc
- [ ] Shows grade, result, diploma status

## Acceptance Criteria

- [ ] All scenarios pass
- [ ] Tests are independent (no shared state)
- [ ] Cleanup removes test enrollments after suite

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

- **Created:** 12/6/2026
- **Updated:** 12/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez
- **Labels:** e2e, post-mvp, testing

---

_Synced from Jira by sync-jira-issues_
