import { chromium } from "playwright";

const AUTH_FILE = "demo-output/auth/github.json";
const GH_ACTIONS_URL =
  process.env.GITHUB_REPO_ACTIONS ||
  "https://github.com/nahuelX/agentic-diplo-track-sys/actions";

console.log("[scene:gh-actions] Opening GitHub Actions...");

const browser = await chromium.launch({ headless: false });
try {
  const file = Bun.file(AUTH_FILE);
  if (!(await file.exists())) {
    console.log("[scene:gh-actions] No auth state found. Skipping.");
    process.exit(0);
  }

  const context = await browser.newContext({
    storageState: AUTH_FILE,
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  await page.goto(GH_ACTIONS_URL, {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  });

  const currentUrl = page.url();
  if (currentUrl.includes("/login") || currentUrl.includes("/signin")) {
    console.log("[scene:gh-actions] Auth expired — redirecting to login. Skipping.");
    await context.close();
    process.exit(0);
  }

  await page.waitForTimeout(2000);

  // Scroll through workflow runs
  await page.evaluate("window.scrollBy(0, 400)");
  await page.waitForTimeout(1000);

  // Try clicking on the latest successful workflow run
  const workflowLink = page
    .locator("a[data-hovercard-type='workflow_run']")
    .first();
  if (await workflowLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    await workflowLink.click();
    await page.waitForTimeout(2000);

    // Scroll through job details
    await page.evaluate("window.scrollBy(0, 300)");
    await page.waitForTimeout(1000);
  }

  await context.close();
  console.log("[scene:gh-actions] Done");
} catch (err: any) {
  console.log(`[scene:gh-actions] Error: ${err.message}`);
} finally {
  await browser.close();
}
