# Public verification page — frontend

**Jira Key:** [DTS-64](https://diplo-track-sys.atlassian.net/browse/DTS-64)
**Epic:** [DTS-58](https://diplo-track-sys.atlassian.net/browse/DTS-58) (Public Diploma Verification Portal)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Public verification page — frontend

> [!TIP] ***Public-facing.*** No auth required. This is the page the QR code links to.

## Objective

Public, no-auth landing page for diploma verification. Clean, UNC-branded, scannable result states.

## Route

`/verify/:reference_code`

## Page flow

```
User arrives with code in URL:
  /verify/DTS-A3B8K
       │
       ├── Show loading skeleton
       │
       ├── GET /api/v1/verify/DTS-A3B8K
       │
       ├── 200 → Show SUCCESS state:
       │       ✔ Diploma valido
       │         Maria Garcia
       │         Diplomatura en Ciencia de Datos
       │         Nota: 8 (Aprobado)
       │         Fecha: 01/06/2026
       │
       └── 404 → SHOW ERROR state:
               ✖ Codigo no valido
                 Ingrese un codigo de verificacion valido
                 [Intentar de nuevo]
```

## Design

- Clean, UNC-branded public page (no sidebar/auth layout)
- Input field: "Codigo de verificacion" + "Verificar" button
- Valid state: green checkmark + student info card
- Invalid state: red X + friendly message
- Loading state: MUI Skeleton
- Error state: "Intente nuevamente" + retry button

## Layout

```
┌──────────────────────────────────────┐
│           DTS Logo (small)           │
│                                      │
│        VERIFICACION DE DIPLOMAS      │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ [Codigo de verificacion] [Ver] │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌─── SUCCESS ───────────────────┐   │
│  │  ✔ Diploma valido              │   │
│  │  Maria Garcia                  │   │
│  │  Diplomatura en Ciencia...     │   │
│  │  Nota: 8                       │   │
│  └────────────────────────────────┘   │
│                                      │
│  Footer: UNC + DTS                   │
└──────────────────────────────────────┘
```

## Integration

- Consumes GET /api/v1/verify/:code
- No auth required — bypass MainLayout, use minimal public layout
- Add link to verification page from landing page footer
- SEO: meta tags for sharing (og:title, og:description)

## Acceptance Criteria

- [ ] Public user can open /verify/DTS-A3B8K and see diploma info
- [ ] Invalid code shows error state
- [ ] Works without authentication
- [ ] Mobile responsive
- [ ] Handles loading/error/empty states

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
- **Labels:** frontend, phase-6, post-mvp, verification

---

_Synced from Jira by sync-jira-issues_
