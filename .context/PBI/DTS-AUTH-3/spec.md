# DTS-AUTH-3: RBAC middleware (authenticate + requireRole)

> Phase: 1 (Foundation) · Effort: 3 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: Authenticate middleware validates JWT and injects context
- **Given** a request with a valid JWT in the Authorization header
- **When** the `authenticate` middleware processes the request
- **Then** the JWT is validated and decoded
- **And** the `auth` context object containing user ID, email, and role is injected into the request
- **And** the request proceeds to the protected route handler

### Scenario: Missing or invalid token returns 401
- **Given** a request to a protected endpoint
- **When** the request has no Authorization header or an invalid/expired token
- **Then** the `authenticate` middleware returns HTTP 401 Unauthorized
- **And** the request does not reach the protected route handler

### Scenario: requireRole gate allows access for sufficient role
- **Given** an authenticated user with role `admin`
- **When** a route protected with `requireRole(['admin'])` is accessed
- **Then** the request proceeds to the route handler

### Scenario: requireRole gate blocks access for insufficient role
- **Given** an authenticated user with role `estudiante`
- **When** a route protected with `requireRole(['admin', 'coordinador'])` is accessed
- **Then** the middleware returns HTTP 403 Forbidden
- **And** the request does not reach the route handler

## Open Questions
- None

## Notes
- Implementation commit: See impl-plan.md
- Role enum: estudiante, coordinador, admin, sysadmin
