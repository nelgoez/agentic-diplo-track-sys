import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MANIFEST_PATH = resolve(import.meta.dir, '..', 'kata-manifest.json');
const OUT_DIR = process.env.TMS_OUT_DIR ?? resolve(import.meta.dir, '..', 'traceability-out');
const OUT_FILE = resolve(OUT_DIR, 'tms-sync-report.json');

interface AtcEntry {
  testId: string
  method: string
  story: string
  feature: string
}

interface StoryGroup {
  atcs: string[]
  count: number
}

interface TmsReport {
  generated: string
  stories: Record<string, StoryGroup>
  totals: { stories: number, atcs: number }
}

function loadManifest(): { components: Record<string, { atcs: AtcEntry[] }>, totals: { components: number, atcs: number } } {
  if (!existsSync(MANIFEST_PATH)) {
    throw new Error(`kata-manifest.json not found at ${MANIFEST_PATH}. Run \`bun run kata:manifest\` first.`);
  }
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
}

function buildReport(): TmsReport {
  const manifest = loadManifest();

  const storyMap = new Map<string, Set<string>>();

  for (const component of Object.values(manifest.components)) {
    for (const atc of component.atcs) {
      if (!atc.story) { continue; }
      if (!storyMap.has(atc.story)) {
        storyMap.set(atc.story, new Set());
      }
      storyMap.get(atc.story)!.add(atc.testId);
    }
  }

  const stories: Record<string, StoryGroup> = {};
  let totalAtcs = 0;

  const sortedStories = [...storyMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  for (const [storyId, atcSet] of sortedStories) {
    const sortedAtcs = [...atcSet].sort();
    stories[storyId] = {
      atcs: sortedAtcs,
      count: sortedAtcs.length,
    };
    totalAtcs += sortedAtcs.length;
  }

  return {
    generated: new Date().toISOString(),
    stories,
    totals: {
      stories: sortedStories.length,
      atcs: totalAtcs,
    },
  };
}

function outputJson(report: TmsReport): void {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

function outputMarkdown(report: TmsReport): void {
  const lines: string[] = [
    '# TMS Sync Report',
    '',
    `Generated: ${report.generated}`,
    '',
    `**${report.totals.stories} stories, ${report.totals.atcs} ATCs**`,
    '',
    '| Story | ATC Count | ATC IDs |',
    '| --- | --- | --- |',
  ];

  for (const [storyId, group] of Object.entries(report.stories)) {
    const atcLinks = group.atcs.map(id => `\`${id}\``).join(', ');
    lines.push(`| ${storyId} | ${group.count} | ${atcLinks} |`);
  }

  process.stdout.write(`${lines.join('\n')}\n`);
}

function writeReport(report: TmsReport): void {
  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }
  writeFileSync(OUT_FILE, JSON.stringify(report, null, 2), 'utf-8');
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    process.stdout.write(
      [
        'Usage: bun scripts/tms-sync.ts [flags]',
        '',
        'Flags:',
        '  --json       Output JSON report to stdout',
        '  --markdown   Output markdown table to stdout',
        '  --help       Show this help',
        '',
        'Without flags, writes traceability-out/tms-sync-report.json',
        '',
      ].join('\n'),
    );
    return 0;
  }

  const jsonMode = args.includes('--json');
  const mdMode = args.includes('--markdown');

  try {
    const report = buildReport();

    if (jsonMode) {
      outputJson(report);
    }
    else if (mdMode) {
      outputMarkdown(report);
    }
    else {
      writeReport(report);
      process.stdout.write(
        `tms-sync-report.json written — ${report.totals.stories} stories, ${report.totals.atcs} ATCs\n`,
      );
    }

    return 0;
  }
  catch (err) {
    console.error('tms-sync error:', err instanceof Error ? err.message : err);
    return 1;
  }
}

const exitCode = await main();
process.exit(exitCode);
