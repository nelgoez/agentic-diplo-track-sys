# Master Implementation Plan — Diploma Tracking System (DTS)

> **Document**: System Discovery · Prioritized Roadmap
> **Project**: Diploma Tracking System — Universidad Nacional de Córdoba
> **Version**: 1.0 · **Status**: Final
> **Language**: English

---

## Phase Dependency Map

```
Phase 1 ──▶ Phase 2 ──▶ Phase 3 ──▶ Phase 4 ──▶ Phase 5
Foundation    Core        Rule        Enrollment    Admin &
(Auth+DB+     Domain      Engine      & Exam        Integration
Provider)     (CRUD)                              Sync
                │            │            │            │
                └────────────┴────────────┴────────────┘
                                           │
                                    Phase 6 (Should)
                                    Notifications
                                    & Polish

Phases 1-5 = MVP "Must Have"
Phase 6    = MVP "Should Have" (deprioritized but tracked)
Post-MVP   = "Could Have" + "Won't Have"
```

---

## Phase 1: Foundation

**Goal**: Auth system operational, database seeded, provider interfaces defined. Everything else depends on this.

### Stories

| ID | Story | Dependencies | Effort (SP) | Acceptance Criteria |
|----|-------|-------------|-------------|-------------------|
| DTS-AUTH-1 | **Supabase project setup + DB schema migration** | None | 3 | Supabase project created. Migration `001_initial_schema.sql` applied to staging. All tables, indexes, RLS policies, and triggers active. `bun run db:types` generates `database.types.ts`. |
| DTS-AUTH-2 | **JWT authentication (login + refresh + logout)** | DTS-AUTH-1 | 5 | POST /auth/login returns access+refresh tokens. POST /auth/refresh returns new token pair. POST /auth/logout revokes refresh token. Rate limiting on login (5 attempts/15min). |
| DTS-AUTH-3 | **RBAC middleware (authenticate + requireRole)** | DTS-AUTH-2 | 3 | `authenticate` middleware validates JWT and injects `auth` context. `requireRole(roles[])` gate works on test endpoints. 401 for missing/invalid token. 403 for insufficient role. |
| DTS-AUTH-4 | **User CRUD + role management** | DTS-AUTH-1 | 5 | Admin can create users with roles (estudiante/coordinador/admin/sysadmin). POST /admin/users creates user in Supabase Auth + users table. Email uniqueness enforced. |
| DTS-INT-1 | **Provider abstraction interfaces + registry** | None | 5 | `CertificateProvider` interface defined with `fetchCertificates()`, `validateCertificate()`, `healthCheck()`. `AcademicProvider` interface defined. `ProviderRegistry` with config-driven resolution. `providers.yaml` config format. |
| DTS-INT-2 | **Moodle provider (mock + health check)** | DTS-INT-1 | 3 | `MoodleCertificateProvider` implements `CertificateProvider`. Mock returns sample data. `healthCheck()` pings Moodle URL. Configurable URL + token. |
| DTS-INT-3 | **Integration logs table + logging middleware** | DTS-AUTH-1 | 2 | `integration_logs` table seeded. Helper functions: `logSyncStart()`, `logSyncComplete()`, `logPerStudent()`. |

**Phase 1 total**: 21 SP (story points)

### Key Deliverables
- [x] Supabase project + schema migrated
- [x] Auth endpoints working (login, refresh, logout, me)
- [x] RBAC middleware blocking unauthorized access
- [x] User management API
- [x] Provider interfaces defined (`CertificateProvider`, `AcademicProvider`)
- [x] Moodle provider (mock) with health check
- [x] Integration logging infrastructure

---

## Phase 2: Core Domain CRUD

**Goal**: Students, courses, tracks CRUD operational. Certificates viewable. Basic enrollment.

### Stories

