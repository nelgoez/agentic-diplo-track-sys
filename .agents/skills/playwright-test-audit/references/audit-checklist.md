# Playwright Test Audit — Full Checklist

28 checks across 10 sections. Each check has a **scope** (config / tests / CI), a **grep pattern** to find violations, and a **pass condition**.

---

## §1 Authentication (4 checks)

| # | Check | Scope | Pass Condition | Grep / Scan |
|---|-------|-------|----------------|-------------|
| 1.1 | `storageState` excluded from git | Config | `.gitignore` contains `playwright/.auth/` or `storageState` paths | `cat .gitignore \| grep -i "\.auth\|storageState"` |
| 1.2 | CI secrets injection — credentials from env, not hardcoded | CI | Workflow file uses `${{ secrets.* }}` or `process.env.*` for credentials, never literal values | `grep -r "ADMIN_PASSWORD\|STUDENT_PASSWORD" .github/workflows/*.yml \| grep -v secrets` → should be empty |
| 1.3 | Worker-scoped fixture for auth | Tests | `base.extend` fixture logs in and calls `use()` with authenticated page | `grep -rn "base.extend\|storageState" tests/` |
| 1.4 | No hardcoded credentials in spec files | Tests | No literal email/password strings in `*.spec.ts` | `grep -rn "'admin@\|'estudiante@\|Admin123\|Demo2024\|Test123" tests/ *spec*` → empty |

### Check commands

```bash
# 1.1
grep -i "\.auth\|storageState" .gitignore 2>/dev/null && echo "PASS" || echo "FAIL"

# 1.2 — literal passwords in CI config
grep -n "password" .github/workflows/*.yml 2>/dev/null | grep -v "secrets\|\${{" && echo "FAIL" || echo "PASS"

# 1.3
grep -rn "base.extend" tests/ *.spec.ts 2>/dev/null | head -3

# 1.4 — hardcoded credentials in spec files
grep -rn "admin@\|estudiante@\|@dts\|\.unc\.edu" tests/ *.spec.ts 2>/dev/null | grep -v "process.env\|test.skip" && echo "FAIL" || echo "PASS"
```

---

## §2 Locators (3 checks)

| # | Check | Scope | Pass Condition | Grep / Scan |
|---|-------|-------|----------------|-------------|
| 2.1 | `testIdAttribute` configured centrally | Config | `playwright.config.*` has `testIdAttribute` set | `grep -n "testIdAttribute" playwright.config.*` |
| 2.2 | `getByTestId` preferred over CSS/XPath | Tests | No `page.locator(` with CSS selectors where test-id exists; no `page.$(` | `grep -rn "page\.locator\|\.\$(" tests/ *.spec.ts` — review each hit |
| 2.3 | No `waitForSelector` / `waitForTimeout` | Tests | No `waitForSelector` or `waitForTimeout` — use web-first assertions instead | `grep -rn "waitForSelector\|waitForTimeout" tests/ *.spec.ts` → empty |

### Check commands

```bash
# 2.1
grep -rn "testIdAttribute" playwright.config.* 2>/dev/null && echo "PASS" || echo "FAIL"

# 2.2 — flag CSS locators for manual review
grep -rn "page\.locator\|\.\$(" tests/ *.spec.ts 2>/dev/null | grep -v "node_modules" && echo "REVIEW" || echo "PASS"

# 2.3
grep -rn "waitForSelector\|waitForTimeout" tests/ *.spec.ts 2>/dev/null && echo "FAIL" || echo "PASS"
```

---

## §3 Fixtures + POM (3 checks)

