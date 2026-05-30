# DTS-INT-3: Integration logs table + logging middleware

> Phase: 1 (Foundation) · Effort: 2 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: integration_logs table is seeded and ready for use
- **Given** the migration `001_initial_schema.sql` has been applied
- **When** the `integration_logs` table is inspected
- **Then** it contains columns: id, provider, action, status, started_at, completed_at, duration_ms, students_processed, students_new, students_updated, errors_count, error_details, triggered_by
- **And** appropriate indexes exist on (provider, created_at)

### Scenario: logSyncStart records the beginning of a sync operation
- **Given** a sync operation is about to begin for provider `moodle`
- **When** `logSyncStart({ provider: 'moodle', triggered_by: 'user-123' })` is called
- **Then** a new row is inserted in `integration_logs` with status `processing` and `started_at` set to the current timestamp
- **And** the returned log entry includes the generated ID

### Scenario: logSyncComplete records successful sync completion with summary
- **Given** a sync operation with ID `log-456` has completed processing 200 students (50 new, 150 updated) with 3 errors
- **When** `logSyncComplete({ logId: 'log-456', studentsProcessed: 200, studentsNew: 50, studentsUpdated: 150, errorsCount: 3 })` is called
- **Then** the `integration_logs` row is updated with status `completed`, `completed_at` set, `duration_ms` calculated, and all counters populated
- **And** the status transitions from `processing` to `completed`

### Scenario: logPerStudent records per-student sync outcomes during batch
- **Given** a sync operation processing student `s-789`
- **When** `logPerStudent({ logId: 'log-456', studentId: 's-789', status: 'updated' })` is called
- **Then** the per-student outcome is recorded (either via error_details JSONB append or separate mechanism)
- **And** errors per student are captured with the student ID and error message

## Open Questions
- None

## Notes
- Implementation commit: See impl-plan.md
- Logs retained for 90 days; cleanup handled post-MVP
