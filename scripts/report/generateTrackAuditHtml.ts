import type { TrackAuditData } from './buildTrackAuditData';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function generateTrackAuditHtml(data: TrackAuditData): string {
  const d = data;

  const eligiblePct = d.totalStudents > 0
    ? Math.round((d.eligibleCount / d.totalStudents) * 100)
    : 0;
  const notEligiblePct = d.totalStudents > 0
    ? Math.round((d.notEligibleCount / d.totalStudents) * 100)
    : 0;

  const badgeColor = d.findings.some(f => f.severity === 'critical')
    ? '#dc2626'
    : d.findings.some(f => f.severity === 'warning')
      ? '#f59e0b'
      : d.findings.length > 0
        ? '#3b82f6'
        : '#16a34a';

  const badgeLabel = d.findings.some(f => f.severity === 'critical')
    ? 'CRITICAL'
    : d.findings.some(f => f.severity === 'warning')
      ? 'WARNINGS'
      : d.findings.length > 0
        ? 'INFO'
        : 'OK';

  const findingsHtml = d.findings.length > 0
    ? d.findings
        .map((f) => {
          const severityClass = f.severity === 'critical'
            ? 'finding-critical'
            : f.severity === 'warning'
              ? 'finding-warning'
              : 'finding-info';
          const icon = f.severity === 'critical'
            ? '\uD83D\uDD34'
            : f.severity === 'warning'
              ? '\u26A0\uFE0F'
              : '\u2139\uFE0F';
          return `<div class="finding ${severityClass}"><div class="finding-icon">${icon}</div><div><div class="finding-title">[${f.severity.toUpperCase()}]</div><div>${esc(f.message)}</div></div></div>`;
        })
        .join('\n')
    : '<p style="color:#64748b;font-size:.88em">No findings.</p>';

  const certificateRows = d.certificateBreakdown.length > 0
    ? d.certificateBreakdown
        .map(c => `<tr><td>${esc(c.courseName)}</td><td>${c.count}</td></tr>`)
        .join('\n')
    : '<tr><td colspan="2" style="color:#94a3b8;text-align:center">No certificate data</td></tr>';

  const overridesSection = d.overrides.length > 0
    ? `
<div class="section">
<h2>Active Overrides</h2>
<table>
<thead><tr><th>Student ID</th><th>Rule ID</th><th>Reason</th></tr></thead>
<tbody>
${d.overrides.map(o => `<tr><td class="mono">${esc(o.studentId)}</td><td class="mono">${esc(o.ruleId)}</td><td>${esc(o.reason)}</td></tr>`).join('\n')}
</tbody>
</table>
</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Track Audit: ${esc(d.trackName)} (${d.trackId})</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f1f5f9;color:#1e293b;padding:24px}
.container{max-width:960px;margin:0 auto}
.header{background:#fff;border-radius:12px;padding:28px 32px;margin-bottom:24px;box-shadow:0 1px 3px rgba(0,0,0,0.1)}
.header h1{font-size:1.4em;margin-bottom:4px;color:#0f172a}
.header .sub{color:#64748b;font-size:.85em;margin-bottom:16px}
.status-badge{display:inline-block;padding:5px 14px;border-radius:20px;font-weight:600;font-size:.82em;color:#fff;background:${badgeColor};margin-bottom:12px}
.stats-row{display:flex;gap:12px;margin:12px 0}
.stat-card{background:#f8fafc;border-radius:8px;padding:12px 16px;flex:1;text-align:center;min-width:0}
.stat-card .stat-number{font-size:1.6em;font-weight:700}
.stat-card .stat-label{font-size:.75em;color:#64748b;margin-top:4px}
.stat-eligible .stat-number{color:#16a34a}
.stat-not-eligible .stat-number{color:#dc2626}
.stat-certificates .stat-number{color:#3b82f6}
.section{background:#fff;border-radius:12px;padding:24px;margin-bottom:20px;box-shadow:0 1px 3px rgba(0,0,0,0.1)}
.section h2{font-size:1.1em;margin-bottom:14px;padding-bottom:8px;border-bottom:2px solid #e2e8f0}
table{width:100%;border-collapse:collapse;margin-bottom:12px;font-size:.88em}
th{text-align:left;padding:8px 12px;background:#f8fafc;border-bottom:2px solid #e2e8f0;font-weight:600;color:#475569}
td{padding:7px 12px;border-bottom:1px solid #f1f5f9}
.mono{font-family:'SF Mono',Menlo,monospace;font-size:.82em}
.finding{display:flex;gap:10px;padding:10px 12px;border-radius:8px;margin-bottom:6px;font-size:.85em}
.finding-critical{background:#fef2f2;border:1px solid #fecaca}
.finding-warning{background:#fffbeb;border:1px solid #fde68a}
.finding-info{background:#eff6ff;border:1px solid #bfdbfe}
.finding-icon{font-size:1.1em;flex-shrink:0}
.finding-title{font-weight:600;margin-bottom:2px}
.progress-bar{display:flex;height:8px;border-radius:4px;overflow:hidden;margin:8px 0}
.progress-eligible{background:#16a34a}
.progress-not-eligible{background:#dc2626}
.footer{text-align:center;color:#94a3b8;font-size:.78em;margin-top:28px;padding-top:14px;border-top:1px solid #e2e8f0}
</style>
</head>
<body>
<div class="container">

<div class="header">
<div class="status-badge">${badgeLabel}</div>
<h1>${esc(d.trackName)} (${d.trackId})</h1>
<div class="sub">Generated: ${d.timestamp}</div>
<div class="stats-row">
  <div class="stat-card"><div class="stat-number">${d.totalStudents}</div><div class="stat-label">Total Students</div></div>
  <div class="stat-card stat-eligible"><div class="stat-number">${d.eligibleCount}</div><div class="stat-label">Eligible (${eligiblePct}%)</div></div>
  <div class="stat-card stat-not-eligible"><div class="stat-number">${d.notEligibleCount}</div><div class="stat-label">Not Eligible (${notEligiblePct}%)</div></div>
  <div class="stat-card stat-certificates"><div class="stat-number">${d.totalCertificates}</div><div class="stat-label">Certificates</div></div>
</div>
<div class="progress-bar">
  <div class="progress-eligible" style="width:${eligiblePct}%"></div>
  <div class="progress-not-eligible" style="width:${notEligiblePct}%"></div>
</div>
</div>

<div class="section">
<h2>Summary</h2>
<table>
<thead><tr><th>Metric</th><th>Value</th></tr></thead>
<tbody>
<tr><td>Total Students</td><td>${d.totalStudents}</td></tr>
<tr><td>Eligible</td><td>${d.eligibleCount}</td></tr>
<tr><td>Not Eligible</td><td>${d.notEligibleCount}</td></tr>
<tr><td>Certificates</td><td>${d.totalCertificates}</td></tr>
</tbody>
</table>
</div>

<div class="section">
<h2>Certificate Breakdown</h2>
<table>
<thead><tr><th>Course</th><th>Count</th></tr></thead>
<tbody>
${certificateRows}
</tbody>
</table>
</div>

${overridesSection}

<div class="section">
<h2>Findings</h2>
${findingsHtml}
</div>

<div class="footer">
Track Audit Report &mdash; ${d.timestamp}
</div>
</div>
</body>
</html>`;
}
