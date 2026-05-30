# DTS-CORE-5: Edge Cases

## Boundary Conditions
- Student with zero certificates: list returns empty array + total=0; 200 OK
- Certificate with `status=error` or `status=pending`: returned in list; status visible; not counted in eligibility
- Certificate from unknown provider (orphaned after provider removed): returned; `provider` field shows original value
- Pagination: `page` > total pages returns empty array; `total` still correct
- Certificate issued far in future (date anomaly): returned; no date validation on read

## Error Paths
- Non-existent student: GET /students/:id/certificates returns 404 `student_not_found`
- Non-existent certificate: GET /certificates/:id returns 404
- Request certificates for student not enrolled in any track: still returns certificates; certificates are student-scoped, not track-scoped
- Certificate with no associated course (course deleted): course info shows `null` or "Unknown Course"; certificate still returned

## Concurrency
- Certificate list read while sync upserts new certificates: reader sees snapshot at query time (PostgreSQL MVCC); no dirty reads
- Certificate detail read while re-sync updates same certificate: reader sees old or new version; never partial row
