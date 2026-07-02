# Diploma template design — UNC-branded HTML/CSS

**Jira Key:** [DTS-76](https://diplo-track-sys.atlassian.net/browse/DTS-76)
**Epic:** [DTS-57](https://diplo-track-sys.atlassian.net/browse/DTS-57) (Digital Diploma PDF Generation)
**Type:** Story
**Status:** Done
**Priority:** Medium
**Story Points:** -

---

## Overview

# Diploma template design — UNC-branded HTML/CSS

> [!NOTE] ***Design piece.*** Depends on DTS-67 (theme) for color palette.

## Objective

Create the HTML/CSS template that renders into the diploma PDF. Should look official and match UNC's academic dignity.

## Layout concept

```
┌──────────────────────────────────────┐
│                                      │
│    [UNC Shield / Logo - top center]  │
│                                      │
│   UNIVERSIDAD NACIONAL DE CÓRDOBA    │
│                                      │
│         DIPLOMA                      │
│                                      │
│   La Universidad Nacional de Córdoba │
│   certifica que                      │
│                                      │
│       🎓 MARÍA GARCÍA                │
│                                      │
│   ha completado la                   │
│   Diplomatura en Ciencia de Datos    │
│                                      │
│   con una calificación de: 8         │
│                                      │
│   Fecha de emisión: 01/06/2026       │
│   Código de verificación: DTS-A3B8K  │
│                                      │
│   ┌────────────────────────┐         │
│   │  [QR Code]             │         │
│   └────────────────────────┘         │
│   Verifique en:                      │
│   diplomatrackingsystem.qzz.io/verify│
│                                      │
│   ─────────────────────────────────  │
│   Firma digital: [hash]              │
│                                      │
└──────────────────────────────────────┘
```

## Style

- Font: Serif for body (Georgia or Times New Roman), Sans-serif for headers
- Colors: Black text on white, UNC gold (#D4A843) for accent borders
- Gold border frame around the page
- Clean, traditional diploma aesthetic
- QR code in bottom section (from DTS-63)

## Template function

```typescript
export function renderTemplate(params: DiplomaParams): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: Georgia, serif; color: #1a1a1a; }
        .border { border: 3px solid #D4A843; padding: 30px; }
        .title { text-align: center; font-size: 28px; margin: 20px 0; }
        .student-name { text-align: center; font-size: 24px; font-weight: bold; margin: 30px 0; }
        .footer { margin-top: 40px; font-size: 10px; color: #666; }
      </style>
    </head>
    <body>
      <div class="border">
        <div class="title">UNIVERSIDAD NACIONAL DE CÓRDOBA</div>
        ...
      </div>
    </body>
    </html>
  `;
}
```

## Acceptance Criteria

- [ ] Template renders correctly in browser preview
- [ ] Template renders correctly in Puppeteer PDF output
- [ ] UNC branding present (text logo, gold accents)
- [ ] All dynamic fields (name, track, grade, date, code) render correctly
- [ ] Responsive to long names/track names (no overflow)

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
- **Labels:** pdf, phase-6, post-mvp

---

_Synced from Jira by sync-jira-issues_
