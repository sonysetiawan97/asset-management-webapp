# Components

All components are in `src/components/`. Path alias: `@components/` resolves to `src/components/`.

---

## Layout

### `MasterLayout` (`src/layout/MasterLayout.tsx`)
The full app shell. Renders:
- `<Header>` — top navigation bar with toggle button for sidebar
- `<Sidebar>` — navigation sidebar (collapsible on mobile)
- `<Outlet>` — the current page content inside `.app-container`

```tsx
<MasterLayout>
  <Outlet />  {/* page content renders here */}
</MasterLayout>
```

### `AuthLayout` (`src/layout/AuthLayout.tsx`)
Split-screen layout for auth pages:
- Left (40%): `<Outlet />` — renders the form (Signin, Register)
- Right (60%): illustration + app tagline (hidden on mobile)

---

## Form Inputs (`src/components/form/inputs/`)

All form inputs follow the same pattern:
- Accept `name` (form field key), `label`, `readOnly?`, `required?`
- Are **controlled components** — wired to `react-hook-form` via `control` prop
- Use `useFormContext()` internally to access the form context

### Text Inputs

| Component | File | Notes |
|---|---|---|
| `Text` | `Text.tsx` | Single-line text |
| `Email` | `Email.tsx` | Email input |
| `Password` | `Password.tsx` | Password (dots characters) |
| `TextAreaInput` | `TextAreaInput.tsx` | Multi-line textarea |

### Number Inputs

| Component | File | Notes |
|---|---|---|
| `NumberInput` | `NumberInput.tsx` | Numeric input with optional `min`/`max` |
| `IdentityNumberInput` | `IdentityNumberInput.tsx` | ID/NIC number formatting |
| `PhoneNumberInput` | `PhoneNumberInput.tsx` | Phone number with country prefix |
| `InputTaxpayer` | `TaxpayerInput.tsx` | Taxpayer identification number |

### Date & Time Inputs

| Component | File | Notes |
|---|---|---|
| `DateInput` | `DateInput.tsx` | Date picker |
| `MonthYearInput` | `MonthYearInput.tsx` | Combined month + year picker |
| `TimeInput` | `TimeInput.tsx` | Time picker (HH:MM) |
| `MonthSelect` | `MonthSelect.tsx` | Month dropdown |
| `YearSelect` | `YearSelect.tsx` | Year dropdown |

### Toggle / Selection Inputs

| Component | File | Notes |
|---|---|---|
| `Switch` | `Switch.tsx` | Toggle switch with `leftLabel`/`rightLabel` |
| `RadioInput<T, K>` | `RadioInput.tsx` | Generic radio group |
| `CheckBoxInput<T, K>` | `CheckBoxInput.tsx` | Generic checkbox group (array value) |

### Select Inputs (`src/components/form/select/`)

| Component | File | Notes |
|---|---|---|
| `SingleSelectInput` | `SingleSelectInput.tsx` | Single-option dropdown |
| `MultipleSelectInput` | `MultipleSelectInput.tsx` | Multi-select with chips |

Select inputs take a `loadOptions` prop — a function that returns `SelectOption[]` (async or sync).

```tsx
const options = useRoleOptions(); // or useSysparamOptions({ groupName: "..." })

<MultipleSelectInput
  control={control}
  name="hobbies"
  label="Hobbies"
  loadOptions={options}
/>
```

### File Upload (`src/components/form/fileupload/`)

| Component | File | Notes |
|---|---|---|
| `SingleUploadImage` | `SingleUploadImage.tsx` | Single image upload |
| `MultipleUploadImage` | `MultipleUploadImage.tsx` | Multiple images |
| `SingleSelectInput` | `SingleSelectInput.tsx` | Single file (PDF, etc.) |
| `MultipleUploadFile` | `MultipleUploadFile.tsx` | Multiple files |

All file upload components accept:

```tsx
<SingleUploadImage
  name="profile_picture"
  label="Profile Picture"
  readOnly={false}
  bucket="single"                    // S3/storage bucket name
  path="sagara"                       // storage path
  fileSizeAllowed={2}                // max MB
  fileTypeAllowed="image/jpeg,image/png,image/webp"
  fieldInfo="Allowed: jpeg/png/webp, Max 2MB"
  required={true}
/>
```

---

## List Components (`src/components/list/`)

### `ListContainer<T>` (`src/components/list/ListContainer.tsx`)

Generic list page wrapper. Accepts:
```tsx
<ListContainer<Model>
  title="Users"                              // page title
  columns={columns}                           // ColumnConfig[]
  data={data}                                // Model[]
  isLoading={isLoading}
  count={count}                               // total records
  skip={skip}                                // current offset
  limit={limit}                              // page size
  onPageChange={setSkip}                     // pagination handler
  createUrl="/users/create"                   // (optional) create button link
/>
```

### `Table` (`src/components/list/Table.tsx`)

Renders a `<table>` with column definitions. Accepts `ColumnConfig<T>[]`.

### Column Config

