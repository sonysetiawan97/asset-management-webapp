# Header UI

The top app bar, rendered by `MasterLayout`. Lives at `src/layout/partials/header/`. Hosts the mobile sidebar toggle, the page title + breadcrumbs, and the user navbar (profile, language, logout).

---

## Components

| Component | File | Notes |
|---|---|---|
| `Header` | `src/layout/partials/header/Header.tsx` | The top bar shell — owns the mobile toggle |
| `PageHeader` | `src/layout/partials/header/PageHeader.tsx` | Page title + breadcrumbs block |
| `PageTitle` | `src/layout/partials/header/PageTitle.tsx` | The `<h1>` page title, reads from `pageHeaderStore` |
| `Breadcrumbs` | `src/layout/partials/header/Breadcrumb.tsx` | Breadcrumb trail, reads from `breadcrumbsStore` |
| `Navbar` | `src/layout/partials/header/Navbar.tsx` | Right-side action group (notifications + user) |
| `Notification` | `src/layout/partials/header/Notification.tsx` | Bell + dropdown (currently static placeholder content) |
| `UserProfile` | `src/layout/partials/header/UserProfile.tsx` | User dropdown — profile link, logout, language switcher |

---

## `Header`

The top bar shell. Rendered by `MasterLayout` and given the sidebar toggle controls.

```tsx
<Header onToggle={toggleSidebar} isActive={isSidebarOpen} />
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `onToggle` | `() => void` | Yes | Invoked when the user clicks the mobile hamburger |
| `isActive` | `boolean` | Yes | Whether the sidebar is currently open — applies the `active` class to the toggle button |

### Structure

```
<header id="kt_app_header" class="app-header" data-kt-sticky="true" …>
  <div class="app-container container-fluid d-flex align-items-stretch justify-content-between px-4 py-3">
    ├── Mobile toggle (visible below `lg` only)
    ├── Mobile logo (visible below `lg` only)
    └── <div id="kt_app_header_wrapper">
          ├── <PageHeader />  ← title + breadcrumbs
          └── <Navbar />      ← user / notifications
        </div>
  </div>
</header>
```

### Sticky Behavior

The header is sticky via the `data-kt-sticky` attributes (handled by the theme's `KTApp` init script). On scroll past the offset, it sticks to the top of the viewport. No JS-side effect is required.

### Mobile Toggle

The hamburger (`#kt_app_sidebar_mobile_toggle`) is only visible below the `lg` breakpoint. Clicking it calls `onToggle`, which flips a state in `MasterLayout` that controls the sidebar's `active` class.

---

## `PageHeader`

Wraps the page title and breadcrumbs. Used in the header (left side).

```tsx
<PageHeader />
```

Renders:

```html
<div class="page-title d-flex flex-column justify-content-center flex-wrap me-3">
  <PageTitle />
  <Breadcrumbs />
</div>
```

> `PageHeader` itself takes no props. Both children read from their own nanostore.

---

## `PageTitle`

Renders an `<h1>` whose text comes from the `pageHeaderStore` nanostore. Title is passed through `useCapitalize` for display.

```tsx
<h1 class="page-heading d-flex text-gray-900 fw-bold fs-5 …">
  {capitalizeFirstLetterWords(title)}
</h1>
```

### Setting the Title

Pages set the title by calling `setPageTitle` from `@stores/PageHeaderStore`:

```tsx
import { useEffect } from "react";
import { setPageTitle } from "@stores/PageHeaderStore";

useEffect(() => {
  setPageTitle("Assets");
}, []);
```

### Conventions

- Use a translation key for the title when the page is part of a localized module. The store accepts a plain string, so translation is the caller's responsibility.
- Titles are capitalized on render via `useCapitalize` — pass them in lowercase or sentence case and the hook will format them.
- The store is global, so always set the title in an effect (or unmount cleanup) to avoid leaking a title from a previous page.

---

## `Breadcrumbs`

Renders the breadcrumb trail from the `breadcrumbsStore` nanostore. Returns `null` when the store is empty.

```tsx
<ul class="breadcrumb breadcrumb-separatorless fs-7 my-0 pt-1">
  {breadcrumbs.map(({ label, icon, path }, index) => (
    <li class="breadcrumb-item text-muted">
      {index < last ? <Link to={path}>{icon}{label}</Link> : <span class="text-dark fw-bold">{label}</span>}
    </li>
  ))}
</ul>
```

### Setting Breadcrumbs

```tsx
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import type { BreadcrumbItem } from "@/types/Breadcrumbs";

useEffect(() => {
  setBreadcrumbs([
    { label: "Assets", path: "/assets" },
    { label: "Create", path: "/assets/create" }, // omit `path` on the last item
  ]);
}, []);
```

### `BreadcrumbItem` Shape

```ts
interface BreadcrumbItem {
  label: string;             // visible text
  path?: string;             // omitted on the last (current) item
  icon?: ReactNode;          // optional leading icon
}
```

