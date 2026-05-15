# Check-In / Check-Out Process

## Overview

The check-in/check-out system tracks asset assignments to employees or departments. It maintains custody records and enables overdue tracking.

---

## Checkout Process

### Step 1: Initiate Checkout

**Endpoint:** `POST /api/v1/checkout`

**Request:**
```json
{
  "asset_id": "uuid-of-asset",
  "assignee_id": "uuid-of-user",
  "expected_return_date": "2026-06-15",
  "notes": "Assigned for project X"
}
```

**Preconditions:**
- Asset status must be `available`
- Assignee must exist and be active
- Asset must not already be assigned

**Validation Rules:**
- `asset_id`: Required, must exist, must be available
- `assignee_id`: Required, must exist, user status = active
- `expected_return_date`: Optional, must be future date
- `notes`: Optional, max 1000 chars

---

### Step 2: System Processing

On successful checkout:

1. **Update Asset**
   - Status → `in_use`
   - Custodian → assignee_id
   - Updated timestamp

2. **Create CheckoutLog**
   ```json
   {
     "asset_id": "uuid",
     "assigned_to": "uuid",
     "checkout_date": "2026-05-05",
     "expected_return_date": "2026-06-15",
     "assigned_by": "uuid-of-initiator",
     "notes": "..."
   }
   ```

3. **Create ActivityLog**
   - Action: `CHECKED_OUT`
   - Records old and new custodian

4. **Send Notification** (async)
   - Email to assignee with asset details
   - In-app notification

---

### Step 3: Response

**Success (201):**
```json
{
  "status": true,
  "data": {
    "id": "log-uuid",
    "asset_id": "uuid",
    "status": "in_use",
    "checkout_date": "2026-05-05",
    "expected_return_date": "2026-06-15"
  },
  "message": "success",
  "code": 201
}
```

**Error (400):**
```json
{
  "status": false,
  "errors": {
    "asset_id": ["Asset is not available for checkout"]
  },
  "message": "Validation failed",
  "code": 400
}
```

---

## Check-In Process

### Step 1: Initiate Check-In

**Endpoint:** `POST /api/v1/checkin/{log_id}`

**Request:**
```json
{
  "condition": "good",
  "notes": "Returned in good condition"
}
```

**Preconditions:**
- CheckoutLog must exist
- Asset status must be `in_use`
- Log must not have return_date (not already checked in)

**Validation Rules:**
- `condition`: Required, enum (new, good, fair, poor)
- `notes`: Optional, max 1000 chars

---

### Step 2: System Processing

On successful check-in:

1. **Update Asset**
   - Status → `available`
   - Custodian → null

2. **Update CheckoutLog**
   - return_date → current date
   - condition_on_return → provided condition
   - notes → appended

3. **Create ActivityLog**
   - Action: `CHECKED_IN`
   - Records condition on return

---

### Step 3: Response

**Success (200):**
```json
{
  "status": true,
  "data": {
    "id": "log-uuid",
    "asset_id": "uuid",
    "status": "available",
    "checkout_date": "2026-05-05",
    "return_date": "2026-05-20",
    "condition_on_return": "good"
  },
  "message": "success",
  "code": 200
}
```

---

## Overdue Tracking

### Automatic Detection

A background job checks for overdue checkouts:

```bash
# Runs hourly via scheduler
php artisan assets:check-overdue
```

**Logic:**
```ts
const overdueLogs = CheckoutLog.whereNull('return_date')
    .where('expected_return_date', '<', new Date())
    .get();
```

### Overdue Notification

For each overdue checkout:
1. Create notification for assignee
2. Create notification for assignee's manager
3. Log activity

---

## Query Endpoints

### Get Asset Checkout History

```
GET /api/v1/assets/{id}/checkouts
```

**Response:**
```json
{
  "data": [
    {
      "id": "log-uuid",
      "assigned_to": { "id": "user-uuid", "name": "John Doe" },
      "checkout_date": "2026-05-01",
      "expected_return_date": "2026-05-15",
      "return_date": "2026-05-14",
      "condition_on_return": "good",
      "status": "returned"
    }
  ]
}
```

### Get User's Assigned Assets

```
GET /api/v1/users/{id}/assigned-assets
```

---

## Business Rules

### Checkout

1. **Asset must be available** - Cannot checkout if in_use, under_maintenance, etc.
2. **User must be active** - Cannot assign to inactive user
3. **Department scope** - Staff can only checkout assets in their department (configurable)
4. **Expected return date** - Optional but recommended; triggers overdue if set

### Check-In

1. **Asset must be in_use** - Must have active checkout
2. **Condition required** - Must record physical condition on return
3. **One-time only** - Cannot check-in same log twice

### Overdue

1. **Automatic detection** - Job runs hourly
2. **Multiple notifications** - Assignee + Manager
3. **Asset remains in_use** - Overdue does not auto-return

---

## Activity Log Events

| Event | Fields Recorded |
|-------|-----------------|
| CHECKED_OUT | user_id, assignee_id, expected_return_date |
| CHECKED_IN | user_id, condition_on_return |
| OVERDUE_DETECTED | days_overdue |

---

## Related Documents

- [Lifecycle](lifecycle.md) - Status state transitions
- [Overview](overview.md) - Asset attributes