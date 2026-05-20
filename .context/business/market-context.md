# Market Context — Diploma Tracking System (DTS)

> **Contexto**: Sistema de Tracking de Diplomaturas para UNC, Argentina
> **Versión**: 1.0 · **Estado**: Constitución inicial

---

## 1. Competitive Landscape

### 1.1 Competidores Directos

| Competidor | Tipo | Descripción | Diferenciador DTS |
|---|---|---|---|
| **SIU Guaraní (módulo de tracking)** | Indirecto-directo | Guaraní tiene un módulo de "seguimiento de cursado" pero no está diseñado para diplomaturas modulares con prerrequisitos flexibles. Es rígido, orientado a carreras de grado lineales. | DTS está diseñado explícitamente para diplomaturas modulares con reglas ALL/ANY. Arquitectura desacoplada del proveedor académico. |
| **Moodle Core (competencias / learning plans)** | Indirecto | Moodle tiene "Learning Plans" y "Competency Frameworks" que permiten cierto tracking, pero la configuración es compleja, la UI está orientada al docente no al coordinador, y no maneja el flujo de examen integrador + diploma. | DTS abstrae el LMS — no depende de Moodle. Tiene UI específica para coordinadores de diplomatura, no para docentes de aula. |
| **Tableros Excel/Google Sheets artesanales** | Sustituto | Cada facultad arma su propio seguimiento en planillas. Cero inversión en software, 100% manual, propenso a errores. | Automatización completa + trazabilidad + cero errores de cómputo. El "competidor" más frecuente y el que más valor destruye. |

### 1.2 Competidores Indirectos / Alternativas

| Alternativa | Descripción | Riesgo |
|---|---|---|
| **Desarrollo in-house por área de sistemas UNC** | Que el cliente decida construir su propia solución genérica | Bajo — las áreas de sistemas suelen estar sobrecargadas y las diplomaturas no son su prioridad. |
| **Plataformas EdTech generalistas (Canvas, Edmodo)** | Tienen módulos de certificación, pero no específicos para el flujo UNC (examen integrador, resolución rectoral) | Medio — si una plataforma grande agrega el feature específico para LATAM. DTS compite por velocidad y especificidad. |

---

## 2. Market Opportunity

### 2.1 TAM — Total Addressable Market

**Universidades públicas y privadas de LATAM que ofrecen programas de diplomatura / certificación modular.**

- ~200 universidades en Argentina (públicas + privadas)
- ~2,000 universidades en LATAM
- Estimación conservadora: 40% ofrece o planea ofrecer programas de diplomatura modular
- **TAM**: ~800–1,000 instituciones

### 2.2 SAM — Serviceable Addressable Market

**Universidades que usan Moodle como LMS + Guaraní (SIU) como sistema académico.** Este es el segmento inmediato porque la integración ya está construida.

- ~50 universidades en Argentina usan el ecosistema Moodle + SIU Guaraní (datos de mercado SIU)
- ~100 en LATAM (principalmente Argentina, Uruguay, algunas en Chile y Brasil)
- **SAM**: ~100–150 instituciones — nicho definido y accesible con integración zero-touch.

### 2.3 SOM — Serviceable Obtainable Market

**Universidades que (a) pertenecen al SAM, (b) tienen ≥3 diplomaturas activas, (c) están en proceso de digitalización o con dolor explícito en tracking manual.**

- Penetración Year 1–2: 5–10 instituciones piloto (early adopters)
- **SOM Year 1**: 5 instituciones
- **SOM Year 3**: 20–30 instituciones

| Métrica | Valor |
|---|---|
| Precio estimado anual por institución | $5,000–$15,000 USD (licencia + soporte) |
| Potencial Year 1 (5 inst. × $8K avg) | $40,000 USD |
| Potencial Year 3 (25 inst. × $10K avg) | $250,000 USD |

> Nota: Los montos son orientativos para la versión enterprise. UNC como institución pública puede tener un modelo de costo + soporte sin margen comercial en la etapa inicial.

---

## 3. Trends & Insights

### 3.1 Macro Tendencias

| Tendencia | Impacto en DTS |
|---|---|
| **Digitalización universitaria forzada por post-pandemia** | Las universidades LATAM ya no cuestionan _si_ digitalizar, sino _cómo_. Las diplomaturas online o híbridas crecieron 3× desde 2020. |
| **Microcredenciales y educación modular** | El mercado laboral demanda certificaciones específicas, no solo títulos de grado. Las diplomaturas son el vehículo natural. DTS es la infraestructura para escalarlas. |
| **Estandarización de SIU Guaraní en Argentina** | Ley de Educación Superior + políticas de digitalización están empujando a todas las universidades nacionales a usar SIU. DTS se monta sobre esa base. |
| **Open Source en educación pública** | Las universidades públicas prefieren software que puedan auditar y modificar. DTS como core open source + features enterprise es el modelo correcto. |

### 3.2 Insights Estratégicos

- **El dolor no es el tracking — es la confianza**: Los coordinadores no tienen un problema de "falta de datos", tienen un problema de "no confío en que mis datos estén correctos". DTS debe construir confianza mediante transparencia (cada regla evaluada es visible, cada certificación tiene su origen).
- **Moodle es el estándar pero no es eterno**: Varias universidades LATAM están evaluando migrar a Canvas o desarrollar LMS propio. La abstracción de proveedores no es un lujo técnico — es una decisión de negocio que evita lock-in.
- **Guaraní es lento para cambiar**: Las integraciones con SIU Guaraní son notoriamente lentas y burocráticas. DTS debe absorber esa lentitud con un adapter resilient (caché, reintentos, cola) para que la experiencia de usuario no dependa del uptime de Guaraní.
- **El entry point no es el software — es la integración**: Las facultades no compran "un sistema de tracking", compran "algo que hable con Moodle y Guaraní". La integración existente es el feature principal del MVP.

### 3.3 Riesgos de Mercado

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Una universidad grande desarrolla su propio sistema y lo comparte como open source | Media | DTS compite en experiencia de usuario y velocidad de integración. Ser multi-institucional desde el diseño es ventaja sobre soluciones hechas para una sola facultad. |
| Moodle incorpora tracking de diplomaturas en su core | Baja | Moodle mueve lento en features administrativos. Aun si lo hace, la abstracción de proveedores permite que DTS funcione igual sobre Moodle o cualquier otro LMS. |
| Falta de presupuesto en universidades públicas | Alta | Modelo freemium / open source core para features básicos. Solo features enterprise (reportes avanzados, multi-LMS, auditoría) requieren licencia. |

---

> *Documento generado como parte de la Constitución del proyecto DTS. Próxima revisión: al identificar un nuevo competidor relevante o cambio significativo en el mercado de educación digital LATAM.*
