# Environment Variables

All environment variables are prefixed with `VITE_` (Vite convention) and are read at **build time**, not runtime. They are defined in `.env` files (`.env`, `.env.local`, `.env.production`, etc.).

## Available Variables

| Variable | Description | Example | Default |
|---|---|---|---|
| `VITE_APP_NAME` | Application display name | `"Sagara Admin"` | — |
| `VITE_APP_VERSION` | Application version | `"1.0.0"` | — |
| `VITE_APP_ENV` | Environment (development/production) | `"development"` | `"development"` |
| `VITE_APP_PORT` | Dev server port | `"5173"` | `"5173"` |
| `VITE_APP_MODE_MOCK` | Enable MSW mock mode | `"true"` / `"false"` | `"false"` |
| `VITE_APP_BASE_URL` | Router basename (if app is served from subdirectory) | `"/admin"` | `"/"` |
| `VITE_API_BASE_URL` | API base URL | `"https://api.example.com"` | — |
| `VITE_API_AUTH_URL` | Auth server URL | `"https://auth.example.com"` | — |
| `VITE_API_UPLOAD_URL` | File upload endpoint | `"https://upload.example.com"` | — |
| `VITE_API_TIMEOUT` | Request timeout in milliseconds | `"30000"` | `"30000"` |
| `VITE_PAGE_LIMIT` | Default page size for list pagination | `"10"` | `"10"` |

## Accessing Variables in Code

Use `import.meta.env.VITE_*` to access variables:

```ts
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDev = import.meta.env.VITE_APP_ENV === "development";
```

## .env Files

The app supports multiple `.env` files (Vite convention):

| File | When loaded | Priority |
|---|---|---|
| `.env` | Always | Lowest |
| `.env.local` | Always (gitignored) | Overrides `.env` |
| `.env.development` | `VITE_APP_ENV=development` | Overrides both |
| `.env.production` | `VITE_APP_ENV=production` | Overrides both |

## Important Notes

1. **Variables MUST start with `VITE_`** — otherwise Vite won't expose them to the client
2. **Don't commit `.env.local`** — it's already in `.gitignore`
3. **Provide `.env.example`** — template with all required vars (no values)
4. **Values are always strings** — parse to number/boolean if needed

## Example .env.example

```bash
VITE_APP_NAME=Sagara Admin
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
VITE_APP_PORT=5173
VITE_APP_MODE_MOCK=false
VITE_APP_BASE_URL=/
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_AUTH_URL=http://localhost:3001/auth
VITE_API_UPLOAD_URL=http://localhost:3002/upload
VITE_API_TIMEOUT=30000
VITE_PAGE_LIMIT=10
```
