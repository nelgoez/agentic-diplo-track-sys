# Code Standards

> **Para**: Fases 6-7 (Implementation + Code Review)
> **Propósito**: Estándares de código para mantener calidad y consistencia

---

## 🎯 Principios Fundamentales

### 1. **DRY** (Don't Repeat Yourself)

```typescript
// ❌ MAL - Repetición
function getUserEmail(userId: string) {
  const response = await fetch(`/api/users/${userId}`);
  const user = await response.json();
  return user.email;
}

function getUserName(userId: string) {
  const response = await fetch(`/api/users/${userId}`);
  const user = await response.json();
  return user.name;
}

// ✅ BIEN - Reutilizable
async function getUser(userId: string) {
  const response = await fetch(`/api/users/${userId}`);
  return await response.json();
}

function getUserEmail(userId: string) {
  const user = await getUser(userId);
  return user.email;
}
```

### 2. **KISS** (Keep It Simple, Stupid)

```typescript
// ❌ MAL - Over-engineering
const getUserStatus = (user: User): UserStatus => {
  return user.isActive
    ? user.isPremium
      ? user.trialEnded
        ? UserStatus.PREMIUM_ACTIVE
        : UserStatus.TRIAL_ACTIVE
      : UserStatus.FREE_ACTIVE
    : UserStatus.INACTIVE;
};

// ✅ BIEN - Simple y legible
const getUserStatus = (user: User): UserStatus => {
  if (!user.isActive) return UserStatus.INACTIVE;
  if (!user.isPremium) return UserStatus.FREE_ACTIVE;
  if (user.trialEnded) return UserStatus.PREMIUM_ACTIVE;
  return UserStatus.TRIAL_ACTIVE;
};
```

### 3. **YAGNI** (You Aren't Gonna Need It)

```typescript
// ❌ MAL - Funcionalidad que nadie pidió
interface User {
  id: string;
  name: string;
  email: string;
  socialSecurity?: string; // ¿Para qué?
  bloodType?: string; // ¿Para qué?
  favoriteColor?: string; // ¿Para qué?
}

// ✅ BIEN - Solo lo necesario
interface User {
  id: string;
  name: string;
  email: string;
}
```

---

## 📝 Naming Conventions

### Variables y Funciones

```typescript
// ✅ camelCase para variables y funciones
const userName = 'John';
const isActive = true;
const totalCount = 42;

function getUserById(id: string) {}
function calculateTotal(items: Item[]) {}
```

### Componentes React

```typescript
// ✅ PascalCase para componentes
function LoginForm() {}
function UserProfile() {}
const NavBar = () => {};
```

### Constantes

```typescript
// ✅ UPPER_SNAKE_CASE para constantes
const MAX_RETRIES = 3;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_TIMEOUT = 5000;
```

### Tipos e Interfaces

```typescript
// ✅ PascalCase con 'I' o 'T' prefix (opcional)
interface User {}
interface UserResponse {}
type UserId = string;
type UserRole = 'admin' | 'user' | 'guest';
```

### Archivos

```
✅ kebab-case para archivos:
- user-profile.tsx
- api-client.ts
- error-handler.ts

✅ PascalCase para componentes:
- LoginForm.tsx
- UserCard.tsx
- NavBar.tsx
```

---

## 🔧 Function Parameters

### Max 2 Positional Parameters Rule

When a function has 3+ parameters, use an object:

```typescript
// ❌ BAD - Hard to read, easy to confuse order
createUser('John', 'john@test.com', 'password', true, 30);

// What is `true`? What is `30`? Nobody knows without checking the signature.

// ✅ GOOD - Self-documenting
createUser({
  name: 'John',
  email: 'john@test.com',
  password: 'password',
  isActive: true,
  age: 30,
});
```

### Interface Definition

```typescript
// Define the interface for the object parameter
interface CreateUserArgs {
  name: string;
  email: string;
  password: string;
  isActive?: boolean; // Optional with ?
  age?: number;
}

// Function signature is clean
function createUser(args: CreateUserArgs): User {
  const { name, email, password, isActive = true, age } = args;
  // ...
}
```

### Benefits

| Benefit                  | Explanation                                  |
| ------------------------ | -------------------------------------------- |
| **Self-documenting**     | Parameter names visible at call site         |
| **Order doesn't matter** | `{ age: 30, name: 'John' }` works fine       |
| **Easy to extend**       | Add optional params without breaking changes |
| **IDE support**          | Autocomplete shows all available options     |

### When 2 Positional is OK

```typescript
// ✅ OK - 2 params are manageable
function getUser(id: string, includeDeleted: boolean) { ... }

// ✅ OK - 1 param is obvious
function deleteUser(id: string) { ... }

// ❌ NOT OK - 3+ params, use object
function getUser(id: string, includeDeleted: boolean, expand: string) { ... }
```

---

