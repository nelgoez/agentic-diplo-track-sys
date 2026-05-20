# User Personas — Diploma Tracking System (DTS)

> **Documento**: PRD · Personas de Usuario
> **Proyecto**: Sistema de Tracking de Diplomaturas — Universidad Nacional de Córdoba
> **Versión**: 1.0 · **Estado**: Borrador inicial
> **Idioma**: Español

---

## Persona 1: Estudiante

| Campo | Detalle |
|---|---|
| **Nombre** | Lucía Méndez |
| **Edad** | 28 años |
| **Rol** | Estudiante de la Diplomatura en Ciencia de Datos — Facultad de Matemática, Astronomía, Física y Computación (FAMAF) |
| **Ocupación** | Analista de datos en una empresa de software (part-time) |
| **Tech proficiency** | Alta — usa herramientas digitales a diario, apps mobile, plataformas e-learning |
| **Dispositivo principal** | Smartphone + laptop |

### Goals (Jobs to be done)

1. Saber exactamente qué cursos le faltan para completar la diplomatura y poder rendir el examen integrador.
2. Verificar que sus certificados de cursado estén correctamente registrados sin tener que revisar manualmente cada Moodle.
3. Conocer las fechas de inscripción al examen integrador y si cumple con los requisitos para rendirlo.

### Pain Points

- **Incertidumbre constante**: No sabe si los certificados que ve en Moodle están siendo considerados por el coordinador para su habilitación. Ha tenido experiencias donde "se perdió" un certificado y se enteró demasiado tarde.
- **Ansiedad pre-examen**: En semanas previas al examen, tiene que escribir emails al coordinador preguntando si está habilitada. A veces tarda días en recibir respuesta.
- **Falta de visibilidad a futuro**: No puede planificar su cursado porque no ve una "ruta" clara de qué viene después de cada módulo.
- **Procesos opacos**: Cuando se inscribió, no sabía que necesitaba cursar Módulo A antes que Módulo B. Se enteró después de cursar en orden inverso.

### User Story

> *"Como estudiante de la diplomatura, quiero ver en mi dashboard mi progreso actualizado en tiempo real, los certificados que ya tengo registrados, y saber si estoy habilitada para rendir el examen integrador, así puedo planificar mi cursado sin tener que consultar constantemente al coordinador."*

---

## Persona 2: Coordinador

| Campo | Detalle |
|---|---|
| **Nombre** | Pablo Roldán |
| **Edad** | 42 años |
| **Rol** | Coordinador académico de la Diplomatura en Gestión de Políticas Públicas — Facultad de Ciencias Sociales |
| **Ocupación** | Docente-investigador, dedicación semi-exclusiva a la coordinación |
| **Tech proficiency** | Media — usa Moodle como docente, Google Drive, SIU Guaraní para carga de notas. No es desarrollador ni power user. |
| **Dispositivo principal** | Laptop (Windows) |

### Goals (Jobs to be done)

1. Centralizar el seguimiento de todos los estudiantes de la diplomatura en una sola herramienta, sin depender de planillas Excel descentralizadas.
2. Verificar rápidamente si un estudiante cumple los prerrequisitos para rendir el examen integrador.
3. Gestionar excepciones (estudiantes que vienen de otra facultad, certificaciones externas, equivalentcias) sin romper el flujo automatizado.
4. Producir listados de estudiantes habilitados para el examen integrador en formatos compatibles con SIU Guaraní y actas digitales.

### Pain Points

- **Carga operativa insostenible**: Con ~200 estudiantes activos y 8 módulos por diplomatura, verificar manualmente quién cumple prerrequisitos le lleva entre 4 y 6 horas antes de cada período de examen.
- **Datos fragmentados**: Los certificados están en Moodle, el padrón de estudiantes en Guaraní, las notas de exámenes en planillas. No hay una vista unificada.
- **Errores que generan conflictos**: Ha tenido casos de estudiantes que reclaman estar habilitados cuando él los había dado de baja por error. No hay trazabilidad de quién habilitó a quién y por qué.
- **Resistencia al override manual**: Cuando necesita exceptuar a un estudiante (ej. certificación de un curso externo equivalente), no tiene manera limpia de hacerlo sin "ensuciar" sus registros.
- **Procesos burocráticos**: Cada período de examen implica generar actas, reportes y listados en formatos específicos que cambian por resolución rectoral.