| ID | Story | Dependencies | Effort (SP) | Acceptance Criteria |
|----|-------|-------------|-------------|-------------------|
| DTS-CORE-1 | **Tracks CRUD (list, create, get, update)** | DTS-AUTH-3 | 3 | Admin can create tracks with name, code, description. List tracks with pagination. Get track by ID. Update track name/description/status. Set track active/inactive. |
| DTS-CORE-2 | **Courses CRUD (list, create, get)** | DTS-CORE-1 | 3 | Admin can create courses within a track (name, code, order_index, credits). List courses by track. Get course detail. Order by order_index. |
| DTS-CORE-3 | **Students CRUD (list, get, search)** | DTS-AUTH-3 | 3 | Admin/coordinator can list students (paginated). Search by name/email/DNI. Get student detail with profile. Create student record. |
| DTS-CORE-4 | **Enrollment (single student to track)** | DTS-CORE-1 + DTS-CORE-3 | 3 | Coordinator enrolls existing student in track. Unique (student_id, track_id) enforced. Enrollment record created with status=active. Student created first if not exists. |
| DTS-CORE-5 | **Certificate list + get by ID** | DTS-CORE-2 + DTS-CORE-3 | 2 | GET /students/:id/certificates returns paginated list. GET /certificates/:id returns detail. Data includes course name, issue date, provider, status. |
| DTS-CORE-6 | **Batch enrollment from CSV** | DTS-CORE-4 | 5 | POST /enrollments/batch accepts CSV with email column. Creates new students, enrolls existing. Returns summary: created, enrolled, already enrolled, errors. |

**Phase 2 total**: 19 SP

### Key Deliverables
- [x] Tracks CRUD (admin)
- [x] Courses CRUD (admin)
- [x] Students list + search + detail
- [x] Single enrollment (coordinator)
- [x] Certificate list view (student)
- [x] Batch CSV enrollment

---

## Phase 3: Rule Engine

**Goal**: Prerequisite rules configurable, eligibility evaluation works in real-time, overrides functional.

### Stories

| ID | Story | Dependencies | Effort (SP) | Acceptance Criteria |
|----|-------|-------------|-------------|-------------------|
| DTS-RULE-1 | **Prerequisite rules CRUD (create, list, update, delete)** | DTS-CORE-2 | 8 | Coordinator can create ALL/ANY rules referencing courses. Rules persist in prerequisite_rules + prerequisite_sources. Tree structure: rules can have parent_rule_id for nesting. Update replaces rule. Delete requires admin. |
| DTS-RULE-2 | **Rule engine evaluator (recursive tree)** | DTS-RULE-1 | 8 | POST /rules/evaluate({studentId, trackId}) returns EligibilityResult. Recursive evaluation: ALL=all children pass, ANY=≥1 child passes. Uses student's approved certificates. Respects active overrides. <500ms per evaluation. Branch coverage ≥95% in tests. |
| DTS-RULE-3 | **Manual override CRUD** | DTS-RULE-2 + DTS-CORE-3 | 5 | Coordinator creates override for (student, rule) with reason+optional expiry. Unique active override constraint. Override reflected in rule evaluation immediately. Revoke removes override. Expired overrides auto-deactivated (cron). |
| DTS-RULE-4 | **View rule tree (read)** | DTS-RULE-1 | 2 | GET /courses/:id/prerequisites returns full rule tree. GET /rules?trackId=:id returns all rules for track. Hierarchical display structure. |

**Phase 3 total**: 23 SP

### Key Deliverables
- [x] Prerequisite rules CRUD with tree structure
- [x] Rule engine: recursive ALL/ANY evaluation
- [x] Manual overrides with optional expiry
- [x] Rule tree viewer endpoint
- [x] Unit tests ≥95% branch coverage on rule engine

---

## Phase 4: Enrollment & Exam

**Goal**: Full exam lifecycle — eligibility check, registration, grading, history.

### Stories

| ID | Story | Dependencies | Effort (SP) | Acceptance Criteria |
|----|-------|-------------|-------------|-------------------|
| DTS-EXAM-1 | **Student progress API** | DTS-CORE-2 + DTS-CORE-3 + DTS-CORE-5 | 5 | GET /students/:id/progress returns TrackProgress: totalModules, completedModules, per-module status (completed/in_progress/pending/error), nextSteps. Combines courses + certificates data. |
| DTS-EXAM-2 | **Eligibility check on dashboard** | DTS-RULE-2 + DTS-EXAM-1 | 5 | GET /enrollments/eligibility/:studentId returns eligibility with breakdown. Real-time evaluation. Connected to student dashboard endpoint. |
| DTS-EXAM-3 | **Exam enrollment (inscribir a examen)** | DTS-EXAM-2 | 5 | POST /enrollments (with exam_date) sets exam_status=inscripto. Re-evaluates eligibility at enrollment time. Rejects if student not eligible. Unique check for same date. |
| DTS-EXAM-4 | **Grade recording (+ auto-status transition)** | DTS-EXAM-3 | 5 | PUT /enrollments/:id/grade records grade (1-10). Grade ≥4 → exam_status=aprobado, diploma_pendiente. Grade <4 → exam_status=desaprobado. Validation: inscripto status, valid range. Audit log on grade. |
| DTS-EXAM-5 | **Exam history view** | DTS-EXAM-3 | 3 | GET /enrollments (filtered by student) returns exam attempts. Sorted by date descending. Shows date, grade, result, diploma status. |

