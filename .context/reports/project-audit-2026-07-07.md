# Project Audit — 2026-07-07

> Cross-project audit of DTS, bunkai-qa-engineering, and agentic-diplo-track-sys.
> Captures recent changes for profile-aware handoff.

---

## 1. DTS (`diploma-tracking-sys`) — Recent Changes

### 1.1 Demo access — one-click prod login
- `POST /auth/demo` endpoint + "Demo Access — Explore the System" button (`LoginPage.tsx`)
- Mock data with anonymized DNI — no Supabase account needed
- Demo banner on dashboard (`DashboardPage.tsx`)
- **URL**: `https://diplomatrackingsystem.qzz.io/`

### 1.2 Testing tools

| Feature | Commit | Status |
|---------|--------|--------|
| Allure reporter + CI artifact upload | `09cfd23` (DTS-104) | Done |
| a11y testing with `@axe-core/playwright` | `09cfd23` (DTS-104) | Done |
| Playwright E2E audit — auth fixture, tags, config | `7fc74b5` (DTS-97) | Done |
| Web-first assertion cleanup | `8a7f094`, `4ee3354`, `ca5b9d5` | Done |
| PDF diploma generation | `79ee029` | Done |
| Allure CI fix (`bunx allure` not `allure`) | `2f6daa5` | Done |

### 1.3 Allure reports — LIVE on GitHub Pages ✅

**Done 2026-07-07**:

| Change | Detail |
|--------|--------|
| `smoke.yml` | Added `allure-report` job — deploys to `staging/smoke` |
| `prod-validate.yml` | Added `allure-report` job — deploys to `production/smoke` |
| Root index.html | Generated inline in workflow (no file dependency) |
| GitHub Pages | Enabled (`build_type: workflow`) |
| Repo visibility | Public |

**Fix round (2026-07-07 v2)**:
- Root index generated inline via `_root/index.html` step (was referencing `gh-pages-root/` from main branch which isn't checked out in the allure-report job)
- `LoginPage.tsx`: `api.post` → `api.postPublic` for demo endpoint (TS2554 fix)

**URLs**:
- Staging smoke: `https://nelgoez.github.io/diploma-tracking-sys/staging/smoke/`
- Production smoke: `https://nelgoez.github.io/diploma-tracking-sys/production/smoke/`
- Root: `https://nelgoez.github.io/diploma-tracking-sys/`

### 1.4 Other notable changes
- GradeExamModal for coordinator grading (DTS-90)
- Sync conflict guard with TTL + status (DTS-88)
- `withRetry` adapter for Moodle fetch (DTS-87)
- Student data isolation fix in progress endpoint
- RBAC on IntegrationsPage
- 30+ commits in recent history

---

## 2. `agentic-diplo-track-sys` — DTS-98 Alignment Plan

### 2.1 Alignment plan
Commit `c03b9de` — 24 files, 759 insertions. File: `.context/reports/alignment-remediation-plan-2026-07-07.md`

4-sprint plan; Sprint A shipped:

| Gap | Sprint | Status | Delivered |
|-----|--------|--------|-----------|
| Allure reports | A | DONE | `allure.ts`, `allure-bridge.ts`, CI wiring |
| Xray integration | B | DEFERRED | Skill placeholder only. Intentionally left for emergency 30-day free tier if academy mandates Xray — not a current priority. |
| Production smoke (IQL Step 11) | C | DONE | `production-smoke.test.ts`, IQL ref doc |
| a11y testing | D | DONE | `a11y.ts` + `a11y-smoke.test.ts` |
| VCR framework | D | DONE | Reference doc placeholder |

Also shipped: `generate-traceability.ts`, `spec-compliance-matrix.md`, `planning-ci.yml`.

**Graphify**: Alignment plan is graph node (community 162). Run `graphify query "alignment-remediation-plan"`.

### 2.2 KATA test framework
- `packages/dts-test-kit/` — shared test utilities
- API ATC components + integration tests for all domain entities
- E2E skeletons + UiBase + script unit tests

### 2.3 Other
- Full backlog sync — PBI docs, epics, stories, skills (`61baa60`)
- Boilerplate sync to v7.0 (`84d850c`)
- Staging pipeline formalized (branch + CI/CD + domain setup)

---

## 3. `bunkai-qa-engineering` — Test Suite Growth

### 3.1 New tests

| Ticket | Scope | Tests |
|--------|-------|-------|
| BK-166 | Auth sign-in API | 8 sandbox |
| BK-4/BK-8 | Workspace + Project CRUD | 8 sandbox |
| BK-14 | User Story CRUD | 5 sandbox |
| BK-17 | Jira Import API | 6 sandbox |
| BK-18 | ATC API | 12 + CI wiring |
| BK-150 | 403 scope → integration | — |

Plus: `jira-attach-evidence` script, `test:sandbox` CI script, `test:env:check` validation.

### 3.2 Allure reports — LIVE on GitHub Pages

| Report | URL |
|--------|-----|
| Smoke | `https://nelgoez.github.io/bunkai-qa-engineering/staging/smoke/` |
| Sanity | `https://nelgoez.github.io/bunkai-qa-engineering/staging/sanity/` |
| Regression | `https://nelgoez.github.io/bunkai-qa-engineering/staging/regression/` |

**Architecture per workflow**: Two jobs — (1) test execution uploads `allure-results/` as artifact, (2) `allure-report` checks out `gh-pages` history, builds HTML via `simple-elf/allure-report-action`, deploys via `peaceiris/actions-gh-pages`.

### 3.3 Other
- `STAGING_USER_READONLY_PAT` added to variable manifest
- Login endpoint fixed: `/auth/login` → `/auth/signin`

---

## 4. Portfolio READMEs

`diploma-tracking-sys` was missing a curated README in `career-profile-up/.context/portfolio/repo-readmes/` — created 2026-07-07. The other two (`bunkai-qa-engineering`, `agentic-diplo-track-sys`) already had one.

---

## 5. Profile Update Candidates (for next session on career-profile-up)

### 5.1 `timeline.tsx` experience section
Current items at lines 19-23. Consider expanding to reflect:
- Allure CI reports + GitHub Pages for bunkai
- a11y testing foundation
- Production smoke gates + demo mode for DTS
- Traceability matrix generator
- KATA API ATC component architecture

### 5.2 QA section (`messages/en.json:83-104`)
Testability Scorecard covers DTS layers (UI/API/DB/CI-CD). Consider adding a11y layer and noting Allure reports + demo mode.

### 5.3 Allure screenshots for profile (alternative to live URLs)
1. Run `bunx allure generate allure-results --clean -o allure-report` locally
2. Screenshot overview dashboard + test detail
3. Save to portfolio media

---

## 6. References

- **DTS repo**: `D:\Nahuel\Proyectos\UPEX\diploma-tracking-sys`
- **bunkai repo**: `D:\Nahuel\Proyectos\UPEX\bunkai-qa-engineering`
- **Career profile**: `D:\Nahuel\Proyectos\career-profile-up`
- **Alignment plan**: `graphify query "alignment-remediation-plan"`

---

## Session 2026-07-07/08 — Allure GH Pages Deployment

Allure reports now live on GitHub Pages. Full session log: `session-2026-07-07-08-allure-gh-pages.md`.

Key lesson: `allure-playwright` v3+ uses `resultsDir`, NOT `outputFolder`. The old property is silently ignored. Research before guessing.

*Generated by OpenCode session 2026-07-07/08. Run `graphify update .` after any changes to keep the graph current.*
