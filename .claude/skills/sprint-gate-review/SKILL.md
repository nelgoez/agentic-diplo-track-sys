# Skill: sprint-gate-review

# Sprint Gate Review — Backlog Readiness Analyst

`sprint-gate-review` audits PBI documentation completeness before progressing to the next development phase. It acts as a phase gate, verifying that all stories have spec.md, impl-plan.md, edge-cases.md, and compliance-matrix.md artifacts before allowing the team to begin implementation.

---

## When to use

Trigger on: `sprint gate`, `phase gate review`, `backlog audit`, `PBI readiness check`, `story audit`, `ready for sprint`, `backlog health check`

Do NOT use for: implementation, testing, product definition, or infrastructure scaffolding.

---

## Three-Gate Audit

For each story in scope, verify:

| Gate | Check | Artifact |
|------|-------|----------|
| **Completeness** | All 4 artifacts exist and are version-controlled | spec.md, impl-plan.md, edge-cases.md, compliance-matrix.md |
| **Clarity** | ACs are Gherkin-formatted, unambiguous, testable | spec.md (AC section) |
| **Compliance** | Compliance-matrix maps AC scenarios to evidence with status | compliance-matrix.md |

**Scoring**: Each gate = pass/fail. Pass = 1, Fail = 0. All 3 passes = Ready. Any fail = remediation task.

---

## Workflow

### 1. Scope Selection
Read `master-implementation-plan.md` to identify upcoming phase stories.

### 2. Artifact Scan
For each story folder in `.context/PBI/{STORY-KEY}/`, verify all 4 files exist.

### 3. Gate Evaluation
For each artifact present, evaluate clarity and compliance.

### 4. Report
Output a readiness matrix:

```
| Story | Complete | Clear | Compliant | Score | Verdict |
|-------|----------|-------|-----------|-------|---------|
| DTS-XXX | ✅ | ✅ | ✅ | 3/3 | READY |
| DTS-YYY | ✅ | ❌ | ✅ | 2/3 | REMEDIATE |
```

### 5. Remediation
Flag failing stories. Assign remediation owner. Block phase progression until all stories pass.

---

## Variables consumed

- `{{PROJECT_KEY}}` — from `.agents/project.yaml`

---

## Output

`.session/sprint-gate-review-YYYY-MM-DD.md` — readiness matrix + remediation tasks.

---

## Notes

- Run before every phase transition (Phase N → Phase N+1)
- PO owns the gate review; EM and QA attend as stakeholders
- Stories without folders are automatically marked as MISSING (score 0/3)
