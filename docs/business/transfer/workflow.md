# Transfer Workflow

## Overview

The transfer workflow moves assets between departments and/or locations via three distinct transfer types: Inter-Department (changes department only), Inter-Location (changes location only), and Combined (changes both department and location). All transfers require administrator approval.

**PRD Reference:** Section 4.2.3, 4.2.4, 4.2.5, 4.2.6

---

## Transfer Types

| Type | Description | What Changes |
|------|-------------|-------------|
| `inter_department` | Permanently reassigns asset to different department | `department_id` only; location unchanged |
| `inter_location` | Permanently relocates asset to different location | `location_id` only; department unchanged |
| `combined` | Reassigns asset to different department AND different location | Both `department_id` AND `location_id` |

---

## TransferRequest Entity

### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | Yes | Primary key |
| asset_id | uuid | Yes | Reference to asset |
| transfer_type | enum | Yes | `inter_department`, `inter_location`, or `combined` |
| from_department_id | uuid | Yes | Original department |
| to_department_id | uuid | Conditional | Required for `inter_department` or `combined` |
| from_location_id | uuid | Yes | Original location |
| to_location_id | uuid | Conditional | Required for `inter_location` or `combined` |
| from_custodian_id | uuid | No | Original custodian |
| to_custodian_id | uuid | No | New custodian |
| status | enum | Yes | pending, approved, rejected |
| reason | text | Yes | Transfer reason (business justification) |
| notes | text | No | Additional remarks |
| approved_by | uuid | No | Approver user ID |
| approved_at | datetime | No | Approval timestamp |
| rejection_reason | text | No | Reason for rejection (set on reject) |
| created_by | uuid | Yes | Initiator user ID |
| created_at | datetime | Yes | Creation timestamp |

### Transfer Type Enum

```ts
enum TransferType: string {
  INTER_DEPARTMENT = 'inter_department';
  INTER_LOCATION = 'inter_location';
  COMBINED = 'combined';
}
```

### Transfer Status Enum

```ts
enum TransferStatus: string {
  PENDING = 'pending';
  APPROVED = 'approved';
  REJECTED = 'rejected';
}
```

---

## Transfer Process Flow

```
┌─────────────────┐
│  Initiate      │  POST /api/v1/transfers + transfer_type
│  Transfer      │  { asset_id, transfer_type, reason, ... }
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Pending        │  Status: pending
│  Approval       │  Asset status → pending_transfer
└───────┬─────────┘
        │
    ┌───┴───┐
    │       │
    ▼       ▼
┌───────┐ ┌───────┐
│Approve│ │Reject │
└───┬───┘ └───┬───┘
    │         │
    ▼         ▼
┌─────────┐ ┌─────────┐
│ Update   │ │ Return  │
│ Asset   │ │ to      │
│ Records │ │ Original│
└─────────┘ └─────────┘
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/transfers` | Initiate transfer request (any type) |
| GET | `/api/v1/transfers` | List all transfer requests (filterable by type, status, asset, department) |
| GET | `/api/v1/transfers/{id}` | Get transfer request detail |
| PATCH | `/api/v1/transfers/{id}/approve` | Approve transfer — updates asset dept/location |
| PATCH | `/api/v1/transfers/{id}/reject` | Reject transfer with reason |
| GET | `/api/v1/assets/{id}/transfers` | Get transfer history for a specific asset |

---

## Workflow by Transfer Type

### Inter-Department Transfer

Changes `department_id` only; location remains unchanged.

**Request:**
```json
POST /api/v1/transfers
{
  "transfer_type": "inter_department",
  "asset_id": "uuid-of-asset",
  "from_department_id": "uuid-source",
  "to_department_id": "uuid-target",
  "reason": "Project reallocation requires equipment transfer"
}
```

**On Approval:**
- Asset `department_id` → `to_department_id`
- Asset `location_id` unchanged
- Asset `status` → `available` (or back to previous non-pending status)
- TransferRequest `status` → `approved`
- ActivityLog: `TRANSFER_APPROVED` with department change

---

### Inter-Location Transfer

Changes `location_id` only; department remains unchanged.

**Request:**
```json
POST /api/v1/transfers
{
  "transfer_type": "inter_location",
  "asset_id": "uuid-of-asset",
  "from_location_id": "uuid-source",
  "to_location_id": "uuid-target",
  "reason": "Office closure requires asset relocation"
}
```

**On Approval:**
- Asset `location_id` → `to_location_id`
- Asset `department_id` unchanged
- Asset `status` → `available` (or back to previous non-pending status)
- TransferRequest `status` → `approved`
- ActivityLog: `TRANSFER_APPROVED` with location change

---

### Combined Transfer

Changes both `department_id` AND `location_id` in a single request.

**Request:**
```json
POST /api/v1/transfers
{
  "transfer_type": "combined",
  "asset_id": "uuid-of-asset",
  "from_department_id": "uuid-source-dept",
  "to_department_id": "uuid-target-dept",
  "from_location_id": "uuid-source-loc",
  "to_location_id": "uuid-target-loc",
  "reason": "Asset reassigned to new department at different site"
}
```

**On Approval:**
- Asset `department_id` → `to_department_id`
- Asset `location_id` → `to_location_id`
- Asset `status` → `available` (or back to previous non-pending status)
- TransferRequest `status` → `approved`
- ActivityLog: `TRANSFER_APPROVED` with both department and location changes

---

## Rejection Flow

**Request:**
```json
PATCH /api/v1/transfers/{id}/reject
{
  "rejection_reason": "Target department over budget; request deferred"
}
```

**On Rejection:**
- TransferRequest `status` → `rejected`
- TransferRequest `rejection_reason` → provided reason
- Asset records unchanged (no department/location updates)
- ActivityLog: `TRANSFER_REJECTED` with rejection reason

---

## Business Rules

1. **Transfer Type Required** — Every request must specify `transfer_type`
2. **Asset Must Be Transferable** — Asset status must be `available` or `in_use`
3. **Destination Must Differ** — `to_department_id` ≠ `from_department_id` (for dept change); `to_location_id` ≠ `from_location_id` (for loc change)
4. **Approval Required** — All transfers require Administrator approval (no auto-approve)
5. **Department Scope** — Staff/Manager can only initiate transfers originating from their department
6. **Custodian Handling** — Optional `to_custodian_id` sets new custodian upon approval
7. **Rejection Reason** — `rejection_reason` required when rejecting transfer
8. **Pending Transfer Status** — Asset status set to `pending_transfer` when request created

---

## Activity Log Events

| Event | Data Captured |
|-------|---------------|
| `TRANSFER_INITIATED` | asset_id, transfer_type, from/to dept, from/to location, initiated_by |
| `TRANSFER_APPROVED` | asset_id, transfer_type, approved_by, fields_changed (dept/location) |
| `TRANSFER_REJECTED` | asset_id, transfer_type, rejected_by, rejection_reason |

---

## Related Documents

- [Location Hierarchy](../location/hierarchy.md) — Location structure
- [Department Management](../departments/overview.md) — Department entity
- [Asset Lifecycle](../assets/lifecycle.md) — pending_transfer status
- [Audit Trail](../audit/trail.md) — Transfer event tracking