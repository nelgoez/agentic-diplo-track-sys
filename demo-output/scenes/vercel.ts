import { chromium } from "playwright";

const AUTH_FILE = "demo-output/auth/vercel.json";
const VERCEL_URL =
  process.env.VERCEL_DASHBOARD_URL || "https://vercel.com/dashboard";

console.log("[scene:vercel] Opening Vercel dashboard...");

const browser = await chromium.launch({ headless: false });
try {
  const file = Bun.file(AUTH_FILE);
  if (!(await file.exists())) {
    console.log("[scene:vercel] No auth state found. Skipping.");
    process.exit(0);
  }

  const context = await browser.newContext({
    storageState: AUTH_FILE,
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  await page.goto(VERCEL_URL, { waitUntil: "domcontentloaded", timeout: 15000 });

  const currentUrl = page.url();
  if (currentUrl.includes("/login") || currentUrl.includes("/signin")) {
    console.log("[scene:vercel] Auth expired — redirecting to login. Skipping.");
    await context.close();
    process.exit(0);
  }

  await page.waitForTimeout(2000);

  // Scroll through dashboard
  await page.evaluate("window.scrollBy(0, 300)");
  await page.waitForTimeout(1000);
  await page.evaluate("window.scrollBy(0, 300)");
  await page.waitForTimeout(1000);

  // Navigate to deployments if possible
  const deploymentsLink = page.locator('a[href*="/deployments"]').first();
  if (await deploymentsLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    await deploymentsLink.click();
    await page.waitForTimeout(1500);
  }

  await context.close();
  console.log("[scene:vercel] Done");
} catch (err: any) {
  console.log(`[scene:vercel] Error: ${err.message}`);
} finally {
  await browser.close();
}
