import { existsSync } from "node:fs";
import { $ } from "bun";
import * as readline from "node:readline/promises";
import { tryCreateOBSController } from "./obs-controller";
import { runFFmpegPipeline, saveTimestamps } from "./ffmpeg-edit";
import { runPreflight } from "./preflight";
import storyboard from "./storyboard.json";

interface Timestamp {
  sceneId: string;
  startedAt: number;
  endedAt: number;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function prompt(question: string): Promise<string> {
  const answer = await rl.question(question);
  return answer.trim();
}

function envOr(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

async function runScene(
  scene: (typeof storyboard.scenes)[0]
): Promise<void> {
  console.log(`\n[scene] ${scene.id} (${scene.type})`);
  switch (scene.type) {
    case "ahk": {
      const ahkPath = `demo-output/scenes/${scene.id}.ahk`;
      if (!existsSync(ahkPath)) {
        console.log(`  [skip] AHK script not found: ${ahkPath}`);
        return;
      }
      const ahkExe = storyboard.tools.ahkExe;
      console.log(`  Running AHK: ${ahkExe} ${ahkPath}`);
      try {
        await $`${ahkExe} ${ahkPath}`.quiet();
      } catch {
        console.log("  [warn] AHK script exited with non-zero (may be normal)");
      }
      break;
    }
    case "pw":
    case "script": {
      const scenePath = `demo-output/scenes/${scene.id}.ts`;
      if (!existsSync(scenePath)) {
        console.log(`  [skip] Scene script not found: ${scenePath}`);
        return;
      }
      try {
        await $`bun run ${scenePath}`.env({
          ...process.env,
          VERCEL_DASHBOARD_URL:
            process.env.VERCEL_DASHBOARD_URL || "",
          SUPABASE_PROJECT_URL:
            process.env.SUPABASE_URL || "",
          GITHUB_REPO_ACTIONS:
            process.env.GITHUB_REPO_ACTIONS || "",
          DTS_PROJECT_ROOT:
            process.env.DTS_PROJECT_ROOT ||
            storyboard.dtsProjectRoot,
        });
      } catch {
        console.log(`  [warn] Scene ${scene.id} failed (continuing)`);
      }
      break;
    }
    case "image": {
      console.log(`  [image] Title card for ${scene.id} — no action needed`);
      break;
    }
    default:
      console.log(`  [skip] Unknown scene type: ${scene.type}`);
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const autoYes = Bun.argv.includes("--yes") || Bun.argv.includes("-y");

  console.log("==========================================");
  console.log("  DTS Demo Pipeline — Orchestrator");
  if (autoYes) console.log("  Auto-confirm mode ON");
  console.log("==========================================");

  // ---- STAGE 0: Pre-flight ----
  const allGood = await runPreflight(storyboard);
  if (!allGood && !autoYes) {
    const input = await prompt("[!] Pre-flight issues found. Continue anyway? (y/n): ");
    if (input !== "y" && input !== "yes") {
      console.log("Aborted.");
      rl.close();
      process.exit(1);
    }
  }

  // ---- STAGE 1: Connect OBS ----
  console.log("\n[stage] Connecting to OBS...");
  const { obs: obsCtrl, useOBS } = await tryCreateOBSController(storyboard);

  // ---- STAGE 2: Ready signal ----
  console.log("\n==========================================");
  if (useOBS) {
    console.log("  OBS connected. Recording will be automatic.");
  } else {
    console.log("  OBS NOT connected. Entering MANUAL mode.");
    console.log("  Start your screen recording NOW, then press Enter.");
  }
  console.log("==========================================");

  await prompt("\nPress Enter when ready to begin the demo sequence...");
  console.log("GO! Starting demo sequence...\n");

  // ---- STAGE 3: Run scenes ----
  const timestamps: Timestamp[] = [];
  let useOBSCurrently = useOBS;

  if (useOBSCurrently) {
    try {
      await obsCtrl.startRecording();
    } catch (err: any) {
      console.error(`[obs] Start recording failed: ${err.message}`);
      console.error("[obs] Falling back to manual mode.");
      await prompt("Press Enter when you started recording manually...");
      useOBSCurrently = false;
    }
  }

  for (const scene of storyboard.scenes) {
    const startedAt = Date.now();
    console.log(`\n--- Scene: ${scene.id} ---`);

    await runScene(scene);

    const endedAt = Date.now();
    const elapsed = endedAt - startedAt;
    if (elapsed >= scene.durationSec * 1000) {
      timestamps.push({ sceneId: scene.id, startedAt, endedAt });
    } else {
      // pad to exact duration so FFmpeg trimming is predictable
      const padMs = scene.durationSec * 1000 - elapsed;
      timestamps.push({ sceneId: scene.id, startedAt, endedAt: endedAt + padMs });
      await sleep(padMs);
    }

    if (useOBSCurrently && !obsCtrl.isConnected()) {
      console.log("  [warn] OBS disconnected mid-recording. Continuing in manual mode...");
      useOBSCurrently = false;
    }

    if (timestamps.length < storyboard.scenes.length) {
      console.log(`  [gap] ${storyboard.sceneGapMs}ms pause...`);
      await sleep(storyboard.sceneGapMs);
    }
  }

  // ---- STAGE 4: Stop recording ----
  let recordingPath: string;

  if (useOBSCurrently && obsCtrl.isConnected()) {
    try {
      recordingPath = await obsCtrl.stopRecording();
      await obsCtrl.disconnect();
    } catch (err: any) {
      console.error(`[obs] Stop recording failed: ${err.message}`);
      recordingPath = await prompt("Paste the raw recording file path: ");
    }
  } else {
    console.log("\n==========================================");
    console.log("  Manual mode: Stop your recording now.");
    console.log("==========================================");
    recordingPath = await prompt("Paste the raw recording file path: ");
  }

  rl.close();

  console.log(`\n[record] Raw recording: ${recordingPath}`);

  // Save timestamps
  const timestampsPath = "demo-output/raw/timestamps.json";
  saveTimestamps(timestampsPath, timestamps);
  console.log(`[record] Timestamps saved: ${timestampsPath}`);

  // ---- STAGE 5: Post-production ----
  console.log("\n[stage] Post-production...");
  try {
    await runFFmpegPipeline(recordingPath, storyboard, timestamps);
    console.log("\n==========================================");
    console.log("  DONE!");
    console.log(`  Output: ${storyboard.output}`);
    console.log("==========================================");

    const outputPath = storyboard.output;
    if (process.platform === "win32") {
      await $`start "" "${outputPath}"`.nothrow();
    } else {
      await $`open "${outputPath}"`.nothrow();
    }
  } catch (err: any) {
    console.error(`\n[!] Post-production failed: ${err.message}`);
    console.error("[!] Raw recording preserved for manual editing.");
  }
}

main().catch((err) => {
  console.error("[!] Fatal error:", err.message);
  console.error("Raw recordings should be preserved in demo-output/raw/");
  process.exit(1);
});
