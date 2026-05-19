# Stores & Contexts

## nanostores (Global State)

nanostores are lightweight reactive atoms. Components subscribe via `useStore(store)`.

### `authStores` — `src/modules/auth/stores/authStores.ts`

```ts
import { authStores, setAccessToken, clearAccessToken } from "@modules/auth/stores/authStores";

// Read
const auth = useStore(authStores);
// auth: { isAuthenticated: boolean; accessToken: string | null; refreshToken?: string }

// Write
setAccessToken("new_token");
clearAccessToken();
```

Persists `accessToken` to `localStorage` as `'accessToken'`.

### `userStores` — `src/modules/users/stores/userStores.ts`

```ts
import { userStores, setUser, clearUser } from "@modules/users/stores/userStores";

// Read
const userStore = useStore(userStores);
// userStore: { user: AuthModel; role: RolePrivilegeItem }

// Write
setUser(userData, roleData);
clearUser();
```

User + role data is stored in localStorage as `'user'` (JSON stringified).

### `BreadcrumbStore` — `src/stores/BreadcrumbStore.ts`

Controls the breadcrumb navigation trail displayed in the header.

```ts
import { breadcrumbStore, setBreadcrumbs } from "@stores/BreadcrumbStore";

// Read
const breadcrumbs = useStore(breadcrumbStore);
// breadcrumbs: { label: string; path: string }[]

// Write — call in useEffect on each page
setBreadcrumbs([
  { label: "Home", path: "/" },
  { label: "Users", path: "/users" },
  { label: "John Doe" },
]);
```

### `PageHeaderStore` — `src/stores/PageHeaderStore.ts`

Controls the page title in the header area.

```ts
import { pageHeaderStore, setPageTitle } from "@stores/PageHeaderStore";

// Read
const title = useStore(pageHeaderStore);

// Write — call in useEffect at the module route level
setPageTitle("users");  // sets "Users" in header
```

---

## React Contexts (Scoped State)

### `PaginationContext` / `PaginationProvider` — `src/contexts/PaginationProvider.tsx`

Provides pagination state across all list pages. Wraps the entire app in `PrivateRoutes.tsx`.

```ts
import { usePagination } from "@hooks/list/usePagination";

const { skip, limit, setSkip } = usePagination();

setSkip(20);  // jump to page 2 (if limit=10)
```

- `skip` — current offset (default: `0`)
- `limit` — page size (from `VITE_PAGE_LIMIT` env var, default `10`)
- `setSkip(n: number)` — update skip value

### `SearchContext` / `SearchProvider` — `src/contexts/SearchProvider.tsx`

Provides the search query string. `SearchBar` writes to it; list pages read from it.

```ts
import { useSearch } from "@hooks/list/useSearch";

const { query, setQuery } = useSearch();

setQuery("john");  // triggers re-fetch in useList
```

### `FilterContext` / `FilterProvider` — `src/contexts/FilterProvider.tsx`

Provides field-based filter state (e.g., group filter). `SearchAdvanceBar` writes to it; modules read via `useFilter()`.

```ts
import { useFilter } from "@/hooks/list/useFilter";

const { group, setGroup } = useFilter();
```

- `group` — current group filter string (default `""`)
- `setGroup(v: string)` — debounced write (500ms, via `SearchAdvanceBar`)

Reset on route change — same behavior as `SearchContext`.

### `ModalContext` / `ModalProvider` — `src/contexts/ModalProvider.tsx`

Controls modal visibility globally.

```ts
import { useModal } from "@hooks/useModal";

const { open, close, isOpen } = useModal();
```

### `SidebarParentContext` — `src/contexts/SidebarParentContext.tsx`

Tracks which collapsible sidebar menus are open/closed.

---

## Store Summary Table

| Store | Type | Scope | File |
|---|---|---|---|
| `authStores` | nanostore | Global | `src/modules/auth/stores/authStores.ts` |
| `userStores` | nanostore | Global | `src/modules/users/stores/userStores.ts` |
| `breadcrumbStore` | nanostore | Global | `src/stores/BreadcrumbStore.ts` |
| `pageHeaderStore` | nanostore | Global | `src/stores/PageHeaderStore.ts` |
| `PaginationContext` | React Context | App (PrivateRoutes) | `src/contexts/PaginationProvider.tsx` |
| `SearchContext` | React Context | App (PrivateRoutes) | `src/contexts/SearchProvider.tsx` |
| `FilterContext` | React Context | App | `src/contexts/FilterProvider.tsx` |
| `ModalContext` | React Context | App | `src/contexts/ModalProvider.tsx` |
| `SidebarParentContext` | React Context | Sidebar | `src/contexts/SidebarParentContext.tsx` |
