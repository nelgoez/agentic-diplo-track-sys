# MVP Scope — Diploma Tracking System (DTS)

> **Documento**: PRD · Alcance del MVP
> **Proyecto**: Sistema de Tracking de Diplomaturas — Universidad Nacional de Córdoba
> **Versión**: 1.0 · **Estado**: Borrador inicial
> **Idioma**: Español

---

## Clasificación

Las historias se clasifican según el esquema MoSCoW:

| Prioridad | Significado | Cantidad estimada |
|---|---|---|
| **Must Have** | Sin esto no hay MVP. Bloqueante. | 7 |
| **Should Have** | Importante pero no bloqueante. Se incluye si el tiempo lo permite. | 4 |
| **Could Have** | Deseable para versiones posteriores. No compromete el MVP. | 2 |
| **Won't Have (this time)** | Excluido explícitamente del MVP. | 2+ |

---

## Epic 1: Gestión de Certificados (Must Have)

Un certificado representa la aprobación de un módulo/cursado dentro de una diplomatura. Los certificados se originan en Moodle y se sincronizan a DTS.

| ID | Historia | Prioridad | Criterios de Aceptación (Gherkin) |
|---|---|---|---|
| DTS-101 | **Sincronizar certificados desde Moodle** — Como coordinador, quiero que los certificados de cursado se sincronicen automáticamente desde Moodle a DTS, así no tengo que cargarlos manualmente. | **Must Have** | Dado un estudiante con cursos completados en Moodle, Cuando el coordinador inicia una sincronización desde DTS, Entonces los certificados se importan y se asocian al perfil del estudiante en DTS. Y si un certificado ya existe, se actualiza su fecha en lugar de duplicarse. |
| DTS-102 | **Visualizar certificados asociados** — Como estudiante, quiero ver la lista de certificados que tengo registrados en la diplomatura, así puedo verificar que todo esté en orden. | **Must Have** | Dado un estudiante logueado en su dashboard, Cuando navega a la sección "Mis certificados", Entonces ve una tabla con: nombre del curso, fecha de certificación, origen (Moodle). Y si un certificado no se sincronizó, ve el estado "Pendiente de sincronización". |
| DTS-103 | **Re-sincronizar certificados individuales** — Como administrador, quiero poder re-sincronizar certificados de un estudiante específico, así puedo corregir errores de importación sin reprocesar todo. | **Should Have** | Dado un certificado con estado "Error de sincronización", Cuando el administrador hace clic en "Re-sincronizar", Entonces DTS consulta Moodle para ese estudiante y actualiza el certificado. |
| DTS-104 | **Proveedor abstracto de certificaciones** — Como desarrollador, quiero que la fuente de certificaciones esté abstraída tras una interfaz Provider, así puedo agregar nuevos LMS sin modificar la lógica de negocio. | **Must Have** | Dado que existe una interfaz `CertificateProvider` con métodos `fetchCertificates(studentId)` y `validateCertificate(certificateId)`, Cuando se quiere agregar un nuevo LMS, Entonces solo se implementa esa interfaz sin tocar el motor de reglas ni los dashboards. |

---

## Epic 2: Dashboard del Estudiante (Must Have)

El dashboard del estudiante es la cara visible del sistema. Debe responder instantáneamente: _¿En qué estado estoy? ¿Qué me falta? ¿Puedo rendir?_

| ID | Historia | Prioridad | Criterios de Aceptación |
|---|---|---|---|
| DTS-201 | **Ver progreso general en la diplomatura** — Como estudiante, quiero ver un resumen de mi progreso (módulos completados / totales), así sé de un vistazo cómo voy. | **Must Have** | Dado un estudiante inscripto en una diplomatura, Cuando accede a su dashboard, Entonces ve una barra de progreso con "X de Y módulos completados". Y ve el listado de módulos con su estado individual: "Completado", "En curso", "Pendiente". |
| DTS-202 | **Consultar elegibilidad para examen integrador** — Como estudiante, quiero saber si estoy habilitada para rendir el examen final, así puedo inscribirme en las fechas correspondientes. | **Must Have** | Dado un estudiante con al menos un certificado registrado, Cuando consulta su elegibilidad en el dashboard, Entonces ve: "✅ Habilitado" o "❌ No habilitado — te falta: [lista de módulos]". Y la evaluación se actualiza en tiempo real al sincronizar un nuevo certificado. |
| DTS-203 | **Ver próximos pasos recomendados** — Como estudiante, quiero ver qué módulos me conviene cursar a continuación según las reglas de prerrequisitos, así puedo planificar mi cursado. | **Must Have** | Dado un estudiante con módulos pendientes, Cuando ve su dashboard, Entonces ve una sección "Próximos pasos" que lista los módulos disponibles para cursar (cuyos prerrequisitos ya cumplió), ordenados por recomendación. |

