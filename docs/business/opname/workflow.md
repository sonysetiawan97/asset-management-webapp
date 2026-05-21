# Opname Workflow

## Overview

The opname workflow manages the complete lifecycle of a physical inventory count — from session creation through counting, discrepancy review, adjustment approval, and session closure. Each step is authorized by specific roles and triggers appropriate system responses.

**PRD Reference:** Section 4.4.3

---

## Workflow State Diagram

```
                          ┌──────────────────────────────────────────────────────────┐
                          │                                                          │
                          ▼                                                          │
┌─────────┐   start   ┌──────────────┐  complete  ┌────────────────────┐  approve   │
│  draft  │──────────▶│ in_progress  │───────────▶│ pending_approval   │──────────┤
└─────────┘           └────────────���─┘            └────────┬───────────┘            │
     ▲                        │                                 │                      │
     │                        │ reject                          ▼                      ▼
     │                        │                    ┌──────────┐              ┌──────────┐
     │                        │                    │ approved │              │  closed  │
     │                        ▼                    └────┬─────┘              └──────────┘
     │                   Counting Phase                  │
     │                   (Staff/Manager)                 │
     │                                                    │ close
     └────────────────────────────────────────────────────┘
```

---

## Workflow Steps

### Step 1: Create Session

| Field | Value |
|-------|-------|
| Actor | Administrator |
| Action | `POST /api/v1/opname/sessions` with name, department_id, location_id, start_date, end_date |
| System Response | Session created with status `draft`; `created_by` set to authenticated user |
| Preconditions | User must be Administrator |

---

### Step 2: Define Scope

| Field | Value |
|-------|-------|
| Actor | Administrator |
| Action | `PATCH /api/v1/opname/sessions/{id}` with department_id and/or location_id filters |
| System Response | Session scope updated (draft only); assets enumerated for session |
| Preconditions | Session must be `draft` |
| Note | Scope can be changed until session is started. Changing scope after start is not allowed. |

---

### Step 3: Start Session

| Field | Value |
|-------|-------|
| Actor | Administrator |
| Action | `PATCH /api/v1/opname/sessions/{id}/start` |
| System Response | Status → `in_progress`; OpnameItem generated for every scoped asset; expected values frozen |
| Preconditions | Session must be `draft` |
| ActivityLog | `OPNAME_SESSION_STARTED` |

---

### Step 4: Count Assets

| Field | Value |
|-------|-------|
| Actor | Staff / Manager |
| Action | `PATCH /api/v1/opname/items/{id}/count` with counted values |
| System Response | Count recorded; item marked as counted; counted_at and counted_by set |
| Preconditions | Parent session must be `in_progress`; item must belong to session |
| ActivityLog | `OPNAME_ITEM_COUNTED` |
| Note | Multiple counts allowed until session is closed; latest count overwrites previous |

---

### Step 5: Complete Counting

| Field | Value |
|-------|-------|
| Actor | Staff / Manager |
| Action | `PATCH /api/v1/opname/sessions/{id}/complete` |
| System Response | Status → `pending_approval`; no further counts can be recorded via normal flow |
| Preconditions | All items should be counted (system may allow completion with uncounted items) |
| ActivityLog | `OPNAME_COUNTING_COMPLETED` |

---

### Step 6: Review Discrepancies

| Field | Value |
|-------|-------|
| Actor | Administrator |
| Action | `GET /api/v1/opname/sessions/{id}/discrepancies` |
| System Response | Summary of all items with `counted_status` = mismatch, not_found, or extra |
| Preconditions | Session must be `pending_approval` |
| Note | This is a review step; no system state change |

---

### Step 7: Approve Adjustments

| Field | Value |
|-------|-------|
| Actor | Administrator |
| Action | `PATCH /api/v1/opname/sessions/{id}/approve` OR `PATCH /api/v1/opname/items/{id}/approve-adjustment` (per item) |
| System Response | Asset records updated to match physical count; adjustment_approved_by/approved_at set |
| Preconditions | Session must be `pending_approval` |
| ActivityLog | `OPNAME_ADJUSTMENT_APPROVED` with old/new values for each changed field |

---

### Step 8: Close Session

| Field | Value |
|-------|-------|
| Actor | Administrator |
| Action | `PATCH /api/v1/opname/sessions/{id}/close` |
| System Response | Status → `closed`; no further counts or adjustments allowed |
| Preconditions | Session must be `approved` |
| ActivityLog | `OPNAME_SESSION_CLOSED` |
| Note | Closing is irreversible. All adjustments must be approved before closing. |

---

### Step 9: Reject Session

| Field | Value |
|-------|-------|
| Actor | Administrator |
| Action | `PATCH /api/v1/opname/sessions/{id}/reject` |
| System Response | Status → `draft`; all counted items remain countable |
| Preconditions | Session must be `pending_approval` |
| ActivityLog | `OPNAME_SESSION_REJECTED` |
| Note | Use this when major counting errors are found and the entire session needs recounting. |

---

## Activity Log Events

| Event | Data Captured |
|-------|---------------|
| `OPNAME_SESSION_CREATED` | session_id, name, scope (dept/location), created_by |
| `OPNAME_SESSION_STARTED` | session_id, total_items_generated |
| `OPNAME_ITEM_COUNTED` | session_id, item_id, asset_id, counted_status, counted_by |
| `OPNAME_COUNTING_COMPLETED` | session_id, total_counted, discrepancy_count |
| `OPNAME_ADJUSTMENT_APPROVED` | session_id, item_id, asset_id, field_changed, old_value, new_value, approved_by |
| `OPNAME_SESSION_REJECTED` | session_id, rejected_by |
| `OPNAME_SESSION_CLOSED` | session_id, closed_by, total_adjustments |

---

## Business Rules

1. **Administrator Only** — Only Administrator can create, start, approve, reject, and close sessions
2. **Staff/Manager Counting** — Staff and Manager can count items within their department scope
3. **Scope Frozen on Start** — Asset expected values are captured once at session start and never change
4. **Approval Before Close** — Session must be `approved` before it can be closed
5. **No Modification After Close** — Closed sessions are immutable
6. **Rejection Resets to Draft** — Rejection returns session to `draft` allowing re-counting
7. **Department Scope Enforcement** — Staff/Manager see only items within their assigned department

---

## Related Documents

- [Opname Sessions](sessions.md) — Session entity and lifecycle
- [Opname Items](items.md) — Item entity and count workflow
- [Opname Reports](reports.md) — Reporting endpoints
- [Audit Trail](../audit/trail.md) — ActivityLog event definitions