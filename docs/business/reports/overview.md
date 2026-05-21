# Reports Overview

## Overview

The reporting module provides financial and inventory reports for asset management and accounting purposes.

**PRD Reference:** Section 4.5.1

---

## Report Types

| Report Name | Endpoint | Description |
|------------|----------|-------------|
| Total Asset Inventory | `/api/v1/reports/inventory` | Complete asset list with filters |
| Asset Summary by Category | `/api/v1/reports/by-category` | Assets grouped by category |
| Asset Summary by Location | `/api/v1/reports/by-location` | Assets grouped by location |
| Asset Summary by Department | `/api/v1/reports/by-department` | Assets grouped by department |
| Recently Added Assets | `/api/v1/reports/recent` | New assets within date range |
| Depreciation Schedule | `/api/v1/reports/depreciation` | Depreciation details per asset |
| Opname Summary | `/api/v1/opname/reports/summary` | Session totals: matched, mismatched, not found, extra |
| Discrepancy Report | `/api/v1/opname/reports/discrepancies` | All discrepancies by session and type |
| Asset Opname History | `/api/v1/assets/{id}/opname-history` | All opname events for a specific asset |

---

## Report Filters

Each report supports the following filter parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| category_id | uuid | Filter by category |
| location_id | uuid | Filter by location |
| department_id | uuid | Filter by department |
| status | string | Filter by status |
| date_from | date | Start date for date-range filters |
| date_to | date | End date for date-range filters |
| search | string | Search by name/code |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reports/inventory` | Total asset inventory |
| GET | `/api/v1/reports/by-category` | Summary by category |
| GET | `/api/v1/reports/by-location` | Summary by location |
| GET | `/api/v1/reports/by-department` | Summary by department |
| GET | `/api/v1/reports/recent` | Recently added assets |
| GET | `/api/v1/reports/depreciation` | Depreciation schedule |
| GET | `/api/v1/opname/sessions/{id}/summary` | Opname session summary |
| GET | `/api/v1/opname/sessions/{id}/discrepancies` | Discrepancy detail report |
| GET | `/api/v1/assets/{id}/opname-history` | Asset opname event history |

---

## Report Response Formats

### Inventory Report

```json
{
  "data": [
    {
      "id": "uuid",
      "asset_code": "AST-2026-000001",
      "name": "MacBook Pro M3",
      "category": "Computers",
      "location": "Building A - Floor 3",
      "department": "Engineering",
      "status": "in_use",
      "purchase_price": 25000000,
      "book_value": 18750000,
      "purchase_date": "2026-01-15"
    }
  ],
  "summary": {
    "total_assets": 150,
    "total_value": 500000000,
    "total_book_value": 350000000
  },
  "meta": {
    "page": 1,
    "per_page": 25,
    "total": 150
  }
}
```

### Category Summary

```json
{
  "data": [
    {
      "category": "Computers",
      "count": 50,
      "total_value": 200000000,
      "total_book_value": 140000000
    },
    {
      "category": "Furniture",
      "count": 30,
      "total_value": 150000000,
      "total_book_value": 120000000
    }
  ]
}
```

---

## Export Functionality

Reports can be exported via UI buttons:

- **CSV Export** - via spreadsheet library
- **PDF Export** - via PDF generation library

---

## Business Rules

1. **Department Scope** - Staff/Manager see only their department's assets
2. **Auditor Access** - Auditor can see all departments
3. **Disposal Filtering** - Reports can include/exclude disposed assets
4. **Date Ranges** - Reports respect date_from/date_to filters

---

## Related Documents

- [Depreciation](../assets/depreciation.md) - Depreciation calculation
- [Audit Trail](../audit/trail.md) - Audit trail access
- [Roles & Permissions](../roles/permissions.md) - Report access by role