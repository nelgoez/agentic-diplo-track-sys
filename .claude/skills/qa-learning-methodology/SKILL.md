---
name: qa-learning-methodology
description: '4-level QA training methodology: Level 0 (concept-driven, learn WHY), Level 1 (prompt-driven, learn HOW), Level 2 (problem-driven, learn WHAT to test), Level 3 (objective-driven, learn WHAT problems to identify). Triggers on: `qa training`, `qa learning`, `concept-driven learning`, `prompt-driven learning`, `problem-driven learning`, `objective-driven learning`, `nivel 0`, `nivel 1`, `nivel 2`, `nivel 3`, `qa methodology`, `training generator`. Do NOT use for: feature implementation (use `/sprint-development`), test automation (use `/kata-architecture`), or production testing (use `/shift-right-testing`).'
license: MIT
compatibility: [claude-code, opencode]
phase: training
---

# QA Learning Methodology — 4-Level Progressive Training

`qa-learning-methodology` defines a 4-level progressive learning system for QA training, from fundamental concepts to architectural analysis. Each level generates 3 artifacts: analysis, exercise, and answers.

Source content migrated from:
- `.prompts/QA-learning-methodology/` (LEVEL0 through LEVEL3 generators)

---

## Dependencies

Requires `agentic-dev-core`. Composes with all testing skills (content for practice exercises).

---

## Learning Hierarchy

```
LEVEL 3: OBJECTIVE-DRIVEN LEARNING (Meta-game)
══════════════════════════════════════════════
Input:  System / Complete Architecture
Generates: OBJECTIVE (Epic/Feature)
Student learns: WHAT problems to identify
                  │
                  ▼
LEVEL 2: PROBLEM-DRIVEN LEARNING (Macro-game)
══════════════════════════════════════════════
Input:  Need/Objective (Epic/Feature)
Generates: PROBLEM (User Story)
Student learns: WHAT to test (design test plan)
                  │
                  ▼
LEVEL 1: PROMPT-DRIVEN LEARNING (Micro-game)
══════════════════════════════════════════════
Input:  Problem (User Story)
Generates: CONSIGNAS (instructions/test cases)
Student learns: HOW to execute tests
                  │
                  ▼
LEVEL 0: CONCEPT-DRIVEN LEARNING (Base-game)
══════════════════════════════════════════════
Input:  Specific instruction (consigna)
Generates: CONCEPTOS (theory, fundamentals, reasons)
Student learns: WHY it's done that way
```

**Learning flow:** Level 0 → Level 1 → Level 2 → Level 3

---

## Level 0: Concept-Driven Learning

**Purpose**: Build theoretical foundations. Student understands WHY things are done a certain way.

**Input**: A specific instruction/consigna (e.g., "Make a GET request to /api/users and verify status code is 200")

**3 Outputs per exercise:**
1. **Analysis** (`[area]-conceptos-analisis.md`): The consigna, solution breakdown, and all concepts needed
2. **Quiz** (`[area]-conceptos-quiz.md`): 6-10 multiple-choice questions testing concept understanding
3. **Answers** (`[area]-conceptos-respuestas.md`): Correct answers with detailed explanations

**Knowledge areas**: API Testing (REST, HTTP, status codes, headers, auth, JSON), Database Testing (SQL, CRUD, JOINs, constraints), UI Testing (DOM, selectors, events, states, waits), General QA (test types, coverage, positive/negative, edge cases)

**Target**: Trainees building solid foundations.

---

## Level 1: Prompt-Driven Learning

**Purpose**: Develop execution skills. Student learns HOW to run tests.

**Input**: A Problem (User Story, Technical Story, or Technical Debt) with Acceptance Criteria

**3 Outputs per exercise:**
1. **Analysis** (`[tipo]-testing-analisis.md`): How consignas were derived from ACs and test cases
2. **Consignas** (`[tipo]-testing-consignas.md`): Instructions for the student to execute (no solutions)
3. **Answers** (`[tipo]-testing-respuestas.md`): Complete solutions with explanations

**Progressive difficulty per area:**
- **DB**: SELECT → WHERE → JOIN → COUNT/GROUP BY → INSERT → UPDATE → DELETE → Subqueries → Transactions → RLS
- **API**: GET → Status 200 → POST → Response structure → Headers → Error codes → Auth → PUT/PATCH → DELETE → Schema validation
- **UI**: IDs → data-testid → Click/type → Text assertions → Attributes → States → Forms → Navigation → Complex selectors → Waits → Empty states → Responsive

**Target**: Junior QA Engineers practicing execution.

---

## Level 2: Problem-Driven Learning

**Purpose**: Develop test design skills. Student learns WHAT to test (design test plans).

**Input**: A Need/Objective (Epic/Feature). Two modes: Generate new User Story or Select existing from backlog.

**3 Outputs per exercise:**
1. **Analysis** (`[epic-key]-testing-analisis.md`): Epic context, architecture, risks
2. **Problem** (`[epic-key]-testing-problema.md`): The User Story with ACs, technical info, and student task
3. **Answers** (`[epic-key]-testing-respuestas.md`): Complete reference test plan

**Student deliverables**: Testing strategy (what types needed and why), test cases by type with priority, test data requirements, AC coverage mapping.

**Evaluation criteria**: Coverage, prioritization, specificity, justification, AC mapping.

**Target**: Mid-level QA Engineers developing analytical thinking.

---

## Level 3: Objective-Driven Learning

**Purpose**: Develop requirements analysis skills. Student learns WHAT problems (stories) exist within a goal.

**Input**: A System/Context (full architecture, DB schema, APIs, UI). Two modes: Generate new Epic or Select existing from backlog.

**3 Outputs per exercise:**
1. **Analysis** (`[sistema]-objetivo-analisis.md`): System overview, architecture, DB, APIs, UI, existing epics
2. **Objective** (`[sistema]-objetivo-necesidad.md`): The Epic/Feature to analyze
3. **Answers** (`[sistema]-objetivo-respuestas.md`): Complete decomposition into user stories

**Student deliverables**: User stories with ACs, prioritization, complexity estimates, dependency map, implementation order.

**Evaluation criteria**: Coverage, granularity, independence, clarity, prioritization, QA thinking (risks).

**Target**: QA Leads, Test Analysts, QA Architects.

---

## Artifact Naming Convention

| Level | Area | Files |
|-------|------|-------|
| Level 0 | API | `api-conceptos-analisis.md`, `api-conceptos-quiz.md`, `api-conceptos-respuestas.md` |
| Level 0 | DB | `db-conceptos-analisis.md`, `db-conceptos-quiz.md`, `db-conceptos-respuestas.md` |
| Level 0 | UI | `ui-conceptos-analisis.md`, `ui-conceptos-quiz.md`, `ui-conceptos-respuestas.md` |
| Level 1 | DB | `db-testing-analisis.md`, `db-testing-consignas.md`, `db-testing-respuestas.md` |
| Level 1 | API | `api-testing-analisis.md`, `api-testing-consignas.md`, `api-testing-respuestas.md` |
| Level 1 | UI | `ui-testing-analisis.md`, `ui-testing-consignas.md`, `ui-testing-respuestas.md` |
| Level 2 | Epic | `{epic-key}-testing-analisis.md`, `{epic-key}-testing-problema.md`, `{epic-key}-testing-respuestas.md` |
| Level 3 | System | `{sistema}-objetivo-analisis.md`, `{sistema}-objetivo-necesidad.md`, `{sistema}-objetivo-respuestas.md` |
