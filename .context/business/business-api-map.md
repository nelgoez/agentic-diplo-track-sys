# Business API Map — Diploma Tracking System (DTS)

> **Document**: System Discovery · API Architecture Map
> **Project**: Diploma Tracking System — Universidad Nacional de Córdoba
> **Version**: 1.0 · **Status**: Final
> **Language**: English

---

## 1. Auth Model

### 1.1 Authentication Flow

```
┌──────────┐     POST /auth/login          ┌──────────┐     ┌──────────────┐
│  Client  │ ──── {email, password} ───────▶│  API     │────▶│ Supabase Auth│
│ (SPA)    │                                │ (Hono)   │     │              │
│          │◀── {accessToken,               │          │◀────│ JWT verified │
│          │     refreshToken, user} ───────│          │     └──────────────┘
└──────────┘                                └──────────┘
       │                                         │
       │  Subsequent requests:                    │
       │  Authorization: Bearer <accessToken>     │
       │─────────────────────────────────────────▶│
       │                                          │
       │  On 401 (expired):                       │
       │  POST /auth/refresh {refreshToken}       │
       │─────────────────────────────────────────▶│
       │◀── new {accessToken, refreshToken} ─────│
       │                                          │
       │  On logout:                              │
       │  POST /auth/logout {refreshToken}        │
       │─────────────────────────────────────────▶│
       │  (refresh token revoked)                 │
```

**Token specification**:
- **Algorithm**: HS256 (≥256-bit key) or RS256
- **Access token TTL**: 15 minutes
- **Refresh token TTL**: 7 days (revocable via DB blacklist)
- **JWT payload**: `{ sub: userId, role: string, tracks: [trackId] }`
- **Library**: `jose` (server-side sign/verify)

### 1.2 RBAC Role Hierarchy

```
                    ┌──────────┐
                    │ sysadmin │  (can do everything + system config)
                    └────┬─────┘
                         │
                    ┌────▼─────┐
                    │  admin   │  (all data, integrations, user management)
                    └────┬─────┘
                         │
                    ┌────▼──────────┐
                    │  coordinador  │  (their tracks: students, rules, overrides, exams)
                    └────┬──────────┘
                         │
                    ┌────▼───────────┐
                    │  estudiante    │  (own data only: dashboard, certificates, exams)
                    └────────────────┘
```

| Role | Level | Access Scope |
|------|-------|-------------|
| estudiante | 10 | Own profile, own certificates, own enrollments, own eligibility |
| coordinador | 20 | Students in assigned tracks, rules config, overrides, exam grades |
| admin | 30 | All data, integrations, user management, diploma config |
| sysadmin | 40 | All admin + system-level settings (auth providers, env config) |

### 1.3 Middleware Chain

Every protected endpoint passes through this chain:

```
Request
  │
  ├── [1] authenticate
  │     - Extracts Bearer token from Authorization header
  │     - Verifies JWT signature + expiry using jose
  │     - Decodes payload → { userId, role, tracks }
  │     - Sets c.set('auth', authContext)
  │     - On failure → 401
  │
  ├── [2] requireRole(roles[])
  │     - Reads auth context from c.get('auth')
  │     - Checks if user.role ∈ allowedRoles
  │     - On failure → 403
  │
  ├── [3] (optional) validateBody(schema)
  │     - Zod schema validation (zValidator from @hono/zod-validator)
  │     - On failure → 422 with field-level errors
  │
  ├── [4] (optional) auditLog(action)
  │     - For CUD operations only
  │     - Logs to audit_log table: user, action, entity, before/after snapshots
  │
  └── [5] Route Handler
        - Delegates to service layer (or direct Supabase calls in current impl)
        - Returns { data } or { error }
```

**Current middleware location**: `middleware/auth.ts:9-46`

**Middleware composition example** (`enrollments.ts:117`):
```typescript
router.put(
  '/:id/grade',
  authenticate,              // Step 1
  requireRole('coordinador', 'admin', 'sysadmin'), // Step 2
  validateBody(gradeSchema), // Step 3
  auditLog('GRADE_RECORD'),  // Step 4
  handler,                   // Step 5
);
```

### 1.4 Defense in Depth

| Layer | Mechanism | Bypass Risk |
|-------|-----------|-------------|
| 1. Network | API gateway / load balancer | None (external) |
| 2. Transport | HTTPS (TLS 1.3) | None (encrypted) |
| 3. Application | JWT + middleware | Token forgery (prevented by strong signing key) |
| 4. API Layer | `requireRole()` | Code bug in middleware logic |
| 5. Database | Row-Level Security (RLS) | Mitigates layer 4 failure |
| 6. Application | Audit logging | Deterrent + forensic |

