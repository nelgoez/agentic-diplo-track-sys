# Test Cases — Diploma Tracking System

> Documented: 2026-05-30 · Format: test-documentation skill output
> To sync to Jira: use /test-documentation or manual import
> ROI Priority: critical > high > medium > low

## TC-001: Auth Flow — Login, Refresh, RBAC

| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Type** | API · Functional |
| **Layer** | API |
| **Preconditions** | Server running, 4 roles configured, JWT_SECRET set |

**Test Steps**:
1. `POST /auth/login` valid estudiante → 200 + access_token + refresh_token + user
2. `POST /auth/login` wrong password → 401
3. `POST /auth/login` empty body → 400
4. `GET /auth/me` valid token → 200 + email + role
5. `GET /auth/me` expired token → 401
6. `POST /auth/refresh` valid refresh_token → 200 + new pair
7. `GET /admin/dashboard-stats` as estudiante → 403 (RBAC gate)
8. `GET /admin/dashboard-stats` as admin → 200

**Automated**: smoke.test.ts (8 tests) + exploratory.test.ts (7 auth tests)
**Coverage**: ✅ 15/15 scenarios covered

---

## TC-002: Student Progress + Eligibility Evaluation

| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Type** | API · Functional · Integration |
| **Layer** | API + Rule Engine |
| **Preconditions** | Seed data: track DIP-CD-2025, 6 courses, 5 students, ALL rule |

**Test Steps**:
1. Login as nahuelgomez (3/5 certs) → GET progress → courses_completed=3, total=5
2. GET eligibility → eligible=false, missing_prerequisites listed
3. Add 2 more certs (5/5) → eligibility → eligible=true
4. Login as other student (0 certs) → eligibility → eligible=false
5. Login as admin → dashboard-stats → eligible_count reflects state

**Automated**: integration.test.ts (Flow 1, 2) + exploratory.test.ts (Performance section)
**Coverage**: ✅ Multiple states tested

---

## TC-003: Grade Recording + Auto Diploma Push

| Field | Value |
|-------|-------|
| **Priority** | High |
| **Type** | API · Integration · Event |
| **Layer** | API + Guarani Service |
| **Preconditions** | Student enrolled, exam_status=inscripto |

**Test Steps**:
1. `PUT /enrollments/:id/grade` with grade 8 → 200, exam_status=aprobado
2. Verify audit_log entry created (action=grade_recorded)
3. Verify integration_logs entry (diploma push triggered)
4. Verify enrollment.exam_status=diploma_pendiente (set by pushDiploma)
5. `PUT /enrollments/:id/grade` with grade 3 → 200, exam_status=desaprobado
6. `PUT /enrollments/:id/grade` with exam_status=aprobado (not inscripto) → error
7. `PUT /enrollments/:id/grade` with grade 11 → 400 (out of range)

**Automated**: integration.test.ts (grade recording path) + audit_log verification
**Coverage**: ✅ Happy path + error paths

---

## TC-004: Integration Sync — Moodle + Guaraní

| Field | Value |
|-------|-------|
| **Priority** | High |
| **Type** | API · Integration |
| **Layer** | API + External APIs |
| **Preconditions** | MOCK_MODE=true, seed data loaded |

**Test Steps**:
1. `POST /integrations/sync/moodle` as admin → 200 + synced count
2. `POST /integrations/sync/guarani` as admin → 200 + student count
3. `GET /integrations/status` → both providers "connected" in mock mode
4. `GET /integrations/logs` → recent sync entries visible
5. `POST /integrations/sync/moodle` as estudiante → 403
6. Verify integration_logs table has start/end entries with logId continuity

**Automated**: integration.test.ts (Flow 6) + exploratory.test.ts (Integration sync section)
**Coverage**: ✅ Happy path + RBAC

---

## TC-005: Rule Engine — ALL/ANY Recursive Evaluation

| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Type** | Unit · Logic |
| **Layer** | Service |
| **Preconditions** | Rule engine DI-compatible, test data with various tree shapes |

**Test Steps**:
1. ALL rule with all children satisfied → eligible=true
2. ALL rule with one child failing → eligible=false
3. ANY rule with one child satisfied → eligible=true
4. ANY rule with all children failing → eligible=false
5. Nested ALL(ANY(x,y), ALL(z)) → correct evaluation
6. Active override on a failing rule → eligible=true (override bypasses rule)
7. Expired override → eligible=false (override ignored)
8. No rules configured → eligible=true (default)
9. Deep nesting 4+ levels → correct evaluation, <500ms
10. Empty sources → eligible=true (vacuously true)

**Automated**: rule-engine.test.ts (23 tests, 99% branch coverage)
**Coverage**: ✅ All scenarios

---

## TC-006: Student Data Isolation

| Field | Value |
|-------|-------|
| **Priority** | High |
| **Type** | API · Security |
| **Layer** | API + RLS |
| **Preconditions** | Multiple students seeded |

**Test Steps**:
1. Login as student A, GET /students/:A_id → 200
2. Login as student A, GET /students/:B_id → 403
3. Login as student A, GET /students/:B_id/progress → 403
4. Login as student A, GET /students/:B_id/certificates → 403
5. Login as student A, POST /tracks → 403 (no write access)
6. Login as student A, POST /courses → 403
7. Login as student A, POST /admin/users → 403

**Automated**: smoke.test.ts (RBAC) + exploratory.test.ts (Student isolation section)
**Coverage**: ✅ All scenarios

---

## ROI Summary

| TC | Priority | Automation | Manual Effort | ROI Score |
|----|----------|------------|---------------|-----------|
| TC-001 Auth Flow | Critical | ✅ 15 tests | 0h | High |
| TC-002 Progress/Eligibility | Critical | ✅ Integration | 0h | High |
| TC-003 Grade Recording | High | ✅ Integration + Audit | 0h | High |
| TC-004 Integration Sync | High | ✅ Integration | 0h | High |
| TC-005 Rule Engine | Critical | ✅ 23 unit tests | 0h | High |
| TC-006 Data Isolation | High | ✅ Exploratory | 0h | High |

**Verdict**: All 6 test cases are **Automated** — zero manual execution needed.

> To sync to Jira: run `/test-documentation` with active Jira MCP connection.
