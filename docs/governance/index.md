# Sagara Vite React TS — AI Agent Guide

This is the documentation for AI agents working with the **sagara-vite-react-ts** project — a React/TypeScript admin dashboard application.

## Project Overview

- **Name**: sagara-vite-react-ts
- **Purpose**: Admin dashboard with role-based access control (RBAC)
- **Pattern**: Module-per-feature (each domain feature has its own module)
- **Auth**: Token-based (Bearer token in localStorage), server-side session refresh
- **Routing**: React Router v6 with lazy-loaded module routes
- **State**: nanostores (global) + TanStack Query v5 (server state)
- **Forms**: React Hook Form with a centralized component library

## Quick Reference

| Concern | Library / Pattern |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Routing | React Router v6 (`lazy` + `Suspense`) |
| Global State | nanostores (`@nanostores/react`) |
| Server State | TanStack Query v5 |
| Forms | React Hook Form |
| HTTP | Axios |
| UI / Styling | Bootstrap 5 + Keenthemes Metronic-inspired |
| i18n | react-i18next |
| Notifications | notistack |
| File Upload | Custom axios (`uploadAxiosSetup`) |

## Path Aliases

```
@/          → src/
@components/ → src/components/
@hooks/      → src/hooks/
@modules/    → src/modules/
@services/   → src/services/
@stores/     → src/stores/
@utils/      → src/utils/
@types/      → src/types/
```

## Documentation Map

Read these files in order for full context:

1. [tech-stack.md](./tech-stack.md) — all dependencies and what they're used for
2. [project-structure.md](./project-structure.md) — directory tree and key files
3. [routing.md](./routing.md) — how routes are organized (auth vs. private, module routes)
4. [authentication.md](./authentication.md) — auth flow, guards, RBAC/privilege system
5. [modules.md](./modules.md) — how to create a new feature module from scratch ← **most important**
6. [forms.md](./forms.md) — form pattern and all input components
7. [components.md](./components.md) — full component library inventory
8. [hooks.md](./hooks.md) — custom hooks and their use cases
9. [services.md](./services.md) — generic CRUD service layer
10. [stores.md](./stores.md) — nanostores and React contexts
