# Production Deployment — Pre-Deploy, Deploy & Rollback

> Reference doc for safe production deployment with monitoring and rollback.
> Source: `.books/fase-13-production-deployment/` + `.prompts/fase-13-production-deployment/`

---

## 1. Deployment Flow

```
develop (staging) → main (production)
        │                  │
        │                  ▼
        │          Vercel auto-deploy
        │                  │
        ▼                  ▼
   Staging OK?  →  Production Live
        │                  │
        └── Smoke Tests ───┘
```

## 2. Pre-Deploy Checklist (15-20 min)

### Tests
- [ ] Unit tests passing (`bun run test:unit`)
- [ ] Integration tests passing (`bun run test:integration`)
- [ ] E2E tests passing on staging (`bun run test:e2e`)
- [ ] Manual smoke tests OK
- [ ] Performance tests OK (if applicable)

### Code Quality
- [ ] Code review approved (PR approved in GitHub)
- [ ] No critical TODOs (`grep -r "TODO:" src/`)
- [ ] Linting passing (`bun run lint`)
- [ ] TypeScript no errors (`bun run type-check`)
- [ ] Security scan OK (`bun audit`)

### Infrastructure
| Check | Where |
|-------|-------|
| Environment variables configured | Vercel Dashboard → Settings → Env |
| Secrets configured | Vercel Dashboard → Settings → Env |
| Database migrations ready | Supabase (if applicable) |
| Recent backup exists | Supabase → Backups |

Required production env vars:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### Monitoring
- [ ] Sentry/DataDog configured
- [ ] Alerts configured
- [ ] Dashboards ready

### Stakeholder Approval
- [ ] PM approved deployment
- [ ] QA approved testing
- [ ] DevOps ready to monitor

## 3. Deploy to Production (10-15 min)

### Merge Process
```bash
git checkout develop && git pull origin develop
git log main..develop --oneline           # Review changes
git diff main develop --stat              # Review file changes
git checkout main && git pull origin main
git merge develop
git push origin main                      # Triggers auto-deploy
```

### Monitor Deploy
- Vercel Dashboard → Deployments tab
- Typical deploy time: 2-5 minutes
- Verify status is "Ready"

### Post-Deploy Validation
```bash
curl -I https://tu-dominio.com
curl https://tu-dominio.com/api/health
```

## 4. Post-Deploy Validation (15-20 min)

### Smoke Test (Manual, 2-3 min)
| Check | URL | Expected |
|-------|-----|----------|
| Homepage loads | `https://tu-dominio.com` | 200 OK, content visible |
| Login works | `/login` | Form visible |
| Auth flow | Login with test user | Redirect to dashboard |
| API responds | `/api/health` | 200 OK |

### Active Monitoring (First 2-4 hours)
| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| Errors | Sentry | > 10/min |
| Response time | Vercel Analytics | > 5 seconds |
| API error rate | Logs | > 5% |
| CPU/Memory | Vercel | Abnormal |

### Business Metrics Validation
- Users can register
- Users can make purchases
- Data saves correctly
- Emails are sent

## 5. Rollback Plan

### When to Rollback
| Symptom | Severity | Action |
|---------|----------|--------|
| Service completely down | Critical | Immediate rollback |
| Main feature broken | High | Rollback within 15 min |
| Errors > 10% of requests | High | Rollback within 15 min |
| Important bug with workaround | Medium | Evaluate hotfix |
| Minor cosmetic bug | Low | Fix in next deploy |

### Rollback Methods

**Option A: Vercel Dashboard (Recommended)**
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find last working deployment
4. Click "..." → "Promote to Production"

**Option B: CLI**
```bash
vercel ls
vercel rollback [deployment-url]
```

### Post-Rollback
1. Verify production works
2. Notify the team
3. Investigate root cause
4. Fix in develop
5. Re-test on staging
6. Re-deploy when ready

### Incident Documentation Template
```markdown
# Incident: [Date] [Time]

## Summary
[What happened]

## Timeline
- HH:MM - Deploy to production
- HH:MM - Problem detected
- HH:MM - Rollback executed
- HH:MM - Production stable

## Root Cause
[Why it happened]

## Fix
[What was done to fix it]

## Lessons Learned
[What we learned]
```

## 6. Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Build fails | Compilation error | Review Vercel logs |
| 500 errors | Environment variables | Verify in Vercel settings |
| API not responding | Database connection | Verify Supabase |
| Auth not working | Incorrect keys | Verify SUPABASE_* vars |
| Deploy slow | Large assets | Optimize images/bundle |

## 7. Useful Commands

```bash
# View recent deployments
vercel ls

# View production logs
vercel logs [deployment-url]

# Quick rollback
vercel rollback

# View environment variables
vercel env ls production

# Run smoke tests against production
PRODUCTION_URL=https://tu-dominio.com bun run test:smoke
```
