# Certificate completion reports + CSV export

**Jira Key:** [DTS-79](https://diplo-track-sys.atlassian.net/browse/DTS-79)
**Epic:** [DTS-59](https://diplo-track-sys.atlassian.net/browse/DTS-59) (Advanced Analytics and Reports)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Certificate completion reports + export

> [!NOTE] ***Analytics + reporting.*** Builds on DTS-59-1.

## Objective

Generate certificate completion reports — how many students completed each course/track, with exportable data.

## Endpoint

`GET /admin/analytics/certificates`

```json
{
  "total_certificates": 850,
  "by_course": [
    { "course": "Introducción a Python", "completed": 120, "avg_grade": 7.5 },
    { "course": "Estadística Aplicada", "completed": 95, "avg_grade": 6.8 }
  ],
  "by_track": [
    { "track": "Ciencia de Datos", "completed": 45, "total_students": 340 }
  ],
  "monthly_issued": [
    { "month": "2026-01", "count": 30 },
    { "month": "2026-02", "count": 45 }
  ]
}
```

## CSV Export

`GET /admin/analytics/certificates/export?format=csv`

- Returns CSV with columns: student name, track, course, grade, date
- Streams response (don't load all rows into memory)

## Implementation

- New routes in `admin.ts`
- CSV export uses bun's built-in CSV writing or manual string building
- Same 5-min cache as DTS-59-1

## Acceptance Criteria

- [ ] GET /admin/analytics/certificates returns aggregated data
- [ ] GET /admin/analytics/certificates/export?format=csv returns downloadable CSV
- [ ] CSV opens correctly in Excel/Google Sheets
- [ ] UTF-8 BOM for Spanish characters

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
- **Labels:** analytics, phase-6, post-mvp

---

_Synced from Jira by sync-jira-issues_