---

## 2. Critical Journey 1: Student Checks Eligibility

### 2.1 User Story

**Actor**: Lucía (estudiante)
**Goal**: See if she can take the final exam
**Trigger**: Lucía opens her dashboard

### 2.2 API Call Chain

```
[Browser SPA]                    [API Server]                      [Supabase DB]            [Rule Engine]
      │                               │                                │                        │
      │ (1) GET /auth/me              │                                │                        │
      │ Authorization: Bearer <JWT>   │                                │                        │
      │──────────────────────────────▶│                                │                        │
      │                               │ authenticate (verify JWT)      │                        │
      │                               │ requireRole (any)              │                        │
      │                               │ SELECT * FROM users           │                        │
      │                               │ WHERE id = userId             │                        │
      │                               │───────────────────────────────▶│                        │
      │◀── {id, email, role,          │◀───────────────────────────────│                        │
      │     tracks: [{id, name}]}     │                                │                        │
      │                               │                                │                        │
      │ (2) GET /students/:id/        │                                │                        │
      │     progress                   │                                │                        │
      │──────────────────────────────▶│                                │                        │
      │                               │ authenticate                   │                        │
      │                               │ (self-check or admin/coord)   │                        │
      │                               │                                │                        │
      │                               │ SELECT id, name FROM tracks   │                        │
      │                               │ WHERE id IN (user's tracks)   │                        │
      │                               │───────────────────────────────▶│                        │
      │                               │◀───────────────────────────────│                        │
      │                               │                                │                        │
      │                               │ SELECT * FROM courses          │                        │
      │                               │ WHERE track_id = :trackId     │                        │
      │                               │ ORDER BY order_index          │                        │
      │                               │───────────────────────────────▶│                        │
      │                               │◀───────────────────────────────│                        │
      │                               │                                │                        │
      │                               │ SELECT * FROM certificates    │                        │
      │                               │ WHERE student_id = :id        │                        │
      │                               │ AND status = 'active'         │                        │
      │                               │───────────────────────────────▶│                        │
      │                               │◀───────────────────────────────│                        │
      │                               │                                │                        │
      │                               │ Compute TrackProgress:         │                        │
      │                               │ - totalModules = courses.length│                        │
      │                               │ - completedModules =           │                        │
      │                               │   certificates matching courses│                        │
      │                               │ - per-module status            │                        │
      │                               │                                │                        │
      │ (3) POST /rules/evaluate      │                                │                        │
      │     {studentId, trackId}      │                                │                        │
      │──────────────────────────────▶│                                │                        │
      │                               │ authenticate                   │                        │
      │                               │                                │                        │
      │                               │ Load rules for track:          │                        │
      │                               │ SELECT * FROM                  │                        │
      │                               │ prerequisite_rules             │                        │
      │                               │ WHERE track_id = :trackId     │                        │
      │                               │───────────────────────────────▶│                        │
      │                               │◀───────────────────────────────│                        │
      │                               │                                │                        │
      │                               │ Load sources for rules:        │                        │
      │                               │ SELECT * FROM                  │                        │
      │                               │ prerequisite_sources           │                        │
      │                               │ WHERE rule_id IN (:ruleIds)   │                        │
      │                               │───────────────────────────────▶│                        │
      │                               │◀───────────────────────────────│                        │
      │                               │                                │                        │
      │                               │ Load student overrides:        │                        │
      │                               │ SELECT * FROM                  │                        │──▶ Override Checker
      │                               │ manual_overrides               │                        │    (checks expiry)
      │                               │ WHERE student_id = :id        │                        │
      │                               │ AND status = 'active'         │                        │
      │                               │───────────────────────────────▶│                        │
      │                               │◀───────────────────────────────│                        │
      │                               │                                │                        │
      │                               │── Evaluate tree recursively ──▶│                        │
      │                               │   ALL(rule) → all children ok  │                        │──▶ Certificate Checker
      │                               │   ANY(rule) → ≥1 child ok      │                        │    (preloaded)
      │                               │   Override → mark fulfilled    │                        │
      │                               │◀── Result ────────────────────│                        │
      │                               │                                │                        │
      │◀── {eligible, rules: [{       │                                │                        │
      │      type, fulfilled,         │                                │                        │
      │      overridden, sources,     │                                │                        │
      │      children}]}              │                                │                        │
      │                               │                                │                        │
      │ Render dashboard:             │                                │                        │
      │ - ProgressBar                 │                                │                        │
      │ - EligibilityCard (✅/❌)     │                                │                        │
      │ - NextStepsList               │                                │                        │
```

