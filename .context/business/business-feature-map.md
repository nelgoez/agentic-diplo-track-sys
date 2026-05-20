# Business Feature Map — Diploma Tracking System (DTS)

> **Document**: System Discovery · Feature Map
> **Project**: Diploma Tracking System — Universidad Nacional de Córdoba
> **Version**: 1.0 · **Status**: Final
> **Language**: English

---

## 1. Feature Catalog by Domain

### 1.1 Certificate Module

| ID | Feature | Priority | Epic | Description |
|----|---------|----------|------|-------------|
| F-CERT-001 | Sync certificates from Moodle | Must Have | E1 | Batch import certificates from Moodle via CertificateProvider. Upsert by (student_id, course_id, provider). |
| F-CERT-002 | View student certificates | Must Have | E1 | List certificates for a student: course name, issue date, provider, status. |
| F-CERT-003 | Re-sync individual certificate | Should Have | E1 | Admin/coordinator triggers re-sync for a specific certificate. |
| F-CERT-004 | Certificate provider abstraction | Must Have | E1 | CertificateProvider interface decouples LMS source from business logic. |

### 1.2 Dashboard Module

| ID | Feature | Priority | Epic | Description |
|----|---------|----------|------|-------------|
| F-DASH-001 | Student progress overview | Must Have | E2 | Bar + module list with per-module status: completed/in_progress/pending. |
| F-DASH-002 | Eligibility check | Must Have | E2 | Real-time evaluation: eligible ❌/✅ with missing modules list. |
| F-DASH-003 | Next steps recommendation | Must Have | E2 | Modules whose prerequisites are satisfied, ordered by recommendation. |
| F-DASH-004 | Coordinator dashboard | Must Have | E6 | Summary cards: total students, eligible/not-eligible, last sync. |
| F-DASH-005 | Admin system dashboard | Must Have | E6 | Metrics: total students, active tracks, certificates synced, eligible vs not. |

### 1.3 Rules Module

| ID | Feature | Priority | Epic | Description |
|----|---------|----------|------|-------------|
| F-RULE-001 | Configure prerequisite rules | Must Have | E3 | CRUD for ALL/ANY/composite rule trees per track. |
| F-RULE-002 | Evaluate eligibility in real-time | Must Have | E3 | Recursive tree evaluation with breakdown per rule. <500ms. |
| F-RULE-003 | Manual rule override | Should Have | E3 | Coordinator exception with reason + optional expiry. |
| F-RULE-004 | View rule tree | Must Have | E3 | Display hierarchical rule structure for a track. |

### 1.4 Enrollment Module

| ID | Feature | Priority | Epic | Description |
|----|---------|----------|------|-------------|
| F-ENRL-001 | Enroll student to diploma | Must Have | E7 | Link existing student to a track. Unique (student_id, track_id). |
| F-ENRL-002 | Batch enrollment from CSV | Should Have | E7 | Upload CSV with emails; create new students + enroll them. |
| F-ENRL-003 | Enroll to exam | Must Have | E4 | Set exam_status=inscripto + exam_date. Re-evaluates eligibility. |
| F-ENRL-004 | Record exam grade | Must Have | E4 | Set grade (1-10), auto-set aprobado/desaprobado. |
| F-ENRL-005 | View exam history | Should Have | E4 | Student sees all exam attempts with dates, grades, results. |

### 1.5 Integration Module

| ID | Feature | Priority | Epic | Description |
|----|---------|----------|------|-------------|
| F-INT-001 | Moodle connection config | Must Have | E5 | Configure URL + token, test connection, store encrypted. |
| F-INT-002 | Batch certificate sync | Must Have | E5 | Trigger Moodle sync for all active students. Batches of 50. |
| F-INT-003 | Integration status monitoring | Must Have | E5 | Health check + last sync info per provider. |
| F-INT-004 | Resilient adapter (retry, backoff) | Must Have | E5 | 3 retries with exponential backoff. Per-student isolation. |
| F-INT-005 | Guaraní student sync | Should Have | E8 | Import student registry from Guaraní. |
| F-INT-006 | Academic provider abstraction | Should Have | E8 | AcademicProvider interface for student registry sources. |
| F-INT-007 | Integration logs viewer | Must Have | E5 | Paginated, filterable log of all sync operations. |

### 1.6 Admin Module

| ID | Feature | Priority | Epic | Description |
|----|---------|----------|------|-------------|
| F-ADMIN-001 | Student management | Must Have | E6 | List, search, view profiles with certificates, enrollments, overrides. |
| F-ADMIN-002 | System dashboard stats | Must Have | E6 | Aggregate metrics: student counts, certificate counts, eligibility. |
| F-ADMIN-003 | Track/diploma configuration | Should Have | E6 | Create tracks with courses + prerequisite rules. |
| F-ADMIN-004 | User & role management | Must Have | E6 | CRUD users; assign roles (estudiante, coordinador, admin, sysadmin). |
| F-ADMIN-005 | Coordinator-track assignment | Must Have | E6 | Link coordinators to tracks they manage. |

