# DTS-RULE-4: Edge Cases

## Boundary Conditions
- Course with zero prerequisite rules: GET returns empty tree; course is "no prerequisites required"
- Single-level rule tree (no nesting): returned as flat array; `parent_rule_id: null` for all
- Rule with ALL type + 10+ source courses: full tree returned; no pagination on tree view (expected <100 nodes)
- Inactive rules: included in tree view by default; filterable via `?active=true` query param
- Track with many courses, each with rules: response payload may be large; consider `?compact=true` for summary-only

## Error Paths
- Non-existent course: GET /courses/:id/prerequisites returns 404
- Non-existent track: GET /rules?trackId=:id returns 404
- Rule tree with broken reference (source course deleted): node shows `course: null` or "deleted course"; tree still rendered; warning in response metadata
- Orphaned rule (rule points to parent_rule_id that doesn't exist): tree walker skips broken branch; warning logged

## Concurrency
- Rule tree read while rule is created/deleted: reader sees snapshot; no partial tree (transactional read if using single query)
- Two admins viewing same rule tree: independent reads; no locking
