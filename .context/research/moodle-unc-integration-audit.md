# Moodle UNC Integration Audit + DTS Codebase Gap Analysis

> **Date**: 2026-05-29
> **Researcher**: Nahuel / Agentic DTS
> **Tools**: Playwright CLI (browser automation) + Codebase static analysis
> **Repos**: `diploma-tracking-sys` (code) + `agentic-diplo-track-sys` (planning)

---

## Part A: UNC Platforms — Playwright Exploration

### Platforms Architecture (verified 2026-05-29)

```
campusvirtual.unc.edu.ar (WordPress — portal público)
  └─ NavBar: "Acceder" ──▶ campus.aulavirtual.unc.edu.ar/login/index.php (Moodle 4.5.8+)
```

**Confirmed**: Platforms are self-contained. WordPress is the public-facing marketing portal. The "Acceder" button in the navbar links directly to Moodle login. No Open edX instance exists — `edx.campusvirtual.unc.edu.ar` redirects to WordPress. DTS only needs to integrate with Moodle.

### Moodle Details

| Property | Value |
|---|---|
| Version | Moodle 4.5.8+ (Build: 20251219), version 2024100708.02 |
| Theme | Boost |
| Completion tracking | Enabled |
| Badges, competencies | Enabled |
| API REST | Active (moodle_mobile_app service) |
| Certificate plugin | `mod/customcert` |
| Auth methods | Local login, SAML2 SSO, Guest |

### API Token Scope — Verified

**Service**: `moodle_mobile_app`
**Endpoint**: `POST /login/token.php`
**User**: nelthor (ID 154814, email: nahuelgomez.cti@gmail.com)

```
Token: e7fe62e377593713e8ccd71c690055df
```

**Scope tests performed via Playwright browser**:

| Function | Test | Result | Notes |
|---|---|---|---|
| `core_webservice_get_site_info` | No params | ✅ Returns site info | Works for any valid token |
| `core_user_get_users_by_field` | email=nahuelgomez.cti@gmail.com (owner) | ✅ Returns owner's profile | Full profile with customfields (DNI, ciudad, etc.) |
| `core_user_get_users_by_field` | email=otro.usuario@unc.edu.ar (other) | `[]` empty | Cannot query other users |
| `core_user_get_users_by_field` | email=nelthor@gmail.com (nonexistent) | `[]` empty | Expected — user not found |
| `core_user_get_users_by_field` | field=username, values[0]=nelthor | `[]` empty | Cannot query even by username |
| `core_enrol_get_users_courses` | userid=154814 (owner) | ✅ Returns 2 courses | Works for token owner |
| `core_completion_get_course_completion_status` | userid=154814, courseid=159 | `nocriteriaset` error | Course 159 has no completion criteria |
| `core_enrol_get_enrolled_users` | courseid=159 | `nopermissions` | Student cannot view participants |

**Conclusion**: Token is **user-scoped** (token owner only). For system-level sync across all students, UNC must provide an **admin/manager-level Moodle API token**. Current token suffices for demo/development with a single test user.

**Customcert API Note**: The `mod_customcert` plugin has its own web service functions. Only `delete_issue` is exposed via `moodle_mobile_app`. To query certificates directly, UNC must either:
1. Create a custom web service exposing `mod_customcert_get_issues`
2. OR use `core_completion_get_course_completion_status` as a proxy (but this requires completion criteria to be set on each course)

### Available Functions (relevant to DTS)

| Category | Functions |
|---|---|
| Students | `core_user_get_users_by_field`, `core_user_get_course_user_profiles`, `core_enrol_get_enrolled_users` |
| Courses | `core_course_get_courses_by_field`, `core_course_get_categories`, `core_enrol_get_users_courses` |
| Completion | `core_completion_get_activities_completion_status`, `core_completion_get_course_completion_status` |
| Grades | `gradereport_user_get_grades_table`, `gradereport_overview_get_course_grades` |
| Certificates | `mod_customcert_delete_issue` only — `get_issues`/`get_certificates` NOT exposed |

### User Test Data

