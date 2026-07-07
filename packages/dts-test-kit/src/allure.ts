import { getAllAtcs } from './decorators';

export interface TraceabilityRow {
  atcName: string
  testId: string
  story: string
  feature: string
  jiraUrl: string
}

const JIRA_BASE = process.env.JIRA_URL ?? 'https://diplo-track-sys.atlassian.net/browse';

export function buildTraceabilityMatrix(): TraceabilityRow[] {
  const atcs = getAllAtcs();
  return atcs.map(a => ({
    atcName: a.label,
    testId: a.testId,
    story: a.story ?? '—',
    feature: a.feature ?? '—',
    jiraUrl: a.story ? `${JIRA_BASE}/${a.story}` : '—',
  }));
}

export function generateTraceabilityMarkdown(rows: TraceabilityRow[]): string {
  const header = '| ATC Name | Test ID | Jira Story | Feature | Jira URL |';
  const sep = '|---|---|---|---|---|';
  const body = rows.map(r =>
    `| ${r.atcName} | ${r.testId} | ${r.story} | ${r.feature} | ${r.jiraUrl !== '—' ? `[${r.story}](${r.jiraUrl})` : '—'} |`,
  ).join('\n');
  return `# Traceability Matrix\n\n${header}\n${sep}\n${body}\n`;
}
