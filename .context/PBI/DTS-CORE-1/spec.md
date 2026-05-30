# DTS-CORE-1 — Tracks CRUD Spec

**Phase**: 2 (Core Domain CRUD)
**Effort**: 3 SP

## Acceptance Criteria

### AC1: List Tracks
**Given** an authenticated user
**When** calling `GET /api/v1/tracks`
**Then** response returns paginated list of tracks sorted by name ASC
**And** response includes `{ data, pagination: { page, limit, total, pages } }`
**And** optional `?is_active=true` filters to active tracks only

### AC2: Get Track
**Given** a valid track ID
**When** calling `GET /api/v1/tracks/:id`
**Then** response returns track detail with courses count
**And** returns 404 for non-existent ID

### AC3: Create Track
**Given** an admin user
**When** calling `POST /api/v1/tracks` with `{ name, code }`
**Then** response returns 201 with created track (is_active=true default)
**And** returns 409 if code already exists

### AC4: Update Track
**Given** an admin user
**When** calling `PATCH /api/v1/tracks/:id` with partial fields
**Then** response returns 200 with updated track
**And** returns 404 for non-existent ID
**And** returns 409 if code conflicts

### AC5: Auth
**Given** unauthenticated request → 401
**Given** non-admin role → 403 on create/update
