# DTS-RULE-3: Edge Cases

## Boundary Conditions
- Reason exactly 10 characters: accepted (minimum met)
- Expiry date in the past: rejected at creation; 400 `expiry_in_past`
- Override with no expiry (permanent): expires_at NULL; never auto-expires; active until revoked
- Override applied to already-eligible student: still created; no-op for eligibility; audit trail preserved
- Multiple overrides for same student, different rules: allowed; each evaluated independently
- Override for rule that is part of nested tree: affects only that node; parent rule re-evaluates with overridden result

## Error Paths
- Create override for non-existent student: 404 `student_not_found`
- Create override for non-existent rule: 404 `rule_not_found`
- Duplicate active override (same student, same rule): 409 `override_already_active`; must revoke existing first
- Reason < 10 characters: 400 `reason_too_short` (minimum 10 chars)
- Coordinator not assigned to student's track: 403; coordinator must manage track containing the rule's target course
- Revoke already-revoked override: 409 `override_already_revoked`; idempotent reject
- Revoke expired override: allowed; status changes to `revoked`; re-evaluates eligibility

## Concurrency
- Create override + revoke same override: whichever commits first determines outcome; second fails with appropriate 409
- Override created while eligibility being evaluated: evaluation may see stale state; next evaluation reflects override
- Expiry cron + manual revoke race: cron updates status to expired; manual revoke finds non-active override → 409