### 1.7 Auth Module

| ID | Feature | Priority | Epic | Description |
|----|---------|----------|------|-------------|
| F-AUTH-001 | JWT login (email + password) | Must Have | E9 | Access token (15min) + refresh token (7d) via Supabase Auth. |
| F-AUTH-002 | Logout (token revocation) | Must Have | E9 | Revoke refresh token on logout. |
| F-AUTH-003 | Get current user profile | Must Have | E9 | Return user details + roles + associated tracks. |
| F-AUTH-004 | RBAC middleware | Must Have | E9 | Role-based access control per endpoint. |
| F-AUTH-005 | Rate limiting on login | Must Have | E9 | 5 attempts/email per 15min. Block after 10 failures. |

### 1.8 Notifications Module (Future / Should Have)

| ID | Feature | Priority | Epic | Description |
|----|---------|----------|------|-------------|
| F-NOTIF-001 | Eligibility change notification | Should Have | E9 | In-app (future: email) when student becomes eligible. |
| F-NOTIF-002 | New certificate notification | Could Have | E9 | Notify student when new certificate is synced. |

---

## 2. CRUD Matrix

### Legend
- **C** = Create | **R** = Read | **U** = Update | **D** = Delete | **B** = Batch operation | **E** = Evaluate/Execute
- Cell shows role(s) allowed: **(A)**dmin, **(C)**oordinador, **(S)**tudent (self-only), **(X)** = sysadmin only

| Entity \ Operations | List | Get | Create | Update | Delete | Batch | Special |
|---------------------|------|-----|--------|--------|--------|-------|---------|
| **students** | A/C | A/C/S | A | A | A | A | Search: A/C |
| **tracks** | A/C/S | A/C/S | A | A | A | — | — |
| **courses** | A/C/S | A/C/S | A | A | A | — | — |
| **certificates** | A/C/S | A/C/S | — | — | — | A (sync) | Re-sync: A/C |
| **enrollments** | A/C | A/C/S | C | A/C | A | C (CSV) | Grade: C |
| **prerequisite_rules** | A/C | A/C | C | C | A | — | Evaluate: A/C/S |
| **prerequisite_sources** | A/C | — | A/C | A/C | A/C | — | — |
| **manual_overrides** | A/C | A/C/S | C | — | C (revoke) | — | — |
| **integration_logs** | A | A | — | — | — | — | — |
| **audit_log** | A/X | A/X | — | — | — | — | — |
| **users** | A | A | A | A | A | — | — |
| **track_coordinators** | A | A | A | A | A | — | — |

### Notes on CRUD rules:

- **Students read own data**: RLS filters `student_id = auth.uid()` for certificate, enrollment, and override reads.
- **Coordinators scoped**: Coordinators only see students enrolled in tracks they manage (via `track_coordinators`).
- **Create enrollment**: Coordinators create, admins create. Students cannot self-enroll (MVP rule).
- **Override create/revoke**: Coordinators for their track, admins for any track.
- **Grade recording**: Only coordinators (for their track exams) and admins.
- **Rule deletion**: Admin only (coordinator can create/update but not delete — safety).
- **Integration actions**: Admin/sysadmin only (coordinator can view status but not trigger syncs).

---

## 3. Endpoint-to-Feature Mapping

