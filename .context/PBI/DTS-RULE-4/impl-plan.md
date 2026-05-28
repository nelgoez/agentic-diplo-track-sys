# DTS-RULE-4 — Implementation Plan

**Status**: Complete
**Date**: 27/5/2026

## Scope
Hierarchical display of prerequisite rule trees via API endpoints.

## Implementation

### GET /courses/:id/prerequisites
Updated to build recursive tree instead of flat list:
1. Fetch all rules for target course
2. `buildRuleTree(rules, null)` — groups rules by `parent_rule_id`
3. Returns tree structure with nested `children` arrays

### GET /rules (by track_id)
Returns rules ordered by `order_index`, includes `parent_rule_id` for client-side tree assembly.

## Files
- `routes/courses.ts` — modified
- `routes/rules.ts` — already returns ordered rules

## Verification
- [x] TypeScript typecheck passes
- [ ] Manual: GET /courses/:id/prerequisites with nested rules
