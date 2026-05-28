# DTS-AUTH-2 — Implementation Plan

**Status**: Complete
**Date**: 27/5/2026

## Scope
Implement real JWT authentication: login, token refresh with rotation, logout, and `/me` endpoint.

## Pre-fix State
All 4 endpoints returned hardcoded placeholder data. No Supabase Auth integration. No JWT creation/verification via `jose`.

## Implementation

### Login Flow
1. `supabase.auth.signInWithPassword({ email, password })`
2. Look up role from `students` table by email
3. Create access JWT (`jose.SignJWT`) with `{ sub, email, role, type:'access' }`, expiry 15m
4. Create refresh JWT with `{ sub, email, role, type:'refresh' }`, expiry 7d
5. Return tokens + user object

### Refresh Flow
1. `jose.jwtVerify(refresh_token)` — validate HS256
2. Verify `type === 'refresh'`
3. Issue new access + refresh pair (rotation)

### Logout
1. Extract token from Authorization header
2. `supabaseAdmin.auth.admin.signOut(userId)` — revoke Supabase session

### /me
1. Read `auth` context from middleware
2. Look up student details from `students` table
3. Return user profile

### Middleware
- `authenticate`: extract Bearer token, `jose.jwtVerify` with `JWT_SECRET`, inject `{ userId, email, role }` into context
- `requireRole`: unchanged (already correct gating logic)

## Files
- `routes/auth.ts` — rewritten
- `middleware/auth.ts` — real JWT verify
- `db/supabase.ts` — added `supabaseAdmin` import to routes

## Verification
- [x] TypeScript typecheck passes
- [x] All existing route tests continue to work
- [ ] Manual: test login with real Supabase user
- [ ] Manual: test refresh with expired access token
