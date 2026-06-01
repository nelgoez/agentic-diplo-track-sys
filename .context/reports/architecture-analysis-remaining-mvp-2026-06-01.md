# Architecture Analysis — Remaining MVP Stories

> **Audience**: Tech Lead, Sprint Planning
> **Date**: 2026-06-01
> **Context**: 4 remaining Must-Have stories (DTS-22 through DTS-25), sprint allocation for completion
> **Based on**: Sprint Progress Report (2026-06-01), Moodle UNC Integration Audit (2026-05-29, commit `da2a8c5`), business-data-map.md, master-implementation-plan.md, per-story specs + impl plans

---

## 0. Critical Finding: Cross-Repo Delta

The Moodle UNC integration audit (`2026-05-29`) audited the `diploma-tracking-sys` codebase at commit `da2a8c5` and found a Phase B update **not yet reflected** in the sprint progress report. Key discrepancies:

| Story | Sprint Report Says | Audit Says (line ref) | Verdict |
|-------|-------------------|----------------------|---------|
| DTS-EXAM-4 (Grade Recording) | "Not implemented" | line 148: `PUT /enrollments/:id/grade` — "Working (inscripto gate + auto-transition)" | **Already done** |
| DTS-SYNC-1 (Moodle Sync) | "Impl plan written" | line 153: `POST /integrations/sync/moodle` — "MOCK — reads local DB" | **Route still mock, but moodle.service.ts has real API calls** (line 179) |
| DTS-SYNC-4 (Resilient Adapter) | "Impl plan written" | line 290: T2 — "3 retries, 1s/4s/9s delays, `AbortSignal.timeout(10000)` — Complete (Phase B)" | **Retry logic baked into moodle.service.ts inline; standalone wrapper not extracted** |
| DTS-INT-5 (Guaraní) | "Should Have, Phase 6" | line 181: "Mock — reads local DB" | **Fully stub; zero real API** |

**Implication**: DTS-EXAM-4 is likely merge-ready already. The actual remaining Must-Have work is **3 stories, not 4** — and 2 of them (SYNC-1, SYNC-4) have partial implementations. Only DTS-INT-5 is a full greenfield build (but is classified as Should Have in the epic tree — see §1 note).

---

## 1. Dependency Graph

```
DTS-22 (Grade Recording)
  ├── depends on: DTS-EXAM-3 (exam enrollment) ✅ DONE
  ├── depends on: enrollments table (exam_status, exam_grade columns) ✅ DONE
  ├── depends on: auth middleware (requireRole) ✅ DONE
  └── blocks: nothing

DTS-24 (Resilient Adapter) [standalone utility]
  ├── depends on: BARE function signature (Promise<T>) — zero app code dependencies
  ├── depends on: AC3 timeout → AbortController (browser/server universal) ✅ AVAILABLE
  └── blocks: nothing (optional for SYNC-1 and INT-5; SYNC-1 already has inline retry)

DTS-23 (Moodle Sync)
  ├── depends on: DTS-INT-2 (MoodleCertificateProvider) ✅ DONE
  ├── depends on: DTS-INT-3 (integration_logs) ✅ DONE
  ├── depends on: DTS-CORE-3 (students table) ✅ DONE
  ├── depends on: moodle.service.ts real API calls ✅ DONE (Phase B)
  ├── optionally depends on: DTS-24 (resilient adapter) — already has inline retry
  └── blocks: DTS-SYNC-2 (individual re-sync), DTS-NOTIF-2 (certificate notification)

DTS-25 (Guaraní Sync)
  ├── depends on: DTS-INT-1 (AcademicProvider interface) ✅ DONE
  ├── depends on: DTS-CORE-3 (students table, upsert by email/DNI) ✅ DONE
  ├── depends on: DTS-INT-3 (integration_logs) ✅ DONE
  ├── optionally depends on: DTS-24 (resilient adapter)
  ├── optionally depends on: DTS-SYNC-1 (sync pattern reuse, not hard dependency)
  └── blocks: nothing critical
```

### Parallelization Matrix

