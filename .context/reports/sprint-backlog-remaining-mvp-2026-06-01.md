# Sprint Backlog — Remaining MVP (DTS)

> **Role**: Scrum Master / Engineering Manager
> **Date**: 2026-06-01
> **Based on**: Code-verified STATE-OF-THE-PROJECT.md

---

## Actual Remaining Work (Code Verified)

| # | Jira | Story | BE | FE | Tests | **Effort** |
|---|------|-------|:--:|:--:|:-----:|:---:|
| 1 | DTS-22 | Grade Recording UI + Tests | ✅ Done | ❌ Missing | ❌ Missing | **1 SP** |
| 2 | DTS-24 | Resilient Adapter (retry wrapper) | ❌ | N/A | ❌ | **3 SP** |
| 3 | DTS-23 | Moodle: conflict guard + re-eval | ❌ | N/A | ❌ | **2 SP** |
| 4 | DTS-25 | Guaraní Student Sync | ❌ | ❌ | ❌ | **5 SP** |

**Total Must-Have remaining**: 11 SP (NOT 21 SP as previously estimated)

---

## Sprint Allocation

### Sprint N — Must-Have Closure (11 SP)

```
Week 1-2:
  DTS-24 (3 SP)  Resilient Adapter — standalone wrapper, enables retry for all providers
  DTS-22 (1 SP)  Grade Recording UI — coordinator grading form + modal
  DTS-23 (2 SP)  Moodle conflict guard + post-sync eligibility re-eval
  DTS-25 (5 SP)  Guaraní Student Sync — follows Moodle pattern with DTS-24 wrapper
```

**Execution**: DTS-24 + DTS-22 can run in parallel (independent). DTS-23 + DTS-25 start after DTS-24 completes.

**Why 11 SP in one sprint**: 3 stories are small (1-3 SP). DTS-25 is 5 SP but follows established Moodle pattern. At 20-25 SP velocity, 11 SP is conservative.

### Sprint N+1 — Should-Have (5 SP)

```
  DTS-NOTIF-3 (3 SP)   Notification table + API
  DTS-OVERRIDE-1 (2 SP)  Override expiry scheduler
```

---

## Definition of Done

- [ ] TypeScript: zero errors (client + server)
- [ ] Build: succeeds (client + server)
- [ ] Tests: all 82 existing + new tests pass
- [ ] E2E: no regression in 17 existing tests
- [ ] RBAC: all new endpoints gated with requireRole
- [ ] Jira: all stories transitioned to Done
- [ ] Staging: smoke test passes on Vercel deploy

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:---------:|:------:|------------|
| Moodle API token scope blocks multi-user sync | Medium | High | `findMoodleUserByEmail` already handles this gracefully — returns [] with warning |
| Guaraní API undocumented | Medium | Medium | Follow Moodle pattern. Mock-driven development first. |
| Vercel serverless kills async sync mid-flight | Low | Medium | Sync is in-process (not fire-and-forget). Response waits for completion. |
