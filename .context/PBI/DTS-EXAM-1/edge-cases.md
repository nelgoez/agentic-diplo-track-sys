# DTS-EXAM-1: Edge Cases

## Boundary Conditions
- Student enrolled in zero tracks: progress returns empty array or `enrollments: []`; no error
- Student with all modules completed: `completedModules === totalModules`; progress: 100%; `nextSteps: []`
- Student with certificates from multiple providers for same course: deduplicated; latest/wins (by `issued_at`); per-course status is binary
- Course with no certificate requirement (optional module): counted in `totalModules`; status `not_required`; doesn't block progress
- `nextSteps`: only returns courses where student is not eligible and not yet enrolled in exam

## Error Paths
- Non-existent student UUID: GET /students/:id/progress returns 404
- Student exists but not in `students` table (auth-only user): returns 400 `not_a_student`; student profile must exist
- Internal error fetching certificates (DB timeout): returns 503; partial progress not returned; all-or-nothing
- Course in track deleted after enrollment: still counted in `totalModules`; status `unavailable` or `course_deleted`

## Concurrency
- Progress read while exam is graded: progress sees old certificate state; next read reflects new grade → potential brief inconsistency
- Progress read while batch sync runs: certificates may change mid-calculation; acceptable eventual consistency for dashboard
