# BUG: CORS blocks API from custom domain diplomatrackingsystem.qzz.io

**Jira Key:** [DTS-38](https://diplo-track-sys.atlassian.net/browse/DTS-38)
**Priority:** Medium
**Status:** Done
**Components:** None

---

## Description

Root cause: server CORS middleware only allowed .vercel.app origins. Production custom domain qzz.io blocked. Fix: added .qzz.io suffix match in index.ts and production URLs in CORS_ORIGIN env var. Related to DTS-32 and DTS-27 which passed locally but never worked in production.

---

## Metadata

- **Created:** 5/6/2026
- **Updated:** 5/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez

---

_Synced from Jira by sync-jira-issues_
