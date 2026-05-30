# DTS-CORE-3: Edge Cases

## Boundary Conditions
- Search by empty string: returns all students (same as no filter); not rejected
- Search by partial DNI (e.g., "123"): matches any DNI containing "123"; LIKE `%123%`
- Student with no enrollments: returned in list; `enrollment_count: 0` in detail
- Pagination with very large `limit` (10000+): capped at 100 internally; response includes `total` count
- Unicode names (ñ, á, ç): stored and searchable; ILIKE works with UTF-8 collation

## Error Paths
- Create student with duplicate email: 409 `email_already_exists`; check across both `users.email` and `students.email`
- Create student with duplicate DNI: 409 `dni_already_exists`; unique constraint on `document_number`
- Get student detail for non-existent UUID: 404
- Create student without DNI (foreign student): allowed if DNI optional; NULL constraint relaxed for edge case; warn in docs
- Student soft-deleted (`is_active=false`): excluded from default list; included if `includeInactive=true` query param

## Concurrency
- Two coordinators create same DNI simultaneously: first wins (unique constraint); second gets 409
- Student update + enrollment to track concurrent: both succeed; enrollment sees latest student data
