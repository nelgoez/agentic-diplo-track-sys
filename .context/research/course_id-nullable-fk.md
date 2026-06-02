# Database Research — course_id nullability

**Date**: 2026-05-28
**Sources**: Context7 (Supabase official docs), Tavily (Stack Overflow, eastondev.com)

## Finding

Nullable foreign keys are **not** bad practice when they model optional relationships.

### Sources

1. **Stack Overflow** (`stackoverflow.com/questions/1723808`):
   > "Use nulls to express the absence of a relationship. They are convenient, but they will cause you the same headaches that nulls cause you elsewhere. One place where they don't cause any trouble is joins."

2. **eastondev.com** Supabase Database Design (2024):
   > Students and courses. One student can take many courses, one course can have many students. Solution: create a junction table. With composite PK on (student_id, course_id).

3. **Supabase official docs** (`supabase.com/docs/guides/database/tables`):
   University example uses `grades` table with `student_id` + `course_id` (both required) because grades are always course-level. No mention of nullable FK as anti-pattern.

### Application to DTS

- DTS has two enrollment levels: **track** (diploma) and **course** (module)
- When enrolling at track level (batch CSV, diploma enrollment): `course_id` should be NULL
- When enrolling at course level (individual course enrollment): `course_id` is the target course
- This follows PostgreSQL's referenced pattern: nullable FK = optional relationship

### Decision

`enrollments.course_id` should be **nullable** (`DROP NOT NULL` if currently required). 
The batch enrollment endpoint inserts `course_id: null` for track-level enrollment.
TypeScript types already accept `null` via `course_id: null as unknown as string` cast.
DB must allow NULL for this column.

## References
- https://stackoverflow.com/questions/1723808/nullable-foreign-key-bad-practice
- https://eastondev.com/blog/en/posts/dev/supabase-database-design
- https://supabase.com/docs/guides/database/tables
