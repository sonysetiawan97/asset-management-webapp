# Sidebar UI

The sidebar is the primary navigation surface of the authenticated app. It is rendered by `MasterLayout` and lives at `src/layout/partials/sidebar/`.

---

## Components

| Component | File | Notes |
|---|---|---|
| `Sidebar` | `src/layout/partials/sidebar/Sidebar.tsx` | The full sidebar shell — logo + menu list |
| `SidebarMenuItem` | `src/components/menu/SidebarMenuItem.tsx` | Single nav link with icon |
| `SidebarMenuTitle` | `src/components/menu/SidebarMenuTitle.tsx` | Section divider label (privilege-gated) |
| `SidebarParentMenu` | `src/components/menu/SidebarParentMenu.tsx` | Collapsible nav group |
| `SideBarMenuIcon` | `src/components/menu/SideBarMenuIcon.tsx` | Icon wrapper for menu items |

---

## `Sidebar`

The main shell. Renders the app logo and a vertically scrollable list of `SidebarMenuTitle` / `SidebarMenuItem` entries grouped by feature area.

```tsx
<Sidebar ref={sidebarRef} isActive={isSidebarOpen} />
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `isActive` | `boolean` | Yes | Whether the sidebar is in its "open" state (driven by the parent layout) |
| `ref` | `Ref<HTMLDivElement>` | No | Forwarded to the outer wrapper, used by `MasterLayout` to detect outside clicks |

### Structure

```
<div class="app-sidebar d-flex flex-column [active]">
  ├── <div class="app-sidebar-logo">…logo…</div>
  └── <div class="list-group list-group-flush overflow-auto">
        ├── <SidebarMenuTitle>Assets Management</SidebarMenuTitle>
        ├── <SidebarMenuItem … />
        ├── <SidebarMenuTitle>Master Data</SidebarMenuTitle>
        ├── <SidebarMenuItem … />
        └── …
      </div>
</div>
```

- `app-sidebar` — base style (width, background, border)
- `active` — toggled class for the mobile drawer-open state
- `list-group list-group-flush overflow-auto` — the menu list scrolls independently when it overflows

### Menu Composition Pattern

Menus are composed in the source file directly — there is no registry or config array. New entries are added as siblings:

```tsx
<SidebarMenuTitle title={t("sidebar.master_data.title")} />
<AuthPrivilegesChecker link="/departments">
  <SidebarMenuItem
    url="/departments"
    title={t("sidebar.master_data.menu.departments")}
    icon={<i className="bi bi-diagram-3" />}
  />
</AuthPrivilegesChecker>
```

> **Why hardcoded instead of a config-driven list?** The sidebar is small, fully typed, and changes infrequently. A static tree is easier to scan, gives editor support per item, and avoids the indirection of mapping a config to components.

### Section Groups (current)

| Group | Items |
|---|---|
| **Assets Management** | Dashboard, Assets, Checkouts, Transfers, Maintenance, Report, Opname, Scan |
| **Master Data** | Departments, Categories, Locations |
| **User Management** | Users, Privileges, Roles |
| **System** | Sysparams |

### Mobile Behavior

On viewports below `lg`, the sidebar becomes an off-canvas drawer. `Header` renders a hamburger (`#kt_app_sidebar_mobile_toggle`) that flips the `isActive` prop in `MasterLayout`. The `active` class on the sidebar shifts it into view; clicking the backdrop (or a menu link) closes it.

---

## `SidebarMenuItem`

Single nav link. Wraps content in a React Router `<NavLink>` so active-link styling is automatic.

```tsx
<SidebarMenuItem
  url="/assets"
  title="Assets"
  icon={<i className="bi bi-box-seam" />}
/>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | Yes | Path for the link. Resolved against `parentUrl` (if any). |
| `title` | `string` | Yes | Visible label. Usually a `t("sidebar.*")` key. |
| `icon` | `ReactNode` | No | Leading icon — typically a Bootstrap icon `<i className="bi bi-…" />`. |
| `parentUrl` | `string` | No | Override the parent path. If omitted, inherits from `SidebarParentContext`. |

### URL Resolution

The final link URL is built by joining `parentUrl` + `url` (or just `url` when there is no parent). This lets a child `SidebarMenuItem` work under any parent group without hardcoding the prefix.

```ts
const fullUrl = baseUrl
  ? `${baseUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`
  : url;
