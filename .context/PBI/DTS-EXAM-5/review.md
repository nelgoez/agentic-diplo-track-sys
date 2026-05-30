# DTS-EXAM-5 — Code Review

**Date**: 2026-05-28 | **Reviewer**: QA Lead (agent)
**Status**: ✅ PASS

## Review Checklist

| Check | Status | Notes |
|-------|--------|-------|
| AC: filters to exam rows only | ✅ | `.not('exam_status', 'is', null)` when `exam_history=true` |
| AC: sorted by date descending | ✅ | `.order('exam_date', { ascending: false })` |
| AC: includes exam_status, exam_date, qualification | ✅ | `*` wildcard pulls all columns |
| AC: joined course/track names | ✅ | `course:courses(id, name, code)`, `track:tracks(id, name)` |
| Auth middleware | ✅ | `enrollments.use('/*', authenticate)` active |
| supabaseAdmin usage | ✅ | Cross-student exam history reads need RLS bypass |
| Smoke tested | ✅ | 1 exam row returned after grading, 0 before |

## Findings

### No issues found

1. `exam_history=true` query param correctly gates the `.not('exam_status', 'is', null)` filter.
2. Sort changed from `created_at` to `exam_date` — matches AC: "Sorted by date descending."
3. Response includes `exam_status`, `exam_date`, `qualification` via `*` wildcard — all AC fields present.
4. Joined data includes student name/email, course name/code, track name — correct per AC.
5. Without `exam_history=true`, the endpoint works as a general enrollment list (backward compatible).
6. Uses `supabaseAdmin` consistently for cross-user queries.

## Sign-off

All AC met. Ready for staging.
