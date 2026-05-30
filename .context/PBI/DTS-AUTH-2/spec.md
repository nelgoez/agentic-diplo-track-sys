# DTS-AUTH-2: JWT authentication (login + refresh + logout)

> Phase: 1 (Foundation) · Effort: 5 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: Successful login returns access and refresh tokens
- **Given** a registered user with valid credentials
- **When** the user sends `POST /auth/login` with email and password
- **Then** the response returns HTTP 200 with an access token and a refresh token
- **And** the access token contains the user's ID, email, and role in its payload
- **And** the refresh token is stored securely for later use

### Scenario: Token refresh returns a new token pair
- **Given** a valid refresh token belonging to an authenticated user
- **When** the user sends `POST /auth/refresh` with the refresh token
- **Then** the response returns HTTP 200 with a new access token and a new refresh token
- **And** the previous refresh token is revoked and can no longer be used

### Scenario: Logout revokes the refresh token
- **Given** an authenticated user with a valid refresh token
- **When** the user sends `POST /auth/logout` with the refresh token
- **Then** the refresh token is revoked
- **And** subsequent attempts to use the revoked refresh token return HTTP 401

### Scenario: Login rate limiting blocks brute force attempts
- **Given** a registered user with valid credentials
- **When** the client sends more than 5 failed login attempts within 15 minutes
- **Then** further login attempts within that window return HTTP 429 Too Many Requests
- **And** the rate limit resets after the 15-minute window expires

## Open Questions
- None

## Notes
- Implementation commit: See impl-plan.md
- Uses Supabase Auth GoTrue under the hood with custom JWT claims
