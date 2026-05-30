# DTS-CORE-2 — Courses Mutations Spec

**Phase**: 2 (Core Domain CRUD)
**Effort**: 3 SP

## Acceptance Criteria

### AC1: Create Course
**Given** an admin user
**When** calling `POST /api/v1/courses` with `{ name, code, track_id }`
**Then** response returns 201 with created course (auto order_index, is_active=true)
**And** returns 404 if track_id doesn't exist
**And** returns 409 if (track_id, code) already exists

### AC2: Update Course
**Given** an admin user
**When** calling `PATCH /api/v1/courses/:id` with partial fields
**Then** response returns 200 with updated course
**And** returns 404 for non-existent ID

### AC3: Auth
**Given** unauthenticated request → 401
**Given** non-admin role → 403 on create/update
