# DTS-AUTH-4 — Compliance Matrix

| AC Scenario (Gherkin) | Covered By | Evidence | Status |
|-----------------------|------------|----------|--------|
| POST /admin/users creates user in Supabase Auth | manual | `admin.ts:32-38` | PASS |
| POST /admin/users creates student record in DB | manual | `admin.ts:44-55` | PASS |
| POST /admin/users rejects duplicate email (409) | manual | `admin.ts:23-29` | PASS |
| POST /admin/users rejects invalid email format | manual | Zod `z.string().email()` | PASS |
| POST /admin/users rejects short password (<6) | manual | Zod `z.string().min(6)` | PASS |
| POST /admin/users supports role assignment | manual | Zod `z.enum(['estudiante','coordinador','admin','sysadmin'])` | PASS |
| POST /admin/users supports optional DNI | manual | Zod `z.string().optional()` | PASS |
| POST /admin/users rolls back on DB failure | manual | `admin.ts:57-59` | PASS |
| POST /admin/users requires admin/sysadmin role | manual | `requireRole('admin', 'sysadmin')` | PASS |
