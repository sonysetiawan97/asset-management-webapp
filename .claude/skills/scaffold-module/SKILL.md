---
name: scaffold-module
description: Scaffold a complete CRUD module (pages, model, routes, i18n keys) from a plain-language description for the sagara-vite-react-ts admin dashboard. Use this whenever the user asks to create a new module, generate pages, or scaffold a resource with fields — even if they don't say "skill" or "scaffold". Examples: "/sagara-vite create products with name, price, stock", "generate CRUD pages for categories module", "scaffold a new module called suppliers with code, name, phone fields".
---

You are `scaffold-module`, a scoped skill for the sagara-vite-react-ts admin dashboard. You scaffold full CRUD modules from a single command.

## What you generate

A complete module under `src/modules/<name>/`:
- `types/Model.ts` — TypeScript interfaces
- `PrivateRoutes.tsx` — lazy route definitions
- `components/FormFields.tsx` — all form inputs
- `pages/list/ListWrapper.tsx` + `ListPage.tsx` — data fetching + table
- `pages/create/CreateWrapper.tsx` + `CreatePage.tsx` — create form
- `pages/read/ReadWrapper.tsx` + `ReadPage.tsx` — detail view
- `pages/update/UpdateWrapper.tsx` + `UpdatePage.tsx` — edit form
- Route registered in `src/routes/PrivateRoutes.tsx`
- i18n placeholder keys added to `public/locales/en-US/common.json`

No trash pages by default. No service files (service layer is generic, uses `moduleName` as URL).

## Parsing the command

Accept any of these formats:
```
/cmd create <name> with: <fields>
/cmd create <name> with: <fields> (FK:<ref>)
/cmd <name> with: <fields>
```

Examples:
- `create products with: name, description, price (number), stock (number)`
- `scaffold orders with: order_number, customer (FK:customers), total (number), status`
- `create suppliers with: code, name, phone, email`

Parse the fields:
- Split on `,` (comma + space)
- Format: `name` (text), `name (number)`, `name (FK:ref)`, `name (textarea)`, `name (email)`, `name (switch)`, `name (date)`, `name (select)`, `name (file)`, `name (image)`
- Default type is `text` when no type is specified
- `status` field with type `number` or `switch` should map to `0 | 1`

The `FK:<ref>` type maps to `SelectReferenceInput` referencing `src/modules/<ref>/types/Model.ts`.

## Process

### Step 1 — Plan the types

From parsed fields, build:

**`Model`** (all fields as optional except id):
```typescript
export const moduleName = "<name>";

export interface Model {
  id: string;
  <fields without types>;
}
```

**`CreateModel`** (all fields without id):
```typescript
export interface CreateModel {
  <fields without id>;
}
```

**`ReadModel`** (all fields):
```typescript
export interface ReadModel {
  <all fields>;
}
```

**`UpdateModel`** (all fields):
```typescript
export interface UpdateModel {
  <all fields>;
}
```

For `FK` fields, use the referenced module's type name (e.g. `FK:categories` → `category_id: string` in the interface, add an import for `Model as CategoryModel` from `@modules/categories/types/Model`).

### Step 2 — Create the directory structure

```bash
mkdir -p src/modules/<name>/types
mkdir -p src/modules/<name>/components
mkdir -p src/modules/<name>/pages/list
mkdir -p src/modules/<name>/pages/create
mkdir -p src/modules/<name>/pages/read
mkdir -p src/modules/<name>/pages/update
```

### Step 3 — Write all files

Use the `Write` tool for each file. Follow these templates exactly.

#### `types/Model.ts`
```typescript
export const moduleName = "<name>";

export interface Model {
  id: string;
  <simple fields>;
}

export interface CreateModel {
  <create fields>;
}

export interface ReadModel {
  <read fields>;
}

export interface UpdateModel {
  <update fields>;
}
```

#### `PrivateRoutes.tsx`
```typescript
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
        </Route>
        <Route path="*" element={<ErrorRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default PrivateRoutes;
```

#### `components/FormFields.tsx`

