# Development Guide: Diploma Tracking System (DTS)

## Cómo está organizado

El proyecto sigue una estructura monorepo con dos partes principales: `server/` (API) y `client/` (frontend). La lógica de negocio está separada de los handlers de API mediante servicios inyectables, lo que facilita testear y modificar sin romper otras cosas.

### Diagrama de la arquitectura

```
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │   Routes    │ ──► │  Services   │ ──► │  Database   │
    │  (Hono)     │     │  (Lógica)   │     │  (Supabase) │
    └─────────────┘     └─────────────┘     └─────────────┘
          │                   │
          │                   ▼
          │            ┌─────────────┐
          └──────────► │  External   │
                       │  Providers  │
                       └─────────────┘
```

### El flujo general de datos

Cuando llega una request, la ruta de Hono la recibe, el middleware de auth verifica el JWT y extrae `{ userId, email, role }` al contexto. Las rutas delegadas llaman a servicios (o consultan Supabase directamente para queries simples). Las integraciones externas (Moodle, Guaraní) se acceden a través de la capa de providers, que abstrae el protocolo de comunicación.

### Dónde vive cada cosa

| Capa | Directorio | Convención |
|------|-----------|------------|
| Routes | `server/src/routes/` | Un archivo por dominio (`auth.ts`, `rules.ts`, etc.) |
| Middleware | `server/src/middleware/` | `auth.ts` (JWT + RBAC), `error.ts` |
| Services | `server/src/services/` | Lógica pura, sin dependencias de HTTP |
| Providers | `server/src/providers/` | Interfaces + registry |
| DB | `server/src/db/supabase.ts` | Clientes anon + admin |
| Types | `server/src/types/hono.ts` | `HonoVariables`, `AuthContext` |
| Migrations | `supabase/migrations/` | SQL secuencial (`001_...`, `002_...`) |

---

## Trabajando con cada flujo

### Flujo 1: Autenticación y Autorización

```
Usuario ──POST /auth/login──► Supabase Auth ──► JWT (jose) ──► Cliente
                                          └──► students (role lookup)
```

**Contexto**: El sistema usa JWTs propios firmados con `jose` (HS256), no los tokens de Supabase directamente. Esto permite incluir el `role` en el payload y controlar la expiración.

**Qué tener en cuenta**:

- El `authenticate` middleware verifica el JWT con `jose.jwtVerify` y la clave `JWT_SECRET`. Si cambiás el secreto, invalidás todos los tokens existentes.
- El `requireRole` solo hace gating por `role` — no valida que el usuario tenga acceso a recursos específicos de un track (eso va en la lógica de negocio).
- El refresh token usa el campo `type: 'refresh'` para diferenciarse del access token. Si el middleware recibe un refresh, lo rechaza (401).
- El `/me` busca en la tabla `students` por email — si un usuario existe en Supabase Auth pero no en `students`, falla.

### Flujo 2: Evaluación de Elegibilidad (Rule Engine)

```
Solicitud ─► GET /enrollments/eligibility/:studentId?track_id=X
                    │
                    ▼
          evaluateTrackEligibility()
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   Rules DB    Certificates  Overrides DB
        │           │           │
        └───────────┼───────────┘
                    ▼
          Recursive Tree Evaluation
                    │
                    ▼
           EligibilityResult
```

**Contexto**: Este es el corazón del sistema. El motor de reglas evalúa recursivamente si un estudiante cumple los prerrequisitos para rendir un examen.

**Qué tener en cuenta**:

- Las reglas forman un árbol a través de `parent_rule_id`. Las reglas sin padre son raíces. Cada regla puede tener `sources` (cursos requeridos) y `children` (sub-reglas).
- `ALL`: todas las fuentes y sub-reglas deben cumplirse.
- `ANY`: al menos una fuente o sub-regla debe cumplirse.
- Un override activo (`status='active'`) en cualquier nodo fuerza `fulfilled=true` y propaga hacia arriba.
- El motor está diseñado con inyección de dependencias — recibe funciones async para todas las queries de DB. Esto lo hace 100% testeable sin mockear Supabase.
- Los certificados aprobados (`status='approved' AND is_valid=true`) son la única fuente de verdad para "curso completado".

### Flujo 3: Sincronización con Moodle

```
Admin ──POST /integrations/sync/moodle──► MoodleService
                                                    │
                                                    ▼
                                            Moodle REST API
                                                    │
                                                    ▼
                                            certificates (UPSERT)
```

**Contexto**: Moodle es la fuente externa de certificados. El sync baja certificados y los guarda en la tabla `certificates`.

**Qué tener en cuenta**:

- El `MoodleService` implementa `CertificateProvider`. Si se agrega Canvas u otro LMS, solo hay que crear otra implementación de esa interfaz.
- El `ProviderRegistry` resuelve qué provider usar. Está registrado en `index.ts` al startup.
- El `healthCheck()` hace ping al endpoint de site_info de Moodle con timeout de 10s.
- Los métodos `fetchCertificates()` y `validateCertificate()` son stubs — devuelven `[]` y `true` respectivamente. La implementación real requiere credenciales de Moodle funcionales.
- Cada operación de sync se loguea en `integration_logs` usando los helpers (`logSyncStart`, `logSyncComplete`, `logPerStudent`).

### Flujo 4: Overrides Manuales

```
Coordinador ──POST /overrides──► manual_overrides (status=active)
                                         │
                                         ▼
                              Rule engine lo detecta en evaluateNode()
                                         │
                                         ▼
                              Nodo overridden → fulfilled=true
```

**Contexto**: Un coordinador puede otorgar una excepción a un prerrequisito específico para un estudiante.

