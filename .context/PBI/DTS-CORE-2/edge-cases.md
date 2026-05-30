# DTS-CORE-2: Edge Cases

## Boundary Conditions
- `order_index` collision (two courses with same order): both returned; tiebreaker by `created_at`; no unique constraint on `(track_id, order_index)`
- `order_index` negative or zero: rejected; must be ≥1; 400 on validation
- Course added to inactive track: rejected; 400 `track_inactive`
- Credits value of zero: allowed (non-credit course/bonus module); no validation floor
- `moodle_course_id` NULL: allowed; course may not yet be mapped to Moodle
- Max courses per track: no hard limit; UI/API pagination handles large lists

## Error Paths
- Duplicate course code within same track: 409 `code_already_exists_in_track`; composite unique `(track_id, code)`
- Create course for non-existent track: 404 `track_not_found`
- Delete course with existing certificates: 409 `course_has_certificates`; deactivate instead
- Update course that doesn't exist: 404
- `order_index` reordering (update all courses in track): N updates; no transaction needed; clients re-fetch list to see new order

## Concurrency
- Two admins create course same code same track: first wins; second 409; no race window
- Reorder courses while student views list: old order shown to in-flight request; next request sees new order; no stale lock
