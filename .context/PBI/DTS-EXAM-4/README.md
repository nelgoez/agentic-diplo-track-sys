# DTS-EXAM-4 — Grade recording (+ auto-status transition)

**Phase**: 4 — Enrollment & Exam
**Effort**: 5 SP
**Dependencies**: DTS-EXAM-3

**Acceptance Criteria:**
- PUT /enrollments/:id/grade records grade (1-10).
- Grade >= 4 -> exam_status=aprobado, diploma_pendiente.
- Grade < 4 -> exam_status=desaprobado.
- Validation: inscripto status, valid range. Audit log on grade.
