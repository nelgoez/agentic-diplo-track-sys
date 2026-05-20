---
name: provider-abstraction
description: 'Architectural pattern for external provider abstraction using Strategy/Adapter pattern. Design pluggable integrations for Moodle, Guaraní, and other external systems with a unified interface. Triggers on: `provider abstraction`, `external provider integration`, `Moodle integration`, `Guaraní integration`, `Strategy pattern provider`, `pluggable integrations`, `adapter pattern`, `third-party provider abstraction`. Do NOT use for: general API client generation (use `/project-bootstrap`), test automation (use `/kata-architecture`), or database integration (use Supabase MCP).'
license: MIT
compatibility: [claude-code, opencode]
phase: architecture
---

# Provider Abstraction — Pluggable External Provider Architecture

`provider-abstraction` defines the architectural pattern for integrating external providers (Moodle, Guaraní, SGA, etc.) using the Strategy/Adapter pattern. The goal is to make providers pluggable: add or swap a provider without changing the rest of the system.

---

## Dependencies

Requires `agentic-dev-core`. This is an architectural concern for the DTS (Diploma Tracking System) redesign, specifically for the integration layer of external academic systems.

---

## Architectural Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                            │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐        │
│  │  Student    │  │  Enrollment  │  │  Grade           │        │
│  │  Service    │  │  Service     │  │  Service         │        │
│  └──────┬──────┘  └──────┬───────┘  └───────┬──────────┘        │
│         │                │                   │                   │
│         ▼                ▼                   ▼                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              PROVIDER INTERFACE (Abstract)               │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  IAcademicProvider                                │  │   │
│  │  │  ├─ authenticate(config): ProviderSession          │  │   │
│  │  │  ├─ getStudent(id): Student                        │  │   │
│  │  │  ├─ getEnrollments(studentId): Enrollment[]        │  │   │
│  │  │  ├─ getGrades(studentId, courseId): Grade[]        │  │   │
│  │  │  ├─ getCourses(): Course[]                         │  │   │
│  │  │  └─ healthCheck(): boolean                         │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│          ┌────────────────┼────────────────┐                     │
│          ▼                ▼                ▼                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│  │ MoodleAdapter│ │ GuaraníAdapter│ │   Custom     │              │
│  ├──────────────┤ ├──────────────┤ ├──────────────┤              │
│  │ +auth()      │ │ +auth()      │ │ +auth()      │              │
│  │ +students()  │ │ +students()  │ │ +students()  │              │
│  │ +grades()    │ │ +grades()    │ │ +grades()    │              │
│  └──────────────┘ └──────────────┘ └──────────────┘              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Concepts

### Strategy Pattern
Define a family of algorithms (provider implementations), encapsulate each one, and make them interchangeable. The provider interface lets the algorithm vary independently from the clients that use it.

### Adapter Pattern
Convert the interface of a provider into the interface the client expects. Each provider has its own native API (REST, SOAP, GraphQL, SQL) — adapters normalize these into a unified contract.

### Provider Interface (Contract)
The abstract interface defines the operations the application needs, NOT what the provider offers. This lets us:
- Add new providers without touching application code
- Swap providers during runtime (e.g., fallback to another SGA)
- Test with mock providers
- Version providers independently

---

## Design Principles

### 1. Interface = Application Needs, Not Provider Capabilities
Design the interface around what your domain needs:
```typescript
interface IAcademicProvider {
  authenticate(config: ProviderConfig): Promise<ProviderSession>;
  getStudent(session: ProviderSession, id: string): Promise<Student>;
  getEnrollments(session: ProviderSession, studentId: string): Promise<Enrollment[]>;
  getGrades(session: ProviderSession, filter: GradeFilter): Promise<Grade[]>;
  getCourses(session: ProviderSession): Promise<Course[]>;
  healthCheck(): Promise<HealthStatus>;
}
```

### 2. Each Provider is a Separate Module
```
src/providers/
├── interface/
│   ├── IAcademicProvider.ts          # Interface contract
│   ├── types.ts                      # Shared DTOs
│   └── errors.ts                     # Provider-specific errors
├── moodle/
│   ├── MoodleAdapter.ts              # Adapter implementation
│   ├── MoodleClient.ts               # Raw HTTP client
│   ├── moodle.config.ts              # Endpoints, auth type
│   └── moodle.types.ts               # Moodle-specific DTOs
├── guarani/
│   ├── GuaraníAdapter.ts
│   ├── GuaraníClient.ts
│   ├── guarani.config.ts
│   └── guarani.types.ts
└── registry.ts                       # Provider factory/registry
```

### 3. Provider Registry
```typescript
// registry.ts — Central provider factory
const providers = new Map<string, ProviderFactory>();

export function registerProvider(key: string, factory: ProviderFactory): void { ... }
export function getProvider(key: string): IAcademicProvider { ... }

// Usage
registerProvider('moodle', (config) => new MoodleAdapter(config));
registerProvider('guarani', (config) => new GuaraníAdapter(config));

const provider = getProvider(institution.providerType);
const session = await provider.authenticate(institution.providerConfig);
const students = await provider.getStudents(session, courseId);
```

### 4. Configuration-Driven
Provider selection should be configuration, not code:
```json
{
  "institution": {
    "name": "Universidad X",
    "provider": "moodle",
    "config": {
      "baseUrl": "https://moodle.universidadx.edu.ar",
      "tokenEndpoint": "/webservice/rest/server.php",
      "authMethod": "token"
    }
  }
}
```

### 5. Resilience Patterns
- **Circuit Breaker**: Stop calling a failing provider
- **Timeout per provider**: Configurable timeouts per provider
- **Retry with backoff**: Exponential backoff on transient failures
- **Fallback chain**: Try Provider A → if fails → try Provider B

### 6. Error Normalization
Map provider-native errors to application errors:
```typescript
class ProviderError extends Error {
  constructor(
    public provider: string,
    public code: ProviderErrorCode,
    public nativeError: unknown
  ) { super() }
}

enum ProviderErrorCode {
  AUTH_FAILED = 'AUTH_FAILED',
  STUDENT_NOT_FOUND = 'STUDENT_NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  UNKNOWN = 'UNKNOWN',
}
```

### 7. Health Checks
Every provider must implement `healthCheck()` returning status + latency:
```typescript
interface HealthStatus {
  healthy: boolean;
  latency: number;          // ms
  lastChecked: Date;
  details?: Record<string, unknown>;
}
```
Use for dashboards, load balancers, and proactive monitoring.

---

## Implementation Steps

1. **Define the Interface**: Based on application domain needs
2. **Implement First Provider** (e.g., Moodle): Full adapter with all edge cases
3. **Implement Second Provider** (e.g., Guaraní): Validates interface completeness
4. **Build Provider Registry**: Factory pattern with config-based selection
5. **Add Resilience**: Circuit breaker, retries, timeouts, fallbacks
6. **Add Observability**: Health checks, metrics, provider-level logging
7. **Write Tests**: Unit tests per adapter, integration tests against real/sandbox APIs

---

## Testing Strategy

| Test Type | Focus | Approach |
|-----------|-------|----------|
| Unit | Adapter logic | Mock HTTP client, test parsing/error handling |
| Integration | Real provider API | Sandbox/test environments with real credentials |
| Contract | Interface compliance | Each adapter must pass same contract tests |
| Resilience | Circuit breaker, retries | Integration tests with network failures |
| Discovery | Provider detection | Test auto-detection of provider type from config |
