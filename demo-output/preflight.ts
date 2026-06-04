import { existsSync } from "node:fs";
import { join } from "node:path";

interface ToolCheck {
  name: string;
  path: string;
  required: boolean;
  fix?: string;
}

export async function runPreflight(storyboard: any): Promise<boolean> {
  console.log("\n=== PRE-FLIGHT CHECKLIST ===\n");

  const tools: ToolCheck[] = [
    {
      name: "ffmpeg",
      path: "ffmpeg",
      required: true,
      fix: "winget install --id Gyan.FFmpeg",
    },
    {
      name: "bun",
      path: "bun",
      required: true,
      fix: "curl -fsSL https://bun.sh/install | bash",
    },
    {
      name: "AutoHotkey",
      path: storyboard.tools.ahkExe,
      required: false,
      fix: "winget install AutoHotkey.AutoHotkey",
    },
    {
      name: "VS Code (code)",
      path: "code",
      required: false,
      fix: "winget install Microsoft.VisualStudioCode",
    },
    {
      name: "Playwright",
      path: "demo-output/node_modules/playwright",
      required: true,
      fix: "cd demo-output && bun install && npx playwright install chromium",
    },
    {
      name: "obs-websocket-js",
      path: "demo-output/node_modules/obs-websocket-js",
      required: true,
      fix: "cd demo-output && bun install",
    },
  ];

  let allPassed = true;

  for (const tool of tools) {
    const found = await checkTool(tool);
    if (!found && tool.required) allPassed = false;
  }

  // Disk space
  await checkDiskSpace("demo-output/raw");

  // Auth states
  console.log("[preflight] Checking auth states...");
  for (const profile of ["vercel", "supabase", "github"]) {
    const authFile = join("demo-output/auth", `${profile}.json`);
    if (existsSync(authFile)) {
      console.log(`  [✓] auth/${profile}.json exists`);
    } else {
      console.log(`  [✗] auth/${profile}.json missing`);
      allPassed = false;
    }
  }

  // DTS project root
  if (existsSync(storyboard.dtsProjectRoot)) {
    console.log(`  [✓] DTS project: ${storyboard.dtsProjectRoot}`);
  } else {
    console.log(`  [✗] DTS project not found: ${storyboard.dtsProjectRoot}`);
    allPassed = false;
  }

  // Git clean check
  const gitCheck = await checkGitClean(storyboard.dtsProjectRoot);

  // Write title card images
  console.log(`  [ ] Generating title cards...`);
  try {
    const pythonExe = process.platform === "win32" ? "py" : "python3";
    await Bun.$`${pythonExe} demo-output/generate-titles.py --all`.nothrow();
  } catch {
    // ignore — titles might already exist
  }

  // Verify title files exist
  const titleFiles = [
    "demo-output/titles/title-01-intro.png",
    "demo-output/titles/title-02-vscode.png",
    "demo-output/titles/title-07-outro.png",
  ];
  const titlesExist = titleFiles.filter((f) => existsSync(f)).length;
  if (titlesExist === titleFiles.length) {
    console.log(`  [✓] Title cards generated (7 total)`);
  } else {
    console.log(`  [✗] Title card generation failed (${titlesExist}/${titleFiles.length} found)`);
  }

  // Focus assist
  console.log(`  [ ] Focus Assist: make sure notifications are suppressed`);
  console.log(`       Settings → System → Focus Assist → Alarms only`);

  console.log("\n=== PRE-FLIGHT COMPLETE ===\n");

  if (!allPassed) {
    console.log("Fix issues above before running: bun demo-output/orchestrator.ts\n");
  }

  return allPassed;
}

async function checkTool(tool: ToolCheck): Promise<boolean> {
  const label = tool.required ? "REQUIRED" : "optional";
  try {
    if (tool.path.endsWith(".exe")) {
      if (existsSync(tool.path)) {
        console.log(`  [✓] ${tool.name} (${label}): ${tool.path}`);
        return true;
      }
    } else if (tool.path.includes("node_modules")) {
      if (existsSync(tool.path)) {
        console.log(`  [✓] ${tool.name} (${label})`);
        return true;
      }
    } else {
      const result = await Bun.$`where ${tool.path}`.quiet();
      if (result.exitCode === 0) {
        console.log(`  [✓] ${tool.name} (${label})`);
        return true;
      }
    }
  } catch {
    // not found
  }

  console.log(`  [✗] ${tool.name} (${label}) NOT FOUND`);
  if (tool.fix) {
    console.log(`       Fix: ${tool.fix}`);
  }
  return false;
}

async function checkDiskSpace(dir: string): Promise<void> {
  try {
    const result =
      await Bun.$`powershell -Command "Get-PSDrive -Name C | Select-Object -ExpandProperty Free"`.quiet();
    const freeBytes = parseInt(result.stdout.toString().trim());
    const freeGB = freeBytes / 1024 / 1024 / 1024;
    if (freeGB < 2) {
      console.log(`  [✗] Disk space: ${freeGB.toFixed(1)} GB free (need ≥ 2 GB)`);
    } else {
      console.log(`  [✓] Disk space: ${freeGB.toFixed(1)} GB free`);
    }
  } catch {
    console.log(`  [?] Could not check disk space`);
  }
}

async function checkGitClean(projectRoot: string): Promise<void> {
  try {
    const { stdout } =
      await Bun.$`git -C "${projectRoot}" status --porcelain`.quiet();
    const changes = String(stdout).trim();
    if (changes) {
      console.log(`  [!] Git has uncommitted changes. Consider stashing before recording.`);
    } else {
      console.log(`  [✓] Git working tree clean`);
    }
  } catch {
    console.log(`  [?] Could not check git status`);
  }
}

// Self-executing when run directly
if (import.meta.main) {
  const storyboard = await import("./storyboard.json");
  await runPreflight(storyboard.default);
}
