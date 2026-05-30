# DTS-CORE-5 — Certificate list + get by ID

**Phase**: 2 — Core Domain
**Effort**: 2 SP
**Dependencies**: DTS-CORE-2, DTS-CORE-3

**Acceptance Criteria:**
- GET /students/:id/certificates returns paginated list.
- GET /certificates/:id returns detail.
- Data includes course name, issue date, provider, status.
