# Sprint Backlog — MVP Complete ✅

> **Role**: Scrum Master / Engineering Manager
> **Date**: 2026-06-04 (updated from 2026-06-01)
> **Status**: ALL DONE. Previous version was stale. See SESSION_CONTEXT.md in diploma-tracking-sys repo for canonical state.

---

## MVP Status: 30/30 stories delivered

| Phase | Stories | Status |
|-------|---------|--------|
| 1. Foundation | 7/7 (DTS-AUTH 1-4, DTS-INT 1-3) | ✅ Complete |
| 2. Core Domain | 6/6 (DTS-CORE 1-6) | ✅ Complete |
| 3. Rule Engine | 4/4 (DTS-RULE 1-4) | ✅ Complete |
| 4. Enrollment & Exam | 5/5 (DTS-EXAM 1-5) | ✅ Complete |
| 5. Admin & Integration | 7/7 (DTS-ADMIN 1-3, DTS-SYNC 1-4) | ✅ Complete |
| 6. Notifications & Polish | 4/4 (NOTIF 1-3 + OVERRIDE-1) | ✅ Complete |
| Notif UI + QA Audit | 5/5 (DTS-26 to DTS-30) | ✅ Complete |

## Previously misreported as missing — actually DONE

| Story | Reality | Evidence |
|-------|---------|----------|
| DTS-24 (Resilient Adapter) | Done | `resilient-adapter.ts` 239-line test file |
| DTS-23 (Conflict Guard) | Done | `syncLocks` Map in integrations.ts |
| DTS-22 (Grade UI) | Done | `GradeExamModal.tsx` 247 lines |
| DTS-25 (Guaraní) | Done | `guarani.service.ts` 299 lines |

## QA Audit Findings (2026-06-04) — All Resolved

| P1 Issue | Fix |
|----------|-----|
| Certificates invisible for staff | CertificatesPage now fetches API. 27 certs seeded. DTS-27 |
| Sync never works | Integration-logs RLS fix, pre-flight checks, token pushed. DTS-26 |
| Dashboard redundancy | Removed AdminStatsGrid from non-student view. DTS-28 |
| Admin no courses CRUD | CourseManagement shared component + AdminPage tab. DTS-29 |
| No notifications UI | Bell icon + drawer panel. DTS-30 |

## Jira Board

All issues at https://diplo-track-sys.atlassian.net/jira/software/projects/DTS

| Key | Summary | Status |
|-----|---------|--------|
| DTS-9 | Notificaciones (Epic) | ✅ Done |
| DTS-26 | Sync infrastructure fixes | ✅ Done |
| DTS-27 | Certificates seeding + UI | ✅ Done |
| DTS-28 | Dashboard redundancy | ✅ Done |
| DTS-29 | Admin courses CRUD | ✅ Done |
| DTS-30 | Notifications UI | ✅ Done |

## Next Steps
- 🎯 Obtain admin Moodle token for cross-user sync
- 🎯 Institution-scoped theming (template readiness)
- 🎯 Onboarding script for new universities
