# Admin verification management — view and revoke verification links

**Jira Key:** [DTS-65](https://diplo-track-sys.atlassian.net/browse/DTS-65)
**Epic:** [DTS-58](https://diplo-track-sys.atlassian.net/browse/DTS-58) (Public Diploma Verification Portal)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Admin verification management — view and revoke verification links

> [!NOTE] ***Admin-only.*** Requires admin or sysadmin role.

## Objective

Admin panel to manage diploma verification references — view, revoke, regenerate.

## Admin tab: "Verificaciones"

### Table columns

| Column | Type | Notes |
| --- | --- | --- |
| Student | Text | Full name |
| Track | Text | Diploma track name |
| Reference code | Text | e.g. DTS-A3B8K |
| Verification URL | Link | Clickable, copyable |
| Status | Badge | Active (green) / Revoked (gray) |
| Created | Date | When created |
| Times verified | Number | Count of successful lookups |

### Filters

- Status: Active / Revoked / All
- Search: by student name or reference code
- Date range: created between X and Y

### Actions

- ***Revoke***: confirmation dialog → sets is*active=false, revoked*at=now
- ***Regenerate***: creates new reference code, deactivates old one, returns new URL
- ***Copy URL***: copies verification URL to clipboard

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /admin/verifications | Paginated list with filters |
| PUT | /admin/verifications/:id/revoke | Revoke a verification |
| POST | /admin/verifications/:id/regenerate | Create new code, deactivate old |

## Implementation

- New tab in AdminPage (existing tab structure)
- Table component using MUI DataGrid or Table with pagination
- Revoke: PUT with confirmation dialog (standard MUI Dialog)
- Regenerate: POST, returns new code, updates row in-place
- Audit log entries for revoke/regenerate

## Acceptance Criteria

- [ ] Admin sees all issued verifications with status
- [ ] Revoke immediately invalidates the link
- [ ] Regenerate creates new code, old one stops working
- [ ] Audit log entries for revoke/regenerate actions
- [ ] Search and filters work correctly

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
- **Labels:** admin, phase-6, post-mvp, verification

---

_Synced from Jira by sync-jira-issues_
