# DTS-AUTH-4: User CRUD + role management

> Phase: 1 (Foundation) · Effort: 5 SP · Status: Completed

## Acceptance Criteria (Gherkin)

### Scenario: Admin creates a new user with role assignment
- **Given** an authenticated admin user
- **When** the admin sends `POST /admin/users` with email, password, first_name, last_name, and role (estudiante/coordinador/admin/sysadmin)
- **Then** a user is created in both Supabase Auth and the `users` table
- **And** the response returns HTTP 201 with the created user's details (excluding password)
- **And** the user's role is correctly persisted

### Scenario: Duplicate email is rejected with appropriate error
- **Given** an existing user with email `test@example.com`
- **When** an admin attempts to create another user with the same email
- **Then** the response returns HTTP 409 Conflict with an error message indicating email uniqueness violation
- **And** no duplicate record is created in Supabase Auth or the `users` table

### Scenario: Admin lists all users with role filtering
- **Given** multiple users with different roles exist
- **When** an admin sends `GET /admin/users`
- **Then** the response returns a paginated list of all users
- **And** each user includes id, email, first_name, last_name, role, and is_active fields

### Scenario: Admin deactivates a user (soft delete)
- **Given** an active user in the system
- **When** an admin sends `PUT /admin/users/:id` with `is_active: false`
- **Then** the user is marked as inactive in the database
- **And** the deactivated user can no longer authenticate

## Open Questions
- None

## Notes
- Implementation commit: See impl-plan.md
- Users are soft-deleted via `is_active`, never hard-deleted
