# Especificación de Requisitos No Funcionales — DTS

> **Documento**: SRS · Especificaciones No Funcionales
> **Proyecto**: Sistema de Tracking de Diplomaturas — Universidad Nacional de Córdoba
> **Versión**: 1.0 · **Estado**: Borrador inicial
> **Idioma**: Español

---

## Convenciones

| ID | Categoría |
|----|-----------|
| NFR-PERF | Rendimiento |
| NFR-SEC | Seguridad |
| NFR-SCAL | Escalabilidad |
| NFR-REL | Fiabilidad |
| NFR-ACC | Accesibilidad / UX |
| NFR-MAINT | Mantenibilidad |
| NFR-INT | Integración / Provider |
| NFR-AUDIT | Auditoría |
| NFR-LANG | Internacionalización |

---

## 1. NFR de Rendimiento (Performance)

### NFR-PERF-001 — Tiempo de carga del dashboard

| Campo | Valor |
|-------|-------|
| **Descripción** | El dashboard principal del estudiante y del coordinador debe cargar su contenido inicial en menos de 2 segundos desde la solicitud HTTP hasta el renderizado completo. |
| **Racional** | Los dashboards son la interfaz primaria. Demoras >2s generan frustración y reducen adopción. |
| **Métrica** | T90 de carga (90% de las solicitudes completadas en ≤2s). Medido con herramientas de APM en staging y producción. |
| **Estrategia** | Carga lazy de secciones no visibles inicialmente. Cache de consultas frecuentes (TanStack Query). Indexación de tablas de lectura pesada. |

### NFR-PERF-002 — Búsqueda de certificados

| Campo | Valor |
|-------|-------|
| **Descripción** | La búsqueda y listado de certificados debe retornar resultados en menos de 1 segundo para cualquier consulta. |
| **Racional** | Los certificados son el dato más consultado después del dashboard. |
| **Métrica** | T95 < 1s para consultas paginadas de hasta 100 resultados. |
| **Estrategia** | Índices compuestos en (student_id, track_id, course_id). Paginación basada en cursor (no offset) para conjuntos grandes. |

### NFR-PERF-003 — Evaluación del motor de reglas

| Campo | Valor |
|-------|-------|
| **Descripción** | La evaluación de elegibilidad del motor de reglas para un estudiante individual debe completarse en menos de 500ms. |
| **Racional** | La elegibilidad se consulta en tiempo real en cada vista de perfil y dashboard. Es el cuello de botella crítico. |
| **Métrica** | T99 < 500ms por evaluación individual. |
| **Estrategia** | Evaluación en memoria (sin round-trips a DB durante el recorrido del árbol de reglas). Cache de resultados de certificados del estudiante. Árbol de reglas plano precargado. |

### NFR-PERF-004 — Sincronización batch

| Campo | Valor |
|-------|-------|
| **Descripción** | La sincronización batch de certificados desde Moodle para 500 estudiantes debe completarse en menos de 2 minutos. |
| **Racional** | El coordinador necesita actualizaciones rápidas, especialmente en períodos pre-examen. |
| **Métrica** | Tiempo total del batch para 500 estudiantes (incluyendo latencia de red a Moodle). |
| **Estrategia** | Procesamiento concurrente en bloques de 50 estudiantes. Timeouts configurables por request a Moodle (10s por defecto). |

---

## 2. NFR de Seguridad (Security)

### NFR-SEC-001 — Autenticación JWT

| Campo | Valor |
|-------|-------|
| **Descripción** | El sistema debe usar tokens JWT firmados con RSA256 (o HS256 con clave de ≥256 bits) para todas las sesiones de usuario. |
| **Racional** | JWT stateless permite escalar horizontalmente sin sesiones compartidas. |
| **Implementación** | Librería `jose` para firma/verificación. Access token: 15 min. Refresh token: 7 días (revocable via blacklist). |

### NFR-SEC-002 — Control de acceso basado en roles (RBAC)

