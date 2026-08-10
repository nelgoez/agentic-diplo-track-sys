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
