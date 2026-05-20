# User Journeys — Diploma Tracking System (DTS)

> **Documento**: PRD · Recorridos de Usuario
> **Proyecto**: Sistema de Tracking de Diplomaturas — Universidad Nacional de Córdoba
> **Versión**: 1.0 · **Estado**: Borrador inicial
> **Idioma**: Español

---

## Journey 1: Estudiante — Consultar progreso y verificar elegibilidad

**Persona**: Lucía Méndez, estudiante de la Diplomatura en Ciencia de Datos
**Escenario**: Lucía terminó de cursar el último módulo de su diplomatura y quiere saber si ya puede rendir el examen integrador.
**Precondiciones**: Lucía tiene cuenta en DTS, está inscripta en la diplomatura, ya cursó todos los módulos. El coordinador aún no inició una sincronización manual.

---

### Happy Path

| Paso | Acción del Usuario | Respuesta del Sistema | Estado / Pantalla |
|---|---|---|---|
| 1 | Abre DTS desde el navegador (URL institucional) | Muestra página de login con SSO UNC (o email+contraseña) | Pantalla de login |
| 2 | Ingresa credenciales UNC (email institucional + contraseña) | Valida credenciales, redirige al dashboard principal | Dashboard del estudiante |
| 3 | En el dashboard, ve el resumen de su diplomatura | Muestra tarjeta "Diplomatura en Ciencia de Datos" con barra de progreso: 7/8 módulos completados. El módulo 8 aparece como "Pendiente de sincronización". | Dashboard principal |
| 4 | Hace clic en "Ver detalle" de la diplomatura | Muestra la vista de detalle: lista de módulos con su estado, y la sección "Elegibilidad para examen integrador" | Detalle de diplomatura |
| 5 | Consulta la sección de elegibilidad | El motor de reglas evalúa: el módulo 8 está "Pendiente de sincronización" → resultado: "❌ No habilitado — te falta certificar: Módulo 8: Visualización de Datos" | Módulo de elegibilidad |
| 6 | Reconoce que el certificado del módulo 8 no se sincronizó. Se contacta con el coordinador. (Ver flujo alternativo 1) | — | — |
| 7 | (Más tarde) Vuelve al dashboard tras la sincronización | La barra ahora muestra 8/8 módulos. La elegibilidad cambió a "✅ ¡Habilitado! Ya podés inscribirte al examen integrador." | Dashboard actualizado |
| 8 | Hace clic en "Inscribirme al examen" | Si el coordinador habilitó la inscripción abierta: muestra fechas disponibles y permite auto-inscripción. Sino: muestra mensaje "Comunicate con tu coordinador para inscribirte." | Confirmación o instrucciones |

### Flujo Alternativo 1: Coordinador fuerza sincronización

> En lugar del paso 6, Lucía espera. El coordinador inicia una sincronización batch desde su panel. El sistema detecta el nuevo certificado y actualiza el dashboard de Lucía automáticamente. Lucía recibe una notificación in-app (y email si está configurado): "🎉 ¡Estás habilitada! Ya podés rendir el examen integrador."

### Flujo Alternativo 2: Certificado con error de importación

| Paso | Acción | Sistema |
|---|---|---|
| 6b | Lucía ve el módulo 8 con estado "Error de sincronización" y un ícono de advertencia | El sistema muestra tooltip: "El certificado no pudo importarse desde Moodle. Contactá a tu coordinador." |
| 7b | Lucía envía un mensaje al coordinador desde el botón "Reportar problema" | El sistema crea una incidencia en el panel del coordinador con los datos del certificado fallido |
| 8b | El coordinador re-sincroniza manualmente el certificado de Lucía desde su panel | El certificado se importa correctamente, el dashboard de Lucía se actualiza |

### Flujo Alternativo 3: Estudiante no habilitado (le faltan módulos)

| Paso | Acción | Sistema |
|---|---|---|
| 5c | Lucía consulta elegibilidad pero solo tiene 4/8 módulos | Muestra "❌ No habilitado — te faltan 4 módulos. Próximos pasos sugeridos:" con lista de módulos disponibles (cuyos prerrequisitos ya cumplió) |

