# EPIC: Notificaciones

**Jira Key:** [DTS-9](https://diplo-track-sys.atlassian.net/browse/DTS-9)
**Priority:** Medium
**Status:** Done
**Total Story Points:** 0

---

## Description

## Epic: Sistema de Notificaciones

Infraestructura completa de notificaciones in-app para el Diploma Tracking System. Los estudiantes reciben alertas cuando obtienen nuevos certificados o cambia su estado de elegibilidad.

### Historias implementadas

***DTS-NOTIF-1*** — Notificación por cambio de elegibilidad: detecta al final de cada sync de Moodle si la elegibilidad del estudiante cambió (not-eligible → eligible). Crea notificación con upsert (si ya existe una sin leer, actualiza timestamp en vez de duplicar).

***DTS-NOTIF-2*** — Notificación por nuevo certificado: después de cada sync, si un estudiante recibe N certificados nuevos, crea 1 notificación consolidada (evita spam). Incluye nombres de cursos.

***DTS-NOTIF-3*** — Tabla y API de notificaciones: migration 007 crea tabla notifications con 6 tipos (eligibility*change, new*certificate, override*applied, override*expired, diploma*issued, exam*graded). Endpoints: GET /notifications (paginado, unread-first), PUT /:id/read, GET /unread-count.

### Infraestructura adicional

- notification.service.ts — servicio con dedup, batch insert, consolidate
- override-scheduler.ts — escanea overrides expirados y re-evalúa elegibilidad
- GitHub Actions cron: override expiry diario a las 3AM UTC
- Coordinator dashboard con filtro de elegibilidad y bulk grade

### Endpoints en producción

- GET /api/v1/notifications — listado paginado con filtro por tipo
- GET /api/v1/notifications/unread-count — badge count
- PUT /api/v1/notifications/:id/read — marcar leída
- POST /api/v1/integrations/sync/moodle — sync con notificaciones integradas

### Verificación

- TypeScript 0 errores
- ESLint 0 warnings
- Playwright E2E prod smoke: 7/7 passed
- 81 unit tests + 42 integration tests pass
- Migración 007 aplicada en Supabase (notifications + institutions)

---

## Planning

- [Feature Implementation Plan (Dev)](./feature-implementation-plan.md)
- [Feature Test Plan (QA)](./feature-test-plan.md)

---

## Metadata

- **Created:** 20/5/2026
- **Updated:** 4/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_
