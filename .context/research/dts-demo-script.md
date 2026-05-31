# DTS — Script de Presentación en Vivo

> **Audiencia**: UNC — Secretaría Académica, DTI, stakeholders
> **Duración**: ~15 minutos
> **Modo**: Mock Mode (auto-contenido, sin dependencias externas)
> **Requisito previo**: Frontend y server desplegados en Vercel

---

## 🛫 Pre-flight Checklist (5 min antes)

- [ ] Abrir `https://nelgoez-diploma-tracking-sys-git-main-nelgoezs-projects.vercel.app` en una pestaña
- [ ] Abrir `https://server-git-main-nelgoezs-projects.vercel.app/health` en otra pestaña — verificar `{"status":"ok"}`
- [ ] Abrir `https://server-git-main-nelgoezs-projects.vercel.app/api/v1/integrations/status` (necesita token) — verificar ambos providers `connected`
- [ ] Abrir otra pestaña con estas credenciales a mano:
  - Admin: `admin@dts.unc.edu.ar` / `Admin123456!`
  - Estudiante: `nahuelgomez.cti@gmail.com` / `Test123456!`
- [ ] Cerrar pestañas que no uses, solo dejar frontend + API health

---

## 🎬 Acto 1: Admin Login + Dashboard (2 min)

**"El sistema tiene 3 roles de acceso. Comenzamos como administrador."**

1. Frontend → ver pantalla de login en español
2. Ingresar `admin@dts.unc.edu.ar` / `Admin123456!`
3. Click "Entrar"
4. **Mostrar dashboard**:
   - "Bienvenido/a, Admin DTS" — encabezado
   - Panel lateral con navegación: Panel Principal, Certificados, Cursos, Integraciones, Administración
   - Switch de idioma ES/EN arriba a la derecha
5. Explicar: "Este es el panel del administrador. El estudiante ve su progreso personal."

---

## 🎬 Acto 2: Sincronización Moodle (2 min)

**"El sistema se conecta con el Campus Virtual UNC (Moodle) para importar certificados."**

1. Sidebar → "Integraciones"
2. Ver estado: Moodle `connected`, Guaraní `connected` (en modo mock)
3. Click "Sync Moodle" → ver respuesta: `Synced X certificates`
4. Explicar: "En producción, esto llama a la API REST de Moodle con el token del campus. Busca al estudiante por email, consulta sus cursos y verifica completitud. Los certificados se importan automáticamente."
5. Mostrar logs de integración (si hay entries previas)

---

## 🎬 Acto 3: Estudiante — Progreso y Elegibilidad (3 min)

**"Ahora vemos la experiencia del estudiante. Cerramos sesión y entramos como Nahuel Gómez."**

1. Logout (si hay botón) o abrir nueva pestaña incógnito
2. Login con `nahuelgomez.cti@gmail.com` / `Test123456!`
3. **Mostrar dashboard estudiante**:
   - Cursos completados: 3 de 5
   - Créditos acumulados: los que correspondan
   - Estado: **INHABILITADO** para el examen integrador
4. Explicar: "Nahuel aprobó 3 de los 5 cursos requeridos. El motor de reglas evaluó la diplomatura DIP-CD-2025 y determinó que no está habilitado para rendir el módulo integrador."
5. Mostrar cursos faltantes: "Faltan: Manipulación de Datos, Visualización"

---

## 🎬 Acto 4: Examen Integrador + Diploma Push (3 min)

**"Veamos qué pasa cuando un estudiante completa todos los cursos y rinde el examen."**

1. Volver como admin (logout + login admin)
2. Ir a la sección de estudiantes o enrollments
3. **Registrar nota del examen**:
   - Seleccionar Nahuel → Inscribir a examen → Registrar nota 8
4. **Mostrar transición automática**:
   - `exam_status: aprobado` → `diploma_pendiente`
   - "El sistema detectó nota ≥ 4, marcó como aprobado y disparó automáticamente el push de diploma a Guaraní."
5. Ir a "Integraciones" → ver log de `diploma_pushed` con referencia Guaraní
6. Explicar: "En producción, este push llama a la API REST de SIU Guaraní 3.x. El estudiante finaliza su trámite en Guaraní para obtener el diploma oficial."

---

## 🎬 Acto 5: Admin Finale + Overrides + Sistema (3 min)

**"Para cerrar, mostramos las capacidades administrativas avanzadas."**

1. **Dashboard admin**: mostrar métricas actualizadas
   - Total estudiantes, tracks activos, certificados, tasa de completitud
2. **Overrides**: "¿Qué pasa si un estudiante tiene una situación excepcional?"
   - Ir a sección de overrides
   - Mostrar que se puede crear una excepción manual con motivo y fecha de expiración
   - "El motor de reglas respeta el override y recalcula la elegibilidad inmediatamente."
3. **Audit Log** (sysadmin): "Toda operación queda registrada."
   - `GET /api/v1/system/audit-log` — mostrar trazabilidad de grade_recorded, override_created, rule_updated
4. **Landing page**: `https://server-git-main-nelgoezs-projects.vercel.app/` — página institucional del proyecto
5. **API Docs**: `/docs` — documentación interactiva Scalar UI con todos los endpoints

---

## 🛟 Fallback Plan

| Si falla... | Decir... | Hacer... |
|---|---|---|
| Login no funciona | "El token de demostración puede haber expirado — es un entorno de prueba." | Recargar página, intentar de nuevo. Si persiste, usar credenciales locales. |
| Sync no responde | "El modo mock es auto-contenido. Los datos de demostración ya están precargados." | Saltar acto 2, continuar con acto 3. |
| Dashboard en blanco | "El frontend es una SPA — a veces necesita recarga." | F5. Si persiste, mostrar API responses vía /health o /docs. |
| Vercel caído | "Tenemos una copia local del sistema." | `bun run dev` en server + client, mostrar en localhost. |

---

## 📋 Resumen para el presentador

```
Orden:           Admin → Sync → Estudiante → Examen → Admin Finale
Duración:        15 min
Credenciales:    admin@dts.unc.edu.ar / Admin123456!
URL frontend:    https://nelgoez-diploma-tracking-sys-git-main-nelgoezs-projects.vercel.app
URL API:         https://server-git-main-nelgoezs-projects.vercel.app
Modo:            Mock (auto-contenido, no depende de Moodle/Guaraní reales)
Backup:          Servidor local: bun run dev (server + client)
```
