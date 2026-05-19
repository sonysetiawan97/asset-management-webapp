# Creating a New Module

This guide walks through adding a complete CRUD module. Use the **`examples`** module (`src/modules/examples/`) as the reference implementation — it demonstrates every pattern.

## Step-by-Step

### 1. Create the Module Directory

```
src/modules/<name>/
├── PrivateRoutes.tsx
├── types/
│   └── Model.ts
├── components/
│   └── FormFields.tsx
└── pages/
    ├── list/
    │   ├── ListWrapper.tsx
    │   └── ListPage.tsx
    ├── create/
    │   ├── CreateWrapper.tsx
    │   └── CreatePage.tsx
    ├── read/
    │   ├── ReadWrapper.tsx
    │   └── ReadPage.tsx
    └── update/
        ├── UpdateWrapper.tsx
        └── UpdatePage.tsx
```

### 2. Define Types (`types/Model.ts`)

```ts
import { SelectOption } from "@/types/SelectOption";

export const moduleName = "examples";  // MUST match API URL segment

export interface Model {
  id?: string;
  name: string;
  nik: string;
  status: 0 | 1;
  // ... other fields
}

export interface CreateModel { /* same fields, id optional */ }
export interface ReadModel { /* minimal fields for table */ }
export interface UpdateModel { id: string; /* same as CreateModel */ }
export interface DetailModel { /* fields with SelectOption types for dropdowns */ }
```

### 3. Create Module Routes (`PrivateRoutes.tsx`)

```tsx
import { lazy, Suspense, useEffect, type FC } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { LoadingPage } from "@components/loadings/LoadingPage";
import { setPageTitle } from "@stores/PageHeaderStore";
import { moduleName } from "./types/Model";

const ErrorRoutes = lazy(() => import("@modules/errors/ErrorRoutes"));
const ListWrapper = lazy(() => import("./pages/list/ListWrapper"));
const CreateWrapper = lazy(() => import("./pages/create/CreateWrapper"));
const ReadWrapper = lazy(() => import("./pages/read/ReadWrapper"));
const UpdateWrapper = lazy(() => import("./pages/update/UpdateWrapper"));

const PrivateRoutes: FC = () => {
  useEffect(() => {
    setPageTitle(moduleName);
  }, []);

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route element={<Outlet />}>
          <Route index element={<ListWrapper />} />
          <Route path="/create" index element={<CreateWrapper />} />
          <Route path="/:id" index element={<ReadWrapper />} />
          <Route path="/:id/update" index element={<UpdateWrapper />} />
          {/* Add /trash route here if needed */}
        </Route>
        <Route path="*" element={<ErrorRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default PrivateRoutes;
```

### 4. Create List Page

**`pages/list/ListWrapper.tsx`** — fetches data and sets breadcrumbs:

```tsx
import { useEffect, type FC } from "react";
import { List } from "./ListPage";
import { useList } from "@hooks/list/useList";
import { type Model, moduleName } from "../../types/Model";
import { useSearch } from "@hooks/list/useSearch";
import { LoadingPage } from "@/components/loadings/LoadingPage";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";

export const ListWrapper: FC = () => {
  const { skip, limit } = usePagination();
  const { query } = useSearch();
  const { data, isLoading, error } = useList<Model>({
    module: moduleName,
    skip,
    limit,
    params: {
      "!search": query,
      status: "1",
      "!sort[id]": -1,
    },
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Examples", path: `/${moduleName}` },
    ]);
  }, []);

  if (error) return <div className="text-center py-5 text-danger">Error: {error.message}</div>;

  return (
    <List
      data={data?.data.result || []}
      count={data?.data.count || 0}
      isLoading={isLoading}
    />
  );
};
```

**Note:** Do NOT add `if (isLoading) return <LoadingPage />` — this blocks the full page on every search/pagination. The `isLoading` state passes through to `Table`, which shows an inline spinner.

#### Adding Field Filters

If the module passes `showFilter` to `ListContainer`, integrate the filter into `useList` params:

```tsx
import { useFilter } from "@hooks/list/useFilter";

export const ListWrapper: FC = () => {
  const { skip, limit } = usePagination();
  const { query } = useSearch();
  const { group } = useFilter();  // ← read filter from context

  const { data, isLoading, error } = useList<Model>({
    module: moduleName,
    skip,
    limit,
    params: {
      "!search": query,
      status: 1,
      "!sort[id]": -1,
      ...(group ? { group } : {}),  // ← only add when filter has value
    },
  });
  // ...
};
```

**`pages/list/ListPage.tsx`** — renders the table:

