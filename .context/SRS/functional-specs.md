# Especificación de Requisitos Funcionales — DTS

> **Documento**: SRS · Especificaciones Funcionales
> **Proyecto**: Sistema de Tracking de Diplomaturas — Universidad Nacional de Córdoba
> **Versión**: 1.0 · **Estado**: Borrador inicial
> **Idioma**: Español

---

## Convenciones

| Prefijo | Significado |
|---------|-------------|
| FR-AUTH | Módulo de Autenticación y RBAC |
| FR-CERT | Gestión de Certificados |
| FR-DASH | Dashboard del Estudiante |
| FR-RULE | Motor de Reglas |
| FR-EXAM | Inscripción y Examen Integrador |
| FR-ENRL | Enrollment / Inscripción a Diplomatura |
| FR-INT | Capa de Integración (Moodle, Guaraní) |
| FR-ADMIN | Panel de Administración |

**Tipos de requisito:**

| Tipo | Descripción |
|------|-------------|
| Command | Escritura de datos (CUD) |
| Query | Lectura de datos |
| Batch | Procesamiento masivo / programado |
| Event | Reacción a un cambio de estado |

---

## Epic 1: Gestión de Certificados

### FR-CERT-001 — Sincronizar certificados desde Moodle

| Campo | Valor |
|-------|-------|
| **Descripción** | El sistema debe sincronizar certificados de cursos completados desde Moodle hacia DTS, asociándolos al perfil del estudiante correspondiente. Si un certificado ya existe, se actualiza su fecha en lugar de duplicarse. |
| **Prioridad** | Must Have |
| **Tipo** | Batch |
| **Business Rules** | BR01: El mapeo estudiante ↔ usuario Moodle se resuelve por email institucional. BR02: Un certificado se considera duplicado cuando coincide course_id + student_id. BR03: Los certificados con fecha anterior a la última sincronización exitosa no se reprocesan. |
| **Validation Criteria** | Por cada estudiante activo, se consulta a Moodle vía CertificateProvider. Los certificados nuevos se insertan, los existentes se actualizan si la fecha cambió. Los errores por estudiante se registran individualmente sin abortar el batch. Al finalizar, se retorna: total procesados, nuevos, actualizados, errores. |

### FR-CERT-002 — Visualizar certificados del estudiante

| Campo | Valor |
|-------|-------|
| **Descripción** | El estudiante debe poder ver la lista completa de certificados registrados en su perfil, incluyendo nombre del curso, fecha de certificación, origen (Moodle) y estado. |
| **Prioridad** | Must Have |
| **Tipo** | Query |
| **Business Rules** | BR04: Los certificados se muestran ordenados por fecha descendente. BR05: Los certificados con error de sincronización muestran estado "Error" con tooltip descriptivo. BR06: Los certificados pendientes de sincronizar muestran estado "Pendiente". |
| **Validation Criteria** | La consulta retorna todos los certificados del estudiante para la diplomatura activa. Tiempo de respuesta < 1s. Paginación de 20 elementos por página. |

### FR-CERT-003 — Re-sincronizar certificado individual

| Campo | Valor |
|-------|-------|
| **Descripción** | El administrador debe poder re-sincronizar el certificado de un estudiante específico, consultando Moodle nuevamente para ese estudiante y actualizando el registro individual. |
| **Prioridad** | Should Have |
| **Tipo** | Command |
| **Business Rules** | BR07: Solo administradores y coordinadores pueden disparar re-sincronización individual. BR08: La re-sincronización individual respeta los mismos mapeos que la batch. BR09: Se registra en integration_logs la acción con usuario y timestamp. |
| **Validation Criteria** | Al ejecutarse, consulta Moodle para el estudiante específico. Actualiza el certificado si corresponde. El dashboard del estudiante refleja el cambio inmediatamente. |

### FR-CERT-004 — Proveedor abstracto de certificaciones

