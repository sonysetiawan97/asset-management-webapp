# Disposal Workflow

## Overview

The disposal workflow handles the end-of-life process for assets that are no longer useful or can be retired from service.

**PRD Reference:** Section 4.4.3

---

## Disposal Process Flow

```
┌─────────────────┐
│  Initiate       │  POST /api/v1/disposals
│  Request        │  { asset_id, method, reason, ... }
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Pending       │  Status: pending_approval
│  Approval      │  Wait for Administrator
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
│ Set     │ │ Return  │
│ Disposed│ │ to      │
│ Status  │ │ Original│
└─────────┘ └─────────┘
```

---

## DisposalRequest Entity

### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | Yes | Primary key |
| asset_id | uuid | Yes | Reference to asset |
| method | enum | Yes | Disposal method |
| reason | text | Yes | Reason for disposal |
| sale_price | decimal | Conditional | Sale price (if resale) |
| buyer | string | Conditional | Buyer name (if resale) |
| transaction_date | date | Conditional | Sale date (if resale) |
| certificate_ref | string | Conditional | Certificate number (if scrapped/recycled) |
| status | enum | Yes | pending, approved, rejected |
| approved_by | uuid | No | Approver user ID |
| approved_at | datetime | No | Approval timestamp |
| created_by | uuid | Yes | Initiator user ID |
| created_at | datetime | Yes | Creation timestamp |

### Disposal Method Enum

```ts
enum DisposalMethod: string
{
    case RESALE = 'resale';
    case SCRAPPED = 'scrapped';
    case DONATED = 'donated';
    case RECYCLED = 'recycled';
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/disposals` | Initiate disposal request |
| GET | `/api/v1/disposals` | List disposal requests |
| GET | `/api/v1/disposals/{id}` | Get disposal detail |
| PATCH | `/api/v1/disposals/{id}/approve` | Approve disposal |
| PATCH | `/api/v1/disposals/{id}/reject` | Reject disposal |

---

## Workflow Steps

### Step 1: Initiate Disposal

**Request:**
```json
POST /api/v1/disposals
{
  "asset_id": "uuid-of-asset",
  "method": "scrapped",
  "reason": "Equipment severely damaged beyond repair",
  "certificate_ref": "CERT-2026-001"
}
```

**Alternate for resale:**
```json
{
  "asset_id": "uuid-of-asset",
  "method": "resale",
  "reason": "Upgraded to newer model",
  "sale_price": 500000,
  "buyer": "PT Second Hand Electronics",
  "transaction_date": "2026-05-01"
}
```

**Preconditions:**
- Asset must exist
- User must have dispose permission

**Result:**
- DisposalRequest created with status `pending`
- Asset status unchanged until approval

---

### Step 2: Approve Disposal

**Request:**
```json
PATCH /api/v1/disposals/{id}/approve
```

**Preconditions:**
- Status must be `pending`
- User must have approve permission (Administrator only)

**Result:**
- Asset status → `disposed`
- Asset soft-deleted from active inventory
- DisposalRequest status → `approved`
- ActivityLog created

---

### Step 3: Reject Disposal

**Request:**
```json
PATCH /api/v1/disposals/{id}/reject
{
  "reason": "Asset still under warranty"
}
```

**Preconditions:**
- Status must be `pending`

**Result:**
- DisposalRequest status → `rejected`
- Asset status unchanged

---

## Business Rules

1. **Admin Approval Required** - Only Administrator can approve disposals
2. **Method Required** - Must specify disposal method
3. **Method-Specific Fields** - Resale requires sale_price/buyer; scrapped requires certificate_ref
4. **Terminal State** - `disposed` is a terminal status (no outgoing transitions)
5. **Historical Access** - Disposed assets remain accessible in reports and audit trail

---

## Disposed Asset Handling

After disposal:
- Asset does NOT appear in normal asset lists
- Accessible via reports with filter `status=disposed`
- Accessible in audit trail queries
- Book value set to 0

---

## Activity Log Events

| Event | Data Captured |
|-------|----------------|
| DISPOSAL_INITIATED | asset_id, method, reason, initiated_by |
| DISPOSAL_APPROVED | asset_id, method, approved_by |
| DISPOSAL_REJECTED | asset_id, reason, rejected_by |

---

## Related Documents

- [Asset Lifecycle](../assets/lifecycle.md) - disposed status (terminal)
- [Audit Trail](../audit/trail.md) - Disposal event tracking
- [Reports](../reports/overview.md) - Disposed assets in reports