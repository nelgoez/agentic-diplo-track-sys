# Session Handoff — 2026-08-10 (resume: next session)

> **Purpose**: Fresh-session recovery doc. Everything from this session, all findings, all pending work.

---

## 1. What got done this session — QA Infrastructure Buildout

All work was in the `agentic-diplo-track-sys` (QA/testing) repo. Zero changes to `diploma-tracking-sys` backend logic.

### 1.1 CI Pipeline Fixes (commits `7cbd9cf`, `530ef8a`)

- Fixed `planning-ci.yml` — 3 pipeline failures resolved:
  - `skills:registry` — skip-missing flag for absent skill files
  - `a11y` — browser installation for Playwright
  - `bun:test` — protocol fix for Bun test runner in CI
- Planning CI now fully green across all jobs.
- Added `graphify-out/` to `.prettierignore` (commit `e5b8b39`).

### 1.2 KATA Framework Alignment (commits `46338d4`, `f26e3ae`)

**Tuple return pattern** — all 8 API components refactored to `[data, error]` pattern:
- `tests/components/api/`: AdminApi, AuthApi, CertificateApi, CourseApi, EnrollmentApi, RuleApi, StudentApi, TrackApi

**Steps layer** — reusable test setup patterns:
- `tests/components/steps/SetupSteps.ts` (66 lines) — seed, auth, cleanup

**kata-manifest.json** — generated coverage map (247 lines):
- `kata-manifest.json` — tracks test→story mapping
- `scripts/kata-manifest.ts` (207 lines) — manifest generator

**TMS sync** — `scripts/tms-sync.ts` (151 lines) — syncs test results to TMS

**DB trifuerza** — `tests/integration/db-trifuerza.test.ts` (53 lines)

**All integration tests updated** to use tuple-return pattern:
- `admin-crud.test.ts`, `admin-flow.test.ts`, `api-health.test.ts`
- `auth-flow.test.ts`, `certificate-sync.test.ts`, `exam-enrollment.test.ts`
- `student-flow.test.ts`

**Retries=0** set for kata tests.

**Test files reorganized**: E2E moved from `tests/e2e/` to `tests/integration/`.

### 1.3 Report Pipeline + Playwright Optimization (commit `2cb28ec`)

**Report generators**:
- `scripts/report/buildTrackAuditData.ts` (105 lines)
- `scripts/report/generateTrackAuditHtml.ts` (168 lines)
- `scripts/report/generateTrackAuditMd.ts` (53 lines)
- `scripts/report/saveReport.ts` (65 lines)
- `scripts/report/index.ts` (orchestrator)

**LoginPage POM**: `tests/components/ui/LoginPage.ts` (34 lines)

**Test tags** added to all integration tests.

### 1.4 Moodle Provider WS Client (commit `c488787`)

- `packages/dts-test-kit/src/MoodleWsClient.ts` (192 lines) — real Moodle REST API client
- `MoodleMockFactory` — mock for testing without real Moodle
- `tests/integration/moodle-provider.test.ts` (121 lines) — contract tests

### 1.5 Guaraní Mock Infrastructure (commit `9a2b88a`)

**Standalone mock server**: `packages/guarani-mock/`
- Bun HTTP server on port 8090
- Bearer token auth (`GUARANI_MOCK_TOKEN`)
- Configurable error rate (`GUARANI_MOCK_ERROR_RATE`) + latency
- 5 REST endpoints mimicking real Guaraní WS

**DataFactory**: `tests/data/DataFactory.ts` (97 lines)

**Fixtures** (3 JSON files):
- `padron-alumno.json` — 5 students (García, Rodríguez, Fernández, Martínez, López)
- `historia-academica.json` — 6 activities (4 approved, 2 in-progress)
- `carreras.json` — 2 diploma tracks (CD, DW) with 8 courses each

**ES→EN mapper**: `packages/guarani-mock/src/mappers/es-to-en.ts` (80 lines)
- `mapAlumnoToStudent`, `mapMateriaToCertificate`, `mapCarreraToTrack`, `mapEstadoToEnrollmentStatus`

**Integration tests**: `tests/integration/guarani-mock.test.ts` (67 lines, 8 test cases)

**Seed script**: `scripts/seed-guarani-fixtures.ts` (50 lines)

