/**
 * E2E Accessibility Smoke Tests
 *
 * ## Locator strategy (priority order)
 * 1. `getByRole()` — preferred; reflects how AT users perceive the UI
 * 2. `getByLabel()` — for form fields with visible or aria-label
 * 3. `getByTestId()` — last resort for elements with no accessible role/label
 *    Convention: `data-testid` in kebab-case, e.g. `<div data-testid="login-form">`
 *    Avoid `data-testid` when a semantic role or label already identifies the element.
 *
 * ## data-testid convention
 * - Format: kebab-case, component-context-purpose (e.g. `data-testid="login-submit-btn"`)
 * - Only add when getByRole/getByLabel cannot uniquely identify the element
 * - Never use for layout/styling — only for test hooks
 */
import { checkA11y } from '@dts/test-kit';
import { expect, test } from '@playwright/test';
import { A11Y_THRESHOLD } from '../../playwright.config';

const BASE_URL = process.env.BASE_URL ?? '';

test.describe('a11y — smoke', { tag: ['@critical', '@a11y'] }, () => {
  test('login page has no a11y violations', async ({ page }) => {
    test.skip(!BASE_URL, 'BASE_URL not set');
    await page.goto(`${BASE_URL}/login`);
    const result = await checkA11y(page);
    expect(result.violations.length).toBeLessThanOrEqual(A11Y_THRESHOLD);
  });
});
