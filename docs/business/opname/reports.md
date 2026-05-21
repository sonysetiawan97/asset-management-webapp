# Opname Reports

## Overview

Opname-specific reporting provides summary statistics, discrepancy analysis, and per-asset opname history. These reports support audit and compliance requirements under PSAK/IFRS accounting standards.

**PRD Reference:** Section 4.4.4

---

## Opname Summary

Returns aggregated statistics for an opname session.

```
GET /api/v1/opname/sessions/{id}/summary
```

**Response:**
```json
{
  "session_id": "uuid",
  "session_name": "Annual Stock Opname 2026",
  "status": "in_progress",
  "total_items": 150,
  "counted_items": 87,
  "matched_count": 72,
  "mismatch_count": 10,
  "not_found_count": 3,
  "extra_count": 2,
  "counted_percentage": 58
}
```

---

## Discrepancy Detail

Returns all items with discrepancies (mismatch, not_found, extra) for review.

```
GET /api/v1/opname/sessions/{id}/discrepancies
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | Filter by counted_status: `mismatch`, `not_found`, `extra` |
| page | int | Page number (default: 1) |
| per_page | int | Results per page (default: 25) |

**Response:**
```json
{
  "data": [
    {
      "item_id": "uuid",
      "asset_id": "uuid",
      "asset_code": "AST-2026-000042",
      "asset_name": "MacBook Pro M3",
      "counted_status": "not_found",
      "expected_location": "Building A - Floor 3",
      "expected_condition": "good",
      "expected_status": "in_use",
      "counted_by": "John Doe",
      "counted_at": "2026-05-15T10:30:00Z",
      "notes": "Asset not found in the room"
    },
    {
      "item_id": "uuid",
      "asset_id": "uuid",
      "asset_code": "AST-2026-000087",
      "asset_name": "Dell Monitor 27\"",
      "counted_status": "mismatch",
      "expected_location": "Building A - Floor 3",
      "counted_location": "Building B - Floor 1",
      "expected_condition": "good",
      "counted_condition": "fair",
      "counted_by": "Jane Smith",
      "counted_at": "2026-05-15T11:00:00Z",
      "notes": "Monitor moved during office rearrangement"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "per_page": 25
  }
}
```

---

## Opname Session History

Returns all opname sessions (past and present) for audit and planning purposes.

```
GET /api/v1/opname/sessions
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter by status: `draft`, `in_progress`, `pending_approval`, `approved`, `closed` |
| department_id | uuid | Filter by department scope |
| date_from | date | Filter sessions created after this date |
| date_to | date | Filter sessions created before this date |
| page | int | Page number |
| per_page | int | Results per page |

---

## Asset Opname History

Returns all opname events for a specific asset — useful for tracing an asset's location and condition history over multiple inventory counts.

```
GET /api/v1/assets/{id}/opname-history
```

**Response:**
```json
{
  "asset_id": "uuid",
  "asset_code": "AST-2026-000042",
  "asset_name": "MacBook Pro M3",
  "opname_events": [
    {
      "session_id": "uuid",
      "session_name": "Annual Stock Opname 2025",
      "session_date": "2025-11-15",
      "counted_status": "match",
      "expected_location": "Building A - Floor 3",
      "expected_condition": "new",
      "counted_by": "Admin User",
      "counted_at": "2025-11-15T14:00:00Z"
    },
    {
      "session_id": "uuid",
      "session_name": "Annual Stock Opname 2026",
      "session_date": "2026-05-10",
      "counted_status": "not_found",
      "expected_location": "Building A - Floor 3",
      "expected_condition": "good",
      "counted_by": "Staff User",
      "counted_at": "2026-05-15T10:30:00Z",
      "notes": "Asset not found in the room"
    }
  ]
}
```

---

## Report Access Control

| Report | Administrator | Staff / Manager | Auditor |
|--------|:---:|:---:|:---:|
| Opname Summary | ✓ (all sessions) | ✓ (own dept. scope) | ✓ (all) |
| Discrepancy Detail | ✓ (all sessions) | ✓ (own dept. scope) | ✓ (all) |
| Session History | ✓ (all sessions) | ✓ (own dept. scope) | ✓ (all) |
| Asset Opname History | ✓ (all assets) | ✓ (own dept. assets) | ✓ (all) |

---

## Business Rules

1. **Department Scope** — Staff/Manager see only sessions scoped to their department or with no scope
2. **Auditor Full Access** — Auditor can view all sessions regardless of scope
3. **Closed Sessions** — Completed and closed sessions remain accessible in history
4. **Discrepancy Filtering** — `type` filter supports viewing only specific discrepancy types
5. **Date Range** — History supports date filtering for annual or quarterly reporting periods

---

## Related Documents

- [Opname Sessions](sessions.md) — Session entity
- [Opname Items](items.md) — Counted item entity
- [Opname Workflow](workflow.md) — Counting workflow
- [Audit Trail](../audit/trail.md) — ActivityLog for opname events
- [Reports Overview](../reports/overview.md) — General reporting module