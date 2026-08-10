import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export interface ReportMeta {
  timestamp: string
  trackId: string
  trackName: string
  eligibleCount: number
  findingsCount: number
}

const REPORTS_ROOT = join(process.cwd(), 'reports', 'tracks');

function timestampPattern(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function updateHistory(trackDir: string, meta: ReportMeta): void {
  const historyPath = join(trackDir, 'history.json');
  let history: ReportMeta[] = [];
  if (existsSync(historyPath)) {
    try {
      history = JSON.parse(readFileSync(historyPath, 'utf-8'));
    }
    catch {
      history = [];
    }
  }
  history.unshift(meta);
  writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf-8');
}

export function saveReport(
  trackId: string,
  trackName: string,
  mdContent: string,
  htmlContent: string,
  meta: Omit<ReportMeta, 'timestamp' | 'trackId' | 'trackName'>,
): string {
  const ts = timestampPattern();
  const trackDir = join(REPORTS_ROOT, trackId);
  mkdirSync(trackDir, { recursive: true });

  const mdPath = join(trackDir, `${ts}.md`);
  const htmlPath = join(trackDir, `${ts}.html`);
  const latestMdPath = join(trackDir, 'latest.md');
  const latestHtmlPath = join(trackDir, 'latest.html');

  writeFileSync(mdPath, mdContent, 'utf-8');
  writeFileSync(htmlPath, htmlContent, 'utf-8');
  writeFileSync(latestMdPath, mdContent, 'utf-8');
  writeFileSync(latestHtmlPath, htmlContent, 'utf-8');

  const fullMeta: ReportMeta = {
    timestamp: ts,
    trackId,
    trackName,
    ...meta,
  };
  updateHistory(trackDir, fullMeta);

  return ts;
}