| Story Pair | Independent? | Reason |
|-----------|-------------|--------|
| DTS-22 ‖ DTS-24 | ✅ Yes | Grade logic touches enrollments + audit_log. Retry wrapper is a pure function. Zero shared state. |
| DTS-22 ‖ DTS-23 | ✅ Yes | Grade recording operates on enrollment rows. Moodle sync operates on certificate rows. Different tables, different flows. |
| DTS-24 ‖ DTS-23 | ✅ Yes (parallel) | DTS-24 is a standalone npm-style utility. Can be merged first, but SYNC-1 already has inline retry — not blocked either way. |
| DTS-23 ‖ DTS-25 | ✅ Yes | Completely different providers (CertificateProvider vs AcademicProvider), different tables, different upstream APIs. |
| DTS-23 → DTS-SYNC-2 | ❌ Sequential | Re-sync needs the batch sync infrastructure (sync ID, status polling pattern). |

**Bottom line**: DTS-22, DTS-24, and DTS-23/25 can ALL be worked on in parallel by different developers. Only DTS-SYNC-2 chains after DTS-SYNC-1.

---

## 2. Risk Assessment

### 2.1 Risk Matrix

| Risk | Story | Likelihood | Impact | Score | Classification |
|------|-------|-----------|--------|-------|---------------|
| Moodle admin token unavailable | DTS-23 | **High** (70%) | Critical | **Critical** | EXTERNAL BLOCKER |
| `mod_customcert_get_issues` not exposed | DTS-23 | **High** (90%) | High | **High** | ARCHITECTURAL |
| Completion criteria not set on UNC courses | DTS-23 | Medium (50%) | Medium | Medium | DATA QUALITY |
| Guaraní API credentials unavailable | DTS-25 | **High** (80%) | High | **High** | EXTERNAL BLOCKER |
| Guaraní API schema undocumented | DTS-25 | Medium (50%) | Medium | Medium | INTEGRATION |
| Grade recording edge cases (re-grade, concurrency) | DTS-22 | Low (10%) | Low | Low | ALREADY DONE |
| Token scope confusion (user-scoped vs admin-scoped) | DTS-23 | High (confirmed) | Critical | **Critical** | ALREADY HIT |

### 2.2 Detailed Risk Analysis

#### R1: Moodle Admin Token (DTS-23) — CRITICAL

**Evidence** (audit part A, lines 39-56): Current token `e7fe62e377593713e8ccd71c690055df` is user-scoped. `core_user_get_users_by_field` with a different user's email returns `[]`. `core_enrol_get_enrolled_users` returns `nopermissions`. Only the token owner's own data is accessible.

**Impact**: Without an admin/manager-level token, system-wide batch sync across all students is **impossible**. The current implementation can only sync a single test user.

**Mitigation**:
1. **Immediate**: Implement single-user sync mode as a validated demo path. System works for `nelthor` (test user) — certificates flow end-to-end.
2. **Blocking**: UNC DTI must provide admin-level token with `moodle/webservice:manageall` capability or equivalent.
3. **Fallback**: The sync route already has a hardcoded mock path. Ship with mock mode toggle (`MOCK_MODE=true` env var). When real token unavailable, system degrades gracefully to mock data — still demonstrates the full pipeline.

**Do NOT block DTS-23 implementation on this**. Build the sync pipeline against the known Moodle REST API contract. If admin token arrives later, it's a one-line config change.

#### R2: Certificate Data Source Gap (DTS-23) — HIGH

**Evidence** (audit part A, lines 58-60): `mod_customcert` only exposes `delete_issue` via `moodle_mobile_app`. `get_issues`/`get_certificates` is NOT exposed. `core_completion_get_course_completion_status` is the only proxy — but it requires completion criteria to be configured per course.

**Impact**: Cannot query "what certificates does student X have?" from Moodle directly. Must infer from completion status.

**Mitigation strategy** (already in moodle.service.ts, audit line 179):
1. Query `core_user_get_users_by_field` to resolve student email → Moodle user ID
2. Query `core_enrol_get_users_courses` to get student's enrolled courses
3. For each course, query `core_completion_get_course_completion_status`
4. If status=`completed` AND completion date exists → treat as certificate issued
5. Map Moodle course ID → DTS course via `courses.moodle_course_id`

