# Asset Management System — Implementation Plan

> **Workflow:** Implementation → Test → Next Phase
> **Updated:** 2026-05-18

---

## Phase 1: Foundation (No Dependencies)

### 1.1 ✅ Categories (`/categories`) — DONE
- [x] `src/modules/categories/types/Model.ts`
- [x] `src/modules/categories/components/FormFields.tsx`
- [x] `src/modules/categories/pages/list/`
- [x] `src/modules/categories/pages/create/`
- [x] `src/modules/categories/pages/read/`
- [x] `src/modules/categories/pages/update/`
- [x] `src/modules/categories/PrivateRoutes.tsx`
- [x] Route registered in `src/routes/PrivateRoutes.tsx`
- [x] Sidebar menu item added
- [x] i18n keys (en-US + id)
- [ ] **TEST: Navigate to `/categories`, create/read/update/delete a category**

### 1.2 ✅ Locations (`/locations`) — DONE
- [x] `src/modules/locations/types/Model.ts`
- [x] `src/modules/locations/components/FormFields.tsx`
- [x] `src/modules/locations/pages/list/`
- [x] `src/modules/locations/pages/create/`
- [x] `src/modules/locations/pages/read/`
- [x] `src/modules/locations/pages/update/`
- [x] `src/modules/locations/PrivateRoutes.tsx`
- [x] Route registered in `src/routes/PrivateRoutes.tsx`
- [x] Sidebar menu item added
- [x] i18n keys (en-US + id)
- [x] Custom CSS in `src/assets/style/modules.css`
- [x] Hierarchy tree list (no table) — Categories & Locations
- [x] Stat bar, page header, type badges, hierarchy cards
- [ ] **TEST: Run `npm run dev` and verify all styles render correctly**

### 1.3 ✅ Vendors (`/vendors`) — DONE
- [x] `src/modules/vendors/types/Model.ts`
- [x] `src/modules/vendors/components/FormFields.tsx`
- [x] `src/modules/vendors/pages/list/` — grid card layout with status badges
- [x] `src/modules/vendors/pages/create/`
- [x] `src/modules/vendors/pages/read/`
- [x] `src/modules/vendors/pages/update/`
- [x] `src/modules/vendors/PrivateRoutes.tsx`
- [x] Route registered
- [x] Sidebar menu item added
- [x] i18n keys (en-US + id)
- [x] Custom CSS (vendor grid, status dots, category badges)
- [ ] **TEST: Navigate to `/vendors`, verify grid cards, create/read/update/delete**

---

## Phase 2: Core Entity + References

### 2.1 ✅ Assets (`/assets`) — DONE
- [x] `src/modules/assets/types/Model.ts` — AssetStatus, AssetCondition, STATUS_COLORS, CONDITION_COLORS
- [x] `src/modules/assets/components/FormFields.tsx` — grouped form with category defaults
- [x] `src/modules/assets/pages/list/` — card grid with status filter chips + stats bar
- [x] `src/modules/assets/pages/create/`
- [x] `src/modules/assets/pages/read/`
- [x] `src/modules/assets/pages/update/`
- [x] `src/modules/assets/PrivateRoutes.tsx`
- [x] Route registered, sidebar menu, i18n (en-US + id)
- [x] Custom CSS (asset grid, status badges, financial cards, filter chips)
- [ ] **TEST: Navigate to `/assets`, verify card grid, status filters, create form**

### 2.2 Departments
- [ ] Only if standalone — check `docs/business/location/hierarchy.md`
- [ ] Skip if part of Locations module
- [ ] **TEST**

---

## Phase 3: Workflows

### 3.1 ✅ Checkout / Check-in (`/checkout`) — DONE
- [x] Types, FormFields
- [x] pages/list/ — active/returned stats bar
- [x] pages/create/ — checkout action
- [x] pages/read/, pages/update/ — check-in action
- [x] Route, sidebar, i18n
- [ ] **TEST: checkout flow, check-in with condition**

### 3.2 ✅ Transfer Requests (`/transfers`) — DONE
- [x] Types, FormFields
- [x] pages/list/ — pending/approved/rejected status chips + stat bar
- [x] pages/create/, pages/read/ — approve/reject buttons
- [x] Route, sidebar, i18n
- [ ] **TEST: initiate transfer, approve/reject**

### 3.3 ✅ Maintenance Logs (`/maintenance`) — DONE
- [x] Types, FormFields
- [x] pages/list/, pages/create/, pages/read/, pages/update/
- [x] Route, sidebar, i18n
- [ ] **TEST: create maintenance, complete maintenance, status changes**

