# Hooks

## Auth

### `useAuth()` — `src/hooks/useAuth.ts`

Returns auth state and user data from nanostores, plus the `logout` function.

```ts
const { isAuthenticated, accessToken, user, role, logout } = useAuth();
```

- `isAuthenticated` — `boolean`, derived from `!!localStorage.getItem('accessToken')`
- `accessToken` — raw token string (may be `null`)
- `user` — `AuthModel` object (username, email, first_name, last_name, etc.)
- `role` — `RolePrivilegeItem` (role name + privileges array)
- `logout()` — clears stores + localStorage, redirects to `/auth/signin`

---

## List Hooks (`src/hooks/list/`)

### `useList<T>()` — `src/hooks/list/useList.ts`

Fetches a paginated list using React Query + `findAll` service.

```ts
const { data, isLoading, error } = useList<Model>({
  module: moduleName,       // API URL segment (e.g., "users")
  skip = 0,                 // pagination offset
  limit = VITE_PAGE_LIMIT,  // page size (default from env)
  params,                   // extra query params (search, sort, filters)
});

// data shape: { data: { result: T[], count: number } }
```

Usage in a list page:

```tsx
const { skip, limit } = usePagination();
const { query } = useSearch();

const { data, isLoading } = useList<Model>({
  module: moduleName,
  skip,
  limit,
  params: {
    "!search": query,
    status: "1",
    "!sort[id]": -1,
  },
});
```

### `usePagination()` — `src/hooks/list/usePagination.ts`

Reads pagination state from `PaginationContext`.

```ts
const { skip, limit, setSkip } = usePagination();
```

- `skip` — current offset (number)
- `limit` — page size (number, from `VITE_PAGE_LIMIT` env var)
- `setSkip(newSkip: number)` — updates the context

### `useSearch()` — `src/hooks/list/useSearch.ts`

Reads the search query from `SearchContext`.

```ts
const { query, setQuery } = useSearch();
```

`SearchBar` component writes to this context; list pages read from it.

### `useFilter()` — `src/hooks/list/useFilter.ts`

Reads the field-based filter query from `FilterContext`.

```ts
const { group, setGroup } = useFilter();
```

`FilterContext` is provided globally via `FilterProvider` in `App.tsx`. It resets on route change (same behavior as `SearchContext`).

Currently used by `SearchAdvanceBar` for the "Group" filter field. When adding new filter fields, extend `FilterContext` + `FilterProvider` and use the same pattern.

---

## Request / CRUD Hooks (`src/hooks/request/`)

All CRUD hooks follow the same pattern: accept a URL + payload, call the corresponding service, and return `{ asyncFn, isLoading }`.

### `useCreate<T>()` — `src/hooks/request/useCreate.ts`

```ts
const { createAsync, isLoading } = useCreate<CreateModel>(moduleName);

await createAsync({ url: moduleName, body: payload });
```

### `useUpdate<T>()` — `src/hooks/request/useUpdate.ts`

```ts
const { updateAsync, isLoading } = useUpdate<UpdateModel>(moduleName);

await updateAsync({ url: `${moduleName}/${id}`, body: payload });
```

### `usePartialUpdate<T>()` — `src/hooks/request/usePartialUpdate.ts`

```ts
const { partialUpdateAsync, isLoading } = usePartialUpdate<T>(moduleName);

await partialUpdateAsync({ url: `${moduleName}/${id}`, body: { status: 0 } });
```

### `useSoftDelete<T>()` — `src/hooks/request/useSoftDelete.ts`

Sets `status: 0` via PATCH.

```ts
const { softDeleteAsync, isLoading } = useSoftDelete<T>(moduleName);

await softDeleteAsync({ url: `${moduleName}/${id}` });
```

### `useHardDelete<T>()` — `src/hooks/request/useHardDelete.ts`

Permanent DELETE.

```ts
const { hardDeleteAsync, isLoading } = useHardDelete<T>(moduleName);

await hardDeleteAsync({ url: `${moduleName}/${id}` });
```

### `useRestore<T>()` — `src/hooks/request/useRestore.ts`

Restores a soft-deleted record (sets `status: 1` via PATCH). Used on trash list pages.

```ts
const { restoreAsync, isLoading } = useRestore<T>(moduleName);

await restoreAsync({ url: `${moduleName}/${id}` });
```

### `useFindOneById<T>()` — `src/hooks/request/useFindOneById.ts`

```ts
const { data, isLoading } = useFindOneById<T>(queryKey, `${moduleName}/${id}`);
```

### `useFindAll<T>()` — `src/hooks/request/useFindAll.ts`

Alternative to `useList` with a custom query key.

```ts
const { data, isLoading } = useFindAll<T>(
  queryKey,         // string, used as React Query key
  url,              // API endpoint
  params?           // optional query params
);
```

---

## Other Hooks

### `useModal()` — `src/hooks/useModal.ts`

Controls modal open/close state from `ModalContext`.

```ts
const { open, close, isOpen } = useModal();

open();   // sets isOpen = true
close();  // sets isOpen = false
```

### `useFileUpload()` — `src/hooks/useFileUpload.ts`

Handles file upload via `uploadAxiosSetup`.

### `useFileDownload()` — `src/hooks/useFileDownload.ts`

Handles file download (triggers browser download of file from server).

### `useCapitalize()` — `src/hooks/useCapitalize.ts`

Utility hook to capitalize strings.

---

## Hook Pattern: Always Use Wrappers

For list pages, **don't call `useList` directly in page components** — always go through the module's `ListWrapper`. See [modules.md](./modules.md) for the standard pattern.
