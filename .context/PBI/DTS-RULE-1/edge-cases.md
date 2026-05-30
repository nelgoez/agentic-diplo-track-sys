# DTS-RULE-1: Edge Cases

## Boundary Conditions
- ALL rule with zero children: evaluates as `true` (vacuously true); no prerequisite for course
- ANY rule with zero children: evaluates as `false`; at least one source needed
- Maximum nested depth: no hard limit in schema; circular references prevented by `parent_rule_id` tree constraint (no cycles)
- Rule referencing itself as source: rejected; validation checks ancestor chain for current rule ID
- Course deleted that is referenced by a rule: `prerequisite_sources` row remains; evaluation treats missing course as not completed; warning logged
- Rule deactivated while students depend on it: evaluation skips inactive rules; treated as if rule doesn't exist; may change eligibility

## Error Paths
- Create rule for non-existent target course: 404 `course_not_found`
- Create rule with source course from different track: 400 `cross_track_rule`; source courses must belong to same track as target
- Update rule that doesn't exist: 404
- Delete rule with active overrides: rule deleted; overrides become orphaned (rule_id FK set to NULL or cascade); admin warned
- Non-admin deleting rule: 403; rule deletion restricted to admin role
- Duplicate source in same rule: rejected at insert; unique constraint on `(rule_id, source_course_id)`

## Concurrency
- Two coordinators creating rules for same target course: both succeed if unique `(target_course_id, order_index)`; collision only on duplicate sources
- Rule update + eligibility evaluation concurrent: evaluation uses old rule state until update commits; no dirty reads