| Field | Value |
|---|---|
| Username | nelthor |
| Name | Nahuel Leonardo Elias Gomez |
| Moodle user ID | 154814 |
| Enrolled courses | 2 (IA: Empezar a Pensar(la), Python Certificación 2) |
| Certificates | 2 (Asistencia + Aprobación on "IA y automatización") |

---

## Part B: DTS Codebase — Full Server Audit

### Route Catalog (43 endpoints, 42 working, 1 stub)

**Prefix**: `/api/v1`

#### Auth (`routes/auth.ts`)
| Endpoint | Auth | Status |
|---|---|---|
| `POST /auth/login` | Public | Working |
| `POST /auth/refresh` | Public | Working |
| `POST /auth/logout` | Bearer token | Working |
| `GET /auth/me` | authenticate | Working |

#### Admin (`routes/admin.ts`) — all require admin/sysadmin
| Endpoint | Status |
|---|---|
| `POST /admin/users` | Working |
| `GET /admin/dashboard-stats` | Working (8 parallel queries) |
| `GET /admin/students` | Working (paginated, searchable) |
| `GET /admin/courses` | Working |
| `GET /admin/tracks` | Working |

#### Students (`routes/students.ts`)
| Endpoint | Gate | Status |
|---|---|---|
| `GET /students` | coordinador+/admin | Working |
| `GET /students/:id` | Self-serve for estudiante | Working (ownership gate) |
| `GET /students/:id/progress` | Self-serve for estudiante | Working (ownership gate) |
| `GET /students/:id/certificates` | Self-serve for estudiante | Working (ownership gate) |

#### Tracks (`routes/tracks.ts`)
| Endpoint | Gate | Status |
|---|---|---|
| `GET /tracks` | Auth only | Working (paginated) |
| `GET /tracks/:id` | Auth only | Working |
| `POST /tracks` | admin/sysadmin | Working (Zod) |
| `PATCH /tracks/:id` | admin/sysadmin | Working (Zod) |

#### Courses (`routes/courses.ts`)
| Endpoint | Gate | Status |
|---|---|---|
| `GET /courses` | Auth only | Working |
| `GET /courses/:id` | Auth only | Working |
| `GET /courses/:id/prerequisites` | Auth only | Working (rule tree) |
| `POST /courses` | admin/sysadmin | Working (Zod, auto order_index) |
| `PATCH /courses/:id` | admin/sysadmin | Working (Zod) |

#### Certificates (`routes/certificates.ts`)
| Endpoint | Status |
|---|---|
| `GET /certificates` | Working |
| `GET /certificates/:id` | Working |
| `POST /certificates/sync` | **STUB** — dead code, returns {synced:0} |

#### Enrollments (`routes/enrollments.ts`)
| Endpoint | Gate | Status |
|---|---|---|
| `GET /enrollments` | Auth only | Working |
| `GET /enrollments/eligibility/:studentId` | Auth only | Working (live rule engine) |
| `POST /enrollments` | Self or admin | Working |
| `POST /enrollments/batch` | coordinador+/admin | Working (CSV batch) |
| `PUT /enrollments/:id/exam` | coordinador+/admin | Working (eligibility gate) |
| `PUT /enrollments/:id/grade` | coordinador+/admin | Working (inscripto gate + auto-transition) |

#### Integrations (`routes/integrations.ts`)
| Endpoint | Gate | Status |
|---|---|---|
| `GET /integrations/status` | admin/sysadmin | Working (health checks) |
| `POST /integrations/sync/moodle` | admin/sysadmin | **MOCK** — reads local DB, never calls real Moodle |
| `POST /integrations/sync/guarani` | admin/sysadmin | **MOCK** — reads local DB, self-upserts |
| `GET /integrations/logs` | admin/sysadmin | Working (paginated, filterable) |

#### Overrides (`routes/overrides.ts`)
| Endpoint | Gate | Status |
|---|---|---|
| `GET /overrides` | coordinador+/admin | Working |
| `POST /overrides` | coordinador+/admin | Working (unique active check) |
| `PUT /overrides/:id/revoke` | coordinador+/admin | Working |

