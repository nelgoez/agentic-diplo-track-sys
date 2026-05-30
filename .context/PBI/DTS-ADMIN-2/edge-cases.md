# DTS-ADMIN-2: Edge Cases

## Boundary Conditions
- Search with special regex characters (`.`, `*`, `+`): escaped; treated as literal text; no regex injection
- Student detail with deeply nested data (100+ certificates, 20+ enrollments): all returned; no truncation at API level; client renders paginated sub-lists
- Filter by multiple tracks: student returned if enrolled in ANY matching track; OR logic
- Filter by enrollment status + search text combined: AND logic; both conditions must match
- Student with `is_active=false`: excluded from default search; `?includeInactive=true` to include

## Error Paths
- Non-existent student UUID in detail view: 404
- Malformed UUID in path: 400 `invalid_uuid_format`
- Student detail query joining 5+ tables times out: retry or 503; consider splitting into sub-resources (certificates, enrollments as separate endpoints)
- Admin not authorized for student's organization: 403; organization-scoped admin visibility

## Concurrency
- Admin views detail while student data being updated: sees snapshot at query time; MVCC ensures consistency
- Admin detail view + sync adding certificates for same student: certificates list may change mid-response; acceptable for long-polling scenario