---

## Epic 3: Motor de Reglas (Must Have)

El motor de reglas evalúa si un estudiante cumple los prerrequisitos para rendir el examen integrador. Admite reglas ALL (debe tener todos los módulos), ANY (debe tener al menos uno) y compuestas.

| ID | Historia | Prioridad | Criterios de Aceptación |
|---|---|---|---|
| DTS-301 | **Configurar reglas de prerrequisitos por diplomatura** — Como coordinador, quiero definir qué módulos son prerrequisito para rendir el examen integrador, así el motor evalúa automáticamente la elegibilidad. | **Must Have** | Dado un coordinador con permisos de edición, Cuando configura las reglas de una diplomatura, Entonces puede agregar reglas ALL ("debe tener todos estos módulos"), ANY ("debe tener al menos uno de estos") o combinaciones. Y las reglas se persisten y se aplican inmediatamente a todos los estudiantes. |
| DTS-302 | **Evaluar elegibilidad en tiempo real** — Como coordinador, quiero que al consultar un estudiante el motor evalúe instantáneamente si cumple las reglas, así no tengo que hacerlo manualmente. | **Must Have** | Dado un estudiante con certificados registrados y reglas configuradas, Cuando el coordinador consulta su perfil, Entonces el motor evalúa todas las reglas y muestra: resultado (habilitado/no habilitado), desglose por regla (cuáles cumplió y cuáles no). Y el tiempo de evaluación es <500ms. |
| DTS-303 | **Override manual de reglas** — Como coordinador, quiero poder exceptuar a un estudiante del cumplimiento de una regla específica, así puedo manejar casos especiales (equivalencias, certificaciones externas). | **Should Have** | Dado un estudiante que no cumple una regla, Cuando el coordinador aplica un override, Entonces debe ingresar: regla a exceptuar, motivo obligatorio, fecha de vencimiento del override (opcional). Y el override queda registrado en el historial con timestamp y usuario. Y el dashboard del estudiante refleja el cambio. |

---

## Epic 4: Inscripción y Examen Integrador (Must Have)

El flujo del examen integrador es el evento terminal del ciclo. DTS debe gestionar inscripción, verificación de admisión, registro de nota y resultado final.

| ID | Historia | Prioridad | Criterios de Aceptación |
|---|---|---|---|
| DTS-401 | **Inscribir estudiante a examen** — Como coordinador, quiero inscribir a un estudiante habilitado a una fecha de examen, así queda registrado oficialmente. | **Must Have** | Dado un estudiante con estado "Habilitado", Cuando el coordinador lo inscribe a una fecha de examen, Entonces se crea un registro de inscripción con: estudiante, fecha, estado "Inscripto". Y el sistema valida que el estudiante siga habilitado al momento de la inscripción (re-evaluación). |
| DTS-402 | **Registrar nota del examen** — Como coordinador, quiero cargar la nota del examen integrador de cada estudiante, así el sistema registra el resultado final. | **Must Have** | Dado un estudiante inscripto a una fecha de examen, Cuando el coordinador carga la nota, Entonces el examen pasa a estado "Aprobado" (si nota ≥ 4) o "Desaprobado". Y la nota queda registrada con timestamp. Y si está aprobado, el estudiante pasa al estado "Diploma pendiente". |
| DTS-403 | **Ver historial de exámenes por estudiante** — Como estudiante, quiero ver el historial de mis exámenes integradores (fechas, notas, resultados), así tengo un registro oficial accesible. | **Should Have** | Dado un estudiante con exámenes rendidos, Cuando consulta "Mis exámenes", Entonces ve una tabla con fecha, nota, resultado, y estado del diploma (si aplica). |

---

## Epic 5: Integración Moodle (Must Have)

La integración con Moodle es el conducto principal de certificaciones. Sin ella, el sistema no tiene datos para operar.