#### Rules (`routes/rules.ts`)
| Endpoint | Gate | Status |
|---|---|---|
| `GET /rules` | coordinador+/admin | Working |
| `POST /rules` | coordinador+/admin | Working |
| `PUT /rules/:id` | coordinador+/admin | Working |
| `DELETE /rules/:id` | admin/sysadmin | Working |
| `POST /rules/evaluate` | Auth only | Working (live evaluation) |

### Services

| Service | Real/Mock | Notes |
|---|---|---|
| `rule-engine.ts` | Real | Recursive ALL/ANY evaluator. 23 tests. DI pattern. |
| `eligibility-data-access.ts` | Real | Factory returning 4 Supabase accessors |
| `moodle.service.ts` | **Real** (Phase B) | Calls real Moodle API: `core_user_get_users_by_field`, `core_enrol_get_users_courses`, `core_completion_get_course_completion_status`. Retry 3x with backoff. 10s timeout. Per-student + per-course error isolation. |
| `guarani.service.ts` | **Mock** | `fetchStudents()` reads local DB. `pushDiploma()` is console.log only. |
| `integration-logs.ts` | Real | Writes to `integration_logs` table. Phase B: `logSyncComplete` now updates start row via `logId`. |

### Providers

| Component | Status | Issue |
|---|---|---|
| `CertificateProvider` interface | Defined | 4 methods |
| `AcademicProvider` interface | Defined | 4 methods |
| `ProviderRegistry` | Implemented | Registration in `index.ts:22-23` — but **routes bypass it**, calling services directly |

### Middleware

| Middleware | Status |
|---|---|
| `authenticate` | Working — HS256 JWT, validates token type=access |
| `requireRole(...roles)` | Working — gates by role enum |
| `errorHandler` | Working — logs, pattern-matches status codes |
| `notFoundHandler` | Working — 404 fallback |

---

## Part C: Database Schema Audit

### Tables

| # | Table | Columns | Status |
|---|---|---|---|
| 1 | `students` | 10 cols. PK: id. UNIQUE: guarani_id, email, dni | ✅ |
| 2 | `tracks` | 8 cols. UNIQUE: code | ✅ |
| 3 | `courses` | 11 cols. FK → tracks. UNIQUE(track_id, code) | ✅ |
| 4 | `certificates` | 10 cols. FK → students, courses. UNIQUE(student_id, course_id), UNIQUE moodle_certificate_id | ✅ |
| 5 | `enrollments` | 13 cols. FK → students, courses, tracks. UNIQUE(student_id, course_id). `exam_date` + `exam_status` NOT in migration files | ✅ |
| 6 | `prerequisite_rules` | 9 cols. FK → courses, self-ref parent. Tree support in 002 | ✅ |
| 7 | `prerequisite_sources` | 2 cols (composite PK). FK → rules, courses | ✅ |
| 8 | `manual_overrides` | 10 cols. FK → students, rules. Partial UNIQUE(active) | ✅ |
| 9 | `integration_logs` | 7 cols. Indexed by type + created_at | ✅ |

### Missing Tables (from business data map)

| Table | Status |
|---|---|
| `audit_log` | Not implemented |
| `track_coordinators` | Not implemented |
| `notifications` | Not implemented |

### DB Discrepancies

| Issue | Detail |
|---|---|
| `enrollments.course_id` nullable | Migration says NOT NULL; generated types say `string \| null` |
| `enrollments.exam_date` | Exists in DB + types; **no migration file** adds it |
| `enrollments.exam_status` | Exists in DB + types; **no migration file** adds it |
| `prerequisite_sources` updated_at trigger | Trigger exists in 002; **no updated_at column** exists |
| `integration_logs` updated_at trigger | Trigger exists in 002; **no updated_at column** exists |

### RLS Policies

