# Maintenance Overview

## Overview

The maintenance module tracks all service and repair activities performed on assets throughout their lifecycle.

**PRD Reference:** Section 4.4.1

---

## Maintenance Types

| Type | Code | Description |
|------|------|-------------|
| Scheduled | `scheduled` | Pre-planned maintenance based on schedule |
| Corrective | `corrective` | Repairs performed due to breakdown/failure |
| Preventive | `preventive` | Proactive maintenance to prevent issues |
| Inspection | `inspection` | Regular inspection/audit of asset condition |

---

## MaintenanceLog Entity

### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | Yes | Primary key |
| asset_id | uuid | Yes | Reference to asset |
| type | enum | Yes | Maintenance type |
| date_performed | date | Yes | Date maintenance was performed |
| performed_by | string | Yes | Technician/vendor name |
| description | text | Yes | Description of work performed |
| cost | decimal | No | Cost of maintenance |
| next_maintenance_date | date | No | Scheduled next maintenance |
| created_by | uuid | Yes | User who logged the maintenance |
| created_at | datetime | Yes | Creation timestamp |

### Maintenance Type Enum

```ts
enum MaintenanceType: string
{
    case SCHEDULED = 'scheduled';
    case CORRECTIVE = 'corrective';
    case PREVENTIVE = 'preventive';
    case INSPECTION = 'inspection';
}
```

---

## Process Flow

```
Asset (available/in_use)
    │
    ▼
Create MaintenanceLog
    │
    ▼
Asset Status → under_maintenance
    │
    ▼
Maintenance Completed
    │
    ▼
Asset Status → available
    │
    ▼
Update next_maintenance_date if set
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/assets/{id}/maintenance` | List maintenance logs for asset |
| POST | `/api/v1/assets/{id}/maintenance` | Create maintenance log |
| GET | `/api/v1/maintenance/{id}` | Get maintenance detail |
| PATCH | `/api/v1/maintenance/{id}` | Update maintenance log |
| DELETE | `/api/v1/maintenance/{id}` | Delete maintenance log |

---

## Business Rules

1. **Status Change** - Creating a maintenance log changes asset status to `under_maintenance`
2. **Completion** - Completing maintenance changes status back to `available`
3. **Next Maintenance** - If `next_maintenance_date` is set, triggers scheduled maintenance alert
4. **Cost Tracking** - Optional cost field for financial tracking

---

## Maintenance with Attachments

Maintenance logs can include attachments (photos, documents):

```
POST /api/v1/assets/{id}/maintenance
{
  "type": "corrective",
  "date_performed": "2026-05-01",
  "performed_by": "Tech Service Indonesia",
  "description": "Replaced keyboard due to liquid damage",
  "cost": 250000,
  "next_maintenance_date": "2026-11-01",
  "attachments": [/* file uploads */]
}
```

File handling follows the same signed URL pattern as asset attachments.

---

## Related Documents

- [Asset Lifecycle](../assets/lifecycle.md) - under_maintenance status
- [Alerts](alerts.md) - Scheduled maintenance notifications
- [Attachments](../attachments/handling.md) - File upload process