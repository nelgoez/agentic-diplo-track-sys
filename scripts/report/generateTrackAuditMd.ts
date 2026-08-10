import type { TrackAuditData } from './buildTrackAuditData';

export function generateTrackAuditMd(data: TrackAuditData): string {
  const d = data;
  const lines: string[] = [];

  lines.push(`# Track Audit: ${d.trackName} (${d.trackId})`);
  lines.push(`> Generated: ${d.timestamp}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|---|---|');
  lines.push(`| Total Students | ${d.totalStudents} |`);
  lines.push(`| Eligible | ${d.eligibleCount} |`);
  lines.push(`| Not Eligible | ${d.notEligibleCount} |`);
  lines.push(`| Certificates | ${d.totalCertificates} |`);
  lines.push('');

  if (d.certificateBreakdown.length > 0) {
    lines.push('## Certificate Breakdown');
    lines.push('');
    lines.push('| Course | Count |');
    lines.push('|---|---|');
    for (const c of d.certificateBreakdown) {
      lines.push(`| ${c.courseName} | ${c.count} |`);
    }
    lines.push('');
  }

  if (d.overrides.length > 0) {
    lines.push('## Active Overrides');
    lines.push('');
    lines.push('| Student ID | Rule ID | Reason |');
    lines.push('|---|---|---|');
    for (const o of d.overrides) {
      lines.push(`| ${o.studentId} | ${o.ruleId} | ${o.reason} |`);
    }
    lines.push('');
  }

  if (d.findings.length > 0) {
    lines.push('## Findings');
    lines.push('');
    for (const f of d.findings) {
      const icon = f.severity === 'critical' ? '🔴' : f.severity === 'warning' ? '⚠️' : 'ℹ️';
      lines.push(`- ${icon} [${f.severity}] ${f.message}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
