# Create UI

This governs the structure and styling of Create pages (and Update pages, which follow the same convention). All Create pages live at `src/modules/<module>/pages/create/CreateWrapper.tsx` and `CreatePage.tsx`.

---

## Page Hierarchy

Create pages sit inside the layout-level `app-content` container — they do **not** own that container. It is provided by `MasterLayout`.

```html
<!-- MasterLayout.tsx (do not modify) -->
<div id="kt_app_root" class="app-root">
  <Header />
  <div id="kt_app_wrapper" class="app-wrapper">
    <Sidebar />
    <div id="kt_app_main" class="app-main">
      <div id="kt_app_content" class="app-content flex-column-fluid py-4">
        <div id="kt_app_content_container" class="app-container container-fluid px-4">
          <LoadingInline />
          <Outlet />  ← Create page renders here
        </div>
      </div>
    </div>
  </div>
</div>
```

The page itself does **not** start with `app-content`. The page just renders its content; `MasterLayout` wraps it.

---

## File Structure

Every module has two files for Create:

```
src/modules/<module>/pages/create/
├── CreateWrapper.tsx   ← owns form context, breadcrumbs, title bar, mounts <CreatePage>
└── CreatePage.tsx      ← presentational form: <form> + FormFields + action buttons
```

This split is intentional — `CreateWrapper` holds hooks and state, `CreatePage` is purely presentational and gets everything via `useFormContext()`.

---

## CreateWrapper

```tsx
import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type CreateModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";

const CreateWrapper: FC = () => {
  const methods = useForm<CreateModel>({ mode: "onBlur" });
  const { t } = useTranslation();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Assets", path: `/${moduleName}` },
      { label: "Create" },
    ]);
  }, []);

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.assets.create.title")}>
        <i className="bi bi-box-seam"></i>
      </TitleBarWithIcon>
      <CreatePage />
    </FormProvider>
  );
};

export default CreateWrapper;
```

### Wrapper Responsibilities

1. Create the form context via `useForm({ mode: "onBlur" })`.
2. Wrap children in `<FormProvider {...methods}>`.
3. Set breadcrumbs in a `useEffect` (Home → Module → Create).
4. Render `<TitleBarWithIcon>` with module-appropriate icon.
5. Mount the presentational `<CreatePage>`.

The wrapper does **not**:
- Define the submit handler (lives in `CreatePage`).
- Render any form fields.
- Render any action buttons.

---

## CreatePage

```tsx
const CreatePage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, setValue, reset } = useFormContext<CreateModel>();
  const { createAsync, isLoading } = useCreate<CreateModel>(moduleName);
  const navigate = useNavigate();

  const onSubmit = async (data: CreateModel) => {
    try {
      await createAsync({ url: moduleName, body: data });
      enqueueSnackbar(t("modules.assets.create.notification.success"), { variant: "success" });
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
        <FormFields
          categoryLoadOptions={categoryLoadOptions}
          locationLoadOptions={locationLoadOptions}
          ...
        />
      </div>
      <div className="col-12">
        <div className="d-flex gap-3">
          <CancelButton to={`/${moduleName}`} />
          <ResetButton />
          <AuthPrivilegesChecker link={`/${moduleName}`} method="POST">
            <SubmitButton isLoading={isLoading} />
          </AuthPrivilegesChecker>
        </div>
      </div>
    </form>
  );
};
```

### Page Responsibilities

1. Consume `useFormContext()` to access form state (no `useForm` here).
2. Define `onSubmit` and call `useCreate<Model>(moduleName)`.
3. Render `<form className="row g-3">` with the FormFields and action row.
4. On success: snackbar → `reset()` → `navigate(/${moduleName})`.
5. On error: snackbar with error message; do not reset.

### Form Wrapper Classes

- `row` — Bootstrap row, lays out sections side by side at md+ breakpoints.
- `g-3` — Bootstrap gutter spacing (`--bs-gutter * 1`).
- `<div className="col-12">` — full-width column. Form sections live inside these.

---

## Title Bar

```tsx
<TitleBarWithIcon title={t("modules.assets.create.title")}>
  <i className="bi bi-box-seam"></i>
</TitleBarWithIcon>
```

```tsx
const TitleBarWithIcon: FC<TitleBarWithIconProps> = ({ children, title }) => {
  return (
    <h6 className="d-flex align-items-center gap-2 justify-content-start mb-4">
      {children}
      <div className="title">{title}</div>
    </h6>
  );
};
```