| Campo | Valor |
|-------|-------|
| **Descripción** | La fuente de certificaciones debe estar abstraída tras una interfaz `CertificateProvider` que permita agregar nuevos LMS sin modificar la lógica de negocio del motor de reglas ni de los dashboards. |
| **Prioridad** | Must Have |
| **Tipo** | (Cross-cutting — arquitectura) |
| **Business Rules** | BR10: `CertificateProvider` expone `fetchCertificates(studentId): Promise<Certificate[]>` y `validateCertificate(certificateId): Promise<boolean>`. BR11: MoodleCertificateProvider implementa la interfaz consultando web services de Moodle. BR12: El sistema usa inyección de dependencias o service locator para resolver el provider activo según configuración. BR13: Agregar un nuevo proveedor requiere solo crear una clase que implemente la interfaz y registrarla en configuración. |
| **Validation Criteria** | Existe una interfaz TypeScript/abstracta. MoodleCertificateProvider la implementa. El motor de reglas y dashboards dependen de la interfaz, no de la implementación concreta. |

---

## Epic 2: Dashboard del Estudiante

### FR-DASH-001 — Ver progreso general en la diplomatura

| Campo | Valor |
|-------|-------|
| **Descripción** | El estudiante debe ver un resumen visual de su progreso: módulos completados vs. totales, con barra de progreso y estado individual por módulo (Completado / En curso / Pendiente). |
| **Prioridad** | Must Have |
| **Tipo** | Query |
| **Business Rules** | BR14: "Completado" = existe certificado sincronizado para ese curso. BR15: "En curso" = no hay certificado pero existe enrollment activo en el curso (si Moodle expone ese dato). BR16: "Pendiente" = no hay certificado ni indicio de cursado. BR17: La barra de progreso = (certificados_completados / total_modulos) × 100. |
| **Validation Criteria** | La consulta retorna estructura con totalMódulos, completados, lista de módulos con estado individual. Tiempo de respuesta < 2s. Actualización refleja nuevos certificados inmediatamente. |

### FR-DASH-002 — Consultar elegibilidad para examen integrador

| Campo | Valor |
|-------|-------|
| **Descripción** | El estudiante debe poder consultar en tiempo real si está habilitado para rendir el examen integrador, viendo el resultado de la evaluación del motor de reglas con desglose por regla. |
| **Prioridad** | Must Have |
| **Tipo** | Query |
| **Business Rules** | BR18: La evaluación se ejecuta contra el motor de reglas en tiempo real (no cache). BR19: Muestra "✅ Habilitado" o "❌ No habilitado — te falta: [lista de módulos]". BR20: Si el estudiante tiene override manual activo, se refleja en el desglose. |
| **Validation Criteria** | Tiempo de evaluación < 500ms. El resultado cambia instantáneamente al sincronizar un nuevo certificado o al aplicar/vencer un override. |

### FR-DASH-003 — Ver próximos pasos recomendados

| Campo | Valor |
|-------|-------|
| **Descripción** | El estudiante debe ver una sección "Próximos pasos" que lista los módulos disponibles para cursar (cuyos prerrequisitos ya cumplió), ordenados por recomendación. |
| **Prioridad** | Must Have |
| **Tipo** | Query |
| **Business Rules** | BR21: Un módulo está "disponible" cuando todos sus prerrequisitos directos están cumplidos. BR22: El orden de recomendación es: módulos sin prerrequisitos → módulos con prerrequisitos cumplidos. BR23: Si no hay módulos disponibles, muestra mensaje "Completaste todos los módulos. Consultá tu elegibilidad para el examen integrador." |
| **Validation Criteria** | La sección solo muestra módulos cuyos prerrequisitos están satisfechos. No muestra módulos ya completados. |

---

## Epic 3: Motor de Reglas

### FR-RULE-001 — Configurar reglas de prerrequisitos por diplomatura

