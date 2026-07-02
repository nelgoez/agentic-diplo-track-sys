# Micro-interactions pass — card lifts, button polish, grade celebration

**Jira Key:** [DTS-70](https://diplo-track-sys.atlassian.net/browse/DTS-70)
**Epic:** [DTS-66](https://diplo-track-sys.atlassian.net/browse/DTS-66) (UI/UX Cosmetic Overhaul — Academic Pride)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Micro-interactions pass — card lifts, button polish, grade celebration

> [!TIP] ***The "polish pass."*** Do after DTS-67.

## Objective

Add subtle interactive delight across the app — small animations that make DTS feel responsive and premium without being distracting.

## Interactions

| Interaction | Element | Approach |
| --- | --- | --- |
| Card hover lift | All Paper/Card | Motion `whileHover={{ y: -4 }}` + shadow increase |
| Button press | All buttons | CSS `transform: scale(0.97)` on `:active` |
| Loading transition | Async buttons | Spinner + opacity dim on parent |
| Grade celebration | Enrollment grade submit | CSS keyframe pulse + particle burst + badge flip |
| Table row hover | MUI TableRow | Background transition (existing, enhanced) |

## Grade celebration — the hero micro-interaction

### On pass (grade >= 4):

- Card pulses green glow twice (boxShadow animation)
- Status badge flips: [Inscripto] → [Aprobado] (CSS rotateY animation)
- 3 gold CSS particle dots burst outward and fade
- Toast: "¡Aprobado! Diploma pendiente"

### On fail (grade < 4):

- Card pulses coral once
- Status badge flips: [Inscripto] → [Desaprobado]
- Toast: "Desaprobado. Puede reinscribirse."

### Implementation

CSS keyframes for pulse, burst, and flip — zero JS dependencies. All under 2 seconds duration.

### Shared AnimatedCard wrapper

```tsx
export function AnimatedCard({ children, ...props }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Paper elevation={1} sx={{ borderRadius: 3 }}>
        {children}
      </Paper>
    </motion.div>
  );
}
```

### Reduced motion

Use `useReducedMotion()` from Motion — if true, render plain Paper without motion wrapper.

## Reference links

| Concept | URL |
| --- | --- |
| Motion hover examples | https://motion.dev/examples#gestures |
| CSS keyframe animation | https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes |

## Acceptance Criteria

- [ ] Every hoverable card has lift effect (y: -4px)
- [ ] Grade celebration plays < 2 seconds
- [ ] 60fps on mid-range device
- [ ] prefers-reduced-motion disables ALL micro-interactions
- [ ] No layout shift from animations

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
- **Labels:** animation, cosmetics, micro-interactions

---

_Synced from Jira by sync-jira-issues_
