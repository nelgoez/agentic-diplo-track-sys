# Seed QA test users + verify credentials across environments

**Jira Key:** [DTS-73](https://diplo-track-sys.atlassian.net/browse/DTS-73)
**Epic:** [DTS-42](https://diplo-track-sys.atlassian.net/browse/DTS-42) (QA Testing Credentials — DB / API / UI)
**Type:** Story
**Status:** Done
**Priority:** Medium
**Story Points:** -

---

## Overview

## Objective

Ensure all QA test credentials work across local/staging/production and are documented in the /qa page.

## Tasks

- [ ] Verify admin@dts.unc.edu.ar login on all 3 environments
- [ ] Verify coordinador@dts.unc.edu.ar login on all 3 environments
- [ ] Verify nahuelgomez.cti@gmail.com login (estudiante)
- [ ] Reset passwords if needed
- [ ] Update /qa page with any changed values
- [ ] Run /testability-guide to regenerate if needed

## Acceptance Criteria

- All 3 demo users can log in on local, staging, and production
- /qa page reflects correct credentials
- QA role qa*inspector*ro has SELECT access on all public tables

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
- **Labels:** credentials, phase-6, qa

---

_Synced from Jira by sync-jira-issues_