| ID | Historia | Prioridad | Criterios de Aceptación |
|---|---|---|---|
| DTS-501 | **Conectar DTS con Moodle vía API** — Como administrador, quiero configurar la conexión con Moodle desde DTS (URL + token), así el sistema puede sincronizar certificados. | **Must Have** | Dado un administrador con credenciales de administrador Moodle, Cuando configura la conexión en DTS (URL del sitio Moodle + token de servicio web), Entonces DTS prueba la conexión y muestra "Conexión exitosa" o el error correspondiente. Y la configuración se persiste cifrada. |
| DTS-502 | **Sincronización batch de certificados** — Como administrador, quiero disparar una sincronización masiva de certificados para todos los estudiantes activos, así actualizo el estado general. | **Must Have** | Dado el sistema conectado a Moodle, Cuando el administrador inicia una sincronización batch, Entonces DTS consulta a Moodle por cada estudiante activo, importa/actualiza certificados, y muestra al final: total procesados, nuevos, actualizados, errores. |
| DTS-503 | **Monitorear estado de integración Moodle** — Como administrador, quiero ver si la integración con Moodle está activa y cuándo fue la última sincronización, así puedo detectar problemas proactivamente. | **Must Have** | Dado el panel de administración, Cuando el administrador consulta "Integraciones", Entonces ve Moodle con indicador verde/rojo, última sincronización exitosa, y cantidad de certificados sincronizados. |

---

## Epic 6: Panel de Administración (Must Have)

El panel de administración es la herramienta del administrador del sistema para operar DTS.

| ID | Historia | Prioridad | Criterios de Aceptación |
|---|---|---|---|
| DTS-601 | **Gestionar estudiantes en el sistema** — Como administrador, quiero listar, buscar y ver el detalle de cualquier estudiante, así puedo asistir a coordinadores con incidencias. | **Must Have** | Dado el panel de administración, Cuando selecciono "Estudiantes", Entonces veo un listado paginado con búsqueda por nombre/apellido/email. Y al seleccionar uno, veo su perfil completo: datos personales, diplomaturas, certificados, exámenes. |
| DTS-602 | **Dashboard con estadísticas básicas** — Como administrador, quiero ver métricas agregadas del sistema (total de estudiantes, diplomaturas activas, certificados sincronizados), así puedo reportar a Secretaría Académica. | **Must Have** | Dado el panel de administración, Cuando accedo al dashboard, Entonces veo: total de estudiantes en el sistema, diplomaturas activas, certificados sincronizados (hoy / total históricos), estudiantes habilitados vs. no habilitados. |
| DTS-603 | **Configurar nueva diplomatura** — Como administrador, quiero crear una nueva diplomatura en el sistema con sus módulos y reglas, así las facultades pueden empezar a usarla sin intervención de desarrollo. | **Should Have** | Dado el panel de administración, Cuando creo una nueva diplomatura, Entonces puedo definir: nombre, descripción, lista de módulos (cursos) que la componen, y reglas de prerrequisitos. Y la diplomatura queda disponible para que se inscriban estudiantes. |

---

## Epic 7: Gestión de Inscripciones / Enrollment (Must Have)

Para que el motor de reglas funcione, DTS debe saber qué estudiantes pertenecen a qué diplomatura.

| ID | Historia | Prioridad | Criterios de Aceptación |
|---|---|---|---|
| DTS-701 | **Inscribir estudiante a una diplomatura** — Como coordinador, quiero inscribir manualmente a un estudiante en una diplomatura, así el sistema sabe a quién evaluar. | **Must Have** | Dado un estudiante existente en el sistema, Cuando el coordinador lo inscribe en una diplomatura, Entonces se crea un registro de enrollment con fecha de inscripción. Y el estudiante aparece en el dashboard del coordinador para esa diplomatura. Y el dashboard del estudiante muestra la nueva diplomatura. |
| DTS-702 | **Inscripción masiva desde archivo** — Como coordinador, quiero inscribir múltiples estudiantes desde un archivo CSV, así no tengo que cargarlos uno por uno. | **Should Have** | Dado un archivo CSV con emails de estudiantes, Cuando el coordinador lo sube y selecciona la diplomatura destino, Entonces el sistema procesa cada fila: los existentes se inscriben, los nuevos se crean con datos básicos y se inscriben. Y se muestra un resumen: creados, inscriptos, errores. |

---

## Epic 8: Integración Guaraní (Should Have)

Guaraní (SIU) es el sistema académico de la UNC. Sincronizar padrones permite automatizar la creación de cuentas de estudiante y mantener los datos actualizados.