```tsx
export const List: FC<ListProps> = ({ data, count, isLoading }) => {
  const { skip, limit, setSkip } = usePagination();
  const privilegeUrl = {
    read: `/${moduleName}/:id`,
    update: `/${moduleName}/:id/update`,
    delete: `/${moduleName}/:id/delete`,
  };

  const columns: ColumnConfig<Model>[] = [
    { title: "#", name: "id", rowClassName: "font-weight-bold" },
    { title: "Name", name: "name" },
    {
      title: "Actions",
      name: "id",
      render: (row) => (
        <Action id={String(row.id)} module={moduleName} privilegeUrl={privilegeUrl} />
      ),
    },
  ];

  return (
    <ListContainer<Model>
      columns={columns}
      data={data}
      isLoading={isLoading}
      count={count}
      skip={skip}
      limit={limit}
      onPageChange={setSkip}
      createUrl={`/${moduleName}/create`}
    />
  );
};
```

### 5. Create Form Fields (`components/FormFields.tsx`)

```tsx
import { Text } from "@components/form/inputs/Text";
import { NumberInput } from "@components/form/inputs/NumberInput";
import { Switch } from "@components/form/inputs/Switch";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface FormFieldsProps {
  readOnly?: boolean;
}

export const FormFields = ({ readOnly = false }: FormFieldsProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <>
      <Text name="name" label={t("modules.examples.form.name")} readOnly={readOnly} required />
      <NumberInput name="age" label={t("modules.examples.form.age")} readOnly={readOnly} min={0} max={100} required />
    </>
  );
};
```

### 6. Create Create Page

**`pages/create/CreateWrapper.tsx`**:

```tsx
import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type CreateModel } from "./../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { CreatePage } from "./CreatePage";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { useTranslation } from "react-i18next";

const CreateWrapper: FC = () => {
  const methods = useForm<CreateModel>({ mode: "onBlur" });
  const { t } = useTranslation();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Examples", path: `/${moduleName}` },
      { label: "Create" },
    ]);
  }, []);

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.examples.create.title")}>
        {/* icon */}
      </TitleBarWithIcon>
      <CreatePage />
    </FormProvider>
  );
};
```

**`pages/create/CreatePage.tsx`**:

```tsx
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { FormFields } from "../../components/FormFields";
import { CancelButton } from "@components/buttons/CancelButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useCreate } from "@hooks/request/useCreate";
import { moduleName, type CreateModel } from "../../types/Model";

const CreatePage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, reset } = useFormContext<CreateModel>();
  const { createAsync, isLoading } = useCreate<CreateModel>(moduleName);
  const navigate = useNavigate();

  const onSubmit = async (data: CreateModel) => {
    try {
      await createAsync({ url: moduleName, body: data });
      enqueueSnackbar(t("modules.examples.create.notification.success"), { variant: "success" });
      reset();
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <FormFields />
      </div>
      <div className="col-12">
        <div className="d-flex gap-2">
          <CancelButton to={`/${moduleName}`} />
          <SubmitButton isLoading={isLoading} />
        </div>
      </div>
    </form>
  );
};
```

### 7. Add to Top-Level Routes

In `src/routes/PrivateRoutes.tsx`:

```tsx
import { lazy } from "react";
const NameRoutes = lazy(() => import("@modules/<name>/PrivateRoutes"));

// Add route:
<Route path="/<name>/*" element={<NameRoutes />} />
```

### 8. Add Sidebar Menu Item

In `src/layout/partials/sidebar/Sidebar.tsx`:

```tsx
<AuthPrivilegesChecker link="/<name>">
  <SidebarMenuItem url="/<name>" title={t("sidebar.<section>.menu.<name>")} icon={<Icon />} />
</AuthPrivilegesChecker>
```

### 9. Add Backend Privileges

Create a role (or update an existing one) with privilege records:

```json
[
  { "uri": "/<name>", "action": "*", "method": "*" },
  { "uri": "/<name>/:id", "action": "read", "method": "*" },
  { "uri": "/<name>/:id/update", "action": "update", "method": "*" }
]
```

### 10. Add Translations

Add translation keys to locale files (e.g., `src/locales/en/`):

```json
{
  "modules": {
    "<name>": {
      "list": { "title": "Examples" },
      "create": { "title": "Create Example", "notification": { "success": "Created successfully" } },
      "read": { "title": "Example Detail" },
      "update": { "title": "Edit Example", "notification": { "success": "Updated successfully" } },
      "form": { "name": "Name", "age": "Age" }
    }
  },
  "sidebar": {
    "<section>": { "menu": { "<name>": "Examples" } }
  }
}
```

## Adding Trash Routes

Only add trash if the backend supports soft-delete. For modules that have trash:

1. Create `pages/trash/ListTrashWrapper.tsx` + `ListTrashPage.tsx` (similar to list but fetches `status: "0"`)
2. Add `<Route path="/trash" index element={<TrashWrapper />} />` to `PrivateRoutes.tsx`
3. Add sidebar link in `Sidebar.tsx` under `SidebarParentMenu` with `collapseTargetId`
4. Add privilege records for `/<name>/trash`
5. Use `useRestore` hook to restore a record from trash (PATCH `status: 1` via `restore` service)