### Conventions

- The last item is rendered as plain `<span>` (current page) and should **not** have a `path`.
- All earlier items must have a `path` so they render as `<Link>`.
- The `key` for each item is derived from `${index}-${path}` — duplicate paths on the same level will cause key collisions, so give distinct paths per level.

---

## `Navbar`

The right-side group of header actions. Currently renders only `<UserProfile />` — `Notification` is imported but commented out (see note below).

```tsx
<div class="d-flex align-items-center">
  {/* <Notification /> */}
  <UserProfile />
</div>
```

> **Why is `Notification` commented out?** It is currently a static placeholder (Lorem ipsum list items) and is not wired to any notification source. Keep the import commented until the backend notification API is available; the surrounding slot is reserved so the layout is stable.

---

## `Notification`

A bell-icon dropdown with a static list of placeholder items. Provided as a UI shell — the dropdown opens but the list contents are not driven by data.

```tsx
<button … data-bs-toggle="dropdown">
  <i class="bi bi-bell" />
</button>
<div class="dropdown-menu … card-notif">
  <Link … ><small>Lorem ipsum …</small><small>1 days ago</small></Link>
  …
</div>
```

### When to Use

**Do not** enable this component until a notification API is available. The current contents are demo data and must not be shipped to production.

To enable, uncomment both the import in `Navbar.tsx` and the `<Notification />` line, and replace the static list with a real data source.

---

## `UserProfile`

The user dropdown. Contains:

1. Greeting + username (from `useAuth`)
2. **Profile** link → `/profile`
3. **Logout** button → calls `logout` from `useAuth`
4. `LanguageButton` — i18n language switcher (see [i18n.md](./i18n.md))

```tsx
<div class="dropdown ms-3">
  <button id="dropdownUserButton" data-bs-toggle="dropdown" …>
    <i class="bi bi-person" />
    <span class="text-muted d-none d-md-block">
      {t("header.navbar.user_profile.greeting")}{user?.username}
    </span>
  </button>
  <ul class="dropdown-menu p-3">
    <li><Link to="/profile">…</Link></li>
    <li><button onClick={logout}>…</button></li>
    <li><hr /></li>
    <li><LanguageButton /></li>
  </ul>
</div>
```

### Greeting

Renders the i18n greeting key followed by `user?.username`. The username is gated behind `d-none d-md-block` so the label is hidden on small screens — only the icon remains.

### Logout

`logout` comes from the `useAuth` hook (see [authentication.md](./authentication.md)). The button uses an inline SVG icon rather than a Bootstrap icon for the logout glyph.

### LanguageButton

Mounted at the bottom of the dropdown (separated by an `<hr />`). Reuse the existing `LanguageButton` component — do not reimplement the language switcher inside `UserProfile`.

---

## Stores Overview

| Store | File | Purpose |
|---|---|---|
| `pageHeaderStore` | `src/stores/PageHeaderStore.ts` | Holds `{ title: string }` — drives `PageTitle` |
| `breadcrumbsStore` | `src/stores/BreadcrumbStore.ts` | Holds `BreadcrumbItem[]` — drives `Breadcrumbs` |

Both are `nanostores` `atom`s and are read via `useStore` from `@nanostores/react`. They are global state, so pages **must** set them in an effect (or on mount) to keep the header in sync with the current route.

### Why Nanostores for the Header?

The header sits above the React Router `Outlet` and is not in the same subtree as the current page. Lifting the title/breadcrumb state through props would require threading them through `MasterLayout` and back. A global store lets any page set the title without that wiring.

---

## Setting Header Content from a Page

Most modules follow this pattern at the top of the page component:

```tsx
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { setPageTitle } from "@stores/PageHeaderStore";

const AssetsListPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    setPageTitle(t("modules.assets.title"));
    setBreadcrumbs([
      { label: t("modules.assets.title"), path: "/assets" },
    ]);
  }, [t]);

  return …;
};
```

On unmount, the previous page's values remain in the store — this is acceptable because the next page sets them on mount. If you need a clean reset, call `setBreadcrumbs([])` and `setPageTitle("")` on unmount.

---

## Adding a New Header Action

1. Create the component under `src/layout/partials/header/`.
2. Import and mount it inside `Navbar.tsx` (or as a sibling of the wrapper, if it belongs outside the right-side group).
3. Use the same `d-flex align-items-center` container styling so spacing matches the existing actions.
4. For dropdowns, use Bootstrap's `data-bs-toggle="dropdown"` pattern with `dropdown-menu dropdown-menu-end` so the menu aligns to the right edge of the trigger.

### Checklist

- [ ] Component takes no layout props unless absolutely necessary (header state is global, not per-page)
- [ ] Translations live under `header.navbar.*`
- [ ] Dropdowns align right (`dropdown-menu-end`)
- [ ] Hidden gracefully on small screens (use `d-none d-md-block` on labels, keep icons visible)