Map field type to input component:
| Type | Component | Import |
|------|-----------|--------|
| text (default) | `Text` | `@components/form/inputs/Text` |
| number | `NumberInput` | `@components/form/inputs/NumberInput` |
| textarea | `TextAreaInput` | `@components/form/inputs/TextAreaInput` |
| email | `Email` | `@components/form/inputs/Email` |
| password | `Password` | `@components/form/inputs/Password` |
| switch | `Switch` | `@components/form/inputs/Switch` |
| date | `DateInput` | `@components/form/inputs/DateInput` |
| FK | `SelectReferenceInput` | `@components/form/select/SelectReferenceInput` |
| file | `SingleSelectInput` | `@components/form/fileupload/SingleSelectInput` |
| image | `SingleUploadImage` | `@components/form/fileupload/SingleUploadImage` |

```typescript
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Text } from "@components/form/inputs/Text";
// ... other imports based on field types

interface FormFieldsProps {
  readOnly?: boolean;
  // for FK fields, include: <refModule>Options?: { label: string; value: string }[];
}

export const FormFields = ({ readOnly = false }: FormFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6">
          <Text
            name="<field>"
            label={t("modules.<name>.create.form.<field>")}
            readOnly={readOnly}
          />
        </div>
        // ... other fields, pair col-md-6 for small fields, col-12 for full-width
      </div>
    </>
  );
};
```

Wrap two fields per row using `col-12 col-md-6`. Full-width fields (textarea, image, file) use `col-12`.

For FK fields, include a `SelectReferenceInput` with `name="<field>_id"`, `label`, `referenceUrl="/<ref>"`, `referenceModule="<ref>"`.

#### `pages/list/ListWrapper.tsx`
```typescript
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
      "!sort[id]": -1,
      status: 1,
    },
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "<Title>", path: `/${moduleName}` },
    ]);
  }, []);

  if (isLoading) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <List
      data={data?.data.result || []}
      count={data?.data.count || 0}
      isLoading={isLoading}
    />
  );
};

export default ListWrapper;
```

#### `pages/list/ListPage.tsx`
```typescript
import type { FC } from "react";
import { moduleName, type Model } from "../../types/Model";
import { Action } from "@/components/list/Action";
import type { ColumnConfig } from "@/types/ColumnConfig";
import { ListContainer } from "@/components/list/ListContainer";
import { usePagination } from "@hooks/list/usePagination";
import { useTranslation } from "react-i18next";

interface ListProps {
  data: Model[];
  count: number;
  isLoading: boolean;
}

export const List: FC<ListProps> = ({ data, count, isLoading }) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();
  const privilegeUrl = {
    read: "/<name>/:id",
    update: "/<name>/:id/update",
    delete: "/<name>/:id/delete"
  }

  const columns: ColumnConfig<Model>[] = [
    { title: "#", name: "id", rowClassName: "font-weight-bold" },
    { title: "<Field Title>", name: "<field>", render: (_, value) => `${value}` },
    {
      title: "Actions",
      name: "id",
      headerClassName: "header-action-list text-center",
      render: (row) => <Action id={row.id} module={moduleName} privilegeUrl={privilegeUrl} />,
    },
  ];

  return (
    <ListContainer<Model>
      title={t("modules.<name>.list.title")}
      columns={columns}
      data={data}
      isLoading={isLoading}
      count={count}
      skip={skip}
      limit={limit}
      onPageChange={setSkip}
      createUrl="/<name>/create"
    />
  );
};
```

Add one `{ title, name, render }` column for each list-worthy field (not FK fields in simple modules). Keep it minimal — id + name + actions is fine for simple modules.

#### `pages/create/CreateWrapper.tsx`
```typescript
import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type CreateModel } from "../../types/Model";
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
      { label: "<Title>", path: `/${moduleName}` },
      { label: "Create" },
    ]);
  }, []);

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.<name>.create.title")}>
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
          <title>Icon Menu</title>
          <path d="M200-200h50.46l409.46-409.46-50.46-50.46L200-250.46V-200Zm-60 60v-135.38l527.62-527.39q9.07-8.24 20.03-12.73 10.97-4.5 23-4.5t23.3 4.27q11.28 4.27 19.97 13.58l48.85 49.46q9.31 8.69 13.27 20 3.96 11.31 3.96 22.62 0 12.07-4.12 23.03-4.12 10.97-13.11 20.04L275.38-140H140Zm620.38-570.15-50.23-50.23 50.23 50.23Zm-126.13 75.9-24.79-25.67 50.46 50.46-25.67-24.79Z" />
        </svg>
      </TitleBarWithIcon>
      <CreatePage />
    </FormProvider>
  );
};

export default CreateWrapper;
```

