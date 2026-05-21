# Opname Sessions

## Overview

An opname session represents one physical inventory count event (e.g., "Annual Stock Opname 2026"). Multiple sessions can run concurrently for different departments or locations. Sessions define the scope, timeframe, and lifecycle of a physical asset count.

**PRD Reference:** Section 4.4.1

---

## OpnameSession Entity

### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | Yes | Primary key, auto-generated |
| name | text | Yes | Session name, e.g., "Annual Stock Opname 2026" |
| department_id | uuid | Conditional | Scope to department (null = all departments) |
| location_id | uuid | Conditional | Scope to location (null = all locations) |
| start_date | date | Yes | Session start date |
| end_date | date | Yes | Expected completion date |
| status | enum | Yes | Session lifecycle state (see below) |
| notes | text | No | Additional instructions or remarks |
| created_by | uuid | Yes | User who initiated the session |
| created_at | datetime | Auto | Creation timestamp |
| updated_at | datetime | Auto | Last update timestamp |

### Status Enum

| Value | Description |
|-------|-------------|
| `draft` | Session created but not yet started; assets not enumerated |
| `in_progress` | Active counting; OpnameItems generated for all scoped assets |
| `pending_approval` | Counting complete; awaiting review and adjustment approval |
| `approved` | All adjustments applied; asset records updated |
| `closed` | Session finalized; no further counts allowed |

### Status State Diagram

```
┌─────────┐    start     ┌──────────────┐    complete    ┌────────────────────┐
│  draft  │─────────────▶│ in_progress  │────────────────▶│ pending_approval   │
└─────────┘              └──────────────┘                └────────┬───────────┘
     ▲                          │                                   │
     │                          │ reject                            ▼
     │                          │                    ┌──────────┐  ┌──────────┐
     └──────────────────────────┘                    │ approved │  │  closed  │
                                                       └──────────┘  └──────────┘
```

---

## Session Scope

- **Full scope:** `department_id` and `location_id` both null → all assets in all departments/locations
- **Department scope:** `department_id` set → only assets in that department
- **Location scope:** `location_id` set → only assets at that location
- **Combined scope:** Both set → assets matching both department AND location

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/opname/sessions` | List all opname sessions (paginated, filterable by status) |
| POST | `/api/v1/opname/sessions` | Create a new session (Administrator only) |
| GET | `/api/v1/opname/sessions/{id}` | Get session detail with summary counts |
| PATCH | `/api/v1/opname/sessions/{id}` | Update session scope or dates (draft only) |
| PATCH | `/api/v1/opname/sessions/{id}/start` | Start session — generate OpnameItems (draft → in_progress) |
| PATCH | `/api/v1/opname/sessions/{id}/complete` | Mark counting complete (in_progress → pending_approval) |
| PATCH | `/api/v1/opname/sessions/{id}/approve` | Approve all adjustments (pending_approval → approved) |
| PATCH | `/api/v1/opname/sessions/{id}/reject` | Reject session (pending_approval → draft) |
| PATCH | `/api/v1/opname/sessions/{id}/close` | Close session (approved → closed) |
| GET | `/api/v1/opname/sessions/{id}/summary` | Get session summary (total, matched, mismatch, not_found, extra) |
| GET | `/api/v1/opname/sessions/{id}/discrepancies` | List all items with discrepancies |
| GET | `/api/v1/opname/sessions/{id}/items` | List all opname items in this session |

---

## Session Lifecycle

1. **Draft** — Created with scope. No OpnameItems exist yet. Editable.
2. **In Progress** — Start called. System generates OpnameItem for every scoped asset (expected_status, expected_location_id, expected_condition captured at start time). Counting can begin.
3. **Pending Approval** — Counting complete. Administrator reviews discrepancies.
4. **Approved** — All adjustments applied to asset records. ActivityLog written.
5. **Closed** — Final state. No further modifications allowed.

---

## Business Rules

1. **Start Condition** — Only `draft` sessions can be started
2. **OpnameItem Generation** — On start, one OpnameItem created per scoped asset with expected values frozen at start time
3. **No Scope Change** — Once `in_progress`, scope (department_id/location_id) cannot be changed
4. **Date Constraints** — `end_date` must be >= `start_date`
5. **Close Only from Approved** — Only `approved` sessions can be closed
6. **Rejection resets to Draft** — Rejected sessions return to `draft`; counted items remain countable
7. **Department Manager Notifications** — When session is scoped to a department, the department manager receives notifications

---

## Related Documents

- [Opname Items](items.md) — Individual asset count records
- [Opname Workflow](workflow.md) — Complete workflow steps
- [Opname Reports](reports.md) — Reporting endpoints
- [Opname Notifications](notifications.md) — Alert triggers
- [Audit Trail](../audit/trail.md) — ActivityLog events