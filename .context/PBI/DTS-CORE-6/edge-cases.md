# DTS-CORE-6: Edge Cases

## Boundary Conditions
- Empty CSV file (headers only): 400 `empty_file`; no processing
- CSV with 10,000 rows: processed in batches internally; no request timeout; summary returned after completion
- CSV missing email column: 400 `missing_email_column`; column names case-insensitive
- CSV with extra columns: ignored; no error
- CSV email case variations (UPPER/lower/Mixed): normalized to lowercase before lookup
- BOM character in UTF-8 CSV: stripped; file read correctly

## Error Paths
- CSV with invalid encoding (not UTF-8): 400 `invalid_encoding`; BOM detection
- Malformed CSV (unescaped quotes, mismatched columns): row skipped; error counted in `errors[]` summary; processing continues
- Email not found + no name fields to create student: row skipped; error "missing student name for new student"
- Duplicate email in same CSV: first occurrence processed; subsequent flagged as duplicate in same batch; dedup summary
- File upload exceeds size limit (configurable, default 5MB): 413 `file_too_large`

## Concurrency
- Two batch enrollments for same track simultaneously: independent processing; duplicate enrollment check per-row; second batch skips already-enrolled
- Batch enrollment + single enrollment overlapping: individual enrollment may create student before batch processes same email; batch treats as existing
