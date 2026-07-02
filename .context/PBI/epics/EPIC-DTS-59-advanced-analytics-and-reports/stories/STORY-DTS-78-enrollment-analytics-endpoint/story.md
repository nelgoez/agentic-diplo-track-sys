# Enrollment analytics endpoint

**Jira Key:** [DTS-78](https://diplo-track-sys.atlassian.net/browse/DTS-78)
**Epic:** [DTS-59](https://diplo-track-sys.atlassian.net/browse/DTS-59) (Advanced Analytics and Reports)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Enrollment analytics endpoint

> [!NOTE] ***Backend analytics.*** No frontend changes.

## Objective

Expose enrollment metrics for the admin dashboard.

## Endpoint

`GET /admin/analytics/enrollments`

```json
{
  "total_enrollments": 1250,
  "active_enrollments": 980,
  "by_track": [
    { "track": "Diplomatura en Ciencia de Datos", "count": 340, "eligible": 280 },
    { "track": "Diplomatura en Desarrollo Web", "count": 290, "eligible": 210 }
  ],
  "by_status": {
    "active": 980,
    "archived": 150,
    "inactive": 120
  },
  "monthly_trend": [
    { "month": "2026-01", "enrollments": 45 },
    { "month": "2026-02", "enrollments": 62 }
  ]
}
```

## Implementation

- New route in `admin.ts`
- SQL aggregation queries with GROUP BY
- Cache: 5-minute in-memory cache for dashboard stats
- Return last 12 months for trend data

## Acceptance Criteria

- [ ] GET /admin/analytics/enrollments returns structured data
- [ ] Data matches actual DB counts (verified by direct query)
- [ ] by_track includes all active tracks
- [ ] monthly_trend returns last 12 months (or fewer if no data)
- [ ] Response time < 500ms

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
