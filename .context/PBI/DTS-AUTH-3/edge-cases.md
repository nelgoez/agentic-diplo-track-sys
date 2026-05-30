# DTS-AUTH-3: Edge Cases

## Boundary Conditions
- Token with valid signature but user not in DB (auth/user sync gap): 401; middleware queries DB for user existence
- Token with `role` claim missing or empty array: 401; `requireRole` middleware rejects before handler
- Multiple roles in token: `requireRole(['admin', 'coordinador'])` passes if ANY role matches; intersection logic
- Route with no `requireRole` guard (only `authenticate`): any authenticated user passes; role not checked
- Wildcard role `*`: treated as "all roles"; passes any `requireRole` gate

## Error Paths
- Missing Authorization header: 401 `missing_token`; no fallback to cookie-based auth
- Authorization header with empty token string: 401 `empty_token`
- Token signed with wrong secret (cross-env leak): 401 `invalid_signature`; no differentiation from expired
- JWT decode fails (garbage string): 401 `malformed_token`; caught before Supabase verification
- Middleware order incorrect (requireRole before authenticate): `auth` context undefined; 500 server error + log

## Concurrency
- Role changed while request in-flight: token's `role` claim valid for that request's duration; next request picks up new role
- User deleted while request in-flight: token still valid; `authenticate` passes; `requireRole` passes; handler may fail if it queries user
