# DTS-SYNC-3 — Implementation Plan

**Status**: Done
**Date**: 28/5/2026

## Scope
Extend existing `GET /api/v1/integrations/logs` endpoint with `date_from` and `date_to` query parameters for date-range filtering.

## Prerequisites
- `DTS-INT-3` (Integration logs table + logging middleware) — DONE
- Existing `GET /integrations/logs` route — DONE

## Implementation

### 1. Add Date Filter Query Params
- File: `server/src/routes/integrations.ts`
- In existing `GET /integrations/logs` handler, parse optional `date_from` and `date_to` query params
- Validate: ISO 8601 date strings (YYYY-MM-DD)
- Invalid date format → 400 Bad Request

### 2. Supabase Query Modifications
```
let query = supabaseAdmin.from('integration_logs').select('*', { count: 'exact' })

if (date_from) query = query.gte('created_at', date_from + 'T00:00:00Z')
if (date_to)   query = query.lte('created_at', date_to   + 'T23:59:59Z')
```

### 3. Combine with Existing Filters
- `date_from`/`date_to` compose with existing `provider` and `status` filters
- All filters are AND-combined

## Files
- `routes/integrations.ts` — modify existing GET /logs handler

## Review Workload Forecast
Estimated: ~15 additions to existing file
400-line budget risk: Low
