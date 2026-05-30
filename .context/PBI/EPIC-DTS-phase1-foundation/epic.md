# EPIC-DTS-phase1-foundation — Foundation

> **Phase**: 1 · **Total SP**: 21 · **Priority**: Must Have
> **Goal**: Auth system operational, database seeded, provider interfaces defined. Everything else depends on this.

---

## Summary

Establish the technical foundation for the Diploma Tracking System. Set up Supabase project with full database schema, implement JWT-based authentication with RBAC middleware, build user management API, define provider abstraction interfaces for external integrations, create a mock Moodle provider, and set up integration logging infrastructure.

---

## Child Stories

| ID | Story | Dependencies | SP | Status |
|----|-------|-------------|-----|--------|
| DTS-AUTH-1 | Supabase project setup + DB schema migration | None | 3 | — |
| DTS-AUTH-2 | JWT authentication (login + refresh + logout) | DTS-AUTH-1 | 5 | — |
| DTS-AUTH-3 | RBAC middleware (authenticate + requireRole) | DTS-AUTH-2 | 3 | — |
| DTS-AUTH-4 | User CRUD + role management | DTS-AUTH-1 | 5 | — |
| DTS-INT-1 | Provider abstraction interfaces + registry | None | 5 | — |
| DTS-INT-2 | Moodle provider (mock + health check) | DTS-INT-1 | 3 | — |
| DTS-INT-3 | Integration logs table + logging middleware | DTS-AUTH-1 | 2 | — |

---

## Key Deliverables

- [ ] Supabase project + schema migrated
- [ ] Auth endpoints working (login, refresh, logout, me)
- [ ] RBAC middleware blocking unauthorized access
- [ ] User management API
- [ ] Provider interfaces defined (`CertificateProvider`, `AcademicProvider`)
- [ ] Moodle provider (mock) with health check
- [ ] Integration logging infrastructure

---

## Dependencies

- **Blocks**: Phase 2, Phase 3, Phase 4, Phase 5
- **Blocked by**: None
- **Parallel with**: None (Phase 1 runs solo)

---

## Sprint Allocation

Sprint 1: All 7 stories (21 SP)

---

> *Generated from Master Implementation Plan v1.0*
