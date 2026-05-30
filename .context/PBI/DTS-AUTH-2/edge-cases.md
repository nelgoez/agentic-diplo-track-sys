# DTS-AUTH-2: Edge Cases

## Boundary Conditions
- Token at exact expiry boundary: rejected (not accepted even 1ms past `exp`); refresh endpoint returns new pair
- Extremely long email (>254 chars): rejected at input validation before Supabase call
- Password at minimum length (6 chars): accepted by Supabase; DTS adds no extra restriction
- Password at maximum length (72 chars bcrypt limit): accepted; characters beyond 72 ignored by bcrypt silently
- Refresh token rotation: old refresh token invalidated after rotation (one-time use); replay attack prevented
- Rate limit at exactly 5 attempts / 15min window: 6th attempt returns 429; counter resets after window slides

## Error Paths
- Invalid JWT signature: 401 with `invalid_token`; no stack trace leaked
- Expired access token: 401; client must call /auth/refresh
- Malformed Authorization header (missing "Bearer " prefix): 401 with `malformed_token`
- User deactivated during active session: token still valid until expiry; /auth/me returns 403 `user_inactive`
- Supabase Auth unreachable: 503 `auth_service_unavailable`; no fallback to cached credentials

## Concurrency
- Simultaneous refresh with same old token: first succeeds + rotates; second fails (token already consumed); client retries with new token
- Login + logout concurrent: race condition — logout revokes refresh token; login wins if token stored after revoke call; mitigated by DB-level atomic upsert
