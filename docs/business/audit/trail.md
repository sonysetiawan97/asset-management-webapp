# Audit Trail

## Overview

The audit trail provides a comprehensive, immutable record of all asset-related changes for compliance and investigation purposes.

**PRD Reference:** Section 4.5.3

---

## ActivityLog Entity

### Attributes

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| asset_id | uuid | Reference to asset (nullable for system events) |
| user_id | uuid | User who performed the action |
| action | string | Action type |
| field_changed | string | Field name that changed |
| old_value | text | Previous value |
| new_value | text | New value |
| ip_address | string | Client IP address |
| created_at | datetime | Timestamp (immutable) |

---

## Logged Events

| Event | Data Captured |
|-------|----------------|
| Asset Created | User, timestamp, all initial field values |
| Asset Updated | User, timestamp, field name, old value, new value |
| Status Changed | User, timestamp, previous status, new status, reason |
| Asset Checked Out | User, assignee, timestamp, expected return date |
| Asset Checked In | User, timestamp, condition on return |
| Maintenance Logged | User, timestamp, maintenance details |
| Asset Disposed | User, timestamp, disposal method, approver |
| User Login | User ID, timestamp, IP address |
| Report Downloaded | User, timestamp, report type |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/audit-trail` | List audit entries (filterable) |
| GET | `/api/v1/audit-trail/export?format=csv` | Export to CSV |
| GET | `/api/v1/audit-trail/export?format=pdf` | Export to PDF |
| GET | `/api/v1/assets/{id}/history` | Asset-specific history |

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| asset_id | Filter by specific asset |
| user_id | Filter by user |
| action | Filter by action type |
| date_from | Filter start date |
| date_to | Filter end date |

---

## Response Format

```json
{
  "data": [
    {
      "id": "uuid",
      "asset_id": "uuid",
      "user_id": "uuid",
      "action": "ASSET_UPDATED",
      "field_changed": "status",
      "old_value": "available",
      "new_value": "in_use",
      "ip_address": "192.168.1.100",
      "created_at": "2026-05-04T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 25,
    "total": 1000
  }
}
```

---

## Immutability Rules

1. **Insert-Only** - No UPDATE or DELETE allowed on activity_logs
2. **No updated_at** - Table has only created_at
3. **Server-Side Enforcement** - All roles are blocked from modifying logs

---

## Retention Policy

- **Minimum:** 5 years retention
- **Storage:** Database storage (activity_logs table)
- **Archival:** Can be archived to cold storage after retention period

---

## Export Functionality

### CSV Export

```
GET /api/v1/audit-trail/export?format=csv&date_from=2026-01-01&date_to=2026-12-31
```

Returns CSV file with headers: id, asset_id, user_id, action, field_changed, old_value, new_value, ip_address, created_at

### PDF Export

```
GET /api/v1/audit-trail/export?format=pdf&date_from=2026-01-01&date_to=2026-12-31
```

Returns PDF document formatted for printing/archiving

---

## Business Rules

1. **Automatic Logging** - All asset mutations logged via observers
2. **User Attribution** - Every action linked to user_id
3. **Timestamp Accuracy** - Use server time, not client time
4. **Role-Based Access**
   - Administrator: Full access
   - Staff/Manager: Own department only
   - Auditor: Full access

---

## Related Documents

- [Asset Lifecycle](../assets/lifecycle.md) - Status change events
- [Checkout Process](../assets/checkout.md) - Check-in/out logging
- [Disposal Workflow](../disposal/workflow.md) - Disposal events
- [Roles & Permissions](../roles/permissions.md) - Audit trail access by role