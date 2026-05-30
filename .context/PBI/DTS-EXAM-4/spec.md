# DTS-EXAM-4: Grade Recording (+ Auto-Status Transition)

> Phase: 4 (Enrollment & Exam) · Effort: 5 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: Coordinator records a passing grade (≥ 4)
- **Given** an enrollment exists with `exam_status: "inscripto"`
- **When** the coordinator sends PUT /enrollments/:id/grade with `{ grade: 7 }`
- **Then** `exam_grade` is set to 7
- **And** `exam_status` transitions to "aprobado"
- **And** `diploma_pendiente` is set to true (or diploma status is triggered)
- **And** `graded_at` is set to the current timestamp
- **And** `graded_by` references the coordinator
- **And** HTTP 200 is returned

### Scenario: Coordinator records a failing grade (< 4)
- **Given** an enrollment exists with `exam_status: "inscripto"`
- **When** the coordinator sends PUT /enrollments/:id/grade with `{ grade: 2 }`
- **Then** `exam_grade` is set to 2
- **And** `exam_status` transitions to "desaprobado"
- **And** diploma is NOT triggered
- **And** `graded_at` is set to the current timestamp
- **And** HTTP 200 is returned

### Scenario: Grade exactly at the threshold (4) passes
- **Given** an enrollment exists with `exam_status: "inscripto"`
- **When** the coordinator sends PUT /enrollments/:id/grade with `{ grade: 4 }`
- **Then** `exam_grade` is set to 4
- **And** `exam_status` transitions to "aprobado"
- **And** diploma is triggered

### Scenario: Grade exactly at the threshold (3) fails
- **Given** an enrollment exists with `exam_status: "inscripto"`
- **When** the coordinator sends PUT /enrollments/:id/grade with `{ grade: 3 }`
- **Then** `exam_grade` is set to 3
- **And** `exam_status` transitions to "desaprobado"

### Scenario: Cannot grade an enrollment that is not inscripto
- **Given** an enrollment has `exam_status: "aprobado"`
- **When** the coordinator sends PUT /enrollments/:id/grade with `{ grade: 6 }`
- **Then** HTTP 400 Bad Request is returned
- **And** the error message indicates the exam is not in "inscripto" status

### Scenario: Grade outside valid range is rejected
- **Given** an enrollment exists with `exam_status: "inscripto"`
- **When** the coordinator sends PUT /enrollments/:id/grade with `{ grade: 11 }`
- **Then** HTTP 400 Bad Request is returned
- **And** the error message indicates the valid range is 1-10

### Scenario: Grade below valid range is rejected
- **Given** an enrollment exists with `exam_status: "inscripto"`
- **When** the coordinator sends PUT /enrollments/:id/grade with `{ grade: 0 }`
- **Then** HTTP 400 Bad Request is returned
- **And** the error message indicates the valid range is 1-10

### Scenario: Non-integer grade is rejected
- **Given** an enrollment exists with `exam_status: "inscripto"`
- **When** the coordinator sends PUT /enrollments/:id/grade with `{ grade: 5.5 }`
- **Then** HTTP 400 Bad Request is returned
- **And** the error message indicates the grade must be an integer

### Scenario: Grade recording creates an audit log entry
- **Given** an enrollment exists with `exam_status: "inscripto"`
- **When** the coordinator records a grade
- **Then** a new entry is created in `audit_log` table
- **And** the entry includes the enrollment's previous state (before) and new state (after)
- **And** the coordinator's user ID is recorded

### Scenario: Non-coordinator cannot record grades
- **Given** the authenticated user has role "estudiante"
- **When** PUT /enrollments/:id/grade is called
- **Then** HTTP 403 Forbidden is returned

### Scenario: Non-existent enrollment returns 404
- **Given** the enrollment ID does not exist
- **When** PUT /enrollments/:id/grade is called
- **Then** HTTP 404 Not Found is returned
