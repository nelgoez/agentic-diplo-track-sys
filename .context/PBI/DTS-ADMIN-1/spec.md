# DTS-ADMIN-1: Admin Dashboard Stats

> Phase: 5 (Admin & Integration Sync) · Effort: 5 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: Admin retrieves dashboard statistics
- **Given** the authenticated user has role "admin" or "sysadmin"
- **When** GET /admin/dashboard-stats is called
- **Then** the response includes real-time counts for:
  - `totalStudents`
  - `activeStudents`
  - `activeTracks`
  - `totalCertificates`
  - `eligibleCount`
  - `notEligibleCount`
  - `recentSyncErrors`
- **And** all counts are non-negative integers

### Scenario: totalStudents reflects all student records
- **Given** 50 student records exist in the database (active and inactive)
- **When** GET /admin/dashboard-stats is called
- **Then** `totalStudents` equals 50

### Scenario: activeStudents reflects only active students
- **Given** 50 total students exist, 10 of which have `is_active: false`
- **When** GET /admin/dashboard-stats is called
- **Then** `activeStudents` equals 40

### Scenario: activeTracks reflects only active tracks
- **Given** 8 tracks exist, 2 of which have `status: "inactive"`
- **When** GET /admin/dashboard-stats is called
- **Then** `activeTracks` equals 6

### Scenario: totalCertificates reflects all active certificates
- **Given** 200 certificate records exist (some with status "error" or "pending")
- **When** GET /admin/dashboard-stats is called
- **Then** `totalCertificates` counts only certificates with status "active"

### Scenario: eligibleCount and notEligibleCount are computed from rule engine
- **Given** 40 active students enrolled in tracks with prerequisite rules
- **And** the rule engine evaluates eligibility for each enrollment
- **When** GET /admin/dashboard-stats is called
- **Then** `eligibleCount` + `notEligibleCount` ≤ total enrollments
- **And** both values reflect current eligibility state

### Scenario: recentSyncErrors counts recent failed integrations
- **Given** 3 integration log entries exist with status "error" from the last 24 hours
- **When** GET /admin/dashboard-stats is called
- **Then** `recentSyncErrors` equals 3

### Scenario: Non-admin user is rejected
- **Given** the authenticated user has role "coordinador"
- **When** GET /admin/dashboard-stats is called
- **Then** HTTP 403 Forbidden is returned

### Scenario: Unauthenticated access is rejected
- **Given** no valid JWT is provided
- **When** GET /admin/dashboard-stats is called
- **Then** HTTP 401 Unauthorized is returned

### Scenario: Dashboard stats with no data (empty database)
- **Given** the database has no students, tracks, certificates, or integration logs
- **When** GET /admin/dashboard-stats is called
- **Then** all counts are zero
- **And** HTTP 200 is returned
