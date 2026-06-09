# Skill Registry (auto-generated)

> Generated: `2026-06-09T01:28:16.403Z`
> Generator: `bun scripts/build-skill-registry.ts`
> Protocol: `.claude/skills/agentic-dev-core/references/skill-resolver.md`

This file is the per-session compact-rules cache for the Skill Resolver protocol.
The orchestrator copies one or more `## Skill: <slug>` blocks below into every subagent briefing under `## Project Standards (auto-resolved)`.
Subagents trust those compact rules and only read the full SKILL.md when explicitly instructed.

Skills indexed: 22

---
## Skill: acli

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: acli
- description: "Atlassian CLI (official `acli` binary, v1.3+ as of 2026) for Jira Cloud, Confluence Cloud, and org admin tasks from the terminal. Use whenever the user wants to create, view, edit, transition, assign, clone, archive, comment on, link, or bulk-operate on Jira work items; list or manage projects, boards, sprints, filters, dashboards, or custom-field definitions; create or update Confluence spaces, pages, or blog posts; activate/deactivate users at the org level; or authenticate to Atlassian from a shell or CI pipeline. Triggers on: `acli`, Atlassian CLI, Jira from the terminal, Confluence from the terminal, bulk Jira operations, scripting Jira, automate Jira tickets, transition a bunch of issues, create issues from a JSON/CSV file, CI pipeline that touches Jira, log in to Jira CLI, switch Atlassian sites, API-token auth for Jira. Use this skill even when the user does not say the word `acli` — if the task is CLI-driven Jira or Confluence work, this is the right tool. Do NOT use for: Atlassian MCP server work (that is a different integration), REST-API-only workflows where no CLI is involved, Bitbucket command-line needs (acli does not cover Bitbucket yet), or the legacy Appfire/Bob Swift `acli` tool (a different product that happens to share the binary name). The Atlassian MCP server is OPT-IN, documented in docs/mcp/."
- license: MIT
- compatibility: [claude-code, cursor, codex, opencode]
- allowed-tools: Bash(acli:*)
- complementary_categories: [issue-tracker]
- ---
- `acli` is Atlassian's official command-line tool for Jira Cloud, Confluence Cloud, and org admin operations. It replaces terminal-based Jira automation that previously required raw REST calls, and unifies Jira + Confluence + admin actions behind one binary with one credential store per product.
- This skill teaches how to drive `acli` for any intent: one-off commands, batch mutations, scripted pipelines, and CI jobs. **Repo-specific integration** (how this skill plugs into the host repo's workflow, TMS modality, project conventions, anti-patterns) lives in the companion file `<repo-core>/references/acli-integration.md` — load it on demand. See "Navigation" below.
- `acli` has several traits that make it easy to misuse:
- 1. **Silent pagination truncation.** `workitem search` without `--paginate` returns the first page only — no warning. Scripts that count or iterate keys read the wrong number of items.
- 2. **Auth is per-product.** `acli jira auth login` does not authenticate `acli admin`, `acli confluence`, or `acli rovodev`. There is also a top-level `acli auth` for global OAuth (newer surface). Each scope has its own session.
- 3. **The "work item" vs "issue" split.** The CLI renamed commands (`jira issue` → `jira workitem`) but the JSON response still has a top-level `issues[]` array and CSV inputs still use `issueType`/`parentIssueId` spellings. Mixing old and new terminology in the same script works, but confuses readers.
- 4. **Unknown subcommands fail silently.** Typing `acli jira workflow --help` does NOT error — it falls back to `acli jira --help` with exit 0. So "no error" ≠ "command exists". Always verify by checking the help body actually changed.
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\acli\SKILL.md` · phase: `unknown` · extraction strategy: B

---

## Skill: agentic-dev-core

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: agentic-dev-core
- description: 'Foundation skill that hosts shared references cited by other workflow skills (briefing template, dispatch patterns, orchestration doctrine, skill composition strategy, behavioral layer, model routing, skill resolver, topic-key conventions, TypeScript patterns). Loaded on demand by `sprint-development`, `unit-testing`, `project-foundation`, `project-bootstrap`, `product-management`, `testability-guide`, `agentic-dev-onboard`. Do NOT use for: syncing project memory facts (use `/sync-ai-memory`), onboarding project discovery (use `/agentic-dev-onboard`), or test framework adaptation (testing-only, not in scope).'
- license: MIT
- compatibility: [claude-code, copilot, cursor, codex, opencode]
- phase: foundation
- complementary_categories:
- - language
- ---
- `agentic-dev-core` is the shared reference library that every workflow skill in this repo cites. It exists so doctrine (briefing template, dispatch patterns, orchestration rules, skill composition tiers, behavioral layer, model routing, topic-key conventions, TypeScript patterns) lives in one place instead of being duplicated across every `SKILL.md`.
- Loading a workflow skill (e.g. `sprint-development`, `unit-testing`, `project-foundation`, `project-bootstrap`, `product-management`, `testability-guide`) implies loading the relevant `agentic-dev-core/references/*.md` on demand — workflow skills declare a `## Dependencies` block at the top so the AI knows what to pull in.
- This skill does NOT orchestrate workflows, does NOT generate files, and does NOT bootstrap a target repo. The entire framework (skills, foundation files, scripts) ships together as one repo; à la carte adoption is not supported — see "Install model" below.
- ---
- When a skill cites one of these, it includes a Dependencies block at the top (see next section) so the AI knows to load `agentic-dev-core` before continuing.
- ---
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\agentic-dev-core\SKILL.md` · phase: `unknown` · extraction strategy: B

---

## Skill: agentic-dev-onboard

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: agentic-dev-onboard
- description: "Walks new users through this repo's dev flow — Next.js + Supabase stack, Jira workflow (Ready For Dev → In Progress → In Review → Ready For QA), /sprint-development for ticket-driven work, MCPs available (Tavily, Context7, Supabase, n8n, Atlassian), critical env vars, Critical Rule #12 (READ package.json DIRECTLY). Triggers on: `onboard me`, `explain this repo`, `first time using this`, `primer vez en este repo`, `/agentic-dev-onboard`. Do NOT use for: feature implementation (use /sprint-development), test design (use /unit-testing), backlog refinement (use /product-management)."
- license: MIT
- compatibility: [claude-code, opencode]
- phase: foundation
- complementary_categories: []
- ---
- <!-- Model preferences (advisory; dispatchers may use to route) -->
- <!--
- model_preferences:
- foundation: opus       # high-leverage architectural work
- planning: sonnet       # structured writing
- implementation: sonnet # default for code work
- review: opus           # critical analysis
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\agentic-dev-onboard\SKILL.md` · phase: `unknown` · extraction strategy: B

---

## Skill: design-system

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: design-system
- description: 'Genera un DESIGN.md (formato Google Labs Apache-2.0) en el root del proyecto antes del scaffolding del frontend. Cinco caminos: default automatizable (npx getdesign + LLM-matcher elige 1 de 72 brands según Constitution+PRD), manual gallery (designmd.ai/explore), Open Design app local (docker), Claude Design (claude.ai/design premium), LLM-authored custom. Triggers: `/design-system`, `definir design system`, `crear DESIGN.md`, `establecer paleta de colores`, `branding del proyecto`, `rebrandear el proyecto`, `set up theme tokens`, `generate design system`, `elegir paleta`, `setup design tokens`. Composable con /project-foundation (la invoca post-PRD, pre-SRS) y /project-bootstrap (consume el DESIGN.md en frontend-setup). Do NOT use for: scaffolding del frontend code (use /project-bootstrap), definir PRD/personas (use /project-foundation), implementación de componentes UI (use frontend-design community skill), o per-story dev (use /sprint-development).'
- license: MIT
- compatibility: [claude-code, copilot, cursor, codex, opencode]
- phase: foundation
- complementary_categories:
- - frontend-ui
- - accessibility
- ---
- <!-- Model preferences (advisory; dispatchers may use to route) -->
- <!--
- model_preferences:
- foundation: opus       # design decisions benefit from strong reasoning
- matcher: sonnet        # mechanical brand selection
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\design-system\SKILL.md` · phase: `unknown` · extraction strategy: B

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

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: git-flow-master
- description: "End-to-end Git operator for any branching strategy. Auto-detects the project's strategy (solo-main, main+integration, enterprise multi-branch, trunk-based, GitFlow, GitHub Flow, GitLab Flow) from .git config, branches, and an CLAUDE.md marker, then adapts every commit, branch, push, PR, conflict-fix, and chained-PR action to that strategy. Use this skill whenever the user wants to: create a branch (`crear branch`, `new feature branch`, `start work on UPEX-123`), commit changes (`commit this`, `commitear esto`, `make a commit`, `commit and push`), push code (`push`, `push to main`, `push to staging`, `subir cambios`), open a pull request (`create PR`, `open PR`, `abrir PR`, `crear pull request`, `gh pr create`), fix merge conflicts (`fix conflict`, `resolver conflicto`, `merge conflict`, `rebase conflict`, `push rejected`), plan stacked or chained PRs (`stack of PRs`, `chained PRs`, `split this PR`, `PR demasiado grande`), set up or bootstrap a branching strategy on a fresh repo (`set up our git strategy`, `bootstrap branching`, `configura el flujo de git`, `git strategy setup`, `materialize the git flow`, `create the staging branch and write the runbook`), or pick / change / set up a branching strategy (`git flow`, `git strategy`, `branching strategy`, `which git flow do we use`, `set up our git strategy`, `bootstrap branching`, `configura el flujo de git`). Trigger even when the user does not say `git-flow-master` literally — if the work is git-or-PR-shaped, this is the right tool. Do NOT use for: implementing features (use /sprint-development), writing tests (use /unit-testing), product backlog refinement (use /product-management), or general code editing — git-flow-master operates strictly on the version-control layer."
- license: MIT
- compatibility: [claude-code, opencode]
- phase: implementation
- complementary_categories: []
- ---
- <!-- Model preferences (advisory; dispatchers may use to route) -->
- <!--
- model_preferences:
- foundation: opus       # high-leverage architectural work
- planning: sonnet       # structured writing
- implementation: sonnet # default for code work
- review: opus           # critical analysis
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\git-flow-master\SKILL.md` · phase: `unknown` · extraction strategy: B

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

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: product-management
- description: "Orchestrates continuous product management work — initial backlog seed from PRD, incremental feature addition, epic creation, story refinement (INVEST + 3-amigos), AC quality refinement (Gherkin), edge-case enumeration, and sprint reporting (PM visibility snapshot). Triggers on: 'create epic', 'crear épica', 'agregar historia al backlog', 'add feature', 'refine acceptance criteria', 'enumerar edge cases', 'INVEST a esta historia', '3 amigos', 'story refinement', 'product backlog seed', 'epic creation', 'ready for development checklist', 'sprint report', 'reporte de sprint', 'estado del sprint', 'reporte de épicas y stories', 'qué hay en el sprint', 'progress report', 'dashboard del backlog', 'in-flight stories snapshot'. Do NOT use for: foundational product definition (use `/project-foundation`), infrastructure scaffolding (use `/project-bootstrap`), per-story implementation (use `/sprint-development`), unit testing (use `/unit-testing`), or formal QA test cases / TMS workflows (out of scope here)."
- license: MIT
- compatibility: [claude-code, copilot, cursor, codex, opencode]
- phase: management
- complementary_categories:
- - issue-tracker
- - creativity
- ---
- <!-- Model preferences (advisory; dispatchers may use to route) -->
- <!--
- model_preferences:
- foundation: opus       # high-leverage architectural work
- planning: sonnet       # structured writing
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\product-management\SKILL.md` · phase: `unknown` · extraction strategy: B

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

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: project-bootstrap
- description: 'Scaffolds the technical infrastructure of a new project: backend (DB schemas, API base, types, error handling), frontend (design system, project skeleton, routing), and incremental features (OpenAPI/Scalar UI, API routes + middleware, bearer-token auth, env vars + URL builders, Supabase types generation). Triggers on: `scaffolding del proyecto`, `setup del backend`, `inicializar el frontend`, `configurar OpenAPI`, `API routes setup`, `bearer token authentication`, `env vars setup`, `supabase types generation`, `infrastructure setup`, `backend skeleton`, `frontend boilerplate`. Do NOT use for: product definition (use `/project-foundation`), backlog seeding (use `/product-management`), per-story development (use `/sprint-development`), unit testing (use `/unit-testing`), or test framework setup (out of scope).'
- license: MIT
- compatibility: [claude-code, copilot, cursor, codex, opencode]
- phase: foundation
- complementary_categories:
- - frontend-framework
- - frontend-ui
- - backend-db
- - runtime
- - language
- - ci-cd
- ---
- <!-- Model preferences (advisory; dispatchers may use to route) -->
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\project-bootstrap\SKILL.md` · phase: `unknown` · extraction strategy: B

---

## Skill: project-foundation

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: project-foundation
- description: 'Orchestrates the foundational definition of a new product/project: Constitution (business model + market context), Architecture (PRD + SRS + API contracts), and Discovery (business data map + API architecture + dev guide). Triggers on: `ideando un nuevo producto`, `define el PRD`, `construir la constitución del proyecto`, `mapear arquitectura del sistema`, `definir SRS`, `user personas`, `user journeys`, `MVP scope`, `business data map`, `api architecture discovery`, `project dev guide`, `constituir el proyecto desde cero`. Do NOT use for: infrastructure scaffolding (use `/project-bootstrap`), backlog seeding (use `/product-management`), per-story development (use `/sprint-development`), unit testing (use `/unit-testing`), or formal QA workflows (out of scope here).'
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

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: sprint-development
- description: "Orchestrates the per-story dev loop end-to-end: Planning -> Implementation -> Code Review -> Staging deploy -> (gated) Production deploy. Mega-orchestrator on the dev side. Drives the 12-step workflow: epic precheck, Jira transitions (Ready For Dev -> In Progress -> In Review -> Ready For QA), impl plan, code, PR, review, docs, merge, staging deploy, optional production deploy with rollback. Triggers on: implementar esta historia, implement this story, trabajar el ticket UPEX-XXX, plan to code to review to deploy, fix this bug and merge, deploy a staging, code review for PR, production deployment, rollback, continue implementation, story-level dev workflow, sprint-development, process sprint N, continue sprint, implement sprint N, sprint-file. Do NOT use for: foundational product definition (use /project-foundation), infrastructure scaffolding (use /project-bootstrap), backlog seeding / AC refinement (use /product-management), unit-testing TDD (use /unit-testing), formal QA testing (out of scope here)."
- license: MIT
- compatibility: [claude-code, copilot, cursor, codex, opencode]
- phase: implementation
- complementary_categories:
- - frontend-ui
- - frontend-framework
- - forms-validation
- - backend-db
- - testing-e2e
- - accessibility
- - seo
- - ci-cd
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\sprint-development\SKILL.md` · phase: `unknown` · extraction strategy: B

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

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: testability-guide
- description: 'Generates a public in-app `/qa` page ("Software Testability Guide for QA") + a tool-agnostic credentials artifact (markdown body) the user publishes to Jira Epic (default), Confluence, Notion, any MCP/CLI-reachable tool, or via manual paste. Idempotent — re-runs detect host-stack drift via a snapshot comment in the generated page and propose surgical patches instead of rewriting. Invoke whenever the user asks to create, update, regenerate, or publish a QA testing guide, testability guide, /qa page, credentials Epic, or says "guía de testeabilidad", "credenciales para testing", "publish credentials artifact", "/testability-guide". Do NOT use for: PRD definition (`/project-foundation`), infrastructure scaffolding (`/project-bootstrap`), per-story implementation (`/sprint-development`), unit testing (`/unit-testing`), or formal QA test cases / TMS workflows (out of scope here).'
- license: MIT
- compatibility: [claude-code, copilot, cursor, codex, opencode]
- phase: foundation-extension
- complementary_categories:
- - frontend-framework
- - frontend-ui
- - issue-tracker
- - testing-e2e
- ---
- <!-- Model preferences (advisory; dispatchers may use to route) -->
- <!--
- model_preferences:
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\testability-guide\SKILL.md` · phase: `unknown` · extraction strategy: B

---

## Skill: unit-testing

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: unit-testing
- description: 'Focused skill for unit-test design — TDD workflow (red-green-refactor), test naming (AAA, Given-When-Then), mocking patterns (mocks/spies/stubs/fakes, dependency injection), and coverage strategy (line vs branch, mutation testing). Composable: invokable standalone (write unit tests for this function, qué mockear aquí, what to mock) or mid-flight from sprint-development for TDD slices. Triggers on: write unit tests, TDD this function, test-driven development, qué mockear aquí, what to mock, test naming, AAA pattern, Given-When-Then, test coverage, branch coverage, Jest, Vitest, unit testing. Do NOT use for: feature implementation orchestration (use /sprint-development), E2E or integration testing (out of scope, see playwright-cli skill), production deploy, or formal QA workflow.'
- license: MIT
- compatibility: [claude-code, copilot, cursor, codex, opencode]
- phase: implementation
- complementary_categories:
- - language
- ---
- <!-- Model preferences (advisory; dispatchers may use to route) -->
- <!--
- model_preferences:
- foundation: opus       # high-leverage architectural work
- planning: sonnet       # structured writing
- implementation: sonnet # default for code work
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\unit-testing\SKILL.md` · phase: `unknown` · extraction strategy: B

---

## Skill: vercel-cli

**Purpose**: (no description in frontmatter)

**Compact Rules**:
- ---
- name: vercel-cli
- description: 'Vercel CLI cookbook for this Next.js + Supabase + Vercel boilerplate. Covers deployment verification (poll by commit SHA + `vercel inspect --wait`), env var sync between `.env` and Vercel scopes (Preview / Production / Development), build and runtime log streaming, rollback, and `.vercel/` project linking detection. Trigger whenever the user runs `vercel`, asks to "check deploy status", "wait until ready", "is my deploy live", "sync env vars to Vercel", "push env to Vercel", "see build logs", "tail Vercel logs", "rollback last deploy", "promote to production", "link this repo to Vercel", or any vercel-CLI-shaped task. Composes with `/deploy-to-vercel` (community skill, owns the deploy method selection) and `/sprint-development` (Stages 9 & 12 own the deploy orchestration). Do NOT use for: choosing a deploy method or doing a first-time link (use `/deploy-to-vercel`), driving the full sprint deploy stage (use `/sprint-development`), reading Supabase as source-of-truth for env values (use Supabase MCP — Vercel only mirrors them), or Bitbucket / Netlify / Cloudflare deployment (out of scope).'
- license: MIT
- compatibility: [claude-code, cursor, codex, opencode]
- allowed-tools: Bash(vercel:*)
- complementary_categories:
- - deploy
- phase: implementation
- ---
- `vercel` is Vercel's official command-line client. In this boilerplate it is the primary verification + env-management surface for our standard stack: **Next.js + Supabase + Vercel + Resend**, with branch-based auto-deploys (`develop` → Vercel Preview / staging, `main` → Vercel Production).
- This skill teaches the operations that live AROUND a deploy — confirming it actually shipped, pushing the right env vars before it ships, tailing logs when it breaks, rolling back when it breaks badly. The act of TRIGGERING a deploy (choosing between git push, `vercel deploy`, or first-time `vercel link`) is owned by the community skill `/deploy-to-vercel`. This skill points at it; it does not duplicate it.
- `vercel` is easy to misuse in three specific ways that have burned past sessions:
- 1. **`vercel ls | grep` is the wrong tool to check whether YOUR deploy is ready.** ANSI color codes break the regex, and the output mixes new and old deploys for the same branch. The canonical "is this exact commit deployed" question has a different answer: `vercel ls -m githubCommitSha=<sha> --format json` to find the URL, then `vercel inspect <url> --wait --timeout=10m` to block until terminal state.
- 2. **`vercel deploy` blocks by default; `vercel inspect` does NOT.** That asymmetry is backwards from intuition and trips agents constantly. Rule: **always pass `--no-wait` to `vercel deploy`** (return URL immediately), **always pass `--wait` to `vercel inspect`** (block until READY / ERROR / CANCELED). See `references/gotchas.md`.
- (truncated — read full SKILL.md for the rest)

**Read full SKILL.md when**: the compact rules above are insufficient (e.g. novel scenario, debugging, or the briefing tells you to load the full skill).

> Source: `.claude\skills\vercel-cli\SKILL.md` · phase: `unknown` · extraction strategy: B
