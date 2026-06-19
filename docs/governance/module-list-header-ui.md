# Module List Header UI

This governs the common list page header structure and styling used across modules. All styles live in `src/assets/style/modules.css`.

---

## Root Container

Every module list page wraps its entire content in `.module-list-container`. This is a flex column with vertical gap between all child sections.

```tsx
<div className="module-list-container">
  {/* ... children: stat bar, filter bar, header, table/cards, pagination ... */}
</div>
```

```css
.module-list-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
```

There is **no padding or border** on the container — it is purely a layout spine. Each child section handles its own styling.

---

## Header Bar

The header bar is a single-element component: `.module-list-header` containing a `.module-list-title` on the left and a `Create` button on the right.

### Structure

```tsx
<div className="module-list-header">
  <div className="module-list-title">
    <i className="bi bi-box-seam fs-4" style={{ color: "#1a1a2e" }}></i>
    <h2>{t("modules.assets.title")}</h2>
  </div>
  <AuthPrivilegesChecker link={`/${moduleName}`} method="POST">
    <Link to={`/${moduleName}/create`} className="btn-create">
      <i className="bi bi-plus-lg me-1"></i>
      {t("modules.assets.title")}
    </Link>
  </AuthPrivilegesChecker>
</div>
```

### CSS

```css
.module-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}
```

Two-row variant: when the header needs to stack below a stat bar or filter bar, the structure is identical — it sits as the next child inside `.module-list-container`. The stat bar (when present) goes **first**, then the header.

### Layout Order (modules with stat bar)

```
.module-list-container
├── .module-stat-bar          ← status counts / summary stats
├── .status-filter-bar        ← optional: status chip filter
├── .module-list-header       ← title + create button
└── .module-table-container   ← or cards grid / reports table
```

### Layout Order (modules without stat bar)

```
.module-list-container
├── .status-filter-bar        ← optional
├── .module-list-header       ← title + create button
└── .module-table-container
```

---

## Title

### `.module-list-title`

```css
.module-list-title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
```

Contains exactly two children:

1. A Bootstrap icon element (`<i className="bi bi-... fs-4">`) — sized at `fs-4`, color always set inline via `style={{ color: "#1a1a2e" }}` (matching `--color-text-primary`).
2. An `<h2>` element.

### `.module-list-title h2`

```css
.module-list-title h2 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0;
}
```

The `<h2>` must be a direct child of `.module-list-title`. The icon is always the first child, the `<h2>` always second. This ordering matters for the gap spacing.

---

## Create Button

### `.btn-create`

Primary button for navigating to the create page. Always placed inside `.module-list-header` on the right side.

```tsx
<AuthPrivilegesChecker link={`/${moduleName}`} method="POST">
  <Link to={`/${moduleName}/create`} className="btn-create">
    <i className="bi bi-plus-lg"></i>
    {t("modules.assets.title")}
  </Link>
</AuthPrivilegesChecker>
```

```css
.btn-create {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 8px;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-create:hover {
  background: var(--color-primary-hover);
  color: var(--color-text-inverse);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```

The button is always wrapped in `AuthPrivilegesChecker` so it is only shown when the user has the create privilege. The `link` is the base module path (e.g. `/departments`) and `method` is `POST`.

### `.btn-create-empty`

Secondary variant used when there is **no table** — typically used inside the table body to invite creation of the first record. Differentiated by using `--color-accent` instead of `--color-primary`, with larger padding (`--space-3` × `--space-5`).

```css
.btn-create-empty {
  display: inline-flex;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: var(--color-accent);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 8px;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.btn-create-empty:hover {
  background: var(--color-accent-hover);
  color: var(--color-text-inverse);
  transform: translateY(-1px);
  box-shadow: var(--shadow-accent);
}
```

---

## Stat Bar

When a module wants to show aggregate counts above the header (opname, transfers, checkout, maintenance), it uses the stat bar.

### Structure

```tsx
<div className="module-stat-bar">
  <div className="stat-item">
    <span className="stat-value">{totalCount}</span>
    <span className="stat-label">{t("total")}</span>
  </div>
  {statuses.map(s => (
    <div className="stat-item" key={s.value}>
      <span className="stat-value" style={{ color: s.dot }}>{s.count}</span>
      <span className="stat-label">{s.label}</span>
    </div>
  ))}
</div>
```

### CSS

