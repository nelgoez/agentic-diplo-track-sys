import { checkA11y } from '@dts/test-kit';
import { expect, test } from '@playwright/test';
import { A11Y_THRESHOLD } from '../../playwright.config';

const BASE_URL = process.env.BASE_URL ?? '';

test.describe('a11y — smoke', () => {
  test('login page has no a11y violations', async ({ page }) => {
    test.skip(!BASE_URL, 'BASE_URL not set');
    await page.goto(`${BASE_URL}/login`);
    const result = await checkA11y(page);
    expect(result.violations.length).toBeLessThanOrEqual(A11Y_THRESHOLD);
  });
});