**This is an inference, not a certificate query**. It will produce false positives if a course is marked "completed" but no certificate was issued. The `customcert` plugin would need to expose `get_issues` for ground truth. UNC action required for Phase 2 fidelity.

#### R3: Guaraní Credentials (DTS-25) — HIGH

**Evidence** (audit part D, line F8): `guarani.service.ts:syncStudents()` "reads local DB in circle." Zero real Guaraní API integration. No credentials. No API documentation for UNC's Guaraní instance.

**Impact**: DTS-INT-5 cannot ship with real data. It's a placeholder until DTI provides:
- Guaraní SIU web service URL
- API token/credentials
- Data schema (student fields, mapping)

**Recommendation**: Build with AcademicProvider interface, fixture-driven. System is ready to plug in real Guaraní the moment credentials arrive. This is the **entire point of the provider abstraction**.

---

## 3. Recommended Sprint Order

### Recommendation: 3 Sprints (parallel-capable, gated by external factors)

```
Sprint N      (Now)
├── DTS-22: Grade Recording + Auto-Status       (0 SP — VERIFY, already done per audit)
├── DTS-24: Resilient Adapter (standalone)       (5 SP)
└── DTS-25: Guaraní Sync (fixture-driven)        (8 SP)  [parallel with DTS-24]

Sprint N+1    (Integration Pipeline)
├── DTS-23: Moodle Batch Sync (real API)         (8 SP)
│   ├── Wire moodle.service.ts → integrations route
│   ├── Replace mock with real API calls
│   ├── Batch processing loop (50/batch)
│   ├── Conflict guard (in-memory lock)
│   ├── Status polling endpoint
│   └── MOCK_MODE toggle for demo (env var fallback)
└── DTS-SYNC-2: Individual Certificate Re-sync    (3 SP)  [depends on SYNC-1 complete]

Sprint N+2    (Polish + Hardening)
├── DTS-24 integration into SYNC-1 (if not already baked in)
├── DTS-25 resilience (apply retry wrapper to Guaraní)
├── Integration tests for all sync flows
└── End-to-end smoke test: full Moodle → DTS pipeline with fixture data
```

### Rationale

1. **Sprint N pushes independent work first**. DTS-22 is effectively done (verify + merge). DTS-24 is a pure function — no integration risk, easy to test, unblocks nothing but adds value everywhere. DTS-25, even as fixture-driven, completes the AcademicProvider story and makes the architecture symmetrical (both providers have sync endpoints, both use the same resilience pattern).

2. **Sprint N+1 is the critical path**. DTS-23 is the hardest story (8 SP for a reason). Despite moodle.service.ts having real API calls, the sync route orchestration — chunked batch processing, conflict guard, status polling, progress tracking — is substantial new code (~200 lines). DTS-SYNC-2 chains after it naturally.

3. **Sprint N+2 is hardening**. Apply DTS-24's retry wrapper to Guaraní. Fill integration test gaps.

### Why NOT Sprint N = DTS-22 + DTS-23 (pairing)

Pairing the smallest story with the largest creates an unbalanced sprint and delays parallel progress. DTS-24 and DTS-25 have zero shared state with DTS-23. A developer on DTS-24 finishes in 2 days and can immediately start DTS-25, achieving parallelism.

---

## 4. Architecture Decision: DTS-24 as Decorator

### Decision: Build as standalone generic wrapper, apply to ALL providers

**Pattern**: Higher-order function, Strategy pattern

```typescript
// server/src/services/retry-wrapper.ts (new)
interface RetryConfig {
  maxRetries: number;
  backoffMs: number[];
  timeoutMs: number;
  retryableStatusCodes: number[];  // [502, 503, 504, 429]
}

interface RetryResult<T> {
  result: T;
  attempts: number;
  totalDurationMs: number;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> & { signal?: AbortSignal }
): Promise<RetryResult<T>>;
```

**Application**:

