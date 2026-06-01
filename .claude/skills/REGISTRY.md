# Skill Registry (auto-generated)

> Generated: `2026-06-01T20:59:32.202Z`
> Generator: `bun scripts/build-skill-registry.ts`
> Protocol: `.claude/skills/agentic-dev-core/references/skill-resolver.md`

This file is the per-session compact-rules cache for the Skill Resolver protocol.
The orchestrator copies one or more `## Skill: <slug>` blocks below into every subagent briefing under `## Project Standards (auto-resolved)`.
Subagents trust those compact rules and only read the full SKILL.md when explicitly instructed.

Skills indexed: 21

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

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: exploratory-testing
- description: 'Orchestrates manual exploratory testing on deployed features: smoke tests, UI/API/DB Trifuerza exploration, bug reporting, and test session summaries. Triggers on: `exploratory testing`, `smoke test`, `Trifuerza testing`, `manual test session`, `bug report`, `test report`. Do NOT use for: shift-left test planning (use `/sprint-development`), test documentation (use `/test-documentation`), test automation (use `/kata-architecture`), or unit testing (use `/unit-testing`).'
- license: MIT
- compatibility: [claude-code, opencode]
- phase: testing
- ---
- `exploratory-testing` orchestrates the manual validation of features deployed to staging: smoke tests to confirm deployment health, deep exploratory sessions using the Trifuerza methodology (UI + API + DB), structured bug reporting, and session summary reports.
- This skill runs **after** shift-left test planning (`.prompts/fase-5-shift-left-testing/`) and **before** formal test documentation (`.prompts/fase-11-test-documentation/`) and automation (`.prompts/fase-12-test-automation/`).
- ---
- Requires `agentic-dev-core`. Source content migrated from:
- - `.books/fase-10-exploratory-testing/exploratory-testing.MANUAL.md`
- - `.prompts/fase-10-exploratory-testing/` (smoke-test.md, exploratory-test.md, bug-report.md, test-report.md, exploratory-api-test.md, exploratory-db-test.md)
- ---
- ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\exploratory-testing\SKILL.md` · phase: `unknown` · extraction strategy: B

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

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: kata-architecture
- description: 'Test automation framework using KATA (Komponent Action Test Architecture): 4-layer architecture (TestContext→ApiBase/UiBase→YourApi/YourPage→TestFixture), ATC pattern with @atc decorator, Playwright integration, and API/E2E testing patterns. Triggers on: `kata framework`, `test automation`, `ATC`, `@atc decorator`, `Playwright automation`, `test architecture`, `kata-architecture`, `implementar automation tests`, `automation patterns`. Do NOT use for: exploratory testing (use `/exploratory-testing`), test documentation (use `/test-documentation`), manual testing (use `/exploratory-testing`), or unit testing (use `/unit-testing`).'
- license: MIT
- compatibility: [claude-code, opencode]
- phase: testing
- ---
- `kata-architecture` implements test automation using the KATA framework (Komponent Action Test Architecture): a 4-layer architecture for Playwright-based test automation with ATCs (Acceptance Test Components), type-safe API helpers, and traceability to Jira/Xray.
- Source content migrated from:
- - `.books/fase-12-test-automation/test-automation.MANUAL.md`
- - `.prompts/fase-12-test-automation/` (planning/, e2e/, integration/, regression/)
- - `.context/guidelines/TAE/` (kata-architecture.md, kata-ai-index.md, api-testing-patterns.md, e2e-testing-patterns.md, automation-standards.md)
- ---
- Requires `agentic-dev-core`. Run this skill AFTER exploratory testing (`/exploratory-testing`) and test documentation (`/test-documentation`) — only automate functionality validated manually and documented.
- ---
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\kata-architecture\SKILL.md` · phase: `unknown` · extraction strategy: B

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

