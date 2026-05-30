# DTS-RULE-1: Prerequisite Rules CRUD

> Phase: 3 (Rule Engine) · Effort: 8 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: Coordinator creates an ALL-type rule
- **Given** a track exists with at least two courses
- **And** the authenticated user has role "coordinador"
- **When** the coordinator sends POST /rules with `{ trackId, type: "ALL", sourceCourseIds: [...], orderIndex }`
- **Then** a new rule is created in `prerequisite_rules` table
- **And** all referenced courses are linked in `prerequisite_sources` table
- **And** HTTP 201 is returned with the created rule including its nested sources

### Scenario: Coordinator creates an ANY-type rule
- **Given** a track exists with courses
- **When** the coordinator sends POST /rules with `{ trackId, type: "ANY", sourceCourseIds: [...] }`
- **Then** an ANY-type rule is persisted with correct sources
- **And** the response includes full rule tree with source courses

### Scenario: Coordinator creates a nested rule (parent_rule_id)
- **Given** a parent rule already exists for a track
- **When** the coordinator sends POST /rules with `{ trackId, type: "ALL", parentRuleId, sourceCourseIds: [...] }`
- **Then** the new rule is created as child of the parent rule
- **And** `parent_rule_id` is set correctly in the new record
- **And** the parent rule's evaluation tree includes this child

### Scenario: List all rules for a track
- **Given** multiple rules exist for a given track
- **When** the coordinator sends GET /rules?trackId=:id
- **Then** all rules for that track are returned in hierarchical order
- **And** each rule includes its type, source courses, and child rules

### Scenario: Get a single rule by ID
- **Given** a rule exists with nested children and sources
- **When** the coordinator sends GET /rules/:id
- **Then** the full rule object is returned including source courses and nested children recursively

### Scenario: Update a rule (replace entire structure)
- **Given** a rule exists with sources and possibly child rules
- **When** the coordinator sends PUT /rules/:id with new `{ type, sourceCourseIds, orderIndex }`
- **Then** the rule's type and metadata are updated
- **And** old `prerequisite_sources` entries are removed and replaced with new ones
- **And** HTTP 200 is returned with the updated rule

### Scenario: Coordinator attempts to delete a rule
- **Given** a rule exists that is not an admin
- **When** a coordinator sends DELETE /rules/:id
- **Then** HTTP 403 Forbidden is returned
- **And** the rule remains in the database

### Scenario: Admin deletes a rule
- **Given** the authenticated user has role "admin"
- **When** the admin sends DELETE /rules/:id
- **Then** the rule and all its child rules are deleted (cascade)
- **And** all associated `prerequisite_sources` for deleted rules are removed
- **And** HTTP 200 is returned

### Scenario: Unauthenticated access is rejected
- **Given** no valid JWT is provided
- **When** any rule endpoint is accessed
- **Then** HTTP 401 Unauthorized is returned

### Scenario: Create rule with a non-existent course
- **Given** the coordinator provides a `sourceCourseId` that does not exist in the track
- **When** POST /rules is sent
- **Then** HTTP 400 Bad Request is returned with a descriptive error message
