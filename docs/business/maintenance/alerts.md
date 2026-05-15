# Automated Alerts & Notifications

## Overview

The system automatically generates alerts for various asset-related events to keep users informed and proactive.

**PRD Reference:** Section 4.4.2

---

## Alert Types

| Alert Type | Trigger | Recipients |
|------------|----------|-------------|
| Warranty Expiry Warning | 30 days and 7 days before warranty end date | Custodian + Administrator |
| License Expiry Warning | 60 days and 14 days before license expiry | Custodian + Administrator |
| Scheduled Maintenance Due | On `next_maintenance_date` | Custodian + Staff/Manager |
| Overdue Check-In | Past `expected_return_date` with no `return_date` | Custodian + Manager |
| Asset Not Found | Asset flagged as `lost` | Administrator |

---

## Notification Delivery Methods

### 1. Email (via SMTP + Queues)

- Uses SMTP configuration
- Dispatched via background queue
- Delivery target: < 5 minutes from trigger

### 2. In-App Notifications

- Stored in `notifications` table
- React frontend polls every 60 seconds
- JSON endpoint: `GET /api/v1/notifications`

### 3. Queue Jobs

All alerts are processed via background queue:

| Job Class | Purpose |
|-----------|---------|
| `SendWarrantyAlert` | Warranty expiry warnings |
| `SendMaintenanceReminder` | Scheduled maintenance due |
| `SendOverdueNotice` | Overdue check-in alerts |

---

## Alert Configuration

### Configurable Thresholds

Administrators can configure alert thresholds via API:

```
GET /api/v1/admin/settings
PATCH /api/v1/admin/settings
```

| Setting | Default | Description |
|---------|---------|-------------|
| warranty_warning_days_1 | 30 | First warranty alert (days before) |
| warranty_warning_days_2 | 7 | Second warranty alert (days before) |
| license_warning_days_1 | 60 | First license alert (days before) |
| license_warning_days_2 | 14 | Second license alert (days before) |

---

## Notification Entity

### Attributes

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Recipient user |
| type | string | Alert type |
| message | text | Notification message |
| asset_id | uuid | Related asset (optional) |
| is_read | boolean | Read status |
| created_at | datetime | Creation timestamp |

---

## Scheduler Jobs

Alerts are generated via scheduler:

```ts
// Scheduled to run at specific intervals

// Check warranty expiries - runs daily at 6 AM
schedule('0 6 * * *', () => checkWarranties());

// Check maintenance due - runs daily at 7 AM
schedule('0 7 * * *', () => checkMaintenance());

// Check overdue check-ins - runs hourly
schedule('0 * * * *', () => checkOverdue());
```

---

## Alert Response Format

### In-App Notification

```json
{
  "data": [
    {
      "id": "uuid",
      "type": "warranty_expiry",
      "message": "Warranty for MacBook Pro (AST-2026-000001) expires in 7 days",
      "asset_id": "uuid",
      "is_read": false,
      "created_at": "2026-05-04T10:00:00Z"
    }
  ]
}
```

---

## Business Rules

1. **No Duplicate Alerts** - System tracks sent alerts to prevent duplicates
2. **Threshold Configurable** - All alert thresholds can be adjusted via admin settings
3. **Role-Based Recipients** - Different roles receive different alerts
4. **Queue Processing** - All alerts processed asynchronously within 5 minutes

---

## Related Documents

- [Maintenance Overview](overview.md) - Maintenance log creation
- [Notifications System](../notifications/system.md) - Notification system
- [Depreciation](../assets/depreciation.md) - Different from maintenance alerts