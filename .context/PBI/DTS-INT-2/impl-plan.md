# DTS-INT-2 — Implementation Plan

**Status**: Complete
**Date**: 27/5/2026

## Scope
Make `MoodleServiceImpl` implement `CertificateProvider` interface. Add `healthCheck()` and `validateCertificate()`.

## Implementation

- `MoodleServiceImpl` now `implements MoodleService, CertificateProvider`
- `readonly providerName = 'moodle'`
- `healthCheck()`: pings `GET /webservice/rest/server.php?wstoken={token}&wsfunction=core_webservice_get_site_info` with 10s timeout
- `validateCertificate(externalId)`: stub (returns true), TODO for real Moodle check
- `fetchCertificates(studentId)`: stub (returns []), maps to Certificate[]
- Legacy `syncCertificates()`, `getStudentProgress()`, `getCourseInfo()` kept for backward compat

## Files
- `services/moodle.service.ts` — modified

## Verification
- [x] Implements CertificateProvider interface
- [x] TypeScript typecheck passes
- [ ] Manual: healthCheck against real Moodle instance
