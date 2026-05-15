# Authentication & Authorization

## Auth Flow

```
User submits credentials
  → signinService.ts POST /auth/signin
    → returns { access_token, user, role }
      → setAccessToken(access_token)  [localStorage + authStores]
      → setUser(user, role)           [userStores]
        → isAuthenticated = true
          → AppRoutes renders PrivateRoutes
            → MasterLayout + AuthMiddleware
```

## Sign In

**Endpoint**: `POST /auth/signin`
**Request body**: `{ username: string; password: string }`
**Response**: `{ access_token: string; refresh_token: string; user: AuthModel; role: RolePrivilegeItem }`

Key files:
- `src/modules/auth/services/signinService.ts` — API call
- `src/modules/auth/pages/Signin.tsx` — sign-in form component
- `src/modules/auth/stores/authStores.ts` — `setAccessToken()`, `clearAccessToken()`
- `src/modules/users/stores/userStores.ts` — `setUser()`, `clearUser()`

## Token Storage

Two tokens stored by `signinService.ts` on login:
- `accessToken` → `localStorage.accessToken` (Bearer header for API calls)
- `refreshToken` → `localStorage.refreshToken` (fallback for refresh) + HttpOnly cookie set by backend

Auth store syncs `isAuthenticated` with `!!localStorage.getItem('accessToken')`.
On logout: `clearAccessToken()` + `clearRefreshToken()` + `clearUser()` + redirect to `/auth/signin`.

## Token Refresh

Refresh is handled **exclusively** by `axiosSetup.ts` (applied to `apiAxios`) — triggered only on **401 responses**, not on route changes.

Flow: API call → 401? → mark `_retry` flag → `refreshAccessToken()` → single POST with both `withCredentials: true` and `Authorization: Bearer <refreshToken>` → update localStorage on success, clear `accessToken` on failure → retry original request.

Key files:
- `src/utils/axiosSetup.ts` — 401 interceptor with refresh + retry logic
- `src/components/auth/AuthMiddleware.tsx` — auth check only, no refresh calls
- `src/modules/auth/stores/authStores.ts` — `setRefreshToken()`, `getRefreshToken()`, `clearRefreshToken()`

## Route Guards

### AuthMiddleware (`src/components/auth/AuthMiddleware.tsx`)

Wraps all authenticated routes. Checks:
1. `isAuthenticated` — if false, renders `<Unauthenticated />`
2. `PrivilegesValidation()` — if false, renders `<Unauthorized />`

Public paths (no privilege check): `/dashboard`, `/auth/signin`

```tsx
const isPublicPath = PUBLIC_PATHS.includes(location.pathname);
const hasAccess = PrivilegesValidation({ auth: getAuth(), path: location.pathname });

if (!isPublicPath && !hasAccess) return <Unauthorized />;
```

### AuthPrivilegesChecker (`src/components/auth/AuthPrivilegesChecker.tsx`)

Used in the sidebar to hide menu items the user doesn't have privilege to access:

```tsx
<AuthPrivilegesChecker link="/users">
  <SidebarMenuItem url="/users" title="Users" />
</AuthPrivilegesChecker>
```

Extracts `link` prop and calls `PrivilegesValidation()` to decide whether to render children.

## Privilege Model

Each role has an array of privileges:

```ts
interface PrivilegeItem {
  uri: string;    // e.g., "/users/:id", "/products/*"
  action: string;  // e.g., "read", "update", "*"
  method: string; // e.g., "GET", "POST", "*"
}
```

### Privilege Matching Rules

`src/components/auth/AuthHelpers.ts` implements three types of matching:

1. **Wildcard** — `uri: "*"` + `action: "*"` → grants all access
2. **Exact match** — privilege URI must equal the current path exactly
3. **Dynamic params** — `/:id` in privilege URI matches `/123` via regex replacement:
   ```ts
   const matchDynamicUri = (pattern, path) => {
     const regexPattern = pattern.replace(/:param/g, "([^/]+)");
     return new RegExp(`^${regexPattern}/?$`, "i").test(path);
   };
   ```

### Example Privileges

```json
[
  { "uri": "/dashboard", "action": "read", "method": "*" },
  { "uri": "/users", "action": "*", "method": "*" },
  { "uri": "/users/:id", "action": "read", "method": "*" },
  { "uri": "/users/:id/update", "action": "update", "method": "*" },
  { "uri": "/roles", "action": "*", "method": "*" },
  { "uri": "/privileges", "action": "*", "method": "*" }
]
```

## Auth Data Storage

```ts
// localStorage key: "user"
// Stored by signinService after successful login
interface AuthModel {
  id?: number;
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  role: RolePrivilegeItem;  // includes privileges[]
  status?: 0 | 1;
}

interface RolePrivilegeItem {
  id: string | number;
  name: string;
  privileges: PrivilegeItem[];
}
```

## Logout

```ts
// src/modules/auth/services/logoutService.ts
export const logout = () => {
  clearAccessToken();  // clears authStores + localStorage
  clearUser();         // clears userStores
};
```

Called by `useAuth().logout()` which redirects to `/auth/signin`.

## Auth Stores

| Store | File | Purpose |
|---|---|---|
| `authStores` | `src/modules/auth/stores/authStores.ts` | `accessToken`, `isAuthenticated` |
| `userStores` | `src/modules/users/stores/userStores.ts` | `user`, `role` |
