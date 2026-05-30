# DTS-INT-3: Edge Cases

## Boundary Conditions
- `integration_logs` JSONB column with deeply nested error details: stored correctly; no depth limit imposed by DB
- `students_processed` counter overflow: BIGINT used; 9 quintillion limit; no practical overflow
- Log entry with empty `error_details`: NULL preferred over `{}`; query filters use `IS NULL` not `= '{}'`
- `duration_ms` for still-running sync (no `completed_at`): NULL; dashboards show "in progress" not duration
- Triggered by user who is later deleted: `triggered_by` FK set to NULL (ON DELETE SET NULL); audit trail preserved

## Error Paths
- Log insert fails mid-sync (DB connection lost): sync continues but warning logged to console; loss of audit for that sync session
- Helper `logPerStudent` called with invalid student ID: still logged; `student_id` field nullable; not FK-enforced
- DB write timeout during high-volume logging: exponential retry at helper level (max 3); on failure, sync continues without per-student log
- JSONB column size exceeds limit (255MB per row unlikely): practical limit ~1MB for JSONB; truncate `error_details` if needed

## Concurrency
- Two syncs writing to `integration_logs` simultaneously: independent rows; no locking needed; `started_at` used for ordering
- Log reader (dashboard) while sync writes: dirty reads acceptable; eventual consistency; no transaction isolation required
