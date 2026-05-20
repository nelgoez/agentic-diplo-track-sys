# Business Data Map — Diploma Tracking System (DTS)

> **Document**: System Discovery · Business Data Map
> **Project**: Diploma Tracking System — Universidad Nacional de Córdoba
> **Version**: 1.0 · **Status**: Final
> **Language**: English

---

## 1. Entity-Relationship Map

### 1.1 Entity Diagram

```
┌──────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│     USERS        │       │      STUDENTS        │       │       TRACKS         │
│──────────────────│       │──────────────────────│       │──────────────────────│
│ PK id (UUID)     │       │ PK id (UUID)         │       │ PK id (UUID)         │
│ email (UNIQUE)   │       │ email (UNIQUE)       │       │ name                 │
│ password_hash    │       │ first_name           │       │ code (UNIQUE)        │
│ role (enum)      │       │ last_name            │       │ description          │
│ first_name       │       │ document_number      │       │ organization_id      │
│ last_name        │       │ student_id (legajo)  │       │ status               │
│ is_active        │       │ is_active            │       │ credits_required     │
│ created_at       │       │ created_at           │       │ created_at           │
│ updated_at       │       │ updated_at           │       │ updated_at           │
└────────┬─────────┘       └──────────┬───────────┘       └──────────┬───────────┘
         │                            │                             │
         │ 1:1 (auth)                │ 1:N                        │ 1:N
         ▼                            ▼                             ▼
┌──────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│                  │       │     ENROLLMENTS      │       │       COURSES        │
│                  │       │──────────────────────│       │──────────────────────│
│                  │       │ PK id (UUID)         │       │ PK id (UUID)         │
│                  │       │ FK student_id         │       │ FK track_id          │
│                  │       │ FK track_id          │       │ name                 │
│                  │       │ FK course_id         │       │ code                 │
│                  │       │ status               │       │ moodle_course_id     │
│                  │       │ enrolled_at          │       │ credits              │
│                  │       │ exam_status          │       │ order_index          │
│                  │       │ exam_date            │       │ is_integrator_exam   │
│                  │       │ exam_grade           │       │ is_active            │
│                  │       │ graded_at            │       │ created_at           │
│                  │       │ graded_by            │       │ updated_at           │
│                  │       └──────────┬───────────┘       └──────────┬───────────┘
│                  │                  │                             │
│                  │                  │ 1:N                        │ 1:N
│                  │                  ▼                             ▼
│                  │       ┌──────────────────────┐       ┌──────────────────────┐
│                  │       │     CERTIFICATES     │       │   PREREQUISITE_RULES │
│                  │       │──────────────────────│       │──────────────────────│
│                  │       │ PK id (UUID)         │       │ PK id (UUID)         │
│                  │       │ FK student_id        │◄──────│ FK target_course_id  │
│                  │       │ FK course_id         │       │ FK parent_rule_id    │
│                  │       │ provider             │       │   (self-ref)         │
│                  │       │ external_id          │       │ type (ALL/ANY)       │
│                  │       │ issued_at            │       │ order_index          │
│                  │       │ synced_at            │       │ is_active            │
│                  │       │ status               │       │ created_by           │
│                  │       │ error_message        │       │ created_at           │
│                  │       │ metadata (JSONB)     │       │ updated_at           │
│                  │       └──────────────────────┘       └──────────┬───────────┘
│                  │                                                 │
│                  │                                                 │ 1:N
│                  │                                                 ▼
│                  │       ┌──────────────────────┐       ┌──────────────────────┐
│                  │       │  MANUAL_OVERRIDES    │       │PREREQUISITE_SOURCES  │
│                  │       │──────────────────────│       │──────────────────────│
│                  │       │ PK id (UUID)         │       │ PK FK rule_id        │
│                  │       │ FK student_id        │       │ PK FK source_course_id│
│                  │       │ FK rule_id           │       └──────────────────────┘
│                  │       │ FK created_by        │
│                  │       │ reason               │
│                  │       │ expires_at           │
│                  │       │ status               │
│                  │       │ created_at           │
│                  │       │ revoked_at           │
│                  │       └──────────────────────┘
│                  │
│                  │       ┌──────────────────────┐       ┌──────────────────────┐
│                  │       │  INTEGRATION_LOGS    │       │   TRACK_COORDINATORS │
│                  │       │──────────────────────│       │──────────────────────│
│                  │       │ PK id (UUID)         │       │ PK id (UUID)         │
│                  │       │ provider             │       │ FK user_id           │
│                  │       │ action               │       │ FK track_id          │
│                  │       │ status               │       │ created_at           │
│                  │       │ started_at           │       └──────────────────────┘
│                  │       │ completed_at         │
│                  │       │ duration_ms          │       ┌──────────────────────┐
│                  │       │ students_processed   │       │     AUDIT_LOG        │
│                  │       │ students_new         │       │──────────────────────│
│                  │       │ students_updated     │       │ PK id (UUID)         │
│                  │       │ errors_count         │       │ FK user_id           │
│                  │       │ error_details (JSONB)│       │ action               │
│                  │       │ triggered_by         │       │ entity_type          │
│                  │       └──────────────────────┘       │ entity_id            │
│                                                         │ before (JSONB)       │
│                                                         │ after (JSONB)        │
│                                                         │ ip_address           │
│                                                         │ created_at           │
│                                                         └──────────────────────┘
```

