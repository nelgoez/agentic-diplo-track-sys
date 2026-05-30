# DTS-EXAM-5 — Spec Compliance Matrix

| AC scenario | covered_by | evidence | status |
|---|---|---|---|
| AC1: Returns exam attempts for a student (exam_status IS NOT NULL) | test:smoke-exam | `GET ?exam_history=true` → 0 rows before exam, 1 row after grading. Verified in smoke-exam.ts | covered |
| AC2: Sorted by date descending (exam_date DESC) | manual:code | `enrollments.ts:26` — `.order('exam_date', { ascending: false })` | covered |
| AC3: Shows date, grade, result, diploma status | manual:code | `select('*, student:..., course:..., track:...')` — exam_date, qualification, exam_status all in response | covered |
| AC4: Joined data includes course name, track name | manual:code | `enrollments.ts:23-24` — `course:courses(id, name, code)`, `track:tracks(id, name)` | covered |