## Skill: project-board-review

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- `project-board-review` launches subagents in key roles (Product Owner, Engineering Manager, QA Lead) to assess a project from multiple perspectives and produce a consolidated board review report for the VP/CEO/company owner.
- Each subagent analyzes their domain, flags risks, and provides recommendations. The report is delivered in a format ready for stakeholder review.
- ---
- Trigger on: `project board review`, `stakeholder review`, `project assessment`, `PO + EM review`, `board report`, `CEO review`
- ---
- ---
- Launch all three subagents in **parallel**. Each subagent must:
- 1. Read relevant project files (`master-implementation-plan.md`, `business-data-map.md`, `project-dev-guide.md`, `project.yaml`)
- 2. Inspect the live API at `{{environments.staging.api_url}}` (health, docs, key endpoints)
- 3. Analyze from their role's perspective
- 4. Flag **critical risks** that need immediate VP/CEO attention
- 5. Provide a clean report with: findings, risks (🔴/🟡/🟢), recommendations
- Each subagent MUST end their report with:
- This gates the report — the VP must acknowledge or redirect before proceeding.
- The orchestrator (this skill) reads all three reports and produces a consolidated board review covering:
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\project-board-review\SKILL.md` · phase: `unknown` · extraction strategy: B

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

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: project-foundation
- description: 'Orchestrates the foundational definition of a new product/project: Constitution (business model + market context), Architecture (PRD + SRS + API contracts), and Discovery (business data map + API architecture + dev guide). Triggers on: `ideando un nuevo producto`, `define el PRD`, `construir la constitución del proyecto`, `mapear arquitectura del sistema`, `definir SRS`, `user personas`, `user journeys`, `MVP scope`, `business data map`, `api architecture discovery`, `project dev guide`, `constituir el proyecto desde cero`. Do NOT use for: infrastructure scaffolding (use `/project-bootstrap`), backlog seeding (use `/product-management`), per-story development (use `/sprint-development`), unit testing (use `/unit-testing`), or QA workflows (out of scope, see `agentic-qa-boilerplate`).'
- license: MIT
- compatibility: [claude-code, copilot, cursor, codex, opencode]
- phase: foundation
- complementary_categories:
- - creativity
- ---
- <!-- Model preferences (advisory; dispatchers may use to route) -->
- <!--
- model_preferences:
- foundation: opus       # high-leverage architectural work
- planning: sonnet       # structured writing
- implementation: sonnet # default for code work
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\project-foundation\SKILL.md` · phase: `unknown` · extraction strategy: B

---

## Skill: provider-abstraction

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: provider-abstraction
- description: 'Architectural pattern for external provider abstraction using Strategy/Adapter pattern. Design pluggable integrations for Moodle, Guaraní, and other external systems with a unified interface. Triggers on: `provider abstraction`, `external provider integration`, `Moodle integration`, `Guaraní integration`, `Strategy pattern provider`, `pluggable integrations`, `adapter pattern`, `third-party provider abstraction`. Do NOT use for: general API client generation (use `/project-bootstrap`), test automation (use `/kata-architecture`), or database integration (use Supabase MCP).'
- license: MIT
- compatibility: [claude-code, opencode]
- phase: architecture
- ---
- `provider-abstraction` defines the architectural pattern for integrating external providers (Moodle, Guaraní, SGA, etc.) using the Strategy/Adapter pattern. The goal is to make providers pluggable: add or swap a provider without changing the rest of the system.
- ---
- Requires `agentic-dev-core`. This is an architectural concern for the DTS (Diploma Tracking System) redesign, specifically for the integration layer of external academic systems.
- ---
- ┌─────────────────────────────────────────────────────────────────┐
- │                     APPLICATION LAYER                            │
- │                                                                  │
- │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐        │
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\provider-abstraction\SKILL.md` · phase: `unknown` · extraction strategy: B

---

## Skill: qa-learning-methodology

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: qa-learning-methodology
- description: '4-level QA training methodology: Level 0 (concept-driven, learn WHY), Level 1 (prompt-driven, learn HOW), Level 2 (problem-driven, learn WHAT to test), Level 3 (objective-driven, learn WHAT problems to identify). Triggers on: `qa training`, `qa learning`, `concept-driven learning`, `prompt-driven learning`, `problem-driven learning`, `objective-driven learning`, `nivel 0`, `nivel 1`, `nivel 2`, `nivel 3`, `qa methodology`, `training generator`. Do NOT use for: feature implementation (use `/sprint-development`), test automation (use `/kata-architecture`), or production testing (use `/shift-right-testing`).'
- license: MIT
- compatibility: [claude-code, opencode]
- phase: training
- ---
- `qa-learning-methodology` defines a 4-level progressive learning system for QA training, from fundamental concepts to architectural analysis. Each level generates 3 artifacts: analysis, exercise, and answers.
- Source content migrated from:
- - `.prompts/QA-learning-methodology/` (LEVEL0 through LEVEL3 generators)
- ---
- Requires `agentic-dev-core`. Composes with all testing skills (content for practice exercises).
- ---
- LEVEL 3: OBJECTIVE-DRIVEN LEARNING (Meta-game)
- ══════════════════════════════════════════════
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\qa-learning-methodology\SKILL.md` · phase: `unknown` · extraction strategy: B

