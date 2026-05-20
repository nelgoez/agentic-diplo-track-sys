# Executive Summary — Diploma Tracking System (DTS)

> **Documento**: PRD · Resumen Ejecutivo
> **Proyecto**: Sistema de Tracking de Diplomaturas — Universidad Nacional de Córdoba
> **Versión**: 1.0 · **Estado**: Borrador inicial
> **Idioma**: Español

---

## 1. Problem Statement

La Universidad Nacional de Córdoba ofrece programas de diplomatura con estructura modular: los estudiantes deben completar cursos específicos, obtener certificados y cumplir reglas de prerrequisitos antes de acceder al examen integrador final. Este ciclo — inscripción, cursado, certificación, habilitación, examen, diploma — se gestiona hoy de forma mayormente manual.

Tres problemas concretos:

1. **Verificación artesanal de prerrequisitos**: Los coordinadores cruzan certificados de Moodle contra planillas sin automatización. Esto produce errores de admisión (estudiantes mal habilitados o rechazados incorrectamente) y consume horas administrativas que deberían dedicarse a tareas pedagógicas.
2. **Cero visibilidad para el estudiante**: Un estudiante no sabe en tiempo real qué le falta para rendir el examen final. Debe consultar por email o presencialmente. Esto genera frustración y una carga operativa evitable sobre los coordinadores.
3. **Sin trazabilidad institucional**: No existe un registro centralizado del estado real de cada estudiante dentro del programa. La UNC no puede producir reportes confiables sobre avance, deserción, o tiempos de completitud sin recurrir a relevamientos manuales.

---

## 2. Solution Overview

**DTS** es un sistema web que automatiza el tracking de progreso en diplomaturas modulares, desde la inscripción hasta la emisión del diploma. Su núcleo son cuatro capacidades:

| Capacidad | Descripción |
|---|---|
| **Motor de reglas** | Evalúa prerrequisitos (ALL/ANY/compuestos) contra los certificados del estudiante para determinar habilitación al examen integrador. Configurable por programa. |
| **Sincronización de certificados** | Conectores con Moodle (y futuros LMS) que importan automáticamente las certificaciones de cursos completados. |
| **Dashboard de progreso** | Vista en tiempo real para el estudiante (progreso individual) y para el coordinador (estado de todos los estudiantes del programa). |
| **Gestión del ciclo completo** | Inscripción → cursado → certificación → habilitación → examen integrador → nota → diploma. Trazabilidad completa. |

### Provider Abstraction — Diferenciador Arquitectónico

A diferencia de sistemas que se acoplan directamente a Moodle o Guaraní, DTS implementa una **capa de abstracción de proveedores** (patrón Strategy/Adapter) desde el MVP. Esto significa:

- Las interfaces de certificación (LMS) y de padrones (sistema académico) están definidas como contratos abstractos.
- Moodle y Guaraní son implementaciones concretas de esos contratos.
- Agregar un nuevo LMS (Canvas, Edmodo, LMS propio) o un nuevo sistema académico requiere solo escribir un nuevo adapter, sin tocar la lógica de negocio.
- La UNC no queda lock-in con Moodle. Si en el futuro migra su LMS, DTS se adapta cambiando un conector, no reescribiendo el sistema.

Este enfoque está validado por la hipótesis de negocio: el sobrecosto inicial de la abstracción es ≤20%, pero reduce el costo de agregar un nuevo proveedor en ≥60%.

---

## 3. MVP Scope (High-Level)

El MVP cubre el ciclo completo de una diplomatura para un estudiante, integrado con Moodle como LMS y con gestión manual de padrones como paso inicial (Guaraní en fase Should Have).

| Área | MVP | Post-MVP |
|---|---|---|
| Certificaciones | Sincronización desde Moodle | Sincronización desde cualquier LMS vía adapter |
| Dashboard estudiante | Progreso, eligibility, próximos pasos | Historial completo, proyecciones |
| Motor de reglas | Prerrequisitos ALL/ANY por programa | Reglas condicionales, ventanas temporales |
| Examen integrador | Inscripción, admisión, registro de nota | Actas digitales, firma electrónica |
| Coordinador | Tablero de estudiantes, progreso, override manual | Bulk operations, exportación avanzada |
| Admin | Estadísticas básicas, gestión de estudiantes, trigger de sync | Roles granulares, logs de auditoría |
| Notificaciones | In-app (básicas) | Email, webhook |
| Integración Guaraní | — | Sincronización de padrones |

---

## 4. Success KPIs

### 4.1 KPIs de Negocio

| KPI | Target | Medición |
|---|---|---|
| Tasa de error en admisión a examen | 0% en el primer trimestre post-lanzamiento | Comparación contra reclamos del período manual |
| Reducción de consultas de estado | ≥60% en 3 meses | Volumen de consultas "¿me falta algo?" antes/después |
| Tiempo de habilitación de examen | ≤5 segundos (vs. horas/días manual) | Tiempo entre solicitud del coordinador y resultado |
| Adopción de coordinadores | ≥80% de coordinadores activos usa DTS como herramienta primaria a los 2 meses | Encuesta + logs de acceso |

### 4.2 KPIs Técnicos

| KPI | Target |
|---|---|
| Tiempo de sincronización Moodle | < 2 minutos para 500 estudiantes |
| Disponibilidad del sistema | ≥99.5% en horario académico |
| Tiempo de evaluación de reglas | < 500ms por estudiante |
| Cobertura de tests del motor de reglas | ≥95% branch coverage |

---

## 5. MVP Success Metrics (Validación de Hipótesis)

Las siguientes métricas determinan si el MVP valida o invalida las hipótesis del modelo de negocio:

| Hipótesis | Métrica de validación | Criterio de éxito |
|---|---|---|
| H1: Automatización reduce errores | Reclamos de admisión incorrecta en período manual vs. DTS | 0 errores en el primer corte trimestral |
| H2: Dashboard reduce consultas | Volumen de consultas entrantes categorizadas como "estado/progreso" | Reducción ≥60% en 3 meses |
| H3: Abstracción no encarece el MVP | Días-hombre de integración inicial (con abstraction layer) vs. estimación acoplada | Sobrecosto ≤20% |

---

> *Documento generado como parte del PRD del proyecto DTS. Próxima revisión: al completar el primer sprint del MVP o al identificar un cambio significativo en el mercado.*
