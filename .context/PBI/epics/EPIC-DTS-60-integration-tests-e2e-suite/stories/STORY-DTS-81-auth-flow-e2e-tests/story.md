# Auth flow E2E tests

**Jira Key:** [DTS-81](https://diplo-track-sys.atlassian.net/browse/DTS-81)
**Epic:** [DTS-60](https://diplo-track-sys.atlassian.net/browse/DTS-60) (Integration Tests + E2E Suite)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Auth flow E2E tests

> [!NOTE] ***Critical path.*** Must pass before any other E2E.

## Objective

End-to-end tests for authentication flows covering login, token refresh, logout, and RBAC.

## Test scenarios

### Login

- [ ] Valid credentials → 200 + access*token + refresh*token
- [ ] Invalid password → 401
- [ ] Non-existent email → 401
- [ ] Empty body → 400 validation error

### Token refresh

- [ ] Valid refresh_token → new token pair
- [ ] Expired refresh_token → 401
- [ ] Revoked refresh_token (after logout) → 401

### Logout

- [ ] Logout with valid token → 200
- [ ] Subsequent refresh with same token → 401

### RBAC

- [ ] estudiante cannot access admin endpoints → 403
- [ ] admin can access admin endpoints → 200
- [ ] No token → 401 on any protected endpoint

### Session expiry

- [ ] Expired token → 401 → refresh flow → works
- [ ] Expired token → 401 → no refresh token → session expiry modal

## Setup

- Use existing Playwright test suite (client/e2e/)
- Test user: admin@dts.unc.edu.ar
- Isolated: each test creates/fetches its own session
- No test interdependency

## Acceptance Criteria

- [ ] All scenarios pass against production API (or mock)
- [ ] Tests run in CI without flakiness
- [ ] < 30s total execution time

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
