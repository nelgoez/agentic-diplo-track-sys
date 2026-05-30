# DTS-CORE-1 — Implementation Plan

**Status**: Done
**Date**: 28/5/2026

## Scope
Tracks CRUD: list (paginated), get by ID, create, patch. New dedicated route file.

## Implementation
- `server/src/routes/tracks.ts` — new file with 4 endpoints
- `server/src/index.ts` — registered as `/api/v1/tracks`
- Auth: authenticate on all, requireRole('admin', 'sysadmin') on mutations
- Uses supabaseAdmin for all operations
- Zod validation on create: name (min 2), code (min 2), description (optional), credits_required (optional)
- Auto-calculated is_active=true on create
- Pagination pattern from students.ts

## Files
- `routes/tracks.ts` — 4 endpoints (GET /, GET /:id, POST /, PATCH /:id)

## Review Workload Forecast
Estimated: ~80 additions, new file
400-line budget risk: Low
