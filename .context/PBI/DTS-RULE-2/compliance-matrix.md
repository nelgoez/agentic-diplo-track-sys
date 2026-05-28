# DTS-RULE-2 — Compliance Matrix

| AC Scenario | Test | Status |
|-------------|------|--------|
| No rules → eligible (empty array) | `no rules → eligible` | PASS |
| ALL rule, all sources passed → eligible | `ALL rule — all sources passed → eligible` | PASS |
| ALL rule, one source missing → not eligible | `ALL rule — one source missing → not eligible` | PASS |
| ANY rule, at least one passed → eligible | `ANY rule — at least one passed → eligible` | PASS |
| ANY rule, none passed → not eligible | `ANY rule — none passed → not eligible` | PASS |
| Active override → eligible regardless | `active override → eligible regardless of sources` | PASS |
| Multiple root rules, all pass → eligible | `multiple root rules — all pass → eligible` | PASS |
| Multiple root rules, one fails → not eligible | `multiple root rules — one fails → not eligible` | PASS |
| Nested: root ALL → child ALL → all pass | `nested: root ALL → child ALL → all pass → eligible` | PASS |
| Nested: root ALL → child ALL → child fails | `nested: root ALL → child ALL → child fails → not eligible` | PASS |
| Nested: root ANY → mixed children → one passes | `nested: root ANY → children ALL + ANY, one child passes → eligible` | PASS |
| Override on nested child propagates up | `override on nested child → parent becomes eligible` | PASS |
| Revoked override does not apply | `revoked override does not apply` | PASS |
| Expired override does not apply | `expired override does not apply` | PASS |
| ALL with no sources/children (vacuous) | `ALL rule with no sources, no children → eligible` | PASS |
| ANY with no sources/children | `ANY rule with no sources, no children → not eligible` | PASS |
| Missing prerequisites deduplicated | `missing prerequisites deduplicates` | PASS |
| ALL with sources AND children | `ALL rule with sources AND children — all must pass` | PASS |
| Child passes, parent source fails | `ALL rule — child passes but source fails → not eligible` | PASS |
| 3-level deep nesting | `deep nesting: 3 levels, all pass → eligible` | PASS |
| Override + valid certs on different rules | `eligible with override on one rule, valid certs on another` | PASS |
| EvaluatedAt timestamp | `evaluatedAt is set to current ISO timestamp` | PASS |
| Missing prerequisites from nested rules | `missing prerequisites includes nested course IDs` | PASS |
