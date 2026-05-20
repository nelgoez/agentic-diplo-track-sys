# Business Model — Diploma Tracking System (DTS)

> **Proyecto**: Sistema de Tracking de Diplomaturas — Universidad Nacional de Córdoba
> **Versión**: 1.0 · **Estado**: Constitución inicial

---

## 1. Problem Statement

La Universidad Nacional de Córdoba ofrece programas de diplomatura modulares donde los estudiantes deben completar cursos específicos, acumular créditos y obtener certificados para acceder a un examen integrador final. Actualmente, el seguimiento de este proceso es mayormente manual: los coordinadores verifican cursado por cursado, los estudiantes no tienen visibilidad en tiempo real de su progreso, y las certificaciones de Moodle se cruzan con planillas离线 sin automatización.

Este enfoque artesanal genera tres problemas medulares: (a) errores humanos en la verificación de requisitos previos y correlatividades, (b) demoras operativas cuando un estudiante quiere saber si está habilitado para rendir el examen final, y (c) falta de trazabilidad institucional sobre el estado real de cada estudiante dentro del programa. En una universidad con miles de estudiantes activos en diplomaturas, la escala vuelve insostenible el método manual.

DTS resuelve esto automatizando el tracking de progreso, la validación de reglas de prerrequisitos (condiciones ALL/ANY), la sincronización de certificados desde el LMS, y la gestión del ciclo completo: inscripción → cursado → certificación → habilitación → examen integrador → diploma.

---

## 2. Business Model Canvas

### 2.1 Customer Segments

| Segmento | Descripción | Perfil |
|---|---|---|
| **Coordinadores de diplomatura** | Personal académico-administrativo que gestiona programas, valida estudiantes y autoriza exámenes | Primary user. Necesitan eficiencia operativa y trazabilidad. |
| **Estudiantes** | Alumnos inscriptos en una o más diplomaturas | Necesitan visibilidad de progreso y saber cuándo están habilitados. |
| **Administradores UNC** | Dirección de sistemas / secretaría académica | Necesitan gobierno del sistema, reportes institucionales, gestión de usuarios. |
| **Sysadmins / TI** | Equipo técnico que opera y mantiene la plataforma | Necesitan monitoreo, logs, despliegue, seguridad. |

**Early adopter**: Facultades/departamentos de UNC que ya ofrecen diplomaturas con examen integrador y tienen coordinadores dispuestos a digitalizar el proceso.

### 2.2 Value Propositions

| Segmento | Propuesta de Valor |
|---|---|
| **Coordinadores** | Automatización de la verificación de prerrequisitos y elegibilidad. Tablero centralizado con el estado de cada estudiante. Reducción de errores manuales a ~0%. |
| **Estudiantes** | Visibilidad en tiempo real del progreso en la diplomatura. Certificaciones sincronizadas automáticamente. Notificaciones cuando se habilita el examen integrador. |
| **Administradores UNC** | Reportes institucionales sin planillas manuales. Trazabilidad completa del ciclo de vida del estudiante. |
| **Sysadmins** | Arquitectura desacoplada con abstracción de proveedores (Moodle → cualquier LMS). API pública para integraciones. |

**Diferenciador clave**: Abstraction layer sobre proveedores — mientras otros sistemas se acoplan a un LMS específico, DTS permite reemplazar Moodle por cualquier otro sistema de certificación sin cambiar lógica de negocio.

### 2.3 Channels

| Canal | Propósito | Estado |
|---|---|---|
| **Web App (Next.js)** | Interfaz principal para coordinadores, estudiantes y admins | MVP |
| **API REST** | Integración con Moodle, Guaraní y futuros proveedores | MVP |
| **Webhooks / SSO** | Sincronización en tiempo real con LMS y sistema académico | Post-MVP |
| **Email / Notificaciones in-app** | Alertas de habilitación, certificaciones, vencimientos | MVP |

### 2.4 Customer Relationships

| Relación | Estrategia |
|---|---|
| **Autoservicio** | Estudiantes consultan su progreso y estado sin intervención humana |
| **Asistida** | Coordinadores gestionan excepciones y validaciones manuales cuando las reglas automáticas no alcanzan |
| **Soporte técnico** | Canal para sysadmins y coordinadores (incidencias, configuraciones) |
| **Capacitación** | Guías y tutoriales para coordinadores sobre uso del tablero |

### 2.5 Revenue Streams

> Contexto: UNC es institución pública. El modelo de ingresos no es comercial directo.

| Fuente | Descripción | Horizonte |
|---|---|---|
| **Licenciamiento institucional** | Tasa anual por facultad/departamento que use la plataforma | Post-MVP |
| **Soporte y mantenimiento** | Contrato de soporte técnico + actualizaciones | Post-MVP |
| **Implementación** | Servicios de puesta en marcha, integración con LMS existente y migración de datos | Post-MVP |
| **Open Source Core + Enterprise** | Versión base open source; funcionalidades avanzadas (reportes, multi-LMS) bajo licencia enterprise | Futuro |

