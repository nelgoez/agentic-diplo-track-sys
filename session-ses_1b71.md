# Resume session and check missing branch changes

**Session ID:** ses_1b716850affeFW0jmQVLCzZ6WI
**Created:** 21/5/2026, 02:02:01
**Updated:** 27/5/2026, 14:35:00

---

## User

@.context\PBI\README.md please resume our last session, Check all branches as last time changes seems to be missing in local. Thanks

---

## Assistant

_Thinking:_

The user wants to resume their last session. Let me look at the context directory to find the session prompt and understand what they were working on. Let me also check git branches and recent activity.

**Tool: bash**

**Tool: bash**

**Tool: bash**

**Tool: glob**

**Tool: glob**

**Tool: glob**

---

## Assistant

_Thinking:_

Let me analyze the situation:

1. The user is on the `staging` branch
2. Only two branches exist: `main` and `staging` (both local and remote)
3. There are no PBI context docs (just the README.md)
4. Recent commits are mostly foundation/audit setup work
5. The reflog shows no missing branches - just movement between main and staging

The user mentioned "last time changes seems to be missing in local." Let me check if there are any remote branches they might be referring to, or if there's a feature branch that was lost. Looking at the reflog, I see no feature branches. Let me also check the Jira context to see if there were tickets being worked on.

Let me check if there's any work-in-progress files, untracked files, or stash.

**Tool: bash**

**Tool: bash**

**Tool: bash**

**Tool: glob**

---

## Assistant

_Thinking:_

Let me understand the situation:

1. No missing branches - only `main` and `staging` exist, both locally and remotely
2. No stash, clean working tree
3. No SESSION-PROMPT.md or PROGRESS.md files - this means no actual PBI/sprint work has started yet
4. No remote-only branches were fetched
5. The context files show foundation-phase documents (PRD, SRS, business maps) but no PBI-level ticket work

The repo is in the foundation/post-foundation phase. The project has been defined (PRD, SRS, business maps), but no sprint development has started yet. There are no feature branches - everything was done on `main` and `staging`.

The user thinks changes are "missing in local" but there's no evidence of lost branches or changes. Let me look at what the recent commits actually changed to give a clear picture, and check if maybe the user expects to see certain branches.

Also, there's no `SESSION-PROMPT.md` - the CLAUDE.md says sessions use engram + Jira as canonical sources, and `SESSION-PROMPT.md` should have been generated. Since there's no SESSION-PROMPT, I need to reconstruct the state from available artifacts.

Let me read the master-implementation-plan and the project.yaml to understand the current project state.

**Tool: read**

**Tool: read**

**Tool: read**

---

## Assistant

_Thinking:_

Now I have a clear picture. Let me summarize the state:

1. **Branches**: Only `main` and `staging` exist - both locally and remotely. No feature branches. The user is on `staging`.

2. **No missing changes**: The reflog shows all commits are accounted for. There are no orphaned branches or stashed changes.

3. **Project phase**: The project is in **post-foundation** stage. PRD, SRS, business maps, and master implementation plan are done. No sprint development has started - no PBI ticket folders exist.

4. **What's next**: According to the master implementation plan, the next step is **Phase 1: Foundation** — specifically Sprint 1 stories (DTS-AUTH-1 through DTS-AUTH-4, and DTS-INT-1 through DTS-INT-3).

There's no SESSION-PROMPT.md, which makes sense — no sprint work has started yet, so there was no per-story session to prompt from.

The user asked to "resume last session" and mentioned "changes seem to be missing in local." Let me be direct: there are no missing branches or changes. The repo is clean and up to date with remote. The last sessions were foundation setup work (audit, config, initial setup), all of which are committed and pushed.

Let me present this clearly.

**Session resume — Diploma Tracking System**

No branches missing. Both `main` and `staging` match remote exactly, clean working tree, no stash.

**Current project state: Foundation complete, no sprint work started.**

| Layer                                               | Status               |
| --------------------------------------------------- | -------------------- |
| PRD + Personas + Journeys                           | Done                 |
| SRS (functional + non-functional + architecture)    | Done                 |
| Business maps (data, features, API)                 | Done                 |
| Master Implementation Plan (6 phases, 9-10 sprints) | Done                 |
| PBI tickets                                         | **None created yet** |
| Sprint reports                                      | **None**             |

Last 4 commits on `staging` were all foundation/setup/audit work — no feature code written yet.

**Next step**: Phase 1 (Foundation) — Sprint 1. Stories: Supabase setup + auth + RBAC + user CRUD + provider abstraction + Moodle mock.

**Tool: question**

---

## Assistant

_Thinking:_

The user wants to review the foundation docs first. Let me load the sprint-development skill since the CLAUDE.md says to use it for story-level work, but the user just wants to review docs. Let me read the key foundation documents for them.

**Tool: read**

**Tool: read**

**Tool: read**

**Tool: read**

---

## Assistant

_Thinking:_

Now I have a thorough picture. Let me summarize the foundation docs for the user clearly. The user speaks Spanish, so I'll respond in Spanish.

Key takeaways:

