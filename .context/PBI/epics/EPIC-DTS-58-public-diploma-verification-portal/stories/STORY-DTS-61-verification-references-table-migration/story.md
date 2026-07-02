# Verification references table + migration

**Jira Key:** [DTS-61](https://diplo-track-sys.atlassian.net/browse/DTS-61)
**Epic:** [DTS-58](https://diplo-track-sys.atlassian.net/browse/DTS-58) (Public Diploma Verification Portal)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Verification references table + migration

> [!NOTE] ***Foundation story for DTS-58 (Verification Portal).*** Database layer first.

## Objective

Create the database infrastructure for diploma verification — the table that stores verification reference codes linked to approved enrollments.

## Schema

```sql
CREATE TABLE verification_references (
  id UUID PRIMARY KEY DEFAULT gen*random*uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id),
  reference_code VARCHAR(12) UNIQUE NOT NULL,
  verification_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx*verif*ref*code ON verification*references(reference_code);
```

## Reference code format

Short alphanumeric, URL-safe, collision-safe: ***DTS-A3B8K*** (prefix + dash + 5 random chars from 0-9, A-Z excluding lookalikes like 0/O, 1/I/L).

## RLS policy

```sql
-- Public read access for active references only (verification page needs this)
CREATE POLICY "public*select*active" ON verification_references
  FOR SELECT USING (is_active = true);
```

## Seed migration

Post-MVP migration that generates verification codes for all existing approved enrollments (exam_status = 'aprobado'). Batch in chunks of 100.

## Referenced entities

```
Enrollments
  ├── id (UUID)
  ├── student_id → students
  ├── track_id → tracks
  ├── exam_status (inscripto | aprobado | desaprobado)
  └── exam_grade (1-10)
```

## Acceptance Criteria

- [ ] Migration runs cleanly up/down
- [ ] RLS allows unauthenticated SELECT on (is_active = true) records
- [ ] Reference codes are URL-safe, 8-12 chars, collision-safe
- [ ] Unique constraint enforced on reference_code
- [ ] Seed migration generates codes for existing approved enrollments

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Out Of Scope](./out-of-scope.md)
- [Implementation Plan (Dev)](./implementation-plan.md)
- [Acceptance Test Plan (QA)](./acceptance-test-plan.md)
- [Acceptance Test Results (QA)](./acceptance-test-results.md)

---

## Metadata

- **Created:** 11/6/2026
- **Updated:** 12/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez
- **Labels:** phase-6, post-mvp, verification

---

_Synced from Jira by sync-jira-issues_
