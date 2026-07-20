# Task 3: Add a11y threshold + CI gate in playwright.config

## Context

The project already has:
- `packages/dts-test-kit/src/a11y.ts` — `checkA11y()` (runs axe-core), `assertNoA11yViolations()` (throws if violations found)
- `tests/e2e/a11y-smoke.test.ts` — currently only checks login page loads, does NOT run a11y checks
- `playwright.config.ts` — basic config with chromium project
- `planning-ci.yml` — runs on push to staging + PR to main

## Requirements

1. **Add A11Y_THRESHOLD env var to playwright.config.ts**:
   - Add a constant `A11Y_THRESHOLD` that reads from `process.env.A11Y_THRESHOLD` with default `'0'` (zero violations allowed by default)
   - Parse it as integer for use in assertions

2. **Update `tests/e2e/a11y-smoke.test.ts`** to:
   - Import `checkA11y` and `assertNoA11yViolations` from `@dts/test-kit`
   - Use Playwright browser to navigate to login page
   - Run `checkA11y(page)`
   - Call `assertNoA11yViolations(result, 'login page')`
   - Use `A11Y_THRESHOLD` from config (import playwright.config or pass as env var)
   - Keep the skip-if-no-BASE_URL guard

3. **Add a11y CI job to `planning-ci.yml`**:
   - Named `a11y-check`
   - `runs-on: ubuntu-latest`
   - `timeout-minutes: 5`
   - Steps: checkout → setup bun → install deps → run a11y tests with `bun run test:a11y`
   - `needs: [planning-check]`
   - `if: always()` (run regardless of lint/check results)

## Files to modify

- `playwright.config.ts` — add A11Y_THRESHOLD constant
- `tests/e2e/a11y-smoke.test.ts` — implement real a11y checks
- `.github/workflows/planning-ci.yml` — add a11y job

## Acceptance criteria

- a11y-smoke test actually runs axe-core on login page
- A11Y_THRESHOLD=0 means zero violations → test fails on ANY violation
- CI has a dedicated a11y check job
- Existing tests pass unchanged
- a11y CI runs after lint check (needs: planning-check)

## Constraints

- Do NOT modify packages/dts-test-kit/src/a11y.ts — that's the helper library
- Use `@dts/test-kit` import path for a11y helpers
- Use `bun run test:a11y` for CI (already in package.json)
- Follow existing patterns in `planning-ci.yml`
