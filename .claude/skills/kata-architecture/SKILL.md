---
name: kata-architecture
description: 'Test automation framework using KATA (Komponent Action Test Architecture): 4-layer architecture (TestContext→ApiBase/UiBase→YourApi/YourPage→TestFixture), ATC pattern with @atc decorator, Playwright integration, and API/E2E testing patterns. Triggers on: `kata framework`, `test automation`, `ATC`, `@atc decorator`, `Playwright automation`, `test architecture`, `kata-architecture`, `implementar automation tests`, `automation patterns`. Do NOT use for: exploratory testing (use `/exploratory-testing`), test documentation (use `/test-documentation`), manual testing (use `/exploratory-testing`), or unit testing (use `/unit-testing`).'
license: MIT
compatibility: [claude-code, opencode]
phase: testing
---

# KATA Architecture — Test Automation Framework

`kata-architecture` implements test automation using the KATA framework (Komponent Action Test Architecture): a 4-layer architecture for Playwright-based test automation with ATCs (Acceptance Test Components), type-safe API helpers, and traceability to Jira/Xray.

Source content migrated from:
- `.books/fase-12-test-automation/test-automation.MANUAL.md`
- `.prompts/fase-12-test-automation/` (planning/, e2e/, integration/, regression/)
- `.context/guidelines/TAE/` (kata-architecture.md, kata-ai-index.md, api-testing-patterns.md, e2e-testing-patterns.md, automation-standards.md)

---

## Dependencies

Requires `agentic-dev-core`. Run this skill AFTER exploratory testing (`/exploratory-testing`) and test documentation (`/test-documentation`) — only automate functionality validated manually and documented.

---

## Architecture Overview

```
Layer 4: Fixtures (TestFixture, ApiFixture, UiFixture)
    └── Dependency injection, Playwright test extension
        ↓
Layer 3: Specific Components (AuthApi, LoginPage)
    └── ATCs with @atc decorator + fixed assertions
        ↓
Layer 2: Base Classes (ApiBase, UiBase)
    └── HTTP helpers (type-safe generics), Playwright helpers
        ↓
Layer 1: TestContext
    └── Configuration, data generation (Faker), environment
```

### Directory Structure
```
tests/
├── components/
│   ├── TestContext.ts       # Layer 1: Config, Faker, Environment
│   ├── TestFixture.ts       # Layer 4: Unified DI entry point
│   ├── ApiFixture.ts        # Layer 4: API-only DI
│   ├── UiFixture.ts         # Layer 4: UI-only DI
│   ├── api/
│   │   ├── ApiBase.ts       # Layer 2: Type-safe HTTP methods
│   │   └── AuthApi.ts       # Layer 3: API ATCs
│   ├── ui/
│   │   ├── UiBase.ts        # Layer 2: Page helpers
│   │   └── LoginPage.ts     # Layer 3: UI ATCs
│   └── steps/               # Layer 3.5: Reusable ATC chains (optional)
├── e2e/                     # E2E tests (browser)
├── integration/             # API-only tests (no browser)
├── data/                    # Test data files
└── utils/
    ├── decorators.ts        # @atc, @step decorators
    └── KataReporter.ts      # Custom reporter
```

---

## Key Concepts

### ATC (Atomic Test Component)
An ATC is a method representing **ONE unique expected outcome**:

```typescript
@atc('TEST-001')  // Maps to Jira Test ID
async loginSuccessfully(credentials: LoginCredentials) {
  await this.page.locator('#email').fill(credentials.email);
  await this.page.locator('#password').fill(credentials.password);
  await this.page.locator('button[type="submit"]').click();
  await expect(this.page).toHaveURL(/.*dashboard.*/);  // Fixed assertion
}
```

### KATA Principles
| Principle | ✅ Do | ❌ Don't |
|-----------|------|---------|
| **Unique Output** | Each ATC = 1 outcome | `loginAndDoStuff` |
| **Inline Locators** | Locators inside ATC | Separate locator files |
| **No Helpers** | `page.click()` direct | `clickButton()` wrapper |
| **No ATC calls ATC** | Independent ATCs | `loginATC()` inside `checkoutATC()` |
| **Fixed Assertions** | Assertions in ATC | Assertions only in test file |

