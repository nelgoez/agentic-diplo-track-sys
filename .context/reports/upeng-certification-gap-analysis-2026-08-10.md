# DTS Certification Gap Analysis — UPEX QA Engineer (L1-L2) Standards

> Cross-referenced against: IQL Methodology, KATA Architecture, ATLAS Model, COMETA Cycle
> Date: 2026-08-10

---

## 1. IQL Early-Game (Prevention) Standards

| Standard | Expected | DTS Status | Gap |
|----------|----------|-----------|-----|
| **BDD User Stories** | Given-When-Then ACs in Jira | Stories exist but ACs are plain markdown, not BDD format | MEDIUM |
| **Shift-Left Testing** | QA refines ACs before sprint starts | Sprint testing skills exist in agentic repo, not applied to DTS | MEDIUM |
| **Risk Assessment** | VCR (Value, Cost, Risk) scoring on test cases | @atc decorator has VCR param, never used on tests | HIGH |
| **Context Engineering** | `.context/` with business maps, PRD, SRS | EXISTS — business-data-map, master-implementation-plan, SRS, PRD | OK |

## 2. IQL Mid-Game (Detection) Standards

| Standard | Expected | DTS Status | Gap |
|----------|----------|-----------|-----|
| **"Trident QA" (E2E + API + DB)** | All 3 layers tested together | E2E exists (shallow), API (curl only), DB (trifuerza in agentic repo only) | CRITICAL |
| **Continuous Testing** | GitHub Actions CI/CD with test pipelines | CI exists (ci.yml, smoke.yml, regression.yml) | LOW — pipelines exist but shallow |
| **Agile Testing** | Sprint-level testing per story | Story-level testing not tracked — monolithic suite | MEDIUM |
| **Automation Pyramid** | Unit > Integration > E2E coverage hierarchy | Unit: rule-engine + guarani. Integration: curl. E2E: nav-only | CRITICAL |
| **POM (Page Object Model)** | Full POM coverage per page | Only LoginPage + DashboardPage exist. No CertificatesPage, CoursesPage, etc. | HIGH |
| **ATC Decorators** | `@atc('STORY-ID')` on every test | ATCs exist in agentic repo tests, not in DTS client E2E tests | HIGH |

## 3. KATA Architecture Compliance

| Standard | Expected | DTS Status | Gap |
|----------|----------|-----------|-----|
| **Layer 1 — TestContext** | Base utilities + faker | Exists in agentic repo (`tests/data/DataFactory.ts`) | OK |
| **Layer 2 — UiBase/ApiBase** | Base classes with auth helpers | `ApiBase.ts` exists in agentic. No true UiBase | MEDIUM |
| **Layer 3 — Page Objects / API clients** | Domain-specific pages and APIs | Only LoginPage + DashboardPage. No API client layer | HIGH |
| **Layer 4 — TestFixture** | DI entry point | Exists in auth.ts fixtures (adminPage, studentPage) | OK |
| **kata-manifest.json** | Generated from ATC annotations | Exists in agentic repo | OK — needs regeneration |

## 4. ATLAS Certification Requirements (QA Engineer)

| Standard | Expected | DTS Status | Gap |
|----------|----------|-----------|-----|
| **i18n** | Full multi-language support | 230+ hardcoded strings. 1 raw key ("dashboard.quick_actions"). Spanglish mixed tabs | CRITICAL |
| **Error Handling** | Graceful degradation, user-friendly messages | Crash on null eligibility. Silent catches. Promise.all discards partial data | CRITICAL |
| **UX Consistency** | Uniform interaction patterns | Clickable cards in dashboard vs non-clickable in admin. No actions on list pages | HIGH |
| **TMS Sync** | Test results → Jira/Xray | `tms-sync.ts` exists but not wired to CI | MEDIUM |
| **Allure Reports** | Rich test reports with history | Configured in Playwright config + CI, but shallow test coverage = empty reports | MEDIUM |
| **CI/CD Pipelines** | Build → Test → Report → Deploy | 6 workflows exist. Missing: post-deploy API smoke | LOW |
| **VCR Scoring** | Every ATC has VCR tuple | Never applied to existing tests | HIGH |
| **GO/NO-GO Sign-off** | Release decision based on test results | Regression workflow exists but no formal sign-off gate | LOW |

