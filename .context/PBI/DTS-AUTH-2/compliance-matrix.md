# DTS-AUTH-2 — Compliance Matrix

| AC Scenario (Gherkin) | Covered By | Evidence | Status |
|-----------------------|------------|----------|--------|
| POST /auth/login returns access+refresh tokens | manual | `routes/auth.ts:57-84` | PASS |
| POST /auth/login rejects invalid credentials (401) | manual | `routes/auth.ts:63-65` | PASS |
| POST /auth/refresh returns new token pair | manual | `routes/auth.ts:86-106` | PASS |
| POST /auth/refresh rejects non-refresh tokens (401) | manual | `routes/auth.ts:96-98` | PASS |
| POST /auth/logout returns success | manual | `routes/auth.ts:108-122` | PASS |
| GET /auth/me returns user profile from token | manual | `routes/auth.ts:124-138` | PASS |
| authenticate middleware rejects missing header (401) | manual | `middleware/auth.ts:21-23` | PASS |
| authenticate middleware rejects invalid JWT (401) | manual | `middleware/auth.ts:40-42` | PASS |
| authenticate middleware injects userId+email+role | manual | `middleware/auth.ts:34-38` | PASS |
| requireRole gates by role (403 for insufficient) | manual | `middleware/auth.ts:54-56` | PASS |
| Login returns user name from students table | manual | `routes/auth.ts:68-74` | PASS |
| Refresh token rotation (old refresh invalidated) | manual | `routes/auth.ts:99-102` — new pair issued | PASS |
| **Known gap**: Rate limiting (5 attempts/15min) | exempt | Deferred — Phase 5 | UNCOVERED |
| **Known gap**: Token blacklist on logout | exempt | Stateless JWT — client-side discard only | UNCOVERED |
