# DTS-RULE-3 — Compliance Matrix

| AC Scenario | Evidence | Status |
|-------------|----------|-------|
| Coordinator creates override with reason | `overrides.ts:61-86` | PASS |
| Reason must be ≥10 characters | `overrides.ts:18` (Zod) | PASS |
| Optional expires_at field | `overrides.ts:19` | PASS |
| Unique active override per (student, rule) | Migration: partial unique index | PASS |
| Duplicate active override → 409 | `overrides.ts:67-72` | PASS |
| Revoke sets status=revoked + revoked_at | `overrides.ts:88-112` | PASS |
| Cannot revoke non-active override | `overrides.ts:103-105` | PASS |
| Override reflected in rule evaluation | `rule-engine.ts:94-107` (evaluateNode override check) | PASS |
| Override disappears when revoked/expired | Only `status='active'` applied | PASS |
