# PDF download endpoint + auto-generate on exam approval

**Jira Key:** [DTS-77](https://diplo-track-sys.atlassian.net/browse/DTS-77)
**Epic:** [DTS-57](https://diplo-track-sys.atlassian.net/browse/DTS-57) (Digital Diploma PDF Generation)
**Type:** Story
**Status:** Done
**Priority:** Medium
**Story Points:** -

---

## Overview

# PDF download endpoint + auto-generate on exam approval

> [!NOTE] ***Integration story.*** Depends on DTS-57-1 (PDF service) + DTS-57-2 (template).

## Objective

Wire the PDF service to the API layer: endpoint to download diplomas, and auto-trigger generation when an exam is approved.

## Endpoints

### Download diploma

`GET /api/v1/diplomas/:enrollmentId/download`

- Requires auth (estudiante or admin/coordinator)
- Returns the PDF file with Content-Type: application/pdf
- Headers: Content-Disposition: attachment; filename="diploma-MARIA-GARCIA.pdf"

### Check diploma status

`GET /api/v1/diplomas/:enrollmentId/status`

```json
{
  "status": "pending" | "generated" | "error",
  "generated_at": "2026-06-01T12:00:00Z",
  "download_url": "/api/v1/diplomas/xxx/download"
}
```

## Auto-trigger on exam approval

In `PUT /enrollments/:id/grade`, when `grade >= 4` and `exam_status` transitions to `aprobado`:

```typescript
if (grade >= 4 && examStatus === 'aprobado') {
  // Fire-and-forget: generate diploma in background
  generateDiplomaAsync(studentId, enrollmentId).catch(console.error);
}
```

## Diploma storage table

```sql
CREATE TABLE diplomas (
  id UUID PRIMARY KEY,
  enrollment_id UUID UNIQUE REFERENCES enrollments(id),
  status VARCHAR(20) DEFAULT 'pending',
  file_path TEXT,
  generated_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Migration

Run `supabase/migrations/XXX_diplomas.sql` with the diplomas table.

## Acceptance Criteria

- [ ] GET /api/v1/diplomas/:id/download returns PDF file
- [ ] GET /api/v1/diplomas/:id/status returns correct status
- [ ] When grade >= 4, diploma starts generating (status transitions pending → generated)
- [ ] Error state: if generation fails, status='error' and error_message is set
- [ ] Only the diploma owner + admins can download

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

- **Created:** 12/6/2026
- **Updated:** 12/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez
- **Labels:** pdf, phase-6, post-mvp

---

_Synced from Jira by sync-jira-issues_
