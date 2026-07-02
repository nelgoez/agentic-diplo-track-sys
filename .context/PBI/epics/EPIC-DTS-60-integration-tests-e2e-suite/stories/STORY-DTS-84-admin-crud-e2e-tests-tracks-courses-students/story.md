# Admin CRUD E2E tests — tracks, courses, students

**Jira Key:** [DTS-84](https://diplo-track-sys.atlassian.net/browse/DTS-84)
**Epic:** [DTS-60](https://diplo-track-sys.atlassian.net/browse/DTS-60) (Integration Tests + E2E Suite)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Admin CRUD E2E tests — tracks, courses, students

> [!NOTE] ***Admin paths.*** Tests the core CRUD operations.

## Objective

E2E tests for admin CRUD operations on tracks, courses, and students.

## Test scenarios

### Tracks

- [ ] Create track → GET tracks/:id returns created track
- [ ] List tracks → paginated results
- [ ] Update track name → reflected in GET
- [ ] Set track inactive → track no longer in active list
- [ ] No auth → 401

### Courses

- [ ] Create course in track → linked correctly
- [ ] List courses by track → ordered by order_index
- [ ] Update course → changes reflected
- [ ] Delete course (soft) → status changes

### Students

- [ ] List students → paginated with search
- [ ] Search by name → matching results only
- [ ] Search by email → exact match
- [ ] Get student detail → includes profile, enrollments, certificates
- [ ] Create student → appears in list

### Batch CSV enrollment

- [ ] POST /enrollments/batch with valid CSV → summary with created/enrolled/error counts
- [ ] CSV with duplicate emails → existing enrolled row
- [ ] CSV with invalid email → error row in summary

## Acceptance Criteria

- [ ] All CRUD scenarios pass
- [ ] Pagination works correctly (test page 1, page 2, empty page)
- [ ] Search filters return correct results
- [ ] CSV batch handles mixed valid/invalid rows

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
