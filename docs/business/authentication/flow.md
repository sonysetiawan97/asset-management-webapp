# Authentication Flow

## Overview

The system uses cookie-based session authentication for the SPA frontend.

**PRD Reference:** Section 4.6.3

---

## Authentication Flow

```
┌─────────────────┐
│  User Opens    │  React SPA loads
│  Application   │
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Login Form    │  POST /api/v1/auth/login
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Validate      │  Check email + password
│  Credentials   │
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Create Session │  Set session cookie
│  + Set Cookie   │  Set SameSite=Strict cookie
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Authenticated │  Subsequent requests use cookie
│  State         │
└─────────────────┘
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/logout` | User logout |
| GET | `/api/v1/auth/me` | Get current user |
| POST | `/api/v1/auth/refresh` | Refresh token |

---

## Login Request

```json
POST /api/v1/auth/login
{
  "email": "admin@company.com",
  "password": "securepassword"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Administrator",
      "email": "admin@company.com",
      "role": "administrator",
      "department_id": null
    }
  },
  "message": "Login successful"
}
```

---

## Session Configuration

### Cookie Settings

| Setting | Value | Description |
|---------|-------|-------------|
| SameSite | Strict | Cookie not sent cross-origin |
| HttpOnly | true | Not accessible via JavaScript |
| Secure | true (production) | HTTPS only |
| Path | / | Available on all paths |
| Expires | Session | Expires when browser closes |

### CORS Configuration

```ts
// axios config
{
  withCredentials: true, // Send cookies cross-origin
  baseURL: import.meta.env.VITE_API_URL,
}
```

---

## Logout Flow

```tsx
const logout = async () => {
  await axios.post('/api/v1/auth/logout');
  // Clear local state
  localStorage.removeItem('auth_token'); // if using token storage
  window.location.href = '/login';
};
```

---

## Token Refresh

### Automatic Refresh

```tsx
// axios interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshed = await axios.post('/api/v1/auth/refresh');
      if (refreshed.status === 200) {
        // Retry original request
        return axios(error.config);
      }
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## State Management

### Auth Store (nanostores)

```tsx
// stores/authStore.ts
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

---

## Business Rules

1. **Cookie Only** - No bearer token in Authorization header
2. **SameSite Strict** - Cookie not sent cross-origin
3. **Session Timeout** - Configurable via backend session settings
4. **Rate Limiting** - Login endpoint limited to 5 attempts per minute

---

## Related Documents

- [Roles Overview](roles/overview.md) - User roles
- [Permissions Matrix](roles/permissions.md) - Access control
- [Governance Authentication](../governance/authentication.md) - Frontend auth setup