| HTTP Method | Path (under /api/v1) | Feature ID(s) | Domain | Auth Required | Min Role |
|-------------|---------------------|---------------|--------|---------------|----------|
| GET | /health | (infrastructure) | Health | No | — |
| POST | /auth/login | F-AUTH-001 | Auth | No | — |
| POST | /auth/refresh | F-AUTH-001 | Auth | No | — |
| POST | /auth/logout | F-AUTH-002 | Auth | Yes | any |
| GET | /auth/me | F-AUTH-003 | Auth | Yes | any |
| GET | /students | F-ADMIN-001 | Students | Yes | coordinador |
| GET | /students/:id | F-ADMIN-001 | Students | Yes | coordinador |
| GET | /students/:id/progress | F-DASH-001, F-DASH-002 | Students | Yes | any (self) |
| GET | /students/:id/certificates | F-CERT-002 | Students | Yes | any (self) |
| GET | /courses | F-ADMIN-003 | Courses | Yes | any |
| GET | /courses/:id | F-ADMIN-003 | Courses | Yes | any |
| GET | /courses/:id/prerequisites | F-RULE-004 | Courses | Yes | any |
| GET | /certificates | F-CERT-002 | Certificates | Yes | any |
| GET | /certificates/:id | F-CERT-002 | Certificates | Yes | any |
| POST | /certificates/sync | F-INT-002 | Certificates | Yes | admin |
| POST | /certificates/:id/resync | F-CERT-003 | Certificates | Yes | admin |
| GET | /enrollments | F-ENRL-001 | Enrollments | Yes | any |
| POST | /enrollments | F-ENRL-001, F-ENRL-003 | Enrollments | Yes | coordinador |
| POST | /enrollments/batch | F-ENRL-002 | Enrollments | Yes | coordinador |
| GET | /enrollments/eligibility/:studentId | F-DASH-002, F-RULE-002 | Enrollments | Yes | any (self) |
| PUT | /enrollments/:id/grade | F-ENRL-004 | Enrollments | Yes | coordinador |
| GET | /rules | F-RULE-001, F-RULE-004 | Rules | Yes | coordinador |
| POST | /rules | F-RULE-001 | Rules | Yes | coordinador |
| PUT | /rules/:id | F-RULE-001 | Rules | Yes | coordinador |
| DELETE | /rules/:id | F-RULE-001 | Rules | Yes | admin |
| POST | /rules/evaluate | F-RULE-002 | Rules | Yes | any |
| GET | /overrides | F-RULE-003 | Overrides | Yes | coordinador |
| POST | /overrides | F-RULE-003 | Overrides | Yes | coordinador |
| DELETE | /overrides/:id | F-RULE-003 | Overrides | Yes | coordinador |
| GET | /integrations/status | F-INT-003, F-INT-005 | Integrations | Yes | admin |
| POST | /integrations/sync/moodle | F-INT-002 | Integrations | Yes | admin |
| POST | /integrations/sync/guarani | F-INT-005 | Integrations | Yes | admin |
| GET | /integrations/logs | F-INT-006 | Integrations | Yes | admin |
| GET | /tracks | F-ADMIN-003 | Tracks | Yes | any |
| POST | /tracks | F-ADMIN-003 | Tracks | Yes | admin |
| GET | /tracks/:id | F-ADMIN-003 | Tracks | Yes | any |
| PUT | /tracks/:id | F-ADMIN-003 | Tracks | Yes | admin |
| GET | /admin/dashboard-stats | F-DASH-005, F-ADMIN-002 | Admin | Yes | admin |
| GET | /admin/students | F-ADMIN-001 | Admin | Yes | admin |
| GET | /admin/courses | F-ADMIN-003 | Admin | Yes | admin |
| GET | /admin/tracks | F-ADMIN-003 | Admin | Yes | admin |
| POST | /admin/users | F-ADMIN-004 | Admin | Yes | admin |

### Endpoint count by domain:

| Domain | Endpoints | Notes |
|--------|-----------|-------|
| Health | 1 | Public |
| Auth | 4 | Login, refresh, logout, me |
| Students | 4 | List, get, progress, certificates |
| Courses | 3 | List, get, prerequisites |
| Certificates | 4 | List, get, sync, resync |
| Enrollments | 5 | List, create, batch, eligibility, grade |
| Rules | 5 | List, create, update, delete, evaluate |
| Overrides | 3 | List, create, revoke |
| Integrations | 4 | Status, sync moodle, sync guarani, logs |
| Tracks | 4 | List, create, get, update |
| Admin | 5 | Stats, students, courses, tracks, users |
| **Total** | **42** | |

---

## 4. UI Component Inventory

### 4.1 Page Inventory

