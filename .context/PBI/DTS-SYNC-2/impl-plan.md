# DTS-SYNC-2 — Implementation Plan

**Status**: Todo
**Date**: 28/5/2026

## Scope
Individual certificate re-sync: refresh a single certificate from Moodle provider on demand.

## Prerequisites
- `DTS-SYNC-1` (Moodle batch sync) — batch processing pattern established
- `DTS-INT-2` (Moodle provider mock) — DONE
- `DTS-CORE-5` (Certificate list + get by ID) — DONE

## Implementation

### 1. Route: POST /api/v1/certificates/:id/resync
- File: `server/src/routes/certificates.ts` (extend existing)
- Middleware: `authenticate` + `requireRole('admin', 'sysadmin')`
- Path: Add `/:id/resync` as a new route handler

### 2. Route Handler Logic
```
1. Load certificate by ID from certificates table
   → 404 if not found
2. Load student by certificate.student_id
3. Determine provider from certificate.provider field (default: 'moodle')
4. Resolve provider instance from ProviderRegistry
5. Call provider.fetchCertificates(student.id) — get fresh data
6. Find matching certificate in fresh data by course_id
7. UPSERT certificate record with refreshed data:
   - issue_date, qualification, status, metadata, synced_at = now()
8. Log to integration_logs:
   - provider, action='resync_certificate', status, student_id
9. Return 200 with updated certificate
```

### 3. Provider Resolution
- Read `certificate.provider` to determine which provider to use
- If provider === 'moodle': use moodleProvider
- If provider not available or health check fails: return 503
- Future: extensible to canvas or other providers via registry

### 4. Logging
- Insert one row per re-sync into `integration_logs`
- Fields: provider, action='resync_certificate', status, started_at, completed_at, students_processed=1, triggered_by=req.auth.userId
- On error: capture error_message + error_details JSONB

## Files
- `routes/certificates.ts` — add POST /:id/resync endpoint

## Edge Cases
| Case | Handling |
|------|----------|
| Certificate ID not found | 404 |
| Student not found | Should not happen (certificates have FK to students). Return 500 if orphan. |
| Provider unreachable | Return 503, log error in integration_logs |
| Certificate no longer exists in Moodle | Mark certificate status='error', log, return 200 with updated status |
| Provider returns multiple certs for same course | Take most recent by issue_date |

## Review Workload Forecast
Estimated: ~60 additions to existing file
400-line budget risk: Low
