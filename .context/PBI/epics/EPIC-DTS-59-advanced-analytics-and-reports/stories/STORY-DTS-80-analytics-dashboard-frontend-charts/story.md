# Analytics dashboard — frontend charts

**Jira Key:** [DTS-80](https://diplo-track-sys.atlassian.net/browse/DTS-80)
**Epic:** [DTS-59](https://diplo-track-sys.atlassian.net/browse/DTS-59) (Advanced Analytics and Reports)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Analytics dashboard — frontend charts

> [!NOTE] ***Frontend.*** Depends on DTS-59-1 and DTS-59-2 endpoints.

## Objective

Build a visual analytics tab in the admin panel showing enrollment and certificate data as charts.

## Location

New tab in AdminPage: "Analíticas"

## Charts

### Enrollment trend (line chart)

- X-axis: months (last 12)
- Y-axis: count
- Two lines: total enrollments, eligible students
- Pure CSS/SVG — no chart library

### Certificates by course (bar chart)

- Horizontal bars
- Course name + completion count + average grade

### Track breakdown (ring chart)

- Each track as a segment
- Shows enrolled vs completed
- Pure CSS conic gradient (same technique as DTS-69)

### Summary cards

- Total certificates issued
- Average grade across all
- Completion rate (certificates / enrollments)
- Most popular course

## Technical

- All charts: pure CSS/SVG, no Chart.js or recharts
- Reusable Chart components: LineChart, BarChart, RingChart
- Data from DTS-59-1 and DTS-59-2 endpoints
- 5-min auto-refresh with pull-to-refresh button

## Acceptance Criteria

- [ ] 4 chart types render correctly
- [ ] Data reflects real DB counts
- [ ] Responsive (stack on mobile)
- [ ] No new charting library dependencies
- [ ] Loading skeletons while data fetches

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