#### `pages/create/CreatePage.tsx`
```typescript
import { moduleName, type CreateModel } from "../../types/Model";
import { useFormContext } from "react-hook-form";
import { useCreate } from "@hooks/request/useCreate";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { FormFields } from "../../components/FormFields";
import { CancelButton } from "@components/buttons/CancelButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { ResetButton } from "@components/buttons/ResetButton";

const CreatePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit } = useFormContext<CreateModel>();
  const { isLoading } = useCreate<CreateModel>(moduleName);

  const onSubmit = async (data: CreateModel) => {
    try {
      console.log("Submitting data:", data);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, {
        variant: "error",
      });
    }
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <FormFields />
      </div>

      <div className="col-12">
        <div className="d-flex gap-3">
          <CancelButton to={`/${moduleName}`} />
          <ResetButton />
          <SubmitButton isLoading={isLoading} />
        </div>
      </div>
    </form>
  );
};

export { CreatePage };
export default CreatePage;
```

#### `pages/read/ReadWrapper.tsx`
```typescript
import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type ReadModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { ReadPage } from "./ReadPage";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useFindOneById } from "@hooks/request/useFindOneById";
import NotFound from "@modules/errors/pages/404NotFound";
import { LoadingPage } from "@components/loadings/LoadingPage";

const ReadWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<ReadModel>(moduleName, id);
  const methods = useForm<ReadModel>({ mode: "onBlur" });
  const { reset } = methods;

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "<Title>", path: `/${moduleName}` },
      { label: "Read" },
    ]);
  }, []);

  if (isLoading) return <LoadingPage />;
  if (!data || error) return <NotFound />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.<name>.read.title")}>
        <svg className="d-flex" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#373737">
          <title>Icon Menu</title>
          <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
        </svg>
      </TitleBarWithIcon>
      <ReadPage />
    </FormProvider>
  );
};

export default ReadWrapper;
```

#### `pages/read/ReadPage.tsx`
```typescript
import { BackButton } from "@components/buttons/BackButton";
import { UpdateButton } from "@components/buttons/UpdateButton";
import { FormFields } from "../../components/FormFields";

const ReadPage = () => {
  return (
    <form className="row g-3">
      <div className="col-12">
        <FormFields readOnly={true} />
      </div>

      <div className="col-12">
        <div className="d-flex gap-2 mt-2">
          <BackButton />
          <UpdateButton to={"update"} />
        </div>
      </div>
    </form>
  );
};

export { ReadPage };
export default ReadPage;
```

#### `pages/update/UpdateWrapper.tsx`
```typescript
import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type ReadModel, type UpdateModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { UpdatePage } from "./UpdatePage";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useFindOneById } from "@hooks/request/useFindOneById";
import NotFound from "@modules/errors/pages/404NotFound";
import { LoadingPage } from "@components/loadings/LoadingPage";

const UpdateWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<ReadModel>(moduleName, id);
  const methods = useForm<UpdateModel>({ mode: "onBlur" });
  const { reset } = methods;

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "<Title>", path: `/${moduleName}` },
      { label: "Update" },
    ]);
  }, []);

  if (isLoading) return <LoadingPage />;
  if (!data || error) return <NotFound />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.<name>.update.title")}>
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
          <title>Icon Menu</title>
          <path d="M200-200h50.46l409.46-409.46-50.46-50.46L200-250.46V-200Zm-60 60v-135.38l527.62-527.39q9.07-8.24 20.03-12.73 10.97-4.5 23-4.5t23.3 4.27q11.28 4.27 19.97 13.58l48.85 49.46q9.31 8.69 13.27 20 3.96 11.31 3.96 22.62 0 12.07-4.12 23.03-4.12 10.97-13.11 20.04L275.38-140H140Zm620.38-570.15-50.23-50.23 50.23 50.23Zm-126.13 75.9-24.79-25.67 50.46 50.46-25.67-24.79Z" />
        </svg>
      </TitleBarWithIcon>
      <UpdatePage />
    </FormProvider>
  );
};

export default UpdateWrapper;
```

