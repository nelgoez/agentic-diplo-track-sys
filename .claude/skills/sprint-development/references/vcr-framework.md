# VCR Framework — Value, Cost, Risk Analysis

> **Status**: `active`
> **UPEX Source**: FLUJOS DE TRABAJO step 3: "Aplicación del VCR para evaluar candidatura para automatización"

## Purpose

VCR (Valor, Costo, Riesgo) determines which test cases are candidates for automation. Manual tests with high value + low risk → automate first. Low value + high cost → keep manual.

## Dimensions

| Dimension | Question | Scale (1-5) |
|---|---|---|
| **Value** (Valor) | How much business risk does this test cover? | 1=cosmetic, 5=critical path |
| **Cost** (Costo) | How expensive is it to automate? | 1=trivial, 5=prohibitive |
| **Risk** (Riesgo) | How likely is this scenario to break? | 1=never changes, 5=highly volatile |

## Decision Matrix

| Value | Cost | Risk | Verdict |
|---|---|---|---|
| ≥4 | ≤2 | any | **Automate now** — high value, cheap |
| ≥4 | 3-4 | ≥3 | **Automate** — high value justifies effort |
| 2-3 | ≤2 | any | **Automate if time permits** |
| 2-3 | ≥3 | any | **Keep manual** — low ROI |
| ≤1 | any | any | **Drop** — not worth testing |

## Usage

During Step 3 of QA Manual workflow, annotate each test case:
```typescript
interface VcrScore {
  value: 1 | 2 | 3 | 4 | 5
  cost: 1 | 2 | 3 | 4 | 5
  risk: 1 | 2 | 3 | 4 | 5
}
```

For automation candidates, create technical debt ticket in Jira and link to the test case.

## Integration

- VCR scores stored as custom fields in Xray test cases
- `@atc` decorator accepts optional `vcr` parameter
- CI regression suite = tests with VCR verdict "Automate now" + "Automate"