### Conventions

| Element | Convention |
|---|---|
| Icon | Bootstrap icon (`bi bi-*`) at default size |
| Title text | Translation key under `modules.<module>.create.title` |
| Margin | `mb-4` — gives a 1.5rem gap before the form |
| Layout | Flex row, icon first, title second |

### Module Icons

| Module | Icon |
|---|---|
| Assets | `bi bi-box-seam` |
| Departments | `bi bi-diagram-3` |
| Categories | `bi bi-tags` |
| Locations | `bi bi-geo-alt` |
| Users | `bi bi-people` |
| Roles | `bi bi-person-badge` |
| Privileges | `bi bi-shield-lock` |
| Checkouts | `bi bi-send` |
| Transfers | `bi bi-arrow-left-right` |
| Maintenance | `bi bi-wrench` |
| Reports | `bi bi-file-text` |
| Opname | `bi bi-clipboard-check` |
| Sysparams | `bi bi-gear-wide-connected` |

Update pages should use `bi bi-pencil` instead.

---

## Form Sections

Long forms are broken into logical sections using `.form-section` cards.

```tsx
<div className="form-section mb-4">
  <h6 className="form-section__title">{t("modules.assets.create.form.section.identity")}</h6>
  <div className="row">
    <div className="col-12 col-md-8">
      <Text name="name" label="..." required />
    </div>
    <div className="col-12 col-md-4">
      <TextInput name="serial_number" label="..." />
    </div>
  </div>
</div>
```

### CSS

```css
.form-section {
  padding: var(--space-5);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  margin-bottom: var(--space-4);
}

.form-section__title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px dashed var(--color-border);
}
```

### Section Anatomy

| Part | Required | Purpose |
|---|---|---|
| `form-section` | Yes | Card-style container: white bg, 1px border, 12px radius, padded |
| `form-section__title` | Optional | UPPERCASE label with dashed bottom border — skip for implicit/notes sections |
| `row` | Yes | Bootstrap row for the inputs |
| `col-12 col-md-*` | Yes | Column sizing — typically 4, 6, or 8 out of 12 |

### Column Sizing Guide

- **`col-12 col-md-4`** — narrow field (date, number, single select)
- **`col-12 col-md-6`** — medium field (text input, double date range)
- **`col-12 col-md-8`** — wide field (name, description)
- **`col-12`** — full width (textarea, large notes)

Always include `col-12` for mobile stacking.

---

## Action Buttons

Always at the bottom of the form, wrapped in `d-flex gap-3` for spacing.

```tsx
<div className="col-12">
  <div className="d-flex gap-3">
    <CancelButton to={`/${moduleName}`} />
    <ResetButton />
    <AuthPrivilegesChecker link={`/${moduleName}`} method="POST">
      <SubmitButton isLoading={isLoading} />
    </AuthPrivilegesChecker>
  </div>
</div>
```

### Button Order (left → right)

1. **CancelButton** — secondary action, navigates back to list (or specified `to` prop)
2. **ResetButton** — clears form values (optional; skip if the form has cascading defaults that would be awkward to reset)
3. **SubmitButton** — primary action, must be wrapped in `AuthPrivilegesChecker`

### Button Components

| Component | Style | Purpose |
|---|---|---|
| `CancelButton` | `btn btn-secondary` (gray surface) | Navigate to `to` prop (default: list page) |
| `ResetButton` | `btn btn-outline` (transparent w/ border) | Resets form via `useFormContext().reset()` |
| `SubmitButton` | `btn btn-dark` (uses `--color-primary`) | Submits the form, accepts `isLoading` to disable + show spinner |
| `BackButton` | `btn btn-outline` | List → detail page back navigation (used in Read pages) |
| `UpdateButton` | — | Navigates to `/:id/update` |

### Button CSS Classes

Defined in `style.css`:

```css
.btn-secondary {
  background: var(--color-surface-alt);
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}
.btn-secondary:hover {
  background: var(--color-border);
  border-color: var(--color-border-strong);
  color: var(--color-text-primary);
}

.btn-outline {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}
.btn-outline:hover {
  background: var(--color-surface);
  border-color: var(--color-border-strong);
  color: var(--color-text-primary);
}
```

`btn-dark` (used by `SubmitButton`) uses `--color-primary`:

```css
.btn-dark {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
}
.btn-dark:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
}
```

---

## FormFields Component

