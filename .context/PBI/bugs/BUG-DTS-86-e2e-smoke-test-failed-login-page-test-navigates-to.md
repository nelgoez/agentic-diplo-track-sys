# BUG: E2E smoke test failed — login page test navigates to landing page (/) instead of /login

**Jira Key:** [DTS-86](https://diplo-track-sys.atlassian.net/browse/DTS-86)
**Priority:** Medium
**Status:** To Do
**Components:** None

---

## Description

## Description

E2E smoke test `'should load login page'` navigates to `/` expecting login form fields, but the landing page (DTS-39) now lives at `/` and the login page moved to `/login`.

## Root cause

The landing page was added (DTS-39) but the smoke test in `client/tests/e2e/smoke.spec.ts` was not updated. It still expects email/password inputs at `/`.

## Impact

Regression workflow fails every time. The login page test is flaky — only passes if the app redirects to login (which it only does for authenticated users).

## Fix applied

- Changed `page.goto('/')` to `page.goto('/login')`
- Added new test `'should load landing page and navigate to login'` for the landing page coverage

## Test evidence

- Before: `element(s) not found` on email input at `/`
- After: Navigation to `/login` finds all expected elements

## Affected file

`client/tests/e2e/smoke.spec.ts:9-14`

---

## Metadata

- **Created:** 12/6/2026
- **Updated:** 12/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez
- **Labels:** bug, e2e, test-flake

---

_Synced from Jira by sync-jira-issues_
