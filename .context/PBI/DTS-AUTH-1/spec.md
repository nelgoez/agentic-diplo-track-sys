# DTS-AUTH-1: Supabase project setup + DB schema migration

> Phase: 1 (Foundation) · Effort: 3 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: Supabase project created and schema migrated to staging
- **Given** a Supabase account with a new project provisioned
- **When** migration `001_initial_schema.sql` is applied to the staging database
- **Then** all tables (users, students, tracks, courses, certificates, enrollments, prerequisite_rules, prerequisite_sources, manual_overrides, integration_logs, audit_log, track_coordinators) exist
- **And** all indexes, RLS policies, and triggers are active
- **And** foreign key constraints are enforced across all related tables

### Scenario: TypeScript types generated from database schema
- **Given** the database schema is fully migrated
- **When** `bun run db:types` is executed
- **Then** a `database.types.ts` file is generated
- **And** all table definitions, enums, and relationships are correctly typed

### Scenario: Schema rollback safety
- **Given** migration `001_initial_schema.sql` has been applied
- **When** the migration is rolled back
- **Then** all tables, indexes, triggers, and RLS policies are removed cleanly
- **And** no orphaned objects remain in the database

## Open Questions
- None

## Notes
- Implementation commit: See impl-plan.md
- Migration file: `supabase/migrations/001_initial_schema.sql`
