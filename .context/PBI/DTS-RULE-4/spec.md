# DTS-RULE-4: View Rule Tree (Read)

> Phase: 3 (Rule Engine) · Effort: 2 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: View full prerequisite rule tree for a course
- **Given** a course has prerequisite rules with nested children and sources
- **When** the coordinator sends GET /courses/:id/prerequisites
- **Then** the full rule tree is returned in hierarchical structure
- **And** each node includes its type (ALL/ANY), child rules, and source courses

### Scenario: View all rules for a track
- **Given** multiple rules exist for a track across different courses
- **When** the coordinator sends GET /rules?trackId=:id
- **Then** all rules for that track are returned
- **And** each rule includes its type, target course, child rules, and source courses
- **And** the structure is hierarchical (parent rules contain children)

### Scenario: Empty rule tree for a course without prerequisites
- **Given** a course has no prerequisite rules
- **When** GET /courses/:id/prerequisites is called
- **Then** an empty array is returned
- **And** HTTP 200 is returned

### Scenario: Shallow rule (no children) returns correct structure
- **Given** a rule of type ALL references courses A and B directly (no nested rules)
- **When** the tree is retrieved via GET /courses/:id/prerequisites
- **Then** the response shows the ALL rule with source courses A and B
- **And** no child rules are present

### Scenario: Deeply nested rule tree returns full structure
- **Given** a rule tree is 3 levels deep (ALL → ANY → ALL → sources)
- **When** the tree is retrieved
- **Then** all 3 levels are present in the hierarchical structure
- **And** each level's type and children are correctly represented

### Scenario: Rule tree includes source course details
- **Given** a rule references source courses
- **When** the rule tree is retrieved
- **Then** each source course includes its `id`, `name`, and `code`

### Scenario: Inactive rules are excluded from the tree
- **Given** a rule exists but has `is_active: false`
- **When** the rule tree is retrieved
- **Then** the inactive rule is not included in the response

### Scenario: Unauthenticated access is rejected
- **Given** no valid JWT is provided
- **When** any rule tree endpoint is accessed
- **Then** HTTP 401 Unauthorized is returned

### Scenario: Non-existent course returns 404
- **Given** the course ID does not exist
- **When** GET /courses/:id/prerequisites is called
- **Then** HTTP 404 Not Found is returned
