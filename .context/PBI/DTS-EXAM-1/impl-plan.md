# DTS-EXAM-1 — Implementation Plan

**Status**: Complete
**Date**: 27/5/2026

## Scope
Student progress API: TrackProgress with totalModules, completedModules, per-module status, nextSteps. Combines courses + certificates data.

## Pre-fix State
`GET /students/:id/progress` returned hardcoded `courses_total: 5`, `credits_required: 20`, `credits_accumulated: certificatesCount * 4`.

## Implementation

### Real Data Aggregation
1. Fetch student (validation)
2. Fetch enrollments with joined course data (name, code, credits, order_index)
3. Fetch approved certificates for student
4. Build `modules[]` — per-course status:
   - `completed` if certificate exists
   - `in_progress` if enrollment status is `'in_progress'`
   - `pending` otherwise
5. Calculate: `totalModules`, `completedModules`, `totalCredits`, `accumulatedCredits`, `progressPercentage`
6. `nextSteps` — list of incomplete course names (max 5)

## Files
- `routes/students.ts` — modified

## Verification
- [x] TypeScript typecheck passes
- [ ] Manual: verify progress with real enrollments and certificates
