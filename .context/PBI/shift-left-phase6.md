# Shift-Left QA — Phase 6 Backlog Refinement

> Session: 2026-05-30 · Skill: /shift-left-testing
> Scope: DTS Should-Have stories (Phase 6)
> Output: ATP outlines, gaps, ambiguities per story

## DTS-NOTIF-1: Eligibility Change Notification

**Current AC** (from spec.md):
- When rule evaluation changes from not-eligible → eligible, create notification record
- Notification visible in student dashboard
- Unread count badge
- Mark as read

**Shift-Left Findings:**

| # | Gap / Ambiguity | Severity | Recommendation |
|---|---|---|---|
| 1 | What triggers re-evaluation after sync? | Medium | Add explicit trigger: `POST /integrations/sync/moodle` response includes list of re-evaluated students |
| 2 | Notification deduplication? If student becomes eligible twice (sync → override applied), creates 2 notifications or updates 1? | Low | Deduplicate: if unread notification for same eligibility change exists, update timestamp |
| 3 | Unread badge: real-time (polling) or on page load? | Low | On page load. WebSocket not needed for MVP |
| 4 | Notification expires? Storage limit? | Low | Keep 90 days then soft-delete. Add `expires_at = created_at + 90d` |

**ATP Outline:**
```
Scenario 1: Notification created on eligibility change
  Given student is NOT eligible for track DIP-CD-2025
  When a certificate sync completes and student reaches 5/5 courses
  Then a notification is created with type=eligibility_change, read=false
  And GET /notifications returns it as first unread entry

Scenario 2: Unread count badge
  Given student has 3 unread notifications
  When GET /notifications/unread-count is called
  Then response is { count: 3 }

Scenario 3: Mark as read
  Given student has a notification with read=false
  When PUT /notifications/:id/read is called
  Then notification.read becomes true
  And unread count decrements
```

**Risk**: Low. Straightforward CRUD. Depends on notification table (to be created in migration).

---

## DTS-NOTIF-2: New Certificate Notification

**Current AC** (from spec.md):
- When sync imports new certificate (not update), create notification for student
- Includes course name + date

**Shift-Left Findings:**

| # | Gap / Ambiguity | Severity | Recommendation |
|---|---|---|---|
| 1 | "New certificate" vs "updated certificate" distinction | Medium | Detect by checking if certificate with same (student_id, course_id, provider) exists before insert. If INSERT → "new". If UPDATE (issue_date changed) → "updated" (optional notification). |
| 2 | Batch spam: sync imports 5 certificates for 1 student → 5 notifications? | High | Batch: if >1 new cert in same sync, create 1 notification "5 new certificates added" instead of 5 separate ones |
| 3 | Course name: from Moodle or from DTS courses table? | Low | From DTS courses table (cached). Fallback to Moodle-provided name. |

**ATP Outline:**
```
Scenario 1: New certificate notification
  Given student is enrolled in track DIP-CD-2025 with 2 existing certificates
  When sync imports a new certificate for course CD-103
  Then a notification is created: "Nuevo certificado: Fundamentos de Python - 2026-01-21"

Scenario 2: Updated certificate — no notification
  Given student already has a certificate for CD-101 with issue_date 2026-01-15
  When sync imports same certificate with unchanged issue_date
  Then NO notification is created (idempotent update)

Scenario 3: Batch notification
  Given student has 0 certificates
  When sync imports 3 new certificates in one batch
  Then 1 notification is created: "3 nuevos certificados importados"
```

**Risk**: Medium. Requires UPSERT vs INSERT detection logic in sync service.

---

## DTS-NOTIF-3: Notification Table + API

**Current AC** (from spec.md):
- notifications table: id, userId, type, title, body, read, createdAt
- GET /notifications (paginated, unread first)
- PUT /notifications/:id/read
- Unread count badge endpoint

**Shift-Left Findings:**

| # | Gap / Ambiguity | Severity | Recommendation |
|---|---|---|---|
| 1 | Table needs migration | Critical | Create migration 006 with: id UUID PK, user_id UUID FK→students, type TEXT (CHECK: eligibility_change, new_certificate, override_applied, override_expired), title TEXT, body TEXT, read BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW() |
| 2 | Pagination: same pattern as other endpoints? | Low | Yes. Limit 20, offset, ordered created_at DESC, unread first |
| 3 | Link to relevant entity? | Medium | Add optional entity_type + entity_id columns so notification "nuevo certificado" links to the certificate |

**ATP Outline:**
```
Scenario 1: GET /notifications — unread first
  Given student has 5 notifications (2 unread, 3 read)
  When GET /notifications is called
  Then response is array of 5, first 2 have read=false, sorted created_at DESC

Scenario 2: Mark notification as read
  Given notification with id=X and read=false
  When PUT /notifications/X/read is called
  Then 200 OK, notification.read=true

Scenario 3: Unread count badge
  Given student has 3 unread notifications
  When GET /notifications?unread=true (or dedicated /unread-count)
  Then response is { count: 3 }
```

**Risk**: Low. Straightforward CRUD + migration.

---

## DTS-OVERRIDE-1: Override Expiry Scheduler

**Current AC** (from spec.md):
- Cron job: daily check for expired overrides → set status=expired → re-evaluate affected students → notify coordinators

**Shift-Left Findings:**

| # | Gap / Ambiguity | Severity | Recommendation |
|---|---|---|---|
| 1 | Where does cron run? Vercel Serverless has no cron. | Critical | Options: (a) pg_cron on Supabase, (b) GitHub Actions scheduled workflow, (c) Vercel Cron Jobs. Recommend option (b) — GitHub Actions daily at 3AM UTC running a CLI script. |
| 2 | "Notify coordinator" — via which channel? | High | For MVP: add notification record in notifications table visible to affected coordinator. Email later. |
| 3 | Re-evaluation: sync or async? If async, how to notify coordinator? | Low | Sync: update overrides, then loop re-evaluate, then create notifications. Small data size makes sync fine. |
| 4 | Threshold: what if 500 overrides expire same day? | Medium | Batch in groups of 100 to avoid DB overload. |

**ATP Outline:**
```
Scenario 1: Single override expiry
  Given override for student S, rule R with expires_at = yesterday
  When expiry scheduler runs
  Then override.status becomes 'expired'
  And student S eligibility is re-evaluated
  And if S becomes ineligible, a notification is created

Scenario 2: Multiple overrides in one batch
  Given 5 active overrides, 2 expired, 3 still valid
  When expiry scheduler runs
  Then 2 overrides are set to expired
  And both affected students are re-evaluated

Scenario 3: Re-evaluation triggers eligibility change
  Given override was the only reason student S was eligible
  When override expires
  And re-evaluation runs
  Then student S eligibility becomes false
  And DTS-NOTIF-1 creates an eligibility_changed notification
```

**Risk**: Medium. Requires cron infrastructure decision. GitHub Actions scheduled workflow recommended for MVP.

---

## Phase 6 ATP Summary

| Ticket | Risk | Automation Readiness | Story Points |
|--------|------|---------------------|--------------|
| DTS-NOTIF-1 | Low | ✅ Can be unit-testable | 5 SP |
| DTS-NOTIF-2 | Medium | ⚠️ Depends on sync detection logic | 3 SP |
| DTS-NOTIF-3 | Low | ✅ Straightforward CRUD | 3 SP |
| DTS-OVERRIDE-1 | Medium | ⚠️ Need cron decision (GitHub Actions recommended) | 3 SP |

> Generated by /shift-left-testing. To apply refinements: update spec.md + edge-cases.md with ATP scenarios above.
