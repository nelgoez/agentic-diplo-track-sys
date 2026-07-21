# Task 4: Annotate VCR tests with @atc decorator

## Context

The project has:
- `@atc` decorator in `packages/dts-test-kit/src/decorators.ts` — class method decorator that registers ATC metadata
- `AtcOptions` interface: `{ story?: string, feature?: string }`
- VCR framework reference at `.claude/skills/sprint-development/references/vcr-framework.md` which says the `@atc` decorator should accept optional `vcr` parameter
- Existing integration tests at `tests/integration/` (student-flow, admin-flow, api-health)
- Existing KATA tests at `tests/kata/` (smoke, kit)
- VCR = Value, Cost, Risk analysis for test automation decisions

## Requirements

### 1. Add `vcr` parameter to @atc decorator

In `packages/dts-test-kit/src/decorators.ts`:
- Add `VcrScore` interface: `{ value: 1-5, cost: 1-5, risk: 1-5 }`
- Add `vcr?: VcrScore` to `AtcOptions`
- Add `vcr?: VcrScore` to `AtcMetadata`
- Store `vcr` in the ATC_MAP when provided

### 2. Annotate existing integration tests with @atc + VCR

In `tests/integration/student-flow.test.ts`:
- Wrap the `creates student and enrolls in track` test in a class method with @atc
- Use VCR: value=5 (critical path), cost=2 (cheap API tests), risk=3 (moderate volatility)
- Story: DTS-CORE-4

In `tests/integration/admin-flow.test.ts`:
- Wrap admin tests in class method with @atc
- Use VCR: value=4 (important), cost=2 (cheap), risk=2 (stable admin endpoints)
- Story: DTS-ADMIN-1

In `tests/kata/smoke.test.ts`:
- The existing kit tests already use @atc in the decorator test section
- No change needed there unless you want to add VCR scores to existing test registrations
- Add VCR scores to existing @atc usages in this file to show VCR working

### 3. Export VcrScore type

- Add `VcrScore` to `packages/dts-test-kit/src/index.ts` exports

## Files to modify

- `packages/dts-test-kit/src/decorators.ts` — add VcrScore, update AtcOptions/AtcMetadata
- `packages/dts-test-kit/src/index.ts` — export VcrScore
- `tests/integration/student-flow.test.ts` — add @atc annotated test
- `tests/integration/admin-flow.test.ts` — add @atc annotated test (if it already has test content)
- `tests/kata/smoke.test.ts` — add VCR scores to existing @atc usages

## Acceptance criteria

- VcrScore type exists and is exported
- @atc decorator accepts optional `vcr` parameter
- ATC metadata includes vcr when provided
- Integration tests have @atc annotations with appropriate VCR scores
- TypeScript compiles clean
- Existing tests still pass

## Constraints

- Follow existing code patterns in each file
- Do NOT change the behavior of existing tests
- Do NOT break the existing @atc decorator API (backward compatible)
- Use `bun test` to verify nothing breaks