```

### Active State

Uses `NavLink`'s render-prop API:

```tsx
className={({ isActive }) =>
  isActive ? "list-group-item active" : "list-group-item"
}
```

The `end` prop is set so `/assets` does not match `/assets/:id` — child routes inherit the highlight via the parent's context, not via prefix match.

---

## `SidebarMenuTitle`

A non-clickable section label. When given a `links` array, the title only renders if the user has at least one of the listed privileges.

```tsx
<SidebarMenuTitle title="Master Data" links={["/departments", "/categories", "/locations"]} />
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | Yes | Section label text. |
| `links` | `string[]` | No | If provided, the title is hidden when the user has no privilege for any of these paths. |

### Behavior

- **Without `links`** — always renders.
- **With `links`** — calls `PrivilegesValidation` for each path; if none pass, the title (and any sibling items the title was meant to group) is hidden.

> This is what produces "empty group" protection: hide the `Master Data` heading when the user has no access to any of its items, so the user never sees a label with zero children.

---

## `SidebarParentMenu`

Collapsible parent that groups child `SidebarMenuItem`s under a shared URL prefix. Also privilege-gated via the same `links` array pattern.

```tsx
<SidebarParentMenu
  url="/users"
  title="Users"
  icon={<i className="bi bi-people" />}
  collapseTargetId="collapseUsers"
  links={["/users", "/users/trash"]}
>
  <div className="collapse" id="collapseUsers">
    <SidebarMenuItem url="trash" title="Users Trash" />
  </div>
</SidebarParentMenu>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | Yes | The parent path. Pushed into `SidebarParentContext` for children. |
| `title` | `string` | Yes | Visible label. |
| `icon` | `ReactNode` | No | Leading icon. |
| `collapseTargetId` | `string` | No | When set, the parent becomes a Bootstrap `collapse` toggle targeting this id. |
| `links` | `string[]` | No | If provided, hidden when the user has none of the listed privileges. |
| `children` | `ReactNode` | No | Child menu items — typically inside a `<div className="collapse" id={…}>`. |

### Context Provider

`SidebarParentMenu` wraps its children in `SidebarParentContext.Provider value={url}`. Any descendant `SidebarMenuItem` resolves its `fullUrl` against that `url` automatically. This is why children pass a relative `url` like `"trash"` and end up at `/users/trash`.

---

## `SideBarMenuIcon`

Thin icon wrapper used by both `SidebarMenuItem` and `SidebarParentMenu`. Centralizes the icon slot so icon styling (size, color, spacing) is consistent. Always render icons as Bootstrap icons (`bi bi-*`) to match the rest of the sidebar.

---

## Styling Notes

- The sidebar uses Bootstrap's `list-group` with `list-group-flush` (no outer border, items share dividers).
- The active item gets `list-group-item active` from `NavLink`. No custom CSS class is needed.
- Section titles use the `sidebar-section-title` class — defined in `custom.css` for uppercase, smaller font, and muted color.
- Width and the active slide-in animation are controlled by the `app-sidebar` / `app-sidebar.active` rules in `style.css`.
- The inner scroll container is `overflow-auto`; the sidebar itself never grows past the viewport.

---

## Adding a New Menu Item

1. Add a translation key under `sidebar.<group>.menu.<name>` in the i18n files.
2. If it belongs to an existing group, append a `SidebarMenuItem` under that group's `SidebarMenuTitle`. Wrap it in `AuthPrivilegesChecker` with the route.
3. If it is a new group, add a `SidebarMenuTitle` with the group's `links` array, then the items.
4. If the item has children (a sub-page like Trash), use `SidebarParentMenu` + a Bootstrap `collapse` wrapper.

### Checklist

- [ ] Translation key added (id + en at minimum)
- [ ] Route registered in `routes.tsx`
- [ ] Privilege defined in the backend (so `AuthPrivilegesChecker` has something to check)
- [ ] Icon chosen from Bootstrap Icons (`bi bi-*`)
- [ ] Item appears in the correct group
- [ ] Tested with a user that does **not** have the privilege (item must be hidden)
