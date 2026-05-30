# DTS-INT-2: Moodle provider (mock + health check)

> Phase: 1 (Foundation) · Effort: 3 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: MoodleCertificateProvider implements the CertificateProvider interface
- **Given** the `CertificateProvider` interface is defined
- **When** `MoodleCertificateProvider` is instantiated
- **Then** it implements `fetchCertificates()`, `validateCertificate()`, and `healthCheck()`
- **And** it satisfies the `CertificateProvider` type contract

### Scenario: Mock fetchCertificates returns sample certificate data
- **Given** a Moodle provider configured in mock mode
- **When** `fetchCertificates(studentId)` is called for a valid student
- **Then** it returns an array of `Certificate` objects with course_name, issue_date, provider, and status fields
- **And** the response matches the expected Certificate interface shape

### Scenario: Health check pings the configured Moodle URL
- **Given** a Moodle provider configured with a valid URL and token
- **When** `healthCheck()` is called
- **Then** it attempts to reach the Moodle web service endpoint
- **And** returns a `ProviderHealth` response with status `connected` or `disconnected`
- **And** includes latency in milliseconds and a timestamp

### Scenario: Provider is configurable via URL and token
- **Given** the Moodle provider is instantiated
- **When** different URL and token values are provided via configuration (env vars or providers.yaml)
- **Then** the provider uses the configured values for all API calls
- **And** missing required configuration causes a clear error at startup

## Open Questions
- None

## Notes
- Implementation commit: See impl-plan.md
- Mock mode returns synthetic data; real integration pending DTS-SYNC-1
