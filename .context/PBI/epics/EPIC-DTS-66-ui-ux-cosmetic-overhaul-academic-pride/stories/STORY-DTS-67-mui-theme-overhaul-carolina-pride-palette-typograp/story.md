# MUI theme overhaul — Carolina pride palette + typography

**Jira Key:** [DTS-67](https://diplo-track-sys.atlassian.net/browse/DTS-67)
**Epic:** [DTS-66](https://diplo-track-sys.atlassian.net/browse/DTS-66) (UI/UX Cosmetic Overhaul — Academic Pride)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# MUI theme overhaul — Carolina pride palette + typography

> [!TIP] ***Start here — this is the foundation for all other cosmetic stories.***

## Objective

Replace MUI default theme with a custom UNC-inspired palette that balances youthful energy with academic dignity. This is a single-file change (`theme.ts`) that ripples across all components.

## Color Palette

| Token | Color | Hex | Usage |
| --- | --- | --- | --- |
| Primary | Carolina Blue | `#4B9CD3` | Buttons, links, AppBar, active states |
| Primary dark | Deep Blue | `#2B6DAE` | Hover states, gradient ends |
| Secondary | Achievement Gold | `#D4A843` | Badges, certificates, achievements |
| Tertiary | Sage Green | `#7BA384` | Passed exams, growth indicators |
| Accent | Muted Coral | `#E87A6A` | Warnings, energy accents (not errors) |
| Neutral bg | Warm Gray | `#F5F3F0` | Page backgrounds (replaces cold #f5f5f5) |
| Surface | Off-white | `#FAFAF8` | Card backgrounds |
| Success | Forest Green | `#2E7D5B` | Approval states |
| Error | Deep Rose | `#C8434A` | Error states |

***Color palette reference***: https://coolors.co/palette/4b9cd3-2b6dae-d4a843-7ba384-e87a6a

## Gradients

| Usage | Gradient |
| --- | --- |
| Page headers | `linear-gradient(135deg, #4B9CD3, #2B6DAE, #1B4F8A)` |
| Achievement cards | `linear-gradient(135deg, #D4A843, #F5E6C8)` |
| Success flash | `background-color: #2E7D5B` with opacity transition |

## Typography

| Level | Font | Fallback |
| --- | --- | --- |
| Headings (h1-h4) | ***DM Sans**** or ****Outfit*** | sans-serif |
| Body text | ***Inter*** (keep existing) | sans-serif |
| Monospace | ***JetBrains Mono*** | `'Courier New', monospace` |

***DM Sans on Google Fonts***: https://fonts.google.com/specimen/DM+Sans

## Implementation

```typescript
import { createTheme, augmentColor } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#4B9CD3' },
    secondary: { main: '#D4A843' },
    custom: {
      tertiary: augmentColor({ color: { main: '#7BA384' } }),
      accent: augmentColor({ color: { main: '#E87A6A' } }),
    },
    background: { default: '#FAFAF8', paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: '"DM Sans", "Inter", sans-serif',
    h1: { fontWeight: 700 },
  },
  shape: { borderRadius: 10 },
  cssVariables: true,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { transition: 'box-shadow 0.2s ease, transform 0.2s ease' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
      },
    },
  },
});
```

## Acceptance Criteria

- [ ] All MUI components reflect new palette (buttons, cards, tables, chips, badges, AppBar)
- [ ] Light mode only (dark mode out of scope)
- [ ] No regressions — every page renders correctly
- [ ] WCAG AA contrast on all text elements
- [ ] Palette approved by visual check on production/staging

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
- **Labels:** cosmetics, mui, theme

---

_Synced from Jira by sync-jira-issues_