### Edge Cases

| Caso | Comportamiento Esperado |
|---|---|
| El estudiante no tiene certificados sincronizados | Dashboard muestra "Aún no hay certificados. Consultá con tu coordinador si los cursos están cargados en Moodle." |
| El estudiante no está inscripto en ninguna diplomatura | Mensaje: "No estás inscripto en ninguna diplomatura actualmente." |
| Moodle está caído durante la sincronización | La sincronización falla con mensaje claro. Los datos previos siguen visibles. Se reintenta automáticamente. |
| El estudiante tiene múltiples diplomaturas | El dashboard muestra una tarjeta por diplomatura, cada una con su propia barra de progreso y estado de elegibilidad. |

---

## Journey 2: Coordinador — Revisar progreso, aplicar override y gestionar examen

**Persona**: Pablo Roldán, coordinador de la Diplomatura en Gestión de Políticas Públicas
**Escenario**: Pablo necesita preparar el listado de estudiantes habilitados para el próximo período de exámenes. Una estudiante (María) tiene una certificación externa que debe considerar como equivalente.
**Precondiciones**: Pablo tiene cuenta de coordinador en DTS. La diplomatura tiene módulos y reglas configuradas. Hay 3 estudiantes inscriptos.

---

### Happy Path

| Paso | Acción del Usuario | Respuesta del Sistema | Estado / Pantalla |
|---|---|---|---|
| 1 | Pablo ingresa a DTS con su cuenta de coordinador | Login + redirección al dashboard del coordinador | Dashboard de coordinador |
| 2 | En el dashboard principal, ve el resumen de su(s) diplomatura(s) | Muestra tarjeta "Diplomatura en Gestión de Políticas Públicas" con: total de estudiantes (47), habilitados (31), no habilitados (16), último sync: hoy 10:30 | Dashboard de coordinador |
| 3 | Hace clic en la tarjeta de la diplomatura | Muestra la lista de estudiantes con columnas: nombre, email, % de progreso, estado (habilitado/no habilitado), última actualización | Lista de estudiantes |
| 4 | Filtra por "No habilitados" para ver quiénes están cerca de cumplir | El sistema muestra 16 estudiantes no habilitados, ordenados por % de progreso descendente | Lista filtrada |
| 5 | Identifica a María López con 90% de progreso. Hace clic en su nombre. | Muestra el perfil detallado de María: certificados (lista), reglas evaluadas (desglose), historial de exámenes | Perfil de estudiante |
| 6 | Ve que a María le falta el módulo "Políticas Públicas Comparadas" pero ella tiene un certificado de un curso equivalente de otra universidad | En el desglose de reglas, la regla "ALL: Módulos 1-8" muestra Módulo 7 como "No cumplido" | Desglose de reglas |
| 7 | Pablo hace clic en "Agregar override" junto a la regla no cumplida | Muestra formulario de override | Formulario de override |
| 8 | Completa: regla a exceptuar = "Módulo 7: Políticas Públicas Comparadas", motivo = "Certificado de curso equivalente — Universidad Nacional de La Plata 2025", vencimiento = (vacío, permanente) y confirma | El sistema registra el override, re-evalúa la elegibilidad. María pasa a "Habilitada". Se genera notificación para María. | Perfil de María — ahora "✅ Habilitada" |
| 9 | Pablo vuelve al listado general y hace clic en "Generar listado de habilitados" | El sistema genera un listado PDF con todos los estudiantes habilitados, fecha, y sello de generación automática | Vista previa del PDF |
| 10 | Descarga el PDF y lo envía a Secretaría Académica para la confección del acta | — | — |

### Flujo Alternativo 1: Inscripción manual a examen

> Pablo quiere inscribir a María al examen del 15/06. En el perfil de María, hace clic en "Inscribir a examen", selecciona la fecha del 15/06 del selector, y confirma. El sistema verifica que María sigue habilitada (re-evalúa), crea la inscripción y muestra confirmación.