---

## Skill: shift-right-testing

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: shift-right-testing
- description: 'Production observability and incident response: Sentry/DataDog monitoring, automated post-deploy smoke tests, alert configuration, and incident response playbook (P1-P4). Triggers on: `shift-right testing`, `production monitoring`, `Sentry setup`, `incident response`, `smoke tests post-deploy`, `post-deploy validation`, `observability`, `production alerts`. Do NOT use for: pre-deploy checklist (use `/project-bootstrap/references/production-deployment.md`), test automation (use `/kata-architecture`), shift-left planning (use `/sprint-development`).'
- license: MIT
- compatibility: [claude-code, opencode]
- phase: operations
- ---
- `shift-right-testing` implements production monitoring, automated smoke tests post-deploy, and incident response procedures. It complements shift-left testing (prevention) with production observability (detection + response).
- Source content migrated from:
- - `.books/fase-14-shift-right-testing/shift-right-testing.MANUAL.md`
- - `.prompts/fase-14-shift-right-testing/` (monitoring-setup.md, smoke-tests.md, incident-response.md)
- ---
- Requires `agentic-dev-core`. Runs AFTER production deployment (see `project-bootstrap/references/production-deployment.md`).
- ---
- SHIFT-LEFT                                  SHIFT-RIGHT
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\shift-right-testing\SKILL.md` · phase: `unknown` · extraction strategy: B

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

## Skill: sprint-gate-review

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- `sprint-gate-review` audits PBI documentation completeness before progressing to the next development phase. It acts as a phase gate, verifying that all stories have spec.md, impl-plan.md, edge-cases.md, and compliance-matrix.md artifacts before allowing the team to begin implementation.
- ---
- Trigger on: `sprint gate`, `phase gate review`, `backlog audit`, `PBI readiness check`, `story audit`, `ready for sprint`, `backlog health check`
- Do NOT use for: implementation, testing, product definition, or infrastructure scaffolding.
- ---
- For each story in scope, verify:
- **Scoring**: Each gate = pass/fail. Pass = 1, Fail = 0. All 3 passes = Ready. Any fail = remediation task.
- ---
- Read `master-implementation-plan.md` to identify upcoming phase stories.
- For each story folder in `.context/PBI/{STORY-KEY}/`, verify all 4 files exist.
- For each artifact present, evaluate clarity and compliance.
- Output a readiness matrix:
- Flag failing stories. Assign remediation owner. Block phase progression until all stories pass.
- ---
- - `{{PROJECT_KEY}}` — from `.agents/project.yaml`
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\sprint-gate-review\SKILL.md` · phase: `unknown` · extraction strategy: B

---

## Skill: test-documentation

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: test-documentation
- description: 'Creates formal test case documentation in Jira after exploratory validation: test analysis, ROI-based prioritization, lifecycle states (DRAFT→IN DESIGN→READY→CANDIDATE/MANUAL), and traceability. Triggers on: `test documentation`, `formal test cases`, `test case lifecycle`, `test analysis`, `ROI prioritization`, `Xray test management`, `regression suite`. Do NOT use for: exploratory testing (use `/exploratory-testing`), test automation (use `/kata-architecture`), shift-left test planning (use `/sprint-development`).'
- license: MIT
- compatibility: [claude-code, opencode]
- phase: testing
- ---
- `test-documentation` manages the creation, prioritization, and lifecycle of formal test cases in Jira after features have been validated via exploratory testing. It ensures traceability between requirements and tests, and drives automation decisions based on ROI.
- Source content migrated from:
- - `.books/fase-11-test-documentation/test-documentation.MANUAL.md`
- - `.prompts/fase-11-test-documentation/` (test-analysis.md, test-prioritization.md, test-documentation.md)
- ---
- Requires `agentic-dev-core`. Composes after `exploratory-testing` and before `kata-architecture`.
- ---
- DRAFT → IN DESIGN → READY → [MANUAL | IN REVIEW → CANDIDATE → AUTOMATED]
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\test-documentation\SKILL.md` · phase: `unknown` · extraction strategy: B

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