### 1.2 Entity Business Roles

| Entity | Business Role | Key Constraints | Lifespan |
|--------|--------------|-----------------|----------|
| **users** | System identity; login credentials + role assignment. Maps to Supabase Auth. | Email unique. Role enum: estudiante, coordinador, admin, sysadmin. | Indefinite (soft-delete via is_active) |
| **students** | Academic profile: name, DNI, legajo. Richer than users table. Separate because one auth user may map to zero-or-one student profile (non-student roles exist). | Email unique. DNI unique. | Indefinite |
| **tracks** | A diploma program (e.g. "Diplomatura en Ciencia de Datos"). Top-level organizational unit. | Code unique. Organization_id enables multi-faculty isolation. | Active/inactive lifecycle |
| **courses** | Individual modules within a track. Each maps to a Moodle course via moodle_course_id. | Unique within track (track_id, code). Order_index defines sequence. | Active/inactive |
| **certificates** | Proof of course completion. Synced from LMS. Central to all evaluation logic. | Unique (student_id, course_id, provider). Idempotent upsert key. | Active/error/pending status. Never hard-deleted. |
| **enrollments** | Links a student to a track for the full diploma. Also carries exam lifecycle (exam_status, exam_grade). | Unique (student_id, track_id). Dual purpose: enrollment + exam record. | Active → inactive/archived. Exam sub-states: null → inscripto → aprobado/desaprobado. |
| **prerequisite_rules** | Configurable ALL/ANY rule tree. Defines exam eligibility conditions per track. | Self-referencing (parent_rule_id) for nested rules. Recursive tree structure. | Active/inactive. Versioned in audit_log on change. |
| **prerequisite_sources** | Many-to-many link between a rule node and its constituent courses (or sub-rules). | Composite PK (rule_id, source_course_id). | Deleted+recreated when rule changes. |
| **manual_overrides** | Coordinator-granted exceptions to rule compliance. Includes optional expiry. | Unique (student_id, rule_id) for active overrides. Reason min 10 chars. | Active → expired (auto when expires_at passes) or revoked. |
| **integration_logs** | Audit trail for all external sync operations. | Indexed by provider + created_at. 90-day retention. | Append-only. |
| **audit_log** | Generic admin action trail. Captures before/after snapshots. | Indexed by entity_type + entity_id. | Append-only. 1-year retention. |
| **track_coordinators** | Many-to-many link: which coordinators manage which tracks. | Unique (user_id, track_id). | Indefinite. |

---

## 2. Business Flows

### Flow 1: Certificate Sync Lifecycle (Moodle → DTS)

