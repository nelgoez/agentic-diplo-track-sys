# Playwright Best Practices 2026 — Consolidated

> Cross-validated against official Playwright docs, community sources, and current dev tooling consensus.
> Sources: playwright.dev, BugBug, TestDino, QASkills, Pie, currents.dev, DZone, testquality.com

## 1. Authentication

- **Recommended**: project-dependency setup with `storageState` (over globalSetup)
- Setup project runs first, writes `playwright/.auth/user.json`, dependent projects consume via `use.storageState`
- Keep `storageState` out of git (`.gitignore`)
- Inject credentials via CI secrets, never hardcode
- Worker-scoped fixture for unique accounts per parallel worker

```ts
// playwright.config.ts
projects: [
  { name: 'setup', testMatch: /.*\.setup\.ts/ },
  { name: 'chromium', dependencies: ['setup'], use: { storageState: 'playwright/.auth/user.json' } },
]
```

## 2. Locator Priority

| Priority | Locator | Use Case |
|----------|---------|----------|
| 1st | `getByRole` / `getByLabel` / `getByText` | User-facing, accessible elements |
| 2nd | `getByTestId` | Stable contract, flaky text/attrs |
| Last | CSS / XPath | Only when nothing else works |

Consensus: prefer user-facing locators for accessibility coverage; use `data-testid` as explicit opt-in when UI text changes frequently. Configure `testIdAttribute` centrally.

## 3. Fixtures + POM (Hybrid)

- **Fixtures first** (Playwright Test fixtures): scoped lifecycles, native integration
- **POM as thin layer**: small helpers instantiated from fixtures
- Avoid heavyweight class hierarchies

```ts
// auth.ts fixture
export const test = base.extend<{ dashboardPage: DashboardPage }>({
  dashboardPage: async ({ page }, use) => {
    await loginAsAdmin(page);
    await use(new DashboardPage(page));
  },
});
```

## 4. Test Tags

Adopt small taxonomy: `@smoke`, `@critical`, `@regression`, `@api`, `@ui`, `@vrt`
Filter runs with `--grep` in CI to map tags to pipeline stages.

```ts
test('@critical should login as admin', async ({ page }) => { ... });
// Run: npx playwright test --grep "@critical"
```

## 5. Flaky Test Prevention

- Rely on auto-waiting + web-first assertions (never manual sleep)
- `retries: CI ? 2 : 0` — retries are diagnostic, not cure
- `trace: 'on-first-retry'` — actionable traces without bloat
- Isolated `BrowserContext` per test (default)
- Avoid: XPath, global state, committed storageState

## 6. CI/CD Optimization

- `workers: 1` in CI for stability
- Shard horizontally for >500 tests: `--shard=x/y`
- Playwright Docker image avoids browser download costs
- `webServer` in config for local dev CI

## 7. Visual Regression

- `toHaveScreenshot()` with committed baselines
- Mask dynamic regions, disable animations
- Docker for cross-OS consistency
- `maxDiffPixelRatio: 0.01` threshold

## 8. API Mocking

- `page.route().fulfill()` for mock responses
- `page.route().fetch()` to edit real responses
- Prefer network-level mocks for third parties
- MSW for complex stateful mocks

## 9. Debugging

- Trace Viewer: inspect actions, network, timeline
- `trace: 'on-first-retry'` or `'retain-on-failure'`
- Avoid always-on tracing in CI (hundreds of MB)
- Screenshots on failure as lightweight alternative

## 10. Test Data

- Seed via API per test for determinism
- Unique data per parallel worker (avoid collisions)
- Tear down state after each test
- Mock third-party services at browser/network level