| Campo | Valor |
|-------|-------|
| **Descripción** | Cada endpoint debe validar que el usuario autenticado tenga el rol requerido mediante middleware Hono. |
| **Racional** | Protección de datos sensibles (notas, datos personales) y operaciones administrativas. |
| **Implementación** | Middleware `authenticate` (valida JWT) + `requireRole(role[])` (verifica rol). Capa adicional: RLS en Supabase. |

### NFR-SEC-003 — Row Level Security (RLS)

| Campo | Valor |
|-------|-------|
| **Descripción** | Las políticas de RLS en Supabase deben garantizar que un usuario solo pueda acceder a filas que le corresponden según su rol y membresías. |
| **Racional** | Defensa en profundidad: si la capa de API es vulnerada, RLS impide acceso a datos no autorizados directamente en DB. |
| **Implementación** | Políticas por tabla: estudiantes ven solo sus enrollments, coordinadores ven estudiantes de sus tracks, admins ven todo. |

### NFR-SEC-004 — Protección de credenciales de integración

| Campo | Valor |
|-------|-------|
| **Descripción** | Los tokens y credenciales de integración (Moodle API token, Guaraní credentials) deben almacenarse cifrados (AES-256) y nunca exponerse en logs o respuestas de API. |
| **Racional** | Un leak del token de Moodle compromete todos los datos de certificación. |
| **Implementación** | Cifrado simétrico AES-256-GCM al persistir. Desencriptado solo en memoria durante la operación. Jamás en logs ni responses. |

### NFR-SEC-005 — Rate limiting

| Campo | Valor |
|-------|-------|
| **Descripción** | Los endpoints de autenticación deben tener rate limiting para prevenir ataques de fuerza bruta. |
| **Racional** | Protección contra ataques de enumeración de credenciales. |
| **Implementación** | Límite: 5 intentos por email cada 15 minutos. Bloqueo temporal tras 10 intentos fallidos. Headers `X-RateLimit-*` en respuesta. |

---

## 3. NFR de Escalabilidad (Scalability)

### NFR-SCAL-001 — Capacidad por facultad

| Campo | Valor |
|-------|-------|
| **Descripción** | El sistema debe soportar al menos 10,000 estudiantes activos por facultad sin degradación del rendimiento. |
| **Racional** | UNC tiene facultades con más de 10,000 estudiantes. El sistema debe escalar horizontalmente. |
| **Estrategia** | La API (Bun + Hono) es stateless y escala horizontalmente. La DB (Supabase/PostgreSQL) escala con read replicas para consultas. Las sincronizaciones batch se procesan con workers desacoplados. |

### NFR-SCAL-002 — Múltiples facultades

| Campo | Valor |
|-------|-------|
| **Descripción** | El sistema debe soportar múltiples facultades/departamentos en una sola instancia, con aislamiento de datos por facultad. |
| **Racional** | El modelo de negocio apunta a multi-institucional desde el diseño. |
| **Estrategia** | Las diplomaturas (tracks) pertenecen a una facultad/organización. RLS filtra por organización. El esquema permite sharding por organization_id si es necesario. |

### NFR-SCAL-003 — Concurrencia de sincronizaciones

| Campo | Valor |
|-------|-------|
| **Descripción** | El sistema debe manejar múltiples solicitudes de sincronización simultáneas (de diferentes facultades) sin degradación. |
| **Racional** | Cada facultad puede tener su propio Moodle. Las sincronizaciones no deben bloquearse entre sí. |
| **Estrategia** | Cola de trabajos por facultad. Procesamiento concurrente con límite configurable de workers. |

---

## 4. NFR de Fiabilidad (Reliability)

### NFR-REL-001 — Reintentos con backoff exponencial

| Campo | Valor |
|-------|-------|
| **Descripción** | Todas las operaciones de integración (Moodle, Guaraní) deben implementar reintentos automáticos con backoff exponencial ante fallas transitorias. |
| **Racional** | Las integraciones con sistemas externos son inherentemente frágiles. El sistema debe ser resiliente. |
| **Implementación** | 3 reintentos con backoff: 1s, 4s, 9s. Solo para errores recuperables (timeout, 5xx, rate limit). Errores 4xx (auth, not found) no reintentan. |