```typescript
// Moodle provider
const { result: certs } = await withRetry(
  () => moodleProvider.fetchCertificates(studentId),
  { timeoutMs: moodleTimeout, signal: AbortSignal.timeout(moodleTimeout) }
);

// Guaraní provider
const { result: students } = await withRetry(
  () => guaraniProvider.fetchStudents(),
  { timeoutMs: guaraniTimeout, signal: AbortSignal.timeout(guaraniTimeout) }
);

// Health check (light retry)
const health = await withRetry(
  () => provider.healthCheck(),
  { maxRetries: 1, timeoutMs: 5000 }
);
```

### Rationale (vs baking into each provider)

| Criterion | Decorator (RECOMMENDED) | Baked into each provider |
|-----------|------------------------|--------------------------|
| Code duplication | Zero | Full (retry logic × N providers) |
| Testability | Test once with mock `fn`; 12 test cases cover all providers | Must retest per provider |
| New providers | Free resilience. Add Canvas, SAP, custom LMS → zero retry code | Copy-paste or delegate (ends up being decorator anyway) |
| Config surface | Single `RetryConfig` type. Per-provider overrides via constructor injection | Scattered across provider classes |
| Audit logging | Retry count + duration captured in one place → passed to `logPerStudent()` | Must re-implement telemetry per provider |
| Non-retryable errors | Centralized HTTP status code matrix (4xx except 429 = fail fast) | Duplicated error classification |
| Circuit breaker (future) | Add to wrapper once. All providers get it. | Re-implement N times |
| **Current codebase alignment** | ✅ — business-data-map §6.4 explicitly calls for "Wrapper/decorator" pattern | ❌ |

### Current state and migration path

`moodle.service.ts` already has inline retry (audit line 290, T2). This is technical debt from Phase B's rapid iteration. Migration:

1. Build `retry-wrapper.ts` as standalone utility
2. Replace inline retry in `moodle.service.ts` with `withRetry()` wrapper
3. Verify all existing moodle.service tests still pass
4. Apply `withRetry()` to `guarani.service.ts` when building DTS-25
5. Delete old inline retry code from moodle.service.ts

**Retryable vs non-retryable error classification** (per AC spec):

| Error | Retry? | Reason |
|-------|--------|--------|
| Network error (ECONNRESET, ETIMEDOUT, ECONNREFUSED, ENOTFOUND) | ✅ Retry | Transient |
| HTTP 502, 503, 504 | ✅ Retry | Server-side transient |
| HTTP 429 (Rate Limit) | ✅ Retry | Backpressure, backoff helps |
| Timeout (AbortError) | ✅ Retry | Could be network hiccup |
| HTTP 400 (Bad Request) | ❌ Fail fast | Request error |
| HTTP 401, 403 | ❌ Fail fast | Auth misconfiguration |
| HTTP 404 | ❌ Fail fast | Resource doesn't exist |
| HTTP 500 | ✅ Retry | Potential transient |

---

## 5. Code That Can Be Reused (Per Story)

### DTS-22 (Grade Recording)

| Existing Asset | How Reused | Location (per audit) |
|---------------|-----------|----------------------|
| `requireRole('coordinador', 'admin', 'sysadmin')` middleware | Gate PUT /enrollments/:id/grade | `server/src/middleware/auth.ts` |
| `enrollments` table with `exam_status`, `exam_grade`, `graded_at`, `graded_by` columns | Direct column updates | Supabase (migration 001+) |
| `audit_log` insert pattern (if audit_log table exists) | Audit trail on grade write | Missing per audit (audit_log table exists, zero code writes) |
| Zod schema for grade validation (1-10, integer) | Request body validation | Pattern from existing routes |
| Existing enrollment fetch + ownership check | Load enrollment before grading | `routes/enrollments.ts` |

**Note**: Audit line 148 confirms `PUT /enrollments/:id/grade` already exists and works. Verify, add missing audit_log write, merge.

### DTS-23 (Moodle Sync)

