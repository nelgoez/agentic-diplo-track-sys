---
topic_key: session/testability-guide/project/plan
skill: testability-guide
scope: project
status: approved
capture_prompt: true
---

## Goal

Regenerate the `/qa` page in the DTS app (nelgoez/diploma-tracking-sys) with the full Bunkai-style golden file — sticky TOC, domain-colored accent cards, architecture diagram, agent tabs (Claude/OpenCode), two-way tabs (DBHub/URI, OpenAPI/Postman), real auth flow with curl snippets, Playwright fixture, env-var activation, troubleshooting, and reference section. Publish credentials artifact to Jira Epic.

## Inputs

**Host stack (Phase 1 discovery):**

- Frontend: React 18 + Vite 6 + MUI v7 + Emotion + react-router-dom v7 + i18next (default: es)
- Backend: Bun + Hono + jose (JWT HS256) + Supabase + Zod + pino + Scalar
- DB: PostgreSQL (Supabase), project ref `vbjhxlezqhkmhpuypkvf`
- Auth: Token-returning `POST /auth/login` → `{ access_token, refresh_token, user }`
- Login data-testids: `email-input`, `password-input`, `login-btn`
- API docs: Scalar at `/api/v1/docs`, spec at `/api/v1/api-spec`
- DBHub MCP: configured as `sql` in `.mcp.json` + `dbhub.toml`
- OpenAPI MCP: configured in `.mcp.json`
- Playwright MCP: configured in `.mcp.json`
- Repos shape: monorepo (nelgoez/diploma-tracking-sys)
- Existing /qa: 546-line MUI Accordion list, no snapshot comment → fresh scaffold
- ⚠️ `dbhub.toml` has hardcoded password — fix to `${VAR}` expansion

**Snapshot diff (Phase 2):** No snapshot comment → fresh scaffold

**Decisions (Phase 3):**

- Q1: Jira Epic (with Atlassian API fallback)
- Q2: Create `qa_inspector_ro` role (BYPASSRLS, SELECT-only)
- Q3: `/qa` (keep existing)
- Q4: Skip (no overlapping route)
- Q5: Spanish

**Testability assessment:**

- UI: ✅ (data-testids on login, Playwright configured)
- API: ✅ (token-returning login, OpenAPI MCP configured)
- DB: ✅ after qa_inspector_ro creation

## Approach

1. Create `qa_inspector_ro` role in Supabase (inline SQL)
2. Fix `dbhub.toml` to use `${VAR}` expansion (surgical edit)
3. Generate new `QAPage.tsx` + components in `client/src/pages/qa/` using MUI primitives
4. Build credentials artifact markdown
5. Publish to Jira Epic via `/acli` (with Atlassian API fallback)
6. Security audit
7. Verification (typecheck, build, dev server smoke)
8. Commit via `/git-flow-master`

## Phase breakdown

| Phase | Task                      | Dispatch         | Status                   |
| ----- | ------------------------- | ---------------- | ------------------------ |
| 1     | Pre-flight discovery      | Inline           | ✅ Done                  |
| 2     | Idempotency check         | Inline           | ✅ Skipped (no snapshot) |
| 3     | Batched decisions         | Inline           | ✅ Done                  |
| 4     | Page codegen              | Sub-agent A      | Pending                  |
| 5     | Credentials content build | Sub-agent B      | Pending                  |
| 6     | Publish to Jira Epic      | Sub-agent B      | Pending                  |
| 7     | Security audit            | Inline           | Pending                  |
| 8     | Verification              | Inline           | Pending                  |
| 9     | Commit + PR               | /git-flow-master | Pending                  |

## Risks & open questions

- `dbhub.toml` has hardcoded password — must fix to `${VAR}` before generating page (page references canonical form)
- MUI v7 has no built-in Tabs/TabPanel like shadcn — will use MUI Tabs component
- No PAT/hybrid token endpoint in DTS (Phase 5 future) — flag as gap in page §5
- acli may not be authenticated — fallback to Atlassian API or manual paste for Q1

## Verification checklist

- [ ] Client typecheck: `tsc --noEmit` in client/
- [ ] Client build: `vite build` succeeds
- [ ] Lint: clean or pre-existing warnings only
- [ ] Dev server smoke: /qa loads, sections render, tabs work
- [ ] Published artifact renders code blocks correctly in Jira
- [ ] git diff free of passwords/tokens/private hostnames

## Cross-references

- Target /qa page: `client/src/pages/qa/QAPage.tsx`
- Credentials destination: Jira Epic (TBD — will create or reuse)
- Branch name: `feature/testability-guide`
- App repo: `D:/Nahuel/Proyectos/UPEX/diploma-tracking-sys`
