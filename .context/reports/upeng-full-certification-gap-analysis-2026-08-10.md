# DTS Certification Gap Analysis — UPEX Full-Stack Standards (DEV + QA)

> Cross-referenced against: agentic-dev-boilerplate + agentic-qa-boilerplate + IQL + KATA + ATLAS
> Date: 2026-08-10

---

## PART A: Development Standards Gap (agentic-dev-boilerplate)

### A.1 Dev Documentation & Context Engineering

| Doc | Expected | DTS Status |
|-----|----------|-----------|
| `README.md` | Project overview | EXISTS ✓ |
| `CLAUDE.md` | AI memory, operational rules | EXISTS ✓ |
| `CONTEXT.md` | Canonical reference, knowledge map | **MISSING** |
| `DESIGN.md` | Visual identity spec (Google Labs) | **MISSING** |
| `.context/business/business-data-map.md` | Entity-relationship + flows | EXISTS ✓ |
| `.context/business/business-feature-map.md` | Feature-to-story mapping | **MISSING** |
| `.context/business/business-api-map.md` | API endpoint catalog | **MISSING** |
| `.context/PRD/` | Product requirements | EXISTS ✓ |
| `.context/SRS/` | Software requirements | EXISTS ✓ |
| `.context/PBI/` | Per-ticket memory | EXISTS ✓ |
| `.context/dev-roadmap.md` | Ticket/dependency sequence | **MISSING** |
| `.context/master-implementation-plan.md` | EPIC-level roadmap | EXISTS ✓ |

### A.2 Dev Workflow Skills Compliance

| Skill | Purpose | DTS Applied? |
|-------|---------|-------------|
| `/project-foundation` | Constitution, PRD, SRS, Discovery | YES — all generated |
| `/design-system` | DESIGN.md generation | **NO** — no DESIGN.md |
| `/project-bootstrap` | Backend/frontend/OpenAPI/auth scaffolding | YES — operational |
| `/product-management` | Backlog seed, INVEST refinement, Gherkin ACs | Partial — stories exist but ACs not in BDD/Gherkin |
| `/sprint-development` | Plan→Code→Review→Staging→Production | YES — cycle followed |
| `/unit-testing` | TDD, test naming, mocking, coverage | **PARTIAL** — only 2 services tested |
| `/git-flow-master` | Branches, PRs, conflicts | YES — using staging/main flow |
| `/deploy-to-vercel` | Deploy verification, env sync | YES — both projects deployed |

### A.3 Dev CI/CD Standards

| Workflow | DTS Status |
|----------|-----------|
| `build.yml` (PR validation) | EXISTS ✓ (ci.yml) |
| `smoke.yml` (daily @critical) | EXISTS ✓ |
| `sanity.yml` (pattern-based) | **MISSING** |
| `regression.yml` (full suite) | EXISTS ✓ |
| `prod-validate.yml` | EXISTS ✓ |

### A.4 Code Quality Standards

| Standard | DTS Status |
|----------|-----------|
| ESLint | EXISTS ✓ |
| Prettier | EXISTS ✓ |
| TypeScript strict | EXISTS ✓ |
| Husky pre-commit hooks | EXISTS ✓ |
| Secrets detection (gitguardian) | EXISTS ✓ (in agentic repo) |
| Unit test coverage ≥80% | **NO** — only rule-engine + guarani tested |

---

## PART B: QA Standards Gap (agentic-qa-boilerplate) — previously analyzed

### B.1 IQL Methodology

| Phase | Score |
|-------|-------|
| Early-Game (Prevention) | 53% |
| Mid-Game (Detection / Trident QA) | 28% |
| Late-Game (Observation) | 20% |

### B.2 KATA Architecture

| Layer | Status |
|-------|--------|
| L1 — TestContext | OK |
| L2 — UiBase/ApiBase | Partial |
| L3 — Page Objects / API clients | **MISSING** (only 2 POMs) |
| L4 — TestFixture | OK |
| @atc/VCR on tests | **MISSING** |

### B.3 UX/UI Polish

| Category | Status |
|----------|--------|
| i18n | CRITICAL — 230+ hardcoded strings, spanglish |
| Error handling | CRITICAL — crash on null, silent catches |
| UX consistency | HIGH — clickable vs dead cards |
| Data visualization | HIGH — chart clipping, truncated labels |

---

## PART C: Combined Scorecard

| Dimension | Max | Score | % |
|-----------|-----|-------|---|
| **DEV — Context Engineering** | 15 | 9 | 60% |
| **DEV — Code Quality** | 15 | 12 | 80% |
| **DEV — CI/CD** | 10 | 7 | 70% |
| **DEV — Unit Testing** | 10 | 3 | 30% |
| **QA — IQL Early-Game** | 10 | 5 | 53% |
| **QA — IQL Mid-Game (Trident)** | 15 | 4 | 28% |
| **QA — IQL Late-Game** | 5 | 1 | 20% |
| **QA — KATA Architecture** | 10 | 3 | 33% |
| **QA — UX/UI Polish** | 10 | 3 | 30% |
| **TOTAL** | **100** | **47** | **47%** |

**Certification threshold: 70%. Gap: 23 points.**

---

## PART D: Prioritized Remediation

### Quick Wins (→ 55%, ~6h)
1. Create `CONTEXT.md` — canonical reference
2. Create `DESIGN.md` — visual identity spec
3. Create `.context/business/business-feature-map.md`
4. Create `.context/business/business-api-map.md`
5. Create `.context/dev-roadmap.md`
6. Add `sanity.yml` CI workflow

### Mid-Game (→ 63%, ~12h)
7. Write Gherkin/BDD ACs for top-5 stories in Jira
8. Add unit tests for moodle.service.ts, notification.service.ts, override-scheduler.ts
9. Add @atc + VCR to all existing E2E tests
10. Fix student dashboard crash (null eligibility)
11. Fix i18n — spanglish tabs, `dashboard.quick_actions` key

### Deep Work (→ 70%, ~14h)
12. Write API test suite (health, auth, students, enrollments, certificates)
13. Wire DB trifuerza into main CI
14. Create CertificatePage + CoursePage POMs
15. Make all stat cards clickable
16. Fix Analytics chart clipping
17. SysAdmin rule tree visualization + autocomplete

---

> **Next session**: user to provide UPEX credentials for devLog access. Then execute Sprint 1 quick wins.
