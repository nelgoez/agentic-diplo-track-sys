# IQL Step 11 — Production Deployment & Smoke Tests

> **Phase**: Late-Game Testing (Observación)
> **Status**: Implemented

## Purpose

Validate the production deployment immediately after release. Catch regressions that slipped through earlier stages before users are affected.

## Implementation

### Health Endpoint

Every DTS server exposes `GET /health` returning:

```json
{ "status": "ok", "timestamp": "2026-07-07T18:00:00.000Z" }
```

Location: `server/src/index.ts:46`

### Smoke Test Suite

File: `server/__tests__/smoke.test.ts` — runs against `localhost:3000`

Covers:
| Area | What it checks |
|---|---|
| Health | `/health` returns 200 + `status: ok` |
| API availability | Unauthenticated requests return 401 (not 500) |
| Auth flow | Login → tokens → `/auth/me` → refresh |
| RBAC | `estudiante` blocked from admin/integration endpoints |
| DB connectivity | Tracks list returns paginated data |
| DB connectivity | Courses list returns 200 |

### CI Pipeline

| Workflow | Trigger | What it runs |
|---|---|---|
| `smoke.yml` | Daily (weekdays) + manual | Server smoke + client build smoke |
| `prod-validate.yml` | Push to `main` + manual | Playwright E2E against production URL |

### Production Validation

`prod-validate.yml` runs Playwright tests tagged `@prod` against the live Vercel deployment at `https://nelgoez-diploma-tracking-sys.vercel.app`. Tests cover:
- Login with admin + student credentials
- Dashboard rendering
- Core API responses

## Verification

```bash
# Health check
curl https://nelgoez-diploma-tracking-sys.vercel.app/health

# Run smoke tests locally
cd server && MOCK_MODE=true bun test __tests__/smoke.test.ts
```

## Related

- IQL Methodology: `upexgalaxy.com/metodologia`
- Production smoke tests (hub): `tests/e2e/production-smoke.test.ts`