#### `pages/update/UpdatePage.tsx`
```typescript
import { moduleName, type UpdateModel } from "../../types/Model";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@components/buttons/BackButton";
import { useUpdate } from "@hooks/request/useUpdate";
import { FormFields } from "../../components/FormFields";

const UpdatePage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, getValues } = useFormContext<UpdateModel>();
  const { updateAsync, isLoading } = useUpdate<UpdateModel>();
  const navigate = useNavigate();

  const onSubmit = async (data: UpdateModel) => {
    try {
      const id = getValues("id");
      await updateAsync({ id, url: moduleName, body: data });
      enqueueSnackbar(t("modules.<name>.update.notification.success"), {
        variant: "success",
      });
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, {
        variant: "error",
      });
    }
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <FormFields />
      </div>

      <div className="col-12">
        <div className="d-flex gap-2">
          <BackButton />
          <SubmitButton isLoading={isLoading} />
        </div>
      </div>
    </form>
  );
};

export { UpdatePage };
export default UpdatePage;
```

### Step 4 — Register the route

Read `src/routes/PrivateRoutes.tsx` first, then use `Edit` to add:
1. Import the routes: `const <Name>Routes = lazy(() => import("@modules/<name>/PrivateRoutes"));`
2. Add the route: `<Route path="/<name>/*" element={<Name>Routes />} />`

Example edit:
```typescript
// Add after existing lazy imports:
const <Name>Routes = lazy(() => import("@modules/<name>/PrivateRoutes"));

// Add inside the Routes (after an existing route):
<Route path="/<name>/*" element={<Name>Routes />} />
```

### Step 5 — Add i18n keys

Read `public/locales/en-US/common.json` first. The skill generates placeholder keys — the user fills in the actual translations later.

Add under `"modules"`: `"<name>": { "list": { "title": "<Name> List" }, "create": { "title": "Create <Name>", "form": { "<field>": "<Field>" } }, "read": { "title": "<Name> Detail" }, "update": { "title": "Update <Name>", "notification": { "success": "<Name> updated successfully" } } }`

For each field, also add a form key. Example structure:
```json
"<name>": {
  "list": { "title": "Products List" },
  "create": {
    "title": "Create Product",
    "form": {
      "name": "Name",
      "price": "Price",
      "stock": "Stock"
    },
    "notification": { "success": "Product created successfully" }
  },
  "read": { "title": "Product Detail" },
  "update": {
    "title": "Update Product",
    "notification": { "success": "Product updated successfully" }
  }
}
```

Use `Edit` to insert into existing JSON without disturbing other keys.

## Rules

- **Always** use path aliases: `@/`, `@modules/`, `@hooks/`, `@components/`
- **Always** use `moduleName` as the URL segment (matches API)
- **Always** capitalize the module label in breadcrumbs and titles
- **Always** use `mode: "onBlur"` for React Hook Form
- **Always** use `useFormContext` — never prop-drill form state
- **Always** use Bootstrap grid: `col-12 col-md-6` for two per row, `col-12` for full-width
- **Always** use SVG icons from the existing templates (do not invent new ones)
- **Always** register the route before reporting success
- **Never** generate the actual i18n translation strings — use placeholder keys like `"<Field>"`
- **Never** use inline styles — use Bootstrap/custom CSS classes only
- **Never** hardcode colors — use `--color-*` tokens or Bootstrap utility classes
- **Never** add trash pages unless the user explicitly asks for them
- **Never** add `console.log` in `axiosSetup.ts` or auth setup files

## Output

After generating all files, report:
```
Generated module `<name>`:
- src/modules/<name>/types/Model.ts
- src/modules/<name>/PrivateRoutes.tsx
- src/modules/<name>/components/FormFields.tsx
- src/modules/<name>/pages/list/ListWrapper.tsx
- src/modules/<name>/pages/list/ListPage.tsx
- src/modules/<name>/pages/create/CreateWrapper.tsx
- src/modules/<name>/pages/create/CreatePage.tsx
- src/modules/<name>/pages/read/ReadWrapper.tsx
- src/modules/<name>/pages/read/ReadPage.tsx
- src/modules/<name>/pages/update/UpdateWrapper.tsx
- src/modules/<name>/pages/update/UpdatePage.tsx
- Route registered in src/routes/PrivateRoutes.tsx
- i18n keys added to public/locales/en-US/common.json

Fill in the i18n translations in public/locales/en-US/common.json and public/locales/id/common.json
```
