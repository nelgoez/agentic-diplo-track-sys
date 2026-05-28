# DTS-RULE-1 — Implementation Plan

**Status**: Complete
**Date**: 27/5/2026

## Scope
Prerequisite rules CRUD supporting recursive tree structure via `parent_rule_id`.

## Pre-fix State
Rules CRUD existed but flat — no `parent_rule_id`, no `order_index` in schema. `condition` field existed for ALL/ANY.

## Implementation

### Schema Migration
- ADD `parent_rule_id UUID REFERENCES prerequisite_rules(id) ON DELETE SET NULL`
- ADD `order_index INTEGER NOT NULL DEFAULT 0`
- Index on `parent_rule_id`

### Routes Updated
- `GET /rules?track_id=` — returns all rules ordered by `order_index`
- `POST /rules` — accepts `parent_rule_id`, `order_index`, `source_course_ids[]`
- `PUT /rules/:id` — supports updating `parent_rule_id`, `order_index`, `condition`, `is_active`
- `DELETE /rules/:id` — cascading delete of sources

### DB Type Update
`supabase.ts` `Database` interface updated with new columns.

## Verification
- [x] Migration applied to Supabase
- [x] TypeScript typecheck passes
- [ ] Manual: create nested rules, verify tree structure in DB
