export interface TrackAuditData {
  timestamp: string
  trackId: string
  trackName: string
  totalStudents: number
  eligibleCount: number
  notEligibleCount: number
  totalCertificates: number
  certificateBreakdown: Array<{ courseName: string, count: number }>
  overrides: Array<{ studentId: string, ruleId: string, reason: string }>
  findings: Array<{ severity: 'critical' | 'warning' | 'info', message: string }>
}

export function buildTrackAuditData(raw: Record<string, unknown>): TrackAuditData {
  const now = new Date().toISOString().replace(/T/, ' ').slice(0, 16);

  const trackId = String(raw.trackId ?? 'unknown');
  const trackName = String(raw.trackName ?? 'Unknown Track');
  const totalStudents = Number(raw.totalStudents ?? 0);
  const eligibleCount = Number(raw.eligibleCount ?? 0);
  const notEligibleCount = Number(raw.notEligibleCount ?? 0);
  const totalCertificates = Number(raw.totalCertificates ?? 0);

  const certificateBreakdown: Array<{ courseName: string, count: number }> = [];
  if (Array.isArray(raw.certificateBreakdown)) {
    for (const item of raw.certificateBreakdown) {
      if (item && typeof item === 'object') {
        const entry = item as Record<string, unknown>;
        certificateBreakdown.push({
          courseName: String(entry.courseName ?? entry.course_name ?? 'Unknown'),
          count: Number(entry.count ?? 0),
        });
      }
    }
  }

  const overrides: Array<{ studentId: string, ruleId: string, reason: string }> = [];
  if (Array.isArray(raw.overrides)) {
    for (const item of raw.overrides) {
      if (item && typeof item === 'object') {
        const entry = item as Record<string, unknown>;
        overrides.push({
          studentId: String(entry.studentId ?? entry.student_id ?? ''),
          ruleId: String(entry.ruleId ?? entry.rule_id ?? ''),
          reason: String(entry.reason ?? ''),
        });
      }
    }
  }

  const findings: Array<{ severity: 'critical' | 'warning' | 'info', message: string }> = [];
  if (Array.isArray(raw.findings)) {
    for (const item of raw.findings) {
      if (item && typeof item === 'object') {
        const entry = item as Record<string, unknown>;
        const severity = entry.severity === 'critical' || entry.severity === 'warning' || entry.severity === 'info'
          ? entry.severity
          : 'info';
        findings.push({
          severity,
          message: String(entry.message ?? ''),
        });
      }
    }
  }
  else {
    if (notEligibleCount > totalStudents * 0.5) {
      findings.push({
        severity: 'critical',
        message: `More than 50% of students (${notEligibleCount}/${totalStudents}) are not eligible`,
      });
    }
    if (eligibleCount === 0 && totalStudents > 0) {
      findings.push({
        severity: 'critical',
        message: 'No students are eligible — rule tree may be misconfigured',
      });
    }
    if (overrides.length > 0) {
      findings.push({
        severity: 'warning',
        message: `${overrides.length} manual override(s) active — eligibility reports may not reflect real rule compliance`,
      });
    }
    if (totalCertificates === 0) {
      findings.push({
        severity: 'info',
        message: 'No certificates synced yet — run a Moodle sync to populate certificate data',
      });
    }
  }

  return {
    timestamp: now,
    trackId,
    trackName,
    totalStudents,
    eligibleCount,
    notEligibleCount,
    totalCertificates,
    certificateBreakdown,
    overrides,
    findings,
  };
}
