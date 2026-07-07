# Skill: xray-cli

> **Status**: `scaffolded` — Xray plugin must be confirmed installed in Jira before use.

## Overview

Xray is the test management plugin for Jira used by UPEX Galaxy. This skill wraps Xray REST API for test set/test execution CRUD and ATC result import.

## Prerequisites

1. Xray installed in Jira instance (`diplo-track-sys.atlassian.net`)
2. Jira API token with Xray permissions (same as `ATLASSIAN_API_TOKEN`)

## API Base

```
https://diplo-track-sys.atlassian.net/rest/raven/1.0/
```

## Key Operations

### Create Test Set
```bash
curl -X POST "${XRAY_BASE}/api/testset" \
  -H "Authorization: Basic ${AUTH}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Set Name", "projectKey": "DTS"}'
```

### Create Test Execution
```bash
curl -X POST "${XRAY_BASE}/api/testexec" \
  -H "Authorization: Basic ${AUTH}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Execution Name", "projectKey": "DTS"}'
```

### Import Test Results (Allure → Xray)
```bash
curl -X POST "${XRAY_BASE}/api/import/execution/allure" \
  -H "Authorization: Basic ${AUTH}" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@allure-results.zip"
```

## Integration with KATA Framework

The `@atc` decorator in `@dts/test-kit` registers ATC metadata. Bridge script:
```
scripts/xray-sync.ts → reads getAtcMap() → creates Xray test cases → links to stories
```

## Verification

```bash
# Health check
curl -s "${XRAY_BASE}/api/health" | jq .
```

## References

- Xray REST API docs: https://docs.getxray.app/display/XRAYCLOUD/REST+API
- Jira credentials from `.env` (`ATLASSIAN_URL`, `ATLASSIAN_EMAIL`, `ATLASSIAN_API_TOKEN`)

## Related

- `@dts/test-kit` — KATA framework with `@atc` decorator
- `scripts/sync-jira-issues.ts` — existing Jira sync