| Campo | Valor |
|-------|-------|
| **Descripción** | El coordinador debe poder definir las reglas de prerrequisitos para el examen integrador de una diplomatura, usando condiciones ALL (debe tener todos), ANY (debe tener al menos uno) o combinaciones anidadas. |
| **Prioridad** | Must Have |
| **Tipo** | Command |
| **Business Rules** | BR24: Una regla puede ser de tipo ALL o ANY. BR25: Una regla puede contener referencias a cursos (course_id) o a sub-reglas (anidadas). BR26: Las reglas se persisten en la tabla `prerequisite_rules` con estructura jerárquica. BR27: Los cambios de reglas se aplican inmediatamente a todos los estudiantes de la diplomatura (la elegibilidad se re-evalúa al consultar, no se cachea). BR28: Solo coordinadores y administradores de esa diplomatura pueden modificar reglas. |
| **Validation Criteria** | Se puede crear regla ALL con N cursos. Se puede crear regla ANY con N cursos. Se puede crear regla compuesta: ALL([curso1, ANY(curso2, curso3)]). Las reglas persisten y son recuperables. |

### FR-RULE-002 — Evaluar elegibilidad en tiempo real

| Campo | Valor |
|-------|-------|
| **Descripción** | El motor de reglas debe evaluar instantáneamente si un estudiante cumple las reglas configuradas para su diplomatura, mostrando resultado global y desglose por regla. |
| **Prioridad** | Must Have |
| **Tipo** | Query |
| **Business Rules** | BR29: La evaluación recorre el árbol de reglas recursivamente. BR30: Regla ALL = todos los hijos deben cumplirse. Regla ANY = al menos un hijo debe cumplirse. BR31: Un curso se cumple si existe un certificado válido asociado al estudiante para ese course_id. BR32: Los overrides manuales activos se evalúan antes que los certificados (un override activo marca la regla como cumplida). BR33: Tiempo de evaluación ≤ 500ms por estudiante. |
| **Validation Criteria** | Evalúa correctamente ALL, ANY, y combinaciones. Respeta overrides activos. Retorna desglose: {resultado, reglas: [{id, tipo, cursos, cumplido, override?}]}. |

### FR-RULE-003 — Override manual de reglas

| Campo | Valor |
|-------|-------|
| **Descripción** | El coordinador debe poder exceptuar a un estudiante del cumplimiento de una regla específica mediante un override, registrando motivo obligatorio y fecha de vencimiento opcional. |
| **Prioridad** | Should Have |
| **Tipo** | Command |
| **Business Rules** | BR34: El override requiere: regla_id, student_id, motivo (obligatorio, min 10 caracteres), vencimiento (opcional). BR35: Si tiene vencimiento, el sistema desactiva el override automáticamente al llegar la fecha y re-evalúa elegibilidad. BR36: Solo coordinadores de esa diplomatura pueden crear overrides. BR37: El override se registra en `manual_overrides` con created_by, timestamp, motivo. BR38: No puede haber dos overrides activos para la misma regla+estudiante. BR39: Los overrides vencidos se mantienen en el historial con estado "expired". |
| **Validation Criteria** | Se crea override con motivo. Se refleja en la evaluación de elegibilidad. Se puede crear con vencimiento. Al vencer, la regla vuelve a su evaluación normal. El historial conserva el registro. |

---

## Epic 4: Inscripción y Examen Integrador

### FR-EXAM-001 — Inscribir estudiante a examen

| Campo | Valor |
|-------|-------|
| **Descripción** | El coordinador debe poder inscribir a un estudiante habilitado a una fecha de examen, con re-evaluación de elegibilidad al momento de la inscripción. |
| **Prioridad** | Must Have |
| **Tipo** | Command |
| **Business Rules** | BR40: Solo estudiantes con estado "Habilitado" pueden ser inscriptos. BR41: El sistema re-evalúa elegibilidad al momento de la inscripción (no confía en estado cacheado). BR42: Si el estudiante ya no está habilitado, la inscripción se rechaza con mensaje claro. BR43: Un estudiante puede inscribirse a múltiples fechas (si desaprueba y quiere rendir de nuevo). BR44: La inscripción se registra en enrollments con status "inscripto". |
| **Validation Criteria** | Estudiante habilitado → inscripción exitosa con re-evaluación. Estudiante no habilitado → inscripción rechazada. Duplicado a misma fecha → rechazado (si ya existe inscripción activa para esa fecha). |