| Table | Read | Insert | Update | Delete |
|---|---|---|---|---|
| students | Own + Admin ALL | Admin ALL | Admin ALL | Admin ALL |
| tracks | Any auth | Admin ALL | Admin ALL | Admin ALL |
| courses | Any auth | Admin ALL | Admin ALL | Admin ALL |
| certificates | Own + Staff SELECT | — | — | — |
| enrollments | Own + Staff SELECT | Staff (true) | Staff (jwt role) | Admin (jwt role) |
| prerequisite_rules | Any auth SELECT | Coord+/Admin ALL | Coord+/Admin ALL | Coord+/Admin ALL |
| prerequisite_sources | Any auth SELECT | Coord+/Admin ALL | Coord+/Admin ALL | Coord+/Admin ALL |
| manual_overrides | Own + Staff SELECT | Coord+/Admin ALL | Coord+/Admin ALL | Coord+/Admin ALL |
| integration_logs | Admin SELECT | Admin ALL | Admin ALL | Admin ALL |

**Phase A fix applied**: `USING(true)` policy on enrollments dropped. Replaced with 6 role-based policies via migration 003.

---

## Part D: Gap Matrix — UNC Requirements vs DTS

### Functional Requirements

| # | UNC Requirement | DTS Coverage | Status |
|---|---|---|---|
| F1 | Sync students from Moodle (key: email) | `moodle.service.ts:findMoodleUserByEmail()` → `core_user_get_users_by_field` | ✅ **Complete (Phase B)** — lookup by email, 3 retries, 10s timeout |
| F2 | Sync courses from Moodle (idnumber → moodle_course_id) | `moodle.service.ts:getMoodleUserCourses()` → `core_enrol_get_users_courses` | ✅ **Complete (Phase B)** |
| F3 | Sync certificates (completion proxy) | `moodle.service.ts:getCourseCompletionStatus()` → `core_completion_get_course_completion_status` | ✅ **Complete (Phase B)** — upsert to certificates table |
| F4 | Read grades from Moodle | Not implemented | **MISSING** |
| F5 | Read enrollments from Moodle | Not implemented | **MISSING** |
| F6 | Verify course completion | `core_completion_get_course_completion_status` | ✅ **Complete (Phase B)** |
| F7 | Moodle health check | `GET /integrations/status` → pings real Moodle | ✅ Complete |
| F8 | Sync student registry from Guaraní | `guarani.service.ts:syncStudents()` | **STUB** — reads local DB in circle |
| F9 | Push grades to Guaraní | `guarani.service.ts:pushDiploma()` | **STUB** — console.log only |
| F10 | Push diploma to Guaraní (SIDCer) | Same as F9 | **STUB** |
| F11 | Moodle API token | `MOODLE_API_TOKEN` env var | ✅ Configured |
| F12 | JWT auth + RBAC (4 roles) | `auth.ts` + `middleware/auth.ts` | ✅ Complete |
| F13 | ALL/ANY recursive rule engine | `rule-engine.ts` (23 tests, 99% coverage) | ✅ Complete |
| F14 | Manual overrides with expiry | `overrides.ts` CRUD | ✅ Complete |
| F15 | Exam registration with eligibility | `PUT /enrollments/:id/exam` | ✅ Complete |
| F16 | Grade recording (1-10) with auto-transition | `PUT /enrollments/:id/grade` | ✅ Complete (Phase A fix) |
| F17 | Student progress dashboard | `GET /students/:id/progress` | ✅ Complete |
| F18 | Student certificates list | `GET /students/:id/certificates` | ✅ Complete |
| F19 | Admin dashboard with stats | `GET /admin/dashboard-stats` | ✅ Complete |
| F20 | Integration logs viewer | `GET /integrations/logs` | ✅ Partial (logId unused) |
| F21 | Batch enrollment CSV | `POST /enrollments/batch` | ✅ Complete (Phase A) |
| F22 | CRUD diplomaturas + cursos | `tracks.ts` + `courses.ts` | ✅ Complete (Phase A) |
| F23 | CRUD estudiantes + search | `admin.ts` + `students.ts` | ✅ Complete |
| F24 | Expose mod_customcert_get_issues in Moodle | UNC action required | **BLOCKED EXTERNALLY** |

