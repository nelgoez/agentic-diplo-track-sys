# Certificate sync E2E tests — Moodle workflow

**Jira Key:** [DTS-82](https://diplo-track-sys.atlassian.net/browse/DTS-82)
**Epic:** [DTS-60](https://diplo-track-sys.atlassian.net/browse/DTS-60) (Integration Tests + E2E Suite)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Certificate sync E2E tests — Moodle workflow

> [!NOTE] ***Integration testing.*** Requires sync endpoint to be available.

## Objective

E2E tests for the Moodle certificate sync workflow.

## Test scenarios

### Trigger sync

- [ ] POST /integrations/sync/moodle returns syncId + status
- [ ] syncId can be used to poll status
- [ ] Sync completes within timeout (30s for test)

### Certificate lifecycle

- [ ] After sync, student has certificates listed
- [ ] GET /students/:id/certificates returns synced certs
- [ ] Re-sync updates existing certificates (no duplicates)

### Error handling

- [ ] Invalid Moodle token → graceful error, not 500
- [ ] Network timeout → retry mechanism works
- [ ] Student not found in Moodle → logged, not aborted

### Conflict guard

- [ ] Concurrent sync request → 409 Conflict
- [ ] Second sync starts after first completes

## Mock

For CI testing without real Moodle:

- Mock the MoodleProvider at the provider registry level
- Return controlled test data
- Test real HTTP handling with mocked data

## Acceptance Criteria

- [ ] All scenarios pass against mocked Moodle
- [ ] Conflict guard properly rejects concurrent requests
- [ ] Test data cleaned up after suite runs

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
