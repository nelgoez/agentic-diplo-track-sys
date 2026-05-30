# Epic Tree — Diploma Tracking System

> **Project**: Diploma Tracking System — Universidad Nacional de Córdoba
> **Version**: 1.0 · **Status**: Final
> **Language**: English

---

## Phase 1: Foundation (21 SP)
### EPIC-DTS-phase1-foundation
- **DTS-AUTH-1** — Supabase project setup + DB schema migration (3 SP)
- **DTS-AUTH-2** — JWT authentication (login + refresh + logout) (5 SP)
- **DTS-AUTH-3** — RBAC middleware (authenticate + requireRole) (3 SP)
- **DTS-AUTH-4** — User CRUD + role management (5 SP)
- **DTS-INT-1** — Provider abstraction interfaces + registry (5 SP)
- **DTS-INT-2** — Moodle provider (mock + health check) (3 SP)
- **DTS-INT-3** — Integration logs table + logging middleware (2 SP)

## Phase 2: Core Domain (19 SP)
### EPIC-DTS-phase2-core
- **DTS-CORE-1** — Tracks CRUD (list, create, get, update) (3 SP)
- **DTS-CORE-2** — Courses CRUD (list, create, get) (3 SP)
- **DTS-CORE-3** — Students CRUD (list, get, search) (3 SP)
- **DTS-CORE-4** — Enrollment (single student to track) (3 SP)
- **DTS-CORE-5** — Certificate list + get by ID (2 SP)
- **DTS-CORE-6** — Batch enrollment from CSV (5 SP)

## Phase 3: Rule Engine (23 SP)
### EPIC-DTS-phase3-rules
- **DTS-RULE-1** — Prerequisite rules CRUD (create, list, update, delete) (8 SP)
- **DTS-RULE-2** — Rule engine evaluator (recursive tree) (8 SP)
- **DTS-RULE-3** — Manual override CRUD (5 SP)
- **DTS-RULE-4** — View rule tree (read) (2 SP)

## Phase 4: Enrollment & Exam (23 SP)
### EPIC-DTS-phase4-exam
- **DTS-EXAM-1** — Student progress API (5 SP)
- **DTS-EXAM-2** — Eligibility check on dashboard (5 SP)
- **DTS-EXAM-3** — Exam enrollment (inscribir a examen) (5 SP)
- **DTS-EXAM-4** — Grade recording (+ auto-status transition) (5 SP)
- **DTS-EXAM-5** — Exam history view (3 SP)

## Phase 5: Admin & Integration (30 SP)
### EPIC-DTS-phase5-admin
- **DTS-ADMIN-1** — Admin dashboard stats (5 SP)
- **DTS-ADMIN-2** — Admin student list + detail (full profile) (3 SP)
- **DTS-ADMIN-3** — Admin tracks + courses management (3 SP)
- **DTS-SYNC-1** — Moodle batch certificate sync (8 SP)
- **DTS-SYNC-2** — Individual certificate re-sync (3 SP)
- **DTS-SYNC-3** — Integration status + logs viewer (3 SP)
- **DTS-SYNC-4** — Resilient adapter (retry + timeout) (5 SP)

---

## Dependencies

```
Phase 1 ──▶ Phase 2 ──▶ Phase 3 ──▶ Phase 4 ──▶ Phase 5
Foundation    Core        Rule        Enrollment    Admin &
(Auth+DB+     Domain      Engine      & Exam        Integration
Provider)     (CRUD)                              Sync
                │            │            │            │
                └────────────┴────────────┴────────────┘
                                           │
                                    Phase 6 (Should)
                                    Notifications
                                    & Polish
```

Phases 1-5 = MVP "Must Have"
Phase 6    = MVP "Should Have" (deprioritized but tracked)
Post-MVP   = "Could Have" + "Won't Have"

---

## Consolidated Effort

| Phase | SP | Must Have | Should Have | Could Have |
|-------|----|-----------|-------------|------------|
| 1. Foundation | 21 | 21 | 0 | 0 |
| 2. Core Domain | 19 | 19 | 0 | 0 |
| 3. Rule Engine | 23 | 18 | 5 | 0 |
| 4. Enrollment & Exam | 23 | 20 | 3 | 0 |
| 5. Admin & Integration | 30 | 30 | 0 | 0 |
| 6. Notifications & Polish | 27 | 0 | 22 | 5 |
| **Total MVP (Must)** | **116** | **108** | **8** | **0** |

---

## Phase 6: Notifications & Polish (27 SP, Should Have)

- **DTS-NOTIF-1** — Eligibility change notification (5 SP)
- **DTS-NOTIF-2** — New certificate notification (3 SP)
- **DTS-NOTIF-3** — Notification table + API (3 SP)
- **DTS-OVERRIDE-1** — Override expiry scheduler (3 SP)
- **DTS-INT-5** — Guaraní student sync (8 SP)
- **DTS-EXTRAS-1** — Coordinator dashboard with filters (5 SP)

---

## Recommended Sprint Allocation

```
Sprint 1: Phase 1 (Foundation)
  - DTS-AUTH-1, DTS-AUTH-2, DTS-AUTH-3, DTS-AUTH-4
  - DTS-INT-1, DTS-INT-2, DTS-INT-3

Sprint 2: Phase 2 (Core Domain)
  - DTS-CORE-1, DTS-CORE-2, DTS-CORE-3, DTS-CORE-4

Sprint 3: Phase 2 (Finish) + Phase 3 Start
  - DTS-CORE-5, DTS-CORE-6
  - DTS-RULE-1 (rules CRUD)

Sprint 4: Phase 3 (Rule Engine)
  - DTS-RULE-2 (evaluator), DTS-RULE-3 (overrides), DTS-RULE-4 (viewer)

Sprint 5: Phase 4 (Enrollment & Exam)
  - DTS-EXAM-1, DTS-EXAM-2, DTS-EXAM-3

Sprint 6: Phase 4 (Finish) + Phase 5 Start
  - DTS-EXAM-4, DTS-EXAM-5
  - DTS-ADMIN-1, DTS-ADMIN-2, DTS-ADMIN-3

Sprint 7: Phase 5 (Sync)
  - DTS-SYNC-1, DTS-SYNC-2, DTS-SYNC-3

Sprint 8: Phase 5 (Resilience) + Phase 6 Start
  - DTS-SYNC-4
  - DTS-NOTIF-1, DTS-NOTIF-2, DTS-NOTIF-3

Sprint 9+: Phase 6 (Should Have backlog)
  - DTS-OVERRIDE-1, DTS-INT-5, DTS-EXTRAS-1
  - Bug fixes, polish, performance optimization
```

Total estimated duration: 9-10 sprints (2-week sprints = 18-20 weeks).

---

> *Generated from Master Implementation Plan v1.0. Refresh when scope changes or new stories are added.*