### API Testing Patterns
Type-safe HTTP methods returning tuples:
```typescript
@atc('TEST-010')
async createOrderSuccessfully(payload: CreateOrderPayload) {
  const [response, body, sentPayload] = await this.apiPOST<OrderResponse, CreateOrderPayload>(
    '/orders', payload
  );
  expect(response.status()).toBe(201);
  expect(body.id).toBeDefined();
  return [response, body, sentPayload];
}
```

| Method | Return | Use Case |
|--------|--------|----------|
| `apiGET` | `[APIResponse, TBody]` | Read |
| `apiPOST` | `[APIResponse, TBody, TPayload]` | Create |
| `apiPUT` | `[APIResponse, TBody, TPayload]` | Full update |
| `apiPATCH` | `[APIResponse, TBody, TPayload]` | Partial update |
| `apiDELETE` | `[APIResponse, TBody]` | Delete |

### E2E Testing Patterns
- Use Playwright auto-wait (no `waitForTimeout`)
- `data-testid` preferred for locators
- Hybrid testing: API for setup, UI for flow, API for verification
- Fixture lazy loading: `{ api }` won't open browser

### Fixed Assertions vs Test-Level Assertions
- **Fixed** (inside ATC): Validate ATC worked — status codes, required fields
- **Test-level** (in test file): Validate combined flow results — business rules, final state

### Fixture Selection
| Test Type | Fixture | Browser? |
|-----------|---------|----------|
| API only | `{ api }` | No |
| UI only | `{ ui }` | Yes |
| Hybrid | `{ test: fixture }` | Yes |

---

## Workflow

### Phase 1: Understand Test Case
Read the documented test from Jira: preconditions, steps, assertions, test data.

### Phase 2: Identify Locators
Use DevTools to find locators by priority: `data-testid` > `id` > `role+text` > CSS > XPath.

### Phase 3: Implement Component
Create/modify UI or API component with ATC(s). Each ATC uses `@atc('TEST-XXX')` decorator.

### Phase 4: Register in Fixture
Add component to `UiFixture` or `ApiFixture` and propagate request context/auth token.

### Phase 5: Create Test File
Import from `@TestFixture`, follow AAA pattern (Arrange-Act-Assert), use tags (`@critical`, `@smoke`).

### Phase 6: Execute & Validate
```bash
bun run test tests/e2e/auth/login.test.ts
bun run test tests/e2e/auth/login.test.ts --headed
bun run test tests/e2e/auth/login.test.ts --grep @critical
```

### Phase 7: Update Jira
Transit test status CANDIDATE → AUTOMATED, add label `automated`, add comment with file path.

---

## Tool Resolution

| Tag | Primary | Fallback |
|-----|---------|----------|
| `[AUTOMATION_TOOL]` | `/playwright-cli` | MCP Playwright |
| `[API_TOOL]` | curl + OpenAPI types | Postman manual |
| `[DB_TOOL]` | Supabase MCP | raw SQL via Supabase CLI |
| `[ISSUE_TRACKER_TOOL]` | `/acli` | MCP Atlassian |

### ATC Naming Conventions

| Scenario | Pattern | Example |
|----------|---------|---------|
| Success | `{action}Successfully` | `loginSuccessfully` |
| Invalid input | `{action}WithInvalid{X}` | `loginWithInvalidCredentials` |
| Not found | `{action}WithNonExistent{X}` | `getUserWithNonExistentId` |
| Unauthorized | `{action}Unauthorized` | `getBookingsUnauthorized` |
| Empty state | `view{Resource}EmptyState` | `viewBookingsEmptyState` |

### ATC vs @step Decorator
| Aspect | `@atc` | `@step` |
|--------|--------|---------|
| Purpose | TMS traceability + tracing | Method tracing only |
| Output | `ATC [TEST-001]: methodName(args)` | `methodName(args)` |
| NDJSON results | Yes | No |
| Apply to | Layer 3 ATCs (state-changing) | Layer 3 helpers (read-only) |
