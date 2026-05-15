# Routing

## Route Hierarchy

```
AppRoutes (src/routes/AppRoutes.tsx)
├── AuthRoutes (unauthenticated) → AuthLayout → /auth/signin, /auth/register
└── PrivateRoutes (authenticated) → MasterLayout → /dashboard, /users/*, etc.
```

## AppRoutes (Top-Level Router)

`src/routes/AppRoutes.tsx` is the root router. It makes a single decision:

```tsx
const { isAuthenticated } = useAuth();

!isAuthenticated
  ? <Navigate to="/auth/signin" /> + <Route path="/auth/*" element={<AuthRoutes />} />
  : <Navigate to="/dashboard" /> + <Route path="/*" element={<PrivateRoutes />} />
```

All route splitting is based on `isAuthenticated` from `useAuth()`.

## Lazy Loading

All route-level components are lazy-loaded with `React.lazy()` + `Suspense`:

```tsx
const Dashboard = lazy(() => import("@modules/dashboard/dashboard"));
const UserRoutes = lazy(() => import("@modules/users/PrivateRoutes"));
```

The fallback is `<LoadingPage />` or `<LoadingAuthPage />`.

## Authenticated Routes (`PrivateRoutes.tsx`)

`src/routes/PrivateRoutes.tsx` wraps all authenticated routes with:

- `<PaginationProvider>` — provides pagination state across the app
- `<SearchProvider>` — provides search query state
- `<AuthMiddleware>` — route guard (auth check + privilege validation)
- `<MasterLayout>` — sidebar + header layout

```tsx
<Routes>
  <Route path="auth/*" element={<Navigate to="/dashboard" />} />
  <Route element={<MasterLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/users/*" element={<UserRoutes />} />
    <Route path="/products/*" element={<ProductRoutes />} />
    <Route path="/examples/*" element={<ExampleRoutes />} />
    <Route path="/privileges/*" element={<PrivilegeRoutes />} />
    <Route path="/roles/*" element={<RoleRoutes />} />
    <Route path="/trash/*" element={<TrashRoutes />} />
    <Route path="/profile/*" element={<ProfileRoutes />} />
    <Route path="/sysparams/*" element={<SysparamRoutes />} />
    <Route path="*" element={<ErrorRoutes />} />
  </Route>
</Routes>
```

## Module-Level Routes

Each feature module has its own `PrivateRoutes.tsx` with this standard route pattern:

| Route | Component | Purpose |
|---|---|---|
| `/` (index) | `ListWrapper` | List all records (paginated) |
| `/create` | `CreateWrapper` | Create new record |
| `/:id` | `ReadWrapper` | View record detail |
| `/:id/update` | `UpdateWrapper` | Edit record |
| `/trash` | `TrashWrapper` | View soft-deleted records |

### Example: `src/modules/privileges/PrivateRoutes.tsx`

```tsx
const PrivateRoutes: FC = () => {
  useEffect(() => { setPageTitle(moduleName); }, []);

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route element={<Outlet />}>
          <Route index element={<ListWrapper />} />
          <Route path="/create" index element={<CreateWrapper />} />
          <Route path="/:id" index element={<ReadWrapper />} />
          <Route path="/:id/update" index element={<UpdateWrapper />} />
          <Route path="/trash" index element={<TrashWrapper />} />
        </Route>
        <Route path="*" element={<ErrorRoutes />} />
      </Routes>
    </Suspense>
  );
};
```

## Trash Routes

Only these modules have `/trash` routes:
- `/users/trash`
- `/roles/trash`
- `/privileges/trash`
- `/sysparams/trash`

## Auth Routes (`src/modules/auth/PrivateRoutes.tsx`)

```tsx
<Routes>
  <Route element={<AuthLayout />}>
    <Route path="Signin" element={<Signin />} />
    <Route path="register" element={<Register />} />
    <Route index element={<Signin />} />
  </Route>
  <Route path="*" element={<ErrorRoutes />} />
</Routes>
```

Note: The signin route uses `path="Signin"` (capital S). All other routes use lowercase.

## Error Routes

Error routes are lazy-loaded in every route group:

```tsx
const ErrorRoutes = lazy(() => import("@modules/errors/ErrorRoutes"));
// Routes:
//   /404        → 404NotFound
//   /unauthenticated → Unauthenticated
//   /unauthorized    → Unauthorized
```

## Sidebar Navigation

`src/layout/partials/sidebar/Sidebar.tsx` contains all navigation items. Menu items are wrapped with `<AuthPrivilegesChecker link="...">` to hide items the user doesn't have permission to access.

See [authentication.md](./authentication.md) for the privilege system.