## 🏗️ TypeScript Strict Mode

**SIEMPRE usar TypeScript en modo strict**:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Evitar `any`

```typescript
// ❌ MAL
function processData(data: any) {
  return data.value;
}

// ✅ BIEN
interface DataPayload {
  value: string;
}

function processData(data: DataPayload) {
  return data.value;
}
```

### Usar tipos explícitos

```typescript
// ❌ MAL - Tipo inferido puede cambiar
const users = [];

// ✅ BIEN - Tipo explícito
const users: User[] = [];
```

---

## 🎨 Component Structure (React)

### Orden de elementos

```typescript
// ✅ Orden estándar
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getUserById } from '@/lib/api'
import type { User } from '@/types'

interface UserProfileProps {
  userId: string
}

export function UserProfile({ userId }: UserProfileProps) {
  // 1. Hooks
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 2. Effects
  useEffect(() => {
    loadUser()
  }, [userId])

  // 3. Handlers
  const loadUser = async () => {
    const data = await getUserById(userId)
    setUser(data)
    setLoading(false)
  }

  // 4. Early returns
  if (loading) return <div>Loading...</div>
  if (!user) return <div>User not found</div>

  // 5. Render
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### Props destructuring

```typescript
// ✅ Destructure props en signature
function UserCard({ name, email, avatar }: UserCardProps) {
  return <div>{name}</div>
}

// ❌ No usar props object
function UserCard(props: UserCardProps) {
  return <div>{props.name}</div>
}
```

---

## ⚡ Performance Best Practices

### 1. Memoization

```typescript
import { useMemo, useCallback } from 'react'

function ExpensiveComponent({ items }: Props) {
  // ✅ Memoize cálculos costosos
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0)
  }, [items])

  // ✅ Memoize callbacks
  const handleClick = useCallback(() => {
    console.log('Clicked')
  }, [])

  return <div>Total: {total}</div>
}
```

### 2. Lazy loading

```typescript
import { lazy, Suspense } from 'react'

// ✅ Lazy load componentes pesados
const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <HeavyChart />
    </Suspense>
  )
}
```

### 3. Evitar re-renders innecesarios

```typescript
import { memo } from 'react'

// ✅ Memoize componentes puros
export const UserCard = memo(function UserCard({ user }: Props) {
  return <div>{user.name}</div>
})
```

---

## ♿ Accessibility (a11y)

### Semantic HTML

```tsx
// ❌ MAL
<div onClick={handleClick}>Click me</div>

// ✅ BIEN
<button onClick={handleClick}>Click me</button>
```

### ARIA labels

```tsx
// ✅ Labels descriptivos
<button aria-label="Close dialog">
  <XIcon />
</button>

<input
  type="text"
  aria-label="Search users"
  placeholder="Search..."
