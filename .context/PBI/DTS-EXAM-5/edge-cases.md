# DTS-EXAM-5: Edge Cases

## Boundary Conditions
- Student with zero exam attempts: list returns empty array; `total: 0`; 200 OK
- Student with 50+ exam attempts across courses: paginated; sorted by date DESC; no grouping by course in MVP
- Filter by course_id + student_id: returns only attempts for that course; independent of track
- Filter by track_id + student_id: returns all attempts for courses in that track
- Enrollment without exam_status (pure enrollment, no exam): excluded from exam history; exam history is exam attempts only

## Error Paths
- Non-existent student: GET /enrollments?studentId=:id returns 404
- Non-existent course filter: returns empty array (query parameter referencing unknown course); no 404 for filter value
- Filter by track student not enrolled in: returns empty array; not an error
- Missing studentId filter: 400 `student_id_required`; exam history is always scoped to one student

## Concurrency
- Exam history read while new exam enrollment created: reader sees snapshot; new enrollment may not appear until next request
- Exam history read while grade recorded: reader sees old or new grade; never partial enrollment row
