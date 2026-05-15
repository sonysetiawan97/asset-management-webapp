# Asset Lifecycle

## Status States

An asset can be in one of the following statuses at any time:

| Status | Code | Description |
|--------|------|-------------|
| Available | `available` | Ready for assignment; in good condition |
| In Use | `in_use` | Currently assigned to an employee/department |
| Under Maintenance | `under_maintenance` | Undergoing scheduled or unscheduled repair |
| Reserved | `reserved` | Scheduled for future assignment |
| Lost | `lost` | Cannot be located after inventory check |
| Disposed | `disposed` | End-of-life; retired from service |
| Pending Transfer | `pending_transfer` | In transit between locations |

---

## State Diagram

```
                    ┌──────────────┐
                    │   AVAILABLE  │
                    └──────┬───────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌───────────┐ ┌─────────────┐
    │ CHECKOUT   │ │ RESERVED  │ │  MAINTENANCE│
    │  (In Use)  │ │           │ │             │
    └──────┬──────┘ └─────┬─────┘ └──────┬──────┘
           │             │              │
           ▼             │              ▼
    ┌─────────────┐      │      ┌──────────────┐
    │  CHECKIN    │      │      │  COMPLETED    │
    │(available)  │◄─────┘      │  (available)  │
    └─────────────┘             └──────────────┘
           │
           │ (disposal request)
           ▼
    ┌─────────────┐
    │  DISPOSED   │ ────────► [Terminal State]
    └─────────────┘

    ┌─────────────┐
    │    LOST     │ ────────► [Terminal State]
    └─────────────┘
```

---

## State Transitions

### Available → In Use

**Trigger:** Checkout workflow completed

```
POST /api/v1/checkout
{
  "asset_id": "uuid",
  "assignee_id": "uuid",
  "expected_return_date": "2026-06-01"
}
```

**Result:**
- Asset status → `in_use`
- Custodian → Assignee
- CheckoutLog created with expected return date

---

### In Use → Available

**Trigger:** Check-in workflow completed

```
POST /api/v1/checkin/{log_id}
{
  "condition": "good"  // condition on return
}
```

**Result:**
- Asset status → `available`
- Custodian → null
- CheckoutLog updated with return_date and condition

---

### Available → Under Maintenance

**Trigger:** Maintenance log created

**Result:**
- Asset status → `under_maintenance`
- MaintenanceLog created with details

---

### Under Maintenance → Available

**Trigger:** Maintenance completed

**Result:**
- Asset status → `available`
- MaintenanceLog updated with completion date

---

### Available/In Use → Reserved

**Trigger:** Reservation created

**Result:**
- Asset status → `reserved`
- Reservation record created

---

### Reserved → Available

**Trigger:** Reservation cancelled or expired

**Result:**
- Asset status → `available`

---

### Any State → Lost

**Trigger:** Manual flag by administrator

**Result:**
- Asset status → `lost`
- Activity logged

---

### Any State → Pending Transfer

**Trigger:** Transfer request initiated

**Result:**
- Asset status → `pending_transfer`
- TransferRequest created

---

### Pending Transfer → Available

**Trigger:** Transfer approved

**Result:**
- Asset status → `available`
- Location updated

---

### Available → Disposed

**Trigger:** Disposal request approved

```
POST /api/v1/disposals
{
  "asset_id": "uuid",
  "method": "scrapped", // resale, scrapped, donated, recycled
  "reason": "...",
  "certificate_ref": "..."
}
```

**Result:**
- Asset status → `disposed`
- Soft deleted from active view
- Accessible in historical reports only

---

## Terminal States

The following states have no outgoing transitions:

| State | Description |
|-------|-------------|
| `disposed` | Asset permanently retired |
| `lost` | Asset cannot be located |

---

## Business Rules

1. **Checkout requires available status** - Only assets with `available` status can be checked out
2. **Check-in requires in_use status** - Only assets with `in_use` status can be checked in
3. **Maintenance allowed on available/in_use** - Assets under maintenance cannot be checked out
4. **Disposal requires administrator approval** - Staff can initiate, admin must approve
5. **Transfer requires approval** - Unless admin-initiated

---

## Related Documents

- [Overview](overview.md) - Asset definitions and attributes
- [Checkout Process](checkout.md) - Check-in/check-out workflow
- [Depreciation](depreciation.md) - Status affects book value calculation