### 2.3 Architecture Behind the Journey

| Component | File | Role |
|-----------|------|------|
| **SPA Page** | `client/src/pages/Dashboard.tsx` | Renders progress + eligibility |
| **API Client** | `client/src/services/api.ts` | TanStack Query hooks |
| **Route** | `routes/students.ts:64` | GET /students/:id/progress handler |
| **Route** | `routes/rules.ts:124` | POST /rules/evaluate handler |
| **Middleware** | `middleware/auth.ts:9` | authenticate — JWT verification |
| **DB Queries** | `routes/students.ts:68-84` | Supabase queries for certificates count |
| **Rule Engine** | `routes/rules.ts:156-174` | In-memory recursive ALL/ANY evaluation |
| **Override Checker** | `routes/rules.ts` part of evaluate | Loads active overrides |
| **Certificate Checker** | `routes/rules.ts:129-135` | Preloads approved certificates |

**Performance**: Target <500ms for combined progress + eligibility (NFR-PERF-003).

**Current limitations**: Progress uses placeholder values (hardcoded `courses_total: 5` at `students.ts:90`). Rule engine evaluates flat rules but does NOT yet support nested sub-rules (tree depth = 1).

---

## 3. Critical Journey 2: Coordinator Syncs Certificates

### 3.1 User Story

**Actor**: Pablo (coordinador)
**Goal**: Update all student certificates from Moodle
**Trigger**: Pablo clicks "Sincronizar ahora" in coordinator dashboard

### 3.2 API Call Chain

```
[Browser SPA]                    [API Server]                      [Supabase DB]            [Moodle LMS]
      │                               │                                │                        │
      │ (1) POST /integrations/       │                                │                        │
      │     sync/moodle               │                                │                        │
      │     Authorization: Bearer     │                                │                        │
      │──────────────────────────────▶│                                │                        │
      │                               │ authenticate                   │                        │
      │                               │ requireRole('admin',           │                        │
      │                               │             'sysadmin')        │                        │
      │                               │                                │                        │
      │                               │ Log sync start:                │                        │
      │                               │ INSERT integration_logs        │                        │
      │                               │ (status='pending')            │                        │
      │                               │───────────────────────────────▶│                        │
      │                               │                                │                        │
      │ (2) Response immediately:     │                                │                        │
      │◀── 202 {syncId,              │                                │                        │
      │     status: 'in_progress'}   │                                │                        │
      │                               │                                │                        │
      │                               │ [Async processing starts]      │                        │
      │                               │                                │                        │
      │                               │── Process students in          │                        │
      │                               │   batches of 50:               │                        │
      │                               │                                │                        │
      │                               │   SELECT * FROM students      │                        │
      │                               │   WHERE is_active = true      │                        │
      │                               │   LIMIT 50 OFFSET :n          │                        │
      │                               │───────────────────────────────▶│                        │
      │                               │◀───────────────────────────────│                        │
      │                               │                                │                        │
      │                               │   For each student:            │                        │
      │                               │   MoodleProvider               │                        │
      │                               │   .fetchCertificates(email)    │                        │
      │                               │────────────────────────────────────────────────────────▶│
      │                               │                                │                        │
      │                               │   GET /webservice/rest.php     │                        │
      │                               │   ?wstoken=xxx                │                        │
      │                               │   &wsfunction=                │                        │
      │                               │   core_completion_get_...      │                        │
      │                               │◀────────────────────────────────────────────────────────│
      │                               │                                │                        │
      │                               │   Map response to DTS format:  │                        │
      │                               │   { student_id, course_id,    │                        │
      │                               │     provider: 'moodle',       │                        │
      │                               │     external_id, issued_at }   │                        │
      │                               │                                │                        │
      │                               │   UPSERT certificates:         │                        │
      │                               │   ON CONFLICT                  │                        │
      │                               │   (student_id, course_id,      │                        │
      │                               │    provider)                   │                        │
      │                               │   DO UPDATE SET issued_at...   │                        │
      │                               │───────────────────────────────▶│                        │
      │                               │                                │                        │
      │                               │   On error: log per-student   │                        │
      │                               │   error, continue next        │                        │
      │                               │                                │                        │
      │                               │   [Apply exponential backoff   │                        │
      │                               │    on timeout: 1s, 4s, 9s]    │                        │
      │                               │                                │                        │
      │                               │ Re-evaluate eligibility       │                        │
      │                               │ for affected students          │                        │
      │                               │ (if newly eligible → notif)   │                        │
      │                               │                                │                        │
      │                               │ Log sync complete:             │                        │
      │                               │ UPDATE integration_logs        │                        │
      │                               │ SET status='success',          │                        │
      │                               │   students_processed=N,       │                        │
      │                               │   students_new=N,             │                        │
      │                               │   errors_count=N              │                        │
      │                               │───────────────────────────────▶│                        │
      │                               │                                │                        │
      │ (3) Poll for status:          │                                │                        │
      │ GET /integrations/logs        │                                │                        │
      │ ?syncId=:id                  │                                │                        │
      │──────────────────────────────▶│                                │                        │
      │◀── {status: 'success',       │                                │                        │
      │     summary}                  │                                │                        │
```

