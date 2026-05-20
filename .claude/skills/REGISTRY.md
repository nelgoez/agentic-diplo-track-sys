# Skill Registry (auto-generated)

> Generated: `2026-05-20T23:06:00.985Z`
> Generator: `bun scripts/build-skill-registry.ts`
> Protocol: `.claude/skills/agentic-dev-core/references/skill-resolver.md`

This file is the per-session compact-rules cache for the Skill Resolver protocol.
The orchestrator copies one or more `## Skill: <slug>` blocks below into every subagent briefing under `## Project Standards (auto-resolved)`.
Subagents trust those compact rules and only read the full SKILL.md when explicitly instructed.

Skills indexed: 19

---
## Skill: acli

**Purpose**: Atlassian CLI (official `acli` binary, v1.3+ as of 2026) for Jira Cloud, Confluence Cloud, and org admin tasks from the terminal.

**Compact Rules**:
- **Silent pagination truncation.** `workitem search` without `--paginate` returns the first page only — no warning. Scripts that count or iterate keys read the wrong number of items.
- **Auth is per-product.** `acli jira auth login` does not authenticate `acli admin`, `acli confluence`, or `acli rovodev`. There is also a top-level `acli auth` for global OAuth (newer surface). Each scope has its own session.
- **The "work item" vs "issue" split.** The CLI renamed commands (`jira issue` → `jira workitem`) but the JSON response still has a top-level `issues[]` array and CSV inputs still use `issueType`/`parentIssueId` spellings. Mixing old and new terminology in the same script works, but confuses readers.
- **Unknown subcommands fail silently.** Typing `acli jira workflow --help` does NOT error — it falls back to `acli jira --help` with exit 0. So "no error" ≠ "command exists". Always verify by checking the help body actually changed.
- **Hard limits the docs do not advertise.** `acli` cannot list custom fields, edit custom-field values on existing items, manage workflows, manage issue types, or touch project versions/components. See `references/gotchas.md`.
- Read `complementary_categories` from this skill's frontmatter (`issue-tracker`).
- Resolve via local skill-registry script (`scripts/build-skill-registry.ts` → cached at `.claude/skills/REGISTRY.md`). Fallback: scan the session-start `system-reminder` skill list.
- Apply threshold rule per strategy doc §3.2 (T1/T3 silent; T4 ASK).
- The Atlassian MCP fallback documented below is OPT-IN, not a skill — enable manually via docs/mcp/.
- `acli` binary is not installed in the environment.
- `acli` auth fails and cannot be fixed in the current session.
- The operation is one of the documented `acli` blind spots: enumerate custom fields, edit custom-field values on existing work items, manage workflows / issue types / priorities / resolutions / project versions / components, upload attachments, add watchers, add an item to a sprint.
- Bulk operations (acli consumes far fewer tokens per call).
- Scripting / CI pipelines.
- Operations that return large result sets (MCP payloads inflate token usage).
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\acli\SKILL.md` · phase: `unknown` · extraction strategy: B

---

## Skill: agentic-dev-core

**Purpose**: Foundation skill that hosts shared references cited by other workflow skills (briefing template, dispatch patterns, orchestration doctrin...

**Compact Rules**:
- agentic-dev-core/references/briefing-template.md
- agentic-dev-core/references/dispatch-patterns.md
- Read `complementary_categories` from this skill's frontmatter (`language`).
- Resolve via local skill-registry script (`scripts/build-skill-registry.ts` → cached at `.claude/skills/REGISTRY.md`). Fallback: scan the session-start `system-reminder` skill list.
- For each matched skill, classify tier per strategy doc §2.
- Apply threshold rule per strategy doc §3.2:
- **T1 / T3** matches → load silently. Cache for the session.
- **T4** matches → ASK user once: `"Detected <skill> (T4). Apply when consulting agentic-dev-core/references/typescript-patterns.md? Y/N"`. Cache the answer for the session.
- When dispatching sub-agents that consume `references/typescript-patterns.md`, inject a `## Composable Skills` block per strategy doc §6.2.
- Provide a bootstrap or init action — clone the full repo instead.
- Create or modify any files. It is a passive reference library.
- Create or modify `.context/` files (that belongs to `/agentic-dev-onboard` and `/project-foundation`).
- Generate or scaffold tests, fixtures, or test components (that belongs to `/unit-testing` and test-automation skills).
- Adapt the framework to a specific stack (that belongs to `/project-bootstrap`).
- Sync project-specific facts in `CLAUDE.md` (that belongs to `/sync-ai-memory`).
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\agentic-dev-core\SKILL.md` · phase: `foundation` · extraction strategy: B

---

## Skill: agentic-dev-onboard

**Purpose**: Walks new users through this repo's dev flow — Next.js + Supabase stack, Jira workflow (Ready For Dev → In Progress → In Review → Ready F...

**Compact Rules**:
- Read `complementary_categories` from this skill's frontmatter.
- Resolve via local skill-registry script (`scripts/build-skill-registry.ts` → cached at `.claude/skills/REGISTRY.md`). Fallback: scan the session-start `system-reminder` skill list.
- Apply threshold rule per strategy doc §3.2 (T1/T3 silent; T4 ASK).
- Inject a `## Composable Skills` block per strategy doc §6.2 only when (rarely) dispatching a sub-agent.
- Use **Context7** for "how to use X" — official docs, current API
- Use **Tavily** for "how to solve X" — community fixes, troubleshooting
- Use **Atlassian** only as fallback — prefer `/acli` skill (fewer tokens, faster)
- **§1 CRITICAL RULES** — 12 rules that override defaults (credentials, plan-before-coding, no AI attribution, MCP credential failure protocol, `READ package.json DIRECTLY`).
- **§4 CONTEXT LOADING MAP** — task → trigger phrase → skill → context files → primary tool.
- **§5 SKILLS + COMMANDS + MCPs REGISTRY** — full T1/T3/T4 skill model.
- **§12 PROACTIVE MEMORY TRIGGERS** — when to call `mem_save` without being asked.
- [ ] Did you run the setup script (`bun run setup` — verify name in `package.json`)?
- [ ] Did you fill `.env` with your own credentials (`LOCAL_*`, `STAGING_*`, `ATLASSIAN_*`, `TAVILY_API_KEY`, `SUPABASE_*`)?
- [ ] Does the agents linter (`bun run vars:check` per `package.json`) exit clean (0 errors)?
- [ ] Does Engram appear in the active MCP list (restart your agent if not)?
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\agentic-dev-onboard\SKILL.md` · phase: `foundation` · extraction strategy: B

---

## Skill: design-system

**Purpose**: Genera un DESIGN.md (formato Google Labs Apache-2.0) en el root del proyecto antes del scaffolding del frontend.

**Compact Rules**:
- `agentic-dev-core/references/briefing-template.md` — used when dispatching to a subagent (Open Design or Claude Design handoff conversion).
- `agentic-dev-core/references/dispatch-patterns.md` — selects Single / Sequential / Parallel for the chosen path.
- `.context/business/business-model.md` — industria, value-prop, tone implícito.
- `.context/PRD/personas.md` — target visual, demographic signal.
- `.context/PRD/executive-summary.md` — positioning, success KPIs.
- Read `complementary_categories` from this skill's frontmatter (`frontend-ui`, `accessibility`).
- Resolve via local skill-registry script (`scripts/build-skill-registry.ts` → cached at `.claude/skills/REGISTRY.md`). Fallback: scan the session-start `system-reminder` skill list.
- For each matched skill, classify tier per strategy doc §2.
- Apply threshold rule per strategy doc §3.2:
- **T1 / T3** matches → load silently. Cache for the session.
- **T4** matches → ASK user once: `"Detected <skill> (T4). Apply for this design-system work? Y/N"`. Cache the answer for the session.
- When dispatching sub-agents (Open Design conversion, Claude Design handoff, LLM-authored custom DESIGN.md), inject a `## Composable Skills` block per strategy doc §6.2.
- A new project just finished the PRD and needs to define visual identity before the SRS architecture phase.
- An existing project wants to rebrand without touching Constitution / PRD / code.
- A team wants to centralize design tokens in a portable format consumable by multiple AI agents.
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\design-system\SKILL.md` · phase: `foundation` · extraction strategy: B

---

## Skill: dev

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: dev
- description: Development workflows for the playwright-cli repository. Use when the user asks about rolling dependencies, releasing, or other repo maintenance tasks.
- ---
- * **Rolling Playwright dependency** [roll.md](roll.md)
- * **Preparing Release** [release.md](release.md)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\dev\SKILL.md` · phase: `unknown` · extraction strategy: B

