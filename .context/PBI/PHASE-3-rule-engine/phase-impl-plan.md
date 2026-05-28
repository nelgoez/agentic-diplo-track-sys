# Phase 3 — Rule Engine

**Status**: Complete
**Date**: 27/5/2026
**Repo**: diploma-tracking-sys (main branch)

## Stories

| ID | Story | Effort | Status |
|----|-------|--------|--------|
| DTS-RULE-1 | Prerequisite rules CRUD (recursive tree) | 8 SP | Done |
| DTS-RULE-2 | Rule engine evaluator (recursive, >95% coverage) | 8 SP | Done |
| DTS-RULE-3 | Manual override CRUD | 5 SP | Done |
| DTS-RULE-4 | View rule tree (hierarchical) | 2 SP | Done |
| DTS-EXAM-1 | Student progress API | 5 SP | Done |
| DTS-EXAM-2 | Eligibility check on dashboard | 5 SP | Done |

## Implementation Summary

### Step A — Schema Migration (`002_phase3_rule_engine.sql`)

**prerequisite_rules**:
- ADD `parent_rule_id UUID REFERENCES prerequisite_rules(id) ON DELETE SET NULL`
- ADD `order_index INTEGER NOT NULL DEFAULT 0`
- Index on `parent_rule_id`

**manual_overrides** (restructured):
- DROP `course_id`, `action`
- ADD `rule_id UUID REFERENCES prerequisite_rules(id) ON DELETE CASCADE`
- ADD `expires_at TIMESTAMPTZ`
- ADD `status TEXT NOT NULL DEFAULT 'active' CHECK (IN ('active','expired','revoked'))`
- ADD `revoked_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`
- Partial unique index: `UNIQUE(student_id, rule_id) WHERE status = 'active'`

**Policies + Triggers**: Added RLS on 6 tables (tracks, courses, rules, sources, overrides, logs). Added `updated_at` triggers on 3 tables.

### Step B — Rule Engine (`services/rule-engine.ts`)

```typescript
evaluateTrackEligibility({
  studentId, trackId,
  getRulesForTrack,     // async (trackId) => RuleRow[]
  getSourcesForRules,   // async (ruleIds) => SourceRow[]
  getStudentCertificates, // async (studentId) => string[]
  getActiveOverrides,   // async (studentId) => OverrideRow[]
}) => Promise<EligibilityResult>
```

- `buildRuleTree()` — assembles tree from flat rows via `parent_rule_id`, sorted by `order_index`
- `evaluateNode()` — recursive ALL/ANY evaluation
  - ALL: `allEvals.every(Boolean)` (vacuous truth for empty)
  - ANY: `allEvals.length > 0 && allEvals.some(Boolean)`
  - Override: marks `overridden=true`, `overrideReason`, forces `fulfilled=true`
  - Only `status='active'` overrides apply
- `collectMissingCourses()` — recursive collection, deduplicated via `Set`
- Performance: warns if >500ms

### Step C — Eligibility Wired

`GET /enrollments/eligibility/:studentId?track_id=...` replaced hardcoded `{is_eligible:false, missing_prerequisites:['course-1','course-2']}` with real `evaluateTrackEligibility()` call. Validates student exists and is enrolled before evaluating.

### Step D — Routes + Progress

**Overrides** (`routes/overrides.ts`):
- `GET /overrides` — paginated, filterable by `student_id` + `status`
- `POST /overrides` — validates reason≥10 chars, unique active per (student,rule)
- `PUT /overrides/:id/revoke` — sets `status='revoked'`, `revoked_at=now`

**Rules** (`routes/rules.ts`):
- POST/PUT support `parent_rule_id` + `order_index`
- `POST /evaluate` uses real engine with `supabaseAdmin` for DB queries

**Progress** (`routes/students.ts`):
- `GET /:id/progress` aggregates from enrollments + certificates + courses
- Returns `totalModules`, `completedModules`, `totalCredits`, `accumulatedCredits`, `progressPercentage`, `nextSteps`

**Prerequisites** (`routes/courses.ts`):
- `GET /:id/prerequisites` builds recursive tree via `buildRuleTree()` for display

### Step E — Unit Tests

`services/rule-engine.test.ts` — 23 tests, all passing:
- Empty rules → eligible
- ALL (all passed, one missing, no sources)
- ANY (one passed, none passed, no sources)
- Active override bypass
- Multiple root rules (all pass, one fails)
- 2-level nesting (ALL→ALL, ALL→child fails)
- ANY parent with mixed children
- 3-level deep nesting
- Override on nested child propagates up
- Revoked/expired overrides ignored
- ALL with sources AND children (both must pass)
- Missing prerequisites deduplication
- EvaluatedAt timestamp

**Coverage**: 99.21% lines / 95.24% functions (Bun test runner)

## Key Files

| File | Status |
|------|--------|
| `services/rule-engine.ts` | Created |
| `services/rule-engine.test.ts` | Created |
| `routes/overrides.ts` | Created |
| `routes/rules.ts` | Modified — recursive support |
| `routes/enrollments.ts` | Modified — real eligibility |
| `routes/students.ts` | Modified — real progress |
| `routes/courses.ts` | Modified — tree prerequisites |
| `index.ts` | Modified — overrides routes |
| `db/supabase.ts` | Modified — updated types |
| `supabase/migrations/002_phase3_rule_engine.sql` | Created + applied |
