# Opname Items

## Overview

Each opname item represents a single asset being counted during an opname session. It captures the expected system values at session start and the actual counted values from the physical count.

**PRD Reference:** Section 4.4.2

---

## OpnameItem Entity

### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | Yes | Primary key, auto-generated |
| session_id | uuid | Yes | FK → opname_sessions |
| asset_id | uuid | Yes | FK → assets |
| expected_status | enum | Auto | Asset status at session start (frozen) |
| expected_location_id | uuid | Auto | Asset location at session start (frozen) |
| expected_condition | enum | Auto | Asset condition at session start (frozen) |
| counted_status | enum | No | Result of physical count (see below) |
| counted_location_id | uuid | No | Actual location where asset was found |
| counted_condition | enum | No | Actual condition found during count |
| counted_at | datetime | No | When the count was performed |
| counted_by | uuid | No | FK → users — person who performed the count |
| notes | text | No | Remarks on discrepancies |
| adjustment_approved_by | uuid | No | FK → users — who approved the adjustment |
| adjustment_approved_at | datetime | No | When adjustment was approved |

### Counted Status Enum

| Value | Description |
|-------|-------------|
| `match` | Physical asset matches system record exactly |
| `mismatch` | Asset found but status/location/condition differs from system |
| `not_found` | Asset registered in system but not found physically |
| `extra` | Physical asset found but not registered in system (to be registered) |

---

## Expected vs Counted Values

When a session is **started**, the system captures current asset values into `expected_*` fields. These are frozen — they represent what the system believed at session start.

| Field | Source | Frozen At |
|-------|--------|-----------|
| expected_status | `assets.status` | Session start |
| expected_location_id | `assets.location_id` | Session start |
| expected_condition | `assets.condition` | Session start |

When counting, the counter records `counted_*` fields from the physical observation.

### Counted Status Determination

| Scenario | counted_status | counted_location_id | counted_condition |
|----------|---------------|--------------------|--------------------|
| Matches expected exactly | `match` | (same as expected) | (same as expected) |
| Status differs, location/condition same | `mismatch` | provided | provided |
| Status differs, location differs, condition same | `mismatch` | provided | provided |
| Asset at different location than expected | `mismatch` | provided | provided |
| Asset in different condition than expected | `mismatch` | provided | provided |
| All three differ | `mismatch` | provided | provided |
| Asset registered but physically not found | `not_found` | null | null |
| Physical asset not in system | `extra` | provided | provided |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/opname/sessions/{session_id}/items` | List all items in session (paginated, filterable) |
| GET | `/api/v1/opname/sessions/{session_id}/items?asset_id={uuid}` | Get specific item by asset ID |
| PATCH | `/api/v1/opname/items/{id}/count` | Record count result for an item |
| PATCH | `/api/v1/opname/items/{id}/approve-adjustment` | Approve adjustment for an item |
| GET | `/api/v1/assets/{id}/opname-history` | Get all opname events for a specific asset |

---

## Count Workflow

### Recording a Count

**Request:**
```json
PATCH /api/v1/opname/items/{id}/count
{
  "counted_status": "mismatch",
  "counted_location_id": "uuid-of-new-location",
  "counted_condition": "good",
  "notes": "Asset moved to adjacent room during renovation"
}
```

**Preconditions:**
- Parent session status must be `in_progress`
- Item must not already be counted

**Result:**
- `counted_*` fields updated
- `counted_at` → current timestamp
- `counted_by` → authenticated user

---

### Approving an Adjustment

**Request:**
```json
PATCH /api/v1/opname/items/{id}/approve-adjustment
```

**Preconditions:**
- Item must have a `counted_status` of `mismatch`, `not_found`, or `extra`
- Parent session must be `pending_approval`

**Result:**
- Asset record updated to match counted values:
  - `status` → `counted_status` (for `not_found` → `lost`, `extra` → new status)
  - `location_id` → `counted_location_id`
  - `condition` → `counted_condition`
- `adjustment_approved_by` → authenticated user
- `adjustment_approved_at` → current timestamp
- ActivityLog written for asset changes

---

## Business Rules

1. **One Count Per Item** — Once counted, the count can be overwritten until session is closed
2. **Adjustment Requires Pending Session** — Approvals only allowed when session is `pending_approval`
3. **Expected Values Are Frozen** — Expected values never change after session start, even if asset is updated
4. **Extra Assets** — Assets marked `extra` should prompt creation of a new asset record
5. **Not Found Assets** — Assets marked `not_found` set asset status to `lost` upon approval
6. **Department Scope** — Staff/Manager can only count items within their department scope
7. **ActivityLog** — Every count and approval is recorded in ActivityLog

---

## Related Documents

- [Opname Sessions](sessions.md) — Parent session entity
- [Opname Workflow](workflow.md) — Complete workflow steps
- [Opname Reports](reports.md) — Discrepancy reporting
- [Asset Lifecycle](../assets/lifecycle.md) — Status definitions