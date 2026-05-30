# DTS-SYNC-1 — Moodle Batch Certificate Sync Spec

**Phase**: 5 (Admin & Integration Sync)
**Effort**: 8 SP

## Acceptance Criteria

### AC1: Trigger Batch Sync
**Given** an admin or sysadmin user
**When** calling `POST /api/v1/integrations/sync/moodle`
**Then** system triggers async batch processing of all active students
**And** response returns 202 Accepted with `{ sync_id, started_at, message }`
**And** sync runs in background — endpoint returns immediately without waiting for completion

### AC2: Batched Processing
**Given** a sync is in progress
**When** processing active students
**Then** students are chunked into batches of 50
**And** batches are processed sequentially (batch N+1 starts after batch N completes)

### AC3: Per-Student Certificate Fetch + Upsert
**Given** a student in the current batch
**When** processing that student
**Then** `MoodleProvider.fetchCertificates(studentId)` is called
**And** each returned certificate is UPSERTed to `certificates` table by `(student_id, course_id, provider)`
**And** existing certificates with matching key are updated (not duplicated)

### AC4: Integration Logs
**Given** a sync session
**When** sync starts, processes students, and completes
**Then** `logSyncStart()` inserts a row in `integration_logs` with status=`processing`
**And** `logPerStudent()` records per-student outcome (success/error) for traceability
**And** `logSyncComplete()` updates the log row with status=`completed` or `partial`, including summary counts

### AC5: Conflict Guard
**Given** a sync is already running
**When** calling `POST /api/v1/integrations/sync/moodle`
**Then** response returns 409 Conflict with `{ error: "Sync already in progress", existing_sync_id }`
**And** no new sync session is started

### AC6: Sync ID for Status Polling
**Given** a sync was triggered
**When** calling `GET /api/v1/integrations/sync/:syncId/status`
**Then** response returns current sync status: `{ sync_id, status, started_at, processed, new_certs, updated_certs, errors, completed_at? }`
**And** status is one of: `processing`, `completed`, `partial`, `failed`

### AC7: Auth
**Given** unauthenticated request → 401
**Given** estudiante or coordinador role → 403
**Given** admin or sysadmin role → allowed
