# BUG: Login fails with 'Failed to fetch' on production domain diplomatrackingsystem.qzz.io

**Jira Key:** [DTS-32](https://diplo-track-sys.atlassian.net/browse/DTS-32)
**Priority:** Medium
**Status:** Done
**Components:** None

---

## Description

## Root cause

Two issues blocking login at https://diplomatrackingsystem.qzz.io:

1. ***CORS rejected the custom domain*** — server only allowed .vercel.app domains + CORS_ORIGIN=localhost:5173. Production domain diplomatrackingsystem.qzz.io got blocked.
2. ***VITE*API*URL pointed to frontend domain*** instead of the API server — frontend was calling https://nelgoez-diploma-tracking-sys.vercel.app/api/v1 (the SPA itself) instead of https://server-xi-three-70.vercel.app/api/v1 (the API server).

## Fix

- Code: CORS middleware now supports comma-separated origins in CORS_ORIGIN env var (server/src/index.ts:32-39)
- Vercel server env: Added CORS_ORIGIN=https://diplomatrackingsystem.qzz.io,http://localhost:5173
- Vercel frontend env: Updated VITE*API*URL=https://server-xi-three-70.vercel.app/api/v1

## Verified

- CORS preflight returns Access-Control-Allow-Origin: https://diplomatrackingsystem.qzz.io
- Frontend JS bundle contains correct server URL
- Domain serves 200 with correct app

---

## Metadata

- **Created:** 4/6/2026
- **Updated:** 4/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez

---

_Synced from Jira by sync-jira-issues_