| # | Check | Scope | Pass Condition | Grep / Scan |
|---|-------|-------|----------------|-------------|
| 3.1 | Fixtures-first pattern (`base.extend`) | Tests | At least one `base.extend` call exists | `grep -rn "base.extend" tests/ *.spec.ts` → non-empty |
| 3.2 | POM is thin layer (no assertion logic in POM) | Tests | Page objects don't import `expect` from Playwright | `grep -rn "from '@playwright/test'" tests/pages/ 2>/dev/null` → empty (only in spec/auth files) |
| 3.3 | No heavyweight class hierarchies (single-level POM) | Tests | POM classes don't extend other POM classes | `grep -rn "extends " tests/pages/ 2>/dev/null` → empty |

### Check commands

```bash
# 3.1
grep -rn "base.extend" tests/ *.spec.ts 2>/dev/null | head -1 && echo "PASS" || echo "FAIL"

# 3.2 — expect import inside page objects
grep -rn "from '@playwright/test'" tests/pages/ 2>/dev/null && echo "FAIL" || echo "PASS"

# 3.3
grep -rn "extends " tests/pages/ 2>/dev/null && echo "REVIEW" || echo "PASS"
```

---

## §4 Test Tags (3 checks)

| # | Check | Scope | Pass Condition | Grep / Scan |
|---|-------|-------|----------------|-------------|
| 4.1 | Standard taxonomy used (`@smoke`, `@critical`, `@regression`) | Tests | Tests use at least one of the standard tags | `grep -rn "'@smoke\|'@critical\|'@regression" tests/ *.spec.ts` → non-empty |
| 4.2 | Tags filterable in CI (`--grep`) | CI | Workflow uses `--grep` or environment-based grep pattern | `grep -n "grep" .github/workflows/*.yml 2>/dev/null` |
| 4.3 | No orphan tags (tags defined but never used in CI) | Tests | Every `@tag` in test files has a corresponding CI `--grep` or project config | Extract all `@tag` from tests, verify each has a CI or config match |

### Check commands

```bash
# 4.1
grep -rn "'@smoke\|'@critical\|'@regression" tests/ *.spec.ts 2>/dev/null | head -3

# 4.2
grep -rn "grep\|testMatch" .github/workflows/*.yml 2>/dev/null && echo "PASS" || echo "FAIL"

# 4.3 — extract all tags
grep -roh "'@[a-z][a-z-]*" tests/ *.spec.ts 2>/dev/null | sort -u
```

---

## §5 Flakiness Prevention (3 checks)

| # | Check | Scope | Pass Condition | Grep / Scan |
|---|-------|-------|----------------|-------------|
| 5.1 | Web-first assertions (`toBeVisible`, `toHaveText`, etc.) | Tests | No manual `page.waitFor()` or `page.waitForTimeout()` in test bodies | `grep -rn "waitForTimeout\|waitForSelector" tests/ *.spec.ts 2>/dev/null` → ideally empty |
| 5.2 | `retries` configured per CI env | Config | Config has `retries: CI ? N : M` or equivalent | `grep -n "retries" playwright.config.*` |
| 5.3 | `workers: 1` for CI | Config | Config or workflow sets workers to 1 in CI | `grep -n "workers" playwright.config.* .github/workflows/*.yml 2>/dev/null` |

### Check commands

```bash
# 5.1
grep -rn "waitForTimeout\|page\.waitFor(" tests/ *.spec.ts 2>/dev/null | grep -v "waitForURL\|waitForLoadState\|waitForResponse" && echo "FAIL" || echo "PASS"

# 5.2
grep -n "retries" playwright.config.* 2>/dev/null && echo "PASS" || echo "FAIL"

# 5.3
grep -rn "workers" playwright.config.* .github/workflows/*.yml 2>/dev/null && echo "PASS" || echo "WARN"
```

---

## §6 CI/CD (3 checks)

| # | Check | Scope | Pass Condition | Grep / Scan |
|---|-------|-------|----------------|-------------|
| 6.1 | Playwright browser caching | CI | Workflow has a `actions/cache` step for Playwright browsers | `grep -n "ms-playwright\|playwright.*cache\|browsers.*cache" .github/workflows/*.yml` |
| 6.2 | Tests run against correct target URL | CI | Workflow sets `BASE_URL`, `PROD_BASE_URL`, or equivalent env var | `grep -E "BASE_URL|PROD_URL" .github/workflows/*.yml` |
| 6.3 | Report artifact uploaded on failure | CI | Workflow has `upload-artifact` for `playwright-report/` | `grep -n "upload-artifact\|playwright-report" .github/workflows/*.yml` |

