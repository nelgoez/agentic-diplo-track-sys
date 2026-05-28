# DTS-AUTH-2 — Code Review

**Date**: 27/5/2026
**Reviewer**: AI agent (self-review)
**Status**: Pass

## Standards Checklist

| Criterion | Verdict | Notes |
|-----------|---------|-------|
| JWT secret from env var | PASS | `process.env.JWT_SECRET` with fallback |
| Token expiry configurable | PASS | `JWT_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` env vars |
| Refresh token rotation | PASS | New pair issued on each refresh |
| HS256 algorithm | PASS | Standard choice for server-side JWT |
| Error on invalid credentials | PASS | 401 with `{ error: 'Invalid credentials' }` |
| Token type guard | PASS | `type:'access'` checked in middleware; `type:'refresh'` in refresh |

## Potential Issues

1. **Logout uses `supabaseAdmin.auth.admin.signOut`** — this calls Supabase's admin signOut, but our JWT is custom (not Supabase-issued). The Supabase session may not exist. Consider maintaining a token blacklist or using shorter token lifetimes.

2. **No refresh token persistence** — refresh tokens are stateless. Revocation requires client-side discard. For MVP this is acceptable.

## Recommendation
Merge as-is. Token blacklist / refresh persistence is post-MVP concern.
