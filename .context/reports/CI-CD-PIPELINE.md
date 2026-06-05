# CI/CD Pipeline — Diploma Tracking System

> **Branch**: `staging` for preview, `main` for production  
> **Deploy**: Vercel Preview Deployments (auto on push)  
> **Last updated**: 2026-06-05

---

## Branch Strategy

```
feature/DTS-XX → staging (PR + merge) → Vercel Preview Deploy → QA/test
staging → main (PR + merge) → Vercel Production Deploy
```

| Branch | Environment | Trigger | Vercel Env Scope |
|--------|-------------|---------|-----------------|
| `main` | **Production** | Push | Production env vars |
| `staging` | **Preview** | Push | Preview env vars |
| `feature/*` | PR only | CI runs, no deploy | — |

---

## Vercel Projects

Two Vercel projects from `nelgoez/diploma-tracking-sys`:

| Project | Root Dir | Framework | Production URL | Preview URL pattern |
|---------|----------|-----------|----------------|-------------------|
| Client | `/` | Vite (SPA) | `diplomatrackingsystem.qzz.io` | `*-git-staging-*.vercel.app` |
| Server | `/server` | Bun (Hono) | `server-git-main-*.vercel.app` | `server-git-staging-*.vercel.app` |

---

## GitHub Actions Workflows

All triggered on push to `main` or `staging`:

| Workflow | Purpose | Runs |
|----------|---------|------|
| `ci.yml` | Client build + Server typecheck + API tests | Lint, `tsc`, `bun test`, `vite build` |
| `ux-guard.yml` | E2E smoke tests (10 tests) | Playwright: routing, auth, roles, integrations, student |
| `prod-validate.yml` | Post-deploy @prod smoke (7 tests) | Playwright @prod tagged tests against live URL |

### Pipeline Order

```
Push to main/staging
  └─► ci.yml (Build & Test) ────────────┐
  └─► ux-guard.yml (E2E Smoke) ─────────┤ parallel
  └─► prod-validate.yml (Post-Deploy) ──┘
```

---

## Sprint Development → Pipeline Mapping

Per `/sprint-development` skill:

| Stage | Action | Pipeline |
|-------|--------|----------|
| Stage 2 | Implementation + verify | Local: `bun lint`, `bun run build`, unit tests |
| Stage 3 | PR open → `staging` | CI runs on PR (ci.yml) |
| Stage 3 | Merge PR → `staging` | Vercel Preview Deploy fires. UX Guard runs. |
| Stage 4 | Smoke test staging | Manual: verify preview URL. `prod-validate.yml` not used (that's prod-only). |
| Stage 5 | PR open → `main` | CI runs on PR (ci.yml) |
| Stage 5 | Merge PR → `main` | Vercel Production Deploy fires. All 3 workflows run. |

---

## Env Vars

| Scope | Example keys | Managed |
|-------|-------------|---------|
| **Production** | `CORS_ORIGIN`, `SUPABASE_URL`, `JWT_SECRET` | Vercel Dashboard > Production |
| **Preview** | Same keys, staging values | Vercel Dashboard > Preview |
| **Local** | Same keys, localhost values | `.env` (gitignored) |

Sync pattern: `vercel env pull .env.local --environment=preview`

---

## Current URLs

| Environment | Client | API |
|-------------|--------|-----|
| Production | `https://diplomatrackingsystem.qzz.io` | `https://server-git-main-*.vercel.app/api/v1` |
| Preview (staging) | `https://*-git-staging-*.vercel.app` | `https://server-git-staging-*.vercel.app/api/v1` |
| Local | `http://localhost:5173` | `http://localhost:3000/api/v1` |

---

## Anti-Patterns

- ❌ Push directly to `main` — always go through `staging` first
- ❌ Skip PR review — Stage 3 is mandatory
- ❌ Deploy without all 3 workflows green
- ❌ Mix production and preview env vars
- ✅ Feature branch → PR → `staging` → verify → PR → `main`
