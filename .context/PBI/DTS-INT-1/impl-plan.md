# DTS-INT-1 — Implementation Plan

**Status**: Complete
**Date**: 27/5/2026

## Scope
Define `CertificateProvider` and `AcademicProvider` interfaces + `ProviderRegistry` for config-driven resolution.

## Pre-fix State
No `providers/` directory. No provider interfaces. Services were flat files with no shared contract.

## Implementation

### CertificateProvider Interface (`providers/certificate.provider.ts`)
```typescript
interface CertificateProvider {
  fetchCertificates(studentId: string): Promise<Certificate[]>
  validateCertificate(externalId: string): Promise<boolean>
  healthCheck(): Promise<ProviderHealth>
  readonly providerName: string
}
```

### AcademicProvider Interface (`providers/academic.provider.ts`)
```typescript
interface AcademicProvider {
  fetchStudents(): Promise<AcademicStudent[]>
  fetchStudent(id: string): Promise<AcademicStudent | null>
  healthCheck(): Promise<ProviderHealth>
  readonly providerName: string
}
```

### ProviderRegistry (`providers/provider-registry.ts`)
- `registerCertificateProvider(name, provider)`
- `registerAcademicProvider(name, provider)`
- `setActiveCertificateProvider(name)` / `setActiveAcademicProvider(name)`
- `getCertificateProvider()` / `getAcademicProvider()`
- Singleton export: `providerRegistry`

### Startup Registration (`index.ts`)
```typescript
providerRegistry.registerCertificateProvider('moodle', moodleService)
providerRegistry.registerAcademicProvider('guarani', guaraniService)
```

## Files
- `providers/certificate.provider.ts` — created
- `providers/academic.provider.ts` — created
- `providers/provider-registry.ts` — created
- `providers/index.ts` — created
- `index.ts` — modified

## Deliberately Deferred
- `providers.yaml` config file (env vars used directly)
- Per-provider subdirectory structure
- `ProviderError` class
- Session-based auth in provider methods