### FR-EXAM-002 — Registrar nota del examen

| Campo | Valor |
|-------|-------|
| **Descripción** | El coordinador debe poder cargar la nota del examen integrador (escala 1-10), con resultado Aprobado (≥4) o Desaprobado. |
| **Prioridad** | Must Have |
| **Tipo** | Command |
| **Business Rules** | BR45: La nota debe ser numérica entre 1 y 10. BR46: Nota ≥ 4 → estado "aprobado", estudiante pasa a "Diploma pendiente". BR47: Nota < 4 → estado "desaprobado", estudiante puede reinscribirse a otra fecha. BR48: La nota queda registrada con timestamp y usuario que la cargó. BR49: Solo el coordinador de la diplomatura puede cargar notas. BR50: No se puede modificar una nota ya cargada (requiere acción admin con registro de auditoría). |
| **Validation Criteria** | Carga nota 7 → aprobado, diploma pendiente. Carga nota 3 → desaprobado, reinscripción posible. Carga nota 11 o 0 → error de validación. Intento de modificar nota → bloqueado. |

### FR-EXAM-003 — Ver historial de exámenes por estudiante

| Campo | Valor |
|-------|-------|
| **Descripción** | El estudiante debe poder ver el historial completo de sus exámenes integradores: fechas, notas, resultados y estado del diploma. |
| **Prioridad** | Should Have |
| **Tipo** | Query |
| **Business Rules** | BR51: El historial muestra todos los intentos de examen del estudiante. BR52: Orden cronológico descendente. BR53: Si el diploma fue emitido, muestra código o referencia. |
| **Validation Criteria** | Lista completa de exámenes con datos. Paginación si > 10 registros. |

---

## Epic 5: Integración Moodle (Provider Layer)

### FR-INT-001 — Conectar DTS con Moodle vía API

| Campo | Valor |
|-------|-------|
| **Descripción** | El administrador debe poder configurar la conexión con Moodle desde DTS (URL del sitio + token de servicio web), con prueba de conexión. |
| **Prioridad** | Must Have |
| **Tipo** | Command |
| **Business Rules** | BR54: La URL y token se almacenan cifrados (AES-256) en la base de datos o en variable de entorno. BR55: La prueba de conexión ejecuta un health check contra el web service de Moodle. BR56: Si la conexión falla, se muestra el error específico (timeout, autenticación, URL inválida). BR57: Solo administradores pueden configurar/modificar la conexión. |
| **Validation Criteria** | Configurar URL+tokens válidos → conexión exitosa. Configurar token inválido → error de autenticación. URL inalcanzable → timeout. Los datos persisten cifrados. |

### FR-INT-002 — Sincronización batch de certificados

| Campo | Valor |
|-------|-------|
| **Descripción** | El administrador debe poder disparar una sincronización masiva de certificados para todos los estudiantes activos, con indicador de progreso y resumen final. |
| **Prioridad** | Must Have |
| **Tipo** | Batch |
| **Business Rules** | BR58: El batch procesa estudiantes en bloques de 50 para evitar sobrecargar Moodle. BR59: No puede ejecutarse si otra sincronización batch está en curso. BR60: El progreso se muestra en tiempo real vía polling o WebSocket. BR61: Al finalizar muestra: total procesados, nuevos, actualizados, errores, duración. BR62: Cada operación individual se registra en integration_logs. |
| **Validation Criteria** | Batch procesa todos los estudiantes activos. No permite ejecución concurrente. Resumen correcto. Logs generados. |

### FR-INT-003 — Monitorear estado de integración Moodle

