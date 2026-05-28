# DTS-EXAM-1 — Compliance Matrix

| AC Scenario | Evidence | Status |
|-------------|----------|-------|
| GET /students/:id/progress returns TrackProgress | `students.ts:65-112` | PASS |
| totalModules from real enrollments | `students.ts:119` | PASS |
| completedModules from certificates | `students.ts:119-120` | PASS |
| Per-module status (completed/in_progress/pending) | `students.ts:98-110` | PASS |
| Credits total + accumulated | `students.ts:123-127` | PASS |
| NextSteps list (max 5) | `students.ts:127-130` | PASS |
| Progress percentage | `students.ts:125-127` | PASS |
| Requires authentication | `students.ts:7` | PASS |
