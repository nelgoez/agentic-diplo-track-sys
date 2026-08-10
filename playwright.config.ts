/**
 * Locator strategy (priority order, project-wide):
 * 1. getByRole() — preferred; mirrors accessibility tree
 * 2. getByLabel() / getByPlaceholder() — form fields
 * 3. getByText() — visible text content
 * 4. getByTestId() — last resort; use kebab-case data-testid attr
 *
 * See tests/e2e/a11y-smoke.test.ts for full data-testid convention.
 */
import type { ReporterDescription } from '@playwright/test';
import { defineConfig } from '@playwright/test';

export const A11Y_THRESHOLD = Number.parseInt(process.env.A11Y_THRESHOLD ?? '0', 10);

const reporters: ReporterDescription[] = [['line']];

if (process.env.ALLURE_DIR) {
  reporters.push(['allure-playwright', { outputFolder: process.env.ALLURE_DIR }]);
}

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 0,
  reporter: reporters,
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
