# DTS-CORE-1: Edge Cases

## Boundary Conditions
- Track name at max length (255 chars): accepted; truncated in list view if needed; full name in detail view
- Track code containing special chars or spaces: rejected; regex `^[A-Z0-9_-]+$`; 400 with format description
- Pagination with `limit=0`: returns empty array + total count; not rejected
- Pagination `offset` beyond total count: returns empty array; no error
- Track status toggle (active ↔ inactive): immediate; enrollments not affected; existing students retain enrollment
- Inactive track: still returned in list by default; filterable by status; creation of new enrollments blocked

## Error Paths
- Duplicate track code: 409 `code_already_exists`; unique constraint violation caught
- Create track with missing required field (name): 400 with field-level error
- Update track that doesn't exist: 404
- Delete track with existing enrollments: 409 `track_has_enrollments`; must deactivate instead; no cascade delete
- Unauthorized role (estudiante) creating track: 403 before any DB query

## Concurrency
- Two admins update same track simultaneously: last write wins (no optimistic locking in MVP); acceptable for low-concurrency admin UI
- Create + list concurrent: new track may or may not appear in list; no phantom reads issue for admin dashboard