### 3.4 QR Codes (`/assets/[id]/qr-codes`)
- [ ] Inline in Assets module read page
- [ ] Generate button, download PNG
- [ ] Scanner lookup page
- [ ] **TEST: generate, download, scan lookup**

### 3.4 ✅ QR Codes (`/assets/[id]/qr-codes`) — DONE
- [x] Inline in Assets module read page (`QRCodeSection.tsx`)
- [x] Generate button, download PNG
- [ ] Scanner lookup page
- [ ] **TEST: generate, download, scan lookup**

### 3.5 ✅ Notifications (`/notifications`) — DONE
- [x] Types, service (useNotificationPoll, useMarkRead, useMarkAllRead)
- [x] pages/list/ — tab filter (all/unread/read), mark read on click
- [x] Sidebar with unread count badge
- [ ] **TEST: mark read, polling, tab filter**

---

## Phase 4: Reporting & Compliance

### 4.1 ✅ Reports (`/reports`) — DONE
- [x] Inventory report page with table
- [x] CSV export button, sidebar
- [ ] Additional reports (by-category, by-location, depreciation)
- [ ] **TEST: generate report, export CSV**

### 4.2 ✅ Disposal (`/disposals`) — DONE
- [x] Types, FormFields
- [x] pages/list/ — workflow grid with method/status badges
- [x] pages/create/, pages/read/
- [x] Route, sidebar, i18n (en-US + id)
- [ ] **TEST: initiate disposal, view detail**

### 4.3 ✅ Audit Trail (`/audit-trail`) — DONE
- [x] Types, action filter dropdown
- [x] Timeline-style audit list with color-coded action badges
- [x] Old/new value display (strikethrough green/red)
- [x] Route, sidebar, i18n (en-US + id)
- [ ] **TEST: filter by action, verify color coding**

---

## Phase Summary

| Phase | Domains | Status |
|-------|---------|--------|
| 1 — Foundation | Categories ✅, Locations ✅, Vendors ✅ | 3/3 |
| 2 — Core Entity | Assets ✅, Departments ⏳ | 1/2 |
| 3 — Workflows | Checkout ✅, Transfer ✅, Maintenance ✅, QR ✅, Notifications ✅ | 5/5 |
| 4 — Reporting | Reports ✅, Disposal ✅, Audit ✅ | 3/3 |
| **Total** | **13 domains** | **12/13** |

---

## Critical Files to Modify Per Module

Each module follows this pattern:

```
src/modules/<name>/
├── types/Model.ts
├── services/useXxxService.ts     # if needed
├── components/FormFields.tsx
├── pages/
│   ├── list/{ListPage.tsx, ListWrapper.tsx}
│   ├── create/{CreatePage.tsx, CreateWrapper.tsx}
│   ├── read/{ReadPage.tsx, ReadWrapper.tsx}
│   └── update/{UpdatePage.tsx, UpdateWrapper.tsx}
└── PrivateRoutes.tsx
```

**Route registration:** `src/routes/PrivateRoutes.tsx`
**Sidebar menu:** `src/layout/partials/sidebar/Sidebar.tsx`
**i18n:** `public/locales/en-US/common.json` + `public/locales/id/common.json`

---

## Reference Modules

| Module | Path | What to reuse |
|--------|------|---------------|
| `categories` | `src/modules/categories/` | Just created — use as template |
| `suppliers` | `src/modules/suppliers/` | Reference patterns |
| `users` | `src/modules/users/` | Full CRUD with filters |

---

## Test Checklist (Per Module)

After each module implementation:

1. ✅ Navigate to list page — data loads
2. ✅ Click Create — form renders with all fields
3. ✅ Submit Create form — success notification, redirect to list
4. ✅ Click row action Read — detail page shows correct data
5. ✅ Click Update — form pre-fills with correct data
6. ✅ Submit Update form — success notification, redirect to list
7. ✅ Search (if applicable) — results filter correctly
8. ✅ Delete / Soft Delete — item removed from list
9. ✅ Sidebar menu item visible and navigable
10. ✅ No console errors
11. ✅ `npm run lint` passes

---

## Mock Data Pattern

Real API via `apiAxios` (services use `useList`, `useCreate`, `useUpdate`, `useDelete` hooks). Plain mock data files in `src/services/mocks/<name>/` as fallback when API is unavailable.

```ts
// src/services/mocks/categories/mockCategories.ts
export const mockCategories: Category[] = [
  { id: 1, name: 'Hardware', parent_id: null, useful_life_years: 5, salvage_value_pct: 10, created_at: '', updated_at: '' },
];
```