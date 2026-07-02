# QR code generation for diploma verification

**Jira Key:** [DTS-63](https://diplo-track-sys.atlassian.net/browse/DTS-63)
**Epic:** [DTS-58](https://diplo-track-sys.atlassian.net/browse/DTS-58) (Public Diploma Verification Portal)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# QR code generation for diploma verification

> [!NOTE] ***Enhances DTS-57 (PDF Generation).*** Do after DTS-57 backend is built.

## Objective

Generate QR codes on diploma PDFs that link to the public verification page.

## Tasks

- Add QR code library (qrcode or similar, zero-dep if possible)
- Generate QR code SVG/PNG containing the verification URL
- Embed QR code in the diploma PDF footer
- QR encodes: `https://diplomatrackingsystem.qzz.io/verify/DTS-A3B8K`
- Fallback: if QR generation fails, show the reference code as plain text

## Endpoint (optional)

`GET /api/v1/diplomas/:id/qr` — returns QR code image for embedding.

## QR code placement on diploma

```
┌────────────────────────────────────┐
│                                    │
│         UNIVERSIDAD NACIONAL       │
│            DE CORDOBA              │
│                                    │
│    CERTIFICA QUE                   │
│                                    │
│    Maria Garcia                    │
│                                    │
│    ha completado la Diplomatura    │
│    en Ciencia de Datos             │
│                                    │
│    Fecha: 01/06/2026               │
│                                    │
├────────────────────────────────────┤
│  ┌───────┐                         │
│  │ QR    │  Verifique este         │
│  │ CODE  │  diploma en:            │
│  │       │  diplomatrackingsystem  │
│  └───────┘  .qzz.io/verify/ABCDE   │
└────────────────────────────────────┘
```

## Lib options

| Library | Size | Notes |
| --- | --- | --- |
| qrcode (npm) | ~20 KB | Pure JS, SVG/PNG output, widely used |
| qrcode-generator | ~10 KB | Lighter, fewer output formats |

## Acceptance Criteria

- [ ] QR code scans correctly to verification URL
- [ ] QR code appears on generated diploma PDF
- [ ] Plain text fallback works when QR fails
- [ ] No new heavy dependencies added

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
- **Labels:** pdf, phase-6, post-mvp, verification

---

_Synced from Jira by sync-jira-issues_