| ID | Historia | Prioridad | Criterios de Aceptación |
|---|---|---|---|
| DTS-801 | **Sincronizar padrón de estudiantes desde Guaraní** — Como administrador, quiero importar el padrón de estudiantes desde Guaraní, así no tengo que cargar manualmente los datos de cada estudiante. | **Should Have** | Dado el sistema conectado a Guaraní, Cuando el administrador inicia una sincronización de padrón, Entonces DTS importa/actualiza: nombre, apellido, email, documento, legajo. Y los estudiantes nuevos se crean automáticamente en DTS. |
| DTS-802 | **Adapter resiliente para Guaraní** — Como desarrollador, quiero que el adapter de Guaraní maneje timeouts, reintentos y fallas con gracia, así la experiencia de usuario no depende del uptime de Guaraní. | **Should Have** | Dado que Guaraní no responde, Cuando DTS intenta sincronizar, Entonces reintenta hasta 3 veces con backoff exponencial. Y si todas las intentonas fallan, registra el error y notifica al administrador. Y el sistema sigue funcionando con los datos que tiene en caché. |

---

## Epic 9: Notificaciones (Should Have)

Las notificaciones mantienen informados a estudiantes y coordinadores sin que tengan que consultar el sistema activamente.

| ID | Historia | Prioridad | Criterios de Aceptación |
|---|---|---|---|
| DTS-901 | **Notificación al habilitarse para examen** — Como estudiante, quiero recibir una notificación cuando quede habilitado para rendir el examen integrador, así no tengo que consultar manualmente. | **Should Have** | Dado un estudiante que acaba de cumplir todos los prerrequisitos (por nueva certificación sincronizada), Cuando el motor de reglas lo evalúa como "habilitado", Entonces el sistema genera una notificación (in-app) y opcionalmente envía un email. Y la notificación persiste hasta que el estudiante la lea. |
| DTS-902 | **Notificación de certificación nueva** — Como estudiante, quiero recibir una notificación cuando un nuevo certificado se sincroniza a mi perfil, así sé que el sistema está actualizado. | **Could Have** | Dado que una sincronización importa un nuevo certificado para un estudiante, Cuando se completa la importación, Entonces el estudiante recibe una notificación con el nombre del curso y la fecha. |

---

## Epic 10: Funcionalidades Avanzadas (Could Have)

| ID | Historia | Prioridad | Criterios de Aceptación |
|---|---|---|---|
| DTS-1001 | **Reportes y analytics avanzados** — Como secretaria académica, quiero generar reportes personalizados (tasas de completitud, tiempo promedio por diplomatura, deserción por módulo), así puedo analizar la efectividad de los programas. | **Could Have** | Dado el módulo de reportes, Cuando selecciono filtros (diplomatura, cohorte, período), Entonces el sistema genera un reporte con gráficos y tabla exportable a PDF/CSV. |
| DTS-1002 | **Emisión automatizada de diplomas** — Como administrador, quiero que DTS genere un diploma digital (PDF) automáticamente cuando un estudiante aprueba el examen integrador, así elimino el paso manual de confección. | **Could Have** | Dado un estudiante con examen aprobado, Cuando el sistema detecta la nota, Entonces genera un PDF de diploma con datos del estudiante, diplomatura, fecha y código de verificación. |

---

## Won't Have (MVP)

| Funcionalidad | Motivo |
|---|---|
| **Firma digital/electrónica de diplomas** | Depende de normativa UNC e infraestructura de firma remota. Se aborda post-MVP. |
| **Portal público de verificación de diplomas** | Requiere coordinación con Secretaría Académica y resolución rectoral. Post-MVP. |
| **Integración con otros LMS (Canvas, Edmodo)** | Se implementará la abstracción de proveedores desde el MVP, pero la conexión real con otros LMS será post-MVP. |
| **Autoservicio de inscripción (student self-enrollment)** | En el MVP las inscripciones las gestiona el coordinador o admin. |

---

## Mapa de Dependencias entre Épicas

```
Epic 5 (Moodle Integration) ──┐
                              ├── Epic 1 (Certificates) ──┐
                              │                           ├── Epic 3 (Rule Engine) ──┐
Epic 7 (Enrollment) ──────────┘                           │                          │
                                                          │                          ├── Epic 4 (Exam)
                                                          │                          │
                                                          └── Epic 2 (Dashboard) ───┘
                                                                    │
                                                                    └── Epic 6 (Admin Panel)

Epic 8 (Guaraní) ── Should Have, soporta a Epic 7 y Epic 1
Epic 9 (Notifications) ── Should Have, depende de Epic 3 (habilitación) y Epic 1 (certificados)
```

---

> *Documento generado como parte del PRD del proyecto DTS. Próxima revisión: al completar la planificación del primer sprint y validar el alcance con stakeholders de UNC.*