### NFR-REL-002 — Disponibilidad 99.5%

| Campo | Valor |
|-------|-------|
| **Descripción** | El sistema debe tener una disponibilidad del 99.5% durante el horario académico (lunes a viernes 8:00–20:00). |
| **Racional** | Sistema interno, no crítico-misión, pero la indisponibilidad en períodos pre-examen genera frustración generalizada. |
| **Estrategia** | Sin SLAs formales (sistema interno). Monitoreo con alertas. Deployment sin downtime (rolling update). |

### NFR-REL-003 — Degradación graceful ante falla de integración

| Campo | Valor |
|-------|-------|
| **Descripción** | Si Moodle o Guaraní no responden, el sistema debe seguir funcionando con los datos existentes (última sincronización exitosa). |
| **Racional** | La experiencia del estudiante no debe depender del uptime de sistemas externos. |
| **Implementación** | Cache de certificados y datos de estudiantes. Operaciones de solo lectura siempre disponibles. Escrituras (sync) fallan con mensaje claro pero no afectan otras funcionalidades. |

### NFR-REL-004 — Consistencia de datos en sincronización

| Campo | Valor |
|-------|-------|
| **Descripción** | La sincronización batch debe ser idempotente: ejecutarla múltiples veces produce el mismo resultado final. |
| **Racional** | Evitar certificados duplicados o estados inconsistentes ante reintentos. |
| **Implementación** | Upsert por (student_id, course_id). Fecha de última actualización registrada. Timestamp de sincronización para trazabilidad. |

---

## 5. NFR de Accesibilidad y UX (Accessibility)

### NFR-ACC-001 — Idioma español por defecto

| Campo | Valor |
|-------|-------|
| **Descripción** | La interfaz de usuario debe estar en español rioplatense por defecto, con opción de cambiar a inglés. |
| **Racional** | Los usuarios primarios (coordinadores, estudiantes) son hispanohablantes argentinos. |
| **Implementación** | i18n con react-i18next. Archivos de traducción `es-AR.json` / `en.json`. Detección automática del locale del navegador. Default: es-AR. |

### NFR-ACC-002 — Navegación responsive

| Campo | Valor |
|-------|-------|
| **Descripción** | La interfaz debe ser funcional en dispositivos móviles (smartphone) y desktop. |
| **Racional** | Los estudiantes acceden principalmente desde smartphone. Los coordinadores desde desktop. |
| **Implementación** | MUI Grid system. Breakpoints: xs (360px), sm (600px), md (900px), lg (1200px). Menu hamburguesa en mobile. Tablas horizontales con scroll en mobile. |

### NFR-ACC-003 — Accesibilidad WCAG 2.1 AA

| Campo | Valor |
|-------|-------|
| **Descripción** | El sistema debe cumplir con nivel AA de las WCAG 2.1 (contraste, navegación por teclado, etiquetas ARIA). |
| **Racional** | La UNC exige cumplimiento de accesibilidad web en sistemas institucionales. |
| **Implementación** | Contraste de color ≥ 4.5:1. Navegación completa por teclado (Tab, Enter, Escape). Roles y etiquetas ARIA en componentes interactivos. Tamaño de fuente mínimo 16px en formularios. |

### NFR-ACC-004 — Feedback visual inmediato

| Campo | Valor |
|-------|-------|
| **Descripción** | Toda acción del usuario debe tener feedback visual en menos de 200ms (loading states, confirmaciones, errores). |
| **Racional** | Las operaciones asincrónicas (sync, evaluaciones) requieren indicación clara de estado. |
| **Implementación** | TanStack Query maneja loading/error states. Skeletons en lugar de spinners para carga de listas. Toast notifications para operaciones batch. Barra de progreso para sincronizaciones. |

---

## 6. NFR de Mantenibilidad (Maintainability)

### NFR-MAINT-001 — Proveedor abstracto de integraciones