| Campo | Valor |
|-------|-------|
| **Descripción** | El panel de administración debe mostrar el estado de la integración con Moodle: conectado/desconectado, última sincronización, cantidad de certificados sincronizados. |
| **Prioridad** | Must Have |
| **Tipo** | Query |
| **Business Rules** | BR63: El estado "conectado" se determina por el último health check exitoso (cacheado por máximo 5 minutos). BR64: Si el health check falla, el estado pasa a "error" con timestamp del fallo. BR65: Muestra última sincronización exitosa (fecha, duración, cantidad de certificados). |
| **Validation Criteria** | Estado refleja correctamente conexión activa/fallida. Última sincronización visible. |

### FR-INT-004 — Adapter resiliente para integraciones

| Campo | Valor |
|-------|-------|
| **Descripción** | El adapter de integración debe manejar fallas de red, timeouts y errores del proveedor con reintentos con backoff exponencial y degradación graceful. |
| **Prioridad** | Must Have |
| **Tipo** | (Cross-cutting — arquitectura) |
| **Business Rules** | BR66: Ante fallo de red, reintentar hasta 3 veces con backoff exponencial (1s, 4s, 9s). BR67: Si todas las intentonas fallan, registrar error y notificar al administrador. BR68: Las fallas de un estudiante no afectan el procesamiento de otros (aislamiento). BR69: El sistema sigue funcionando con los datos existentes ante falla de integración. BR70: El patrón se aplica a todos los proveedores (Moodle, Guaraní, futuros). |
| **Validation Criteria** | Timeout → reintento automático. Fallas de un estudiante no abortan el batch. Sistema funcional sin integración (datos cacheados). Logs de reintentos registrados. |

### FR-INT-005 — Proveedor abstracto para sistema académico

| Campo | Valor |
|-------|-------|
| **Descripción** | El sistema académico (padrón de estudiantes) debe estar abstraído tras una interfaz `AcademicProvider` que permita reemplazar Guaraní por otro sistema sin modificar la lógica de negocio. |
| **Prioridad** | Should Have |
| **Tipo** | (Cross-cutting — arquitectura) |
| **Business Rules** | BR71: `AcademicProvider` expone `fetchStudents(): Promise<Student[]>`, `fetchStudent(id): Promise<Student>`. BR72: GuaraniAcademicProvider implementa la interfaz consultando servicios SIU. BR73: La inscripción manual de estudiantes no depende del provider académico (puede operar sin conexión). |
| **Validation Criteria** | Interfaz definida. Implementación Moodle y Guaraní separadas. Dashboard y motor de reglas no dependen del provider concreto. |

---

## Epic 6: Panel de Administración

### FR-ADMIN-001 — Gestionar estudiantes

| Campo | Valor |
|-------|-------|
| **Descripción** | El administrador debe poder listar, buscar y ver el detalle completo de cualquier estudiante del sistema. |
| **Prioridad** | Must Have |
| **Tipo** | Query |
| **Business Rules** | BR74: Búsqueda por nombre, apellido, email con coincidencia parcial (LIKE). BR75: Listado paginado (20 por página). BR76: El perfil muestra: datos personales, diplomaturas activas, certificados, exámenes, overrides activos. |
| **Validation Criteria** | Búsqueda retorna resultados esperados. Paginación funciona. Perfil completo sin errores. |

### FR-ADMIN-002 — Dashboard con estadísticas básicas

| Campo | Valor |
|-------|-------|
| **Descripción** | El panel de administración debe mostrar métricas agregadas: total de estudiantes, diplomaturas activas, certificados sincronizados, estudiantes habilitados vs. no habilitados. |
| **Prioridad** | Must Have |
| **Tipo** | Query |
| **Business Rules** | BR77: Las métricas se calculan en tiempo real (no cache). BR78: Estudiantes habilitados = aquellos cuya evaluación del motor de reglas retorna true para al menos una diplomatura activa. BR79: Certificados sincronizados hoy = contador de inserts del día actual. |
| **Validation Criteria** | Las tarjetas de métricas muestran valores correctos y consistentes. Actualización refleja cambios recientes. |

