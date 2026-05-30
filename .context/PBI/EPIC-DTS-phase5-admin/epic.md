# EPIC-DTS-phase5-admin — Admin & Integration Sync

> **Phase**: 5 · **Total SP**: 30 · **Priority**: Must Have
> **Goal**: Admin dashboard with stats, Moodle sync operational, integration monitoring.

---

## Summary

Deliver the admin dashboard with real-time statistics, full admin management views for students and tracks/courses, and the complete Moodle integration pipeline: batch certificate sync, individual re-sync, integration status/logs viewer, and a resilient adapter with retry, backoff, timeout, and graceful degradation.

---

## Child Stories

| ID | Story | Dependencies | SP | Status |
|----|-------|-------------|-----|--------|
| DTS-ADMIN-1 | Admin dashboard stats | DTS-CORE-1 + DTS-CORE-3 + DTS-CORE-5 | 5 | — |
| DTS-ADMIN-2 | Admin student list + detail (full profile) | DTS-CORE-3 | 3 | — |
| DTS-ADMIN-3 | Admin tracks + courses management | DTS-CORE-1 + DTS-CORE-2 | 3 | — |
| DTS-SYNC-1 | Moodle batch certificate sync | DTS-INT-2 + DTS-INT-3 + DTS-CORE-3 | 8 | — |
| DTS-SYNC-2 | Individual certificate re-sync | DTS-SYNC-1 | 3 | — |
| DTS-SYNC-3 | Integration status + logs viewer | DTS-INT-3 | 3 | — |
| DTS-SYNC-4 | Resilient adapter (retry + timeout) | DTS-SYNC-1 | 5 | — |

---

## Key Deliverables

- [ ] Admin dashboard with stats
- [ ] Admin student management
- [ ] Admin track/course management
- [ ] Moodle batch sync operational
- [ ] Individual certificate re-sync
- [ ] Integration status + logs viewer
- [ ] Resilience: retry, backoff, timeout, graceful degradation

---

## Dependencies

- **Blocks**: Phase 6 (sync-triggered notifications)
- **Blocked by**: Phase 1 (DTS-INT-1, DTS-INT-2, DTS-INT-3), Phase 2 (DTS-CORE-1, DTS-CORE-2, DTS-CORE-3, DTS-CORE-5)
- **Parallel with**: DTS-ADMIN-1 through DTS-ADMIN-3 can run parallel to DTS-SYNC-1 through DTS-SYNC-4

---

## Risk Note

| Risk | Mitigation |
|------|------------|
| Sync performance degrades with 10K+ students | Batch processing (50/block). Async with progress polling. |
| Provider credentials leak | AES-256-GCM encryption at rest. Never in logs or responses. |

---

## Sprint Allocation

| Sprint | Stories | SP |
|--------|---------|-----|
| Sprint 6 | DTS-ADMIN-1, DTS-ADMIN-2, DTS-ADMIN-3 | 11 |
| Sprint 7 | DTS-SYNC-1, DTS-SYNC-2, DTS-SYNC-3 | 14 |
| Sprint 8 | DTS-SYNC-4 | 5 |

---

> *Generated from Master Implementation Plan v1.0*