| Campo | Valor |
|-------|-------|
| **Descripción** | El sistema debe implementar un patrón Adapter/Strategy para todos los proveedores externos (LMS, sistema académico). Agregar un nuevo proveedor debe requerir solo implementar una interfaz sin modificar el core del sistema. |
| **Racional** | Diferenciador arquitectónico clave. Evita lock-in con Moodle/Guaraní. Reduce costo de agregar nuevos proveedores en ≥60%. |
| **Implementación** | Interfaz `CertificateProvider` con métodos `fetchCertificates(studentId)` y `validateCertificate(certificateId)`. Interfaz `AcademicProvider` con `fetchStudents()` y `fetchStudent(id)`. Service locator o DI para resolver el provider activo. Cada proveedor en su propio módulo dentro de `server/src/providers/`. |

### NFR-MAINT-002 — Tipos compartidos desde esquema DB

| Campo | Valor |
|-------|-------|
| **Descripción** | Los tipos TypeScript deben generarse automáticamente desde el esquema de Supabase, y los tipos compartidos entre backend y frontend deben residir en un módulo común. |
| **Racional** | Consistencia de tipos entre capas. Evita duplicación manual. |
| **Implementación** | `supabase gen types typescript --local > server/src/types/database.types.ts`. Tipos compartidos en `packages/shared/` o esquema de symlink. |

### NFR-MAINT-003 — Tests del motor de reglas

| Campo | Valor |
|-------|-------|
| **Descripción** | El motor de reglas debe tener cobertura de tests ≥95% branch coverage. |
| **Racional** | El motor de reglas es el núcleo de lógica de negocio. Un bug aquí produce errores de admisión con consecuencias institucionales. |
| **Implementación** | Tests unitarios (Vitest) para cada tipo de regla: ALL, ANY, compuestas, con overrides, sin certificados, casos borde. |

---

## 7. NFR de Integración (Integration / Provider)

### NFR-INT-001 — Extensibilidad de proveedores

| Campo | Valor |
|-------|-------|
| **Descripción** | Agregar un nuevo proveedor de certificaciones o sistema académico debe requerir únicamente crear una nueva clase que implemente la interfaz correspondiente, registrarla en configuración y sin modificar: motor de reglas, dashboards, endpoints de API, ni lógica de negocio. |
| **Racional** | Este NFR materializa el diferenciador arquitectónico definido en el PRD y la hipótesis H3 del modelo de negocio. |
| **Verificación** | Crear un provider mock (CanvasProvider) sin tocar ningún archivo fuera de `server/src/providers/canvas/` y `config/providers.yaml`. El sistema debe funcionar con el nuevo provider sin cambios en el core. |

### NFR-INT-002 — Aislamiento de fallas entre proveedores

| Campo | Valor |
|-------|-------|
| **Descripción** | Una falla en un proveedor (ej. Moodle caído) no debe afectar la operación de otros proveedores ni las funcionalidades del core que no dependen de ese proveedor. |
| **Racional** | Cada facultad puede tener su propio Moodle. Una facultad no debe verse afectada por problemas de otra. |
| **Implementación** | Timeouts por provider. Circuit breaker pattern por provider. Aislamiento de workers/colas por facultad. |

### NFR-INT-003 — Logging de integraciones

| Campo | Valor |
|-------|-------|
| **Descripción** | Toda operación de integración (sync, health check, error, reintento) debe registrarse en `integration_logs` con: timestamp, provider, action, result, duration_ms, error_message, student_id (si aplica). |
| **Racional** | Trazabilidad para diagnóstico de fallas. Base para métricas de salud de integraciones. |
| **Implementación** | Log estructurado en tabla `integration_logs`. Rotación automática (retener 90 días). Consultable desde el panel de administración. |

---

## 8. NFR de Auditoría (Audit)

### NFR-AUDIT-001 — Registro de acciones administrativas

