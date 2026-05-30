# DTS-SYNC-4 — Resilient Adapter Spec

**Phase**: 5 (Admin & Integration Sync)
**Effort**: 5 SP

## Acceptance Criteria

### AC1: Retry with Exponential Backoff
**Given** a provider call (fetchCertificates or fetchStudents)
**When** the external provider returns a transient error (timeout, 5xx, network error)
**Then** the call is retried up to 3 times with exponential backoff: 1s, 4s, 9s
**And** if all retries fail, the error is propagated to the caller
**And** if any retry succeeds, the result is returned immediately

### AC2: Per-Student Error Isolation
**Given** a batch sync processing multiple students
**When** one student's provider call fails (after all retries)
**Then** the batch continues processing remaining students
**And** the failed student is logged in integration_logs with error details
**And** total error count is included in sync summary

### AC3: Configurable Timeout
**Given** a provider call
**When** the external provider does not respond
**Then** the call is aborted after the configured timeout (default: 10s)
**And** the timeout value is configurable per provider via `providers.yaml` or env vars
**And** timeout is treated as a retryable error

### AC4: Graceful Degradation
**Given** the external provider (Moodle/Guaraní) is unreachable
**When** any endpoint reads existing certificate or student data
**Then** the system returns data from the local database normally
**And** endpoints that require live provider data return 503 with a clear error message
**And** health check endpoint reflects `status: 'disconnected'` for that provider

### AC5: Retry Count Logging
**Given** a provider call that succeeds after N retries
**When** the call completes
**Then** the retry count is included in integration_logs `error_details` JSONB
**And** the log also records `duration_ms` of the entire call (including retries)

## Notes
- Retry wrapper should be provider-agnostic — works with any `CertificateProvider` or `AcademicProvider`
- Non-retryable errors (400, 401, 403, 404) should NOT be retried — fail immediately
- Retryable errors: network errors, 5xx, 429 (rate limit), timeouts