### User Story

> *"Como coordinador de la diplomatura, quiero un tablero donde pueda ver el progreso de todos mis estudiantes de un vistazo, evaluar automáticamente quién cumple requisitos, y gestionar excepciones sin salirme del sistema, así reduzco el tiempo administrativo y elimino errores de verificación manual."*

---

## Persona 3: Administrador / SysAdmin

| Campo | Detalle |
|---|---|
| **Nombre** | Carolina Ferreyra |
| **Edad** | 35 años |
| **Rol** | Administradora del sistema DTS + referente técnica del Área de Sistemas — UNC |
| **Ocupación** | Analista de sistemas en la Dirección de Tecnología Educativa |
| **Tech proficiency** | Muy alta — Linux, PostgreSQL, APIs REST, contenedores, scripting |
| **Dispositivo principal** | Laptop (Linux) + terminal |

### Goals (Jobs to be done)

1. Monitorear la salud de las integraciones (Moodle, Guaraní) y detectar fallas de sincronización antes de que afecten a usuarios.
2. Gestionar usuarios, roles y permisos del sistema (altas, bajas, cambios de rol).
3. Disparar sincronizaciones on-demand y re-procesar certificaciones fallidas.
4. Obtener métricas de uso del sistema para reportar a la Secretaría Académica (cantidad de estudiantes activos, diplomaturas, sincronizaciones).
5. Configurar nuevas diplomaturas, módulos y reglas de prerrequisitos sin necesidad de desarrollo.

### Pain Points

- **Caja negra de integraciones**: Cuando la sincronización con Moodle falla, no tiene visibilidad de qué estudiantes se vieron afectados ni logs claros para diagnosticar.
- **Gestión de usuarios dispersa**: Hoy los accesos a Moodle, Guaraní y otros sistemas se manejan por separado. Quiere que DTS sea el punto único de gestión de usuarios del ecosistema de diplomaturas.
- **Falta de métricas**: La Secretaría Académica le pide reportes ("cuántos estudiantes activos", "cuántas diplomaturas", "cuántas habilitaciones") y hoy no tiene forma de producirlos sin scripting ad-hoc.
- **Onboarding de nuevas diplomaturas**: Cada vez que una facultad quiere sumar una diplomatura al sistema, tiene que coordinar con desarrollo para configurar las reglas. Quiere poder hacerlo desde una interfaz de administración.
- **Sin alertas proactivas**: No hay notificaciones cuando una integración lleva mucho tiempo sin sincronizar o cuando hay certificaciones con errores.

### User Story

> *"Como administradora del sistema, quiero un panel de administración con monitoreo de integraciones, gestión de usuarios y configuración de diplomaturas, así puedo operar el sistema de forma autónoma sin depender del equipo de desarrollo para tareas administrativas cotidianas."*

---

## Persona Adicional (Secundaria): Secretaria Académica

| Campo | Detalle |
|---|---|
| **Nombre** | Patricia Villalba |
| **Edad** | 50 años |
| **Rol** | Secretaria Académica de la Facultad — no técnica, necesita reportes institucionales |
| **Tech proficiency** | Baja — usa sistemas administrativos web, pero no es su foco |
| **User story** | *"Como secretaria académica, quiero poder consultar reportes predefinidos sobre el estado de las diplomaturas (estudiantes por cohorte, % de completitud, tasas de habilitación) sin tener que pedirle a sistemas que me extraiga datos, así puedo tomar decisiones informadas sobre oferta académica."* |

---

> *Documento generado como parte del PRD del proyecto DTS. Próxima revisión: al validar las personas con usuarios reales de UNC durante las primeras entrevistas.*
