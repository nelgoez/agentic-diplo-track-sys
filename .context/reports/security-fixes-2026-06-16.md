# Security Fixes — 2026-06-16

> Triggered by Supabase security advisory (12 Jun 2026). 3 issues fixed, 1 requires Dashboard toggle.

---

## Issue 1 (Critical) — RLS disabled on `public.diploma_files`

**Finding**: Table `diploma_files` (migration `008_diploma_files`) created without `ENABLE ROW LEVEL SECURITY`. Anyone with Supabase anon key could read/write all diploma file metadata.

**Fix**: Migration `009_enable_rls_diploma_files`

- `ALTER TABLE public.diploma_files ENABLE ROW LEVEL SECURITY`
- 5 RLS policies:
  | Policy | Command | Scope |
  |--------|---------|-------|
  | Students can view own diploma files | SELECT | enrollment → student_id = auth.uid() |
  | Staff can view all diploma files | SELECT | coordinador/admin/sysadmin |
  | Staff can insert diploma files | INSERT | coordinador/admin/sysadmin |
  | Staff can update diploma files | UPDATE | coordinador/admin/sysadmin |
  | Admins can delete diploma files | DELETE | admin/sysadmin |

**Impact**: 0 rows existed — no data leaked.

---

## Issue 2 (Warning) — `update_updated_at` function search_path

**Finding**: Trigger function `public.update_updated_at()` lacked explicit `SET search_path`, making it vulnerable to search_path injection attacks.

**Fix**: Migration `010_fix_security_warnings`

- Recreated function with `SET search_path TO ''`

---

## Issue 3 (Warning) — Permissive RLS policy on `track_coordinators`

**Finding**: Policy `"Service role bypass"` allowed ALL operations with `USING (true)` / `WITH CHECK (true)` for `public` role, bypassing RLS entirely.

**Fix**: Migration `010_fix_security_warnings`

- `DROP POLICY "Service role bypass" ON public.track_coordinators`
- Two existing policies (`Admins can manage`, `Coordinators can view own assignments`) already cover required access.

---

## Issue 4 (Warning) — Leaked password protection disabled

**Finding**: Supabase Auth leaked password protection (HaveIBeenPwned check) is disabled.

**Fix**: Dashboard toggle required (not SQL-configurable).
- URL: `https://supabase.com/dashboard/project/vbjhxlezqhkmhpuypkvf/auth/providers?provider=Email`
- Requires **Pro Plan** or above.

---

## Migration Summary

| Migration | Applied At | Changes |
|-----------|-----------|---------|
| `009_enable_rls_diploma_files` | 2026-06-16 | RLS enabled on diploma_files + 5 policies |
| `010_fix_security_warnings` | 2026-06-16 | Secured update_updated_at function + dropped permissive track_coordinators policy |
