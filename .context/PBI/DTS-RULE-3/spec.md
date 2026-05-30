# DTS-RULE-3: Manual Override CRUD

> Phase: 3 (Rule Engine) · Effort: 5 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: Coordinator creates an override for a student and rule
- **Given** a student is enrolled in a track
- **And** a prerequisite rule exists for that track
- **And** the authenticated user is a coordinator for that track
- **When** the coordinator sends POST /overrides with `{ studentId, ruleId, reason: "Medical exception granted by faculty", expiresAt: "2026-12-31" }`
- **Then** a new `manual_overrides` record is created with status "active"
- **And** the override includes the coordinator as `created_by`
- **And** HTTP 201 is returned with the created override

### Scenario: Coordinator creates an override without expiry
- **Given** all prerequisites are met
- **When** the coordinator sends POST /overrides without `expiresAt`
- **Then** the override is created with `expiresAt: null` (permanent until revoked)
- **And** status is "active"

### Scenario: Duplicate active override is rejected
- **Given** an active override already exists for the combination (student, rule)
- **When** the coordinator attempts to create another override for the same (student, rule)
- **Then** HTTP 409 Conflict is returned
- **And** the error message indicates "an active override already exists"

### Scenario: Override is immediately reflected in rule evaluation
- **Given** a student is not eligible for a track because they lack a required certificate
- **When** a coordinator creates an active override for the blocking rule
- **And** the eligibility is re-evaluated
- **Then** the student is now eligible
- **And** the evaluation result references the override

### Scenario: Coordinator revokes an override
- **Given** an active override exists
- **When** the coordinator sends PUT /overrides/:id/revoke
- **Then** the override's status changes to "revoked"
- **And** `revoked_at` is set to the current timestamp
- **And** subsequent rule evaluations no longer apply this override

### Scenario: Non-coordinator cannot create overrides
- **Given** the authenticated user has role "estudiante"
- **When** POST /overrides is sent
- **Then** HTTP 403 Forbidden is returned

### Scenario: Override reason must be at least 10 characters
- **Given** the coordinator provides a reason shorter than 10 characters
- **When** POST /overrides is sent
- **Then** HTTP 400 Bad Request is returned
- **And** the error message indicates the minimum reason length

### Scenario: Override for non-existent student returns 404
- **Given** the `studentId` does not correspond to any student
- **When** POST /overrides is sent
- **Then** HTTP 404 Not Found is returned

### Scenario: Override for non-existent rule returns 404
- **Given** the `ruleId` does not correspond to any rule
- **When** POST /overrides is sent
- **Then** HTTP 404 Not Found is returned

### Scenario: List overrides for a student
- **Given** a student has multiple overrides (active, revoked, expired)
- **When** GET /overrides?studentId=:id is sent
- **Then** all overrides for that student are returned
- **And** each override includes its status, reason, and rule information

### Scenario: Expired overrides are auto-deactivated by cron
- **Given** an active override has `expires_at` in the past
- **When** the daily cron job runs
- **Then** the override's status changes to "expired"
- **And** the student's eligibility is re-evaluated
- **And** any resulting eligibility change is reflected
