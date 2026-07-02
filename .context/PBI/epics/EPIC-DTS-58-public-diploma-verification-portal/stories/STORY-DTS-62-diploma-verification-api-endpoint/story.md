# Diploma verification API endpoint

**Jira Key:** [DTS-62](https://diplo-track-sys.atlassian.net/browse/DTS-62)
**Epic:** [DTS-58](https://diplo-track-sys.atlassian.net/browse/DTS-58) (Public Diploma Verification Portal)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Diploma verification API endpoint

> [!TIP] ***Public endpoint.*** No auth required. Rate limited.

## Objective

Public API endpoint to verify a diploma's authenticity by reference code.

## Endpoint

`GET /api/v1/verify/:reference_code`

## Response 200

```json
{
  "valid": true,
  "student": "Maria Garcia",
  "document_number": "42.123.456",
  "track": "Diplomatura en Ciencia de Datos",
  "issue_date": "2026-06-01",
  "grade": 8
}
```

## Response 404

```json
{
  "valid": false,
  "message": "Codigo de verificacion no valido"
}
```

## Requirements

- No authentication required (public endpoint)
- Rate limiting: 10 req/min per IP (use existing rate limiter middleware)
- Log all verification queries to audit_log
- Only return active, non-revoked references
- Include diploma status (pending/issued)

## Flow

```
Visitor → GET /api/v1/verify/DTS-A3B8K
  ├── Check rate limit (10/min per IP)
  ├── Lookup verification*references WHERE code = 'DTS-A3B8K' AND is*active = true
  ├── If not found → 404 {"valid": false}
  ├── Lookup enrollment → student, track, grade
  ├── Log to audit_log
  └── Return 200 with diploma data
```

## Acceptance Criteria

- [ ] GET /api/v1/verify/DTS-A3B8K returns valid diploma info
- [ ] GET /api/v1/verify/FAKE-CODE returns 404
- [ ] Rate limit kicks in after 10 requests/minute
- [ ] Audit log entry created per verification attempt

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

- **Created:** 11/6/2026
- **Updated:** 12/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez
- **Labels:** api, phase-6, post-mvp, verification

---

_Synced from Jira by sync-jira-issues_
