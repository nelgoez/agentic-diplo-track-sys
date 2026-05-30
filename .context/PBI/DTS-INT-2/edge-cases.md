# DTS-INT-2: Edge Cases

## Boundary Conditions
- Moodle URL missing trailing slash: provider normalizes URL internally; no 404 from double-slash
- Token with special characters: URL-encoded before request; no injection risk
- Mock data returns 0 certificates for student: empty array; caller handles gracefully (no error)
- Mock data size grows large (100+ certificates): pagination at provider level; mock respects `limit` param
- Health check: Moodle returns 200 but non-JSON body → `connected` with warning; non-200 → `disconnected` with status code

## Error Paths
- Moodle URL unreachable (DNS failure): health check returns `disconnected`; `fetchCertificates` throws after timeout
- Invalid token (Moodle returns 401): `validateCertificate` returns false; `fetchCertificates` throws `ProviderAuthError`
- Moodle returns 500: retry 3× with backoff; all fail → throw `ProviderError` with original status
- Response timeout (Moodle hangs): configurable timeout (default 10s); abort controller cancels fetch
- Malformed JSON response from Moodle: caught; logged with raw response (truncated); returns empty array

## Concurrency
- Health check + fetchCertificates concurrent: independent HTTP calls; no shared mutable state
- Two parallel health checks: each makes own HTTP call; no caching at provider layer (cache in ProviderRegistry)
