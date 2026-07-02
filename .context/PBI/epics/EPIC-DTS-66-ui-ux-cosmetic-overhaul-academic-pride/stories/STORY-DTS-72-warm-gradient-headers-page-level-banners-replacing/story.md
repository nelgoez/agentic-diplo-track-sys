# Warm gradient headers — page-level banners replacing flat AppBar

**Jira Key:** [DTS-72](https://diplo-track-sys.atlassian.net/browse/DTS-72)
**Epic:** [DTS-66](https://diplo-track-sys.atlassian.net/browse/DTS-66) (UI/UX Cosmetic Overhaul — Academic Pride)
**Type:** Story
**Status:** To Do
**Priority:** Medium
**Story Points:** -

---

## Overview

# Warm gradient headers — page-level banners replacing flat AppBar

> [!TIP] ***Quick win.*** Pure CSS, no new deps, immediate visual impact.

## Objective

Give each page a distinct identity by adding gradient header banners below the AppBar — subtle Carolina blue → deep indigo gradients with page title, description, and optional action button.

## Gradient

```css
background: linear-gradient(135deg, #4B9CD3 0%, #2B6DAE 50%, #1B4F8A 100%);
```

## Pages

| Route | Title | Description | Action |
| --- | --- | --- | --- |
| /app/dashboard | Panel Principal | Resumen de tu progreso y actividades | — |
| /app/certificates | Mis Certificados | Certificaciones obtenidas en tus cursos | Exportar |
| /app/enrollments | Mis Inscripciones | Cursos y tracks a los que estás inscripto | Inscribirse |
| /app/admin | Administración | Gestioná estudiantes, cursos y tracks | — |
| /app/sysadmin | Sistema | Configuración avanzada del sistema | — |
| /app/integrations | Integraciones | Sincronización con Moodle y otros sistemas | Sincronizar ahora |

## PageHeader component

```tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <Box sx={{
      background: 'linear-gradient(135deg, #4B9CD3 0%, #2B6DAE 50%, #1B4F8A 100%)',
      borderRadius: { xs: 0, md: '0 0 16px 16px' },
      px: { xs: 2, md: 4 },
      py: { xs: 3, md: 4 },
      mb: 3,
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" color="white" fontWeight={700}>{title}</Typography>
          {description && (
            <Typography variant="body1" color="white" sx={{ opacity: 0.8 }}>
              {description}
            </Typography>
          )}
        </Box>
        {action && <Box ml={2}>{action}</Box>}
      </Box>
    </Box>
  );
}
```

Wave clip-path at bottom using `&::after` pseudo-element with border-radius trick.

## Reference links

| Concept | URL |
| --- | --- |
| CSS gradient generator | https://cssgradient.io |
| Clip-path wave generator | https://bennettfeely.com/clippy/ |

## Acceptance Criteria

- [ ] All 6 pages have gradient headers with title + description
- [ ] Header gradient matches DTS-67 palette exactly
- [ ] Responsive: ~120px desktop → ~80px mobile
- [ ] No layout shift on page navigation
- [ ] Single reusable PageHeader component, no duplicated code

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Out Of Scope](./out-of-scope.md)
- [Implementation Plan (Dev)](./implementation-plan.md)
- [Acceptance Test Plan (QA)](./acceptance-test-plan.md)
- [Acceptance Test Results (QA)](./acceptance-test-results.md)

---

## Metadata

- **Created:** 11/6/2026
- **Updated:** 12/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez
- **Labels:** cosmetics, headers, ui

---

_Synced from Jira by sync-jira-issues_
