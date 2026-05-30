# DTS-CORE-4: Edge Cases

## Boundary Conditions
- Enroll student already enrolled in same track: 409 `already_enrolled`; unique constraint on `(student_id, track_id)`
- Enroll student into inactive track: 400 `track_inactive`; validation before insert
- Enroll inactive student: allowed; enrollment created; student's inactive status is informational only
- Student has no email (edge case from manual creation): enrollment by UUID still works; email-based matching in batch flows skipped
- Enrollment created with `status=active` always; no "pending" or "invited" state in MVP

## Error Paths
- Non-existent student UUID: 404 `student_not_found`; no auto-creation in single-enroll flow
- Non-existent track UUID: 404 `track_not_found`
- Enrollment of student by coordinator not assigned to that track: 403; coordinator must be in `track_coordinators` for that track
- Student already enrolled but deactivated (`status=inactive`): re-activate (update status to active) instead of duplicate error; single enrollment record

## Concurrency
- Two coordinators enroll same student to same track simultaneously: first wins (unique constraint); second gets 409
- Enrollment + batch enrollment overlapping: individual enrollment may succeed before batch processes same student; batch skips already-enrolled
