# DTS-EXAM-2: Eligibility Check on Dashboard

> Phase: 4 (Enrollment & Exam) · Effort: 5 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: Check eligibility for an enrolled student
- **Given** a student is enrolled in a track with prerequisite rules
- **And** the student has certificates satisfying all rules
- **When** GET /enrollments/eligibility/:studentId is called
- **Then** the response includes `eligible: true`
- **And** a breakdown of each rule's evaluation is included
- **And** each rule shows its type (ALL/ANY), satisfied status, and child results

### Scenario: Eligibility check returns not eligible with reasons
- **Given** a student does not meet all prerequisite rules
- **When** GET /enrollments/eligibility/:studentId is called
- **Then** the response includes `eligible: false`
- **And** the breakdown clearly shows which rules are not satisfied
- **And** each unsatisfied leaf node shows the missing course name

### Scenario: Eligibility check respects active overrides
- **Given** a student has an active override for a blocking rule
- **When** GET /enrollments/eligibility/:studentId is called
- **Then** the rule is marked as satisfied due to override
- **And** the override reason is included in the breakdown

### Scenario: Eligibility check is real-time (no stale cache)
- **Given** a student's eligibility is evaluated and found not eligible
- **And** a new certificate is imported for the missing course
- **When** GET /enrollments/eligibility/:studentId is called again
- **Then** the result is `eligible: true` (reflects the new certificate immediately)

### Scenario: Eligibility for student enrolled in multiple tracks
- **Given** a student is enrolled in track A and track B
- **When** GET /enrollments/eligibility/:studentId is called
- **Then** eligibility for both tracks is returned
- **And** each track has its own `eligible` flag and breakdown

### Scenario: Eligibility filtered by track
- **Given** a student is enrolled in tracks A and B
- **When** GET /enrollments/eligibility/:studentId?trackId={trackA.id} is called
- **Then** only eligibility for track A is returned

### Scenario: Student with no enrollments
- **Given** a student exists but is not enrolled in any track
- **When** GET /enrollments/eligibility/:studentId is called
- **Then** an empty eligibility list is returned
- **And** HTTP 200 is returned

### Scenario: Coordinator can view any student's eligibility
- **Given** the authenticated user is a coordinator
- **When** GET /enrollments/eligibility/:studentId is called for a student in their track
- **Then** the full eligibility breakdown is returned

### Scenario: Student can only view their own eligibility
- **Given** the authenticated user is a student (role: estudiante)
- **When** GET /enrollments/eligibility/:otherStudentId is called
- **Then** HTTP 403 Forbidden is returned

### Scenario: Non-existent student returns 404
- **Given** the student ID does not exist
- **When** GET /enrollments/eligibility/:studentId is called
- **Then** HTTP 404 Not Found is returned
