# DTS-AUTH-1: Edge Cases

## Boundary Conditions
- Migration applied to empty DB: all tables, indexes, RLS policies, triggers created without errors; idempotent on re-run (IF NOT EXISTS)
- Migration applied with existing data: no data loss; ALTER/ADD operations only; backfill defaults for new NOT NULL columns
- Schema name collision: migration fails early with clear error if table/index/trigger already exists with different definition
- Very long column values (TEXT/JSONB): no truncation; indexed columns respect limits (VARCHAR N)
- RLS policies on tables with zero rows: policies apply but no rows leaked; `using` expressions evaluate correctly

## Error Paths
- Supabase project unreachable: connection timeout; retry 3× with backoff; fail with clear "check SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY" message
- Migration SQL syntax error: migration rolls back fully; no partial schema; error includes line number
- Types generation fails (`bun run db:types`): no `database.types.ts` output; script exits non-zero; no silent skip
- Duplicate migration version number: migration runner rejects; error names conflicting file

## Concurrency
- Two `bun run db:migrate` simultaneously: DB locks prevent double-apply; second run skips or waits; no duplicate index/trigger creation
- Migration running while API server starts: API waits for migration lock release; no partial schema reads
