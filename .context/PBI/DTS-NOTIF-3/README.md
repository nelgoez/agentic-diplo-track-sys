# DTS-NOTIF-3 — Notification table + API

**Phase**: 6 — Notifications & Polish (Should Have)
**Effort**: 3 SP
**Dependencies**: DTS-NOTIF-1

**Acceptance Criteria:**
- `notifications` table (id, userId, type, title, body, read, createdAt).
- GET /notifications (paginated, unread first).
- PUT /notifications/:id/read.
- Unread count badge endpoint.