```
[Admin/Coordinator]          [DTS API]                    [CertificateProvider]          [Moodle LMS]
       │                        │                               │                           │
       │ POST /integrations/    │                               │                           │
       │ sync/moodle           │                               │                           │
       │──────────────────────▶│                               │                           │
       │                        │                               │                           │
       │                        │ Log sync_start in            │                           │
       │                        │ integration_logs             │                           │
       │                        │                               │                           │
       │                        │ For each active student      │                           │
       │                        │ (batches of 50):             │                           │
       │                        │                               │                           │
       │                        │──── fetchCertificates(id) ──▶│──── GET /webservice/ ───▶│
       │                        │                               │    rest/server.php       │
       │                        │                               │                           │
       │                        │                               │◀─── Certificate[] ──────│
       │                        │◀─── Certificate[] ───────────│                           │
       │                        │                               │                           │
       │                        │ For each certificate:        │                           │
       │                        │   - Lookup student by email  │                           │
       │                        │   - Lookup course by         │                           │
       │                        │     moodle_course_id         │                           │
       │                        │   - UPSERT certificates      │                           │
       │                        │     (student_id, course_id,  │                           │
       │                        │      provider)               │                           │
       │                        │                               │                           │
       │                        │ On error per student:        │                           │
       │                        │   - Log error, continue      │                           │
       │                        │   - Don't abort batch        │                           │
       │                        │                               │                           │
       │                        │ Re-evaluate eligibility      │                           │
       │                        │ for affected students        │                           │
       │                        │ (trigger notifications if    │                           │
       │                        │  newly eligible)             │                           │
       │                        │                               │                           │
       │                        │ Log sync_complete in         │                           │
       │                        │ integration_logs             │                           │
       │                        │                               │                           │
       │◀── SyncResponse ──────│                               │                           │
       │ (syncId, status,      │                               │                           │
       │  summary)             │                               │                           │
```

**Code paths**:
- Route: `integrations.ts:43` → POST /integrations/sync/moodle
- Service: `moodle.service.ts:28` → syncCertificates()
- DB: Supabase client on `certificates` table (upsert by student_id + course_id + provider)
- Logging: `integration_logs` insert (start + complete entries)

### Flow 2: Student Eligibility Check (Real-time)

```
[Student/Coordinator]         [DTS API]                    [Rule Engine]                [Database]
       │                        │                               │                           │
       │ GET /enrollments/      │                               │                           │
       │ eligibility/:studentId │                               │                           │
       │──────────────────────▶│                               │                           │
       │                        │                               │                           │
       │                        │ Load student                 │                           │
       │                        │───────────────────────────────────────────────────────▶│
       │                        │◀───────────────────────────────────────────────────────│
       │                        │                               │                           │
       │                        │ Load certificates for         │                           │
       │                        │ student (cache for            │                           │
       │                        │ duration of evaluation)       │                           │
       │                        │───────────────────────────────────────────────────────▶│
       │                        │◀───────────────────────────────────────────────────────│
       │                        │                               │                           │
       │                        │── evaluate(student, track) ──▶│                           │
       │                        │                               │                           │
       │                        │                               │ Load rule tree for track  │
       │                        │                               │──────────────────────────▶│
       │                        │                               │◀──────────────────────────│
       │                        │                               │                           │
       │                        │                               │ Load active overrides     │
       │                        │                               │ for student              │
       │                        │                               │──────────────────────────▶│
       │                        │                               │◀──────────────────────────│
       │                        │                               │                           │
       │                        │                               │ Recursive tree eval:     │
       │                        │                               │  - ALL: all children ok  │
       │                        │                               │  - ANY: ≥1 child ok     │
       │                        │                               │  - Override → skip rule │
       │                        │                               │                           │
       │                        │◀── EligibilityResult ────────│                           │
       │                        │ (eligible, rule_breakdown)   │                           │
       │                        │                               │                           │
       │◀── JSON response ─────│                               │                           │
```