| Page | Route | Roles | Key Features |
|------|-------|-------|-------------|
| **Login** | /login | All | Email + password form, SSO button (future) |
| **Student Dashboard** | /dashboard | estudiante | Progress bar, eligibility status, next steps, module list, certificates |
| **Coordinator Dashboard** | /coordinador | coordinador | Track summary cards, student list with filters, sync status |
| **Track Detail** | /coordinador/tracks/:id | coordinador | Student table, rule config, exam management |
| **Student Profile** | /coordinador/students/:id | coordinador | Certificates, eligibility breakdown, override form, exam history |
| **Admin Dashboard** | /admin | admin, sysadmin | System metrics, integration status, recent errors |
| **Admin Students** | /admin/students | admin, sysadmin | Searchable student list, profiles |
| **Admin Tracks** | /admin/tracks | admin, sysadmin | Track CRUD, course management |
| **Admin Integrations** | /admin/integrations | admin, sysadmin | Provider config, sync triggers, logs viewer |
| **Admin Users** | /admin/users | admin, sysadmin | User CRUD, role assignment, coordinator-track linking |
| **Student Certificates** | /mis-certificados | estudiante | Certificate table with status |
| **Student Exams** | /mis-examenes | estudiante | Exam history table |
| **Not Found** | /* | All | 404 page |

### 4.2 Shared UI Components

| Component | Domain | Description |
|-----------|--------|-------------|
| `ProgressBar` | Dashboard | Visual progress indicator (X of Y modules) |
| `ModuleStatusBadge` | Dashboard | Color-coded badge: completed/green, in_progress/yellow, pending/gray, error/red |
| `EligibilityCard` | Dashboard | Green checkmark or red X with missing modules list |
| `NextStepsList` | Dashboard | Ordered list of recommended modules |
| `CertificateTable` | Certificates | Table with course name, date, provider, status, actions |
| `StudentTable` | Admin/Coordinator | Paginated, searchable, filterable student list |
| `RuleTreeViewer` | Rules | Hierarchical tree display of ALL/ANY rules |
| `RuleTreeEditor` | Rules | Interactive tree builder (add/remove ALL/ANY nodes) |
| `OverrideForm` | Overrides | Modal form: rule selector, reason textarea, expiry date picker |
| `IntegrationCard` | Integrations | Status indicator + last sync info per provider |
| `SyncProgressIndicator` | Integrations | Real-time progress bar for batch sync operations |
| `GradeInput` | Exams | Numeric input (1-10) with validation |
| `UserRoleSelector` | Admin | Dropdown for role assignment |
| `SearchInput` | Shared | Debounced search with clear button |
| `Pagination` | Shared | Page controls with total count |
| `ToastNotification` | Shared | Success/error/info toast messages |
| `ConfirmDialog` | Shared | Destructive action confirmation modal |
| `AuditLogTable` | Admin | Timestamped action log with user and details |

### 4.3 Layout Components

| Component | Description |
|-----------|-------------|
| `AppShell` | Main layout: sidebar + header + content area |
| `Sidebar` | Navigation menu (role-aware: shows different items) |
| `Header` | User info, language selector, logout button |
| `RoleAwareNav` | Menu items filtered by user role |

---

## 5. Third-Party Integration Points

| System | Integration Type | Interface | Auth | Data |
|--------|-----------------|-----------|------|------|
| **Moodle LMS** | REST API (Web Services) | `CertificateProvider` | Token | Certificates by student email |
| **Guaraní SIU** | REST API | `AcademicProvider` | Token | Student registry (name, email, DNI, legajo) |
| **Supabase Auth** | SDK + REST | (direct) | JWT | User authentication, session management |
| **Supabase DB** | SDK (PostgreSQL) | (direct) | Service role + RLS | All persistent data |
| **Resend / SMTP** | REST API | `NotificationProvider` (future) | API Key | Email notifications |
| **jose** (JWT lib) | Library | (direct) | — | JWT sign/verify |
| **Zod** | Library | (direct) | — | Schema validation |
| **TanStack Query** | Library | (direct) | — | Server state caching on frontend |
| **MUI** | Library | (direct) | — | UI components, theming, i18n |
| **react-i18next** | Library | (direct) | — | Internationalization |

---

## 6. Feature Flags / Gating Logic

Current MVP has no formal feature-flag system. Gating is implicit:

| Gate | Mechanism | What It Controls |
|------|-----------|-----------------|
| **Role-based UI visibility** | Frontend: role check on route + sidebar items | Coordinators see coordinator-only pages; students see student pages |
| **Middleware `requireRole()`** | Backend: Hono middleware per endpoint | API access by role (e.g., student cannot POST /overrides) |
| **RLS policies** | Database: Supabase RLS | Row-level access (student sees own certificates only) |
| **Placeholder stubs** | Backend: TODO comments + mock implementations | Moodle sync, Guaraní sync, rule engine evaluation |
| **Inactive/active flags** | DB columns: `is_active` on tracks, courses, students | Soft-disable entities without deleting |
| **Status-based gating** | DB columns: `status` on enrollments, certificates, rules | State-based transitions (e.g., only "inscripto" can receive a grade) |

### Future feature flags (post-MVP):

| Flag | Type | Purpose |
|------|------|---------|
| `self_enrollment` | boolean | Allow students to self-enroll in tracks |
| `digital_diploma` | boolean | Enable automated PDF diploma generation |
| `public_verification` | boolean | Enable public diploma verification portal |
| `canvas_integration` | boolean | Activate Canvas provider connector |
| `email_notifications` | boolean | Enable email delivery alongside in-app notifications |

---

> *Generated as part of DTS Discovery Maps. Refresh when features, endpoints, or UI pages are added/modified.*
