# Authentication Flow

## Overview

The system uses **JWT-based authentication** for the React SPA frontend. All authenticated requests include a Bearer token in the `Authorization` header.

**PRD Reference:** Section 4.6.3

---

## Authentication Flow

```
┌─────────────────┐
│  User Opens     │  React SPA loads
│  Application    │
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Login Form     │  POST /api/v1/auth/signin
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Validate       │  Check username + password, status = 1
│  Credentials    │
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Return Tokens  │  access_token (15 min) + refresh_token
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Store Tokens   │  accessToken in localStorage
│                 │  refreshToken in localStorage + HttpOnly cookie
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Authenticated  │  Include Bearer <access_token> header
│  Requests       │  on all subsequent API calls
└─────────────────┘
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signin` | User login |
| POST | `/api/v1/auth/register` | User registration |
| POST | `/api/v1/auth/refresh` | Refresh tokens |
| POST | `/api/v1/auth/logout` | Invalidate token |
| GET | `/api/v1/me` | Get current user |
| PUT | `/api/v1/me` | Update current user |

---

## Login Request

```json
POST /api/v1/auth/signin
{
  "username": "admin",
  "password": "securepassword"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer",
    "expires_in": 900,
    "user": {
      "id": "uuid",
      "name": "Administrator",
      "email": "admin@company.com",
      "role": "administrator",
      "roles": [...],
      "privileges": [...]
    }
  },
  "message": "Login successful"
}
```

---

## Token Storage

Tokens are stored in two places:

| Token | Storage | Purpose |
|-------|---------|---------|
| `accessToken` | `localStorage` | Sent in `Authorization: Bearer` header on every request |
| `refreshToken` | `localStorage` + HttpOnly cookie | Used to obtain new access tokens; cookie enables server-side invalidation |

### Axios Configuration (`src/utils/axiosSetup.ts`)

```ts
const token = localStorage.getItem("accessToken");
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

// Refresh interceptor sends both localStorage token + withCredentials cookie
config.withCredentials = true;
```

---

## Token Refresh Flow

```
┌──────────────────────┐
│  Access Token TTL    │  15 minutes (configurable via JWT_TTL)
└───────┬──────────────┘
        │ expires
        ▼
┌──────────────────────┐
│  Send Refresh        │  POST /api/v1/auth/refresh
│  Request             │  body: {} (empty)
│                      │  Authorization: Bearer <refresh_token>
│                      │  withCredentials: true
└───────┬──────────────┘
        │
        ▼
┌──────────────────────┐
│  Validate Refresh    │  BE checks type="refresh" claim
│  Token               │
└───────┬──────────────┘
        │
        ▼
┌──────────────────────┐
│  Return New Pair     │  New access_token + refresh_token
│  + Store             │  Overwrite localStorage items
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│  Retry Original      │  Axios interceptor retries the
│  Request             │  failed request with new token
└──────────────────────┘
```

### Automatic Refresh (Axios Interceptor)

The response interceptor in `axiosSetup.ts` handles 401 errors automatically:

```ts
// Only triggers on 401 — avoids unnecessary refresh calls
if (error.response?.status === 401) {
  const refreshed = await refreshAccessToken();
  if (refreshed) {
    return axios(error.config); // Retry with new token
  }
  // Refresh failed — redirect to login
  window.location.href = "/login";
}
```

**Important:** Refresh is only called on 401 responses — not on 422, 404, or other errors.

---

## Logout Flow

```tsx
const logout = async () => {
  await axios.post("/api/v1/auth/logout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};
```

The access token is blacklisted server-side and cannot be reused.

---

## State Management

### Auth Store (nanostores)

```tsx
// src/modules/auth/stores/authStores.ts
import { atom, map } from 'nanostores';

export const $user = map<User | null>(null);
export const $isAuthenticated = atom(false);

export const setUser = (user: User | null) => {
  $user.set(user);
  $isAuthenticated.set(!!user);
};

export const clearUser = () => {
  $user.set(null);
  $isAuthenticated.set(false);
};
```

User data is persisted in `localStorage` under the key `"user"` by `getAuth()` in `src/components/auth/AuthHelpers.ts`.

---

## Business Rules

1. **Bearer Token** — All authenticated requests use `Authorization: Bearer <token>` header
2. **No Cookies for Auth** — Tokens stored in localStorage; refresh uses HttpOnly cookie via `withCredentials`
3. **No CSRF** — No CSRF protection needed (no session cookies)
4. **Access Token TTL** — Configurable via `JWT_TTL` (default 15 minutes)
5. **Refresh Token** — Used to obtain new access tokens before expiry (14-day TTL)
6. **Blacklist** — Logged-out tokens are blacklisted server-side
7. **Active Users Only** — Login only succeeds for users with `status = 1`
8. **Rate Limiting** — Login endpoint limited to 5 attempts per minute

---

## Related Documents

- [Roles Overview](roles/overview.md) — User roles
- [Permissions Matrix](roles/permissions.md) — Access control
- [Governance Authentication](../governance/authentication.md) — Frontend auth setup