1. Project is Diploma Tracking System for UNC
2. 6 phases, 9-10 sprints
3. Monorepo: server (Bun + Hono) + client (React + Vite + MUI) + shared packages
4. Supabase (PostgreSQL) as DB
5. Provider abstraction for Moodle/Guaraní integrations
6. Rule engine for prerequisite evaluation
7. No code has been written yet beyond boilerplate/setup

Let me present this concisely.

**Fundación completa — DTS está definido, listo para arrancar código.**

### Resumen de lo que hay

| Artefacto              | Contenido clave                                                                                                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Executive Summary**  | 3 problemas de UNC: verificación manual de prerrequisitos, cero visibilidad para estudiantes, sin trazabilidad institucional. La solución: motor de reglas + sync de certificados + dashboard + ciclo completo |
| **MVP Scope**          | 10 épicas MoSCoW. Must Have: Certificados, Dashboard estudiante, Motor de reglas, Examen, Integración Moodle, Admin panel, Enrollment. Should Have: Guaraní, Notificaciones, Override manual                   |
| **Business Data Map**  | 12 entidades mapeadas con relaciones, 4 flujos de negocio (sync, eligibility, exam + grade, override), state machines, provider abstraction layer                                                              |
| **Architecture (SRS)** | Monorepo: `server/` (Bun+Hono) + `client/` (React+Vite+MUI) + `packages/shared/`. Patrón Strategy/Adapter para providers. Supabase como DB. Zod para validación. RLS defense-in-depth                          |
| **Master Plan**        | 6 fases, 9-10 sprints. Sprint 1 = 7 stories (DTS-AUTH-1..4 + DTS-INT-1..3), 21 SP total                                                                                                                        |

### Stack confirmado

```
Client (React+Vite+MUI) ──▶ API (Bun+Hono) ──▶ Supabase (PostgreSQL+Auth)
                                    │
                                    ├──▶ Moodle (CertificateProvider)
                                    └──▶ Guaraní (AcademicProvider, post-MVP)
```

### Lo que NO hay todavía

- No hay tickets en Jira (ni localmente en `.context/PBI/`)
- No hay código de features — solo setup/boilerplate
- No hay schema de DB aplicado (solo definido en los docs)
- Las ramas están sincronizadas — no se perdió nada

**Tool: question**

---

## Assistant

_Thinking:_

The user is having an issue with session resumption. They were told to type `@.context/PBI/session-resume.md` to resume sessions, but it doesn't work. They suspect a mismatch between Claude (Claude Code) and OpenCode. Let me investigate this.

First, let me understand the session resumption mechanism described in CLAUDE.md:

- The CLAUDE.md mentions `@.context/PBI/{module}/SESSION-PROMPT.md` as @-loadable session resume prompt
- But this is a Claude Code feature (@-loading files), not an OpenCode feature

Let me search for how session resumption works in OpenCode and what the actual mechanism should be. I should look at:

1. The agentic dev onboard skill for session resumption info
2. The sprint-development skill for how sessions are resumed
3. OpenCode documentation for how file references work
4. Any differences between Claude Code and OpenCode

Let me also check if there's a SESSION-PROMPT.md file anywhere or if the mechanism differs.

**Tool: skill**

**Tool: webfetch**

**Tool: glob**

**Tool: glob**

---

## Assistant

_Thinking:_

Now I understand the issue. The user was told to use `@.context/PBI/session-resume.md` as a Claude Code @-reference mechanism, but they're using OpenCode. In OpenCode, the `@` syntax works differently - it's not the same as Claude Code's @-file-loading.

Let me now investigate:

1. How OpenCode handles session resumption / file references
2. What the actual mechanism should be for OpenCode vs Claude Code
3. The sprint-development skill to understand session resumption

Let me check the sprint-development skill and the agentic-dev-core for session resumption patterns. Also let me check if there's a specific OpenCode compat layer or CLAUDE.md differences.

The key issue:

- Claude Code uses `@path/to/file` syntax to reference and load files inline
- OpenCode uses a different mechanism - the user needs to use `/context` or `@filename` or some other mechanism
- There's no `SESSION-PROMPT.md` file anywhere - it doesn't exist yet

Let me check the sprint-development skill for how session resumption works and whether there's OpenCode-specific handling.

**Tool: grep**

**Tool: grep**

**Tool: read**

**Tool: read**

---

## Assistant

_Thinking:_

Now I understand the full picture. The user is using OpenCode, but the CLAUDE.md and skills are designed primarily for Claude Code. The `@.context/PBI/session-resume.md` pattern is a Claude Code feature (the `@` syntax for loading files into context). OpenCode has a different mechanism.

Let me now check:

1. How OpenCode handles file references (@ syntax in OpenCode)
2. Whether there's an `opencode.jsonc` config file
3. What the actual session-resumption mechanism should be for OpenCode

Let me look at the OpenCode docs and the existing opencode.jsonc.

**Tool: glob**

**Tool: webfetch**

**Tool: grep**

---

## Assistant

_Thinking:_

Now I have a clear picture. Let me analyze the issue:

