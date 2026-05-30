# DTS-SYNC-4 — Implementation Plan

**Status**: Todo
**Date**: 28/5/2026

## Scope
Generic retry wrapper with exponential backoff for all external provider calls. Error isolation, configurable timeout, graceful degradation when providers are unreachable.

## Prerequisites
- `DTS-INT-1` (Provider abstraction interfaces) — DONE
- `DTS-INT-2` (Moodle provider mock) — DONE
- `DTS-SYNC-1` (Moodle batch sync) — batch loop with per-student isolation

## Implementation

### 1. Retry Wrapper Service
- File: `server/src/services/retry-wrapper.ts` (new)

```typescript
interface RetryOptions {
  maxRetries: number;        // default: 3
  backoffMs: number[];       // default: [1000, 4000, 9000]
  timeoutMs: number;         // default: 10000
  retryableErrors: string[]; // default: ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ERR_NON_2XX_3XX_RESPONSE']
}

interface RetryResult<T> {
  result: T;
  attempts: number;
  totalDurationMs: number;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions>
): Promise<RetryResult<T>>
```

- Logic:
  1. Create `AbortController` with timeout
  2. Try `fn()`, wrapped with timeout via `Promise.race`
  3. On success → return `{ result, attempts, totalDurationMs }`
  4. On error → check if retryable:
     - Network errors (ECONNRESET, ETIMEDOUT, ECONNREFUSED) → retry
     - HTTP 5xx, 429 → retry
     - HTTP 4xx (except 429) → throw immediately, no retry
     - Timeout → retry
  5. Wait `backoffMs[attempt]` before next retry
  6. If maxRetries exhausted → throw `ProviderError` with attempt count

### 2. Timeout Implementation
- Default: 10s per provider call
- Configurable per provider via env var or provider config:
  - `MOODLE_TIMEOUT_MS` / `GUARANI_TIMEOUT_MS`
  - Read in provider initialization, pass to retry wrapper

### 3. Integration Points
Wrap existing provider calls:
- `moodleProvider.fetchCertificates(studentId)` → `withRetry(() => moodleProvider.fetchCertificates(id), { timeoutMs: moodleTimeout })`
- `guaraniProvider.fetchStudents()` → `withRetry(() => guaraniProvider.fetchStudents(), { timeoutMs: guaraniTimeout })`
- `moodleProvider.healthCheck()` — light retry: maxRetries=1, timeoutMs=5000

### 4. Per-Student Error Isolation
- Already handled in DTS-SYNC-1 batch loop: per-student errors are caught and logged, batch continues
- Retry wrapper failures are caught per-student in the Promise.all catch handler
- No changes needed to sync loop — retry wrapper is transparent

### 5. Graceful Degradation
- Health check already returns `disconnected` when provider unreachable (DTS-INT-2)
- All read endpoints query local DB, not provider — no change needed
- Sync endpoints already return 503 when health check fails (DTS-SYNC-1 AC pre-check)

### 6. Retry Count in Logs
- Extract `attempts` and `totalDurationMs` from `withRetry` result
- Pass to `logPerStudent()` in batch sync
- Include in `error_details` JSONB on failure: `{ attempts, totalDurationMs, lastError }`

## Files
- `services/retry-wrapper.ts` — new file, generic retry logic
- `services/moodle.service.ts` — wrap fetchCertificates calls
- `services/guarani.service.ts` — wrap fetchStudents calls
- `services/moodle-sync.service.ts` — pass retry metadata to logging

## Edge Cases
| Case | Handling |
|------|----------|
| All retries exhausted | Throw ProviderError, logged as error, batch continues |
| 401/403 from provider | Not retryable — fail immediately, log auth misconfiguration |
| Timeout < backoff interval | Use max(timeout, backoff) for that attempt |
| `backoffMs` array shorter than maxRetries | Repeat last value for remaining retries |
| Provider returns success with empty data | Not an error, return empty array, no retry |

## Review Workload Forecast
Estimated: ~120 additions, 1 new file, 3 modified files
400-line budget risk: Low
