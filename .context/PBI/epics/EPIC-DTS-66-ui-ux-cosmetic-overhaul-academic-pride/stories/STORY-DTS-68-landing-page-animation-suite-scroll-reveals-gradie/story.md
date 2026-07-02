# Landing page animation suite — scroll reveals, gradient hero

**Jira Key:** [DTS-68](https://diplo-track-sys.atlassian.net/browse/DTS-68)
**Epic:** [DTS-66](https://diplo-track-sys.atlassian.net/browse/DTS-66) (UI/UX Cosmetic Overhaul — Academic Pride)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Landing page animation suite — scroll reveals, gradient hero

> [!TIP] ***Public-facing first impression.*** Do after DTS-67 theme is applied.

## Objective

Add entrance animations and visual polish to the public landing page (/) without changing its structure or content.

## Animations

| Section | Animation | Trigger | Duration |
| --- | --- | --- | --- |
| Hero | Gradient bg shift (blue → indigo slow cycle) | On load | 8s loop |
| Feature cards | Staggered fade-in + slide-up (y: 40 → 0) | On scroll, 100ms stagger | 500ms each |
| CTA buttons | Subtle scale(1.02) + glow on hover | Hover | 200ms |
| Stats counters | Animated count-up (0 → final number) | On scroll into view | 1.5s ease-out |

## Motion concept

Hero section fades in and slides up. Feature cards appear staggered one by one as you scroll. Stats count up from zero when they enter view. All smooth, none distracting.

## Technical

```bash
npm install motion
```

```tsx
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
>
  <FeatureCard />
</motion.div>
```

### Reduced motion

Motion automatically respects `prefers-reduced-motion: reduce` via `useReducedMotion()`.

## Reference links

| Concept | URL |
| --- | --- |
| Motion.dev docs | https://motion.dev |
| Scroll animation examples | https://motion.dev/examples |
| Landing page design inspo | https://dribbble.com/search/educational-landing-page |

## Acceptance Criteria

- [ ] Landing page loads without layout shift (CLS < 0.1)
- [ ] Animations play once on scroll, do not retrigger
- [ ] Works on mobile Chrome + Safari
- [ ] prefers-reduced-motion: reduce disables ALL animations
- [ ] Motion package in dependencies, not devDependencies

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
- **Labels:** animation, cosmetics, landing-page

---

_Synced from Jira by sync-jira-issues_
