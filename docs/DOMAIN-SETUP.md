# DTS Environments

> **Production**: `https://diplomatrackingsystem.qzz.io`  
> **Staging**: Vercel auto-deploy per push  
> **API**: `https://server-on8biu92m-nelgoezs-projects.vercel.app/api/v1`  
> **Last updated**: 2026-06-04

## Environments

| Environment    | Web URL                                | API URL                        | DB                              |
| -------------- | -------------------------------------- | ------------------------------ | ------------------------------- |
| **Production** | `https://diplomatrackingsystem.qzz.io` | Latest server prod deploy      | Supabase `vbjhxlezqhkmhpuypkvf` |
| **Staging**    | Latest Vercel preview deploy per push  | Auto-linked                    | Same Supabase                   |
| **Local**      | `http://localhost:5173`                | `http://localhost:3000/api/v1` | Same Supabase                   |

## Key Config

- **Domain**: DigitalPlat FreeDomain + Cloudflare DNS → Vercel edge
- **SSL**: Vercel auto-provisioned
- **CORS**: Comma-separated origins via `CORS_ORIGIN` env var
- **Cron**: Daily override expiry at `GET /api/v1/cron/expire-overrides`
- **Jira**: DTS-32, DTS-33 (domain setup + CORS bug)
- **Full config**: `.agents/project.yaml` §environments