1. **Claude Code `@` syntax**: In Claude Code, typing `@path/to/file.md` in a conversation is a way to reference/load file contents into the context. This is a Claude Code-specific feature.

2. **OpenCode equivalent**: OpenCode doesn't have the same `@` syntax for referencing files mid-conversation. Looking at OpenCode's config docs, OpenCode uses:
   - `instructions` config key to load files automatically (via glob patterns)
   - `/file` or similar commands to reference files
   - The `@` sign in OpenCode is used for something else (not file loading)

3. **The actual mechanism**: The CLAUDE.md mentions `@.context/PBI/{module}/SESSION-PROMPT.md` as "@-loadable session resume prompt." This is Claude Code syntax. In OpenCode, you'd need to either:
   - Use `Read` tool to read the file
   - Configure `instructions` in opencode.json to auto-load certain files
   - Ask the agent explicitly to read those files

4. **The SESSION-PROMPT.md file doesn't exist**: Even if the syntax worked, there's no SESSION-PROMPT.md file anywhere because no sprint work has started.

So the user's problem is:

- They were told by Claude Code to use `@.context/PBI/session-resume.md` to resume sessions
- But that's a Claude Code-specific feature
- OpenCode handles file references differently
- The user is running OpenCode, not Claude Code

The fix: In OpenCode, instead of `@.context/PBI/session-resume.md`, the user should just ask the agent directly to read those files, e.g., "Read .context/PBI/README.md and resume our last session." Or I can configure the `instructions` in opencode.json to auto-include the CLAUDE.md and context files.

Let me look at the existing opencode.jsonc to see what's configured.

**Tool: read**

**Tool: read**

---

## Assistant

_Thinking:_

Now I have a complete picture. Let me summarize the issue and the solution:

**The Problem:**
The user was told (by Claude Code previously) that `@.context/PBI/session-resume.md` is how to resume sessions. But:

1. **Claude Code `@` syntax**: In Claude Code, `@path/to/file.md` is a built-in feature that loads file contents into the conversation context inline. This does NOT work in OpenCode - OpenCode has no equivalent `@` file-loading mechanism at the conversation level.

2. **OpenCode works differently**: In OpenCode, you communicate with the agent using natural language. The correct way to resume a session is to simply ask: "Please read .context/PBI/README.md and resume our last session." The agent will use its Read tool to access the files.

3. **The `instructions` option**: OpenCode has an `instructions` config key that can auto-load files as system/rules context. But this is for persistent instructions/rules, not for episodic session resumption.

4. **There is no `SESSION-PROMPT.md`**: Even if the syntax worked, no SESSION-PROMPT.md file exists because no sprint development sessions have been run yet.

**The Fix:**
I should:

