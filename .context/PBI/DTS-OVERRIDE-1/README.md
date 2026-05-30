# DTS-OVERRIDE-1 — Override expiry scheduler

**Phase**: 6 — Notifications & Polish (Should Have)
**Effort**: 3 SP
**Dependencies**: DTS-RULE-3

**Acceptance Criteria:**
- Cron job: daily check for expired overrides -> set status=expired -> re-evaluate affected students -> notify coordinators.
