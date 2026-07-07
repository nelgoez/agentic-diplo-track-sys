# Alignment Remediation Plan — UPEX Galaxy Certification Readiness

> **Goal**: Close 3 critical gaps for DOJO Agentic Quality Engineer certification
> **Date**: 2026-07-07
> **Graphify key**: `alignment-remediation-plan`
> **Status**: `in_progress`
> **Grading**: UPEX certification requires 100% on checklist items. See `graphify query "certification checklist"`.

---

## Gaps Overview

| # | Gap | UPEX Requirement | Current Status | Effort | Priority |
|---|---|---|---|---|---|
| 1 | **Allure reports** | Test report visualization, required in cert checklist | ❌ Not configured | 1h | P0 |
| 2 | **Xray integration** | Test case management + traceability in Jira | ❌ No Xray | 8h | P0 |
| 3 | **Late-Game (IQL Step 11)** | Production smoke tests post-deploy | ❌ Not implemented | 4h | P0 |
| 4 | **a11y testing** | axe-core integration | ⚠️ Mentioned only | 2h | P1 |
| 5 | **VCR framework** | Value-Cost-Risk analysis tool | ⚠️ Implicit only | 2h | P1 |

---

## Sprint Plan

```
Sprint A (NOW) — Fast wins, graphify persistence
├── 1.1 Allure: install + configure reporter
├── 1.2 Allure: add to CI pipeline
├── 1.3 Write plan doc + rebuild graphify
└── Deliverable: Allure reports in CI artifacts

Sprint B — Infrastructure for Xray
├── 2.1 Audit current Jira schema + custom fields
├── 2.2 Create xray-cli skill (wrapper)
├── 2.3 Integrate Xray API for test set creation
├── 2.4 Wire @atc decorator → Xray test case sync
└── Deliverable: Xray linked to existing tests

Sprint C — Late-Game foundation
├── 3.1 Production smoke test suite (IQL Step 11)
├── 3.2 Health check endpoint monitoring
├── 3.3 Post-deploy smoke run in CI
└── Deliverable: Automated production smoke gate

Sprint D — Polish
├── 4.1 axe-core Playwright integration
├── 4.2 VCR checklist/reference doc
└── Deliverable: All cert checklist items green
```

---

## Sprint A: Execution (NOW)

### A1. Allure Reporter Integration

**Files to modify**:
- `package.json` → add `@playwright-test-reporter/allure`, `allure-commandline`
- `playwright.config.ts` → add Allure reporter config
- `.github/workflows/test.yml` → add Allure report generation step

**Pattern**:
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['line'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  // ...existing config
});
```

**Verification**: `bun run test:e2e` produces `allure-results/` directory.

### A2. Allure in CI

Add step to GitHub Actions workflow after test run:
```yaml
- name: Generate Allure Report
  if: always()
  run: |
    bunx allure generate allure-results --clean -o allure-report
- name: Upload Allure Report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: allure-report
    path: allure-report/
```

### A3. Graphify Persistence

After all changes: `bun run graph:rebuild` so future sessions can query.

---

## Sprint B: Xray Integration

### B1. Current-State Audit

Jira already connected via Atlassian MCP + sync scripts. Xray is a Jira plugin — need to determine:
- Is Xray installed in the Jira instance? Check Jira apps.
- Xray API base: `https://diplo-track-sys.atlassian.net/rest/raven/1.0/`
- Auth: same as Jira API token

### B2. xray-cli Skill

Create `.claude/skills/xray-cli/SKILL.md` with:
- Test Set CRUD via Xray REST API
- Test Execution creation
- Linking tests to stories
- Import test results from Allure

### B3. KATA → Xray Bridge

The `@atc` decorator already registers ATC metadata in `getAtcMap()`. Bridge:
```
@atc decorated test → getAtcMap() → Xray API → Test Case in Jira
```

Add optional Xray sync to the KATA fixture:
```typescript
// createXrayFixture() — wraps createFixture + auto-syncs ATCs to Xray
```

---

## Sprint C: Late-Game (IQL Step 11)

### C1. Production Smoke Tests

New test file: `tests/smoke/production.smoke.ts`
- Health check on production URL
- Login flow (happy path)
- Verify critical API endpoints return 200
- Verify DB connection via health endpoint

### C2. Post-Deploy Smoke Gate

In CI/CD workflow, after deploy to production:
```yaml
- name: Production Smoke Tests
  run: bun run test:smoke:production
  env:
    BASE_URL: ${{ vars.PRODUCTION_URL }}
```

### C3. Monitoring

Add health check endpoint to the app:
```
GET /api/health → { status: 'ok', db: 'connected', timestamp: ISO }
```

---

## Sprint D: Polish

### D1. a11y Testing

- Add `@axe-core/playwright` devDependency
- Create a11y test helper in `packages/dts-test-kit/src/a11y.ts`
- Add to smoke test suite

### D2. VCR Framework

Create reference doc `.claude/skills/sprint-development/references/vcr-framework.md`:
- Value: business impact of test
- Cost: effort to automate/maintain
- Risk: likelihood of failure
- Decision matrix for automation vs manual

---

## Certification Checklist (UPEX "Logro")

| Item | Owner | Status | Sprint |
|---|---|---|---|
| Links to Stories in Jira | Jira sync works | ✅ DONE | — |
| Links to Allure reports | Allure integration | ❌ GAP | A |
| Links to Xray test reports | Xray integration | ❌ GAP | B |
| GitHub repo | Repo exists + CI/CD | ✅ DONE | — |
| MVP with Playwright | KATA framework | ✅ DONE | — |
| CI/CD pipeline | GitHub Actions | ✅ DONE | — |
| 21 Story Points closed | Stories in Jira | ✅ DONE (in client repo) | — |
| 2+ SQL + 2+ API test stories | Coverage in stories | ✅ DONE (in client repo) | — |
| Planning Poker participation | Jira workflow | ✅ DONE | — |
| Sprint Demo/Review | Ceremonies | ✅ DONE | — |
| Regular Daily attendance | Workspace | ✅ DONE | — |
| Trifuerza (UI + API + DB) | All layers tested | ⚠️ Partial | B/C |
| Demo Day presentation | Final presentation | 🔜 Future | Post-C |
| Production smoke gate | IQL Step 11 | ❌ GAP | C |

---

## Graphify Quick-Reference Keys

Future sessions, run these to resume:

| Intent | Command |
|---|---|
| Full plan | `graphify query "alignment-remediation-plan"` |
| Certification checklist | `graphify path "DOJO certification" "checklist"` |
| Current gaps | `graphify query "UPEX alignment gaps"` |
| IQL progress | `graphify query "IQL methodology implementation status"` |
| KATA architecture | `graphify explain "KATA architecture"` |
| Xray integration status | `graphify query "Xray integration status"` |
| Allure setup | `graphify query "Allure reporter configuration"` |
| Late-Game test coverage | `graphify query "production smoke tests late-game"` |

---

## Status Legend

- ✅ DONE — No action needed
- ❌ GAP — Must fix for certification
- ⚠️ Partial — Works but incomplete
- 🔜 Future — Not in current sprint
