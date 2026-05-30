# DTS-CORE-6: Batch enrollment from CSV

> Phase: 2 (Core Domain) · Effort: 5 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: Batch enroll valid CSV with existing students
- **Given** a CSV file with email column containing 20 existing student emails
- **When** a coordinator sends `POST /enrollments/batch` with the CSV file and `track_id`
- **Then** the response returns a summary with: 0 created, 20 enrolled, 0 already enrolled, and 0 errors
- **And** all 20 enrollment records are created with status `active`

### Scenario: Batch enroll CSV creates new students automatically
- **Given** a CSV file with 5 emails, of which 2 are existing students and 3 are new
- **When** `POST /enrollments/batch` is called with the CSV
- **Then** 3 new student records are created
- **And** the response summary shows: 3 created, 2 enrolled, 0 already enrolled, 0 errors
- **And** all 5 students are enrolled in the track

### Scenario: Batch enroll skips already-enrolled students
- **Given** a CSV with 10 emails, of which 4 are already enrolled in the target track
- **When** `POST /enrollments/batch` is called
- **Then** the 4 already-enrolled students are skipped without error
- **And** the summary shows: 4 already enrolled
- **And** the remaining 6 are enrolled normally

### Scenario: Batch enroll reports errors without aborting the entire batch
- **Given** a CSV with 10 emails, of which 2 are malformed (invalid email format)
- **When** `POST /enrollments/batch` is called
- **Then** the valid 8 emails are processed and enrolled
- **And** the 2 invalid rows are reported in the errors array with row numbers and error messages
- **And** the summary shows: 8 enrolled, 2 errors
- **And** the overall response is HTTP 200 (partial success)

## Open Questions
- None

## Notes
- Implementation commit: See impl-plan.md
- CSV format: only `email` column required
- Idempotent: running the same CSV multiple times safely skips already-enrolled students
