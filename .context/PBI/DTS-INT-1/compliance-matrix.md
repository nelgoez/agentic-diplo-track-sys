# DTS-INT-1 — Compliance Matrix

| AC Scenario | Covered By | Status |
|-------------|------------|--------|
| CertificateProvider interface defined with fetchCertificates, validateCertificate, healthCheck | `providers/certificate.provider.ts` | PASS |
| AcademicProvider interface defined with fetchStudents, fetchStudent, healthCheck | `providers/academic.provider.ts` | PASS |
| ProviderRegistry with config-driven resolution | `providers/provider-registry.ts` | PASS |
| ProviderHealth type with status/latency/message fields | `providers/certificate.provider.ts:13-18` | PASS |
| Registry supports multiple providers per type | `Map<string, Provider>` storage | PASS |
| Startup registration of active providers | `index.ts:18-19` | PASS |
| **Known gap**: providers.yaml config file | exempt — deferred | UNCOVERED |
