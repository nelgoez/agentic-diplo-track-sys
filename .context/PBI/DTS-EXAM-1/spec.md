# DTS-EXAM-1: Student Progress API

> Phase: 4 (Enrollment & Exam) · Effort: 5 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: Get student progress for an enrolled track
- **Given** a student is enrolled in a track with 10 courses
- **And** the student has approved certificates for 4 of those courses
- **When** GET /students/:id/progress is called
- **Then** the response includes `totalModules: 10` and `completedModules: 4`
- **And** each module has a status (completed, in_progress, pending, or error)
- **And** modules with certificates show status "completed"
- **And** modules without certificates show status "pending"

### Scenario: Student progress includes certificate status breakdown
- **Given** a student has certificates in various states (active, error)
- **When** the progress endpoint is queried
- **Then** certificates with status "active" map to module status "completed"
- **And** certificates with status "error" map to module status "error"
- **And** courses without any certificate record map to "pending"

### Scenario: Student progress includes next steps
- **Given** a student has completed 4 out of 10 modules
- **When** GET /students/:id/progress is called
- **Then** the response includes `nextSteps` array
- **And** next steps include the pending modules ordered by `order_index`

### Scenario: Progress for a student enrolled in multiple tracks
- **Given** a student is enrolled in two tracks
- **When** GET /students/:id/progress is called without a track filter
- **Then** progress for all enrolled tracks is returned
- **And** each track includes its own totalModules, completedModules, and module breakdown

### Scenario: Progress filtered by track
- **Given** a student is enrolled in tracks A and B
- **When** GET /students/:id/progress?trackId={trackA.id} is called
- **Then** only progress for track A is returned

### Scenario: Student not enrolled in any track
- **Given** a student exists but has no enrollments
- **When** GET /students/:id/progress is called
- **Then** an empty progress list is returned
- **And** HTTP 200 is returned

### Scenario: Non-existent student returns 404
- **Given** the student ID does not correspond to any student
- **When** GET /students/:id/progress is called
- **Then** HTTP 404 Not Found is returned

### Scenario: Unauthorized access is rejected
- **Given** the authenticated user has no access rights to view the student's progress
- **When** GET /students/:id/progress is called
- **Then** HTTP 403 Forbidden is returned
