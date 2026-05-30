# DTS-ADMIN-3 — Implementation Plan

**Status**: Done
**Date**: 28/5/2026

## Scope
Admin tracks/courses management. Already fully implemented by DTS-CORE-1 and DTS-CORE-2 in Phase 2.

## Prerequisites
- `DTS-CORE-1` (Tracks CRUD) — DONE
- `DTS-CORE-2` (Courses CRUD) — DONE

## Implementation
No new code required. This story documents that admin tracks/courses management is covered by existing endpoints.

## Existing Endpoints (Reference)

### Tracks — `routes/tracks.ts`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/tracks | any authenticated | List tracks (paginated, filterable by is_active) |
| GET | /api/v1/tracks/:id | any authenticated | Get track detail with courses count |
| POST | /api/v1/tracks | admin/sysadmin | Create track |
| PATCH | /api/v1/tracks/:id | admin/sysadmin | Update track |

### Courses — `routes/courses.ts`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/courses | any authenticated | List courses (filterable by track_id) |
| GET | /api/v1/courses/:id | any authenticated | Get course detail |
| POST | /api/v1/courses | admin/sysadmin | Create course within a track |
| PATCH | /api/v1/courses/:id | admin/sysadmin | Update course |

## Files
- N/A — no new files, no modifications

## Review Workload Forecast
Estimated: 0 additions
400-line budget risk: None
