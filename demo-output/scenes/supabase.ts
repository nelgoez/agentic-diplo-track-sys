import { chromium } from "playwright";

const AUTH_FILE = "demo-output/auth/supabase.json";
const SUPABASE_PROJECT_ID =
  process.env.SUPABASE_PROJECT_ID ||
  (process.env.SUPABASE_URL
    ? new URL(process.env.SUPABASE_URL).hostname.split(".")[0]
    : "vbjhxlezqhkmhpuypkvf");

const SUPABASE_URL = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`;

console.log("[scene:supabase] Opening Supabase dashboard...");

const browser = await chromium.launch({ headless: false });
try {
  const file = Bun.file(AUTH_FILE);
  if (!(await file.exists())) {
    console.log("[scene:supabase] No auth state found. Skipping.");
    process.exit(0);
  }

  const context = await browser.newContext({
    storageState: AUTH_FILE,
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  await page.goto(SUPABASE_URL, {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  });

  const currentUrl = page.url();
  if (currentUrl.includes("/login") || currentUrl.includes("/signin")) {
    console.log("[scene:supabase] Auth expired — redirecting to login. Skipping.");
    await context.close();
    process.exit(0);
  }

  await page.waitForTimeout(2000);

  // Try navigating to Table Editor
  const tableEditorLink = page.locator('a[href*="/editor"]').first();
  if (await tableEditorLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    await tableEditorLink.click();
    await page.waitForTimeout(2000);
  }

  // Try navigating to Authentication
  await page.goto(
    `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/auth/users`,
    { waitUntil: "domcontentloaded", timeout: 10000 }
  );
  await page.waitForTimeout(2000);

  // Try navigating to SQL Editor
  await page.goto(
    `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`,
    { waitUntil: "domcontentloaded", timeout: 10000 }
  );
  await page.waitForTimeout(1500);

  await context.close();
  console.log("[scene:supabase] Done");
} catch (err: any) {
  console.log(`[scene:supabase] Error: ${err.message}`);
} finally {
  await browser.close();
}
