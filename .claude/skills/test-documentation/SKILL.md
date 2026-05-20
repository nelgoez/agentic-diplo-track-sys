---
name: test-documentation
description: 'Creates formal test case documentation in Jira after exploratory validation: test analysis, ROI-based prioritization, lifecycle states (DRAFT→IN DESIGN→READY→CANDIDATE/MANUAL), and traceability. Triggers on: `test documentation`, `formal test cases`, `test case lifecycle`, `test analysis`, `ROI prioritization`, `Xray test management`, `regression suite`. Do NOT use for: exploratory testing (use `/exploratory-testing`), test automation (use `/kata-architecture`), shift-left test planning (use `/sprint-development`).'
license: MIT
compatibility: [claude-code, opencode]
phase: testing
---

# Test Documentation — Formal Test Case Management

`test-documentation` manages the creation, prioritization, and lifecycle of formal test cases in Jira after features have been validated via exploratory testing. It ensures traceability between requirements and tests, and drives automation decisions based on ROI.

Source content migrated from:
- `.books/fase-11-test-documentation/test-documentation.MANUAL.md`
- `.prompts/fase-11-test-documentation/` (test-analysis.md, test-prioritization.md, test-documentation.md)

---

## Dependencies

Requires `agentic-dev-core`. Composes after `exploratory-testing` and before `kata-architecture`.

---

## Key Concepts

### Test Case Lifecycle

```
DRAFT → IN DESIGN → READY → [MANUAL | IN REVIEW → CANDIDATE → AUTOMATED]
```

- **DRAFT**: Initial creation
- **IN DESIGN**: Test steps being defined
- **READY**: Complete and executable
- **MANUAL**: Will remain manual (low ROI for automation)
- **IN REVIEW**: Pending automation approval
- **CANDIDATE**: Approved for automation (awaiting Fase 12)
- **AUTOMATED**: Scripted

### Regression Epic Container

All tests MUST belong to a regression epic:
```
Project: DEMO
└── Epic: "DEMO Test Repository"
    ├── Test: Login exitoso [CANDIDATE]
    ├── Test: Validación password [CANDIDATE]
    └── Test: Visual alignment [MANUAL]
```

### ROI Formula

```
ROI = (Frecuencia × Impacto × Estabilidad) / (Esfuerzo × Dependencias)
```

| Factor | Scale 1-5 |
|--------|-----------|
| Frecuencia | 5=Every PR, 1=Occasional |
| Impacto | 5=Revenue, 1=Cosmetic |
| Estabilidad | 5=Never changes, 1=Volatile |
| Esfuerzo | 1=Trivial, 5=Week+ |
| Dependencias | 1=None, 5=Many |

**Component Bonus**: If reusable in N flows → `ROI Final = ROI Base × (1 + 0.2 × N)`

| ROI Score | Decision |
|-----------|----------|
| > 2.0 | Automate (Candidate path) |
| 1.5 - 2.0 | Automate (Candidate path) |
| 1.0 - 1.5 | Evaluate |
| 0.5 - 1.0 | Manual |
| < 0.5 | Defer |

### Test Classification

| Type | Description | Example |
|------|-------------|---------|
| **E2E** | Complete user journey | Login → Purchase → Confirmation |
| **Integration** | System-to-system communication | Auth API → Product API |
| **Functional** | Isolated functionality | Form validation |
| **Smoke** | Basic verification | App loads, login works |

---

## Workflow

### Phase 1: Test Analysis (20-30 min)
1. **Gather context**: User Story, comments, linked bugs, session notes from exploratory testing
2. **Identify scenarios**: Classify by business priority (Critical/High/Medium/Low) and automatisability
3. **Create Component Map (Lego)**: Each atomic test as a reusable component
   ```
   E2E: Complete Purchase Flow
   ├── [1] Login exitoso (Functional) ← REUSABLE
   ├── [2] Search product (Functional)
   ├── [3] Add to cart (Functional)
   └── [4] Checkout (Integration)
   ```

### Phase 2: Test Prioritization (15-20 min)
1. Calculate ROI for every candidate scenario
2. Apply component reuse bonus
3. Generate prioritization table with implementation order

### Phase 3: Test Documentation (30-40 min)
1. **Naming convention**: `[US_ID]: TC#: Validar [CORE] [CONDITIONAL]`
2. **Create tests in Jira** (or Xray CLI):
   - Test with Steps (manual) or Gherkin (automation candidate)
   - Use labels: `regression`, `functional`, `critical`, `automation-candidate`, `manual-only`
3. **Link to User Story** (Link type: "tests" / "is tested by")
4. **Transit lifecycle states**: DRAFT → IN DESIGN → READY → [MANUAL | IN REVIEW → CANDIDATE]
5. **Save local mirror**: `.context/PBI/epics/EPIC-XXX/stories/STORY-YYY/tests/TEST-ID-nombre.md`

---

## Tool Resolution

| Tag | Primary | Fallback |
|-----|---------|----------|
| `[ISSUE_TRACKER_TOOL]` | `/acli` | MCP Atlassian |

### Xray CLI Commands (if available)
```bash
bun xray test create --project PROJ --summary "US-101: TC1: Validar login exitoso" \
  --step "Navegar a /login|Formulario visible" \
  --step "Ingresar email válido|user@test.com|Campo poblado"

bun xray test create --project PROJ --type Cucumber \
  --summary "Feature: Login" --gherkin "Feature: ..."
```
