# EPIC-DTS-phase4-exam — Enrollment & Exam

> **Phase**: 4 · **Total SP**: 23 · **Priority**: Must Have
> **Goal**: Full exam lifecycle — eligibility check, registration, grading, history.

---

## Summary

Build the full exam lifecycle: student progress tracking, real-time eligibility checks via the rule engine, exam enrollment (inscripción a examen) with re-evaluation guard, grade recording with automatic status transitions, and exam history views for students.

---

## Child Stories

| ID | Story | Dependencies | SP | Status |
|----|-------|-------------|-----|--------|
| DTS-EXAM-1 | Student progress API | DTS-CORE-2 + DTS-CORE-3 + DTS-CORE-5 | 5 | — |
| DTS-EXAM-2 | Eligibility check on dashboard | DTS-RULE-2 + DTS-EXAM-1 | 5 | — |
| DTS-EXAM-3 | Exam enrollment (inscribir a examen) | DTS-EXAM-2 | 5 | — |
| DTS-EXAM-4 | Grade recording (+ auto-status transition) | DTS-EXAM-3 | 5 | — |
| DTS-EXAM-5 | Exam history view | DTS-EXAM-3 | 3 | — |

---

## Key Deliverables

- [ ] Student progress API (modules + certificates)
- [ ] Eligibility endpoint connected to rule engine
- [ ] Exam registration with re-evaluation
- [ ] Grade recording with auto-status
- [ ] Exam history for students

---

## Dependencies

- **Blocks**: Phase 5 (admin dashboards), Phase 6 (notifications, coordinator dashboard)
- **Blocked by**: Phase 2 (DTS-CORE-2, DTS-CORE-3, DTS-CORE-5), Phase 3 (DTS-RULE-2)
- **Parallel with**: None

---

## Enrollment State Machine

```
null ──enroll_to_exam──▶ inscripto ──grade_recorded──▶ aprobado (grade≥4)
                                                   └──▶ desaprobado (grade<4)
desaprobado ──re_enroll──▶ inscripto
aprobado ──admin_issue_diploma──▶ diploma_pendiente
```

---

## Sprint Allocation

| Sprint | Stories | SP |
|--------|---------|-----|
| Sprint 5 | DTS-EXAM-1, DTS-EXAM-2, DTS-EXAM-3 | 15 |
| Sprint 6 | DTS-EXAM-4, DTS-EXAM-5 | 8 |

---

> *Generated from Master Implementation Plan v1.0*
