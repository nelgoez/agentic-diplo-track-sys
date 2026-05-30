# DTS-ADMIN-1: Edge Cases

## Boundary Conditions
- System with zero students/tracks/certificates: all counts return 0; 200 OK; no division-by-zero in derived stats
- 'recentSyncErrors' with no sync history: returns `[]` or `count: 0`
- Very large student count (100K+): aggregate queries use `COUNT(*)`; performance depends on index strategy; consider materialized view for >100K
- `eligibleCount` vs `notEligibleCount`: sum equals total enrolled students with at least one incomplete course; not all students may have eligibility evaluated yet
- activeStudents: counts students with `is_active=true` AND at least one active enrollment

## Error Paths
- Database connection lost during stats query: 503; no stale cached data returned in MVP (real-time only)
- COUNT query timeout on large dataset: 504; suggest async/cached endpoint for production
- Non-admin role requesting dashboard: 403; query not even attempted
- Multiple organizations (multi-faculty): stats scoped by requesting admin's organization; `organization_id` filter applied

## Concurrency
- Dashboard read while batch sync creates certificates: counts may be slightly inconsistent (certificates added but eligibility not re-evaluated yet); acceptable for real-time dashboard
- Two admins viewing dashboard: independent reads; no shared cache or lock