### 1.6 Cross-Repo Sync (commits `7a29509`, `f5d39c8`)

- `portfolio.json` added to both repos for cross-repo coordination

---

## 2. Pending Work (NOT done this session — carry forward)

### 2.1 Guaraní Mock Integration Gaps

The standalone mock server (`packages/guarani-mock/`) is a testing tool. It is **NOT integrated** with the main `diploma-tracking-sys` backend's `guarani.service.ts`. The backend still uses its own inline mock logic. Key gaps:

- `guarani.service.ts` (390 lines) has **zero unit test coverage**
- `pushDiploma()` still has `"Mock push — real Guaraní API pending DTI credentials"` note — UNC confirmed no real API will be provided
- Env var inconsistency: code uses `GUARANI_TOKEN`/`GUARANI_URL`, `.env.example` uses `GUARANI_API_TOKEN`/`GUARANI_API_URL`
- `syncStudents()` upsert uses `onConflict: 'email'` but SRS spec says match by `guarani_id`
- Mock fixture data in `mock-data.ts` (5 students) differs from standalone mock server fixtures (different names, different data)

### 2.2 Post-MVP Gaps in `diploma-tracking-sys`

- **DTS-63** — QR code generation for diploma PDFs (zero code exists)
- **6 orphaned Jira epics** — all children Done, epics still "To Do":
  - DTS-58 (Verification Portal, 4/4), DTS-57 (PDF Diploma, 3/3)
  - DTS-42 (QA Credentials, 2/2), DTS-59 (Analytics, 3/3)
  - DTS-60 (E2E Suite, 10/10), DTS-66 (UI/UX, 6/6)
- **Override expiry cron** — logic exists, no scheduled trigger
- **`docs/api-spec.yaml`** — needs completeness audit for post-MVP endpoints

---

## 3. Jira State

- DTS-98 epic: Done (all 5 stories closed in prior session)
- DTS-105: Done (dts-test-kit package)
- All Guaraní tickets (DTS-8/25/120/121/122/123): Done
- All notification tickets (DTS-92/93/94): Done
- DTS-95 (override expiry): Done
- **6 epics stuck in "To Do" with all children Done** (§2.2 above)

---

## 4. Connection/Network Note (STILL ACTIVE)

- Windows Schannel TLS revocation bug: `curl`/`webfetch` to vercel/github fail without `--ssl-no-revoke`
- `git`/`gh`/`vercel` CLI work natively. Google works.
- Use `curl --ssl-no-revoke` for all HTTPS checks.

---

## 5. Git State (end of session)

**`agentic-diplo-track-sys`**:
- Branch `staging` at commit `9a2b88a` (7 commits this session)
- Unpushed: ALL 7 commits still on `staging` only (pre-approved push next session)

**`diploma-tracking-sys`**:
- Branch `staging` at commit `f5d39c8` (portfolio.json)
- `main` at `c276d0f` (production, verified green)
- 1 commit ahead of main: `f5d39c8` (portfolio.json)

---

## 6. Creds / Quick-Start

- App repo: `cd D:\Nahuel\Proyectos\UPEX\diploma-tracking-sys` (branch `staging`)
- Meta repo: `cd D:\Nahuel\Proyectos\UPEX\agentic-diplo-track-sys`
- Supabase: `https://vbjhxlezqhkmhpuypkvf.supabase.co`
- Admin: `admin@dts.unc.edu.ar` / `Admin123456!`
- Student: `nahuelgomez.cti@gmail.com` / `Test123456!`
- Local server: `cd server && bun run src/index.ts`
- E2E: `cd client && bun playwright test tests/e2e/ux-smoke.spec.ts`
- Prod: server `https://server-git-main-nelgoezs-projects.vercel.app`, client `https://nelgoez-diploma-tracking-sys.vercel.app`

---

## 7. Next Session Plan

1. Close 6 orphaned Jira epics (admin-only)
2. Guaraní mock hardening (tests, data enrichment, pushDiploma, env fixes)
3. DTS-63 QR codes
4. Override expiry cron trigger
5. Final cleanup + green CI

---

> *Session 2026-08-10: QA infrastructure buildout — KATA alignment, report pipeline, Moodle WS client, Guaraní mock server. Handoff reconstructed from git log (predecessor never wrote it).*
