# DTS-CORE-3: Students CRUD (list, get, search)

> Phase: 2 (Core Domain) · Effort: 3 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: Admin lists students with pagination
- **Given** multiple student records exist in the database
- **When** an authenticated admin or coordinator sends `GET /students?page=1&limit=20`
- **Then** the response returns a paginated list of students
- **And** each student includes id, email, first_name, last_name, document_number, and student_id (legajo)
- **And** pagination metadata includes total count, current page, and total pages

### Scenario: Search students by name, email, or DNI
- **Given** students with names "María García", "Carlos López", and "Ana Martínez" exist
- **When** a coordinator sends `GET /students?search=garcía`
- **Then** the response returns only students matching the search term (case-insensitive) in name, email, or DNI fields
- **And** "María García" is included, while "Carlos López" and "Ana Martínez" are excluded

### Scenario: Get student detail with full profile
- **Given** a student with known ID `student-001` exists
- **When** an admin sends `GET /students/student-001`
- **Then** the response returns the complete student profile
- **And** includes all fields: email, first_name, last_name, document_number, student_id, is_active, created_at

### Scenario: Create student record with required fields
- **Given** an authenticated admin user
- **When** the admin sends `POST /students` with email, first_name, last_name, and document_number
- **Then** a new student record is created with HTTP 201
- **And** the response includes the generated student ID and all fields
- **And** duplicate email is rejected with HTTP 409

## Open Questions
- None

## Notes
- Implementation commit: See impl-plan.md
- Search is case-insensitive partial match across name, email, DNI
