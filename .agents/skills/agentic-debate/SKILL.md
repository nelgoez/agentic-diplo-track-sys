---
name: agentic-debate
description: Multi-agent role-play for structured decisions — dispatches 2-3 AI agents with Tavily/Context7 research, then synthesizes a recommendation with comparison table
---

# Agentic Debate — Multi-Agent Role-Play for Decisions

A structured, research-backed debate between 2–3 AI agents, each defending a different approach to a decision. Each agent researches independently via Tavily (web) and Context7 (library docs), presents arguments with sources, then the orchestrator synthesizes a recommendation.

Triggers: `/agentic-debate`, `debate this`, `run a debate between agents`, `multi-agent debate`

## Workflow

### Phase 1 — Setup

1. Understand the decision scope (1–2 clarifying questions max)
2. Define 2–3 distinct options (A, B, C)
3. Create one agent persona per option:

| Agent | Personality | Focus |
|-------|-------------|-------|
| **A — Pragmatic** | Direct, efficient, hates overhead | Speed, simplicity, ROI |
| **B — Architect** | Ambitious, scales-thinking | Correctness, future-proofing |
| **C — Strategist** | Balanced, value/effort optimizer | Sweet spot, pragmatism |

Customize personalities as needed for the specific decision.

### Phase 2 — Research Round

Dispatch one subagent per option in parallel. Each receives:
- The full context (project, stack, options)
- 3–4 research queries specific to their argument
- Instructions to return arguments with sources in ≤350 words

Available research tools:
- **Tavily**: web search for news, blog posts, general information
- **Context7**: library documentation for frameworks, APIs, SDKs (use `context7_resolve-library-id` + `context7_query-docs`)

**Subagent prompt template:**

```
You are Agent {LABEL} — {PERSONALITY}.
Context: {full project and decision context}
Your position: DEFEND Option {LABEL} ({short description}).
Research tools available:
  - Tavily (web search): use for news, articles, market data
  - Context7 (docs): use for framework/library documentation and API references
Queries: {QUERIES}
Return your arguments with sources in ≤350 words.
```

All agents MUST use at least 2 real research queries across Tavily/Context7. No invented data. Each returns sources (URLs) with their claims.

### Phase 3 — Synthesis

After all agents respond, present a comparison table:

| Criterion | Option A | Option B | Option C |
|-----------|----------|----------|----------|
| Effort | estimate | estimate | estimate |
| Key data | sourced fact | sourced fact | sourced fact |
| Risk | identified | identified | identified |

Then highlight:
- Where all agents agree (common ground)
- Where they differ (key tradeoffs)
- The data points that tip the scale
- Your final recommendation

### Phase 4 — User Decision

Present the options with your recommendation and wait for user choice before implementing.

## Rules

- Each agent MUST use at least 2 real research queries (Tavily web search + Context7 library docs)
- Each agent returns sources (URLs) with their claims
- No agent concedes before the synthesis phase
- Final recommendation is YOURS (the orchestrator), not the agents'
- Total rounds: max 2 (research → debate → optional rebuttal → decision)
- Do NOT invoke any implementation skill until the user approves a path

## Example

Decision: Which i18n approach for a Next.js portfolio?
- A: Spanish-only UI, English blog
- B: Full next-intl, everything bilingual
- C: Hybrid (bilingual UI, English blog, bilingual CV)
- Outcome: Hybrid with next-intl
