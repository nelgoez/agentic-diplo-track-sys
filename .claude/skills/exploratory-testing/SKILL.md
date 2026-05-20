---
name: exploratory-testing
description: 'Orchestrates manual exploratory testing on deployed features: smoke tests, UI/API/DB Trifuerza exploration, bug reporting, and test session summaries. Triggers on: `exploratory testing`, `smoke test`, `Trifuerza testing`, `manual test session`, `bug report`, `test report`. Do NOT use for: shift-left test planning (use `/sprint-development`), test documentation (use `/test-documentation`), test automation (use `/kata-architecture`), or unit testing (use `/unit-testing`).'
license: MIT
compatibility: [claude-code, opencode]
phase: testing
---

# Exploratory Testing — Manual Testing on Deployed Features

`exploratory-testing` orchestrates the manual validation of features deployed to staging: smoke tests to confirm deployment health, deep exploratory sessions using the Trifuerza methodology (UI + API + DB), structured bug reporting, and session summary reports.

This skill runs **after** shift-left test planning (`.prompts/fase-5-shift-left-testing/`) and **before** formal test documentation (`.prompts/fase-11-test-documentation/`) and automation (`.prompts/fase-12-test-automation/`).

---

## Dependencies

Requires `agentic-dev-core`. Source content migrated from:
- `.books/fase-10-exploratory-testing/exploratory-testing.MANUAL.md`
- `.prompts/fase-10-exploratory-testing/` (smoke-test.md, exploratory-test.md, bug-report.md, test-report.md, exploratory-api-test.md, exploratory-db-test.md)

---

## Key Concepts

### Trifuerza Testing: 3-Layer Validation

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│     UI      │  │     API     │  │     DB      │
│  Testing    │  │  Testing    │  │  Testing    │
│             │  │             │  │             │
│  Browser    │  │  Postman    │  │   DBeaver   │
│  DevTools   │  │  cURL       │  │   SQL       │
└─────────────┘  └─────────────┘  └─────────────┘
     User            Contracts       Data
   Experience        API, RLS      Integrity
```

### Smoke Test vs Exploratory Testing
| Aspect | Smoke Test | Exploratory Testing |
|--------|-----------|-------------------|
| Duration | 5-10 min | 60-90 min |
| Goal | Validate deployment | Find bugs & edge cases |
| Coverage | Happy path only | Happy + edge + negative |

### Session-Based Testing
- **Charter**: What to explore and why (pre-defined scope)
- **Time-box**: 30-45 min max per session
- **Session Notes**: Document findings as you explore

### Severity Levels
| Level | Criterion | Examples |
|-------|-----------|----------|
| Critical | Core blocked, no workaround | Login broken, checkout fails |
| High | Major feature broken, difficult workaround | Search returns wrong results |
| Medium | Easy workaround exists | Sorting broken but filtering works |
| Low | Cosmetic, no functional impact | Typo, alignment glitch |

---

## Workflow

### Stage 1: Smoke Test (5-10 min)
Run immediately post-deploy to validate basic functionality:
1. **Basic Access**: App loads without 500 errors, no console errors, assets load
2. **Authentication** (if applicable): Login, session persistence, logout
3. **Story Happy Path**: From acceptance criteria
4. **Backend Integration**: API calls return 200, data persists on refresh

**FAILED smoke test = STOP.** Report blocker, do not continue.

### Stage 2: UI Exploratory Testing (30-45 min)
Create a Test Charter, then explore using:
- **Boundary Testing**: Empty, min, max, special characters
- **State Testing**: Refresh, back button, multiple tabs, timeout, offline
- **Data Validation**: Invalid formats, weak passwords, duplicates, concurrent edits

### Stage 3: API Exploratory Testing (30-45 min)
Test endpoints directly using Postman/cURL:
- Contract validation (status codes, response schema)
- RLS Policy testing (multi-tenant data isolation)
- Error handling (no auth, expired token, invalid data)

**Critical**: If RLS fails = CRITICAL security bug.

### Stage 4: Database Testing (20-30 min)
Verify data integrity directly via SQL:
- Post-operation data verification
- Trigger/calculation accuracy checks
- Data integrity checks (orphaned records, invalid values)
- Constraint testing (FK, CHECK, UNIQUE violations)

### Stage 5: Bug Reporting
Structure for every bug:
- Title format: `<EPICNAME>: <COMPONENT>: <ISSUE_SUMMARY>`
- Error Type: Functional/Visual/Content/Performance/Crash/Data/Integration/Security
- Severity + Environment + Steps to Reproduce + Expected vs Actual + Evidence

### Stage 6: Session Summary
Generate test report covering: overall status, scenarios tested, issues found per layer (UI/API/DB), recommendations for automation, next steps.

---

## Tool Resolution

| Tag | Primary | Fallback |
|-----|---------|----------|
| `[AUTOMATION_TOOL]` | `/playwright-cli` | MCP Playwright |
| `[API_TOOL]` | curl + OpenAPI types | Postman manual |
| `[DB_TOOL]` | Supabase MCP | raw SQL via Supabase CLI |
| `[ISSUE_TRACKER_TOOL]` | `/acli` | MCP Atlassian |
