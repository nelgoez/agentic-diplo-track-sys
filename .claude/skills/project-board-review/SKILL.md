# Skill: project-board-review

# Project Board Review — Multi-Role Assessment

`project-board-review` launches subagents in key roles (Product Owner, Engineering Manager, QA Lead) to assess a project from multiple perspectives and produce a consolidated board review report for the VP/CEO/company owner.

Each subagent analyzes their domain, flags risks, and provides recommendations. The report is delivered in a format ready for stakeholder review.

---

## When to use

Trigger on: `project board review`, `stakeholder review`, `project assessment`, `PO + EM review`, `board report`, `CEO review`

---

## Roles launched

| Role | Persona | Focus |
|------|---------|-------|
| **Product Owner (PO)** | Product strategy, user value | Features vs master plan, prioritization, backlog health, MVP alignment |
| **Engineering Manager (EM)** | Technical leadership | Architecture, tech debt, code quality, delivery pipeline, team velocity |
| **QA Lead** | Quality assurance | Test coverage, endpoint validation, bug assessment, RLS/security review |

---

## Workflow

### Stage 1: Dispatch subagents

Launch all three subagents in **parallel**. Each subagent must:

1. Read relevant project files (`master-implementation-plan.md`, `business-data-map.md`, `project-dev-guide.md`, `project.yaml`)
2. Inspect the live API at `{{environments.staging.api_url}}` (health, docs, key endpoints)
3. Analyze from their role's perspective
4. Flag **critical risks** that need immediate VP/CEO attention
5. Provide a clean report with: findings, risks (🔴/🟡/🟢), recommendations

Each subagent MUST end their report with:

> "Any strategic guidance, VP/CEO? I need direction on: [specific decision needed]"

This gates the report — the VP must acknowledge or redirect before proceeding.

### Stage 2: Consolidate

The orchestrator (this skill) reads all three reports and produces a consolidated board review covering:

1. **Executive Summary** — top 3 findings across all roles
2. **Product Health** — PO assessment of feature completeness vs plan
3. **Engineering Health** — EM assessment of code quality, pipeline
4. **Quality Health** — QA assessment of endpoint coverage, bugs
5. **Risk Matrix** — consolidated 🔴/🟡/🟢 across all roles
6. **VP/CEO Decision Gates** — open questions needing stakeholder input

### Stage 3: Deliver

Write the consolidated report to `.session/board-review-YYYY-MM-DD.md`. Post a summary with the VP gates to the conversation.

---

## Subagent briefing templates

### PO Briefing

```
You are the PRODUCT OWNER of the Diploma Tracking System. The VP/CEO wants a board review.

1. Read `.context/master-implementation-plan.md` — understand the phase plan
2. Read the PBI docs at `.context/PBI/` — understand what's been implemented
3. Check the live Jira board: project DTS at diplo-track-sys.atlassian.net
4. Hit the live API health/dashboard endpoints: {{environments.staging.api_url}}/health, {{environments.staging.api_url}}/api/v1/admin/dashboard-stats
5. From your PO perspective:
   - What features are complete vs the master plan?
   - What's the backlog health? Any stories blocked or unclear?
   - Is the MVP on track? What's the next priority?
   - Are there user stories missing from the backlog?
6. Provide a clean report. Flag critical risks (🔴). End with:
   "Any strategic guidance, VP/CEO? I need direction on: [decision]"
```

### EM Briefing

```
You are the ENGINEERING MANAGER of the Diploma Tracking System. The VP/CEO wants a board review.

1. Read `.context/business/business-data-map.md` — understand the data model and integrations
2. Read `.context/business/project-dev-guide.md` — understand the architecture
3. Read `server/src/index.ts`, `server/src/routes/*`, `server/src/services/*` — inspect code structure
4. Check the Vercel deployment at {{environments.staging.api_url}}
5. From your EM perspective:
   - Architecture health: is the codebase well-structured?
   - Tech debt: what's accruing? Where are corners being cut?
   - Delivery pipeline: is CI/CD working? Tests running?
   - RLS / auth: any security concerns?
   - Performance: any bottlenecks?
   - Risks: what could block the team?
6. Provide a clean report. Flag critical risks (🔴). End with:
   "Any strategic guidance, VP/CEO? I need direction on: [decision]"
```

### QA Lead Briefing

```
You are the QA LEAD of the Diploma Tracking System. The VP/CEO wants a board review.

1. Perform exploratory testing on the live API at {{environments.staging.api_url}}:
   - Smoke test: GET /health, POST /auth/login, GET /me
   - API test: GET /students/:id/progress, GET /enrollments/eligibility
   - Error handling: 401, 403, 404, invalid inputs
   - RLS: try accessing admin endpoints with student token
   - Edge cases: empty data, malformed JSON, expired tokens
2. Run the test suite: `bun test` in server/
3. Check DB integrity via Supabase
4. From your QA perspective:
   - Endpoint coverage: what's tested vs untested?
   - Bug assessment: any critical/blocking issues?
   - Security: RLS working? Auth gaps?
   - Test coverage: what needs more testing?
   - Data integrity: any issues with seed data?
5. Provide a clean report. Flag critical risks (🔴). End with:
   "Any strategic guidance, VP/CEO? I need direction on: [decision]"

Test accounts:
- Admin: admin@dts.com / admin123
- Estudiante: estudiante@dts.com / test1234
- Coordinador: coordinador@dts.com / coord123
```

---

## Variables consumed

- `{{environments.staging.api_url}}` — from `.agents/project.yaml` environments.staging.api_url
- `{{PROJECT_KEY}}` — from `.agents/project.yaml` project.project_key
- `{{ATLASSIAN_URL}}` — from `.agents/project.yaml` issue_tracker.atlassian_url

---

## Output

`.session/board-review-YYYY-MM-DD.md` — consolidated report with executive summary + role sections + risk matrix + VP gates.

---

## Notes

- All subagents run in parallel — total time ~2-3 minutes
- Each subagent gates on VP/CEO input before the orchestrator continues
- The VP/CEO can skip any individual gate by responding "proceed" or "approved"
- Re-run this skill after each phase completes for incremental board reviews
