# DTS-EXAM-3 — Implementation Plan

**Status**: In Progress
**Date**: 28/5/2026

## Scope
Exam registration endpoint: validate eligibility, set exam_status=inscripto, reject if not eligible or duplicate date.

## DB Migration
- Added `exam_status` (text, nullable) and `exam_date` (date, nullable) to `enrollments`
- Check constraint: exam_status IN (null, 'inscripto', 'aprobado', 'desaprobado')
- Partial unique index on (student_id, exam_date) WHERE both NOT NULL

## Implementation

### Endpoint
`PUT /enrollments/:id/exam` — exam registration

1. Authenticate via `authenticate` middleware (already on group)
2. Require role: coordinador, admin, sysadmin
3. Find enrollment by ID (404 if not found)
4. Check eligibility via `evaluateTrackEligibility` (same as DTS-EXAM-2)
5. If not eligible → 409 with eligibility result
6. Check duplicate: same student_id + exam_date already exists → 409
7. Update: exam_status = 'inscripto', exam_date = body.exam_date
8. Return 200 with updated enrollment

### Files
- `server/src/routes/enrollments.ts` — add PUT /:id/exam handler
- `server/src/db/database.types.ts` — updated with exam columns

### Edge cases
- Enrollment has no exam_status yet (first registration): OK
- Re-registration to change date: unique check catches same date
- Eligible but no rules exist for track: edge case, treat as eligible (empty rules = no prereqs)

## Verification
- [ ] POST /enrollments/:id/exam with valid data → 200
- [ ] POST /enrollments/:id/exam for ineligible student → 409
- [ ] POST /enrollments/:id/exam for duplicate date → 409
- [ ] POST /enrollments/:id/exam for non-existent enrollment → 404
- [ ] TypeScript typecheck passes
- [ ] Existing tests pass

## Review Workload Forecast

Estimated: ~40 additions + ~5 deletions = ~45 total lines
400-line budget risk: Low
Chain strategy: single-file-nested (existing route file)
Decision needed before apply: No
