# BUG: Student data isolation broken — progress endpoint returns own data instead of 403

**Jira Key:** [DTS-85](https://diplo-track-sys.atlassian.net/browse/DTS-85)
**Priority:** Medium
**Status:** To Do
**Components:** None

---

## Description

## Description

`GET /students/:id/progress` silently overrides the requested `:id` with the authenticated student's own ID, never returning 403 when a student tries to access another student's progress.

## Root cause

In `server/src/routes/students.ts:77-92` the `/progress` endpoint checks if the student exists by email, then ***unconditionally overwrites*** `id` with their own student ID — bypassing any data isolation check against the requested `:id`.

## Impact

Students can attempt to access any student's progress endpoint without being blocked (they just get their own data back). Coordinator/admin correctly see the requested student's data.

## Fix applied

Added `ownStudent.id !== id` check before resolving to the student's own ID. Now returns 403 if the requested ID doesn't match the authenticated student.

## Test evidence

- Before: `Flow 7: cannot access progress of another student` → `expected 403, got 200`
- After: Returns 403 as expected

## Affected file

`server/src/routes/students.ts:82-88`

---

## Metadata

- **Created:** 12/6/2026
- **Updated:** 12/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez
- **Labels:** bug, data-isolation, security

---

_Synced from Jira by sync-jira-issues_