---

## Skill: exploratory-testing

**Purpose**: Orchestrates manual exploratory testing on deployed features: smoke tests, UI/API/DB Trifuerza exploration, bug reporting, and test sessi...

**Compact Rules**:
- `.books/fase-10-exploratory-testing/exploratory-testing.MANUAL.md`
- `.prompts/fase-10-exploratory-testing/` (smoke-test.md, exploratory-test.md, bug-report.md, test-report.md, exploratory-api-test.md, exploratory-db-test.md)
- **Charter**: What to explore and why (pre-defined scope)
- **Time-box**: 30-45 min max per session
- **Session Notes**: Document findings as you explore
- **Basic Access**: App loads without 500 errors, no console errors, assets load
- **Authentication** (if applicable): Login, session persistence, logout
- **Story Happy Path**: From acceptance criteria
- **Backend Integration**: API calls return 200, data persists on refresh
- **Boundary Testing**: Empty, min, max, special characters
- **State Testing**: Refresh, back button, multiple tabs, timeout, offline
- **Data Validation**: Invalid formats, weak passwords, duplicates, concurrent edits
- Contract validation (status codes, response schema)
- RLS Policy testing (multi-tenant data isolation)
- Error handling (no auth, expired token, invalid data)
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\exploratory-testing\SKILL.md` · phase: `testing` · extraction strategy: B

---

## Skill: git-flow-master

**Purpose**: End-to-end Git operator for any branching strategy.

**Compact Rules**:
- "I want to start work on UPEX-123" → branch creation
- "commit and push", "subir cambios", "push to main" → commit + push flow
- "abrí un PR contra staging" → PR creation
- "tengo conflictos al hacer pull" → conflict resolution
- "este PR va a quedar enorme" → chained-PR planning hand-off
- "qué estrategia de git usamos en este repo" → strategy detection / persistence
- "el push fue rechazado" → diagnostic + recovery flow
- Read `complementary_categories` from this skill's frontmatter.
- Resolve via local skill-registry script (`scripts/build-skill-registry.ts` → cached at `.claude/skills/REGISTRY.md`). Fallback: scan the session-start `system-reminder` skill list.
- For each matched skill, classify tier per strategy doc §2.
- Apply threshold rule per strategy doc §3.2:
- **T1 / T3** matches → load silently. Cache for the session.
- **T4** matches → ASK user once: `"Detected <skill> (T4). Apply for these Git operations? Y/N"`. Cache the answer for the session.
- When dispatching sub-agents (PR creation, conflict resolution, chained-PR planning), inject a `## Composable Skills` block per strategy doc §6.2.
- Current branch.
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\git-flow-master\SKILL.md` · phase: `implementation` · extraction strategy: B

---

## Skill: kata-architecture

**Purpose**: Test automation framework using KATA (Komponent Action Test Architecture): 4-layer architecture (TestContext→ApiBase/UiBase→YourApi/YourP...

**Compact Rules**:
- `.books/fase-12-test-automation/test-automation.MANUAL.md`
- `.prompts/fase-12-test-automation/` (planning/, e2e/, integration/, regression/)
- `.context/guidelines/TAE/` (kata-architecture.md, kata-ai-index.md, api-testing-patterns.md, e2e-testing-patterns.md, automation-standards.md)
- Use Playwright auto-wait (no `waitForTimeout`)
- `data-testid` preferred for locators
- Hybrid testing: API for setup, UI for flow, API for verification
- Fixture lazy loading: `{ api }` won't open browser
- **Fixed** (inside ATC): Validate ATC worked — status codes, required fields
- **Test-level** (in test file): Validate combined flow results — business rules, final state

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\kata-architecture\SKILL.md` · phase: `testing` · extraction strategy: B