| Existing Asset | How Reused | Location |
|---------------|-----------|----------|
| `moodle.service.ts` — `findMoodleUserByEmail()`, `getMoodleUserCourses()`, `getCourseCompletionStatus()` | Real Moodle API calls with retry+timeout. Directly used by sync route. | `server/src/services/moodle.service.ts` (Phase B) |
| `integration-logs.ts` — `logSyncStart()`, `logSyncComplete()`, `logPerStudent()` | Audit trail for sync session | `server/src/services/integration-logs.ts` |
| `certificates` table with upsert by `(student_id, course_id, provider)` | Idempotent certificate storage | Supabase |
| `students` table with `is_active` flag | Load active students for batch | Supabase |
| `courses` table with `moodle_course_id` | Map Moodle course → DTS course | Supabase |
| `ProviderRegistry` (currently bypassed by routes) | Resolve active provider | `server/src/providers/provider.registry.ts` |

**What needs new code**:
- Sync route refactor in `routes/integrations.ts`: POST handler calls real `moodle.service.ts` instead of local DB mock
- In-memory sync lock (module-level flag): ~10 lines
- Batch chunking loop (50 students/batch, sequential): ~30 lines
- Status polling endpoint GET /integrations/sync/:syncId/status: ~20 lines
- Per-student error handling in batch: ~15 lines
- `MOCK_MODE` env var for demo/debug fallback: ~10 lines

**Total estimated new code**: ~150 lines. Not the 400-line budget the impl plan forecast. Much of the "heavy lifting" (API calls, retry, timeout, logging) is already in moodle.service.ts.

### DTS-24 (Resilient Adapter)

| Existing Asset | How Reused |
|---------------|-----------|
| `AbortSignal.timeout()` — native, no library needed | Per-call timeout |
| `crypto.randomUUID()` — native, no library needed | (if needed for tracing) |
| None else | This is a pure utility. Zero app dependencies. |

**Code budget**: ~60 lines (retry function + config type + error classification). Test budget: ~12 test cases.

### DTS-25 (Guaraní Sync)

| Existing Asset | How Reused | Location |
|---------------|-----------|----------|
| `AcademicProvider` interface (`fetchStudents()`, `fetchStudent()`, `healthCheck()`) | Implemented by GuaraniAcademicProvider | `server/src/providers/academic/` |
| `integration-logs.ts` — log helpers | Same logging pattern as Moodle | `server/src/services/integration-logs.ts` |
| `students` table with UNIQUE(email), UNIQUE(dni) | UPSERT by email/DNI | Supabase |
| `withRetry()` from DTS-24 | Wrap provider calls | `server/src/services/retry-wrapper.ts` |
| Moodle sync route pattern (POST, conflict guard, status polling) | Pattern reuse — not code reuse. Same structure, different provider. | `routes/integrations.ts` |

**What needs new code**:
- `GuaraniAcademicProvider` implementation in `guarani.service.ts`: ~80 lines
- Sync route POST /integrations/sync/guarani: ~50 lines (mirrors Moodle pattern)
- Student dedup/upsert logic (email + DNI matching): ~30 lines
- `GUARANI_MOCK_MODE` toggle: ~10 lines

---

## 6. Integration Test Strategy

### Principle: Zero real external API calls in automated tests

All provider calls go through **injectable mock providers** with controlled fixture data. Tests assert:
1. System behavior (what happens when provider returns X)
2. Error handling (what happens when provider fails)
3. Idempotency (same input → same result)
4. Data integrity (what ends up in the database)

### 6.1 Provider Injection Pattern

```typescript
// Factory function for testability
function createMoodleSyncService(provider: CertificateProvider, db: SupabaseClient) {
  return {
    sync: async () => { /* uses provider.fetchCertificates() */ }
  };
}

// Production
const syncService = createMoodleSyncService(
  providerRegistry.getCertificateProvider(),
  supabaseAdmin
);

// Test
const mockProvider: CertificateProvider = {
  fetchCertificates: async (studentId) => fixtureForStudent(studentId),
  validateCertificate: async () => true,
  healthCheck: async () => ({ status: 'connected', latencyMs: 5, lastChecked: new Date().toISOString() }),
};
const testService = createMoodleSyncService(mockProvider, testDb);
```

### 6.2 Fixture Data Catalog