| Campo | Valor |
|-------|-------|
| **Descripción** | Toda acción que modifique el estado del sistema (overrides, cambios de reglas, inscripciones, notas, cambios de rol) debe registrarse con: usuario, timestamp, acción, datos anteriores/nuevos, IP de origen. |
| **Racional** | Trazabilidad requerida por la UNC para procesos académicos. Permite revertir cambios. |
| **Implementación** | Tabla `audit_log`. Triggers de base de datos o middleware Hono para operaciones críticas. Consultable por administradores. |

### NFR-AUDIT-002 — Registro de cambios en reglas

| Campo | Valor |
|-------|-------|
| **Descripción** | Cada modificación en las reglas de prerrequisitos debe registrar el antes y después, incluyendo qué usuario realizó el cambio y cuándo. |
| **Racional** | Las reglas determinan la elegibilidad. Un cambio incorrecto puede habilitar o deshabilitar estudiantes indebidamente. |
| **Implementación** | Versionado de reglas (tabla `prerequisite_rule_versions`) o snapshot en audit_log. |

---

## 9. NFR de Internacionalización (Language)

### NFR-LANG-001 — Español como idioma primario

| Campo | Valor |
|-------|-------|
| **Descripción** | Toda la interfaz de usuario, mensajes de error, notificaciones y documentación debe estar disponible en español rioplatense. |
| **Racional** | Usuarios primarios: coordinadores académicos (tech proficiency media), estudiantes argentinos. |
| **Implementación** | i18n con react-i18next. Traducciones en JSON. Fechas en formato DD/MM/AAAA. Números con punto decimal y separador de miles: 1.234,56. |

### NFR-LANG-002 — Soporte de inglés como opción

| Campo | Valor |
|-------|-------|
| **Descripción** | El sistema debe ofrecer inglés como idioma alternativo seleccionable por el usuario. |
| **Racional** | Posibles usuarios internacionales o investigadores extranjeros en la UNC. |
| **Implementación** | Selector de idioma en navbar. Persistencia de preferencia en localStorage + perfil de usuario. Fallback a español si la traducción al inglés está incompleta. |

---

## 10. Stack Tecnológico — Restricciones

| Componente | Tecnología | Versión mínima | Justificación |
|---|---|---|---|
| Backend runtime | Bun | 1.2 | Rendimiento, tooling integrado, ecosistema TypeScript nativo |
| API framework | Hono | 4.0 | Ligero, tipado fuerte, middleware compose, compatible Bun |
| Frontend | React + Vite | React 19 + Vite 6 | Rendimiento, ecosistema, compatibilidad con MUI |
| UI library | MUI | 6.0 | Componentes accesibles, i18n, responsive |
| State server | TanStack React Query | 5.0 | Cache, loading states, refetch automático |
| State client | Zustand | 5.0 | Estado global liviano, sin boilerplate |
| Database | PostgreSQL (Supabase) | 15 | RLS, generación de tipos, hosting gestionado |
| Auth | Supabase Auth + jose | — | JWT + sesiones + integración con Supabase |
| Validation | Zod | 3.23 | Tipos inferidos, composición, mensajes en español |
| Testing | Vitest | 3.0 | Velocidad, compatibilidad con Bun y TypeScript |

---

## Resumen de Objetivos NFR

| Categoría | Objetivo principal |
|---|---|
| Rendimiento | Dashboard < 2s, evaluación reglas < 500ms, batch 500 students < 2min |
| Seguridad | JWT + RBAC + RLS + cifrado de credenciales + rate limiting |
| Escalabilidad | 10K+ estudiantes por facultad, multi-institución |
| Fiabilidad | 99.5% uptime, reintentos con backoff, degradación graceful |
| Accesibilidad | WCAG 2.1 AA, responsive, feedback visual inmediato |
| Mantenibilidad | Provider abstraction, tipos compartidos, branch coverage ≥95% en motor de reglas |
| Integración | Nuevo provider solo con adapter, sin cambios en core |
| Auditoría | Toda acción crítica registrada con usuario y timestamp |
| Idioma | Español rioplatense por defecto, inglés como opción |

---

> *Documento generado como parte del SRS del proyecto DTS. Próxima revisión: al identificar nuevos requerimientos no funcionales durante el desarrollo del MVP.*
