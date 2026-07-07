import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const JIRA_BASE = process.env.JIRA_URL ?? 'https://diplo-track-sys.atlassian.net/browse';

function scanAtcDeclarations(dir: string): Array<{ atcName: string, testId: string, story: string, feature: string, source: string }> {
  const results: Array<{ atcName: string, testId: string, story: string, feature: string, source: string }> = [];

  function walk(path: string) {
    const entries = readdirSync(path, { withFileTypes: true });
    for (const e of entries) {
      const full = resolve(path, e.name);
      if (e.isDirectory() && !e.name.startsWith('node_modules') && !e.name.startsWith('.')) {
        walk(full);
      }
      else if (e.isFile() && (e.name.endsWith('.ts') || e.name.endsWith('.spec.ts'))) {
        const content = readFileSync(full, 'utf-8');
        const lines = content.split('\n');
        for (const line of lines) {
          // Match @atc('TEST-ID', { story: 'DTS-XXX', feature: '...' })
          const atcMatch = line.match(/@atc\(\s*'([^']+)'\s*(?:,\s*\{([^}]+)\})?/);
          if (atcMatch) {
            const testId = atcMatch[1];
            const labelMatch = line.match(/(\w+)\s*[:(]\s*async/);
            const atcName = labelMatch ? labelMatch[1] : 'anonymous';
            let story = '';
            let feature = '';
            if (atcMatch[2]) {
              const opts = atcMatch[2];
              const storyMatch = opts.match(/story:\s*'([^']+)'/);
              if (storyMatch) { story = storyMatch[1]; }
              const featureMatch = opts.match(/feature:\s*'([^']+)'/);
              if (featureMatch) { feature = featureMatch[1]; }
            }
            results.push({ atcName, testId, story, feature, source: e.name });
          }
          // Match test.info().annotations.push({ type: 'story', description: 'DTS-XXX' })
          const annoMatch = line.match(/annotations\.push\(\{ type: 'story', description: '([^']+)' \}\)/);
          if (annoMatch) {
            const story = annoMatch[1];
            results.push({ atcName: 'annotation', testId: story, story, feature: '', source: e.name });
          }
        }
      }
    }
  }

  walk(dir);
  return results;
}

const scanDirs = [
  resolve(import.meta.dir, '..', 'tests'),
  resolve(import.meta.dir, '..', 'packages'),
];

const allAtcs = scanDirs.flatMap((d) => {
  try { return scanAtcDeclarations(d); }
  catch { return []; }
});

const outDir = process.env.TRACEABILITY_DIR ?? 'traceability-out';

const header = '| ATC Name | Test ID | Jira Story | Feature | Source File | Jira URL |';
const sep = '|---|---|---|---|---|---|';
const body = allAtcs.map((r) => {
  const url = r.story ? `${JIRA_BASE}/${r.story}` : '—';
  return `| ${r.atcName} | ${r.testId} | ${r.story || '—'} | ${r.feature || '—'} | ${r.source} | ${r.story ? `[${r.story}](${url})` : '—'} |`;
}).join('\n');
const md = `# Traceability Matrix\n\nGenerated: ${new Date().toISOString()}\n\n${header}\n${sep}\n${body}\n`;

writeFileSync(resolve(outDir, 'traceability-matrix.md'), md, 'utf-8');
writeFileSync(resolve(outDir, 'traceability-matrix.json'), JSON.stringify(allAtcs, null, 2), 'utf-8');

console.log(`Traceability matrix: ${allAtcs.length} entries written to ${outDir}/`);
