import { assertNoA11yViolations, checkA11y } from '@dts/test-kit';
import { expect, test } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? '';
const A11Y_THRESHOLD = Number.parseInt(process.env.A11Y_THRESHOLD ?? '0', 10);

test.describe('a11y — smoke', () => {
  test('login page has no a11y violations', async ({ page }) => {
    test.skip(!BASE_URL, 'BASE_URL not set');
    await page.goto(`${BASE_URL}/login`);
    const result = await checkA11y(page);
    assertNoA11yViolations(result, 'login page');
    expect(result.violations.length).toBeLessThanOrEqual(A11Y_THRESHOLD);
  });
});
