# DTS-CORE-2 — Implementation Plan

**Status**: Done
**Date**: 28/5/2026

## Scope
Add create and update endpoints to existing courses route. Read endpoints already existed.

## Implementation
- `server/src/routes/courses.ts` — added POST / and PATCH /:id
- Zod validation: name, code, track_id required; credits, moodle_course_id, is_integrator_exam optional
- Auto-calculates order_index as MAX(order_index) + 1 for the track
- Validates track exists before creating
- Uses supabaseAdmin
- Auth: requireRole('admin', 'sysadmin') on mutations

## Files
- `routes/courses.ts` — added POST / (line ~55) and PATCH /:id (line ~85)

## Review Workload Forecast
Estimated: ~50 additions
400-line budget risk: Low
