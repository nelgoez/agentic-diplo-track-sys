# DTS-INT-3 — Implementation Plan

**Status**: Complete
**Date**: 27/5/2026

## Scope
Create helper functions for integration logging: `logSyncStart`, `logSyncComplete`, `logPerStudent`.

## Implementation

### `logSyncStart(provider, triggeredBy) → string`
Inserts `integration_logs` row with `status='pending'`, stores `started_at` + `triggered_by` in `details` JSONB. Returns log ID.

### `logSyncComplete(logId, provider, stats) → void`
Inserts completion log row with stats: `studentsProcessed`, `studentsNew`, `studentsUpdated`, `errorsCount`, `durationMs`. Status: `'success'` if 0 errors, else `'error'`.

### `logPerStudent(provider, studentId, status, message?) → void`
Inserts per-student fetch log with `operation='fetch'`.

## Wiring
`integrations.ts` routes updated to call these helpers during sync operations. Health status endpoint uses `moodleService.healthCheck()` / `guaraniService.healthCheck()`.

## Files
- `services/integration-logs.ts` — created
- `routes/integrations.ts` — modified

## Verification
- [x] TypeScript typecheck passes
- [ ] Manual: trigger sync, verify logs appear in DB
