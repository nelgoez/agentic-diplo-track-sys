# DTS-RULE-3 — Implementation Plan

**Status**: Complete
**Date**: 27/5/2026

## Scope
Manual override CRUD. Coordinator creates override for (student, rule) with reason + optional expiry. Revoke support. Unique active override constraint.

## Pre-fix State
No override routes existed. `manual_overrides` table had wrong schema (`course_id` + `action` enum, no `rule_id`, no `expires_at`, no `status`).

## Implementation

### Schema Migration
- DROPPED `course_id`, `action`
- ADDED `rule_id UUID FK→prerequisite_rules`, `expires_at`, `status` (active/expired/revoked), `revoked_at`, `updated_at`
- Partial unique index: `UNIQUE(student_id, rule_id) WHERE status = 'active'`

### Routes (`routes/overrides.ts`)
- `GET /overrides` — paginated, filterable by `student_id` + `status`. Returns student + rule context.
- `POST /overrides` — Zod-validated input (`student_id`, `rule_id`, `reason` min 10 chars, `expires_at` optional). Checks no existing active override → 409.
- `PUT /overrides/:id/revoke` — sets `status='revoked'`, `revoked_at=now`. Guards: override must exist and be active.

### DB Type Update
`supabase.ts` `Database` interface updated: `rule_id` (replaces `course_id`), `status` (replaces `action`), `expires_at`, `revoked_at`, `updated_at`.

## Files
- `routes/overrides.ts` — created
- `index.ts` — route registered
- `db/supabase.ts` — types updated

## Verification
- [x] TypeScript typecheck passes
- [x] Partial unique index applied
- [ ] Manual: create override, verify rule engine applies it
- [ ] Manual: revoke override, verify rule engine ignores it
