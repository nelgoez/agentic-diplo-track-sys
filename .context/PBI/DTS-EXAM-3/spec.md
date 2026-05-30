# DTS-EXAM-3 — Exam Enrollment Spec

**Phase**: 4 (Enrollment & Exam)
**Depends on**: DTS-EXAM-2 (eligibility check)
**Effort**: 5 SP

## Acceptance Criteria

### AC1: Exam Registration
**Given** a student is enrolled in a track
**And** the student is eligible for exam (rule engine returns `eligible: true`)
**When** coordinator calls `POST /enrollments/:id/exam` with `{ exam_date }`
**Then** enrollment's `exam_status` is set to `inscripto`
**And** `exam_date` is set to the provided date
**And** response returns 200 with updated enrollment

### AC2: Eligibility Rejection
**Given** a student is enrolled in a track
**And** the student is NOT eligible for exam (rule engine returns `eligible: false`)
**When** coordinator calls `POST /enrollments/:id/exam`
**Then** response returns 409 Conflict
**And** body includes eligibility result with reason

### AC3: Duplicate Date Rejection
**Given** a student already has an exam registered on date X
**When** coordinator tries to register same student for another exam on date X
**Then** response returns 409 Conflict (duplicate student+date)

### AC4: Not Found
**Given** a non-existent enrollment ID
**When** coordinator calls `POST /enrollments/:id/exam`
**Then** response returns 404

### AC5: Auth
**Given** an unauthenticated request
**When** calling `POST /enrollments/:id/exam`
**Then** response returns 401
**Given** a student tries to register themselves (not coordinator/admin)
**When** calling `POST /enrollments/:id/exam`
**Then** response returns 403
