# Transfer Workflow

## Overview

The transfer workflow moves assets between locations or departments within the organization.

**PRD Reference:** Section 4.2.4

---

## Transfer Process Flow

```
┌─────────────────┐
│  Initiate      │  POST /api/v1/transfers
│  Transfer      │  { asset_id, to_location_id, reason }
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Pending        │  Status: pending_transfer
│  Approval       │  Waiting for approval
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
│ Location│ │ Original│
└─────────┘ └─────────┘
```

---

## TransferRequest Entity

### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | Yes | Primary key |
| asset_id | uuid | Yes | Reference to asset |
| from_location_id | uuid | Yes | Current location |
| to_location_id | uuid | Yes | Destination location |
| from_custodian_id | uuid | No | Current custodian |
| to_custodian_id | uuid | No | New custodian |
| status | enum | Yes | pending, approved, rejected |
| reason | text | Yes | Transfer reason |
| approved_by | uuid | No | Approver user ID |
| approved_at | datetime | No | Approval timestamp |
| created_by | uuid | Yes | Initiator user ID |
| created_at | datetime | Yes | Creation timestamp |

### Transfer Status

```ts
enum TransferStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/transfers` | Initiate transfer request |
| GET | `/api/v1/transfers` | List transfer requests |
| GET | `/api/v1/transfers/{id}` | Get transfer detail |
| PATCH | `/api/v1/transfers/{id}/approve` | Approve transfer |
| PATCH | `/api/v1/transfers/{id}/reject` | Reject transfer |

---

## Workflow Steps

### Step 1: Initiate Transfer

**Request:**
```json
POST /api/v1/transfers
{
  "asset_id": "uuid-of-asset",
  "to_location_id": "uuid-destination",
  "to_custodian_id": "uuid-new-custodian",
  "reason": "Asset relocated to new office floor"
}
```

**Preconditions:**
- Asset status must be `available` or `in_use`
- User must have transfer permission

**Result:**
- TransferRequest created with status `pending`
- Asset status → `pending_transfer`

---

### Step 2: Approve Transfer

**Request:**
```json
PATCH /api/v1/transfers/{id}/approve
```

**Preconditions:**
- Status must be `pending`
- User must have approve permission (Administrator or configured role)

**Result:**
- Asset `location_id` → `to_location_id`
- Asset `custodian_id` → `to_custodian_id`
- Asset status → `available` (or back to `in_use` if custodian set)
- TransferRequest status → `approved`
- ActivityLog created

---

### Step 3: Reject Transfer

**Request:**
```json
PATCH /api/v1/transfers/{id}/reject
{
  "reason": "Transfer rejected due to pending work"
}
```

**Preconditions:**
- Status must be `pending`

**Result:**
- TransferRequest status → `rejected`
- Asset status unchanged
- ActivityLog created

---

## Business Rules

1. **Asset Available** - Asset must be in a transferable state (available, in_use)
2. **Different Location** - Destination must be different from current location
3. **Approval Required** - All transfers require approval (no auto-approve)
4. **Department Scope** - Staff can only initiate transfers within their department (configurable)

---

## Activity Log Events

| Event | Data Captured |
|-------|----------------|
| TRANSFER_INITIATED | asset_id, from_location, to_location, initiated_by |
| TRANSFER_APPROVED | asset_id, approved_by |
| TRANSFER_REJECTED | asset_id, rejected_by, reason |

---

## Related Documents

- [Location Hierarchy](../location/hierarchy.md) - Location structure
- [Asset Lifecycle](../assets/lifecycle.md) - pending_transfer status
- [Audit Trail](../audit/trail.md) - Transfer event tracking