### 3.3 Architecture Behind the Journey

| Component | File | Role |
|-----------|------|------|
| **Route** | `integrations.ts:43` | POST /integrations/sync/moodle |
| **Service** | `services/moodle.service.ts:28` | `MoodleService.syncCertificates()` — calls Moodle API |
| **Provider** | `providers/moodle.certificate.provider.ts` (future) | Implements `CertificateProvider` |
| **DB** | `certificates` table | Upsert destination |
| **DB** | `integration_logs` table | Sync audit trail |
| **Resilience** | Middleware or wrapper | Retry with exponential backoff |
| **Auth** | `middleware/auth.ts` | requireRole('admin', 'sysadmin') |

**Current limitations**: `moodle.service.ts:28` is a placeholder returning `[]`. Actual Moodle API integration not yet implemented. Batch size (50), retry logic, and async progress tracking are planned but not coded.

**Sync concurrency guard**: `FR-INT-002/BR59` — another sync cannot start while one is running (checked via integration_logs with status='pending').

---

## 4. Critical Journey 3: Admin Views Dashboard

### 4.1 User Story

**Actor**: Carolina (admin)
**Goal**: See system-wide metrics at a glance
**Trigger**: Carolina opens admin panel after login

### 4.2 API Call Chain

```
[Browser SPA]                    [API Server]                      [Supabase DB]
      │                               │                                │
      │ (1) GET /admin/dashboard-     │                                │
      │     stats                      │                                │
      │ Authorization: Bearer <JWT>   │                                │
      │──────────────────────────────▶│                                │
      │                               │ authenticate                   │
      │                               │ requireRole('admin',           │
      │                               │             'sysadmin')        │
      │                               │                                │
      │                               │ 5 parallel queries:            │
      │                               │                                │
      │                               │ (a) SELECT COUNT(*) FROM       │
      │                               │     students                   │
      │                               │───────────────────────────────▶│
      │                               │◀── totalStudents ─────────────│
      │                               │                                │
      │                               │ (b) SELECT COUNT(*) FROM       │
      │                               │     students                   │
      │                               │     WHERE is_active = true    │
      │                               │───────────────────────────────▶│
      │                               │◀── activeStudents ────────────│
      │                               │                                │
      │                               │ (c) SELECT COUNT(*) FROM       │
      │                               │     tracks                     │
      │                               │     WHERE is_active = true    │
      │                               │───────────────────────────────▶│
      │                               │◀── activeTracks ──────────────│
      │                               │                                │
      │                               │ (d) SELECT COUNT(*) FROM       │
      │                               │     certificates               │
      │                               │     WHERE status = 'approved'  │
      │                               │───────────────────────────────▶│
      │                               │◀── approvedCertificates ──────│
      │                               │                                │
      │                               │ (e) SELECT COUNT(*) FROM       │
      │                               │     enrollments              │
      │                               │     WHERE exam_status          │
      │                               │     IN ('aprobado',            │
      │                               │         'inscripto')          │
      │                               │───────────────────────────────▶│
      │                               │◀── examStats ─────────────────│
      │                               │                                │
      │                               │ (f) SELECT      │
      │                               │     enrollments.track_id,      │
      │                               │     COUNT(*) as eligible      │
      │                               │     FROM enrollments           │
      │                               │     JOIN tracks ON ...        │
      │                               │     WHERE exam_status          │
      │                               │     IS NULL ...               │
      │                               │     GROUP BY track_id         │
      │                               │───────────────────────────────▶│
      │                               │◀── eligibleByTrack ───────────│
      │                               │                                │
      │                               │ Compute derived metrics:       │
      │                               │ - completion_rate             │
      │                               │ - eligible vs not-eligible    │
      │                               │ - sync health indicators      │
      │                               │                                │
      │◀── {                          │                                │
      │  totalStudents: 247,          │                                │
      │  activeStudents: 210,         │                                │
      │  activeTracks: 3,            │                                │
      │  totalCertificates: 1893,    │                                │
      │  eligibleCount: 120,         │                                │
      │  notEligibleCount: 127,      │                                │
      │  recentSyncErrors: 2,        │                                │
      │  completionRate: 0.62        │                                │
      │ }                             │                                │
      │                               │                                │
      │ (2) Get integration status:   │                                │
      │ GET /integrations/status      │                                │
      │──────────────────────────────▶│                                │
      │                               │ Check last integration_logs    │
      │                               │ for moodle + guarani          │
      │                               │───────────────────────────────▶│
      │                               │◀───────────────────────────────│
      │◀── {moodle: {status,          │                                │
      │      lastSync, errors},       │                                │
      │     guarani: {status, ...}}   │                                │
```