### Flujo Alternativo 2: Registro de nota post-examen

> Luego del examen, Pablo vuelve al perfil de María, hace clic en "Cargar nota", ingresa 7 (aprobado), y confirma. El sistema registra la nota, cambia el estado del examen a "Aprobado", y María pasa a "Diploma pendiente". Pablo puede cargar notas en batch desde la lista de estudiantes inscriptos a una fecha.

### Flujo Alternativo 3: Override vencido — estudiante pierde habilitación

> Pablo configura un override temporal (vence el 30/06). Al llegar la fecha, el sistema desactiva el override automáticamente, re-evalúa la elegibilidad de María, y cambia su estado a "No habilitada". Pablo recibe una notificación: "⚠️ El override de María López ha vencido. La estudiante ya no cumple los prerrequisitos."

### Edge Cases

| Caso | Comportamiento Esperado |
|---|---|
| El coordinador intenta inscribir a un estudiante que ya no está habilitado (cambió desde la última consulta) | El sistema rechaza la inscripción, muestra: "El estudiante ya no cumple los requisitos. Revisá sus reglas antes de inscribir." |
| El coordinador aplica override a una regla que ya fue overrideada | El sistema advierte: "Ya existe un override activo para esta regla. ¿Deseas reemplazarlo?" |
| Se intenta cargar una nota fuera del rango 1-10 | El sistema valida: "La nota debe estar entre 1 y 10." |
| El coordinador carga una nota a un estudiante no inscripto en esa fecha | El sistema bloquea: "Este estudiante no está inscripto en la fecha de examen seleccionada." |

---

## Journey 3: Administrador — Monitorear sistema, sincronizar y diagnosticar integraciones

**Persona**: Carolina Ferreyra, administradora del sistema DTS — Área de Sistemas UNC
**Escenario**: Carolina recibe un reporte de que algunos estudiantes no ven sus certificados actualizados. Debe diagnosticar la integración con Moodle, forzar una sincronización, y verificar el estado general del sistema.
**Precondiciones**: Carolina tiene cuenta de administrador. Moodle está configurado como proveedor de certificaciones. Hay al menos 3 diplomaturas activas.

---

### Happy Path

| Paso | Acción del Usuario | Respuesta del Sistema | Estado / Pantalla |
|---|---|---|---|
| 1 | Carolina ingresa a DTS con su cuenta de admin | Login + redirección al dashboard de administración | Dashboard de admin |
| 2 | En el dashboard, ve los indicadores generales: 3 diplomaturas, 247 estudiantes, 1,893 certificados sincronizados, 2 errores en la última sincronización | Tarjetas con métricas clave, gráfico de sincronizaciones por día, y tabla de últimas incidencias | Dashboard de admin |
| 3 | Carolina ve los "2 errores" y hace clic en el indicador | Muestra el detalle: "2 errores de sincronización — Módulo 7, estudiantes: juan.perez@unc.edu.ar, maria.garcia@unc.edu.ar — Error: Certificado no encontrado en Moodle" | Panel de errores |
| 4 | Hace clic en "Ir a Integraciones" en el menú lateral | Muestra la página de integraciones: tarjeta de Moodle con estado "Conectado", última sincronización: hoy 08:30, duración: 45s, certificados procesados: 78, errores: 2 | Página de integraciones |
| 5 | Para investigar, hace clic en "Ver logs" de Moodle | Muestra logs de las últimas sincronizaciones con timestamp, acción, resultado, y errores detallados | Logs de integración |
| 6 | Identifica que los 2 errores corresponden a estudiantes que fueron dados de baja en Moodle pero siguen activos en DTS | — | — |
| 7 | Vuelve a la página de integraciones y hace clic en "Sincronizar ahora" (sync manual) | El sistema inicia una sincronización batch, muestra progreso en tiempo real: "Procesando estudiante 12/247..." | Barra de progreso con indicador |
| 8 | La sincronización termina: 245 procesados, 0 nuevos, 3 actualizados, 2 errores (los mismos) | Muestra resumen de sincronización. Carolina confirma que los 2 errores son esperados (alumnos dados de baja). | Resumen de sync |
| 9 | Para cerrar, Carolina hace clic en "Estudiantes" en el menú, busca a "juan.perez" y ve su perfil | Muestra perfil de Juan con sus certificados, incluyendo el que falló marcado como "Error de sincronización — Alumno no encontrado en Moodle" con tooltip de diagnóstico | Perfil de estudiante |
| 10 | Carolina decide dar de baja a Juan de la diplomatura desde el panel. Confirma la acción. | El sistema desactiva el enrollment de Juan, archiva sus certificados, y quita la diplomatura de su dashboard. Juan ya no cuenta en las estadísticas. | — |

