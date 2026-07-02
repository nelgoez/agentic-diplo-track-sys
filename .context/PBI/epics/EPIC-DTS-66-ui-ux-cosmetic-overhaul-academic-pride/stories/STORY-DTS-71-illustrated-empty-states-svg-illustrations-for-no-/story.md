# Illustrated empty states — SVG illustrations for no-data views

**Jira Key:** [DTS-71](https://diplo-track-sys.atlassian.net/browse/DTS-71)
**Epic:** [DTS-66](https://diplo-track-sys.atlassian.net/browse/DTS-66) (UI/UX Cosmetic Overhaul — Academic Pride)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Illustrated empty states — SVG illustrations for no-data views

> [!TIP] ***Personality injection.*** Prioritize pages a student sees first.

## Objective

Replace boring "No data" messages with custom SVG illustrations that add personality and warmth to empty states.

## Empty states

| Page | Scenario | Illustration concept | Message |
| --- | --- | --- | --- |
| /certificates | No certificates | Open book with blank pages, warm blue tones | "Todavía no tenés certificados. Completá cursos para recibir tu primer certificado." |
| /enrollments | Not enrolled | Empty backpack / pencil case | "No estás inscripto en ningún track. Explorá los tracks disponibles." |
| /exams | No exam history | Calendar with check marks, relaxed scene | "No hay exámenes registrados. Cuando te inscribas, aparecerán aquí." |
| /students/search | No search results | Magnifying glass with friendly "not found" doodle | "No encontramos estudiantes con ese criterio. Probá con otro término." |
| /overrides | No active overrides | Shield with checkmark, peaceful scene | "No hay sobrescribir activas." |
| /notifications | No notifications | Bell with "Zzz" floating | "No tenés notificaciones. Te avisaremos cuando haya novedades." |
| /admin/dashboard | Fresh install | Empty charts with building blocks | "El sistema está listo. Comenzá inscribiendo estudiantes." |

## Design style

- Flat vector inline SVGs, color-matched to DTS-67 palette
- ~200x200px desktop, responsive to ~120px mobile
- Idle animation: gentle CSS bob/float, respects reduced motion
- Each: `role="img"` + descriptive `aria-label`
- Warm message below + CTA button where applicable

## Component structure

```
client/src/components/illustrations/
├── EmptyCertificates.tsx
├── EmptyEnrollments.tsx
├── EmptyExams.tsx
├── EmptySearch.tsx
├── EmptyOverrides.tsx
├── EmptyNotifications.tsx
├── EmptyDashboard.tsx
└── index.ts
```

## Reference links

| Concept | URL |
| --- | --- |
| Flat illustration style ref | https://undraw.co/illustrations |
| SVG animation for empty states | https://css-tricks.com/svg-animation-for-empty-states/ |

## Acceptance Criteria

- [ ] All 7 empty states have unique inline SVG illustrations
- [ ] SVGs scale responsively (size prop)
- [ ] Color-matched to DTS-67 palette
- [ ] Accessible: role="img" + descriptive aria-label
- [ ] Idle animation respects prefers-reduced-motion
- [ ] Total bundle impact < 30 KB gzip

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
- **Labels:** cosmetics, illustrations, ui

---

_Synced from Jira by sync-jira-issues_
