# DTS-INT-1: Provider abstraction interfaces + registry

> Phase: 1 (Foundation) · Effort: 5 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: CertificateProvider interface is defined with required methods
- **Given** the system needs a contract for certificate-source integrations
- **When** the `CertificateProvider` interface is checked
- **Then** it declares `fetchCertificates(studentId: string): Promise<Certificate[]>` method
- **And** it declares `validateCertificate(certificateId: string): Promise<boolean>` method
- **And** it declares `healthCheck(): Promise<ProviderHealth>` method

### Scenario: AcademicProvider interface is defined with required methods
- **Given** the system needs a contract for academic-registry integrations
- **When** the `AcademicProvider` interface is checked
- **Then** it declares `fetchStudents(): Promise<Student[]>` method
- **And** it declares `fetchStudent(id: string): Promise<Student | null>` method
- **And** it declares `healthCheck(): Promise<ProviderHealth>` method

### Scenario: ProviderRegistry resolves the active provider from configuration
- **Given** a `providers.yaml` config specifying `active: moodle` under the certificate section
- **When** `ProviderRegistry.getCertificateProvider()` is called
- **Then** the Moodle-based `CertificateProvider` implementation is returned
- **And** switching `active: canvas` in config (future) would resolve a Canvas provider without code changes to consumers

### Scenario: Adding a new provider requires zero changes to business logic
- **Given** a new provider class `CanvasCertificateProvider` implements `CertificateProvider`
- **When** the provider is registered and set as active in configuration
- **Then** all consuming code (rule engine, dashboards, sync workers) works with the new provider
- **And** no changes are required to business logic or API route handlers

## Open Questions
- None

## Notes
- Implementation commit: See impl-plan.md
- Config file: `config/providers.yaml`