## 5. Specific DTS Bugs Blocking Certification

| # | Severity | Issue | File:Line | UPEX Standard Violated |
|---|---------|-------|-----------|----------------------|
| B1 | CRITICAL | Student dashboard crashes on null eligibility (blank page) | DashboardPage.tsx:535 | Error Handling |
| B2 | CRITICAL | ~230 hardcoded strings, spanglish mix | 15+ files | i18n / Professional Polish |
| B3 | CRITICAL | Analytics chart bars clipped invisible | BarChart.tsx:23-32 | Data Visualization / UX |
| B4 | HIGH | Promise.all discards partial data on student dashboard | DashboardPage.tsx:131 | Error Handling |
| B5 | HIGH | Stat cards not clickable in AdminStatsGrid + AnalyticsTab | AdminStatsGrid.tsx, AnalyticsTab.tsx | UX Consistency |
| B6 | HIGH | Certificates page: no filters, no pagination, no detail | CertificatesPage.tsx | UX Completeness |
| B7 | HIGH | Courses page: zero actions, silent errors | CoursesPage.tsx | UX Completeness |
| B8 | HIGH | SysAdmin rules tree unreadable (just indentation) | SysAdminPage.tsx:650-655 | Data Visualization |
| B9 | HIGH | SysAdmin evaluate needs raw UUIDs, no autocomplete | SysAdminPage.tsx:856-857 | Usability |
| B10 | HIGH | Override reason truncated, no tooltip | SysAdminPage.tsx:740-741 | UX Completeness |
| B11 | MEDIUM | No coordinator E2E tests | tests/e2e/ | KATA / Trident QA |
| B12 | MEDIUM | No API test suite (only curl) | — | Trident QA / Automation Pyramid |
| B13 | MEDIUM | ATC decorators unused on E2E tests | client/tests/e2e/ | KATA / VCR Scoring |

---

## 6. Certification Scorecard

| Dimension | Max | Score | % |
|-----------|-----|-------|---|
| IQL Early-Game (Prevention) | 15 | 8 | 53% |
| IQL Mid-Game (Detection) | 25 | 7 | 28% |
| IQL Late-Game (Observation) | 10 | 2 | 20% |
| KATA Architecture Compliance | 15 | 5 | 33% |
| UX/UI Professional Polish | 15 | 4 | 27% |
| CI/CD & DevOps | 10 | 6 | 60% |
| Documentation & Context | 10 | 8 | 80% |
| **TOTAL** | **100** | **40** | **40%** |

**Certification threshold: 70%. Current: 40%.**

---

## 7. Remediation Roadmap (Ordered by Impact)

### Sprint 1: Critical Blockers (→ 55%)
| # | Item | Est. hours |
|---|------|-----------|
| 1 | Fix student dashboard crash (null eligibility) | 0.5h |
| 2 | Fix i18n — add `dashboard.quick_actions` key, fix spanglish tabs, add ~60 translation keys | 3h |
| 3 | Fix Analytics chart clipping (BarChart overflow) | 1h |
| 4 | Fix certificate/courses pages: search bar, filters, pagination | 4h |
| 5 | Make all stat cards clickable (AdminStatsGrid, AnalyticsTab, SysAdmin) | 1h |

### Sprint 2: KATA+"Trident QA" (→ 65%)
| # | Item | Est. hours |
|---|------|-----------|
| 6 | Write API test suite (health, auth, students, enrollments, certificates) | 4h |
| 7 | Wire DB trifuerza tests into main repo CI | 2h |
| 8 | Add coordinator fixture + login to E2E auth.ts | 1h |
| 9 | Annotate existing E2E tests with @atc + VCR scores | 1h |
| 10 | Create CertificatePage POM + CoursePage POM | 2h |

### Sprint 3: Professional Polish (→ 70%)
| # | Item | Est. hours |
|---|------|-----------|
| 11 | Replace remaining hardcoded strings with t() calls | 3h |
| 12 | SysAdmin: rule tree visualization + evaluate autocomplete | 3h |
| 13 | SysAdmin: override reason tooltips + confirmation dialogs | 1h |
| 14 | Regenerate kata-manifest.json + traceability matrix | 1h |

**Total: ~28h across 3 sprints to reach certification threshold.**