---

## §7 Visual Regression (2 checks)

| # | Check | Scope | Pass Condition | Grep / Scan |
|---|-------|-------|----------------|-------------|
| 7.1 | `toHaveScreenshot()` used with committed baselines | Tests | If visual tests exist, baselines are checked into git | `grep -rn "toHaveScreenshot\|toMatchSnapshot" tests/ *.spec.ts 2>/dev/null` + check `git ls-files *-snapshots/` |
| 7.2 | Dynamic regions masked in screenshots | Tests | Screenshot tests use `mask` option or disable animations | `grep -n "mask:\|animations:" tests/ *.spec.ts 2>/dev/null` if visual tests exist |

---

## §8 API Mocking (2 checks)

| # | Check | Scope | Pass Condition | Grep / Scan |
|---|-------|-------|----------------|-------------|
| 8.1 | Network-level mocks for third-party services | Tests | `page.route()` or MSW used, not stubbing the fetch library | `grep -rn "page\.route\|page\.fulfill\|msw" tests/ *.spec.ts 2>/dev/null` |
| 8.2 | Mocks cleared between tests | Tests | `page.unroute()` called in afterEach or fixture teardown | `grep -rn "unroute\|context.close\|fixture.*teardown" tests/ *.spec.ts 2>/dev/null` |

---

## §9 Debugging (2 checks)

| # | Check | Scope | Pass Condition | Grep / Scan |
|---|-------|-------|----------------|-------------|
| 9.1 | Trace mode set correctly per environment | Config | Config has `trace: 'on-first-retry'` or `'retain-on-failure'` — NOT `'off'` | `grep -n "trace:" playwright.config.*` |
| 9.2 | Video recording configured per CI | Config | Video is `'on'` in CI, `'off'` locally, or omitted | `grep -n "video:" playwright.config.*` |

---

## §10 Test Data (3 checks)

| # | Check | Scope | Pass Condition | Grep / Scan |
|---|-------|-------|----------------|-------------|
| 10.1 | Test data seeded via API, not UI | Tests | `fetch` / `axios` / API calls in setup, not form-filling for data entry | `grep -rn "fetch\|axios\|apiClient" tests/ --include="*.ts" 2>/dev/null` |
| 10.2 | Unique data per parallel worker | Tests | Test data includes worker-scoped randomization (`crypto.randomUUID`, `Date.now()`, etc.) | `grep -rn "randomUUID\|Date.now\|worker\|parallelIndex" tests/ *.spec.ts 2>/dev/null` |
| 10.3 | Third-party services mocked | Tests | Third-party integrations use `page.route()` or env flag to disable real calls | `grep -rn "page\.route\|MOCK_MODE\|mock.*true" tests/ *.spec.ts 2>/dev/null` |

---

## Section weighting for scoring

| Section | Weight | Rationale |
|---------|--------|-----------|
| §1 Authentication | 15 | Security-critical; leaked credentials are highest impact |
| §2 Locators | 10 | Directly affects test reliability and maintenance cost |
| §3 Fixtures + POM | 10 | Architecture pattern; hard to refactor later |
| §4 Test Tags | 5 | CI pipeline hygiene |
| §5 Flakiness | 15 | Directly affects CI reliability and team trust |
| §6 CI/CD | 10 | Pipeline correctness |
| §7 Visual Regression | 5 | Niche — only applies if visual tests exist |
| §8 API Mocking | 5 | Niche — only applies if API mocking is used |
| §9 Debugging | 10 | Affects debugging speed on failures |
| §10 Test Data | 15 | Flakiness root cause #1 |
