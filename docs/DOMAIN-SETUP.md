# DTS Environments

> **Production**: `https://diplomatrackingsystem.qzz.io`  
> **Staging**: Vercel Preview Deployments (push to `staging` branch)  
> **API**: `https://server-git-main-nelgoezs-projects.vercel.app/api/v1`  
> **CI/CD Pipeline**: `.context/reports/CI-CD-PIPELINE.md`
> **Last updated**: 2026-06-05

## Environments

| Environment    | Web URL                                | API URL                        | DB                              |
| -------------- | -------------------------------------- | ------------------------------ | ------------------------------- |
| **Production** | `https://diplomatrackingsystem.qzz.io` | Latest server prod deploy      | Supabase `vbjhxlezqhkmhpuypkvf` |
| **Staging**    | Vercel Preview URL (per push)          | Vercel Preview URL (per push)  | Same Supabase                   |
| **Local**      | `http://localhost:5173`                | `http://localhost:3000/api/v1` | Same Supabase                   |

## Branch Strategy

```
feature/DTS-XX → staging (PR) → Preview Deploy → QA
staging → main (PR) → Production Deploy
```

- **`main`**: Production. Vercel deploys on push. Production env vars.
- **`staging`**: Preview. Vercel deploys on push. Preview env vars.
- **`feature/*`**: No deploy. CI runs on PR only.

## Key Config

- **Domain**: DigitalPlat FreeDomain + Cloudflare DNS → Vercel edge
- **SSL**: Vercel auto-provisioned
- **CORS**: Comma-separated origins via `CORS_ORIGIN` env var
- **Cron**: Daily override expiry at `GET /api/v1/cron/expire-overrides`
- **Jira**: DTS-32, DTS-33 (domain setup + CORS bug)
- **Full config**: `.agents/project.yaml` §environments