| Fixture | What it simulates |
|---------|-------------------|
| `fixture-empty` | Student has zero certificates in Moodle |
| `fixture-single` | Student has 1 certificate, 1 course mapped |
| `fixture-multi` | Student has 3 certificates, all courses mapped |
| `fixture-unmapped-course` | Student has certificate for a Moodle course with no matching DTS course_id |
| `fixture-partial-overlap` | 2 of 3 certificates already exist in DB (upsert test) |
| `fixture-healthy-provider` | healthCheck() returns connected in 10ms |
| `fixture-slow-provider` | Each call takes 500ms (batch performance test) |
| `fixture-flaky-provider` | Fails twice, succeeds on third call (retry test) |
| `fixture-dead-provider` | All calls throw after timeout |
| `fixture-auth-error` | Returns 401 on every call (non-retryable) |

### 6.3 Test Cases by Story

#### DTS-22 (Grade Recording)

Already covered per test-cases.md TC-003. Verify existing tests pass. Add:
- Re-grade (overwrite existing grade) → audit_log captures old + new values
- Concurrency: two simultaneous grades → last-write-wins (no optimistic lock for MVP)

#### DTS-24 (Resilient Adapter) — 12 test cases

```typescript
describe('withRetry', () => {
  // Happy path
  it('returns result on first success')                         // 1
  it('includes attempt=1 and duration in result')               // 2

  // Retry behavior
  it('retries on ECONNRESET and succeeds on attempt 2')         // 3
  it('retries on ETIMEDOUT and succeeds on attempt 3')          // 4
  it('retries on HTTP 503 and succeeds')                        // 5
  it('retries on HTTP 429 and succeeds')                        // 6
  it('respects backoff intervals (1s, 4s, 9s)')                 // 7
  it('throws after maxRetries exhausted')                       // 8
  it('includes total attempts in thrown error')                 // 9

  // Non-retryable errors
  it('does NOT retry on HTTP 400 — fails immediately')         // 10
  it('does NOT retry on HTTP 401 — fails immediately')         // 11
  it('does NOT retry on HTTP 404 — fails immediately')         // 12

  // Timeout
  it('aborts via AbortSignal after timeoutMs')                  // 13
  it('timeout is retried as transient error')                   // 14

  // Edge cases
  it('backoffMs shorter than maxRetries → repeats last value')  // 15
});
```

#### DTS-23 (Moodle Sync) — Integration tests

```typescript
describe('Moodle Batch Sync', () => {
  // Sync lifecycle
  it('POST /integrations/sync/moodle returns 202 with syncId')                    // 1
  it('GET /sync/:syncId/status returns processing during sync')                    // 2
  it('GET /sync/:syncId/status returns completed with counts after sync')          // 3

  // Batch processing
  it('processes 120 students in 3 batches of 50 → 30 → 20')                       // 4
  it('logs integration_logs: start row + per-student rows + complete row')        // 5

  // Certificate upsert
  it('INSERTs new certificates for first sync')                                    // 6
  it('UPDATEs existing certificates on re-sync (same composite key)')              // 7
  it('skips certificates with unmapped moodle_course_id (logs warning)')           // 8

  // Error isolation
  it('continues batch after one student fails (per-student isolation)')            // 9
  it('error_count in sync summary reflects failed students')                       // 10

  // Conflict guard
  it('returns 409 when sync already in progress')                                  // 11

  // Auth
  it('returns 401 without token')                                                  // 12
  it('returns 403 for estudiante role')                                            // 13

  // Provider integration
  it('calls moodleProvider.fetchCertificates(studentId) per student')              // 14
  it('uses mock provider when MOCK_MODE=true (demo fallback)')                     // 15
});
```

#### DTS-25 (Guaraní Sync) — Mirror of Moodle pattern

Same structure, different provider interface. Key differences:
- Uses `fetchStudents()` (returns Student[]) instead of `fetchCertificates(studentId)` (per-student)
- UPSERTs to `students` table by email/DNI instead of `certificates` table
- No batch-per-student pattern; single provider call returns all students

### 6.4 Test Infrastructure

