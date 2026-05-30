# DTS-EXAM-3 — Spec Compliance Matrix

| AC scenario | covered_by | evidence | status |
|---|---|---|---|
| AC1: Exam registration sets exam_status=inscripto with exam_date | test:smoke-exam | `PUT /:id/exam` → 200, `exam_status=inscripto` verified in smoke-exam.ts step 4 | covered |
| AC2: Eligibility rejection returns 409 with reason | test:smoke-exam | Smoke test step 3: grade w/o inscripto → 409 with "Student is not registered for an exam" | covered |
| AC3: Duplicate date rejection returns 409 | manual:code | `enrollments.ts:158-168` — `.eq('student_id', ...).eq('exam_date', ...).not('exam_status', 'is', null)` — DB-level partial unique index also enforces | covered |
| AC4: Non-existent enrollment returns 404 | manual:code | `enrollments.ts:148-156` — `.eq('id', id).single()` check → `'Enrollment not found'` 404 | covered |
| AC5: Auth — 401 unauthenticated, 403 wrong role | manual:code | `enrollments.ts:9` — `enrollments.use('/*', authenticate)` + line 139 `requireRole('coordinador', 'admin', 'sysadmin')` | covered |