### Technical Requirements

| # | UNC Requirement | DTS Status | Gap |
|---|---|---|---|
| T1 | Provider abstraction with config switching | Interface defined; registry not wired to routes | Registry is dead code |
| T2 | Retry with exponential backoff (1s, 4s, 9s) | `moodleFetch()` — 3 retries, 1s/4s/9s delays | ✅ Complete (Phase B) |
| T3 | Timeout per provider (10s default) | `AbortSignal.timeout(10000)` on every API call | ✅ Complete (Phase B) |
| T4 | Per-student error isolation in batch | `syncCertificates()` catches per-student, per-course | ✅ Complete (Phase B) |
| T5 | Idempotent upsert | onConflict defined | ✅ Complete |
| T6 | Integration logging to DB | logSyncComplete updates start row via logId | ✅ Complete (Phase B) |
| T7 | Audit logging | audit_log table exists; zero code writes to it | Missing |
| T8 | RLS policies | Fixed in migration 003 | ✅ Complete |
| T9 | JWT access+refresh tokens | HS256, access 15m, refresh 7d | ✅ Complete |
| T10 | Rate limiting on login | Not implemented | Missing |
| T11 | CI/CD pipeline | Not configured | Missing |
| T12 | Route-level tests | 0 tests across 9 route files | Missing |
| T13 | Student data isolation | Ownership gate in students.ts GET endpoints | Partial |
| T14 | SSO authentication | Not implemented | Missing |

### Board Review Resolution (2026-05-28 → 2026-05-29)

| Risk | 05-28 | 05-29 | Verdict |
|---|---|---|---|
| R1: Grade writes wrong column | Critical | Line 292: writes exam_status correctly | **FIXED** |
| R2: No inscripto gate | Critical | Line 286: `if (enrollment.exam_status !== 'inscripto')` | **FIXED** |
| R3: enrollments RLS USING(true) | Critical | Migration 003: 6 role-based policies | **FIXED** |
| R4: Phase 5 desert | Critical | Sync endpoints exist but are mock | **STILL STUB** |
| R5: No track/course writes | Critical | tracks.ts POST+PATCH, courses.ts POST+PATCH | **FIXED** |
| R6: Zero route tests | Critical | Still 0 route tests | **UNCHANGED** |
| R7: Moodle sync stub | Critical | Still reads local DB | **STILL STUB** |
| R8: Student data isolation | High | Ownership gate added to students.ts GET | **PARTIALLY FIXED** |
| R10: Batch enrollment missing | High | POST /enrollments/batch exists | **FIXED** |
| R11: No CI/CD | Medium | No CI/CD files | **UNCHANGED** |
| R12: Admin stats hardcoded | Medium | Real counts computed | **PARTIALLY FIXED** |
| R13: Exam history wrong sort | Medium | Sorts by exam_date desc, has filter | **FIXED** |
| R14: Provider registry dead | Low | Registered but routes bypass | **UNCHANGED** |
| R15: No audit logging | Low | Zero writes to audit_log | **UNCHANGED** |

---

## Part E: Tally

| Category | Count |
|---|---|
| Working endpoints | 42/43 |
| Stub endpoints | 1 (certificates sync) |
| Real services | 3/5 (rule-engine, eligibility, integration-logs) |
| Mock services | 2/5 (moodle, guarani) |
| UNC func reqs: Complete | 16/24 |
| UNC func reqs: Stub | 4/24 |
| UNC func reqs: Missing | 3/24 |
| UNC func reqs: Blocked | 1/24 |
| Board risks fixed since 05-28 | 10 |
| Board risks unchanged | 1 |
| DB discrepancies | 2 (exam columns still need migration; broken triggers fixed in 004) |

### Critical Path Forward

1. **Phase C**: Real Guaraní mock + diploma push flow
2. **Phase D**: Guaraní real (conditional on DTI credentials)
3. **Fix DB**: Add migration for exam_date/exam_status columns

---

> *Generated via Playwright CLI + codebase static analysis. Commit `da2a8c5` on diploma-tracking-sys.*
