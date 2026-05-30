# DTS-ADMIN-3: Edge Cases

## Boundary Conditions
- Create track with duplicate code (case-insensitive): 409; code normalized to uppercase before uniqueness check
- Update track status to inactive with active enrollments: allowed; enrollments remain active but new enrollments blocked
- Delete track with zero enrollments: allowed; cascade deletion of courses (if no certificates); blocked if courses have certificates
- Reorder courses via batch update: all course `order_index` values updated in single transaction; gaps in numbering allowed
- Admin not scoped to organization: sees all tracks across all faculties (if `admin` role); `coordinador` scoped to assigned tracks

## Error Paths
- Delete track with existing certificates: 409 `track_has_certificates`; must deactivate + archive instead
- Delete course with existing certificates: 409 `course_has_certificates`
- Create course in non-existent track: 404
- Update track with code that collides with another track: 409 `code_already_exists`
- Bulk update exceeds request size limit: 413; split into chunks

## Concurrency
- Admin deletes track while coordinator views track detail: delete succeeds; coordinator gets 404 on refresh
- Two admins update same track: last write wins; no optimistic locking for admin operations
- Admin creates course while batch enrollment processes: course not yet visible to batch; batch only enrolls in existing courses
