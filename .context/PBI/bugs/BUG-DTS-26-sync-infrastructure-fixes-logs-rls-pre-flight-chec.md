# BUG: Sync infrastructure fixes — logs RLS, pre-flight checks, Moodle token

**Jira Key:** [DTS-26](https://diplo-track-sys.atlassian.net/browse/DTS-26)
**Priority:** Medium
**Status:** Done
**Components:** None

---

## Description

Fixes applied to make the Moodle sync operational and debuggable.

- integration-logs.ts*** was using anon-key Supabase client. Writes blocked by RLS. Fixed: switched to supabaseAdmin.***
- Pre-flight health check*** added to POST /integrations/sync/moodle. Checks Moodle connectivity and active student count before attempting sync. Returns clear error messages instead of silent completion.***
- MOODLE*API*TOKEN*** pushed to Vercel production env. Moodle health now shows connected instead of token-invalid.***
- Sync logs now readable via GET /integrations/logs. Was empty before (RLS blocked writes).

Limitations: current token is user-scoped (nelthor). core*user*get*users*by_field returns empty for cross-user lookup. Admin-scoped Moodle token needed for multi-student sync.

Verified: Playwright 7/7 passed. Sync runs, logs write, health check passes.

---

## Metadata

- **Created:** 4/6/2026
- **Updated:** 4/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez

---

_Synced from Jira by sync-jira-issues_
