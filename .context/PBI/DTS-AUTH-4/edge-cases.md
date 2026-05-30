# DTS-AUTH-4: Edge Cases

## Boundary Conditions
- Email with unicode/non-ASCII chars (IDN): normalized to ASCII punycode before Supabase call; stored as-is
- Role value outside enum (estudiante|coordinador|admin|sysadmin): rejected at validation; 400 with allowed values
- User creation with no role specified: defaults to `estudiante`; never `null` or empty
- First admin creation (bootstrap): must be done via Supabase dashboard or seed script; API route requires existing admin
- Soft-delete via `is_active=false`: user remains in DB; login rejected (active check in /auth/login); re-activation restores access

## Error Paths
- Duplicate email creation: 409 `email_already_exists`; Supabase Auth returns unique violation; caught by API
- Create user with role that doesn't exist in Supabase `raw_user_meta_data`: insertion succeeds; role stored in `users` table only
- Create user succeeds in Supabase Auth but fails in `users` table insert: transaction rollback needed; otherwise orphaned auth user
- Delete self (admin deleting own user): allowed; session invalidated on next token check; no self-lockout prevention (intentional)

## Concurrency
- Two admins create same email simultaneously: first wins (unique constraint); second gets 409; no phantom user
- User update + login concurrent: old data visible to in-flight session; new data picked up on token refresh
