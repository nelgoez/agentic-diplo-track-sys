# DTS-CORE-6 — Batch enrollment from CSV

**Phase**: 2 — Core Domain
**Effort**: 5 SP
**Dependencies**: DTS-CORE-4

**Acceptance Criteria:**
- POST /enrollments/batch accepts CSV with email column.
- Creates new students, enrolls existing.
- Returns summary: created, enrolled, already enrolled, errors.
