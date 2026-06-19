# Styling Table UI

This governs how list tables are structured, styled, and used across modules. All table styling lives in two files:

- `src/assets/style/modules.css` — module-scoped layout components
- `src/assets/style/custom.css` — the core table styling system (from [components.md](./components.md))

---

## Two Table Patterns

The project uses **two table rendering patterns** depending on module complexity:

### 1. `<TableWrapper>` (Recommended for standard list pages)

Used by CRUD modules that follow the scaffolded pattern: departments, categories, locations, etc.

```tsx
<TableWrapper
  title={t("modules.departments.list.title")}
  columns={columns}
  data={result ?? []}
  count={data?.count ?? 0}
  createUrl="/departments/create"
  isLoading={isLoading}
  deleteUrl={(id) => `/departments/${id}`}
  updateUrl={(id) => `/departments/${id}/update`}
  privilegeUrl={{ ... }}
  onRefresh={refresh}
/>
```

Under the hood this uses `ListContainer<T>` + `Table` with `ColumnConfig<T>[]`. See [components.md](./components.md) for column config details.

### 2. Custom table in `<div className="table-responsive">`

Used when a module needs non-standard rows (progress bars, badges, custom stats columns). This is the opname, transfers, disposals pattern.

```tsx
<div className="module-table-container">
  <div className="table-responsive">
    <table className="table table-hover align-middle">
      <thead>
        <tr>
          <th>Column Name</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr><td colSpan={5} className="text-center py-4">
            <div className="spinner-border text-primary" role="status" />
          </td></tr>
        ) : data.length === 0 ? (
          <tr><td colSpan={5} className="text-center py-4 text-muted">Empty</td></tr>
        ) : (
          data.map((item) => (
            <tr key={item.id}>
              <td className="fw-semibold">{item.name}</td>
              <td><StatusBadge label="Active" ... /></td>
              <td className="text-center">
                <Link to={`/module/${item.id}`} className="btn-action"><i className="bi bi-eye" /></Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>
```

---

## Layout Wrappers

### `module-list-container`

Root container for all module list pages. Provides vertical gap between child elements.

```css
.module-list-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
```

Children can include: stat bar, status filter bar, header, table/cards grid, pagination.

### `module-table-container`

Wraps the `table-responsive` block. This is a **convention**, not a defined CSS class — it provides a semantic grouping wrapper that modules use to scope animations (`animate-fade-slide-up`). Apply it around every custom table.

### `table-responsive`

Bootstrap utility that enables horizontal scrolling for narrow screens. **Always wrap** your `<table>` in this div.

---

## Base Table Styling

Tables use a **wrapper-based border system** — borders live on `.table-wrapper`, not on the `<table>` element itself.

```tsx
<div className="table-wrapper border border-secondary-subtle rounded-3">
  <table className="table table-hover mb-0">...</table>
</div>
```

If you are not using `<Table>` (which includes the wrapper automatically), add the wrapper `<div>` manually.

### CSS Rules (`custom.css`)

| Selector | Purpose |
|---|---|
| `.table-wrapper` | `border-collapse: collapse; overflow: hidden;` |
| `.table-wrapper .table thead th` | Gray bg, uppercase, 0.75rem, bold, 1.5px bottom border |
| `.table-wrapper .table tbody td` | 0.75rem padding, vertical-align middle |
| `.table-wrapper .table tbody tr` | 1px bottom border, 150ms bg transition on hover |
| `.table-wrapper .table tbody tr:last-child td` | Remove bottom border (no double line) |
| `.table-wrapper .table tbody tr:hover td` | Light gray bg `#f8f9fa` |

### Rules

1. **Do not use `::before` / `::after` on table rows** — causes layout shift on hover.
2. **Do not use `position: relative` on `<tr>`** — was used for a removed accent bar.
3. **Do not use `overflow-hidden` on the wrapper** — clips translations and animations.
4. **Border on wrapper, not `<table>`** — avoids cut border appearance on narrow screens.
5. **Use `.table-hover` only** — `.table-striped` conflicts with custom borders.

---

## Status Badge

Rendered in a table cell using the `StatusBadge` component or inline `<span className="badge rounded-pill">`.

```tsx
<StatusBadge label="Draft" bgColor="#e0e7ff" textColor="#3730f3" dotColor="#818cf8" />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Required display text. |
| `bgColor` | `string` | `#e5e7eb` | Background fill. |
| `textColor` | `string` | `#374151` | Font color. |
| `dotColor` | `string` | _(none)_ | Small colored circle dot before the label. |

When using Bootstrap's native badge, the pattern is:

```tsx
<span className="badge rounded-pill" style={{ backgroundColor: "#d1fae5", color: "#065f46" }}>Match</span>
```

---

## Action Buttons (Row Level)

Row-level icon buttons use the `btn-action` class family. They are compact circular/icon buttons styled in `modules.css`.

| Class | Purpose |
|---|---|
| `.btn-action` | Base style — circular icon, neutral bg |
| `.btn-action:hover` | Accent bg + white text |
| `.btn-action--primary` | Accent base color |
| `.btn-action--success` | Green tint |
| `.btn-action--danger` | Red tint |

```tsx
<Link to={`/module/${id}`} className="btn-action" title="View">
  <i className="bi bi-eye" />
</Link>

<button className="btn-action btn-action--success" onClick={() => handleApprove(id)}>
  <i className="bi bi-check-lg" />
</button>

<button className="btn-action btn-action--danger" onClick={() => handleReject(id)}>
  <i className="bi bi-x-lg" />
</button>
```

> **Rule:** Action buttons must be wrapped in `AuthPrivilegesChecker` when they correspond to an API route. Do not render a button for a route the user lacks privilege for — it exposes the button as a blind spot to the user.

---

## Empty and Loading States

Inside custom tables, handle these explicitly in a single `<tr>` with `colSpan`:

```tsx
{isLoading ? (
  <tr><td colSpan={5} className="text-center py-4">
    <div className="spinner-border text-primary" role="status" />
  </td></tr>
) : data.length === 0 ? (
  <tr><td colSpan={5} className="text-center py-4 text-muted">No data found</td></tr>
) : (
  // real data rows
)}
```

The `colSpan` must match the actual number of columns in the `<thead>`.

---

## Column Header Styling

When writing inline `<th>` elements in custom tables:

```tsx
<thead>
  <tr>
    <th>Name</th>
    <th className="text-end">Count</th>
    <th className="text-center">Actions</th>
  </tr>
</thead>
```

Align text to the end (right) for numeric columns, and center for action columns. All other columns default to left-aligned.

---

## Progress Indicators in Tables

Display a progress bar inline using inline styles:

```tsx
<td style={{ minWidth: "140px" }}>
  <div className="d-flex align-items-center gap-2">
    <div className="progress flex-grow-1" style={{ height: "6px", backgroundColor: "#e0e7ff" }}>
      <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: "#6366f1" }} />
    </div>
    <small className="text-muted">{count}/{total}</small>
  </div>
</td>
```

---

## When to Use Which Pattern

| Scenario | Recommended Pattern |
|---|---|
| Standard CRUD list with column config | `TableWrapper` → `ListContainer` → `Table` |
| Status filter + custom columns + inline actions | Custom `<table>` in `module-table-container` |
| Workflow / multi-step approvals | Cards grid (`.workflow-grid`) — not tables |
| Reports module with wide data | Custom `<table>` + `table-responsive` (wide content overflows horizontally) |
