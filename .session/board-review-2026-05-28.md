# Board Review — Diploma Tracking System

**Date**: 2026-05-28 | **Reviewer Roles**: PO, EM, QA Lead | **Audience**: Nahuel (CEO/VP Owner + QA Manager)

---

## Executive Summary

**MVP at 47%** (51 SP delivered of 108 Must-Have). Three critical blockers emerged:

1. **🔴 Grade recording is broken** — marks wrong DB column, has no inscripto gate, fails silently on grades <4. Zero tests. QA Lead confirms 3 distinct bugs.
2. **🔴 enrollments RLS policy is `USING(true)`** — any authenticated user can INSERT/UPDATE/DELETE any enrollment. Defeats row-level security.
3. **🔴 Phase 5 is a desert** — 30 SP of sync + admin work entirely unrefined. Moodle sync is a stub that reads local DB in a circle. No real integration exists.

On the positive side: Rule engine is solid (99% branch coverage, 23 tests). Auth system is clean. Provider abstraction is well-designed.

---

## Product Health (PO)

**Feature completeness**: Phase 1 (100%), Phase 3 (100%), Phase 4 (~60% with bugs), Phase 2 (~40% with critical mutation gaps), Phase 5 (~15% stub only).

**Critical gaps**:

- Tracks + Courses have zero write endpoints — admins cannot configure the system
- Batch enrollment (DTS-CORE-6) missing entirely
- 16 of 24 planned stories have zero PBI tracking (no spec, no AC, no edge cases)

**Backlog health**: DTS-EXAM-3 is the only story with proper spec+impl-plan+in-progress status. Every other remaining story needs refinement before dev can start.

**MVP trajectory**: Running ~1 sprint ahead on phases 1-3, but Phase 5 (heaviest, 30 SP) is a desert. At current velocity (~13 SP/sprint), MVP target is 9 more weeks. Phase 5 alone will take 2-3 sprints once refined.

**VP Gate**: Do we authorize a sprint to close Phase 2 mutation gaps (CORE-1/2/6) before Phase 5 sync work, or run both in parallel?

---

## Engineering Health (EM)

**Architecture**: Route/service separation is reasonable but eroding — raw Supabase queries live in all 9 route files. Only 4 of 13 domains have service files. Provider abstraction wired but **never consumed** — routes import Moodle/Guarani services directly.

**Code quality**: No explicit `any` usage. Multiple `as never` casts to bypass Supabase type narrowing. Eligibility query setup duplicated 4x across 3 files. `logId` parameter unused in `logSyncComplete` causing orphaned log entries.

**Tech debt**:

- Moodle sync reads local DB in a circle (never calls external API)
- No write endpoints for Tracks or Courses (read-only domain)
- Admin dashboard has hardcoded `0` values with TODO comments
- `POST /integrations/sync/seed` fabricates fake data at runtime — should be a CLI seed script
- `audit_log` table exists with triggers but zero code writes to it

**Security**: Student endpoints (`/:id`, `/:id/progress`, `/:id/certificates`) lack ownership validation — any authenticated user can read any student's data. GDPR-equivalent risk (Ley 25.326).

**Delivery pipeline**: Typecheck green, 23 unit tests green. **No CI/CD pipeline**. No integration or E2E tests. No lint script in server package.json.

**VP Gate**: Moodle integration depends on UNC credentials. Do we have the actual Moodle API docs/credentials, or is this a vendor coordination blocker?

---

## Quality Health (QA Lead)

**API**: Staging alive (`/health` returns 200). Auth wall active on all `/api/v1/*` routes (401 without token). Vercel routing potential issue: `/api/v1/health` returns 404 while `/health` works.

