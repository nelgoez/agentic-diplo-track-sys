# DTS-SYNC-3 — Integration Logs Date Filter Spec

**Phase**: 5 (Admin & Integration Sync)
**Effort**: 3 SP

## Acceptance Criteria

### AC1: List Integration Logs
**Given** an authenticated admin/sysadmin user
**When** calling `GET /api/v1/integrations/logs`
**Then** response returns paginated list of integration log entries
**And** sorted by `created_at` DESC (most recent first)

### AC2: Filter by Provider + Status
**Given** an authenticated admin/sysadmin user
**When** calling `GET /api/v1/integrations/logs?provider=moodle&status=completed`
**Then** response returns only logs matching `provider=moodle` AND `status=completed`

### AC3: Filter by Date Range
**Given** an authenticated admin/sysadmin user
**When** calling `GET /api/v1/integrations/logs?date_from=2026-01-01&date_to=2026-01-31`
**Then** response returns only logs with `created_at` between `date_from` and `date_to` (inclusive)
**And** `date_from` without `date_to` filters from that date to now
**And** `date_to` without `date_from` filters from the beginning to that date

### AC4: Auth
**Given** unauthenticated request → 401
**Given** estudiante or coordinador role → 403
**Given** admin or sysadmin role → allowed
