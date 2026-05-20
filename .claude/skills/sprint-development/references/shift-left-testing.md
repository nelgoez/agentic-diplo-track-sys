# Shift-Left Testing — Test Strategy Before Code

> Reference doc for executing shift-left testing: writing test strategy and acceptance tests before implementation begins.
> Source: `.books/fase-5-shift-left-testing/` + `.prompts/fase-5-shift-left-testing/`

---

## 1. Philosophy

```
TRADITIONAL:        Requirements → Design → Code → TEST → Deploy
                                                    ↑ Testing late, expensive

SHIFT-LEFT:          Requirements → Design → CODE → Test → Deploy
                      ↑ Testing       ↑ Testing
                      early, cheap    integration
```

Cost multiplier: finding a bug in requirements = 1×, in development = 10×, in production = 100×.

## 2. Feature Test Plan (Epic Level)

### Step 1: Business Context Analysis
- **Value Proposition**: What value does this epic enable?
- **Customer Segments**: Who benefits?
- **Revenue Impact**: Which revenue stream does it affect?

### Step 2: Technical Architecture Analysis
- **Frontend**: Components, pages, state management affected
- **Backend**: APIs, services, database tables involved
- **Integration Points**: Internal (Frontend↔Backend, Backend↔DB) and External (third-party APIs, payment providers)
- **Note**: Integration points are where most bugs occur.

### Step 3: Risk Analysis

| Type | Questions |
|------|-----------|
| **Technical** | Performance bottlenecks? Security vulnerabilities? Scalability limits? What if external service fails? |
| **Business** | UX frustration? Data integrity? Revenue impact? Reputation damage? |
| **Integration** | What if connection fails? Response slow? Data format changes? |

### Step 4: Critical Analysis
- Read each story for ambiguities, vague acceptance criteria, missing edge cases.
- Convert every ambiguity into a specific question for PO/Dev.

### Step 5: Test Strategy Definition

**Test Scope** — define in/out of scope:
- In scope: Functional (UI/API/DB), Integration, Security, Performance, Cross-browser, Mobile
- Out of scope: Extreme load testing, professional penetration testing, deep accessibility

**Test Levels:**
| Level | Goal | Tool | Responsibility |
|-------|------|------|---------------|
| Unit | >80% coverage | Vitest/Jest | Dev |
| Integration | All integration points covered | Playwright | QA+Dev |
| E2E | Critical user journeys | Playwright | QA |
| API | 100% endpoints | Postman/Playwright | QA |

### Step 6: Entry/Exit Criteria
**Entry**: Story deployed to staging, code review approved, unit tests passing, dev smoke testing done, test data available.

**Exit**: All test cases executed, Critical/High 100% passing, Medium/Low ≥95%, all Critical/High bugs resolved, regression passing, NFRs validated.

### Step 7: Test Case Estimation
Per story, rate complexity factors: Business logic, Integration points, Data validations, Error scenarios, UI complexity. Estimate positive, negative, boundary, and integration test counts.

## 3. Acceptance Test Plan (Story Level)

### Test Case Types
| Type | Purpose | Example |
|------|---------|---------|
| Positive | Happy path, successful flow | Login with valid credentials |
| Negative | Errors and validations | Login with wrong password |
| Boundary | Limit values | Email at exactly 254 chars |
| Edge Case | Unusual scenarios | Active session on another device |
| Integration | Connection points | Frontend → API → Database |

### Gherkin Format
```gherkin
Scenario: [Descriptive name]
Given [Context / preconditions]
  And [Additional precondition]
When [User action]
  And [Additional action]
Then [Expected result]
  And [Additional verification]
```

### Story Quality Analysis (per story)
1. **Ambiguities**: Is each AC specific and objectively verifiable?
2. **Missing Information**: Exact error messages, session timeouts, behavior on concurrent sessions
3. **Edge Cases**: Double-click, network disconnection, back button, concurrent edits

### Refined Acceptance Criteria
Rewrite each original AC with specific data, exact error messages, concrete verifications.

### Test Case Structure
- ID, Type (Positive/Negative/Boundary), Priority (Critical/High/Medium/Low)
- Preconditions, Test Steps with specific data, Expected Results (UI/API/DB)
- Post-conditions (cleanup)

### Naming Convention (Shift-Left / Exploratory)
```
Should <BEHAVIOR> <CONDITION>
```
Examples: "Should login successfully with valid credentials", "Should display authentication error when password is incorrect"

## 4. Traceability Matrix

```
Epic (Jira) ──→ FTP (Feature Test Plan) ──→ Macro context
    │
Story (Jira + .md) ──→ ATP (Acceptance Test Plan)
    │
ATCs (Acceptance Test Cases) ──→ Documented in Jira
    │
KATA Automation ──→ @atc('PROJECT-XXX') decorator
```

## 5. Risk Score Triage (Per Story)

| Factor | Score |
|--------|-------|
| New feature | +3 |
| Data from API/DB | +3 |
| Has explicit ACs | +2 |
| User-facing | +2 |
| High effort (>4h) | +2 |
| High priority | +1 |
| Multi-component | +1 |

**0-3**: Code review only. **4-7**: Full testing. **8+**: Full testing + extended edge cases.

Veto conditions that bypass scoring entirely:
- **SKIP** (code review only): Backend-only, infra/devops, static content, pure CSS, docs, tech debt refactor
- **REQUIRE** (full testing): Affects money, data integrity, auth, external integrations, bug in critical module, calculations

## 6. Workflow: Jira-First → Local Mirror

1. Read local epic/story → extract Jira Key
2. Read current issue from Jira (via Atlassian MCP)
3. Analyze context, risks, strategy
4. Update Jira issue with refinements + label `shift-left-reviewed` (or `test-plan-ready` for epics)
5. Add test plan as comment in Jira with team tags
6. Generate local mirror file (`feature-test-plan.md` or `acceptance-test-plan.md`)
7. (Stories only) Create branch `test/{JIRA_KEY}/{short-description}` and commit the file