**Phase 4 total**: 23 SP

### Key Deliverables
- [x] Student progress API (modules + certificates)
- [x] Eligibility endpoint connected to rule engine
- [x] Exam registration with re-evaluation
- [x] Grade recording with auto-status
- [x] Exam history for students

---

## Phase 5: Admin & Integration Sync

**Goal**: Admin dashboard with stats, Moodle sync operational, integration monitoring.

### Stories

| ID | Story | Dependencies | Effort (SP) | Acceptance Criteria |
|----|-------|-------------|-------------|-------------------|
| DTS-ADMIN-1 | **Admin dashboard stats** | DTS-CORE-1 + DTS-CORE-3 + DTS-CORE-5 | 5 | GET /admin/dashboard-stats returns: totalStudents, activeStudents, activeTracks, totalCertificates, eligibleCount, notEligibleCount, recentSyncErrors. Real-time counts. |
| DTS-ADMIN-2 | **Admin student list + detail (full profile)** | DTS-CORE-3 | 3 | GET /admin/students with search + filters. Student detail includes certificates, enrollments, overrides, exam history. |
| DTS-ADMIN-3 | **Admin tracks + courses management** | DTS-CORE-1 + DTS-CORE-2 | 3 | Admin CRUD for tracks and courses. Full management interface via API. |
| DTS-SYNC-1 | **Moodle batch certificate sync** | DTS-INT-2 + DTS-INT-3 + DTS-CORE-3 | 8 | POST /integrations/sync/moodle triggers async batch. Processes active students in batches of 50. Calls MoodleProvider per student. UPSERTs certificates. Logs progress in integration_logs. Conflict guard (no concurrent sync). Returns sync ID for status polling. |
| DTS-SYNC-2 | **Individual certificate re-sync** | DTS-SYNC-1 | 3 | POST /certificates/:id/resync re-syncs a single certificate from provider. Updates certificate record. Logs action to integration_logs + audit_log. |
| DTS-SYNC-3 | **Integration status + logs viewer** | DTS-INT-3 | 3 | GET /integrations/status returns per-provider health. GET /integrations/logs returns paginated, filterable logs (by provider, status, date range). |
| DTS-SYNC-4 | **Resilient adapter (retry + timeout)** | DTS-SYNC-1 | 5 | Wrapper that applies 3 retries with exponential backoff (1s, 4s, 9s). Per-student error isolation. Timeout configurable per provider (default 10s). Degraded operation when provider unreachable (existing data still readable). |

**Phase 5 total**: 30 SP

### Key Deliverables
- [x] Admin dashboard with stats
- [x] Admin student management
- [x] Admin track/course management
- [x] Moodle batch sync operational
- [x] Individual certificate re-sync
- [x] Integration status + logs viewer
- [x] Resilience: retry, backoff, timeout, graceful degradation

---

## Phase 6: Notifications & Polish (Should Have)

**Goal**: In-app notifications when students become eligible or receive new certificates.

### Stories

| ID | Story | Dependencies | Effort (SP) | Acceptance Criteria |
|----|-------|-------------|-------------|-------------------|
| DTS-NOTIF-1 | **Eligibility change notification** | PHASE-3 + PHASE-4 | 5 | When rule evaluation changes from not-eligible → eligible, system creates notification record. Notification visible in student dashboard. Unread count badge. Mark as read. |
| DTS-NOTIF-2 | **New certificate notification** | PHASE-5 (SYNC) | 3 | When sync imports a new certificate (not update), create notification for student. Includes course name + date. |
| DTS-NOTIF-3 | **Notification table + API** | DTS-NOTIF-1 | 3 | `notifications` table (id, userId, type, title, body, read, createdAt). GET /notifications (paginated, unread first). PUT /notifications/:id/read. Unread count badge endpoint. |
| DTS-OVERRIDE-1 | **Override expiry scheduler** | DTS-RULE-3 | 3 | Cron job: daily check for expired overrides → set status=expired → re-evaluate affected students → notify coordinators. |
| DTS-INT-5 | **Guaraní student sync** | DTS-INT-1 + DTS-CORE-3 | 8 | `GuaraniAcademicProvider` implements `AcademicProvider.fetchStudents()`. POST /integrations/sync/guarani triggers import. Upserts students by email/DNI. Same resilience pattern as Moodle. |
| DTS-EXTRAS-1 | **Coordinator dashboard with filters** | PHASE-4 | 5 | Coordinator dashboard: track summary, eligible/not-eligible filter, student search within track, bulk grade input for exam date. |