**Qué tener en cuenta**:

- Hay un índice único parcial: solo puede haber un override activo por `(student_id, rule_id)`.
- Los overrides con `status='revoked'` o `status='expired'` son ignorados por el rule engine.
- `expired` no se aplica automáticamente — requiere un cron job (Phase 6, DTS-OVERRIDE-1).
- La revocación (`PUT /overrides/:id/revoke`) es terminal — no se puede reactivar un override revocado.
- El `reason` debe tener mínimo 10 caracteres (validación Zod).

---

## Las Máquinas de Estado

### Certificates

```
PENDING ──sync OK──► ACTIVE
PENDING ──sync fail──► ERROR
ERROR   ──resync───► ACTIVE (si ok) o ERROR (si falla)
```

**Por qué importa**: Los certificados en estado `ERROR` o `PENDING` no cuentan para la evaluación de elegibilidad. Solo `status='approved' AND is_valid=true`.

### Manual Overrides

```
ACTIVE ──expiry date──► EXPIRED
ACTIVE ──revoke───────► REVOKED
```

**Cosas a recordar**: Ambos estados son terminales. Para volver a aplicar un override, se crea uno nuevo. El expire no es automático todavía — necesita DTS-OVERRIDE-1 (cron).

### Enrollments (sub-estado de examen)

```
null ──enroll to exam──► inscripto ──grade >= 4──► aprobado
                                     ──grade < 4───► desaprobado
desaprobado ──re-enroll──► inscripto
```

---

## Procesos Automáticos

### `updated_at` triggers

Todas las tablas principales tienen un trigger `BEFORE UPDATE` que actualiza `updated_at = NOW()`. Esto es automático — no necesitás setear `updated_at` manualmente en los INSERTs.

### Override expiry (PENDIENTE — Phase 6)

Un cron job diario debe: seleccionar overrides donde `expires_at < NOW() AND status='active'`, setear `status='expired'`, y re-evaluar la elegibilidad de los estudiantes afectados. **No implementado todavía**.

### Re-evaluación post-sync (PENDIENTE — Phase 6)

Después de un sync de Moodle, los estudiantes con nuevos certificados deben re-evaluarse. Si pasan de no-elegible a elegible, se genera una notificación. **No implementado todavía**.

---

## Integraciones Externas

### Moodle LMS (Certificate Source)

**Qué hace**: Provee los certificados de cursos completados por cada estudiante.

**Puntos de contacto**: `MoodleService.fetchCertificates(studentId)` → REST API de Moodle → `certificates` table.

**Qué considerar**:
- Las credenciales vienen de `MOODLE_API_URL` y `MOODLE_API_TOKEN` en `.env`.
- El provider está abstraído detrás de `CertificateProvider` — si Moodle cambia su API, solo se modifica el adapter.
- Para desarrollo local sin Moodle, los stubs devuelven datos vacíos. El sistema sigue funcionando (degradado).

### Guaraní SIU (Student Registry)

**Qué hace**: Provee el padrón de estudiantes (nombre, email, DNI, legajo).

**Puntos de contacto**: `GuaraniService.fetchStudents()` → REST API de Guaraní → `students` table.

**Qué considerar**:
- La implementación real está pendiente. Los stubs devuelven `[]`.
- Cuando se implemente, usa el mismo patrón de resiliencia que Moodle (retry, backoff, timeout).

---

## Puntos de Atención

### Cosas que podrían morderte

- **Supabase Admin vs Anon**: El cliente `supabase` (anon key) respeta RLS. El cliente `supabaseAdmin` (service role) bypassea RLS. Para queries que necesitan datos que RLS bloquearía (como listar todos los estudiantes siendo admin), usa `supabaseAdmin`. Las rutas de admin ya lo hacen.

- **Database types manuales**: Los tipos en `db/supabase.ts` están escritos a mano, no generados desde Supabase. Si modificás un schema en la DB, actualizá también los tipos acá.

- **El rule engine es síncrono una vez que tiene los datos**: Las queries a DB son async, pero la evaluación del árbol (buildRuleTree + evaluateNode) es síncrona y recursiva. Árboles muy profundos (>50 niveles) podrían causar stack overflow — aunque en la práctica nunca debería pasar.

- **JWT_SECRET debe tener al menos 32 caracteres**: `jose` requiere claves HS256 de al menos 256 bits. El fallback es `'placeholder-secret-key-minimum-32-characters'` que funciona en dev pero NO en producción.

### Dependencias no obvias

```
certificates ──── afecta elegibilidad ────► rule engine
       │
       └──── también ────► student progress (completedModules)
       
manual_overrides ──── bypass rule engine ────► elegibilidad forzada
```

---

## Antes de empezar cualquier cambio

Siempre es buena idea:

- Revisar `business-data-map.md` para entender los flujos y entidades afectadas.
- Identificar qué reglas de prerequisite podrían verse afectadas si tocás certificados o cursos.
- Verificar si el cambio afecta la evaluación de elegibilidad (la mayoría de los cambios en students/courses/certificates lo hacen).
- Correr `bun run typecheck` en `server/` antes de commitear.
- Si tocás el rule engine, correr `bun test` — hay 23 tests que cubren todos los paths.

## Recursos útiles

- `.context/business/business-data-map.md` — Entidades, flujos, state machines
- `.context/master-implementation-plan.md` — Roadmap de fases y sprints
- `.context/SRS/api-contracts.yaml` — OpenAPI spec completa
- `DESIGN.md` — Design system (MUI theme tokens)
- `server/src/services/rule-engine.test.ts` — Tests del motor de reglas (referencia de comportamiento esperado)
