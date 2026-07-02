# BUG: Certificates seeding and staff UI visibility fix

**Jira Key:** [DTS-27](https://diplo-track-sys.atlassian.net/browse/DTS-27)
**Priority:** Medium
**Status:** Done
**Components:** None

---

## Description

CertificatesPage.tsx was blocking staff roles (admin, coordinator, sysadmin) — setting certificates=[] and showing a static redirect message instead of fetching the API.

- Staff now fetches GET /certificates*** and displays all certificates with student name, course name, date, status.***
- mapResponse()*** helper transforms nested API response (student.name, course.name) into flat render objects.***
- DB seeded*** — 27 certificates across all 6 active students using real courses. Previously only 4 certs for 2 students.***
- Student column conditionally visible for staff roles.

Verified: admin/coordinator/sysadmin can now see all certificates. 27 certs visible in production. Playwright 7/7 passed.

---

## Metadata

- **Created:** 4/6/2026
- **Updated:** 5/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez

---

_Synced from Jira by sync-jira-issues_