**Phase 6 total**: 27 SP

---

## Consolidated Effort

| Phase | SP | Must Have | Should Have | Could Have |
|-------|----|-----------|-------------|------------|
| 1. Foundation | 21 | 21 | 0 | 0 |
| 2. Core Domain | 19 | 19 | 0 | 0 |
| 3. Rule Engine | 23 | 18 | 5 | 0 |
| 4. Enrollment & Exam | 23 | 20 | 3 | 0 |
| 5. Admin & Integration | 30 | 30 | 0 | 0 |
| 6. Notifications & Polish | 27 | 0 | 22 | 5 |
| **Total MVP (Must)** | **116** | **108** | **8** | **0** |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Moodle API changes or undocumented behavior | Medium | High | Provider abstraction limits blast radius. Logging for debugging. Use Moodle's web service documentation + test environment. |
| Rule engine bugs produce incorrect eligibility | Low | Critical | ≥95% branch coverage required. Test with edge cases: empty rules, deeply nested trees, overrides + rules interaction. |
| Sync performance degrades with 10K+ students | Medium | Medium | Batch processing (50/block). Async with progress polling. Consider queue workers for Phase 5. |
| Provider credentials leak | Low | Critical | AES-256-GCM encryption at rest. Never in logs or responses. Environment variables for local dev. |
| Guaraní API unavailable during enrollment periods | Medium | Medium | Graceful degradation: system works with cached data. Manual student creation as fallback. |

---

## Post-MVP Roadmap

| Feature | Target | Priority |
|---------|--------|----------|
| Digital diploma PDF generation | Post-MVP | Could Have |
| Public diploma verification portal | Post-MVP | Won't Have |
| Digital signature (normativa UNC) | Post-MVP | Won't Have |
| Canvas LMS integration | Post-MVP | Won't Have (MVP has abstraction) |
| Student self-enrollment | Post-MVP | Won't Have (MVP: coordinator only) |
| Advanced analytics & reports | Post-MVP | Could Have |
| Integration tests + E2E suite | Post-MVP | Internal quality goal |

---

## Implementation Sequence (Recommended Sprint Allocation)

```
Sprint 1: Phase 1 (Foundation)
  - DTS-AUTH-1, DTS-AUTH-2, DTS-AUTH-3, DTS-AUTH-4
  - DTS-INT-1, DTS-INT-2, DTS-INT-3

Sprint 2: Phase 2 (Core Domain)
  - DTS-CORE-1, DTS-CORE-2, DTS-CORE-3, DTS-CORE-4

Sprint 3: Phase 2 (Finish) + Phase 3 Start
  - DTS-CORE-5, DTS-CORE-6
  - DTS-RULE-1 (rules CRUD)

Sprint 4: Phase 3 (Rule Engine)
  - DTS-RULE-2 (evaluator), DTS-RULE-3 (overrides), DTS-RULE-4 (viewer)

Sprint 5: Phase 4 (Enrollment & Exam)
  - DTS-EXAM-1, DTS-EXAM-2, DTS-EXAM-3

Sprint 6: Phase 4 (Finish) + Phase 5 Start
  - DTS-EXAM-4, DTS-EXAM-5
  - DTS-ADMIN-1, DTS-ADMIN-2, DTS-ADMIN-3

Sprint 7: Phase 5 (Sync)
  - DTS-SYNC-1, DTS-SYNC-2, DTS-SYNC-3

Sprint 8: Phase 5 (Resilience) + Phase 6 Start
  - DTS-SYNC-4
  - DTS-NOTIF-1, DTS-NOTIF-2, DTS-NOTIF-3

Sprint 9+: Phase 6 (Should Have backlog)
  - DTS-OVERRIDE-1, DTS-INT-5, DTS-EXTRAS-1
  - Bug fixes, polish, performance optimization
```

**Total estimated duration**: 9-10 sprints (assuming 2-week sprints = 18-20 weeks).

---

> *Generated as part of DTS Discovery Maps. Refresh when scope changes, new stories are added, or sprint velocity is calibrated.*
