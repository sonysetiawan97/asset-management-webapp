# Filter Data List UI

This governs how data is filtered inside list pages — both status chip filters and in-page list filters (e.g. opname count page). All filter styling lives in `src/assets/style/modules.css`.

---

## Overview

There are **two filter patterns** in use:

1. **Status chip bar** — a horizontal row of toggleable status chips above the list (used by opname, disposals, transfers, checkouts, etc.).
2. **In-page segmented filter** — a small toggle group on a card header (used by opname count page: `pending` / `counted` / `all`).

Text-based search and field-based filters are handled by the global `SearchContext` / `FilterContext` (see [components.md](./components.md)) and are out of scope for this document.

---

## Status Chip Filter Bar

The dominant pattern for status-based filtering across list pages. All modules that have multiple statuses use this same structure.

```tsx
<div className="status-filter-bar">
  <span className="status-filter-bar__label">{t("modules.opname.list.filter_by_status")}</span>
  <div className="status-filter-bar__chips">
    <button
      className={`status-chip ${selectedStatus === null ? "active" : ""}`}
      onClick={() => onStatusChange(null)}
    >
      <span className="status-chip__label">{t("modules.opname.list.filter_all")}</span>
      <span className="status-chip__count">{allCount}</span>
    </button>
    {statusStats.map((s) => {
      const color = getStatusColor(s.value);
      return (
        <button
          key={s.value}
          className={`status-chip ${selectedStatus === s.value ? "active" : ""}`}
          data-status={s.value}
          onClick={() => onStatusChange(s.value)}
        >
          <span className="status-chip__dot" style={{ background: color.dot }} />
          <span className="status-chip__label">{t(s.label)}</span>
          <span className="status-chip__count">{s.count}</span>
        </button>
      );
    })}
  </div>
</div>
```

### CSS Structure

```css
.status-filter-bar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow-x: auto;          /* horizontal scroll on narrow screens */
  -webkit-overflow-scrolling: touch;
}

.status-filter-bar__label {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-filter-bar__chips {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 5px 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.status-chip:hover { border-color: var(--color-accent); background: var(--color-accent-subtle); }
.status-chip.active { border-color: var(--color-accent); background: var(--color-accent-subtle); }
.status-chip__dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.status-chip__label {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-primary);
}
.status-chip__count {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text-muted);
  background: var(--color-surface-alt);
  padding: 1px 6px;
  border-radius: 10px;
}
```

### Anatomy

| Element | Required | Purpose |
|---|---|---|
| `status-filter-bar` | Yes | Outer container. Provides bg, border, padding, horizontal scroll. |
| `status-filter-bar__label` | Optional | The "Filter by status" caption. Use uppercase muted text. |
| `status-filter-bar__chips` | Yes | Flex row of chips. |
| `status-chip` | Yes | The toggle button. `active` modifier = selected. |
| `status-chip__dot` | Optional | 8px colored dot — color comes from the status's `dot` color. |
| `status-chip__label` | Yes | Status display name (use i18n key). |
| `status-chip__count` | Optional | Numeric badge inside chip — typically the count for that status. |

### Color Source

The dot color comes from the module's status model. Example from opname:

```ts
export const STATUS_COLORS = {
  draft:           { dot: "#94a3b8", bg: "#e0e7ff", text: "#3730f3" },
  in_progress:     { dot: "#3b82f6", bg: "#dbeafe", text: "#1e40af" },
  pending_approval:{ dot: "#f59e0b", bg: "#fef3c7", text: "#92400e" },
  approved:        { dot: "#10b981", bg: "#d1fae5", text: "#065f46" },
  closed:          { dot: "#6b7280", bg: "#f3f4f6", text: "#1f2937" },
};
```

The dot is passed inline: `<span className="status-chip__dot" style={{ background: color.dot }} />`.

---

## Filter State Pattern

The chip bar is **purely UI** — it doesn't own state. The page's `ListWrapper` owns the state and passes the selected value down.

### Wrapper Owns State

```tsx
// ListWrapper.tsx
const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

const params = {
  "!search": query,
  "!sort[id]": -1,
  ...(selectedStatus && { status: selectedStatus }),  // omit when null
};

const { data, isLoading, error } = useList<OpnameSession>({ ...params });
```

### Page Receives State + Handler

```tsx
// ListPage.tsx
interface ListProps {
  ...
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}
```

The page is a presentational component — it just renders chips and forwards clicks.

### Reset to First Page

When the user changes the status, reset to the first page (otherwise pagination state becomes inconsistent):

```tsx
onStatusChange={(status) => { setSelectedStatus(status); setSkip(0); }}
```

---

## Preserving Unfiltered Counts

When filtering, the chip counts (e.g. "Draft: 5, In Progress: 12") must reflect the **unfiltered** dataset, not the currently filtered data. Otherwise clicking a chip with `count: 0` would hide it after one click.

