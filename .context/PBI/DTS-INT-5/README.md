# DTS-INT-5 — Guaraní student sync

**Phase**: 6 — Notifications & Polish (Should Have)
**Effort**: 8 SP
**Dependencies**: DTS-INT-1, DTS-CORE-3

**Acceptance Criteria:**
- `GuaraniAcademicProvider` implements `AcademicProvider.fetchStudents()`.
- POST /integrations/sync/guarani triggers import.
- Upserts students by email/DNI.
- Same resilience pattern as Moodle.