---

## Skill: playwright-cli

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: playwright-cli
- description: Automate browser interactions, test web pages and work with Playwright tests.
- allowed-tools: Bash(playwright-cli:*) Bash(npx:*) Bash(npm:*)
- ---
- playwright-cli open
- playwright-cli goto https://playwright.dev
- playwright-cli click e15
- playwright-cli type "page.click"
- playwright-cli press Enter
- playwright-cli screenshot
- playwright-cli close
- playwright-cli open
- playwright-cli open https://example.com/
- playwright-cli goto https://playwright.dev
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\playwright-cli\SKILL.md` · phase: `unknown` · extraction strategy: B

---

## Skill: product-management

**Purpose**: Orchestrates continuous product management work — initial backlog seed from PRD, incremental feature addition, epic creation, story refin...

**Compact Rules**:
- A new feature or epic needs to be added to the backlog
- A story has rough or ambiguous acceptance criteria that need sharpening
- A story needs INVEST validation or a 3-amigos session before development starts
- You're systematically enumerating edge cases / failure modes for a feature
- You're seeding the very first product backlog from a freshly minted PRD
- `/project-foundation` should have produced `.context/PRD/` and `.context/SRS/` (required for the initial backlog-seed workflow; useful context for all others)
- `.agents/project.yaml` populated with `{{PROJECT_KEY}}`, `{{ISSUE_TRACKER}}`, `{{ATLASSIAN_URL}}` — these ship with the cloned boilerplate; if missing, clone the full repo
- Atlassian / Jira tooling reachable (Atlassian CLI `acli` preferred, MCP Atlassian as fallback) for any workflow that writes to Jira
- Read `complementary_categories` from this skill's frontmatter (`issue-tracker`, `creativity`).
- Resolve via local skill-registry script (`scripts/build-skill-registry.ts` → cached at `.claude/skills/REGISTRY.md`). Fallback: scan the session-start `system-reminder` skill list.
- For each matched skill, classify tier per strategy doc §2.
- Apply threshold rule per strategy doc §3.2:
- **T1 / T3** matches → load silently. Cache for the session.
- **T4** matches → ASK user once: `"Detected <skill> (T4). Apply for this PM workflow? Y/N"`. Cache the answer for the session.
- When dispatching sub-agents (backlog seeding, story refinement, AC enumeration, sprint reporting), inject a `## Composable Skills` block per strategy doc §6.2.
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\product-management\SKILL.md` · phase: `management` · extraction strategy: B

---

## Skill: project-bootstrap

**Purpose**: Scaffolds the technical infrastructure of a new project: backend (DB schemas, API base, types, error handling), frontend (design system,...

**Compact Rules**:
- `agentic-dev-core/references/briefing-template.md` — used when dispatching parallel scaffolding subagents (e.g. backend + frontend in parallel).
- `agentic-dev-core/references/dispatch-patterns.md` — picks Single / Sequential / Parallel for each phase below.
- `agentic-dev-core/references/skill-composition-strategy.md` — composition contract consumed by the step below.
- Read `complementary_categories` from this skill's frontmatter (`frontend-framework`, `frontend-ui`, `backend-db`, `runtime`, `language`, `ci-cd`).
- Resolve via local skill-registry script (`scripts/build-skill-registry.ts` → cached at `.claude/skills/REGISTRY.md`). Fallback: scan the session-start `system-reminder` skill list.
- For each matched skill, classify tier per strategy doc §2 (path-based: `.claude/skills/` → T1; PROJECT_LEVEL_SKILLS → T3; USER_LEVEL_SKILLS → T4).
- Apply threshold rule per strategy doc §3.2:
- **T1 / T3** matches → load silently. Cache for the session.
- **T4** matches → ASK user once: `"Detected <skill> (T4). Apply for this bootstrap? Y/N"`. Cache the answer for the session.
- When dispatching scaffolding sub-agents (Backend setup, Frontend setup, Incremental features), inject a `## Composable Skills` block per strategy doc §6.2 listing the resolved skills + project standards (test command, runtime, etc).
- A fresh repo has its product foundation (`/project-foundation` already ran) but no code yet.
- An existing repo needs an incremental infrastructure feature added (e.g. "add OpenAPI to the API", "add bearer auth", "wire Supabase types into the frontend").
- Define the product (PRD, user journeys, architecture decisions) — that's `/project-foundation`.
- Seed the Jira backlog with epics + user stories — that's `/product-management`.
- Implement an individual user story (planning → code → review → deploy) — that's `/sprint-development`.
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\project-bootstrap\SKILL.md` · phase: `foundation` · extraction strategy: B

---

## Skill: project-foundation

**Purpose**: Orchestrates the foundational definition of a new product/project: Constitution (business model + market context), Architecture (PRD + SR...

**Compact Rules**:
- `agentic-dev-core/references/briefing-template.md` — used when dispatching subagents to research market data, audit competitors, or interview users.
- `agentic-dev-core/references/dispatch-patterns.md` — picks Single / Sequential / Parallel for each phase below.
- `agentic-dev-core/references/skill-composition-strategy.md` — composition contract consumed by the step below.
- Read `complementary_categories` from this skill's frontmatter (`creativity`).
- Resolve via local skill-registry script (`scripts/build-skill-registry.ts` → cached at `.claude/skills/REGISTRY.md`). Fallback: scan the session-start `system-reminder` skill list.
- For each matched skill, classify tier per strategy doc §2.
- Apply threshold rule per strategy doc §3.2:
- **T1 / T3** matches → load silently. Cache for the session.
- **T4** matches → ASK user once: `"Detected <skill> (T4). Apply for this foundation work? Y/N"`. Cache the answer for the session.
- When dispatching sub-agents (Constitution, PRD, SRS, Discovery), inject a `## Composable Skills` block per strategy doc §6.2.
- A new product/project is being defined from scratch and you need Constitution + PRD + SRS + Discovery artifacts.
- An existing project needs to redefine scope significantly (e.g. pivot, new MVP cut) and the foundation docs must be regenerated.
- A specific section is missing or stale (e.g. user journeys haven't been written yet) — invoke just that phase via the Specific tasks table below.
- Scaffold the codebase (backend / frontend / OpenAPI / auth) — that's `/project-bootstrap`.
- Seed the Jira backlog with epics + stories — that's `/product-management`.
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\project-foundation\SKILL.md` · phase: `foundation` · extraction strategy: B

---

## Skill: provider-abstraction

**Purpose**: Architectural pattern for external provider abstraction using Strategy/Adapter pattern.

**Compact Rules**:
- Add new providers without touching application code
- Swap providers during runtime (e.g., fallback to another SGA)
- Test with mock providers
- Version providers independently
- **Circuit Breaker**: Stop calling a failing provider
- **Timeout per provider**: Configurable timeouts per provider
- **Retry with backoff**: Exponential backoff on transient failures
- **Fallback chain**: Try Provider A → if fails → try Provider B
- **Define the Interface**: Based on application domain needs
- **Implement First Provider** (e.g., Moodle): Full adapter with all edge cases
- **Implement Second Provider** (e.g., Guaraní): Validates interface completeness
- **Build Provider Registry**: Factory pattern with config-based selection
- **Add Resilience**: Circuit breaker, retries, timeouts, fallbacks
- **Add Observability**: Health checks, metrics, provider-level logging
- **Write Tests**: Unit tests per adapter, integration tests against real/sandbox APIs

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\provider-abstraction\SKILL.md` · phase: `architecture` · extraction strategy: B

---

## Skill: qa-learning-methodology

**Purpose**: 4-level QA training methodology: Level 0 (concept-driven, learn WHY), Level 1 (prompt-driven, learn HOW), Level 2 (problem-driven, learn...

**Compact Rules**:
- `.prompts/QA-learning-methodology/` (LEVEL0 through LEVEL3 generators)
- **Analysis** (`[area]-conceptos-analisis.md`): The consigna, solution breakdown, and all concepts needed
- **Quiz** (`[area]-conceptos-quiz.md`): 6-10 multiple-choice questions testing concept understanding
- **Answers** (`[area]-conceptos-respuestas.md`): Correct answers with detailed explanations
- **Analysis** (`[tipo]-testing-analisis.md`): How consignas were derived from ACs and test cases
- **Consignas** (`[tipo]-testing-consignas.md`): Instructions for the student to execute (no solutions)
- **Answers** (`[tipo]-testing-respuestas.md`): Complete solutions with explanations
- **DB**: SELECT → WHERE → JOIN → COUNT/GROUP BY → INSERT → UPDATE → DELETE → Subqueries → Transactions → RLS
- **API**: GET → Status 200 → POST → Response structure → Headers → Error codes → Auth → PUT/PATCH → DELETE → Schema validation
- **UI**: IDs → data-testid → Click/type → Text assertions → Attributes → States → Forms → Navigation → Complex selectors → Waits → Empty states → Responsive
- **Analysis** (`[epic-key]-testing-analisis.md`): Epic context, architecture, risks
- **Problem** (`[epic-key]-testing-problema.md`): The User Story with ACs, technical info, and student task
- **Answers** (`[epic-key]-testing-respuestas.md`): Complete reference test plan
- **Analysis** (`[sistema]-objetivo-analisis.md`): System overview, architecture, DB, APIs, UI, existing epics
- **Objective** (`[sistema]-objetivo-necesidad.md`): The Epic/Feature to analyze
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\qa-learning-methodology\SKILL.md` · phase: `training` · extraction strategy: B

---

## Skill: shift-right-testing

**Purpose**: Production observability and incident response: Sentry/DataDog monitoring, automated post-deploy smoke tests, alert configuration, and in...

**Compact Rules**:
- `.books/fase-14-shift-right-testing/shift-right-testing.MANUAL.md`
- `.prompts/fase-14-shift-right-testing/` (monitoring-setup.md, smoke-tests.md, incident-response.md)
- Unit Tests            ──►               - Monitoring
- Integration Tests     ──►               - Alerts
- E2E Tests             ──►               - Smoke Tests
- Exploratory Testing   ──►               - Incident Response
- Check Sentry for new issues and stack traces
- Check application logs for errors/warnings
- Check Vercel Analytics for response times and error rates
- Check Supabase dashboard for database status
- Review recent deployments for coinciding changes
- Check DNS/domain configuration

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\shift-right-testing\SKILL.md` · phase: `operations` · extraction strategy: B

---

## Skill: sprint-development

**Purpose**: Orchestrates the per-story dev loop end-to-end: Planning -> Implementation -> Code Review -> Staging deploy -> (gated) Production deploy.

**Compact Rules**:
- **New user story** (most common) -> Stage 1 (story-plan) -> Stage 2 (implement-story) -> ... -> Stage 4
- **New feature with multiple stories** -> Stage 1 macro (feature-plan) -> loop Stage 1+2 per story -> Stage 4 per merge
- **Bug fix** -> skip to Stage 2 with `bug-fix-workflow.md` (root cause first), then Stage 3+4
- **Resume from interruption** -> Stage 2 entry via `continue-implementation.md`
- **PR feedback / code review iteration** -> Stage 3 with `fix-issues.md`, fix-and-iterate loop
- **Production deploy** (separate event) -> Stage 5, only after QA green + business approval
- `.agents/project.yaml` populated. If missing, clone the full boilerplate — foundation files ship with the repo.
- Story exists in the issue tracker with refined Acceptance Criteria. If backlog is empty or AC are unclear, run `/product-management` first.
- Branch policy clear and CI configured. First-time-only setup lives in `references/setup-linting.md` and `references/ci-cd-setup.md`.
- Working directory is the **target project repo**. Sprint-dev runs there, not in the boilerplate.
- `.env` populated with environment URLs and credentials. Never hardcode credentials.
- **Missing** → generate it before entering the ticket loop. Delegate to
- **Present but older than 24h, OR the user explicitly asks for a refresh** →
- **Present and fresh** → proceed.
- **UI work in any stage** → `frontend-ui` category match (T3 or T4 — ASK if T4).
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\sprint-development\SKILL.md` · phase: `implementation` · extraction strategy: B

---

## Skill: test-documentation

**Purpose**: Creates formal test case documentation in Jira after exploratory validation: test analysis, ROI-based prioritization, lifecycle states (D...

**Compact Rules**:
- `.books/fase-11-test-documentation/test-documentation.MANUAL.md`
- `.prompts/fase-11-test-documentation/` (test-analysis.md, test-prioritization.md, test-documentation.md)
- **DRAFT**: Initial creation
- **IN DESIGN**: Test steps being defined
- **READY**: Complete and executable
- **MANUAL**: Will remain manual (low ROI for automation)
- **IN REVIEW**: Pending automation approval
- **CANDIDATE**: Approved for automation (awaiting Fase 12)
- **AUTOMATED**: Scripted
- **Gather context**: User Story, comments, linked bugs, session notes from exploratory testing
- **Identify scenarios**: Classify by business priority (Critical/High/Medium/Low) and automatisability
- **Create Component Map (Lego)**: Each atomic test as a reusable component
- Calculate ROI for every candidate scenario
- Apply component reuse bonus
- Generate prioritization table with implementation order
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\test-documentation\SKILL.md` · phase: `testing` · extraction strategy: B

---

## Skill: testability-guide

**Purpose**: Generates a public in-app `/qa` page ("Software Testability Guide for QA") + a tool-agnostic credentials artifact (markdown body) the use...

**Compact Rules**:
- **A public `/qa` page inside the app** titled _"Software Testability Guide for QA"_ — explains the architecture, demo users, DB-level testing via DBHub MCP, API-level testing via OpenAPI MCP, UI-level testing via Playwright (scripted and agentic). The page links out to the real credentials but never inlines them.
- **A tool-agnostic credentials artifact** (a markdown body) that holds the real DB connection, API login, demo passwords, OpenAPI spec URL, and Swagger UI link. The user picks where this artifact gets published: a Jira Epic (default), a Confluence page, a Notion page, any tool reachable via an MCP or a CLI, or — as a last resort — manual paste.
- `agentic-dev-core/references/briefing-template.md` — used when dispatching parallel sub-agents (e.g. page codegen + credentials-artifact publish in parallel).
- `agentic-dev-core/references/dispatch-patterns.md` — picks Single / Sequential / Parallel for each phase.
- `agentic-dev-core/references/skill-composition-strategy.md` — composition contract consumed by the auto-resolve step below.
- Read `complementary_categories` from this skill's frontmatter.
- Resolve via local skill-registry script (`scripts/build-skill-registry.ts` → cached at `.claude/skills/REGISTRY.md`). Fallback: scan the session-start `system-reminder` skill list.
- Classify tier per strategy doc §2.
- Apply threshold rule per strategy doc §3.2:
- **T1 / T3** matches → load silently. Cache for the session.
- **T4** matches → ASK user once: `"Detected <skill> (T4). Apply for this run? Y/N"`. Cache the answer.
- Inject a `## Composable Skills` block per strategy doc §6.2 into every sub-agent prompt.
- A working app exists and QA (humans or AI agents) need a single page in the product that explains how to test it.
- The user wants to create or refresh the credentials artifact (Jira Epic, Confluence, Notion, or another destination) that backs the `/qa` page's CTA.
- The host project's stack drifted (auth changed, DB moved, new MCP available) and the existing `/qa` needs to be brought back in sync.
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\testability-guide\SKILL.md` · phase: `foundation-extension` · extraction strategy: B

---

## Skill: unit-testing

**Purpose**: Focused skill for unit-test design — TDD workflow (red-green-refactor), test naming (AAA, Given-When-Then), mocking patterns (mocks/spies...

**Compact Rules**:
- "Write unit tests for this function/class"
- "TDD this slice" / "red-green-refactor"
- "What should I mock here?"
- "How do I name this test?"
- "What's the right coverage target for this module?"
- Mid-flight from `/sprint-development` Stage 2 (Implementation) when implementing TDD-friendly code (pure functions, complex branching, bug fix reproducers)
- Project has a unit test runner configured (Jest, Vitest, Mocha, or similar)
- Test command exists in `package.json` (`bun test`, `npm test`, `vitest`, etc.)
- For TDD: test runner supports watch mode (`--watch`)
- If no runner is configured, the first task is to set one up — see `references/unit-testing.md` § Setup
- Read `complementary_categories` from this skill's frontmatter (`language`).
- Resolve via local skill-registry script (`scripts/build-skill-registry.ts` → cached at `.claude/skills/REGISTRY.md`). Fallback: scan the session-start `system-reminder` skill list.
- For each matched skill, classify tier per strategy doc §2.
- Apply threshold rule per strategy doc §3.2:
- **T1 / T3** matches → load silently. Cache for the session.
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\unit-testing\SKILL.md` · phase: `implementation` · extraction strategy: B