1. Explain that `@` syntax is Claude Code-specific, not OpenCode
2. Teach the user the OpenCode-native way to resume sessions (just ask the agent to read the relevant files)
3. Optionally, we could configure `instructions` in opencode.jsonc to auto-load `CLAUDE.md` and `.context/PBI/README.md` so the agent already has session context. But the CLAUDE.md already loads auto (it's detected by both Claude Code and OpenCode).

Actually, looking at the OpenCode config docs more carefully:

- OpenCode has `"instructions"` config key that takes paths/glob patterns
- The CLAUDE.md is already loaded automatically (because agents detect it)
- But `.context/PBI/` files are not automatically loaded

The practical solution is: tell the user that in OpenCode, instead of `@.context/PBI/session-resume.md`, they should just ask the agent directly using natural language. Example: "Please read .context/PBI/README.md and resume our last session" — which is exactly what they did this time, and it worked.

I should also optionally add the CLAUDE.md path to instructions if it's not auto-detected, but it seems like it is auto-detected based on the system prompt mentioning CLAUDE.md.

Let me now present the solution clearly.

**Encontrado el problema. Es un mismatch Claude Code ↔ OpenCode.**

### El `@` no funciona en OpenCode

| Feature                       | Claude Code                          | OpenCode                                                        |
| ----------------------------- | ------------------------------------ | --------------------------------------------------------------- |
| `@path/to/file.md` en el chat | Carga el archivo inline al contexto  | **No existe** — OpenCode no tiene este mecanismo                |
| Cómo referenciar archivos     | `@file.md`                           | Lenguaje natural: "leé X.md" → el agente usa `Read` tool        |
| Auto-carga de contexto        | `CLAUDE.md` auto-detectado + @-files | `CLAUDE.md` auto-detectado + `instructions` en `opencode.jsonc` |

### Cómo funciona en OpenCode

Cuando escribiste `@.context\PBI\README.md please resume our last session`, OpenCode:

1. **Ignoró el `@`** — no es sintaxis que reconozca
2. **Leyó el resto como prompt** — y el agente usó `Read` tool para ir a buscar los archivos
3. **Funcionó** — justamente porque el agente tiene herramientas de lectura de archivos

### La forma correcta en OpenCode

No uses `@`. Simplemente pedíselo al agente con lenguaje natural:

```
Leé .context/PBI/README.md y resumí la última sesión
```

o más directo:

```
Resumí dónde quedamos la última vez — leé los context files en .context/PBI/
```

El agente sabe usar sus herramientas (`Read`, `Glob`, `Grep`) para encontrar lo que necesita.

### Opcional: auto-cargar archivos clave

Si querés que ciertos archivos se carguen siempre al inicio, agregalos a `instructions` en `opencode.jsonc`:

```jsonc
"instructions": [".context/PBI/README.md"]
```

Pero para sesión-resume puntual, lenguaje natural es más flexible y evita contaminar el contexto base.

¿Querés que actualice el `opencode.jsonc` con instructions relevantes, o preferís seguir con lenguaje natural?

---

## User

No. let's try to figure out using tavily what would be the correct way to implement same syntax-functionality as it was implemented as a way to save token in this proyect. Research options including caveman and similar AI tools as this project explain in the docs.

---

## Assistant

_Thinking:_

The user wants to implement the `@` file-referencing syntax in OpenCode, similar to how Claude Code does it. They want to save tokens by having a shorthand way to reference files that the agent can resolve. Let me research:

1. How OpenCode handles file references / commands
2. Whether OpenCode has a commands system (custom slash commands) that could implement @-syntax
3. Caveman and similar tools mentioned in the project docs
4. The project's own approach to this problem

Let me look at the project docs first, then research OpenCode's capabilities.

**Tool: glob**

**Tool: glob**

**Tool: glob**

**Tool: glob**

---

## Assistant

_Thinking:_

Let me now search for caveman mentions, the project's approach to context efficiency, and research OpenCode's command/plugin system for implementing @-syntax.

**Tool: grep**

**Tool: webfetch**

**Tool: webfetch**

---

## Assistant

_Thinking:_

Excellent! I found the key piece of information. In OpenCode's Commands documentation:

**File references**: OpenCode DOES support `@` syntax, but ONLY inside **custom commands** (slash commands), not in regular chat messages. The documentation says:

> Include files in your command using `@` followed by the filename.
>
> ```
> Review the component in @src/components/Button.tsx.
> ```
>
> The file content gets included in the prompt automatically.

So the `@` syntax works in OpenCode, but only inside custom command templates (`.opencode/commands/*.md`). This is perfect because:

1. We can create a custom command like `/resume` that uses `@` to reference the session-resume file
2. Or we could create `/session` that loads the SESSION-PROMPT.md

Now let me also research:

1. The caveman-compress tool for token efficiency
2. How Claude Code's `@` works as a hook vs OpenCode
3. The custom-tools approach in OpenCode for creating custom tools

The key findings:

- **OpenCode commands support `@file` syntax** natively - but only in command templates
- **OpenCode plugins** can intercept `tui.command.execute` and `tool.execute.before` events
- **OpenCode custom tools** can be created via plugins

Let me look at the project's own approach more deeply. Let me check the agentic-dev-onboard and sprint-development references for how they handle the @-file pattern and session resumption.

**Tool: read**

**Tool: grep**

**Tool: webfetch**

---

## Assistant

_Thinking:_

Now I have a comprehensive picture. Let me research two more angles:

1. Claude Code hooks - how they handle `@` file references (the actual mechanism)
2. OpenCode's `instructions` config - which could be used to implement a similar token-saving approach

Let me now synthesize all the findings and present a clear comparison and solution.

Key findings:

1. **OpenCode Commands support `@file` syntax** - but only inside `/command` templates, not in raw chat
2. **Claude Code hooks** - Claude Code has a `UserPromptSubmit` hook that can intercept and rewrite messages. The caveman skill uses this to auto-activate. Claude Code also has native `@` file-referencing built into its TUI.
3. **Caveman** - a Claude Code skill/plugin that uses hooks to auto-activate compression. Uses `caveman-compress` to compress memory files. Has OpenCode support.
4. **OpenCode has similar hook/plugin system** - events like `tui.command.execute`, `tool.execute.before`, etc.

Now let me think about the actual solution:

**The `@` problem in OpenCode:**

- In Claude Code TUI, typing `@.context/PBI/README.md` in the chat automatically resolves and inlines the file content
- In OpenCode, this is NOT built-in to the chat input
- BUT OpenCode commands DO support `@file` syntax in command templates

**Token-saving approach for OpenCode:**
The project uses `@.context/PBI/{module}/SESSION-PROMPT.md` as a token-saving mechanism - instead of copy-pasting long prompts, you just type `@path` and the file gets inlined.

In OpenCode, the equivalent token-saving approaches are:

1. **Custom commands** with `@file` references in templates
2. **`instructions`** config to auto-load context files
3. **OpenCode plugins** that intercept prompts and resolve `@` references
4. **Caveman + caveman-compress** to reduce context doc sizes

Let me look at caveman's OpenCode support to see how it handles the @ syntax issue.

**Tool: webfetch**

**Tool: tavily_tavily_search**

**Tool: webfetch**

---

## Assistant

_Thinking:_

Now I have the complete picture. Let me also search for caveman's OpenCode-specific implementation to see how it handles the hook/tool layer, and then search for how to implement @-file resolution in OpenCode.

Now let me check the caveman OpenCode plugin and one more key detail — how OpenCode's `{file:}` variable expansion works in its config:

**Tool: tavily_tavily_search**

**Tool: webfetch**

---

## Assistant

_Thinking:_

Now I have a very comprehensive understanding. Let me also quickly check the caveman install for OpenCode to see exactly what it does, and then also look at the project's own docs/agentic-development-engineering.md for any more clues about how the project architects token-saving.

**Tool: read**

**Tool: webfetch**

---

## Assistant

_Thinking:_

Now I have the complete picture. Let me synthesize everything and present it clearly to the user.

## Summary of findings:

### The `@` file-reference problem

**Claude Code**: Has native `@path/to/file` syntax in the chat/TUI that resolves and inlines file contents into the conversation prompt. This is used by the project as a token-saving mechanism: instead of copy-pasting 200 lines of context, you just type `@.context/PBI/{module}/SESSION-PROMPT.md` and Claude Code loads it inline.

**OpenCode**: Does NOT have this in the raw chat input. The `@` symbol in OpenCode is used for:

1. `@agent-name` to invoke subagents (e.g., `@general help me`)
2. `@file` inside **custom command templates** (`.opencode/commands/*.md`)

### How to replicate the Claude Code `@` functionality in OpenCode

There are **4 viable approaches**, ranked by closest to the original intent:

### Approach 1: Custom Command with `@file` reference (closest match)

Create `.opencode/commands/resume.md`:

```markdown
---
description: Resume session from PBI context
---

Read the SESSION-PROMPT.md file for the relevant module and resume where we left off. The file to read is at @.context/PBI/$1/SESSION-PROMPT.md
```

Then use `/resume user-management` in the TUI. OpenCode will resolve `@` within command templates.

### Approach 2: `instructions` in opencode.jsonc (pre-loading)

Add auto-loaded context files to reduce token waste on file reads every session:

```jsonc
"instructions": [
  "CLAUDE.md",
  ".context/master-implementation-plan.md",
  ".context/PBI/README.md"
]
```

### Approach 3: `AGENTS.md` with explicit read instructions (semantic approach)

OpenCode's docs explicitly mention teaching the agent to use its Read tool when encountering `@file` references. Add to AGENTS.md/claude.md:

```
When you encounter a file reference like @path/to/file.md,
use your Read tool to load it. They're relevant to the task at hand.
```

### Approach 4: OpenCode plugin (custom tool / prompt interceptor)

Create a plugin that intercepts `tui.prompt.append` and resolves `@file` references by reading files and injecting them. This is the most complete but most complex approach.

### caveman + token efficiency

- caveman has OpenCode support via `npx -y github:JuliusBrussee/caveman -- --only opencode` which installs as an OpenCode plugin
- caveman compresses output tokens ~65% and input tokens (via caveman-compress) ~46%
- Using caveman reduces the token cost of reading context files in the first place

### Recommendation

The simplest and most robust approach for OpenCode is **Approach 1 (custom command)** + **Approach 2 (instructions pre-loading)** + installing **caveman** for overall token compression. This gives the equivalent of `@` file syntax with minimal implementation effort.

Let me present this analysis clearly.

Encontré la respuesta. Acá está el análisis completo.

---

## Diagnóstico: `@file` en Claude Code vs OpenCode

| Mecanismo                           | Claude Code                                                    | OpenCode                                                 |
| ----------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------- |
| `@file.md` en el chat               | **Nativo** — resuelve e inyecta el archivo inline en el prompt | **No existe en chat raw**                                |
| `@file.md` en templates de comandos | N/A                                                            | **Soportado** — pero solo dentro de `/comando` templates |
| `@agent`                            | No (usa `@` solo para archivos)                                | Sí — invoca subagentes                                   |
| `{file:path}` en config             | No (usa `${VAR}`)                                              | **Soportado** — en `opencode.json`                       |
| `instructions` auto-carga           | Vía `CLAUDE.md`                                                | `AGENTS.md` + `opencode.json` `instructions`             |

---

## 4 enfoques para replicar `@` token-saving en OpenCode

### 1. **Custom Command con `@file`** (más cercano al original)

OpenCode **sí** resuelve `@file` en templates de comandos. Creamos un comando de resume:

```
.opencode/commands/resume.md
```

```markdown
---
description: Resume last session from PBI context
---

Leé @.context/PBI/$1/SESSION-PROMPT.md y resumí dónde quedamos la última sesión en este módulo.
```

Uso: `/resume user-management` → OpenCode resuelve el `@` y carga el archivo inline. **0 tokens gastados en copiar/pegar contexto.**

### 2. **`instructions` en opencode.jsonc** (pre-carga automática)

Agregar a `opencode.jsonc`:

```jsonc
"instructions": [
  "CLAUDE.md",
  ".context/master-implementation-plan.md"
]
```

Esto inyecta esos archivos como system context **cada sesión**, eliminando la necesidad de leerlos manualmente (ahorro de ~2000 tokens/sesión en reads).

### 3. **Plugin interceptor de `@`** (equivalente funcional completo)

Crear `.opencode/plugins/at-resolver.ts` que intercepte `tui.prompt.append` y resuelva `@path/to/file` → lee el archivo → inyecta contenido. Esto replicaría el comportamiento exacto de Claude Code.

```typescript
import type { Plugin } from '@opencode-ai/plugin';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export const AtResolver: Plugin = async ({ directory }) => {
  return {
    'tui.prompt.append': async (input, output) => {
      output.prompt = output.prompt.replace(/@(\.[^\s]+)/g, (_, path) => {
        const fullPath = resolve(directory, path);
        if (existsSync(fullPath)) {
          return `\n\n--- BEGIN ${path} ---\n${readFileSync(fullPath, 'utf-8')}\n--- END ${path} ---\n\n`;
        }
        return `@${path}`; // leave unresolved refs as-is
      });
    },
  };
};
```

### 4. **AGENTS.md con instrucciones semánticas** (más portable)

OpenCode docs sugieren esto explícitamente. Agregar al `AGENTS.md`/`CLAUDE.md`:

```markdown
## File Reference Resolution

When you see `@path/to/file.md` in a user message, use your Read tool
to load that file. The @ syntax is a token-saving shorthand — resolve it
before processing the rest of the message.
```

El agente interpreta `@` semánticamente y usa `Read` tool.

---

## Recomendación

**Combinación ganadora para este proyecto:**

| Capa                         | Qué hacer                                                                                | Token saving                         |
| ---------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------ |
| **Caveman**                  | Ya recomendado por el proyecto. `npx -y github:JuliusBrussee/caveman -- --only opencode` | ~65% output, ~46% input              |
| **Custom command `/resume`** | Enfoque #1 — comando con `@file` nativo                                                  | Elimina copy-paste de SESSION-PROMPT |
| **`instructions` pre-load**  | Enfoque #2 — `master-implementation-plan.md` como system context                         | ~2000 tokens/sesión                  |
| **Plugin `@` resolver**      | Enfoque #3 — si querés el comportamiento exacto de Claude Code                           | Máximo ahorro, más esfuerzo          |

¿Querés que implemente alguno de estos ahora? El **custom command `/resume`** es el más inmediato y de mayor impacto.

---

## User

ok, Yes, but before implementing it. Look all over the project for similar tools and shortcuts lik "./" to ymls or other non-md files like markdownd that we could find a solution like this one. thanks

---

## Assistant

_Thinking:_

The user wants me to search the entire project for:

1. Similar `@` syntax usage patterns
2. Other shortcuts like `./` references
3. References to YAML, JSON, or other non-MD files that use similar token-saving patterns
4. Any other file-reference shortcuts used across the project

Let me do a comprehensive search.

**Tool: task**

---

## User

feel free to use tavily too please

---

## Assistant

_Thinking:_

The user wants me to use Tavily to research more about OpenCode-specific approaches to implementing the @file syntax. Let me search for specific topics that the audit revealed:

1. OpenCode plugins that resolve file references
2. OpenCode custom tools for file injection
3. Any community solutions for @file syntax in OpenCode
4. How other projects handle cross-agent (Claude Code ↔ OpenCode) file references
5. OpenCode's hook system for prompt interception

The audit was very thorough and revealed:

- No `.opencode/` folder exists
- No existing plugins, commands, or agents for OpenCode
- The `@.context/PBI/` pattern is only used for SESSION-PROMPT.md (3 matches)
- Multiple variable/shortcut systems exist but all are internal to the boilerplate

Let me search Tavily for specific technical solutions.

**Tool: tavily_tavily_search**

**Tool: tavily_tavily_search**

**Tool: tavily_tavily_search**

---

## Assistant

_Thinking:_

Now let me fetch the key discoveries:

1. The GitHub issue #2225 about loading @ referenced files in AGENTS.md - this is directly relevant
2. The OpenCode plugin guide gist - very interesting for implementing a custom tool
3. The Claude Code hooks mechanism for UserPromptSubmit - to understand how Claude Code handles @file resolution

Let me get more details on the GitHub issue and the plugin guide.

**Tool: tavily_tavily_extract**

**Tool: tavily_tavily_search**

---

## Assistant

_Thinking:_

Now let me also check the GitHub issue #2225 more carefully - it's specifically about loading @ referenced files in AGENTS.md into context. Let me also search for one more key thing: how does caveman handle OpenCode specifically, and what about the OpenCode plugin for caveman. Also check the John Lindquist guide for more details on hooks.

Let me also search for a couple more things:

1. The John Lindquist gist about OpenCode plugins
2. Any existing OpenCode plugin that resolves @ references

**Tool: tavily_tavily_search**

**Tool: tavily_tavily_extract**

---

## Assistant

_Thinking:_

Now I have all the pieces. Let me compile the comprehensive findings for the user.

The critical finding from GitHub Issue #2225 is that OpenCode does NOT automatically resolve `@file` references in AGENTS.md like Claude Code does. This is a known feature gap that users have requested. The issue is open and suggests it's not yet implemented.

Let me now present a clear, organized report to the user covering:

1. The complete audit of all shortcut patterns in the project
2. The Claude Code → OpenCode gap for @file resolution
3. How caveman handles this in OpenCode
4. Concrete implementation options with the new research

Let me structure this clearly.

**Auditoría completa + investigación Tavily. Acá está todo.**

---

## 1. TODO lo que usa atajos en este proyecto

| #   | Patrón                                       | Tipo                         | Dónde se resuelve                         | Ocurrencias | `@`-like? |
| --- | -------------------------------------------- | ---------------------------- | ----------------------------------------- | ----------- | --------- |
| 1   | `{{VAR_NAME}}`                               | Variable de proyecto         | `.agents/project.yaml`                    | **315+**    | No        |
| 2   | `{{jira.<slug>}}`                            | Campo custom de Jira         | `jira-fields.json` + `jira-required.yaml` | **80+**     | No        |
| 3   | `[TAG_TOOL]` / `[DB_TOOL]` / etc.            | Pseudocódigo tool-agnostic   | Tabla en CLAUDE.md → CLI concreto         | **89**      | No        |
| 4   | `$ARGUMENTS`                                 | Placeholder de comando       | Input del usuario al invocar              | **10**      | No        |
| 5   | `<<VAR_NAME>>`                               | Variable de sesión (runtime) | Contexto en vivo                          | **~15**     | No        |
| 6   | `${VAR}` / `{env:VAR}`                       | Env var expansion            | `.env` → `.mcp.json` / `opencode.jsonc`   | **6**       | No        |
| 7   | `@/` (imports TS)                            | Path alias de TypeScript     | `tsconfig.json`                           | **~50**     | No        |
| 8   | `@.context/PBI/{module}/SESSION-PROMPT.md`   | **File reference shortcut**  | Claude Code lo resuelve inline            | **3**       | **SÍ**    |
| 9   | `@.context/PBI/{module}/{TICKET}/context.md` | **File reference shortcut**  | Claude Code lo resuelve inline            | **3**       | **SÍ**    |
| 10  | `@-loadable`                                 | Marcador descriptivo en docs | Etiqueta en CLAUDE.md + docs              | **3**       | **SÍ**    |

**Solo 3 patrones son `@`-file shortcuts** — y todos apuntan a `.context/PBI/`, todos son Claude Code nativos, ninguno funciona en OpenCode.

---

## 2. El gap Claude Code → OpenCode que encontró Tavily

### GitHub Issue #2225 — "Automatically load @ referenced files in AGENTS.md into context"

> _"Claude Code has the very nice feature that you can reference other files using `@` in your `CLAUDE.md`, and it is automatically loaded into the session... Unfortunately, OpenCode currently doesn't have the same behaviour with `AGENTS.md`."_

**Este issue está ABIERTO.** OpenCode no tiene resolución automática de `@file` en AGENTS.md. Es una feature request conocida de la comunidad.

### Cómo lo hace Claude Code (UserPromptSubmit hook)

```
Usuario escribe: @.context/PBI/user-management/SESSION-PROMPT.md
         │
         ▼
Claude Code UserPromptSubmit hook
         │  ── Lee archivo del filesystem
         │  ── Inyecta contenido en el prompt
         ▼
Modelo recibe: [contenido del archivo] + resto del prompt del usuario
```

### Cómo lo hace OpenCode actualmente

- **En chat raw**: No resuelve `@path`. Lo ignora.
- **En templates de comandos**: `@file.md` **SÍ** se resuelve → inyecta contenido
- **En AGENTS.md**: La doc oficial dice que enseñes al agente a usar `Read` tool cuando vea `@file`
- **En `instructions` de opencode.jsonc**: Carga archivos completos como system context (no es per-turn, es estático)

---

## 3. Mecanismos de OpenCode que PUEDEN implementar `@`-resolution

### A. `tui.prompt.append` hook (plugin)

El evento existe y está documentado. Se dispara cada vez que el usuario escribe en el TUI. Un plugin puede interceptar, detectar `@path`, leer el archivo, y sustituir:

```typescript
// .opencode/plugins/at-resolver.ts
export const AtResolver = async ({ directory }) => {
  return {
    event: async ({ event }) => {
      if (event.type !== 'tui.prompt.append') return;
      // regex: detect @.context/... patterns
      // read file, replace @path with file content
    },
  };
};
```

### B. Custom tool `read_at_file`

Crear un tool que el agente pueda llamar para resolver `@path` → devuelve contenido:

```typescript
// .opencode/tools/at-resolver.ts
import { tool } from '@opencode-ai/plugin';
export const atResolver = tool({
  description: 'Resolve @file references. Pass @path and get file contents.',
  args: { path: tool.schema.string() },
  async execute({ path }, { directory }) {
    const resolved = resolve(directory, path.replace(/^@/, ''));
    return readFileSync(resolved, 'utf-8');
  },
});
```

### C. Custom commands con `@file` nativo (lo más simple)

OpenCode **ya** resuelve `@file` en templates de comandos. Crear:

```
.opencode/commands/resume.md
```

```markdown
---
description: Resume session from PBI context
arguments:
  - name: module
    description: Module name (e.g., user-management)
---

Read @.context/PBI/$1/SESSION-PROMPT.md and resume where we left off.
```

Uso: `/resume user-management` → OpenCode **resuelve el `@` nativamente** dentro del comando.

### D. `instructions` en opencode.jsonc (pre-carga estática)

```jsonc
"instructions": [
  ".context/master-implementation-plan.md",
  ".context/PBI/README.md"
]
```

Esto inyecta esos archivos como system prompt cada sesión. No es dinámico como `@`, pero elimina reads repetidos.

---

## 4. Caveman en OpenCode

Caveman instala en OpenCode como **plugin** (`npx -y github:JuliusBrussee/caveman -- --only opencode`). El plugin:

- Modifica el output del agente para hablar en caveman
- Usa hooks `tui.prompt.append` y otros eventos de OpenCode
- **No resuelve `@` files** — es solo compresión de tokens
- `caveman-compress` sí comprime archivos de memoria (CLAUDE.md, context.md) → ~46% menos tokens de input

---

## Resumen: combinación recomendada

| Solución                                            | Qué resuelve                                      | Complejidad        |
| --------------------------------------------------- | ------------------------------------------------- | ------------------ |
| **Custom command `/resume`** con `@file`            | `@`-resolution exacta para session resume         | Baja — .md file    |
| **Plugin `at-resolver.ts`** con `tui.prompt.append` | `@`-resolution en TODO el chat (como Claude Code) | Media — TypeScript |
| **`instructions` en opencode.jsonc**                | Pre-carga archivos clave cada sesión              | Cero — config      |
| **Caveman**                                         | Compresión de output (-65%) + input (-46%)        | Cero — un comando  |

Las 4 son compatibles entre sí. ¿Implemento el combo?

---

## Session 27/5/2026 — Phase 1 Gaps + Phase 3 (Rule Engine)

**App repo**: `diploma-tracking-sys` (D:\Nahuel\Proyectos\UPEX\diploma-tracking-sys)
**Branch**: main

### Phase 1 Gap Fixes (DTS-AUTH-2/3/4, DTS-INT-1/2/3)

| Story      | What was done                                                                                                                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DTS-AUTH-2 | Real JWT login/refresh/logout via `jose` + Supabase Auth. Access tokens (15m) + refresh tokens (7d). Login: `signInWithPassword` → JWT creation. Refresh: verify refresh → issue new pair. Logout: admin signOut. |
| DTS-AUTH-3 | `authenticate` middleware verifies JWT with `jose` (HS256). `requireRole` gates by role. Added `email` to `AuthContext`.                                                                                          |
| DTS-AUTH-4 | `POST /admin/users` — creates user in Supabase Auth (`admin.createUser`) + inserts `students` row. Email uniqueness check, rollback on failure.                                                                   |
| DTS-INT-1  | Created `providers/` dir: `CertificateProvider` + `AcademicProvider` interfaces, `ProviderRegistry` (register/set/resolve), barrel exports.                                                                       |
| DTS-INT-2  | `MoodleServiceImpl` implements `CertificateProvider`. Added `healthCheck()` (pings Moodle REST), `validateCertificate()`, `fetchCertificates()`. Registered in ProviderRegistry at startup.                       |
| DTS-INT-3  | `integration-logs.ts` — `logSyncStart`, `logSyncComplete`, `logPerStudent` helpers. Wired into `integrations.ts` routes.                                                                                          |

### Phase 3 — Rule Engine (DTS-RULE-1/2/3/4, DTS-EXAM-1/2)

**Schema** — `002_phase3_rule_engine.sql` applied. `parent_rule_id` + `order_index` on prerequisite_rules. `manual_overrides` restructured (`rule_id` FK, `status` active/expired/revoked, `expires_at`, `revoked_at`). Partial unique index. RLS on 6 tables. Triggers on 3.

**Rule Engine** — `services/rule-engine.ts`: `evaluateTrackEligibility()` dependency-injected recursive tree evaluator. `buildRuleTree()` via parent_rule_id. `evaluateNode()` recursive ALL/ANY with override bypass. `collectMissingCourses()` dedup. Perf guard >500ms.

**Routes updated** — eligibility wired to rule engine, override CRUD routes created, real student progress aggregation, recursive tree display in prerequisites viewer.

**Tests** — 23 tests, all passing. 99.21% line / 95.24% function coverage.

### Files Changed (server/src/)

**Modified**: middleware/auth.ts, routes/auth.ts, routes/admin.ts, routes/rules.ts, routes/enrollments.ts, routes/students.ts, routes/integrations.ts, routes/courses.ts, index.ts, db/supabase.ts, package.json

**Created**: providers/\* (4 files), services/rule-engine.ts, services/rule-engine.test.ts, services/integration-logs.ts, routes/overrides.ts, supabase/migrations/002_phase3_rule_engine.sql
