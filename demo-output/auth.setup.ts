import { chromium } from "playwright";

const AUTH_DIR = "demo-output/auth";

const PROFILES: Record<
  string,
  {
    name: string;
    url: string;
    description: string;
    extraChecks?: string[];
  }
> = {
  vercel: {
    name: "Vercel",
    url: "https://vercel.com/dashboard",
    description: "Vercel dashboard — shows deployments, domains, analytics",
    extraChecks: [
      "wait for .deployment-list or similar content",
    ],
  },
  supabase: {
    name: "Supabase",
    url: "https://supabase.com/dashboard/project/vbjhxlezqhkmhpuypkvf",
    description: "Supabase project — shows tables, RLS, auth, logs",
  },
  github: {
    name: "GitHub Actions",
    url: "https://github.com/nahuelX/agentic-diplo-track-sys/actions",
    description: "GitHub Actions workflow runs for CI/CD pipeline",
  },
};

async function saveAuth(profileKey: string, config: typeof PROFILES[string]) {
  console.log(`\n=== ${config.name}: ${config.description} ===`);
  console.log(`Opening: ${config.url}`);
  console.log("Log in manually, then close the browser when done.\n");

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  await page.goto(config.url, { waitUntil: "domcontentloaded" });

  console.log(">> Browser open. Log in now. Press Enter in terminal when ready...");

  process.stdin.resume();
  await new Promise<void>((resolve) => {
    process.stdin.once("data", () => resolve());
  });

  await context.storageState({ path: `${AUTH_DIR}/${profileKey}.json` });
  console.log(`[auth] Saved: ${AUTH_DIR}/${profileKey}.json`);

  await context.close();
  await browser.close();
}

async function verifyAuth(profileKey: string, config: typeof PROFILES[string]): Promise<boolean> {
  const stateFile = `${AUTH_DIR}/${profileKey}.json`;
  const file = Bun.file(stateFile);
  if (!(await file.exists())) return false;

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      storageState: stateFile,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await context.newPage();
    await page.goto(config.url, { waitUntil: "domcontentloaded", timeout: 15000 });

    const url = page.url();
    const isLoggedIn = !url.includes("/login") && !url.includes("/signin");

    await context.close();
    await browser.close();

    if (isLoggedIn) {
      console.log(`[auth] ${config.name}: valid`);
    } else {
      console.log(`[auth] ${config.name}: EXPIRED (redirected to login)`);
    }
    return isLoggedIn;
  } catch (err: any) {
    console.log(`[auth] ${config.name}: error — ${err.message}`);
    return false;
  }
}

async function main() {
  const args = Bun.argv.slice(2);
  const mode = args[0] || "check";

  if (mode === "check") {
    console.log("Checking auth states...\n");
    let allValid = true;
    for (const [key, config] of Object.entries(PROFILES)) {
      const valid = await verifyAuth(key, config);
      if (!valid) allValid = false;
    }
    if (!allValid) {
      console.log("\nSome auth states are invalid. Run: bun demo-output/auth.setup.ts setup");
      process.exit(1);
    }
    console.log("\nAll auth states valid.");
    process.exit(0);
  }

  if (mode === "setup") {
    await Bun.$`mkdir -p ${AUTH_DIR}`;
    for (const [key, config] of Object.entries(PROFILES)) {
      await saveAuth(key, config);
    }
    console.log("\nAll auth states saved.");
    process.exit(0);
  }

  console.log("Usage: bun demo-output/auth.setup.ts [check|setup]");
  process.exit(1);
}

main();
