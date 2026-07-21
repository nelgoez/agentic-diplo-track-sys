# Task 4 Report: Annotate VCR tests with @atc decorator

## Implementation

### 1. `VcrScore` interface + `vcr` parameter on `@atc` decorator
**File:** `packages/dts-test-kit/src/decorators.ts`
- Added `VcrScore` interface: `{ value: 1|2|3|4|5, cost: 1|2|3|4|5, risk: 1|2|3|4|5 }`
- Added `vcr?: VcrScore` to both `AtcOptions` and `AtcMetadata`
- `atc()` function stores `vcr: opts?.vcr` in `ATC_MAP` when provided
- Backward compatible — existing `@atc` calls without `vcr` continue working

### 2. Export `VcrScore` type
**File:** `packages/dts-test-kit/src/index.ts`
- Added `VcrScore` to the type re-export line from `./decorators`

### 3. VCR scores in smoke tests
**File:** `tests/kata/smoke.test.ts`
- Added `vcr: { value: 3, cost: 1, risk: 2 }` to existing `@atc('TEST-002')` call

### 4. @atc annotation on student-flow integration test
**File:** `tests/integration/student-flow.test.ts`
- Created `StudentFlowSteps` class with `@atc('STUDENT-FLOW-001', { story: 'DTS-CORE-4', vcr: { value: 5, cost: 2, risk: 3 } })` on `enrollStudent` method
- Refactored `it('enrolls student in track')` to instantiate class and delegate

### 5. @atc annotation on admin-flow integration test
**File:** `tests/integration/admin-flow.test.ts`
- Created `AdminFlowSteps` class with `@atc('ADMIN-DASHBOARD-001', { story: 'DTS-ADMIN-1', vcr: { value: 4, cost: 2, risk: 2 } })` on `getDashboardStats` method
- Refactored `it('returns dashboard stats')` to instantiate class and delegate

## Verification

### TypeScript check — PASS
```
$ tsc --noEmit
```
Clean compile, no errors.

### Test run — 55 pass / 1 fail
```
bun test v1.3.14
55 pass
1 fail
1 error
Ran 56 tests across 10 files.
```
The 1 failure (`a11y-smoke.test.ts`) is a **pre-existing** Playwright test configuration issue (`test.describe()` called in wrong context) — unrelated to this task. Integration tests skip gracefully (`SKIP: API_URL not set`) which is expected when running locally without a staging API.

## Files changed

| File | Change |
|------|--------|
| `packages/dts-test-kit/src/decorators.ts` | Added `VcrScore` interface, `vcr` to `AtcOptions`/`AtcMetadata`, store in `ATC_MAP` |
| `packages/dts-test-kit/src/index.ts` | Export `VcrScore` type |
| `tests/kata/smoke.test.ts` | Added `vcr` to existing `@atc('TEST-002')` + assert `vcr` stored in ATC_MAP |
| `tests/integration/student-flow.test.ts` | `StudentFlowSteps` class + `@atc` on enrollment test |
| `tests/integration/admin-flow.test.ts` | `AdminFlowSteps` class + `@atc` on dashboard stats test |

## Self-review

- [x] VcrScore interface present with literal union types (1-5)
- [x] vcr optional in both AtcOptions and AtcMetadata (backward compatible)
- [x] vcr stored in ATC_MAP when provided
- [x] VcrScore exported from package index
- [x] Smoke test has VCR scores on existing @atc
- [x] Student-flow test has @atc with VCR: value=5, cost=2, risk=3, story='DTS-CORE-4'
- [x] Admin-flow test has @atc with VCR: value=4, cost=2, risk=2, story='DTS-ADMIN-1'
- [x] TypeScript compiles clean
- [x] Existing tests still pass (integration tests skip gracefully)
- [x] ATC IDs are descriptive (`STUDENT-FLOW-001`, `ADMIN-DASHBOARD-001`)

## Issues / Concerns

None. The pre-existing `a11y-smoke.test.ts` failure is unrelated to this task.
