# DTS-EXAM-3: Edge Cases

## Boundary Conditions
- Exam date in the past: rejected; 400 `exam_date_in_past`; must be ≥ today
- Exam date far in future (>1 year): accepted; no upper limit
- Same student, same course, different exam date: allowed (re-take); new enrollment row with different date
- Same student, same course, same exam date: 409 `already_enrolled_exam_date`; unique check on `(student_id, course_id, exam_date)`
- Enrollment for course with no prerequisites: always eligible; no rule evaluation needed
- Student eligible but already took exam and passed (aprobado): re-enrollment allowed; previous grade not blocking

## Error Paths
- Student not eligible at enrollment time: 400 `not_eligible`; includes eligibility breakdown in response
- Non-existent student/course/track: 404 respectively
- Enrollment for course in different track than student's enrollment: 400 `course_not_in_student_track`
- Re-evaluation during enrollment fails (rule engine error): enrollment rejected; 503; no partial enrollment
- Student already has `inscripto` status for this exam date: 409; cannot double-register same date

## Concurrency
- Two coordinators enroll same student to same exam simultaneously: first wins (unique constraint); second 409
- Enrollment + eligibility change (override created) concurrent: enrollment uses eligibility at request time; override created after doesn't retroactively affect this enrollment
