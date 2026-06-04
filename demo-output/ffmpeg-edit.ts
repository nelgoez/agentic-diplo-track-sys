import { $ } from "bun";
import { readFileSync, existsSync, mkdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";

interface SceneDef {
  id: string;
  type: string;
  durationSec: number;
  speedMultiplier: number;
  title?: string;
  subtitle?: string;
  chapter?: string;
}

interface Timestamp {
  sceneId: string;
  startedAt: number;
  endedAt: number;
}

interface Storyboard {
  scenes: SceneDef[];
  rawDir: string;
  titlesDir: string;
  output: string;
  recording: { width: number; height: number; fps: number; crf: number; preset: string };
}

export async function runFFmpegPipeline(
  recordingPath: string,
  storyboard: Storyboard,
  timestamps: Timestamp[]
): Promise<string> {
  const output = storyboard.output;
  mkdirSync("demo-output/tmp", { recursive: true });

  const segments: string[] = [];
  const instructions: string[] = [];
  let segmentIndex = 0;

  for (let i = 0; i < timestamps.length; i++) {
    const ts = timestamps[i];
    const scene = storyboard.scenes[i];
    if (!scene) break;

    const startOffset = (ts.startedAt - timestamps[0].startedAt) / 1000;
    const duration = (ts.endedAt - ts.startedAt) / 1000;
    const speed = scene.speedMultiplier;

    if (speed === 1) {
      segments.push(
        `[0:v]trim=start=${startOffset}:duration=${duration},setpts=PTS/1[s${segmentIndex}];`
      );
    } else {
      segments.push(
        `[0:v]trim=start=${startOffset}:duration=${duration},setpts=PTS/${speed}[s${segmentIndex}];`
      );
    }

    const titlePath = join(storyboard.titlesDir, `title-${String(i + 1).padStart(2, "0")}-${scene.id}.png`);
    if (existsSync(titlePath) && scene.type === "image") {
      instructions.push(
        `[s${segmentIndex}][${segmentIndex}:v]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,${duration / speed})'[t${segmentIndex}];`
      );
    }

    segmentIndex++;
  }

  const concatInputs = Array.from({ length: segmentIndex }, (_, j) => `[s${j}]`).join("");
  const filterComplex = `${segments.join("")}${instructions.join("")}${concatInputs}concat=n=${segmentIndex}:v=1:a=0[outv]`;

  const cmd = [
    `ffmpeg`,
    `-y`,
    `-i "${recordingPath}"`,
    `-filter_complex "${filterComplex}"`,
    `-map "[outv]"`,
    `-c:v libx264`,
    `-crf ${storyboard.recording.crf}`,
    `-preset ${storyboard.recording.preset}`,
    `-pix_fmt yuv420p`,
    `"${output}"`,
  ].join(" ");

  console.log("[ffmpeg] Starting post-production...");
  console.log(`[ffmpeg] Input: ${recordingPath}`);
  console.log(`[ffmpeg] Output: ${output}`);

  try {
    await $`${{ raw: cmd }}`;
    console.log(`[ffmpeg] Done: ${output}`);
  } catch (err: any) {
    console.error(`[ffmpeg] Error: ${err.message}`);
    console.error("[ffmpeg] Raw recording preserved in demo-output/raw/");
    throw err;
  }

  try {
    const stat = await Bun.file(output).stat();
    const sizeMB = (stat.size / 1024 / 1024).toFixed(1);
    const durationSec = timestamps.reduce(
      (acc, ts, i) => acc + (ts.endedAt - ts.startedAt) / 1000 / (storyboard.scenes[i]?.speedMultiplier ?? 1),
      0
    );
    console.log(`[ffmpeg] Final: ${durationSec.toFixed(0)}s, ${sizeMB}MB`);
  } catch {
    // stat may fail if file is still being written
  }

  return output;
}

export function loadTimestamps(path: string): Timestamp[] {
  return JSON.parse(readFileSync(path, "utf-8"));
}

export function saveTimestamps(path: string, timestamps: Timestamp[]): void {
  Bun.write(path, JSON.stringify(timestamps, null, 2));
}
