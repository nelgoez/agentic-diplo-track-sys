# Diploma Tracking System — QA Testing Credentials (DB / API / UI)

> Audience: Manual QA + AI-driven testers (Claude Code, OpenCode) exercising this app at the DB, API, and UI layers.
> Companion page (in-app): https://diplomatrackingsystem.qzz.io/qa

## Architecture summary

Diploma Tracking System is a React + Vite + MUI client + Bun + Hono API + PostgreSQL (Supabase) database. Monorepo: https://github.com/nelgoez/diploma-tracking-sys. Tenant isolation is enforced via JWT RBAC (estudiante/coordinador/admin/sysadmin); the DB role below is read-only with BYPASSRLS.

## Environments

| Env        | Web URL                                                                    | API URL                                                     | OpenAPI spec     | Docs UI (Scalar) |
| ---------- | -------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------- | ---------------- |
| Local      | http://localhost:5173                                                      | http://localhost:3000/api/v1                                | /api/v1/api-spec | /api/v1/docs     |
| Staging    | https://nelgoez-diploma-tracking-sys-git-main-nelgoezs-projects.vercel.app | https://server-git-main-nelgoezs-projects.vercel.app/api/v1 | /api/v1/api-spec | /api/v1/docs     |
| Production | https://diplomatrackingsystem.qzz.io                                       | https://server-git-main-nelgoezs-projects.vercel.app/api/v1 | /api/v1/api-spec | /api/v1/docs     |

## Environment variables (set in `.env`, then activate)

Slots to fill (names only — values go in your local `.env`, never committed):
`DBHUB_TYPE`, `DBHUB_HOST`, `DBHUB_PORT`, `DBHUB_DATABASE`, `DBHUB_USER`, `DBHUB_PASSWORD`, `API_BASE_URL`, `OPENAPI_SPEC_PATH`, `API_BEARER_TOKEN`, `POSTMAN_API_KEY`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_URL`.

Activate before launching the agent: `bun run claude` / `bun run opencode` (cross-platform) or `direnv` + `.envrc` (Mac/Linux). If a var doesn't load, the MCP returns 401/403 — fix `.env` and restart the agent.

## Database access (read-only QA role) — TWO ways

QA role: `qa_inspector_ro` — BYPASSRLS, SELECT-only on public.\*. Password column `users.password_hash` is revoked at column level.

### Way 1 — DBHub MCP (`dbhub.toml`, committed; `${VAR}` from `.env`)

Type:

```
postgres
```

Host:

```
db.vbjhxlezqhkmhpuypkvf.supabase.co
```

Port:

```
5432
```

Database:

```
postgres
```

User:

```
qa_inspector_ro
```

Password:

```
<see secrets store>
```

> DBHub footgun: a missing `${VAR}` substitutes literally → cryptic auth failure. Verify: `env | grep DBHUB`.
> Session Pooler port 5432 (not 6543 — no prepared statements on transaction pooler).

### Way 2 — Connection URI (VSCode / Cursor SQL extension)

```
postgresql://qa_inspector_ro:<see secrets store>@db.vbjhxlezqhkmhpuypkvf.supabase.co:5432/postgres?sslmode=require
```

## API access — auth + TWO ways

Auth method: Bearer JWT (jose/HS256). Custom JWT issued by Supabase Auth credentials.

Login endpoint:

```
POST /api/v1/auth/login
```

Token response shape:

```
{ access_token, refresh_token, user: { id, email, role } }
```

Login body (demo user):

```json
{ "email": "<see secrets store>", "password": "<see secrets store>" }
```

Token refresh endpoint:

```
POST /api/v1/auth/refresh
Body: { "refresh_token": "<token>" }
```

Token expires: access_token = 24h (configurable via `JWT_EXPIRES_IN`), refresh_token = 7d.

### Way 1 — OpenAPI MCP

Spec URL:

```
/api/v1/api-spec
```

(Configure `@ivotoby/openapi-mcp-server --tools dynamic` with `API_BASE_URL`, `OPENAPI_SPEC_PATH`, `API_BEARER_TOKEN` — see the in-app /qa page for per-agent blocks.)

### Way 2 — Postman MCP

```
https://mcp.postman.com/mcp  (Authorization: Bearer ${POSTMAN_API_KEY})
```

## UI access — demo users

| Email                      | Password            | Role        | Notes                                    |
| -------------------------- | ------------------- | ----------- | ---------------------------------------- |
| admin@dts.unc.edu.ar       | <see secrets store> | admin       | Full CRUD, user management, sync control |
| nahuelgomez.cti@gmail.com  | <see secrets store> | estudiante  | View progress, certificates, eligibility |
| coordinador@dts.unc.edu.ar | <see secrets store> | coordinador | Enroll students, overrides, grading      |

Login URL (staging): https://nelgoez-diploma-tracking-sys-git-main-nelgoezs-projects.vercel.app/login
Login URL (production): https://diplomatrackingsystem.qzz.io/login

## Footer

Operational docs (architecture, MCP setup, env activation, Playwright snippets) live at the in-app page:

```
https://diplomatrackingsystem.qzz.io/qa
```

If anything here is out of date, re-run `/testability-guide` against the project repo.