/>
```

### Keyboard navigation

```tsx
// ✅ Soporte de teclado
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={e => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Custom button
</div>
```

---

## 📦 Code Organization

### Estructura de carpetas

```
src/
├── components/
│   ├── ui/              # Componentes reutilizables
│   └── features/        # Componentes específicos
├── lib/
│   ├── api/             # API clients
│   ├── utils/           # Utilities
│   └── hooks/           # Custom hooks
├── types/               # TypeScript types
└── app/                 # Pages (Next.js App Router)
```

### Barrel exports

```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';

// Uso
import { Button, Input, Card } from '@/components/ui';
```

---

## 🗄️ Supabase Client Rules

This project uses **two** Supabase clients. Picking the wrong one silently bypasses or over-enforces RLS. The rule is mechanical — no judgment calls needed.

### `supabase` — regular (RLS-respecting) client

Use when **the authenticated user owns or is directly acting on their own data**, and RLS policies are sufficient:

- Own profile reads/writes
- Operations where the user's JWT role matches the RLS policy's `auth.role()` check
- Student listing their own certificates, enrollments, progress

```typescript
// ✅ OWN data — RLS handles it
const { data } = await supabase
  .from('certificates')
  .select('*')
  .eq('student_id', auth.userId)
```

### `supabaseAdmin` — bypass-RLS client

Use when **the operation crosses user boundaries** or RLS would reject a legitimate operation:

| When | Why |
|------|-----|
| Reading another user's data (e.g., coordinator checking a student's certificates) | RLS would block cross-user reads |
| Admin operations on entities not owned by caller | `auth.role()` in RLS may not cover all admin paths |
| Eligibility evaluation, rule engine, sync operations | Reads across students, courses, rules — multi-entity |
| Mutating tables where RLS policies don't cover the field (e.g., new columns) | "Might not be covered" → use `supabaseAdmin` |
| Batch operations, CSV import, background jobs | No single user context |

```typescript
// ✅ CROSS-USER read — needs admin client
const { data } = await supabaseAdmin
  .from('certificates')
  .select('course_id')
  .eq('student_id', someStudentId)
  .eq('status', 'approved')
```

### Decision Tree (apply top-to-bottom)

```
1. Operation reads/writes data the caller OWNS?
   YES → supabase
   NO  → go to 2

2. Operation crosses user boundaries (reads other users, aggregates, admin dash)?
   YES → supabaseAdmin

3. Unsure?
   → supabaseAdmin (safe default; RLS over-enforcement is silent, RLS bypass is auditable)
```

### Anti-patterns

```typescript
// ❌ BAD — using supabaseAdmin when RLS would suffice
const { data } = await supabaseAdmin
  .from('students')
  .select('*')
  .eq('id', auth.userId) // same user → supabase is fine

// ❌ BAD — using supabase when cross-user read is needed
const { data } = await supabase
  .from('certificates')
  .select('*')
  .eq('student_id', targetStudentId) // RLS may silently return [] for other users
```

---

## 👥 Role Delegation

Agents may create ad-hoc roles for workload distribution and responsibility hierarchy. This is a project rule — not a suggestion.

### Rules

| Rule | Detail |
|------|--------|
| **Role declaration** | Role scope must be declared before dispatch: authority domain, deliverables, escalation path |
| **Accountability** | Roles can delegate to subagents but remain accountable for their domain |
| **Conflict escalation** | Cross-role conflicts escalate to CEO/VP Owner (Nahuel) or QA Manager (Nahuel) |
| **Subagents optional** | Use subagents only when parallel execution is more efficient; single-thread synonymous work |
| **Role lifetime** | Ad-hoc roles exist for duration of task/sprint unless explicitly extended |

### Predefined Roles

| Role | Held By | Domain |
|------|---------|--------|
| CEO / VP Owner | Nahuel | Strategic decisions, go/no-go gates, architecture approval |
| QA Manager | Nahuel | Quality bar, release readiness, test strategy |
| Product Owner (PO) | Agent (ad-hoc) | Backlog health, MVP alignment, feature prioritization |
| Engineering Manager (EM) | Agent (ad-hoc) | Architecture, tech debt, delivery pipeline, code quality |
| QA Lead | Agent (ad-hoc) | Endpoint coverage, bug assessment, security review, data integrity |

### Ad-hoc Roles (created on demand)

| Role | When to create |
|------|---------------|
| Tech Lead | Multi-file refactors, architecture decisions crossing domains |
| Integration Lead | External provider work (Moodle, Guaraní), sync pipelines |
| DB Architect | Schema changes, migration planning, RLS policy design |
| Security Reviewer | Auth audit, RLS review, credential handling |
| Performance Lead | Bottleneck investigation, query optimization |
| Test Lead | Test suite design, coverage strategy, CI integration |

### Dispatch Example

```
Role: Tech Lead — enrollments module
Domain: Routes + services for enrollments, grading, exam lifecycle
Deliverables: DTS-EXAM-4 fix, DTS-EXAM-5 fix, refactor duplicate eligibility query setup
Escalates to: CEO/VP Owner (Nahuel)
```

---

## 🚫 Que NO Hacer

### 1. NO hardcodear valores

```typescript
// ❌ MAL
const apiUrl = 'https://api.example.com';

// ✅ BIEN
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### 2. NO dejar console.log()

```typescript
// ❌ MAL
console.log('User data:', user);

// ✅ BIEN (si necesitas logging)
import { logger } from '@/lib/logger';
logger.info('User data loaded', { userId: user.id });
```

### 3. NO usar var

```typescript
// ❌ MAL
var count = 0;

// ✅ BIEN
const count = 0;
let counter = 0;
```

### 4. NO mutar state directamente

```typescript
// ❌ MAL
const [users, setUsers] = useState<User[]>([]);
users.push(newUser); // ❌ Mutation!

// ✅ BIEN
setUsers([...users, newUser]);
```

### 5. NO ignorar errores

```typescript
// ❌ MAL
try {
  await fetchData();
} catch (error) {
  // Silenciosamente ignorado
}

// ✅ BIEN
try {
  await fetchData();
} catch (error) {
  logger.error('Failed to fetch data', error);
  throw new AppError('FETCH_FAILED', 'Unable to load data');
}
```

---

## ✅ Checklist de Code Quality

Antes de commit:

- [ ] Supabase client choice correct (supabase vs supabaseAdmin per decision tree)
- [ ] Código sigue DRY, KISS, YAGNI
- [ ] Naming conventions seguidas
- [ ] TypeScript strict (sin `any`)
- [ ] No hay valores hardcodeados
- [ ] No hay console.log() olvidados
- [ ] Accessibility considerada
- [ ] Performance optimizada
- [ ] Componentes memoizados (si necesario)
- [ ] Error handling implementado
- [ ] Tests escritos

---

**Última actualización**: 2025-10-29
**Fase**: Implementation (Fase 6)
