# DTS-AUTH-4 — Implementation Plan

**Status**: Complete
**Date**: 27/5/2026

## Scope
POST /admin/users endpoint for creating users with role assignment.

## Pre-fix State
No user creation endpoint existed. `admin.ts` had dashboard stats, student list, courses, and tracks endpoints — all read-only.

## Implementation

### POST /admin/users
1. Validate input: email (unique, format), password (≥6 chars), name (≥2 chars), role (enum), dni (optional)
2. Check email uniqueness in `students` table → 409 if exists
3. `supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true })`
4. Insert into `students` table with same UUID
5. Rollback Supabase Auth user on DB insert failure
6. Return created student (201)

### Routes
- Mounted under `/api/v1/admin/users` (admin route group)
- Protected by `authenticate` + `requireRole('admin', 'sysadmin')`

## Files
- `routes/admin.ts` — added POST /users with Zod validation

## Verification
- [x] TypeScript typecheck passes
- [ ] Manual: create user with each role type
- [ ] Manual: verify duplicate email rejection (409)
