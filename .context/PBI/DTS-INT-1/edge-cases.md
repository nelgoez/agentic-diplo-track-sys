# DTS-INT-1: Edge Cases

## Boundary Conditions
- `providers.yaml` file missing at startup: server starts but provider endpoints return 503 `provider_not_configured`; no crash
- Config references provider name not registered in code: startup fails with clear "No implementation for provider X"; server won't start
- Provider interface has optional methods: default no-op implementations in base class; no runtime error if unimplemented
- Multiple certificates per student from same provider: `fetchCertificates` returns array; dedup by `external_id` at service layer
- Health check timeout configurable per provider: defaults to 10s; overridable in `providers.yaml`

## Error Paths
- YAML syntax error in `providers.yaml`: server fails to start; error includes file path + line number
- Missing required config key (e.g., `url`): ProviderRegistry throws on `.getCertificateProvider()` if active provider is incomplete
- Circular reference in provider names: not possible (flat map); YAML structure prevents loops
- Environment variable interpolation fails (e.g., `${MOODLE_URL}` unset): config value is empty string; provider throws on first call

## Concurrency
- Config reload while sync in progress: provider instance is singleton; reload creates new instance; in-flight sync uses old instance until completion
- Two providers registered under same name: last registration wins (Map.set); warning logged
