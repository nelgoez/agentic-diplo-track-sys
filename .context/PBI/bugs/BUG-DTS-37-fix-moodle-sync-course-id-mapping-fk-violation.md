# BUG: Fix Moodle sync course ID mapping (FK violation)

**Jira Key:** [DTS-37](https://diplo-track-sys.atlassian.net/browse/DTS-37)
**Priority:** Medium
**Status:** Done
**Components:** None

---

## Description

Moodle sync uses numeric course IDs as UUID in certificates.course*id, causing FK violation on every upsert. Certificates never inserted during sync. Fix: added course mapping from moodle*course_id to local UUIDs in moodle.service.ts.

---

## Metadata

- **Created:** 5/6/2026
- **Updated:** 5/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez

---

_Synced from Jira by sync-jira-issues_
