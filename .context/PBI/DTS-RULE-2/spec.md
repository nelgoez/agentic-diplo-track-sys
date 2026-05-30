# DTS-RULE-2: Rule Engine Evaluator (Recursive Tree)

> Phase: 3 (Rule Engine) · Effort: 8 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: ALL rule passes when all children have approved certificates
- **Given** a student has approved certificates for courses A, B, and C
- **And** a prerequisite rule of type ALL references courses A, B, and C
- **When** POST /rules/evaluate is called with `{ studentId, trackId }`
- **Then** the rule evaluates to `eligible: true`
- **And** the breakdown shows each child course as "satisfied"

### Scenario: ALL rule fails when one child lacks a certificate
- **Given** a student has approved certificates for courses A and B but not C
- **And** a prerequisite rule of type ALL references courses A, B, and C
- **When** the rule is evaluated
- **Then** the rule evaluates to `eligible: false`
- **And** the breakdown shows courses A and B as "satisfied" and C as "pending"

### Scenario: ANY rule passes when at least one child has a certificate
- **Given** a student has an approved certificate only for course A
- **And** a prerequisite rule of type ANY references courses A, B, and C
- **When** the rule is evaluated
- **Then** the rule evaluates to `eligible: true`
- **And** the breakdown shows A as "satisfied" and B, C as "pending"

### Scenario: ANY rule fails when no child has a certificate
- **Given** a student has no approved certificates for any referenced courses
- **And** a prerequisite rule of type ANY references courses X, Y, Z
- **When** the rule is evaluated
- **Then** the rule evaluates to `eligible: false`

### Scenario: Nested ALL within ANY evaluation
- **Given** a top-level ANY rule has two child rules:
  - Child 1: ALL rule referencing courses A and B
  - Child 2: ALL rule referencing courses C and D
- **And** the student has certificates only for C and D
- **When** the rule is evaluated
- **Then** the top-level ANY rule evaluates to `eligible: true` (Child 2 satisfied)
- **And** the breakdown shows Child 1 as "not satisfied" and Child 2 as "satisfied"

### Scenario: Nested ANY within ALL evaluation
- **Given** a top-level ALL rule has two child rules:
  - Child 1: ANY rule referencing courses A and B
  - Child 2: ANY rule referencing courses C and D
- **And** the student has a certificate only for A and C
- **When** the rule is evaluated
- **Then** the top-level ALL rule evaluates to `eligible: true`
- **And** both child ANY rules show as "satisfied"

### Scenario: Active override makes a failing rule pass
- **Given** a student has no certificates and an ALL rule requires courses A and B
- **And** an active manual override exists for the combination (student, rule)
- **When** the rule is evaluated
- **Then** the rule evaluates to `eligible: true`
- **And** the result indicates "overridden: true" with the override reason

### Scenario: Expired override does not affect evaluation
- **Given** an override exists but its `expires_at` is in the past
- **When** the rule is evaluated
- **Then** the override is NOT applied
- **And** the result reflects the actual certificate status

### Scenario: Revoked override does not affect evaluation
- **Given** an override exists but its `status` is "revoked"
- **When** the rule is evaluated
- **Then** the override is NOT applied
- **And** the result reflects the actual certificate status

### Scenario: Rule for wrong track returns error
- **Given** a rule belongs to track X
- **When** POST /rules/evaluate is called with `trackId` of track Y
- **Then** the rule is excluded from evaluation
- **And** no cross-track eligibility leakage occurs

### Scenario: Empty rule tree returns not eligible
- **Given** a track has no prerequisite rules defined
- **When** the eligibility is evaluated for that track
- **Then** the result is `eligible: false` with reason "no rules defined"

### Scenario: Evaluation completes under 500ms
- **Given** a moderately complex rule tree (5 levels deep, 20+ courses)
- **When** the rule is evaluated for a student
- **Then** the total evaluation time is below 500 milliseconds

### Scenario: Branch coverage of rule engine is at least 95%
- **Given** the rule engine implementation exists
- **When** unit tests are run with coverage reporting
- **Then** branch coverage for the rule engine module is ≥ 95%