### 4.3 Architecture Behind the Journey

| Component | File | Role |
|-----------|------|------|
| **Route** | `admin.ts:10` | GET /admin/dashboard-stats — 5+ aggregate queries |
| **Route** | `integrations.ts:9` | GET /integrations/status — provider health |
| **Middleware** | `middleware/auth.ts` | authenticate + requireRole('admin', 'sysadmin') |
| **DB** | Multiple tables | COUNT queries. No JOINs between large tables needed for basic stats. |
| **Current approach** | Real-time COUNT(*) queries | No caching. For 10K+ students, consider materialized views or periodic refresh. |

**Current limitations**: Dashboard-stats queries are real-time COUNT(*) on every request. At scale (>10K students), this should be cached (e.g., materialized view refreshed every 5 min, or Redis counters).

**Admin students list** (`admin.ts:51`): Same pattern as `/students` but admin-scoped (no filter by coordinator track). Includes enrollment + certificate counts via subquery.

---

## 5. Provider Abstraction at the API Boundary

### 5.1 How Providers Integrate with API Routes

```
        API Route Handler
              │
              │ (resolved at startup / via registry)
              ▼
   ┌─────────────────────┐
   │   ProviderRegistry   │
   │                     │
   │ getCertificate() ───┼──▶ MoodleCertificateProvider
   │ getAcademic() ──────┼──▶ GuaraniAcademicProvider
   └─────────────────────┘
              │
              │ All calls go through a ResilienceWrapper
              ▼
   ┌─────────────────────┐
   │  ResilienceWrapper  │
   │                     │
   │  - Retry (3x, exp) │
   │  - Timeout (10s)   │
   │  - Circuit breaker  │  (future)
   │  - Log to           │
   │    integration_logs │
   └─────────────────────┘
              │
              ▼
   ┌─────────────────────┐
   │  External System    │
   │  (Moodle / Guaraní) │
   └─────────────────────┘
```

### 5.2 API Integration Endpoints

| Endpoint | Provider Interface | Method Called |
|----------|-------------------|---------------|
| POST /integrations/sync/moodle | `CertificateProvider` | `fetchCertificates(studentId)` per student |
| POST /integrations/sync/guarani | `AcademicProvider` | `fetchStudents()` (full registry) |
| GET /integrations/status | Both | `healthCheck()` per provider |
| POST /certificates/:id/resync | `CertificateProvider` | `fetchCertificates(studentId)` for one student |
| GET /integrations/logs | (none — reads DB) | Integration log queries |

### 5.3 Provider Resolution Code Path

```
Startup:
  1. Load config/providers.yaml
  2. Instantiate all registered providers
  3. Register in ProviderRegistry

Runtime (POST /integrations/sync/moodle):
  1. admin.ts or integrations.ts route handler
  2. Call ProviderRegistry.getCertificateProvider()
  3. Returns MoodleCertificateProvider (or CanvasProvider, etc.)
  4. Call provider.fetchCertificates(studentId)
  5. ResilienceWrapper applies retry/timeout
  6. Moodle API called (or mock in dev)
  7. Results upserted to certificates table
```

### 5.4 Impact on API Contract

Providers are **invisible to API consumers**. The API contract is the same regardless of which provider is active:

```yaml
# Same response shape, regardless of LMS backend:
GET /certificates
→ { data: [{ provider: "moodle", ... }] }

# The "provider" field in the response tells consumers the source,
# but the schema is provider-agnostic.
```

The `provider` field on the `Certificate` schema (`api-contracts.yaml:1438`) is informational — it tags which LMS the certificate came from but does not require different handling.

---

> *Generated as part of DTS Discovery Maps. Refresh when auth model, middleware chain, or provider architecture changes.*
