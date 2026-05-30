# DTS-ADMIN-2 — Implementation Plan

**Status**: Todo
**Date**: 28/5/2026

## Scope
Admin student detail endpoint: returns full student profile including certificates, enrollments, overrides, and exam history in a single response.

## Prerequisites
- `DTS-CORE-3` (Students CRUD) — DONE
- `DTS-CORE-5` (Certificate list) — DONE
- `DTS-RULE-3` (Manual overrides) — DONE
- `DTS-EXAM-5` (Exam history) — DONE

## Implementation

### 1. Route: GET /api/v1/admin/students/:id
- File: `server/src/routes/admin.ts` (extend existing or new)
- Middleware: `authenticate` + `requireRole('admin', 'sysadmin')`

### 2. Parallel Queries
Run 4 queries simultaneously via `Promise.all`:

```
const [student, certificates, enrollments, overrides] = await Promise.all([
  supabaseAdmin.from('students').select('*').eq('id', id).single(),
  supabaseAdmin.from('certificates')
    .select('*, courses!inner(name)')
    .eq('student_id', id)
    .order('issued_at', { ascending: false }),
  supabaseAdmin.from('enrollments')
    .select('*, courses!inner(name), tracks!inner(name)')
    .eq('student_id', id)
    .order('created_at', { ascending: false }),
  supabaseAdmin.from('manual_overrides')
    .select('*, prerequisite_rules!inner(target_course_id)')
    .eq('student_id', id)
    .order('created_at', { ascending: false }),
])
```

### 3. Response Transformation
- Flatten join results: `certificates.courses.name` → `course_name`
- Flatten enrollment joins: `enrollments.courses.name` → `course_name`, `enrollments.tracks.name` → `track_name`
- Exam history is automatically covered by `enrollments` array (filtered where `exam_status` is not null)
- Return unified object:
```json
{
  "student": { ... },
  "certificates": [ { id, course_name, issued_at, provider, status, qualification } ],
  "enrollments": [ { id, track_name, course_name, status, exam_status, exam_date, exam_grade, graded_at } ],
  "overrides": [ { id, rule_id, reason, status, created_at, expires_at } ]
}
```

### 4. Auth
- `authenticate` middleware for all
- `requireRole('admin', 'sysadmin')` gated

## Files
- `routes/admin.ts` — add GET /:id endpoint (or new file if admin.ts doesn't exist)

## Edge Cases
| Case | Handling |
|------|----------|
| Student ID not found | 404 |
| Student has no certificates | Return empty `certificates: []` |
| Student has no enrollments | Return empty `enrollments: []` |
| Student has no overrides | Return empty `overrides: []` |
| UUID format invalid | 400 Bad Request (Zod validation) |

## Review Workload Forecast
Estimated: ~80 additions to existing/new file
400-line budget risk: Low
