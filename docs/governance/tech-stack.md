# Tech Stack

## Core

- **React 18** — UI framework
- **TypeScript** — type safety throughout
- **Vite** — build tool and dev server

## Routing

- **react-router-dom v6** — client-side routing
  - Routes are wrapped in `lazy()` + `Suspense` for code splitting
  - `<BrowserRouter basename={VITE_APP_BASE_URL}>` at the root

## State Management

### Global State (nanostores)
- **nanostores** + **@nanostores/react** — lightweight reactive stores
- Used for: auth state, user data, breadcrumbs, page title
- Stores are atoms/maps that components subscribe to via `useStore()`
- Synced with `localStorage` for persistence (e.g., `accessToken`)

### Server State (TanStack Query)
- **@tanstack/react-query v5** — data fetching, caching, pagination
- All API calls go through query hooks (e.g., `useList`, `useCreate`)
- Query keys follow the pattern: `[moduleName, skip, limit, params]`

## Forms

- **react-hook-form** — form state, validation, controlled inputs
- `useForm<T>()` + `FormProvider` to wrap form pages
- `useFormContext<T>()` inside child components to access form methods
- All inputs are **controlled** via the `control` prop from `useFormContext`

## HTTP Client

- **axios** — all API calls
- Three configured axios instances in `src/utils/`:
  - `authAxios` — Bearer token injected automatically via interceptor
  - `publicAxios` — no auth header (used for auth endpoints)
  - `uploadAxiosSetup` — multipart/form-data for file uploads

## Styling / UI

- **Bootstrap 5** — grid, utilities, base components
- **Keenthemes Metronic** design language — card layouts, sidebar, table styling
- Custom CSS in `src/assets/style/custom.css` and `src/index.css`
- No Tailwind — custom CSS classes on all elements

## Internationalization

- **react-i18next** — all user-facing strings use `t("key")`
- Locale files in `public/locales/` (served as static files, loaded via HTTP backend)
- Translation keys follow the pattern: `modules.<module>.<page>.<field>`

## Notifications

- **notistack** — toast/snackbar notifications
- Usage: `const { enqueueSnackbar } = useSnackbar()`
- Variants: `success`, `error`, `info`, `warning`
- Snackbar queue is global; you never need to manage z-index or positioning manually

```tsx
import { useSnackbar } from "notistack";

const { enqueueSnackbar } = useSnackbar();

enqueueSnackbar("Saved successfully", { variant: "success" });
enqueueSnackbar("Something went wrong", { variant: "error" });
```

## Other Notable Libraries

- **i18next-browser-languagedetector** — auto-detects browser language
- **i18next-http-backend** — lazy-loads locale files from `/locales/{{lng}}/{{ns}}.json`
- **@tanstack/react-query-devtools** — React Query dev tools
- **msw** (Mock Service Worker) — API mocking in dev (`src/mocks/`)
- **vitest** — unit testing framework (with MSW integration in `src/mocks/setupTest.ts`)

## Environment Variables

All env vars are prefixed with `VITE_` and read at build time. See [env-vars.md](./env-vars.md) for the full reference.
