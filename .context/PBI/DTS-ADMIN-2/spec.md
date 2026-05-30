# DTS-ADMIN-2 — Admin Student Detail Spec

**Phase**: 5 (Admin & Integration Sync)
**Effort**: 3 SP

## Acceptance Criteria

### AC1: Full Student Profile
**Given** an admin or sysadmin user
**And** a student record exists with ID `:id`
**When** calling `GET /api/v1/admin/students/:id`
**Then** response returns 200 with unified student profile containing:

| Field | Description |
|-------|-------------|
| `student` | Student personal data: id, email, first_name, last_name, document_number, student_id (legajo), is_active, created_at |
| `certificates` | Array of certificates with course name, issue_date, provider, status, qualification |
| `enrollments` | Array of enrollments with track name, course name, enrollment status, exam_status, exam_date, exam_grade, graded_at |
| `overrides` | Array of manual overrides: rule_id, reason, status (active/expired/revoked), created_at, expires_at |
| `exam_history` | Subset of enrollments where exam_status is not null, sorted by exam_date DESC (alternative: reuse enrollments array filtered) |

### AC2: Student Not Found
**Given** a student ID that does not exist
**When** calling `GET /api/v1/admin/students/:id`
**Then** response returns 404 with `{ error: "Student not found" }`

### AC3: Auth
**Given** unauthenticated request → 401
**Given** estudiante or coordinador role → 403
**Given** admin or sysadmin role → allowed

### AC4: Performance
**Given** a student with many certificates and enrollments
**When** calling the endpoint
**Then** all 4 queries (student, certificates, enrollments, overrides) run in parallel via `Promise.all`
**And** response time is < 500ms under normal load
