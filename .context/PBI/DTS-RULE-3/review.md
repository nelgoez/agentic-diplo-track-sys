# DTS-RULE-3 — Review

**Status**: Pass

| Criterion | Verdict |
|-----------|---------|
| Override links to rule_id | PASS |
| Reason validation (≥10 chars) | PASS |
| Optional expiry (expires_at) | PASS |
| Unique active per (student, rule) | PASS (partial index) |
| Revoke sets status + revoked_at | PASS |
| Guard: cannot revoke non-active | PASS |
| Guard: cannot create duplicate active | PASS |

No issues.
