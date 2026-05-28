# DTS-RULE-1 — Compliance Matrix

| AC Scenario | Evidence | Status |
|-------------|----------|-------|
| Coordinator can create ALL/ANY rules | `rules.ts:27-66` | PASS |
| Rules reference courses via prerequisite_sources | `rules.ts:48-63` | PASS |
| Tree structure via parent_rule_id | Migration + `rules.ts:37` | PASS |
| Update replaces rule fields | `rules.ts:68-103` | PASS |
| Delete removes rule + sources | `rules.ts:105-122` | PASS |
| Delete requires admin role | `rules.ts:105` | PASS |
| Rules ordered by order_index | `rules.ts:18, 37` | PASS |
