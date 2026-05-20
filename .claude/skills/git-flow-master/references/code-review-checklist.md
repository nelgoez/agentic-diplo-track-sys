# Code Review Checklist — Static Analysis Reference

> Reference doc for performing static code review before merge.
> Source: `.books/fase-8-code-review/` + `.prompts/fase-8-code-review/`

---

## 1. Review Scope

```
CODE REVIEW (Static)                     NOT Review (Dynamic)
├── Linting                              ├── Unit tests
├── Code standards                       ├── Integration tests
├── TypeScript types                     ├── E2E tests
├── Security patterns                    ├── Coverage reports
├── Architecture                         └── Performance tests
├── DRY principles
└── data-testid attributes
```

## 2. Pre-Review Setup

### ESLint + Prettier Configuration
If not already configured:
- Install: `eslint`, `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier`
- For Next.js: `eslint-config-next`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`
- Create `.eslintrc.json` with appropriate config (Next.js or React+Vite)
- Create `.prettierrc` with team preferences
- Add scripts to `package.json`: `lint`, `lint:fix`, `format`

### Required Preconditions
- Story fully implemented (Fase 7)
- Build successful with no TypeScript errors
- Functionality manually validated
- Unit tests passing

## 3. Review Checklist (In Order)

### 3.1 Acceptance Criteria Compliance
- [ ] Every AC from story.md is implemented
- [ ] Edge cases considered
- [ ] **CRITICAL**: If any AC is not met → CHANGES REQUESTED

### 3.2 Linting & Build
- [ ] `npm run lint` runs without errors (warnings are acceptable)
- [ ] `npm run build` is successful
- [ ] No TypeScript compilation errors

### 3.3 Code Standards

**DRY (Don't Repeat Yourself):**
- [ ] No duplicate code
- [ ] Repeated logic extracted to reusable functions
- [ ] UI components reuse design system

**Naming Conventions:**
| Type | Convention | Example |
|------|-----------|---------|
| Variables | camelCase | `userData`, `isLoading` |
| Functions | camelCase + verb | `getUserData`, `handleClick` |
| Components | PascalCase | `MentorCard`, `LoginForm` |
| Constants | UPPER_SNAKE | `MAX_RETRIES`, `API_URL` |

**TypeScript Strict:**
- [ ] No `any` type (exceptions justified with comment)
- [ ] Explicit types on params and returns
- [ ] Interfaces/types for complex objects
- [ ] No `@ts-ignore` without explanatory comment

**Error Handling:**
- [ ] try-catch on async operations
- [ ] No `console.error()` — use appropriate logger
- [ ] Specific errors, not generic
- [ ] Useful error messages for debugging

**Magic Numbers & Hardcoding:**
- [ ] No hardcoded values — use constants/env vars
- [ ] No API keys/secrets in code
- [ ] Configuration in appropriate files

### 3.4 Architecture & Structure
- [ ] Correct folder structure per project conventions
- [ ] Separation of concerns: UI ≠ Logic ≠ Data
- [ ] Reusable components (no duplication)
- [ ] Organized imports (React → libraries → local)

### 3.5 Security (CRITICAL)
- [ ] **NO secrets hardcoded** (API keys, tokens, passwords) — **BLOCKER**
- [ ] User input validated (sanitization)
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (no `dangerouslySetInnerHTML` without sanitization)
- [ ] Auth checks on protected routes

### 3.6 Performance
- [ ] No unnecessary or nested complex loops (O(n²))
- [ ] React: `useMemo`/`useCallback` for expensive calculations
- [ ] No unnecessary data refetching
- [ ] No N+1 queries
- [ ] Lazy loading for heavy components

### 3.7 UI/UX (If applicable)
- [ ] Uses design system components (not raw HTML with custom classes)
- [ ] Correct color palette (theme tokens, not hardcoded colors)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states (skeleton, spinner)
- [ ] Error states (message + retry)
- [ ] Empty states (message + CTA)
- [ ] Accessibility basics: labels, alt text, keyboard navigation

### 3.8 data-testid for E2E Testing
- [ ] Domain components (MentorCard, LoginForm) have `data-testid` in their **definition**
- [ ] UI base components (Button, Card) receive `data-testid` where **used**, not in definition
- [ ] Correct naming:
  - Root: `camelCase` (`data-testid="mentorCard"`)
  - Internal: `snake_case` (`data-testid="submit_button"`)
- [ ] NO dynamic IDs ❌ `data-testid={`card-${id}`}`

### 3.9 Code Quality
- [ ] Functions under 50 lines
- [ ] Self-documenting code (comments only where necessary)
- [ ] No commented-out code
- [ ] No stray console.logs
- [ ] Unused imports removed

## 4. Severity Levels

| Level | Symbol | Criteria | Action |
|-------|--------|----------|--------|
| **CRITICAL** | 🚨 | Security issue, build broken, AC not met | CHANGES REQUESTED |
| **MEDIUM** | ⚠️ | DRY violation, naming, `any` type | Should fix |
| **NITPICK** | 💡 | Style, comments, minor improvements | Optional |

## 5. Review Report Template

```markdown
# Code Review: STORY-{KEY}-{name}

**Reviewer:** [Name]
**Date:** [Date]

## Decision
- [ ] ✅ APPROVED
- [ ] ⚠️ APPROVED with comments
- [ ] ❌ CHANGES REQUESTED

## AC Compliance
| AC | Status | Notes |
|----|--------|-------|
| AC1 | ✅ | ... |

## Issues Found
### 🚨 CRITICAL (N)
### ⚠️ MEDIUM (N)
### 💡 NITPICKS (N)

## Positives
- ✅ Good separation of concerns
- ✅ Design system used correctly

## Linting & Build
- ESLint: ✅ / ❌
- TypeScript: ✅ / ❌
- Build: ✅ / ❌
```

## 6. Effective Review Tips
- Be specific: cite `file:line_number`
- Explain the why, not just the what
- Suggest solutions, not just problems
- CRITICAL = blocker, MEDIUM = should fix, NITPICK = optional