### FR-ADMIN-003 — Configurar nueva diplomatura

| Campo | Valor |
|-------|-------|
| **Descripción** | El administrador debe poder crear una nueva diplomatura con nombre, descripción, lista de módulos y reglas de prerrequisitos, sin intervención del equipo de desarrollo. |
| **Prioridad** | Should Have |
| **Tipo** | Command |
| **Business Rules** | BR80: Una diplomatura tiene: nombre, descripción, estado (activa/inactiva). BR81: Los módulos son cursos referenciados (course_id, nombre, orden). BR82: Las reglas se configuran en el mismo flujo (reutiliza FR-RULE-001). BR83: La diplomatura queda visible para coordinadores asignados inmediatamente. |
| **Validation Criteria** | Crear diplomatura con 5 módulos → visible. Asignar coordinador → coordinador ve la diplomatura. Reglas configuradas → evaluables para estudiantes inscriptos. |

### FR-ADMIN-004 — Gestión de usuarios y roles

| Campo | Valor |
|-------|-------|
| **Descripción** | El administrador debe poder crear usuarios, asignar roles (estudiante, coordinador, admin, sysadmin), y gestionar membresías a diplomaturas. |
| **Prioridad** | Must Have |
| **Tipo** | Command |
| **Business Rules** | BR84: Los roles disponibles son: estudiante, coordinador, admin, sysadmin. BR85: Un coordinador debe estar asociado a al menos una diplomatura. BR86: Solo admins y sysadmins pueden crear/modificar usuarios. BR87: sysadmin tiene todos los permisos + acceso a configuración del sistema. |
| **Validation Criteria** | Crear usuario coordinador asignado a diplomatura. Crear estudiante sin diplomatura. Cambiar rol de usuario existente. sysadmin puede gestionar cualquier recurso. |

---

## Epic 7: Enrollment / Inscripción a Diplomatura

### FR-ENRL-001 — Inscribir estudiante a una diplomatura

| Campo | Valor |
|-------|-------|
| **Descripción** | El coordinador debe poder inscribir manualmente a un estudiante existente en una diplomatura, activando su seguimiento en el sistema. |
| **Prioridad** | Must Have |
| **Tipo** | Command |
| **Business Rules** | BR88: El estudiante debe existir en el sistema (si no existe, se crea con datos básicos primero). BR89: No se permite inscripción duplicada a la misma diplomatura (misma student_id + track_id). BR90: Al inscribir, se crea enrollment con fecha y status "activo". BR91: El estudiante aparece inmediatamente en el dashboard del coordinador. |
| **Validation Criteria** | Inscripción exitosa → enrollment creado. Inscripción duplicada → rechazada. Estudiante nuevo → se crea antes de inscribir. |

### FR-ENRL-002 — Inscripción masiva desde archivo

| Campo | Valor |
|-------|-------|
| **Descripción** | El coordinador debe poder inscribir múltiples estudiantes desde un archivo CSV con emails, procesando en batch: estudiantes nuevos se crean, existentes se inscriben. |
| **Prioridad** | Should Have |
| **Tipo** | Batch |
| **Business Rules** | BR92: El CSV debe tener columna email (obligatorio) y columnas opcionales nombre/apellido. BR93: Los emails inválidos se registran como error sin abortar el batch. BR94: Los estudiantes ya inscriptos se omiten (no error, se cuentan como "ya inscriptos"). BR95: Al finalizar muestra: creados, inscriptos, ya inscriptos, errores. |
| **Validation Criteria** | CSV con 50 emails → 50 procesados. Emails inválidos → cuentan como errores. Emails duplicados en el CSV → no crean duplicados. |

---

## Epic 8: Integración Guaraní (SIU)

### FR-INT-006 — Sincronizar padrón de estudiantes desde Guaraní