**Code paths**:
- Route: `enrollments.ts:41` → GET /enrollments/eligibility/:studentId
- Route: `rules.ts:124` → POST /rules/evaluate (direct rule evaluation)
- DB: `certificates` (student's approved certs), `prerequisite_rules` + `prerequisite_sources` (tree), `manual_overrides` (active overrides)
- Rule engine: In-memory recursive tree walker (rules.ts:156-174)

### Flow 3: Exam Registration + Grading

```
[Coordinator]                 [DTS API]                    [Rule Engine]                [Database]
       │                        │                               │                           │
       │ 1. Check eligibility   │                               │                           │
       │──────────────────────▶│── evaluate(rule tree) ────────▶│                           │
       │◀── eligible: true ────│◀── result ────────────────────│                           │
       │                        │                               │                           │
       │ 2. POST /enrollments/  │                               │                           │
       │    (student_id, track, │                               │                           │
       │     course_id,         │                               │                           │
       │     exam_date)         │                               │                           │
       │──────────────────────▶│                               │                           │
       │                        │ Re-evaluate eligibility       │                           │
       │                        │ (must still pass)            │                           │
       │                        │                               │                           │
       │                        │ UPSERT enrollment:            │                           │
       │                        │   exam_status=inscripto      │                           │
       │                        │   exam_date=selected_date    │                           │
       │                        │───────────────────────────────────────────────────────▶│
       │◀── 201 Created ───────│                               │                           │
       │                        │                               │                           │
       │ 3. PUT /enrollments/   │                               │                           │
       │    :id/grade           │                               │                           │
       │    (grade: 7)          │                               │                           │
       │──────────────────────▶│                               │                           │
       │                        │ Validate grade 1-10          │                           │
       │                        │                               │                           │
       │                        │ Update enrollment:            │                           │
       │                        │   exam_grade=7               │                           │
       │                        │   graded_at=now              │                           │
       │                        │   exam_status=               │                           │
       │                        │     grade>=4 ? "aprobado"    │                           │
       │                        │               : "desaprobado"│                           │
       │                        │───────────────────────────────────────────────────────▶│
       │                        │                               │                           │
       │                        │ If aprobado:                  │                           │
       │                        │   auto-generate diploma       │                           │
       │                        │   (post-MVP: PDF generation)  │                           │
       │                        │   student→diploma_pendiente   │                           │
       │                        │                               │                           │
       │◀── 200 OK ────────────│                               │                           │
```

### Flow 4: Coordinator Override Application

```
[Coordinator]                 [DTS API]                    [Override Checker]           [Database]
       │                        │                               │                           │
       │ POST /overrides        │                               │                           │
       │ (studentId, ruleId,    │                               │                           │
       │  reason, expiresAt?)   │                               │                           │
       │──────────────────────▶│                               │                           │
       │                        │ Validate:                    │                           │
       │                        │  - Rule exists for track     │                           │
       │                        │    coordinator manages        │                           │
       │                        │  - Student enrolled in track │                           │
       │                        │  - No active override for    │                           │
       │                        │    this (student, rule)      │                           │
       │                        │  - Reason ≥ 10 chars         │                           │
       │                        │                               │                           │
       │                        │ Insert manual_overrides      │                           │
       │                        │ (status=active)              │                           │
       │                        │───────────────────────────────────────────────────────▶│
       │                        │                               │                           │
       │                        │ Re-evaluate eligibility      │                           │
       │                        │ for student                  │                           │
       │                        │                               │                           │
       │                        │ Generate notification        │                           │
       │                        │ if newly eligible            │                           │
       │                        │                               │                           │
       │                        │ Log audit trail              │                           │
       │                        │ (audit_log entry)            │                           │
       │                        │                               │                           │
       │◀── 201 Created ───────│                               │                           │
       │ (with updated         │                               │                           │
       │  eligibility)         │                               │                           │
```

---

## 3. State Machines

### 3.1 Certificate Lifecycle

```
                    ┌──────────────┐
                    │   PENDING    │
                    │ (initial)    │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │ sync ok    │ sync fail  │ sync retry
              ▼            ▼            │
        ┌──────────┐ ┌──────────┐      │
        │  ACTIVE  │ │  ERROR   │──────┘
        │ (valid)  │ │          │
        └────┬─────┘ └──────────┘
             │
             │ (admin resync)
             │
             ▼
        ┌──────────┐
        │  ACTIVE  │
        │ (updated)│
        └──────────┘

Transitions:
  PENDING  ──sync ok──▶  ACTIVE
  PENDING  ──sync fail─▶ ERROR
  ERROR    ──resync───▶  ACTIVE (if new sync ok)
  ERROR    ──resync───▶  ERROR (if still fails)
  ACTIVE   ──resync───▶  ACTIVE (refresh date)
```

### 3.2 Enrollment (Track) State Machine

```
                    ┌──────────────┐
                    │   ACTIVE     │
                    │ (enrolled)   │
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                │ (admin archives)    │ (coordinator deactivates)
                ▼                     ▼
          ┌──────────┐         ┌──────────┐
          │ ARCHIVED │         │ INACTIVE │
          └──────────┘         └──────────┘

Exam sub-state (on the enrollment record):
  null ──enroll_to_exam──▶ inscripto ──grade_recorded──▶ aprobado (grade>=4)
                                                   └──▶ desaprobado (grade<4)
  desaprobado ──re_enroll──▶ inscripto
  aprobado ──admin_issue_diploma──▶ diploma_pendiente (future: emitted)
```

### 3.3 Manual Override Lifecycle

```
                    ┌──────────────┐
                    │    ACTIVE    │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              │ (expiry    │ (coord.    │ (time passes,
              │  date hit) │  revokes)  │  expires_at reached)
              ▼            ▼            │
        ┌──────────┐ ┌──────────┐      │
        │ EXPIRED  │ │ REVOKED  │◀─────┘
        └──────────┘ └──────────┘

  (Expired/Revoked are terminal. New override = new record.)
```

### 3.4 Integration Sync Lifecycle

```
  ┌─────────────────────────────────────────────────┐
  │               SYNC SESSION                      │
  │                                                  │
  │  INITIATED ──▶ PROCESSING ──▶ COMPLETED (total) │
  │       │                      or                  │
  │       └──▶ PARTIAL (some errors)                 │
  │       └──▶ FAILED (all errors)                   │
  │                                                  │
  │  Per-student sub-operations:                     │
  │    FETCH_OK    ──▶ UPSERT ──▶ LOG_SUCCESS        │
  │    FETCH_ERROR ──▶ LOG_ERROR (continue next)     │
  │    TIMEOUT     ──▶ RETRY (max 3, exponential)    │
  │                    └──▶ LOG_ERROR if all fail    │
  └─────────────────────────────────────────────────┘
```

---

## 4. Automatic Processes

| Process | Trigger | Behavior | Code Location |
|---------|---------|----------|---------------|
| **`updated_at` auto-update** | BEFORE UPDATE on any table | Sets `updated_at = NOW()` | `001_initial_schema.sql:210-240` (DB trigger via `update_updated_at()`) |
| **Override expiry** | Scheduled cron (daily) | SELECT overrides WHERE expires_at < NOW() AND status=active → SET status=expired → re-evaluate affected students | Future: cron worker or pg_cron |
| **Re-evaluation after certificate sync** | Post-sync hook | For each student with new/updated certificates, run rule engine → if newly eligible, generate notification | `rules.ts:124` / future service layer |
| **Notification generation** | Event-driven (cert sync, override change) | If eligibility changes disallowed→allowed, create notification record + optionally send email | Future: event bus or post-sync hook |
| **Integration health check cache** | Every 5 min (or on-demand) | Probe each configured provider → cache status for `GET /integrations/status` | Future: scheduled job |
| **Integration log cleanup** | Daily cron | DELETE FROM integration_logs WHERE created_at < NOW() - INTERVAL '90 days' | Future: cron job |
| **Dashboard stats cache** | On read (optional: periodic refresh) | Aggregate counts for admin dashboard (total_students, certificates_issued, etc.) | `admin.ts:10` (real-time, no cache yet) |

---

## 5. External Integrations

### 5.1 Moodle LMS (Certificate Source)

| Property | Value |
|----------|-------|
| **Integration Type** | REST API (Web Services) |
| **Provider Interface** | `CertificateProvider` |
| **Auth Method** | Token-based (web service token) |
| **Key Endpoints** | `core_completion_get_activities_completion_status`, `core_course_get_courses_by_field`, custom web services for certificate data |
| **Data Direction** | Import only (one-way: Moodle → DTS) |
| **Mapping Key** | Email (student email in Moodle = student email in DTS) |
| **Sync Granularity** | Per-student (individual), Batch (all active students) |
| **Resilience** | 3 retries with exponential backoff (1s, 4s, 9s). Per-student isolation. |
| **Current Status** | Placeholder (moodle.service.ts:28) — `syncCertificates()` returns empty array |

### 5.2 Guaraní SIU (Student Registry)

| Property | Value |
|----------|-------|
| **Integration Type** | REST API (SIU Web Services) |
| **Provider Interface** | `AcademicProvider` |
| **Auth Method** | Token-based (API credential) |
| **Key Operations** | Import student registry (name, email, DNI, legajo), push diploma status |
| **Data Direction** | Bidirectional: Import padrón → DTS; (future) Push diploma → Guaraní |
| **Mapping Key** | DNI + Email |
| **Resilience** | 3 retries with exponential backoff. Same pattern as Moodle. |
| **Current Status** | Placeholder (guarani.service.ts:27) — `syncStudents()` returns empty array |

### 5.3 Email / Notification Service (Future)

| Property | Value |
|----------|-------|
| **Type** | SMTP or transactional email API (e.g. Resend) |
| **Events** | New eligibility, new certificate, override applied, override expired |
| **Destination** | Student institutional email |
| **Current Status** | Not implemented (MVP: in-app notifications only) |

---

## 6. Provider Abstraction Layer Design

### 6.1 Interface Contracts

```typescript
// server/src/providers/certificate.provider.ts (planned)
interface CertificateProvider {
  /** Fetch all certificates for a student from the external LMS */
  fetchCertificates(studentId: string): Promise<Certificate[]>;

  /** Validate a specific certificate still exists/is valid in source */
  validateCertificate(certificateId: string): Promise<boolean>;

  /** Check if the provider is reachable and configured correctly */
  healthCheck(): Promise<ProviderHealth>;
}

// server/src/providers/academic.provider.ts (planned)
interface AcademicProvider {
  /** Fetch all students from the academic registry system */
  fetchStudents(): Promise<Student[]>;

  /** Fetch a single student by their external ID */
  fetchStudent(id: string): Promise<Student | null>;

  /** Health check */
  healthCheck(): Promise<ProviderHealth>;
}

// Shared types
interface ProviderHealth {
  status: 'connected' | 'disconnected' | 'error';
  latencyMs: number;
  message?: string;
  lastChecked: string;
}
```

### 6.2 Provider Implementations

```
providers/
├── certificate/              # CertificateProvider implementations
│   ├── certificate.provider.interface.ts   # Interface definition
│   ├── moodle.certificate.provider.ts      # Moodle implementation
│   └── canvas.certificate.provider.ts      # Future Canvas implementation
├── academic/                 # AcademicProvider implementations
│   ├── academic.provider.interface.ts      # Interface definition
│   ├── guarani.academic.provider.ts        # Guaraní implementation
│   └── custom.academic.provider.ts         # Future CSV/file-based provider
├── provider.registry.ts      # Service locator — resolves active provider
└── provider.types.ts         # Shared provider types
```

### 6.3 Registration & Resolution

Providers are registered in a config file (`providers.yaml` or env vars):

```yaml
# config/providers.yaml
certificate:
  active: moodle
  moodle:
    url: ${MOODLE_URL}
    token: ${MOODLE_TOKEN}
  canvas:                   # Future
    url: ${CANVAS_URL}
    token: ${CANVAS_TOKEN}

academic:
  active: guarani
  guarani:
    url: ${GUARANI_URL}
    token: ${GUARANI_TOKEN}
```

Resolution at startup via `ProviderRegistry`:

```typescript
class ProviderRegistry {
  private certificateProviders: Map<string, CertificateProvider>;
  private academicProviders: Map<string, AcademicProvider>;

  getCertificateProvider(): CertificateProvider {
    const active = config.certificate.active;
    return this.certificateProviders.get(active);
  }
}
```

### 6.4 Cross-Cutting Concerns Applied to All Providers

| Concern | Implementation |
|---------|---------------|
| **Retry with backoff** | Wrapper/decorator: retry(provider, 3, [1s, 4s, 9s]) |
| **Timeout** | Configurable per-provider (default 10s) |
| **Circuit breaker** | Future: break after N consecutive failures, half-open after T seconds |
| **Logging** | Every provider call → structured log to `integration_logs` |
| **Health check caching** | Cache health status for max 5 minutes |
| **Error isolation** | Per-student errors never abort batch; per-provider errors never affect other providers |
| **Idempotency** | All sync operations are idempotent (upsert by natural key) |

### 6.5 Adding a New Provider

To add Canvas as a certificate source:

1. Create `providers/certificate/canvas.certificate.provider.ts`
2. Implement `CertificateProvider` interface
3. Register in `providers.yaml` (optional, for future activation)
4. Set `certificate.active: canvas` in config
5. Zero changes to: rule engine, dashboards, API endpoints, business logic

```
Business Logic Core  (zero changes)
       │
       │ depends on CertificateProvider interface
       ▼
┌──────────────────────┐
│  CanvasProvider       │  (new file, implements interface)
│  - fetchCertificates()│
│  - validateCertificate│
│  - healthCheck()      │
└──────────────────────┘
       │
       ▼
Canvas LMS API  (external)
```

---

> *Generated as part of DTS Discovery Maps. Refresh when provider interfaces change or new entities are added.*
