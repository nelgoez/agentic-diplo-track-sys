# Phase 1 — Foundation (Gap Fixes)

**Status**: Complete
**Date**: 27/5/2026
**Repo**: diploma-tracking-sys (main branch)

## Gap Audit Result

Phase 1 deliverables showed foundation docs but placeholder implementations:

| Eval | Story | Pre-fix State |
|------|-------|---------------|
| FAIL | DTS-AUTH-2 | All 4 endpoints returned hardcoded placeholder data |
| FAIL | DTS-AUTH-3 | `authenticate` never verified tokens; always injected hardcoded `{ sub: 'placeholder-user-id', role: 'estudiante' }` |
| FAIL | DTS-AUTH-4 | No user creation endpoint existed |
| FAIL | DTS-INT-1 | No `providers/` directory. No `CertificateProvider`/`AcademicProvider` interfaces. No `ProviderRegistry`. |
| FAIL | DTS-INT-2 | `MoodleServiceImpl` methods all returned `[]`/`{}`. No `healthCheck()`. No `CertificateProvider` conformance. |
| FAIL | DTS-INT-3 | `integration_logs` table existed but no helper functions (`logSyncStart`, `logSyncComplete`, `logPerStudent`) |

## Fixes Applied

### DTS-AUTH-2/3 — JWT Authentication
- `POST /login`: `supabase.auth.signInWithPassword` → `jose` JWT creation (access 15m, refresh 7d)
- `POST /refresh`: verify refresh token → issue new pair (rotation)
- `POST /logout`: `supabaseAdmin.auth.admin.signOut`
- `GET /me`: reads auth context, fetches from `students` table
- `authenticate` middleware: real `jose.jwtVerify` (HS256) + `email` added to `AuthContext`
- `requireRole`: unchanged (was already correct)

### DTS-AUTH-4 — User CRUD
- `POST /admin/users`: creates in Supabase Auth (`admin.createUser`) + inserts `students` row
- Email uniqueness check, rollback on DB failure
- Supports `role`, `dni` fields

### DTS-INT-1 — Provider Abstraction
- `providers/certificate.provider.ts`: `CertificateProvider` + `ProviderHealth` + `Certificate` interfaces
- `providers/academic.provider.ts`: `AcademicProvider` + `AcademicStudent` interfaces
- `providers/provider-registry.ts`: `ProviderRegistry` (register/setActive/get/names)
- `providers/index.ts`: barrel exports
- Registered at startup in `index.ts`

### DTS-INT-2 — Moodle Provider
- `MoodleServiceImpl` implements `CertificateProvider`
- `healthCheck()`: pings Moodle REST `/webservice/rest/server.php`
- `fetchCertificates()`, `validateCertificate()`: stubs with TODO

### DTS-INT-3 — Integration Logging
- `services/integration-logs.ts`: `logSyncStart(provider, triggeredBy)`, `logSyncComplete(logId, stats)`, `logPerStudent(provider, studentId, status, message)`
- Wired into `integrations.ts` routes

## Deliberately Deferred

| Item | Reason |
|------|--------|
| `bun run db:types` | Manual `Database` interface sufficient for now |
| Login rate limiting (5 attempts/15min) | Needs rate-limit middleware; Phase 5 concern |
| `providers.yaml` config | Env vars sufficient; config file work pending |
| `ProviderError` class | Current error handling adequate; add when provider calls go live |
| Per-provider subdirs (MoodleAdapter/MoodleClient) | Flat files sufficient for mock phase |
| Missing tables (audit_log, track_coordinators, notifications) | Phase 6 concern |

## Key Files

| File | Status |
|------|--------|
| `middleware/auth.ts` | Modified — real JWT verify |
| `routes/auth.ts` | Modified — real login/refresh/logout/me |
| `routes/admin.ts` | Modified — POST /users |
| `providers/certificate.provider.ts` | Created |
| `providers/academic.provider.ts` | Created |
| `providers/provider-registry.ts` | Created |
| `providers/index.ts` | Created |
| `services/moodle.service.ts` | Modified — implements CertificateProvider |
| `services/guarani.service.ts` | Modified — implements AcademicProvider |
| `services/integration-logs.ts` | Created |
| `routes/integrations.ts` | Modified — uses helpers + health checks |
| `index.ts` | Modified — provider registry init |
| `db/supabase.ts` | Modified — updated types |
