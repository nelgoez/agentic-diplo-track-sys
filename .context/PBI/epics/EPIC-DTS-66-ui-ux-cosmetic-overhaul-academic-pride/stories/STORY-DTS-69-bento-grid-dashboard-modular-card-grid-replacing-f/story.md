# Bento grid dashboard — modular card grid replacing flat stats

**Jira Key:** [DTS-69](https://diplo-track-sys.atlassian.net/browse/DTS-69)
**Epic:** [DTS-66](https://diplo-track-sys.atlassian.net/browse/DTS-66) (UI/UX Cosmetic Overhaul — Academic Pride)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Bento grid dashboard — modular card grid replacing flat stats

> [!TIP] ***Biggest visual impact for logged-in users.*** Do after DTS-67.

## Objective

Replace the current flat stats row on `/app/dashboard` with a modular bento-style card grid — more visual hierarchy, more personality.

## Bento Grid Layout

### Desktop (4 columns):

Welcome card (gradient bg, greeting, UNC branding) spans left half. Three metric cards (Students: 1,247, Tracks: 12, Eligibility: 89%) fill right side. Below: Quick actions card + Recent activity card (animated list).

### Tablet (2 columns): Stacked layout with cards in 2-column grid.

### Mobile (1 column): Full-width stacked cards.

## Cards

- Welcome card: Gradient bg (blue→indigo), "Buenos días, [Nombre]", UNC branding
- Metric cards: MUI icon + number + label, hover: lift 4px
- Quick actions: Role-dependent buttons (Grade, Enroll, Sync, Override)
- Recent activity: Animated scrollable list of latest 5 events (Motion)
- Eligibility ring: Pure CSS conic gradient ring chart

## Technical

```css
.bento-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  grid-template-areas:
    "welcome  metrics metrics metrics"
    "actions  activity activity activity";
  gap: 16px;
}
```

CSS ring chart: `conic-gradient(#7BA384 0deg 320deg, #E87A6A 320deg 360deg)`

## Reference links

| Concept | URL |
| --- | --- |
| Bento grid examples | https://magicui.design/docs/components/bento-grid |
| CSS conic gradient ring | https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/conic-gradient |
| Dashboard inspiration | https://dribbble.com/search/dashboard-education |

## Acceptance Criteria

- [ ] Responsive: 4-col → 2-col → 1-col
- [ ] Cards animate in with stagger delay
- [ ] Role-appropriate content per session
- [ ] Current dashboard content migrated, nothing lost
- [ ] Hover lift works on all interactive cards

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
- **Labels:** cosmetics, dashboard, ui

---

_Synced from Jira by sync-jira-issues_