### Flujo Alternativo 1: Test de conexión Moodle

> Carolina quiere verificar que la conexión a Moodle sigue activa. Desde Integraciones → Moodle, hace clic en "Probar conexión". El sistema ejecuta un health check: consulta un endpoint de Moodle, mide latencia, y muestra "✅ Conexión exitosa — Latencia: 230ms" o "❌ Error de conexión — Timeout después de 10s".

### Flujo Alternativo 2: Configurar nueva diplomatura

> Un coordinador de la Facultad de Derecho solicita agregar una nueva diplomatura. Carolina va a "Diplomaturas" → "Nueva diplomatura", completa: nombre "Diplomatura en Derecho Digital", descripción, agrega 5 módulos con nombres, y configura la regla "ALL: Módulos 1-5". Guarda. La diplomatura ya está disponible para que el coordinador inscriba estudiantes.

### Flujo Alternativo 3: Gestión de usuarios — alta de coordinador

> Llega un nuevo coordinador. Carolina va a "Usuarios" → "Crear usuario", completa email, nombre, selecciona rol "Coordinador" y la diplomatura asignada. El sistema envía un email de bienvenida con instrucciones de acceso. El nuevo coordinador ya puede loguearse.

### Edge Cases

| Caso | Comportamiento Esperado |
|---|---|
| Moodle cambia su token/credenciales | La integración muestra estado "Error de autenticación". Carolina recibe notificación. Debe re-configurar el token desde Integraciones. |
| Se intenta crear un estudiante con un email ya existente | El sistema muestra: "Ya existe un usuario con ese email. ¿Deseas asociarlo a la diplomatura en lugar de crearlo de nuevo?" |
| La sincronización batch se ejecuta mientras otra ya está en curso | El sistema rechaza la nueva solicitud: "Ya hay una sincronización en curso. Intentá de nuevo cuando termine." |
| Un administrador sin permisos intenta acceder a configuración sensible | El sistema bloquea: "No tenés permisos para realizar esta acción." |
| Se elimina una diplomatura con estudiantes activos | El sistema advierte: "Hay 47 estudiantes activos en esta diplomatura. ¿Estás segura? Los enrollments se archivarán, no se eliminarán." |

---

## Mapa de Transiciones entre Journeys

Las acciones de un actor afectan el estado del sistema para otro:

```
JOURNEY 2 (Coordinador)
  ├── Sincroniza certificados → JOURNEY 1 (Estudiante ve progreso actualizado)
  ├── Aplica override → JOURNEY 1 (Estudiante ve cambio de elegibilidad)
  └── Inscribe a examen → JOURNEY 1 (Estudiante ve confirmación de inscripción)

JOURNEY 3 (Admin)
  ├── Sincroniza batch → JOURNEY 1 + JOURNEY 2 (Certificados actualizados)
  ├── Crea diplomatura → JOURNEY 2 (Coordinador puede gestionarla)
  └── Da de baja estudiante → JOURNEY 1 (Estudiante pierde acceso a diplomatura)
```

---

> *Documento generado como parte del PRD del proyecto DTS. Próxima revisión: al validar los recorridos con usuarios reales durante las sesiones de diseño colaborativo.*