**Bugs found**:
| ID | Bug | Severity |
|----|-----|----------|
| B1 | Grade recording writes `status='completed'` instead of `exam_status='aprobado'` | 🔴 Critical |
| B2 | Grade recording has no inscripto gate — can grade any enrollment | 🔴 Critical |
| B3 | Grade <4 leaves no trace (no exam_status update) | 🔴 Critical |
| B4 | Exam history sorts by `created_at` not `exam_date` | 🟡 Medium |
| B5 | Exam history returns all enrollments (no exam_status filter) | 🟡 Medium |
| B6 | Admin stats returns hardcoded zeros for avg_progress, at_risk | 🟡 Medium |

**RLS**: `enrollments` table has `USING(true)` for ALL operations — any authenticated user can INSERT/UPDATE/DELETE any enrollment. Supabase advisory confirmed.

**Test coverage**: 23 tests, all in rule-engine.test.ts. **Zero route-level tests** across 9 route files. Grade recording, exam registration, auth flow — all untested.

**Data**: 3 students, 1 track, 4 courses, 4 enrollments (all with exam_status=null), 1 certificate. Seed data clean, no FK violations.

**VP Gate**: Do we pause Phase 4 graduation and fix the grade recording bugs + enrollments RLS first, or continue feature work in parallel?

---

## Risk Matrix

| ID  | Risk                                                            | Domain | Severity    |
| --- | --------------------------------------------------------------- | ------ | ----------- |
| R1  | Grade recording writes wrong DB column                          | QA/EM  | 🔴 Critical |
| R2  | Grade recording has no inscripto gate                           | QA     | 🔴 Critical |
| R3  | enrollments RLS policy `USING(true)`                            | QA     | 🔴 Critical |
| R4  | Phase 5 entirely unrefined (30 SP desert)                       | PO     | 🔴 Critical |
| R5  | Phase 2 mutation gap — no track/course writes                   | PO/EM  | 🔴 Critical |
| R6  | Zero route-level tests (9 files untested)                       | QA     | 🔴 Critical |
| R7  | Moodle sync is stub (reads local DB, not API)                   | EM     | 🔴 Critical |
| R8  | Student data isolation broken (any auth user reads any student) | EM     | 🟡 High     |
| R9  | No PBI tracking for 16 of 24 planned stories                    | PO     | 🟡 High     |
| R10 | Batch enrollment missing (DTS-CORE-6)                           | PO/QA  | 🟡 High     |
| R11 | No CI/CD pipeline                                               | EM     | 🟡 Medium   |
| R12 | Admin stats hardcoded zeros                                     | QA/EM  | 🟡 Medium   |
| R13 | Exam history wrong sort + no filter                             | QA     | 🟡 Medium   |
| R14 | Provider registry is dead code                                  | EM     | 🟢 Low      |
| R15 | No audit logging despite audit_log table existing               | EM     | 🟢 Low      |

---

## VP/CEO Decision Gates

1. **Phase 2 mutation gap** — Do we authorize a dedicated sprint to close CORE-1/CORE-2/CORE-6 before Phase 5, or run both in parallel?

2. **Grade recording fix priority** — Stop feature work to fix the 3 critical bugs + enrollments RLS immediately, or fix in parallel with Phase 5?

3. **Moodle integration** — Do we have UNC's Moodle API credentials/docs, or is this a vendor coordination dependency blocking Phase 5?

4. **Student data isolation** — Should students see only their own data (strict ownership middleware), or do coordinators need cross-student access?

5. **Seed data strategy** — Remove `POST /integrations/sync/seed` from the API and build a proper `bun run seed` CLI script?

6. **Guaraní classification** — Master plan says Should Have. Is Guaraní sync truly "should" for MVP, or does UNC Secretaría Académica expect padrones automated at launch?

---

## Cross-Role Consensus

All three roles agree on immediate priorities:

1. Fix EXAM-4 grade recording bugs (before any coordinator uses it)
2. Fix enrollments RLS policy (security blocker)
3. Close Phase 2 write endpoints for tracks/courses (operational blocker)
4. Start Phase 5 spec writing (30 SP of unrefined work)

**Disagreement**: None. All roles independently flagged the same critical issues.

---

> _Generated by project-board-review skill. Re-run after each phase completion for incremental board reviews._
