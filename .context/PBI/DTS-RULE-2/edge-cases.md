# DTS-RULE-2: Edge Cases

## Boundary Conditions
- Empty rule tree (track has no prerequisites): all courses eligible; returns `eligible: true` for any course in track
- ALL rule with one child: equivalent to that child's evaluation; no flattening needed
- Deeply nested tree (depth > 50): evaluated in <500ms still; stack recursion depth may need iteration for extreme cases
- Student with no certificates: all leaf rules evaluate as `not_met`; tree propagates upward
- Course mapped to multiple rules (shared prerequisite): certificate counted once per rule evaluation; no double-count issue
- Student not enrolled in track: evaluation still possible; returns eligibility for any track requested (used for pre-check)

## Error Paths
- Non-existent student UUID: 404 `student_not_found`
- Non-existent track UUID: 404 `track_not_found`
- Rule tree with cycle (data integrity issue): evaluation hangs or stack overflow; cycle detection validation at rule creation prevents; if cycle exists in DB, evaluation times out at 500ms circuit breaker
- Database unreachable during evaluation: 503 `service_unavailable`; partial result not returned
- Rule tree partially loaded (DB timeout): retry once; if still fails, return 503

## Concurrency
- Evaluation while sync adds certificates: evaluation uses snapshot of certificates at query time; new certificates not visible until next evaluation
- Evaluation while override is created/revoked: override query runs after certificate query; sees latest state; may cause temporary inconsistency if override added between queries
- Two evaluations for same student simultaneously: independent reads; no shared cache; both return correct (same) result