| Campo | Valor |
|-------|-------|
| **Descripción** | El administrador debe poder importar el padrón de estudiantes desde Guaraní (SIU), creando o actualizando perfiles en DTS. |
| **Prioridad** | Should Have |
| **Tipo** | Batch |
| **Business Rules** | BR96: La sincronización importa: nombre, apellido, email, documento, legajo. BR97: Los estudiantes nuevos se crean automáticamente en DTS. BR98: Los estudiantes existentes se actualizan si algún campo cambió. BR99: La sincronización respeta el mismo patrón de provider abstracto (AcademicProvider). |
| **Validation Criteria** | Sincronización crea estudiantes nuevos. Actualiza datos de existentes. No duplica si el estudiante ya existe. Logs generados. |

### FR-INT-007 — Adapter resiliente para Guaraní

| Campo | Valor |
|-------|-------|
| **Descripción** | El adapter de Guaraní debe implementar manejo de errores con reintentos, backoff exponencial, y operación degradada cuando Guaraní no responde. |
| **Prioridad** | Should Have |
| **Tipo** | (Cross-cutting — arquitectura) |
| **Business Rules** | BR100: Reintenta hasta 3 veces con backoff exponencial (1s, 4s, 9s). BR101: Si todas fallan, registra error y notifica al administrador. BR102: El sistema sigue funcionando con datos cacheados. BR103: Los mismos principios aplican a FR-INT-004. |
| **Validation Criteria** | Guaraní caído → reintentos + error log. Sistema funcional con datos previos. Administrador notificado. |

---

## Epic 9: Autenticación y RBAC

### FR-AUTH-001 — Inicio de sesión con JWT

| Campo | Valor |
|-------|-------|
| **Descripción** | El sistema debe autenticar usuarios mediante email y contraseña, emitiendo un token JWT (access + refresh) para sesiones seguras. |
| **Prioridad** | Must Have |
| **Tipo** | Command |
| **Business Rules** | BR104: Las credenciales se validan contra Supabase Auth (hash bcrypt). BR105: El access token expira en 15 minutos. BR106: El refresh token expira en 7 días. BR107: El token JWT incluye: user_id, role, track_ids (diplomaturas asociadas). BR108: Las contraseñas deben tener mínimo 8 caracteres. |
| **Validation Criteria** | Login exitoso → access + refresh tokens. Login fallido → error 401. Token expirado → 401 + renovación vía refresh. |

### FR-AUTH-002 — Cierre de sesión

| Campo | Valor |
|-------|-------|
| **Descripción** | El usuario debe poder cerrar sesión, invalidando el refresh token activo. |
| **Prioridad** | Must Have |
| **Tipo** | Command |
| **Business Rules** | BR109: Al cerrar sesión, el refresh token se revoca (blacklist en DB). BR110: Los access tokens existentes siguen siendo válidos hasta su expiración natural (15 min). |
| **Validation Criteria** | Logout → refresh token revocado. Access token previo no puede renovarse. |

### FR-AUTH-003 — Obtener perfil del usuario autenticado

| Campo | Valor |
|-------|-------|
| **Descripción** | El usuario debe poder obtener su perfil y permisos actuales a partir del token JWT. |
| **Prioridad** | Must Have |
| **Tipo** | Query |
| **Business Rules** | BR111: Retorna datos del usuario + rol + diplomaturas asociadas. BR112: No requiere consulta a DB si el token incluye todos los datos necesarios (self-contained). |
| **Validation Criteria** | GET /auth/me con token válido → datos del usuario. Token inválido → 401. |

### FR-AUTH-004 — Control de acceso basado en roles (RBAC)

