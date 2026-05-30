# EPIC-DTS-phase2-core — Core Domain CRUD

> **Phase**: 2 · **Total SP**: 19 · **Priority**: Must Have
> **Goal**: Students, courses, tracks CRUD operational. Certificates viewable. Basic enrollment.

---

## Summary

Build the core domain layer of the Diploma Tracking System. Implement full CRUD for tracks, courses, and students. Enable single and batch enrollment of students into tracks. Provide certificate listing and detail views.

---

## Child Stories

| ID | Story | Dependencies | SP | Status |
|----|-------|-------------|-----|--------|
| DTS-CORE-1 | Tracks CRUD (list, create, get, update) | DTS-AUTH-3 | 3 | — |
| DTS-CORE-2 | Courses CRUD (list, create, get) | DTS-CORE-1 | 3 | — |
| DTS-CORE-3 | Students CRUD (list, get, search) | DTS-AUTH-3 | 3 | — |
| DTS-CORE-4 | Enrollment (single student to track) | DTS-CORE-1 + DTS-CORE-3 | 3 | — |
| DTS-CORE-5 | Certificate list + get by ID | DTS-CORE-2 + DTS-CORE-3 | 2 | — |
| DTS-CORE-6 | Batch enrollment from CSV | DTS-CORE-4 | 5 | — |

---

## Key Deliverables

- [ ] Tracks CRUD (admin)
- [ ] Courses CRUD (admin)
- [ ] Students list + search + detail
- [ ] Single enrollment (coordinator)
- [ ] Certificate list view (student)
- [ ] Batch CSV enrollment

---

## Dependencies

- **Blocks**: Phase 3, Phase 4, Phase 5
- **Blocked by**: Phase 1 (DTS-AUTH-3)
- **Parallel with**: None

---

## Sprint Allocation

| Sprint | Stories | SP |
|--------|---------|-----|
| Sprint 2 | DTS-CORE-1, DTS-CORE-2, DTS-CORE-3, DTS-CORE-4 | 12 |
| Sprint 3 | DTS-CORE-5, DTS-CORE-6 | 7 |

---

> *Generated from Master Implementation Plan v1.0*
