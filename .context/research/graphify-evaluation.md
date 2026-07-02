# Evaluation: graphify as Knowledge-Graph Tooling for agentic-* Boilerplate Projects

> **Prepared for**: Course Administration — Proof of Concept
> **Scope**: Any project scaffolded from `agentic-dev-boilerplate` or `agentic-qa-boilerplate`
> **Date**: 2026-06-12
> **Status**: Draft for evaluation

---

## 1. Executive Summary

[graphify](https://github.com/safishamsi/graphify) (MIT, 66k★, YC S26) converts any codebase folder into a **persistent, queryable knowledge graph**. Code extracted **100% locally** via tree-sitter (36 language grammars). Docs/PDFs/images optionally enriched via LLM (Claude, Gemini, Ollama, OpenAI, etc.). Output: interactive HTML viz + `graph.json` + markdown report with community detection, god-node analysis, and edge confidence labels.

**Key finding**: Projects based on either `agentic-dev-boilerplate` or `agentic-qa-boilerplate` are an **ideal use case** because:

- They are **document-heavy** (800+ `.md` files per project: PRDs, SRSs, business maps, PBI artifacts, skill docs, test plans). graphify's 71.5× token reduction on mixed corpora directly addresses AI context-window limits.
- They are **AI-orchestrated** — built for agents (OpenCode, Claude Code, Cursor). graphify natively integrates with these platforms via `graphify install --platform <name>`.
- They follow a **consistent three-dot layout** (`.context/`, `.agents/`, `.claude/`). A single graphify config covers any boilerplate child.

---

## 2. Candidate Projects

### 2.1 Boilerplate Templates

| Boilerplate | Repo | Creates | Scaffolder |
|-------------|------|---------|------------|
| `agentic-dev-boilerplate` | `github.com/upex-galaxy/agentic-dev-boilerplate` | Full-stack dev projects | `bunx create-agentic@latest` |
| `agentic-qa-boilerplate` | `github.com/upex-galaxy/agentic-qa-boilerplate` | QA/test-automation projects | `bunx create-agentic-qa@latest` |

### 2.2 Child Projects (Current UPEX Galaxy)

| Child Project | Boilerplate Parent | Purpose | Language | Size |
|--------------|-------------------|---------|----------|------|
| `agentic-diplo-track-sys` | `agentic-dev-boilerplate` | Diploma Tracking System (API + DB + auth) | TypeScript, Bun | ~1,195 files |
| `bunkai-qa-engineering` | `agentic-qa-boilerplate` | QA automation (Playwright + KATA + Allure) | TypeScript, Bun | ~955 files |
| `upex-bunkai-tms` | `agentic-dev-boilerplate` | Test Management System (Next.js + Supabase) | TypeScript, Bun | ~986 files |
| `automation-demo` | `agentic-qa-boilerplate` | Demo/example automation suite | TypeScript | — |

All share the same architectural DNA: `.context/`, `.agents/`, `.claude/` three-dot layout, Bun runtime, Jira sync pipeline, MCP tooling, and `opencode.jsonc` AI agent config.

---

## 3. What graphify Solves

| Problem | Without graphify | With graphify |
|---------|-----------------|---------------|
| AI loses context between sessions | Each session starts cold | Graph persists — query across sessions |
| Large repos exceed context windows | Must dump 50+ files into prompt | Returns only relevant subgraph (71.5× reduction) |
| Cross-file relationships invisible | grep finds strings, not meaning | Edge-tagged relationships: `calls`, `imports`, `uses`, `implements` |
| Multi-modal unification | Code in one tool, docs in another, DB schema in a third | All live in one graph with confidence labels (`EXTRACTED`/`INFERRED`/`AMBIGUOUS`) |
| Team knowledge silos | Each dev rebuilds mental model | Graph committed to git, auto-merged on commit |

---

## 4. Architecture

```
detect() → extract() → build_graph() → cluster() → analyze() → report() → export()
```

| Stage | What it does | Boilerplate-specific value |
|-------|-------------|---------------------------|
| `detect` | Scans dir tree, filters by gitignore + extension rules | Picks up `.context/`, `.agents/`, `.claude/` automatically |
| `extract` | Code → tree-sitter AST → nodes+edges. Non-code → optional LLM → semantic nodes+edges | TypeScript skill files → function-level nodes. Markdown → semantic concept nodes |
| `build` | Merges per-file extractions into single `nx.Graph` | Creates unified graph from docs + scripts + config |
| `cluster` | Leiden community detection → groups related nodes | Auto-clusters by domain (auth, enrollment, testing, etc.) |
| `analyze` | Finds god nodes, surprising connections, import cycles | Surfaces hidden coupling between seemingly unrelated `.context/` docs and scripts |
| `report` | Generates `GRAPH_REPORT.md` with findings | Human-readable summary for course evaluators |
| `export` | Writes `graph.html` (D3.js), `graph.json`, wiki, Neo4j | Interactive viz for presentations |

---

## 5. Integration with Boilerplate Projects

### 5.1 Per-Project Install

```bash
# One-time: install Python tool
uv tool install graphifyy

# Per project: register with the AI assistant
graphify install --platform opencode   # if using OpenCode
graphify install --platform claude     # if using Claude Code

# Build the graph (code-only, zero API cost)
graphify extract . --code-only

# Or build with semantic enrichment (needs LLM key)
graphify extract . --backend gemini --model gemini-2.5-pro-preview

# Set up git hooks for auto-rebuild
graphify hook install
```

### 5.2 AI Agent Workflow

After `graphify install`, the AI assistant gains slash commands:

| Command | Example | What it does |
|---------|---------|-------------|
| `/graphify .` | Build/rebuild graph | Scans project and generates all outputs |
| `/graphify query` | `"what entities does enrollment touch?"` | Returns subgraph matching query |
| `/graphify neighbors` | `"User" --depth 2` | Shows nodes within N hops of concept |
| `/graphify path` | `"AuthMiddleware" "Certificate"` | Shortest path between two nodes |
| `/graphify explain` | `"RateLimiter"` | Detailed explanation of a node and its connections |

### 5.3 Git Workflow

```bash
# Option A: Commit graph for team (recommended)
# Add to .gitignore is OPTIONAL — if omitted, graph is shared
# Install merge driver for parallel edits:
graphify merge-driver install
git add graphify-out/graph.json
git commit -m "chore: add project knowledge graph"

# Option B: Ignore graph, rebuild per-dev (add to .gitignore)
echo "graphify-out/" >> .gitignore
```

### 5.4 Cross-Project Global Graph

```bash
# Link all projects into one queryable super-graph
graphify global add graphify-out/graph.json diplo-track-sys
graphify global add graphify-out/graph.json bunkai-qa-engineering
graphify global add graphify-out/graph.json upex-bunkai-tms

# Query across all projects
graphify query "trace certificate data from Moodle sync to student dashboard"
```

---

## 6. Technology Fit Matrix

### 6.1 By File Type

| Boilerplate Content | Language | Tree-Sitter | LLM Needed? | Extraction Quality |
|--------------------|----------|------------|-------------|-------------------|
| `.context/*.md` | Markdown | ✅ Built-in | ✅ (semantic) | High |
| `.agents/*.yaml` | YAML | ✅ | ❌ | High (AST) |
| `.claude/skills/*.md` | Markdown | ✅ | ✅ (semantic) | High |
| `scripts/*.ts` | TypeScript | ✅ | ❌ | High (AST) |
| `cli/*.ts` | TypeScript | ✅ | ❌ | High (AST) |
| `package.json` | JSON | ✅ | ❌ | High (AST) |
| `opencode.jsonc` / `.mcp.json` | JSON | ✅ | ❌ | High (AST) |
| `CLAUDE.md`, `AGENTS.md` | Markdown | ✅ | ✅ (semantic) | High |
| `eslint.config.js` | JavaScript | ✅ | ❌ | High (AST) |
| `.github/workflows/*.yml` | YAML | ✅ | ❌ | High (AST) |

**agentic-qa-boilerplate extras**:

| QA-Specific Content | Language | Tree-Sitter | LLM Needed? |
|--------------------|----------|------------|-------------|
| `tests/**/*.ts` (Playwright) | TypeScript | ✅ | ❌ |
| `playwright.config.ts` | TypeScript | ✅ | ❌ |
| `allurerc.mjs` | JavaScript | ✅ | ❌ |
| `config/variables.ts` | TypeScript | ✅ | ❌ |
| `.xray/` configs | YAML/JSON | ✅ | ❌ |

**Conclusion**: 100% of boilerplate content across both templates is extractable. Code files are free (tree-sitter). Markdown files need LLM for semantic relationships (or skip with `--code-only`).

---

## 7. Proof of Concept Plan

### Phase 1 — Single-project smoke test (1 hour)

**Goal**: Verify graphify works end-to-end on one boilerplate child.

1. Ensure Python ≥3.10: `python --version`
2. Install: `uv tool install graphifyy`
3. Pick one project (e.g., `agentic-diplo-track-sys`)
4. Build code-only graph: `graphify extract . --code-only`
5. Inspect outputs:
   - `graphify-out/graph.html` — open in browser, confirm interactive viz
   - `graphify-out/GRAPH_REPORT.md` — review god nodes, clusters, surprises
   - `graphify-out/graph.json` — confirm file exists and is valid

### Phase 2 — AI agent integration (30 min)

1. Register: `graphify install --platform opencode`
2. Test slash commands in OpenCode:
   - `/graphify query "what entities does enrollment touch?"`
   - `/graphify neighbors "MPV Scope" --depth 2`
   - `/graphify path "User" "Certificate"`
3. Verify token savings by comparing context dump vs graph query

### Phase 3 — Multi-project global graph (1 hour)

1. Build graphs for all 3 child projects
2. Create global graph:
   ```bash
   graphify global add graphify-out/graph.json dts
   graphify global add graphify-out/graph.json bunkai-qa
   graphify global add graphify-out/graph.json bunkai-tms
   ```
3. Test cross-project query: `graphify query "trace test coverage for enrollment API"`
4. Measure: is the global query returning nodes from all 3 repos?

### Phase 4 — Semantic enrichment test (optional, 30 min)

1. Configure an LLM backend (Ollama is free; Gemini free tier works)
2. Rebuild with semantics: `graphify extract . --backend gemini --model gemini-2.5-flash-preview`
3. Compare `GRAPH_REPORT.md` from code-only vs semantic build
4. Evaluate: did semantic edges add meaningful connections?

### Phase 5 — Presentation artifact (1 hour)

1. Capture screenshots of `graph.html` interactive graph
2. Extract key findings from `GRAPH_REPORT.md` (god nodes, community clusters)
3. Record a 2-min demo: `/graphify query` in OpenCode returning structured results
4. Package as evaluation deliverable

---

## 8. Estimated Cost

| Scenario | Backend | Cost | Notes |
|----------|--------|------|-------|
| Code-only (Phase 1) | None (tree-sitter) | **$0** | Recommended for initial POC |
| Semantic (Ollama local) | Local GPU/CPU | **$0** | Needs local model |
| Semantic (Gemini) | Google API | ~$0.30–$0.80 | Free tier may cover first build |
| Semantic (Claude) | Anthropic API | ~$0.50–$1.50 | Per full graph build |
| Semantic (OpenAI GPT-4o) | OpenAI API | ~$2–$5 | Most expensive |

For the POC, **code-only is sufficient and costs nothing**.

---

## 9. Comparison with Alternatives

| Criterion | graphify | grep/rg | IDE Search | MCP file-read |
|-----------|----------|---------|------------|--------------|
| Cross-file relationships | ✅ Edges | ❌ Strings | ❌ No graph | ❌ Linear |
| Persistent across sessions | ✅ JSON | ❌ | ❌ | ❌ |
| Token-reduced context | ✅ 71.5× | ❌ Raw | ❌ Raw | ❌ Raw |
| Multi-modal (code+docs+DB) | ✅ | ❌ | ❌ | ❌ |
| Team-shareable | ✅ Git | ❌ | ❌ | ❌ |
| Install complexity | Medium (Python) | Low | None | Low |
| AI-agent native | ✅ Slash cmds | ❌ | ❌ | ✅ MCP |

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Python ≥3.10 not installed | High, blocks install | Add `uv python install 3.12` to project bootstrap scripts |
| LLM costs for semantic extraction | Low | `--code-only` flag eliminates all API costs; Ollama backend is free |
| Large `graph.json` in git history | Medium | Add `graphify-out/` to `.gitignore` and use CI-only builds; or use git LFS |
| Pre-1.0 API churn | Low | Pin graphifyy version in install script; follows semver |
| Windows path quirks | Low | tree-sitter ships Windows wheels; `graphify .` (no leading `/`) in PowerShell |
| Student evaluators not familiar with Python tooling | Medium | Include `uv` in bootstrap; document exact steps in README |

---

## 11. Recommendation

**Adopt graphify as standard tooling for all projects derived from either boilerplate.** Specifically:

1. **Include installation in bootstrap** — add `uv tool install graphifyy` and `graphify install --platform opencode` to each project's `cli/install.ts` or `INSTALLER.md`
2. **Default to code-only builds** — zero cost, covers 90% of use cases. Semantic enrichment is opt-in.
3. **Commit `graph.json` to production repos** — team sharing via git auto-merge driver
4. **CI-driven graph rebuild** — add a GitHub Actions step to rebuild graph on push to main (free, tree-sitter only)
5. **Document in each project's `CLAUDE.md`** — add a section telling AI agents the graph exists and how to query it
6. **Cross-project super-graph** — link all UPEX projects for end-to-end traceability (e.g., "how does a Moodle certificate sync flow through to the KATA test suite?")

This transforms each boilerplate's document-heavy orchestration layer from a context-budget liability into a structured, queryable asset that persists across every AI session — for the lifetime of the project.

---

## 12. References

- [graphify GitHub](https://github.com/safishamsi/graphify) — MIT license, v0.8.39+
- [graphify labs](https://graphifylabs.ai) — official site
- [agentic-dev-boilerplate](https://github.com/upex-galaxy/agentic-dev-boilerplate) — dev project template
- [agentic-qa-boilerplate](https://github.com/upex-galaxy/agentic-qa-boilerplate) — QA project template
- `uv tool install graphifyy` — recommended install command

---

*Generated as part of graphify evaluation for UPEX Galaxy boilerplate projects.*
