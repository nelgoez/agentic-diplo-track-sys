# Session Summary — 2026-06-05

## Production fixes + Landing page

---

## Tickets Created / Updated

| Ticket                                                        | Type  | Summary                                          | Status                 |
| ------------------------------------------------------------- | ----- | ------------------------------------------------ | ---------------------- |
| [DTS-37](https://diplo-track-sys.atlassian.net/browse/DTS-37) | Bug   | Fix Moodle sync course ID mapping (FK violation) | In Progress            |
| [DTS-38](https://diplo-track-sys.atlassian.net/browse/DTS-38) | Bug   | CORS blocks API from custom domain qzz.io        | In Progress            |
| [DTS-39](https://diplo-track-sys.atlassian.net/browse/DTS-39) | Story | Public landing page + route restructuring        | In Progress            |
| [DTS-40](https://diplo-track-sys.atlassian.net/browse/DTS-40) | Epic  | Landing Page y Pulido Producción                 | In Progress            |
| [DTS-27](https://diplo-track-sys.atlassian.net/browse/DTS-27) | Bug   | Commented: CORS root cause for prod visibility   | Done (needs re-verify) |

---

## Root Cause Analysis

**DTS-27 and DTS-32 were closed as Done but never worked in production.**

CORS middleware in `server/src/index.ts` only allowed origins ending in `.vercel.app`. The production custom domain `diplomatrackingsystem.qzz.io` did not match → browser blocked ALL API calls. Both bugs passed locally (localhost:5173 is in CORS_ORIGIN) but failed in production.

**Second bug**: Moodle sync used numeric Moodle course IDs (e.g. "159") as `certificates.course_id` (UUID column) → PostgreSQL FK violation on every upsert → zero certificates inserted during sync.

---

## Code Changes (all in `diploma-tracking-sys` repo)

### DTS-38 — CORS fix

| File                     | Change                                                                                       |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| `server/src/index.ts:37` | Added `origin.endsWith('.qzz.io')` to CORS allow list                                        |
| `server/.env:22`         | CORS_ORIGIN: added `diplomatrackingsystem.qzz.io`, `nelgoez-diploma-tracking-sys.vercel.app` |

### DTS-37 — Moodle sync fix

| File                                            | Change                                                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `server/src/services/moodle.service.ts:328-380` | Pre-fetch course mapping (moodle_course_id → local UUID), map certs before upsert, skip unmapped |

### DTS-39 — Landing page

| File                                          | Change                                                    |
| --------------------------------------------- | --------------------------------------------------------- |
| `client/src/pages/LandingPage.tsx`            | **NEW** — Hero gradient, audience cards, features, footer |
| `client/src/i18n/index.ts`                    | **NEW** — 20 translation keys (es/en) for landing page    |
| `client/src/App.tsx`                          | Routes: `/` → LandingPage, `/app/*` → auth-gated          |
| `client/src/components/layout/MainLayout.tsx` | Nav paths → `/app/*`, logout → `/`                        |
| `client/src/pages/LoginPage.tsx`              | Redirect → `/app/dashboard`                               |
| `client/src/components/ProtectedRoute.tsx`    | Role mismatch → `/app/dashboard`                          |
| `client/src/pages/DashboardPage.tsx`          | hrefs → `/app/*`                                          |

### Additional

| File        | Change                                                                                |
| ----------- | ------------------------------------------------------------------------------------- |
| Supabase DB | Inserted IA y automatización certificate for Nahuel (2026-01-27, course: IA-AUTO-UNC) |

---

## Pending — Before Production Verification

1. **Rebuild & deploy server** — CORS fix + Moodle sync fix
2. **Rebuild & deploy client** — Landing page + route restructuring
3. **Update Vercel env vars** — Ensure `CORS_ORIGIN` on production deployment includes `diplomatrackingsystem.qzz.io`
4. **Run seed** — `bun run server/src/seed.ts` against production DB if not already seeded
5. **Verify DTS-27 AC1** — Admin login → /app/certificates → shows 27+ certificates
6. **Verify DTS-32** — Login works from `diplomatrackingsystem.qzz.io`

---

## What to Pick Up Next

### Must-Have MVP Gaps

- DTS-EXAM-4: Grade Recording frontend + tests (~1 SP)
- DTS-SYNC-4: Resilient adapter (retry/backoff decorator) (~3 SP)
- DTS-SYNC-1: Post-sync eligibility + conflict guard (~2 SP)
- DTS-SYNC-2: Individual cert re-sync endpoint (~3 SP)

### Should-Have (Phase 6)

- DTS-NOTIF-3: Notification table + API (~3 SP)
- DTS-OVERRIDE-1: Override expiry scheduler (~2 SP)
- DTS-Extras: Coordinator dashboard with filters (~5 SP)

### Landing Page Follow-ups

- E2E tests for landing page (unauthenticated visit, CTA → login, auth redirect)
- E2E tests: route `/` → `/app/dashboard` for authenticated user
- Update existing E2E tests with new `/app/*` paths

---

## Session Metadata

- **Date**: 2026-06-05
- **Repo (context)**: `agentic-diplo-track-sys`
- **Repo (application)**: `diploma-tracking-sys` (`nelgoez/diploma-tracking-sys`)
- **Jira**: `diplo-track-sys.atlassian.net` (project: DTS)
- **Production**: `diplomatrackingsystem.qzz.io`
- **Staging branch**: `staging` (Preview Deployments on Vercel)
- **Pipeline doc**: `.context/reports/CI-CD-PIPELINE.md`
- **Staging**: `nelgoez-diploma-tracking-sys.vercel.app`

---

## Jira Issue Linking — Final

| Epic                       | Children       | Notes                   |
| -------------------------- | -------------- | ----------------------- |
| DTS-5 (Integración Moodle) | DTS-37         | Moodle sync FK fix      |
| DTS-40 (Landing + Pulido)  | DTS-38, DTS-39 | CORS fix + Landing page |

Linking done FROM child tickets via "Add Epic/Parent" in Jira UI (team-managed project).

**Not linked** (only commented):

- DTS-27 — Done, commented with CORS root cause. Re-verify after DTS-38 deploy.
- DTS-32 — Done, same CORS root cause as DTS-38.
