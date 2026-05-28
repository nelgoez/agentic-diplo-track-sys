# DTS-RULE-2 — Implementation Plan

**Status**: Complete
**Date**: 27/5/2026

## Scope
Recursive tree evaluator for prerequisite rules. ALL=all children pass, ANY=≥1 child passes. Override bypass. ≥95% branch coverage.

## Implementation

### Rule Engine (`services/rule-engine.ts`)

Core function: `evaluateTrackEligibility(params) → EligibilityResult`

**Dependency injection** — all DB calls are injected as async functions, enabling pure unit testing.

**Algorithm**:
1. Load rules for track + sources + student certificates + active overrides
2. `buildRuleTree(rules, sources, parentId)` — recursive assembly from flat data
3. `evaluateNode(node, passedCourseIds, overrides)` — recursive evaluation
   - Check for active override → `fulfilled=true, overridden=true`
   - ALL: `allEvals.every(Boolean)` (vacuous truth for empty sets)
   - ANY: `allEvals.length > 0 && allEvals.some(Boolean)`
4. `collectMissingCourses(node)` — recursive collection of unfulfilled course IDs
5. Performance guard: console.warn if >500ms

### Test Coverage
23 tests, 99.21% line / 95.24% function coverage.

Covers: empty rules, ALL/ANY, 3-level nesting, overrides (active/revoked/expired), mixed children, missing dedup, parent+source combinations.

## Files
- `services/rule-engine.ts` — created
- `services/rule-engine.test.ts` — created

## Verification
- [x] 23/23 tests passing
- [x] Coverage above 95%
- [x] TypeScript typecheck passes