| Layer | Tool | Use |
|-------|------|-----|
| Unit (DTS-24 retry wrapper) | Bun test | Pure function, no DB, no network |
| Unit (DTS-22 grade logic) | Bun test | Mock Supabase client, assert status transitions |
| Integration (DTS-23, DTS-25 sync) | Bun test + Supabase test DB | Real DB with fixtures, mock providers, isolate per test |
| E2E (full sync pipeline) | Playwright | Smoke test: trigger sync via UI, poll status, verify data appears |

All tests run in CI (GitHub Actions) with `MOCK_MODE=true` and no external API calls.

---

## 7. Architecture Decisions Summary

| Decision | Recommendation | Rationale |
|----------|---------------|-----------|
| DTS-24 as decorator or baked in? | **Decorator** — standalone `withRetry<T>()` | Zero duplication, one test suite, new providers get resilience free. Business-data-map §6.4 explicitly specifies this pattern. |
| DTS-23 and DTS-25 build order? | **DTS-24 first**, then DTS-23, then DTS-25 | DTS-24 enables both. DTS-23 is more critical (certificates are the core domain object). DTS-25 can be built in parallel if team capacity allows. |
| MOCK_MODE for prod safety? | **Yes** — env var `MOCK_MODE` with default `true` until admin token confirmed | Prevents accidental 500s in production when external API is unreachable. Degrades gracefully to cached local data. |
| Provider abstraction enforcement? | **Wire ProviderRegistry to routes** — currently bypassed | Routes calling services directly means provider switching requires route edits. Registry should be the single resolution point. Fix in DTS-23. |
| Sync: sync or async? | **Async** — return 202 immediately | Per AC. In-memory lock. No queue infrastructure needed for MVP (<10K students). |

---

## 8. External Blockers — Action Required

| Blocker | Owner | Impact | Deadline |
|---------|-------|--------|----------|
| **Moodle admin-level API token** | UNC DTI | System-wide sync (DTS-23) blocked. Only single-user demo possible. | Sprint N+1 |
| **`mod_customcert_get_issues` exposed in Moodle** | UNC Moodle admin | Certificate fidelity. Currently using completion status proxy (false positives possible). | Post-MVP |
| **Guaraní SIU credentials + API docs** | UNC DTI | Student sync (DTS-25) remains fixture-driven. No real student import. | Post-MVP / Sprint N+2 |
| **Course completion criteria configured on Moodle** | UNC course coordinators | `core_completion_get_course_completion_status` returns `nocriteriaset` for courses without criteria. Sync fails silently for those courses. | Sprint N+1 |

**These are NOT architecture problems**. They are external integration preconditions. The architecture handles them correctly: provider abstraction means the system is ready for real data the moment credentials arrive. Until then, MOCK_MODE provides graceful degradation.

---

## 9. Effort Recalibration

Based on cross-repo audit findings:

| Story | Original SP | Adjusted SP | Reason |
|-------|------------|-------------|--------|
| DTS-22 (Grade Recording) | 5 | **0** | Already implemented per audit (line 148). Verify + merge. |
| DTS-23 (Moodle Sync) | 8 | **5** | moodle.service.ts already has real API calls, retry, timeout (Phase B). Remaining work: sync route wiring, batch loop, conflict guard, status polling. ~150 lines. |
| DTS-24 (Resilient Adapter) | 5 | **3** | Pure utility, zero dependencies. 60 lines + 15 tests. Existing inline retry in moodle.service.ts reduces urgency but extraction adds value for Guaraní + future providers. |
| DTS-25 (Guaraní Sync) | 8 | **5** | Fixture-driven (no real API available). Reuses sync pattern, retry wrapper, integration-logs. New code: provider implementation + sync route. ~170 lines. |
| **Total** | **26** | **13** | |

**MVP Must-Have adjusted total**: 90 + 13 = 103 SP delivered (89% complete).

If DTS-INT-5 is reclassified as Should Have (per epic tree), Must-Have remainder drops to 0 + 3 + 5 = **8 SP** (93% complete).

---

> *Analysis generated from sprint progress report, Moodle UNC integration audit (commit `da2a8c5`), business data map, per-story specs, and implementation plans. Cross-repo validation: `nelgoez/diploma-tracking-sys` (code) and `nelgoez/agentic-diplo-track-sys` (planning).*