| Campo | Valor |
|-------|-------|
| **Descripción** | El sistema debe aplicar control de acceso por roles en cada endpoint, usando middleware de autorización. |
| **Prioridad** | Must Have |
| **Tipo** | (Cross-cutting — arquitectura) |
| **Business Rules** | BR113: Roles: estudiante, coordinador, admin, sysadmin. BR114: Middleware `requireRole(role)` inyectado en la cadena Hono. BR115: Estudiantes solo ven sus propios datos. BR116: Coordinadores ven datos de estudiantes de sus diplomaturas asignadas. BR117: Admins ven todos los datos. BR118: Sysadmin tiene permisos de admin + gestión de configuración del sistema. BR119: Se aplica RLS (Row Level Security) en Supabase como capa adicional de defensa en profundidad. |
| **Validation Criteria** | Estudiante intenta ver otro estudiante → 403. Coordinador ve solo su diplomatura. Admin ve todo. Middleware correctamente encadenado. |

---

## Epic 10: Notificaciones

### FR-NOTIF-001 — Notificación al habilitarse para examen

| Campo | Valor |
|-------|-------|
| **Descripción** | El estudiante debe recibir una notificación cuando el motor de reglas lo evalúa como "habilitado" para el examen integrador. |
| **Prioridad** | Should Have |
| **Tipo** | Event |
| **Business Rules** | BR120: La notificación se genera automáticamente cuando la evaluación del motor de reglas pasa de "no habilitado" a "habilitado". BR121: La notificación persiste en DB hasta que el estudiante la marque como leída. BR122: Opcionalmente se envía email si hay configuración SMTP. |
| **Validation Criteria** | Nueva certificación → re-evaluación → habilitado → notificación generada. Notificación visible en el dashboard. |

### FR-NOTIF-002 — Notificación de certificación nueva

| Campo | Valor |
|-------|-------|
| **Descripción** | El estudiante debe recibir una notificación cuando un nuevo certificado se sincroniza a su perfil. |
| **Prioridad** | Could Have |
| **Tipo** | Event |
| **Business Rules** | BR123: Se genera solo para certificados nuevos (no para actualizaciones de existentes). BR124: Incluye nombre del curso y fecha de certificación. |
| **Validation Criteria** | Sincronización batch con certificado nuevo → notificación. Actualización de certificado existente → sin notificación. |

---

## Matriz de Trazabilidad MVP → FR

| MVP Story ID | FR ID(s) | Epic |
|---|---|---|
| DTS-101 | FR-CERT-001, FR-CERT-004 | Certificados |
| DTS-102 | FR-CERT-002 | Dashboard |
| DTS-103 | FR-CERT-003 | Certificados |
| DTS-104 | FR-CERT-004 | Certificados / Provider |
| DTS-201 | FR-DASH-001 | Dashboard |
| DTS-202 | FR-DASH-002 | Dashboard / Rule Engine |
| DTS-203 | FR-DASH-003 | Dashboard |
| DTS-301 | FR-RULE-001, FR-ADMIN-003 | Rule Engine / Admin |
| DTS-302 | FR-RULE-002, FR-DASH-002 | Rule Engine / Dashboard |
| DTS-303 | FR-RULE-003 | Rule Engine |
| DTS-401 | FR-EXAM-001 | Examen |
| DTS-402 | FR-EXAM-002 | Examen |
| DTS-403 | FR-EXAM-003 | Examen |
| DTS-501 | FR-INT-001 | Integración |
| DTS-502 | FR-INT-002, FR-CERT-001 | Integración / Certificados |
| DTS-503 | FR-INT-003 | Admin / Integración |
| DTS-601 | FR-ADMIN-001 | Admin |
| DTS-602 | FR-ADMIN-002 | Admin |
| DTS-603 | FR-ADMIN-003 | Admin |
| DTS-701 | FR-ENRL-001 | Enrollment |
| DTS-702 | FR-ENRL-002 | Enrollment |
| DTS-801 | FR-INT-006 | Integración (Guaraní) |
| DTS-802 | FR-INT-004, FR-INT-007 | Integración (Guaraní) |
| DTS-901 | FR-NOTIF-001 | Notificaciones |
| DTS-902 | FR-NOTIF-002 | Notificaciones |

---

> *Documento generado como parte del SRS del proyecto DTS. Próxima revisión: al completar la validación de alcance con stakeholders de UNC.*
