# DTS-INT-2 — Compliance Matrix

| AC Scenario | Evidence | Status |
|-------------|----------|--------|
| MoodleCertificateProvider implements CertificateProvider | `moodle.service.ts:20` | PASS |
| healthCheck() pings Moodle URL | `moodle.service.ts:42-68` | PASS |
| Configurable URL + token from env vars | `moodle.service.ts:24-25` | PASS |
| Returns ProviderHealth with latency | `moodle.service.ts:53-65` | PASS |
| Health check handles connection errors | `moodle.service.ts:66-69` (catch) | PASS |
| fetchCertificates signature matches interface | `moodle.service.ts:33` | PASS |
| validateCertificate signature matches interface | `moodle.service.ts:38` | PASS |
