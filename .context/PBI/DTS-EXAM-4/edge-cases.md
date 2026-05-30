# DTS-EXAM-4: Edge Cases

## Boundary Conditions
- Grade exactly 1: valid; auto-status → `desaprobado`
- Grade exactly 4: valid; auto-status → `aprobado` (passing threshold)
- Grade exactly 10: valid; auto-status → `aprobado`
- Grade with decimal (e.g., 7.5): rejected if schema is INTEGER; if NUMERIC(3,1), accepted in range; round to 1 decimal
- Grade 0: rejected; valid range 1-10
- Re-grade (student already has grade for this enrollment): overwritten; old value logged in `audit_log`; `graded_at` updated

## Error Paths
- Non-existent enrollment: PUT /enrollments/:id/grade returns 404
- Grade enrollment not in `inscripto` status: 400 `invalid_status_for_grading`; only `inscripto` can be graded
- Grade value >10 or <1: 400 `grade_out_of_range` (must be 1-10)
- Coordinator not assigned to student's track: 403
- Audit log insert fails: grade still recorded; warning logged; audit gap tracked
- Grading enrollment from different course than coordinator manages: 403 cross-track

## Concurrency
- Two graders grade same enrollment simultaneously: last write wins (no optimistic lock); second grade overwrites first; both recorded in audit_log
- Grade + re-enroll for same course (by another coordinator): grading completes first; enrollment status becomes `aprobado`/`desaprobado`; re-enroll creates new enrollment row with exam_status=inscripto
