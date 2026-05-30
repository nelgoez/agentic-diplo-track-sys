# DTS-CORE-5: Certificate list + get by ID

> Phase: 2 (Core Domain) · Effort: 2 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: List certificates for a student with pagination
- **Given** a student with multiple certificates from different courses
- **When** `GET /students/:id/certificates?page=1&limit=10` is called
- **Then** the response returns a paginated list of certificates
- **And** each certificate includes id, course_name, issue_date, provider, and status

### Scenario: Get certificate detail by ID
- **Given** a certificate record with known ID `cert-001`
- **When** `GET /certificates/cert-001` is called
- **Then** the response returns the full certificate detail
- **And** includes course_name, issue_date, provider, status, student_id, external_id, and metadata

### Scenario: Empty certificate list for student with no certificates
- **Given** a student with no certificates
- **When** `GET /students/:id/certificates` is called
- **Then** the response returns HTTP 200 with an empty list
- **And** pagination metadata shows total count of 0

### Scenario: Certificate status reflects sync state
- **Given** certificates with different statuses (active, pending, error) exist
- **When** listing certificates for a student
- **Then** each certificate displays its correct status
- **And** certificates with status `error` include an error_message field

## Open Questions
- None

## Notes
- Implementation commit: See impl-plan.md
- Certificates are never hard-deleted; status reflects lifecycle (active/pending/error)