For complex modules (assets, transfers, maintenance), form fields are extracted into a separate `FormFields.tsx` component co-located with the module.

```tsx
// src/modules/assets/components/FormFields.tsx
export const FormFields = ({ ... }: FormFieldsProps) => {
  const { control, setValue } = useFormContext();
  // ...

  return (
    <>
      <div className="form-section mb-4">
        <h6 className="form-section__title">{t("modules.assets.create.form.section.identity")}</h6>
        ...
      </div>
      <div className="form-section mb-4">
        <h6 className="form-section__title">{t("modules.assets.create.form.section.classification")}</h6>
        ...
      </div>
      ...
    </>
  );
};
```

### When to Extract FormFields

Extract when:
- The Create and Update forms share most fields.
- The form has 10+ fields across multiple logical sections.
- The form needs complex option loaders (`useCategoryOptions`, etc.).

Keep inline in `CreatePage` when:
- The form has fewer than ~5 fields.
- The Create/Update forms diverge significantly.
- It is a single-section form.

### Sharing between Create and Update

The same `FormFields` component should accept a `readOnly` prop so the Update page can render it with all fields disabled, and an option for `departmentReadOnly` (or similar contextual read-onlys) that don't change per-page.

---

## Submit Handler Pattern

```tsx
const onSubmit = async (data: CreateModel) => {
  try {
    await createAsync({ url: moduleName, body: data });
    enqueueSnackbar(t("modules.assets.create.notification.success"), { variant: "success" });
    reset();
    navigate(`/${moduleName}`);
  } catch (error: unknown) {
    const { message } = error as AxiosError;
    enqueueSnackbar(message, { variant: "error" });
  }
};
```

### Conventions

- **Success path**: show success snackbar → `reset()` → `navigate()` to list.
- **Error path**: show error snackbar with API message → **do not** reset, **do not** navigate. User fixes the input and re-submits.
- Use `useCreate<Model>(moduleName)` from `@hooks/request/useCreate` for the POST.
- The `isLoading` from `useCreate` drives the `SubmitButton`'s disabled state.

---

## Update Page Mirror

Update pages follow the same structure:

```
src/modules/<module>/pages/update/
├── UpdateWrapper.tsx   ← fetches by id via useFindOneById, resets form on data, renders TitleBarWithIcon + UpdatePage
└── UpdatePage.tsx      ← same as CreatePage, but uses useUpdate and shows update notifications
```

`UpdateWrapper` adds:

```tsx
const { id } = useParams<{ id: string }>();
const { data, error, isLoading } = useFindOneById<ReadModel>(moduleName, id);
const methods = useForm<UpdateModel>({ mode: "onBlur" });
const { reset } = methods;

useEffect(() => {
  if (data) reset(data);
}, [data, reset]);

if (isLoading) return <ContentLoader />;
if (!data || error) return <NotFound />;
```

- 404 handled in wrapper, not page.
- Form is reset with the fetched data so inputs are populated.
- Title icon is `bi bi-pencil`.

---

## Adding a New Create Page

1. Create `CreateWrapper.tsx` and `CreatePage.tsx` under `src/modules/<module>/pages/create/`.
2. CreateWrapper: `useForm({ mode: "onBlur" })` → `FormProvider` → `TitleBarWithIcon` → `<CreatePage />`.
3. Set breadcrumbs: `Home` → `<Module>` → `Create`.
4. CreatePage: render `<form className="row g-3" onSubmit={handleSubmit(onSubmit)}>`.
5. Compose form sections using `.form-section` cards.
6. Action row: CancelButton + ResetButton (optional) + SubmitButton (wrapped in AuthPrivilegesChecker).
7. Submit handler: success → snackbar + reset + navigate; error → snackbar.

### Checklist

- [ ] Wrapper splits: state in `CreateWrapper`, presentational in `CreatePage`
- [ ] `useForm({ mode: "onBlur" })` only in wrapper
- [ ] Breadcrumbs set in `useEffect`
- [ ] Title uses i18n key under `modules.<module>.create.title`
- [ ] Module-appropriate icon (see table above)
- [ ] All sections wrapped in `.form-section mb-4` with `.form-section__title` for labelled sections
- [ ] Columns use Bootstrap grid: `col-12 col-md-{4|6|8}`
- [ ] SubmitButton wrapped in `AuthPrivilegesChecker`
- [ ] Success path: snackbar → reset → navigate
- [ ] Error path: snackbar only