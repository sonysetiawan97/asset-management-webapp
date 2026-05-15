# Services (API Layer)

All generic CRUD services live in `src/services/`. They are used by the request hooks in `src/hooks/request/`.

## Axios Instances

| Instance | File | Auth | Use Case |
|---|---|---|---|
| `apiAxios` | `src/utils/apiAxios.ts` | Bearer token (auto) + 401 refresh | All authenticated API calls, file uploads |
| `publicAxios` | `src/utils/publicAxios.ts` | None (withCredentials) | Public API endpoints |
| `authAxios` | `src/utils/authAxios.ts` | None | Auth API (signin only) |

`apiAxios` automatically injects the Bearer token + handles 401 refresh via `axiosSetup`. Other instances do not refresh tokens.

---

## Generic CRUD Services

### `findAll<T>(url, params?)` — `src/services/findAll.ts`

```ts
const response = await findAll<Model>("users", {
  "!skip": 0,
  "!limit": 10,
  "!search": "john",
  "!sort[id]": -1,
});
// Returns: { data: { result: Model[], count: number } }
```

Uses `apiAxios.get()` with a custom `paramsSerializer` (encodes params as `key=value&...`).

### `findOneById<T>(url, id)` — `src/services/findOneById.ts`

```ts
const user = await findOneById<User>("users", "123");
// GET /users/123
// Returns: T
```

### `create<T>(url, body)` — `src/services/create.ts`

```ts
const newUser = await create<User>("users", payload);
// POST /users
// Returns: T
```

### `update<T>(url, id, body)` — `src/services/update.ts`

```ts
const updated = await update<User>("users", "123", payload);
// PUT /users/123
// Returns: T
```

### `partialUpdate<T>(url, id, body)` — `src/services/partialUpdate.ts`

```ts
const patched = await partialUpdate<User>("users", "123", { status: 0 });
// PATCH /users/123 { status: 0 }
// Returns: T
```

### `softDelete<T>(url, id)` — `src/services/softDelete.ts`

Sets `status: 0` (soft delete / move to trash).

```ts
await softDelete<User>("users", "123");
// PATCH /users/123 { status: 0 }
```

### `hardDelete<T>(url, id)` — `src/services/hardDelete.ts`

Permanent deletion.

```ts
await hardDelete<User>("users", "123");
// DELETE /users/123
```

### `restore<T>(url, id)` — `src/services/restore.ts`

Restores a soft-deleted record (sets `status: 1`).

```ts
await restore<User>("users", "123");
// PATCH /users/123/restore { status: 1 }
```

---

## Auth Services

### `signin(request)` — `src/modules/auth/services/signinService.ts`

```ts
import { signin } from "@modules/auth/services/signinService";

const response = await signin({ username, password });
// POST /auth/signin
// Response: { access_token: string; user: AuthModel; role: RolePrivilegeItem }
// Side effect: calls setAccessToken() + setUser()
```

### `logout()` — `src/modules/auth/services/logoutService.ts`

```ts
import { logout } from "@modules/auth/services/logoutService";

logout();
// Clears localStorage + authStores + userStores
// Does NOT redirect — caller should redirect
```

---

## URL Conventions

- Module name = API URL segment (e.g., `"users"`, `"roles"`, `"privileges"`)
- `moduleName` in each module's `types/Model.ts` must match the API endpoint
- All service calls use `moduleName` as the base URL

## Param Naming Conventions

These prefixes are recognized by the backend:

| Prefix | Meaning |
|---|---|
| `!skip` | Pagination offset |
| `!limit` | Page size |
| `!search` | Full-text search |
| `!sort[field]` | Sort by field (asc: `1`, desc: `-1`) |
| `!sort[id]` `-1` | Sort by id descending |
