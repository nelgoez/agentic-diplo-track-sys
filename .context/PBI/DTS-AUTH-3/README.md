# DTS-AUTH-3 — RBAC middleware (authenticate + requireRole)

**Phase**: 1 — Foundation
**Effort**: 3 SP
**Dependencies**: DTS-AUTH-2

**Acceptance Criteria:**
- `authenticate` middleware validates JWT and injects `auth` context.
- `requireRole(roles[])` gate works on test endpoints.
- 401 for missing/invalid token.
- 403 for insufficient role.
