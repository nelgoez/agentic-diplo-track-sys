# DTS-SYNC-2 — Individual Certificate Re-sync Spec

**Phase**: 5 (Admin & Integration Sync)
**Effort**: 3 SP

## Acceptance Criteria

### AC1: Re-sync Single Certificate
**Given** an admin or sysadmin user
**And** a certificate record exists with ID `:id`
**When** calling `POST /api/v1/certificates/:id/resync`
**Then** system fetches fresh certificate data from the provider for that student
**And** updates the certificate record with refreshed `issue_date`, `qualification`, `status`
**And** response returns 200 with updated certificate object

### AC2: Certificate Not Found
**Given** a certificate ID that does not exist
**When** calling `POST /api/v1/certificates/:id/resync`
**Then** response returns 404 with `{ error: "Certificate not found" }`

### AC3: Integration Logging
**Given** a re-sync completes (success or failure)
**When** the operation finishes
**Then** an entry is inserted in `integration_logs` with:
- `provider = "moodle"`
- `action = "resync_certificate"`
- `status = "success"` or `"error"`
- `students_processed = 1`
- Error details captured in `error_details` JSONB if applicable

### AC4: Auth
**Given** unauthenticated request → 401
**Given** estudiante or coordinador role → 403
**Given** admin or sysadmin role → allowed