```ts
interface ColumnConfig<T> {
  title: string;          // header label
  name: keyof T;          // property name to render
  render?: (row: T, value: any) => ReactNode;  // custom cell renderer
  rowClassName?: string;  // class applied to <td>
  headerClassName?: string; // class applied to <th>
}
```

Example:
```tsx
const columns: ColumnConfig<Model>[] = [
  { title: "#", name: "id", rowClassName: "font-weight-bold" },
  {
    title: "Name",
    name: "name",
    render: (row, value) => <strong>{value}</strong>,
  },
  {
    title: "Actions",
    name: "id",
    render: (row) => <Action id={String(row.id)} module={moduleName} privilegeUrl={privilegeUrl} />,
  },
];
```

### `Action` (`src/components/list/Action.tsx`)

Row-level action buttons (Read, Edit, Delete). Automatically checks privileges via `privilegeUrl`:

```tsx
const privilegeUrl = {
  read: "/examples/:id",
  update: "/examples/:id/update",
  delete: "/examples/:id/delete",
};

<Action id={String(id)} module={moduleName} privilegeUrl={privilegeUrl} />
```

Each button only renders if the user has the corresponding privilege.

### `ActionBar` (`src/components/list/ActionBar.tsx`)

Container for the "Create" button above the table. Uses `createUrl` to render a `<CreateButton>`.

### `Title` (`src/components/list/Title.tsx`)

Card header with page title.

### `Pagination` (`src/components/list/Pagination.tsx`)

Page controls. Uses `PaginationContext` (skip/limit).

### `SearchBar` (`src/components/list/SearchBar.tsx`)

Search input that sets `query` in `SearchContext`. List pages call `useSearch()` to read it.

---

## Title Bar (`src/components/TitleBarWithIcon.tsx`)

Card header with page title and optional icon. Used in all Create/Read/Update Wrapper pages.

```tsx
<TitleBarWithIcon title={t("modules.examples.create.title")}>
  <SomeIcon />
</TitleBarWithIcon>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | Yes | Page title text |
| `children` | `ReactNode` | No | Optional icon rendered after title |

---

## Buttons (`src/components/buttons/`)

All buttons use Bootstrap 5 button classes (`btn btn-dark`, etc.).

| Component | File | Notes |
|---|---|---|
| `CreateButton` | `CreateButton.tsx` | Link to `/<module>/create` |
| `BackButton` | `BackButton.tsx` | Navigates back (history -1) |
| `UpdateButton` | `UpdateButton.tsx` | Navigates to `/:id/update` |
| `DeleteButton` | `DeleteButton.tsx` | Opens delete confirmation modal |
| `SubmitButton` | `SubmitButton.tsx` | Form submit with loading state |
| `CancelButton` | `CancelButton.tsx` | Link back to list (`/${module}`) |

---

## Loading States (`src/components/loadings/`)

| Component | File | Notes |
|---|---|---|
| `LoadingPage` | `LoadingPage.tsx` | Full-page centered spinner |
| `LoadingAuthPage` | `LoadingAuthPage.tsx` | Auth page spinner |
| `LoadingSpinner` | `LoadingSpinner.tsx` | Inline spinner, accepts `color` prop |

---

## Menu / Sidebar (`src/components/menu/`)

| Component | File | Notes |
|---|---|---|
| `SidebarMenuItem` | `SidebarMenuItem.tsx` | Single nav link with icon |
| `SidebarParentMenu` | `SidebarParentMenu.tsx` | Collapsible nav group (trash menu) |
| `SidebarMenuTitle` | `SidebarMenuTitle.tsx` | Section divider label |
| `SidebarMenuItem` | `SidebarMenuItem.tsx` | Icon wrapper for menu items |

### Sidebar Usage

```tsx
// Simple menu item (wrapped with privilege check)
<AuthPrivilegesChecker link="/dashboard">
  <SidebarMenuItem url="/dashboard" title="Dashboard" icon={<DashboardIcon />} />
</AuthPrivilegesChecker>

// Collapsible parent menu
<SidebarParentMenu url="/" title="Trash" icon={<TrashIcon />} collapseTargetId="collapseTrash" links={["/users/trash"]}>
  <div className="collapse" id="collapseTrash">
    <SidebarMenuItem url="users/trash" title="Users Trash" />
  </div>
</SidebarParentMenu>
```

---

## Auth Components (`src/components/auth/`)

| Component | File | Notes |
|---|---|---|
| `AuthMiddleware` | `AuthMiddleware.tsx` | Route guard (auth + privilege check) |
| `AuthPrivilegesChecker` | `AuthPrivilegesChecker.tsx` | Conditionally renders children based on privilege |
| `AuthChecker` | `AuthChecker.tsx` | Redirects to `/dashboard` if already signed in |

See [authentication.md](./authentication.md) for full details.

---

## Error Components (`src/components/errors/`)

| Component | File | Notes |
|---|---|---|
| `EmptyData` | `EmptyData.tsx` | Empty state illustration (shown in table when no data) |

Error pages (404, Unauthenticated, Unauthorized) are in `src/modules/errors/pages/`.