Pattern from opname `ListWrapper`:

```tsx
const [unfilteredCounts, setUnfilteredCounts] = useState<{
  count: number;
  countByStatus: Record<string, number>;
} | null>(null);

useEffect(() => {
  if (!selectedStatus && data?.data) {
    setUnfilteredCounts({
      count: data.data.count,
      countByStatus: data.data.count_by_status || {},
    });
  }
}, [selectedStatus, data?.data.count, data?.data.count_by_status]);
```

When `selectedStatus` is `null` (showing all), capture the counts into local state. Then pass the **stale** unfiltered counts down to the page even when a filter is active:

```tsx
<List
  ...
  allCount={unfilteredCounts?.count ?? data?.data.count ?? 0}
  countByStatus={unfilteredCounts?.countByStatus ?? data?.data.count_by_status ?? {}}
  ...
/>
```

> **Why?** The backend returns the unfiltered counts in `count_by_status` as a side-channel. We cache them when no filter is active, then fall back to them when a filter is active so chips always show the totals.

---

## In-Page Segmented Filter (Card Header Toggle)

Used when the same list has multiple sub-views (e.g. opname count: pending / counted / all). This is a Bootstrap `btn-group` styled as a small inline toggle.

```tsx
<div className="btn-group btn-group-sm">
  {([
    { key: "pending", label: t("modules.opname.count.filter_pending") },
    { key: "counted", label: t("modules.opname.count.filter_counted") },
    { key: "all", label: t("modules.opname.count.filter_all") },
  ] as const).map((f) => (
    <button
      key={f.key}
      className={`btn ${activeFilter === f.key ? "btn-primary" : "btn-outline-secondary"} btn-sm`}
      onClick={() => setActiveFilter(f.key)}
      type="button"
    >
      {f.label}
    </button>
  ))}
</div>
```

### When to Use

- The list is **inside another page** (e.g. a detail/count page) — not at the top of a module list.
- The filter divides the **same** dataset into local sub-views rather than triggering a server round-trip.
- The dataset is already in memory and can be filtered with `Array.prototype.filter`.

### When NOT to Use

- For top-level module list pages — use the **status chip bar** instead.
- For filters that require server-side filtering or pagination — push them up to the wrapper and add to the `params` object.

---

## Local Filter Pattern (opname count)

```tsx
const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "counted">("pending");

const displayedItems = activeFilter === "pending"
  ? pendingItems
  : activeFilter === "counted"
  ? countedItems
  : items;
```

The filter is purely local: derive sub-arrays in the wrapper and pass them to the page as separate props (`items`, `pendingItems`, `countedItems`). The page picks one based on `activeFilter`.

---

## Filter and Search Together

When combining the status chip bar with the global search bar:

| Filter | Source | Handled in |
|---|---|---|
| Status chips | Module-specific state | `ListWrapper` |
| Text search `!search` | `SearchContext` via `useSearch()` | `ListWrapper` |
| Field-based filter | `FilterContext` via `useFilter()` | `ListWrapper` |

All three are combined into the `params` object sent to `useList`:

```tsx
const params = {
  "!search": query,
  "!sort[id]": -1,
  ...(selectedStatus && { status: selectedStatus }),
  ...(filter.categoryId && { category_id: filter.categoryId }),
};
```

The page itself does not consume any of these contexts — only the wrapper does. This keeps the page purely presentational.

---

## Adding a New Status Filter

1. Define the status in the module's `types/Model.ts`:

   ```ts
   export const OPNAME_STATUSES = [
     { value: "draft", label: "modules.opname.status.draft", dot: "#94a3b8" },
     // ...
   ];
   ```

2. Add `STATUS_COLORS` mapping for chip dots and badges.

3. Add a translation key under `modules.<module>.list.filter_*` for the chip label and `filter_by_status` for the bar caption.

4. In the wrapper, add the state + params update:

   ```tsx
   const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
   const params = { ...(selectedStatus && { status: selectedStatus }) };
   ```

5. In the page, render the chips from the status list:

   ```tsx
   {OPNAME_STATUSES.map((s) => (
     <button className={`status-chip ${selectedStatus === s.value ? "active" : ""}`} ...>
       <span className="status-chip__dot" style={{ background: s.dot }} />
       <span className="status-chip__label">{t(s.label)}</span>
       <span className="status-chip__count">{countByStatus[s.value] ?? 0}</span>
     </button>
   ))}
   ```

### Checklist

- [ ] All chip labels translated
- [ ] Color defined in module's `STATUS_COLORS` map
- [ ] Wrapper resets to `skip = 0` on change
- [ ] Unfiltered counts preserved when a filter is active
- [ ] `active` class toggles correctly
- [ ] Bar scrolls horizontally on narrow screens (CSS already handles this)
