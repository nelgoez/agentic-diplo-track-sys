# DTS-EXAM-5: Exam History View

> Phase: 4 (Enrollment & Exam) · Effort: 3 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: View exam history for a student
- **Given** a student has multiple exam attempts across different courses
- **When** GET /enrollments?studentId=:id is called
- **Then** all exam attempts are returned sorted by date descending
- **And** each attempt includes `exam_date`, `exam_grade`, `exam_status`, `course_name`, and `track_name`

### Scenario: Exam history shows passing and failing attempts
- **Given** a student has one "aprobado" attempt and one "desaprobado" attempt
- **When** the exam history is queried
- **Then** both attempts are included
- **And** each shows its respective status, grade, and date

### Scenario: Exam history sorted by date descending
- **Given** a student has exam attempts on 2025-03-01, 2025-06-15, and 2025-01-10
- **When** the exam history is retrieved
- **Then** the order is 2025-06-15 first, then 2025-03-01, then 2025-01-10 last

### Scenario: Exam history includes diploma status for aprobado attempts
- **Given** a student has an "aprobado" exam with diploma pending
- **When** the exam history is viewed
- **Then** the attempt shows `diploma_status: "pendiente"`
- **And** the diploma status is clearly displayed

### Scenario: Exam history filtered by track
- **Given** a student has exam attempts in track A and track B
- **When** GET /enrollments?studentId=:id&trackId={trackA.id} is called
- **Then** only attempts from track A are returned

### Scenario: Exam history with no attempts
- **Given** a student has never taken an exam
- **When** GET /enrollments?studentId=:id is called
- **Then** an empty list is returned
- **And** HTTP 200 is returned

### Scenario: Student can view their own exam history
- **Given** the authenticated user is the student (role: estudiante)
- **When** GET /enrollments?studentId={ownId} is called
- **Then** their exam history is returned

### Scenario: Student cannot view another student's exam history
- **Given** the authenticated user is a student
- **When** GET /enrollments?studentId={otherStudentId} is called
- **Then** HTTP 403 Forbidden is returned

### Scenario: Coordinator can view exam history for students in their track
- **Given** the authenticated user is a coordinator for track A
- **When** GET /enrollments?studentId={studentInTrackA.id} is called
- **Then** the exam history is returned

### Scenario: Non-existent student returns 404
- **Given** the student ID does not exist
- **When** GET /enrollments?studentId={nonExistentId} is called
- **Then** HTTP 404 Not Found is returned
