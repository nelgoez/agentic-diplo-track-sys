---
name: shift-right-testing
description: 'Production observability and incident response: Sentry/DataDog monitoring, automated post-deploy smoke tests, alert configuration, and incident response playbook (P1-P4). Triggers on: `shift-right testing`, `production monitoring`, `Sentry setup`, `incident response`, `smoke tests post-deploy`, `post-deploy validation`, `observability`, `production alerts`. Do NOT use for: pre-deploy checklist (use `/project-bootstrap/references/production-deployment.md`), test automation (use `/kata-architecture`), shift-left planning (use `/sprint-development`).'
license: MIT
compatibility: [claude-code, opencode]
phase: operations
---

# Shift-Right Testing — Production Observability & Incident Response

`shift-right-testing` implements production monitoring, automated smoke tests post-deploy, and incident response procedures. It complements shift-left testing (prevention) with production observability (detection + response).

Source content migrated from:
- `.books/fase-14-shift-right-testing/shift-right-testing.MANUAL.md`
- `.prompts/fase-14-shift-right-testing/` (monitoring-setup.md, smoke-tests.md, incident-response.md)

---

## Dependencies

Requires `agentic-dev-core`. Runs AFTER production deployment (see `project-bootstrap/references/production-deployment.md`).

---

## Key Concepts

### Testing Spectrum

```
SHIFT-LEFT                                  SHIFT-RIGHT
◄─────────────────────────────────────────────────────────►

Before implementation                      After production
- Unit Tests            ──►               - Monitoring
- Integration Tests     ──►               - Alerts
- E2E Tests             ──►               - Smoke Tests
- Exploratory Testing   ──►               - Incident Response

PREVENT bugs                              DETECT + RESPOND
```

### Three Pillars of Observability
| Pillar | What | Tool |
|--------|------|------|
| **Logs** | Event records | Console, Vercel Logs |
| **Metrics** | Performance numbers | Vercel Analytics |
| **Traces** | Request tracking | Sentry |

### Incident Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| **Critical (P1)** | Service down, all users affected | Immediate |
| **High (P2)** | Main feature broken | < 1 hour |
| **Medium (P3)** | Important bug, workaround exists | < 24 hours |
| **Low (P4)** | Minor/cosmetic | Next sprint |

---

## Workflow

### Phase 1: Monitoring Setup

**Sentry Installation (Error Tracking):**
```bash
bun add @sentry/nextjs
bunx @sentry/wizard@latest -i nextjs
```
Configure: DSN env vars, release tracking, user context, source maps, sample rate.

**Sentry Alert Configuration:**
| Alert | Condition | Action |
|-------|-----------|--------|
| Critical Errors | >10 errors in 5 min | Email + Slack |
| New Issues | New issue created | Email |
| Regression | Resolved issue reappears | Email + Slack |

**Vercel Notifications:** Deploy failed → Email. Domain issues → Email.

### Phase 2: Automated Smoke Tests Post-Deploy
Create Playwright smoke tests for production and trigger via GitHub Actions on deployment:

```typescript
test.describe('Production Smoke Tests @smoke', () => {
  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto(PRODUCTION_URL);
    expect(response?.status()).toBe(200);
  });
  test('API health check returns 200', async ({ request }) => {
    const response = await request.get(`${PRODUCTION_URL}/api/health`);
    expect(response.status()).toBe(200);
  });
  test('authentication flow works', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/login`);
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard.*/);
  });
});
```

CI/CD trigger: `on: deployment_status` with `if: github.event.deployment_status.state == 'success'`.

### Phase 3: Incident Response Playbook

**P1 — Critical (Service Down):**
| Step | Action | Time |
|------|--------|------|
| 1 | Notify team (Slack/Call) | Immediate |
| 2 | Check recent deploy | 2 min |
| 3 | If recent → Rollback | 5 min |
| 4 | Check dependencies (Supabase, APIs) | 5 min |
| 5 | Communicate to stakeholders | 10 min |
| 6-9 | Investigate, fix, hotfix, verify | ASAP |
| 10 | Post-mortem | < 24h |

**P2 — High (Partial Functionality):** Notify, evaluate impact, decide rollback vs hotfix within 15 min, communicate workaround.

**P3 — Medium (Bug with Workaround):** Create ticket, communicate workaround within 1 hour, prioritize in backlog.

**P4 — Low (Cosmetic):** Create ticket, prioritize in next sprint.

### Phase 4: Investigation Checklist
1. Check Sentry for new issues and stack traces
2. Check application logs for errors/warnings
3. Check Vercel Analytics for response times and error rates
4. Check Supabase dashboard for database status
5. Review recent deployments for coinciding changes
6. Check DNS/domain configuration

### Phase 5: Post-Mortem Template
Document every incident with: summary, timeline, root cause, impact, what worked well, what can be improved, action items with owners and deadlines.

---

## Tool Resolution

| Tag | Primary | Fallback |
|-----|---------|----------|
| `[AUTOMATION_TOOL]` | `/playwright-cli` | MCP Playwright |

### Useful Commands
```bash
vercel logs [deployment-url]
sentry-cli issues list --project [project]
PRODUCTION_URL=https://tu-dominio.com bun run test:smoke
vercel analytics
```
