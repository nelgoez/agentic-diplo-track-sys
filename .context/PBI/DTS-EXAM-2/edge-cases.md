# DTS-EXAM-2: Edge Cases

## Boundary Conditions
- Student not enrolled in any track: eligibility returns empty; or 400 `student_not_enrolled`
- Student enrolled in multiple tracks: eligibility returned per-track; client specifies `?trackId=:id`
- All rules pass: `eligible: true` for all courses in track; breakdown shows each course as `met`
- No rules at all for track: all courses eligible; `eligible: true` universally
- Override makes student eligible but certificates missing: rule node shows `overridden: true` in breakdown; not `certificate_found`

## Error Paths
- Non-existent student: 404
- Non-existent track: 404
- Student enrolled but track deactivated: still return eligibility; enrollment is active; track status doesn't block evaluation
- Rule engine throws during eligibility check: caught; 500 with `evaluation_error`; partial breakdown with error flags
- Database timeout during evaluation: 503; retry suggested; no cached stale result

## Concurrency
- Eligibility check while override being created: may miss override in this evaluation; client retries
- Eligibility check while certificates being synced: partial certificate set possible; recommendation: run eligibility after sync completes
- Two simultaneous eligibility checks for same student: both return same result (deterministic evaluation); no cache warming
