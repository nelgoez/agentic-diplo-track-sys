# DTS-ADMIN-3 — Admin Tracks/Courses Management Spec

**Phase**: 5 (Admin & Integration Sync)
**Effort**: 3 SP

## Acceptance Criteria

### AC1: Tracks CRUD
**Given** an admin or sysadmin user
**When** performing CRUD operations on tracks
**Then** all operations are available and functional:
- `GET /api/v1/tracks` — list tracks (paginated)
- `GET /api/v1/tracks/:id` — get track detail
- `POST /api/v1/tracks` — create track
- `PATCH /api/v1/tracks/:id` — update track

**Covered by**: DTS-CORE-1 (Tracks CRUD) — DONE

### AC2: Courses CRUD
**Given** an admin or sysadmin user
**When** performing CRUD operations on courses
**Then** all operations are available and functional:
- `GET /api/v1/courses?track_id=:id` — list courses by track
- `GET /api/v1/courses/:id` — get course detail
- `POST /api/v1/courses` — create course within a track
- `PATCH /api/v1/courses/:id` — update course

**Covered by**: DTS-CORE-2 (Courses CRUD) — DONE

### AC3: Auth
**Given** endpoints from AC1 and AC2
**When** called by different roles
**Then** auth gating matches:
- Read operations (`GET`) → any authenticated user
- Write operations (`POST`, `PATCH`) → admin or sysadmin only
- Unauthenticated → 401
- Estudiante/coordinador on write → 403

**Covered by**: DTS-CORE-1 + DTS-CORE-2 route middleware

## Notes
This story is a documentation reference only — no new implementation required. Tracks and courses CRUD were fully implemented in Phase 2 (DTS-CORE-1 and DTS-CORE-2). Admin access to these endpoints is already gated by `requireRole('admin', 'sysadmin')` middleware.
