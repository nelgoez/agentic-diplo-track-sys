# QA Coverage Plan — Remaining MVP Stories

> **Role**: QA Engineering Lead
> **Date**: 2026-06-01
> **Baseline**: 82 tests (42 API, 23 rule-engine, 17 E2E)
> **Target**: 132 tests after remaining stories (+50 tests)

---

## New Test Count by Story

| Story | New API Tests | New Unit Tests | New E2E Tests | **Total New** |
|-------|:---:|:---:|:---:|:---:|
| DTS-22 (Grade Recording) | 15 | 5 (audit) | 4 | **+24** |
| DTS-24 (Resilient Adapter) | 4 (integration) | 14 | 0 | **+18** |
| DTS-23 (Moodle Post-sync) | 12 | 6 (DB verify) | 3 | **+21** |
| DTS-25 (Guaraní Sync) | 7 | 0 | 0 | **+7** |
| Contract tests | 4 | — | — | **+4** |

**Projection**: 82 → ~156 tests

---

## DTS-22 — Grade Recording Tests

### API Tests (15)

| # | Scenario | Expected |
|:--:|----------|----------|
| 1 | PUT grade=7 on inscripto | 200, exam_status=aprobado |
| 2 | PUT grade=4 on inscripto | 200, aprobado |
| 3 | PUT grade=3 on inscripto | 200, desaprobado |
| 4 | PUT grade=1 on inscripto | 200, desaprobado |
| 5 | PUT grade=10 on inscripto | 200, aprobado |
| 6 | PUT grade=0 | 400, out of range |
| 7 | PUT grade=11 | 400, out of range |
| 8 | PUT grade=-1 | 400, out of range |
| 9 | PUT grade=5.5 | 400, must be integer |
| 10 | PUT on already aprobado | 400, not inscripto |
| 11 | PUT on already desaprobado | 400, not inscripto |
| 12 | PUT on non-existent enrollment | 404 |
| 13 | PUT as estudiante | 403 |
| 14 | PUT without auth | 401 |
| 15 | Re-grade (overwrite) | 200, audit_log new entry |

### E2E Tests (4)

| # | Scenario |
|:--:|----------|
| E1 | Coordinator opens grading modal, enters grade 7 → success |
| E2 | UI shows error for grade 11 |
| E3 | UI prevents grading non-inscripto enrollment |
| E4 | Student sees graded status in exam history |

---

## DTS-24 — Resilient Adapter Tests

### Unit Tests (14)

| # | Scenario |
|:--:|----------|
| 1 | Success on first attempt (attempts=1) |
| 2 | Success on 2nd attempt (1 failure, backoff ~1s) |
| 3 | Success on 3rd attempt (2 failures, backoff ~5s total) |
| 4 | All retries exhausted → throws |
| 5 | 5xx error → retried |
| 6 | 429 rate limit → retried |
| 7 | 400 bad request → NOT retried |
| 8 | 401 unauthorized → NOT retried |
| 9 | 403 forbidden → NOT retried |
| 10 | 404 not found → NOT retried |
| 11 | Network error → retried |
| 12 | Timeout exceeded → retried |
| 13 | Custom backoff array respected |
| 14 | Per-student isolation (1 fails, 4 succeed in batch of 5) |

---

## DTS-23 — Moodle Post-Sync Tests

### API Tests (12)

Focus on conflict guard + eligibility re-evaluation (backend sync already complete)

| # | Scenario |
|:--:|----------|
| 1 | POST /integrations/sync/moodle as admin → 202 + syncId |
| 2 | POST without auth → 401 |
| 3 | POST as estudiante → 403 |
| 4 | POST while sync running → 409 conflict |
| 5 | GET /integrations/sync/:id/status for in-progress → 200 + status |
| 6 | GET /integrations/sync/:id/status for completed → 200 + completed |
| 7 | GET unknown syncId → 404 |
| 8 | Post-sync: new certificate creates eligibility notification |
| 9 | Post-sync: eligibility re-evaluated for affected students |
| 10 | integration_logs has sync_start entry |
| 11 | integration_logs has per-student entries |
| 12 | integration_logs has sync_complete with counts |

---

## Mock Provider Strategy

All sync tests use injectable mock providers — zero real API calls in CI.

```
MockMoodleProvider implements CertificateProvider
MockGuaraniProvider implements AcademicProvider

Tests inject → ProviderRegistry → Service uses mock
No env check. No tokens. No network.
```

---

## CI/CD Impact

| Workflow | Change |
|----------|--------|
| CI | Add retry-wrapper.test.ts to unit suite |
| Smoke | Add 5 sync smoke tests with mock providers |
| Regression | Add full grade + sync block |
| UX-Guard | Add 7 new E2E scenarios |
