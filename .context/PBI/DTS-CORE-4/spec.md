# DTS-CORE-4: Enrollment (single student to track)

> Phase: 2 (Core Domain) · Effort: 3 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: Coordinator enrolls an existing student in a track
- **Given** an existing student and an active track
- **When** an authenticated coordinator sends `POST /enrollments` with `student_id` and `track_id`
- **Then** an enrollment record is created with status `active`
- **And** the response returns HTTP 201 with enrollment ID, student_id, track_id, and status

### Scenario: Duplicate enrollment is rejected
- **Given** a student is already enrolled in a track
- **When** a coordinator attempts to enroll the same student in the same track again
- **Then** the unique constraint on (student_id, track_id) is enforced
- **And** the response returns HTTP 409 Conflict with a message indicating the student is already enrolled

### Scenario: Student is created first if they do not exist
- **Given** a new student with email `new@example.com` does not exist in the students table
- **When** a coordinator enrolls `new@example.com` in a track (auto-create mode)
- **Then** a new student record is created automatically
- **And** the enrollment record is created with status `active`
- **And** the response returns HTTP 201 with both the created student and enrollment details

### Scenario: Enrollment requires coordinator role authorization
- **Given** an authenticated user with role `estudiante`
- **When** the user attempts `POST /enrollments`
- **Then** the RBAC middleware returns HTTP 403 Forbidden
- **And** no enrollment record is created

## Open Questions
- None

## Notes
- Implementation commit: See impl-plan.md
- Unique constraint: (student_id, track_id)
- Auto-create student on enrollment if using email and student not found