### 2.6 Key Resources

| Recurso | Tipo | Propósito |
|---|---|---|
| **Plataforma DTS** | Software | Core del sistema (tracking, reglas, certificaciones) |
| **Integración Moodle** | Conector | Sincronización de certificados de cursos |
| **Integración Guaraní** | Conector | Sincronización de padrones y estado académico |
| **Motor de reglas** | Algoritmo | Validación de prerrequisitos (ALL/ANY) y elegibilidad |
| **Equipo de desarrollo** | Humano | Mantenimiento y evolución del producto |
| **Documentación técnica** | Conocimiento | API docs, guías de integración, manuales de usuario |

### 2.7 Key Activities

| Actividad | Prioridad | Detalle |
|---|---|---|
| **Desarrollo del core de tracking** | MVP | Modelos de Track (diplomatura), Course, Certificate, Enrollment, RuleEngine |
| **Integración Moodle** | MVP | Web service Moodle para obtener certificados de finalización |
| **Integración Guaraní** | MVP | Sincronización de estudiantes y estado académico |
| **Motor de reglas** | MVP | Evaluación de prerrequisitos (ALL/ANY/compuestos) |
| **Tablero de coordinador** | MVP | Vista de estudiantes, progreso, habilitaciones |
| **Portal de estudiante** | MVP | Progreso personal, estado, certificaciones |
| **Flujo de examen integrador** | MVP | Inscripción, admisión, nota, diploma |
| **Provider abstraction** | MVP | Interfaces Strategy/Adapter para LMS y sistema académico |

### 2.8 Key Partners

| Partner | Rol | Dependencia |
|---|---|---|
| **UNC (facultades/departamentos)** | Cliente institucional, define reglas de negocio | Alta — sin ellos no hay dominio |
| **Moodle** | Proveedor de LMS (certificaciones) | Alta — integración core |
| **Guaraní (SIU)** | Proveedor de sistema académico (padrones) | Alta — integración core |
| **Área de Sistemas UNC** | Operación, hosting, soporte infraestructura | Media — pueden operar ellos o cloud |

### 2.9 Cost Structure

| Concepto | Tipo | MVP | Post-MVP |
|---|---|---|---|
| **Desarrollo de software** | Variable (equipo) | $$$ | $$ |
| **Infraestructura (hosting/cloud)** | Fijo | $ | $$ |
| **Integraciones (Moodle/Guaraní)** | Variable | $$ | $ |
| **Soporte y mantenimiento** | Variable | $ | $$ |
| **Capacitación y documentación** | Variable | $ | $ |
| **Gestión de cambio institucional** | Variable | $$ | $ |

---

## 3. MVP Hypothesis

### Hipótesis 1: La automatización de prerrequisitos reduce errores de admisión a examen

**Formulación**: Si los coordinadores usan el motor de reglas de DTS en lugar de verificación manual, la tasa de estudiantes mal habilitados (admitidos sin cumplir requisitos, o rechazados cumpliéndolos) se reduce a cero.

**Métrica**: Comparar reclamos y correcciones de admisión del período manual vs. primer cuatrimestre con DTS.

**Criterio de validación**: 0 errores detectados en el primer corte trimestral posterior al rollout.

### Hipótesis 2: La visibilidad de progreso reduce consultas administrativas

**Formulación**: Si los estudiantes tienen un dashboard de progreso en tiempo real, las consultas a coordinadores sobre "¿me falta algo para rendir?" disminuyen significativamente.

**Métrica**: Volumen de consultas entrantes (email/mesa de ayuda) categorizadas como "consulta de estado/progreso" antes y después del lanzamiento.

**Criterio de validación**: Reducción ≥60% en consultas de estado en los primeros 3 meses.

### Hipótesis 3: La abstracción de proveedores no incrementa significativamente el tiempo de desarrollo inicial

**Formulación**: Implementar una capa Strategy/Adapter para LMS y sistema académico desde el MVP agrega ≤20% de esfuerzo inicial versus acoplarse directamente a Moodle, y reduce el costo de agregar un nuevo proveedor en ≥60%.

**Métrica**: Días-hombre de la integración inicial (con abstraction) versus estimación de integración acoplada. Días-hombre de la segunda integración (nuevo LMS) versus lo que habría costado sin abstraction.

**Criterio de validación**: Sobrecosto inicial ≤20%. Costo de segunda integración ≤40% de la primera.

---

> *Documento generado como parte de la Constitución del proyecto DTS. Próxima revisión: al definir un nuevo MVP cut o pivot institucional.*
