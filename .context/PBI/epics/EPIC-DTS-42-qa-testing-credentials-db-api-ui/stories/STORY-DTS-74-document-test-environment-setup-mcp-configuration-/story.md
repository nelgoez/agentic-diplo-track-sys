# Document test environment setup + MCP configuration in /qa page

**Jira Key:** [DTS-74](https://diplo-track-sys.atlassian.net/browse/DTS-74)
**Epic:** [DTS-42](https://diplo-track-sys.atlassian.net/browse/DTS-42) (QA Testing Credentials — DB / API / UI)
**Type:** Story
**Status:** Done
**Priority:** Medium
**Story Points:** -

---

## Overview

## Objective

Make the /qa page self-sufficient for any QA engineer or AI agent to start testing.

## Sections to update

- [ ] Architecture overview (React + Hono + Supabase)
- [ ] Environment table (local/staging/production URLs)
- [ ] DB access: connection string + DBHub MCP setup
- [ ] API access: login endpoint + bearer token flow
- [ ] OpenAPI MCP setup instructions
- [ ] Postman MCP setup instructions
- [ ] Demo user table with roles
- [ ] Common test scenarios

## Acceptance Criteria

- QA engineer can follow the page without asking for help
- All MCP configurations tested with actual agents
- No hardcoded secrets in the page

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Out Of Scope](./out-of-scope.md)
- [Implementation Plan (Dev)](./implementation-plan.md)
- [Acceptance Test Plan (QA)](./acceptance-test-plan.md)
- [Acceptance Test Results (QA)](./acceptance-test-results.md)

---

## Metadata

- **Created:** 12/6/2026
- **Updated:** 12/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez
- **Labels:** documentation, phase-6, qa

---

_Synced from Jira by sync-jira-issues_
