# DTS-SYNC-1 — Implementation Plan

**Status**: Todo
**Date**: 28/5/2026

## Scope
Moodle batch certificate sync: async processing of all active students in batches of 50, per-student fetch + upsert, integration logging, conflict guard, status polling.

## Prerequisites
- `DTS-INT-1` (Provider abstraction interfaces) — DONE
- `DTS-INT-2` (Moodle provider mock) — DONE
- `DTS-INT-3` (Integration logs table + logging middleware) — DONE
- `DTS-CORE-3` (Students CRUD) — DONE

## Implementation

### 1. In-Memory Sync Lock
- Add module-level flag: `let activeSync: { syncId: string; startedAt: Date } | null = null`
- Check flag before starting new sync → return 409 if active
- Clear flag on sync completion or failure

### 2. Route: POST /api/v1/integrations/sync/moodle
- File: `server/src/routes/integrations.ts` (new or extend existing)
- Middleware: `authenticate` + `requireRole('admin', 'sysadmin')`
- Generate sync UUID: `crypto.randomUUID()`
- Call `logSyncStart(syncId, 'moodle', 'batch_sync')` — insert integration_logs row
- Return 202 immediately with syncId
- Fire async processing via `setImmediate()` or equivalent (don't await)

### 3. Batch Processing Logic
- File: `server/src/services/moodle-sync.service.ts` (new)
- Load all active students: `supabaseAdmin.from('students').select('id, email').eq('is_active', true)`
- Chunk into arrays of 50: `chunk(students, 50)`
- Process each batch sequentially:
  - `Promise.all(batch.map(student => processStudent(student, syncId)))`
  - Per student: catch errors individually — don't abort batch on single failure
- `processStudent()`:
  - Call `moodleProvider.fetchCertificates(studentId)`
  - For each certificate: look up course by `moodle_course_id` → UPSERT to `certificates` table
  - Call `logPerStudent(syncId, studentId, 'success' | 'error', details)`
  - Accumulate summary counts

### 4. Sync Completion
- After all batches: call `logSyncComplete(syncId, summary)` — update integration_logs row
- Clear in-memory lock

### 5. Status Polling: GET /api/v1/integrations/sync/:syncId/status
- Query `integration_logs` by syncId
- Return current status with counts

### 6. Provider Health Pre-Check (Edge Case)
- Before starting sync, call `moodleProvider.healthCheck()`
- If `status !== 'connected'`, return 503 with `{ error: "Moodle provider unreachable" }`
- Don't start sync if health check fails

## Files
- `routes/integrations.ts` — POST /sync/moodle + GET /sync/:syncId/status
- `services/moodle-sync.service.ts` — batch processing logic
- `services/integration-logger.ts` — logSyncStart, logSyncComplete, logPerStudent (or extend existing)

## Edge Cases
| Case | Handling |
|------|----------|
| No active students in DB | Return 200 with `{ processed: 0 }`, don't error |
| Student has no certificates in Moodle | Log success with 0 certs, continue |
| Moodle course_id not found in DTS courses table | Log warning, skip that certificate |
| Sync crashes mid-way (process crash) | Lock cleared on restart. Partial log row remains with status=`processing`. Manual cleanup or timeout sweep needed (future cron). |
| Provider timeout per student | Caught by retry wrapper (DTS-SYNC-4), logged as error, continue |
| Concurrent sync attempt | Rejected by 409 conflict guard |

## Review Workload Forecast
Estimated: ~200 additions, 2 new files, 1 modified file
400-line budget risk: Medium