```css
.module-stat-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  animation: fadeSlideUp 400ms both;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  border: 1px solid var(--color-border);
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg);
  border-radius: 12px;
  border-left: 3px solid var(--color-accent);
  animation: fadeSlideUp 500ms both;
}

.stat-item:nth-child(1) { animation-delay: 50ms; }
.stat-item:nth-child(2) { animation-delay: 100ms; }
.stat-item:nth-child(3) { animation-delay: 150ms; }
.stat-item:nth-child(4) { animation-delay: 200ms; }

.stat-value {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

### Layout behavior

- The stat bar is a CSS Grid with `auto-fit` + `minmax(140px, 1fr)` — each stat card flows into the next row when the row narrows.
- Items have staggered entrance animations (`fadeSlideUp`) with sequential delays: 50ms, 100ms, 150ms, 200ms.
- The first left border (`border-left: 3px solid var(--color-accent)`) applies to **all** stat items, not just the first. Per-status color accents should be handled inline when needed.

### When to use

- Modules with workflow statuses (opname, transfers, checkout, maintenance) — show total + per-status counts.
- **Do not** use for simple CRUD modules (departments, categories, locations) — the header alone is sufficient.

---

## Pagination Footer

At the bottom of a list page, pagination is rendered inside `.module-pagination`.

```tsx
<div className="module-pagination">
  <button className="btn-pagination" onClick={() => setSkip(skip - limit)} disabled={skip === 0}>
    {t("pagination.prev")}
  </button>
  <span className="pagination-info">{skip + 1}–{Math.min(skip + limit, count)} / {count}</span>
  <button className="btn-pagination" onClick={() => setSkip(skip + limit)} disabled={skip + limit >= count}>
    {t("pagination.next")}
  </button>
</div>
```

```css
.module-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-4) 0;
}

.btn-pagination {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-pagination:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}

.btn-pagination:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-info {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
```

### When to use

- **Custom tables** (opname, disposals) — build the pagination inline as shown above.
- **Standard TableWrapper** — uses the shared `Pagination` component from `@components/list/Pagination` which is styled separately.

### Disabled state

Disabled buttons should show `opacity: 0.4` and `cursor: not-allowed`. The disabled check is `skip === 0` for Prev and `skip + limit >= count` for Next.

---

## Template: Module List Page

Full page structure for a module with stat bar:

```tsx
import { moduleName } from "../../types/Model";

const List: FC<ListProps> = ({ ... }) => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useBreadcrumbSetter("/assets");

  return (
    <div className="module-list-container">
      {/* Stat Bar (if status counts needed) */}
      {showStats && (
        <div className="module-stat-bar">...</div>
      )}

      {/* Header */}
      <div className="module-list-header">
        <div className="module-list-title">
          <i className="bi bi-box-seam fs-4" style={{ color: "#1a1a2e" }} />
          <h2>{t("modules.assets.list.title")}</h2>
        </div>
        <AuthPrivilegesChecker link={`/${moduleName}`} method="POST">
          <Link to={`/${moduleName}/create`} className="btn-create">
            <i className="bi bi-plus-lg" />
            {t("modules.assets.list.btn_create")}
          </Link>
        </AuthPrivilegesChecker>
      </div>

      {/* Filter bar (optional, separate governance doc) */}
      {/* <div className="status-filter-bar">...</div> */}

      {/* Table / Cards */}
      <div className="module-table-container">...</div>
    </div>
  );
};
```

Template without stat bar (standard CRUD module):

```tsx
<div className="module-list-container">
  <div className="module-list-header">...</div>
  <div className="module-table-container animate-fade-slide-up">
    <div className="table-responsive">
      <table className="table table-hover ...">...</table>
    </div>
  </div>
</div>
```

---

## Adding a New Module Header

1. Wrap everything in `<div className="module-list-container">`.
2. Add a `.module-list-header` as the first visible child (after stat bar if present).
3. Inside the header, put `.module-list-title` with icon + `<h2>`, then the create button with `.btn-create`.
4. Wrap the create button in `AuthPrivilegesChecker` with the base module path and `method="POST"`.
5. Choose `.btn-create` (header action) or `.btn-create-empty` (empty-state invitation).
6. If you need status counts, add `.module-stat-bar` before the header with `.stat-item` children.

### Checklist

- [ ] Icon is a Bootstrap icon (`bi bi-*`) at size `fs-4`
- [ ] `<h2>` text comes from `useTranslation()` key
- [ ] Icon color uses inline `style={{ color: "#1a1a2e" }}` (matches `--color-text-primary`)
- [ ] Create button wrapped in `AuthPrivilegesChecker`
- [ ] Stat items have staggered animation delays (50ms increments)
- [ ] Page title set via `setBreadcrumbs` in a `useEffect`
- [ ] `.module-table-container` uses `animate-fade-slide-up` on standard list pages
