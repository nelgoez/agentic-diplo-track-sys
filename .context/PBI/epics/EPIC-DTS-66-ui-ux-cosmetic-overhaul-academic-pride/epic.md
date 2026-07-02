# EPIC: UI/UX Cosmetic Overhaul — Academic Pride

**Jira Key:** [DTS-66](https://diplo-track-sys.atlassian.net/browse/DTS-66)
**Priority:** Medium
**Status:** To Do
**Total Story Points:** 0

---

## Description

# UI/UX Cosmetic Overhaul — Academic Pride

> [!NOTE] ***Design north star***
Apple's product page polish ✕ Duolingo's warmth ✕ a university crest's dignity

## Objective

Transform DTS from a functional system into a modern academic platform that balances youthful energy with institutional dignity. This epic groups 6 cosmetic improvements that can be done independently.

## Design Principles

| Principle | Meaning | Applies to |
| --- | --- | --- |
| ***Warmth without chaos*** | Gradient headers, card hover effects, micro-interactions — not rainbow noise | All pages |
| ***Academic pride*** | UNC Carolina blue as anchor, gold for achievement, warm grays over cold white | Theme foundation |
| ***Delight in details*** | Entrance animations, illustrated empty states, celebration on grade submit | Interactions |
| ***Zero heavy deps*** | MUI theme + Motion (framer-motion v12) only. No new component library | Tech decision |

## Stories

| Key | Story | Effort | Dependencies |
| --- | --- | --- | --- |
| DTS-67 | MUI theme overhaul — Carolina palette + typography | Low | None |
| DTS-68 | Landing page animation suite | Medium | DTS-67 |
| DTS-69 | Bento grid dashboard | Medium | DTS-67 |
| DTS-70 | Micro-interactions pass | Medium | DTS-67 |
| DTS-71 | Illustrated empty states | Medium | DTS-67 |
| DTS-72 | Warm gradient headers | Low | DTS-67 |

> ***SUCCESS:*** Recommended order: DTS-67 → DTS-68 (landing first for public-facing impact) → DTS-72 → DTS-69 → DTS-70 → DTS-71

## Current app URLs for reference

| Env | URL |
| --- | --- |
| Production | https://diplomatrackingsystem.qzz.io |
| Staging | https://nelgoez-diploma-tracking-sys-git-main-nelgoezs-projects.vercel.app |

## Key dependencies

- `npm install motion` (formerly framer-motion, MIT, ~15 KB gzip)
- MUI `@mui/material` — already installed
- No other new dependencies

## Acceptance Criteria

- [ ] All 6 stories deployed and tested
- [ ] No regression in existing functionality
- [ ] Consistent Carolina-blue aesthetic across all pages
- [ ] `prefers-reduced-motion` respected everywhere
- [ ] WCAG AA contrast maintained

---

## User Stories

| Key | Story | Points | Priority | Status |
| --- | ----- | ------ | -------- | ------ |
| [DTS-67](https://diplo-track-sys.atlassian.net/browse/DTS-67) | MUI theme overhaul — Carolina pride palette + typography | - | Medium | To Do |
| [DTS-68](https://diplo-track-sys.atlassian.net/browse/DTS-68) | Landing page animation suite — scroll reveals, gradient hero | - | Medium | To Do |
| [DTS-69](https://diplo-track-sys.atlassian.net/browse/DTS-69) | Bento grid dashboard — modular card grid replacing flat stats | - | Medium | To Do |
| [DTS-70](https://diplo-track-sys.atlassian.net/browse/DTS-70) | Micro-interactions pass — card lifts, button polish, grade celebration | - | Medium | To Do |
| [DTS-71](https://diplo-track-sys.atlassian.net/browse/DTS-71) | Illustrated empty states — SVG illustrations for no-data views | - | Medium | To Do |
| [DTS-72](https://diplo-track-sys.atlassian.net/browse/DTS-72) | Warm gradient headers — page-level banners replacing flat AppBar | - | Medium | To Do |

---

## Planning

- [Feature Implementation Plan (Dev)](./feature-implementation-plan.md)
- [Feature Test Plan (QA)](./feature-test-plan.md)

---

## Metadata

- **Created:** 11/6/2026
- **Updated:** 12/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez
- **Labels:** cosmetics, design, post-mvp, ui-ux

---

_Synced from Jira by sync-jira-issues_
