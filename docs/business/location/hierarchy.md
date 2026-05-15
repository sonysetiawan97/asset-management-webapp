# Location Hierarchy

## Overview

The location system provides a hierarchical structure to track where assets are physically located within the organization.

**PRD Reference:** Section 4.2.3

---

## Hierarchy Levels

The location hierarchy follows this structure:

```
Organization
└── Site/Campus
    └── Building
        └── Floor
            └── Room/Zone
```

### Level Definitions

| Level | Type | Description | Example |
|-------|------|-------------|---------|
| Organization | Root | The entire company | PT ABC Indonesia |
| Site/Campus | Level 1 | Main office or branch | Head Office Jakarta |
| Building | Level 2 | Building within site | Building A |
| Floor | Level 3 | Floor within building | Floor 3 |
| Room/Zone | Level 4 | Specific room/area | Room 301 |

---

## Location Entity

### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | Yes | Primary key |
| name | string | Yes | Location name |
| type | enum | Yes | site, building, floor, room |
| parent_id | uuid | No | Reference to parent location |
| code | string | No | Short code for easy reference |

### Location Types

```ts
enum LocationType: string
{
    case SITE = 'site';
    case BUILDING = 'building';
    case FLOOR = 'floor';
    case ROOM = 'room';
}
```

---

## Business Rules

1. **Minimum Level Required** - Assets must be assigned to at least Site level (Room is optional)
2. **Hierarchical Validation** - A location can only reference a parent of the next higher type
3. **Cascade Effects** - When a parent location is deleted, child locations should be reviewed

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/locations` | List all locations |
| POST | `/api/v1/locations` | Create location |
| GET | `/api/v1/locations/{id}` | Get location detail |
| PATCH | `/api/v1/locations/{id}` | Update location |
| DELETE | `/api/v1/locations/{id}` | Delete location |
| GET | `/api/v1/locations/{id}/children` | Get child locations |
| GET | `/api/v1/locations/tree` | Get full hierarchy tree |

---

## Location History

Location changes for assets are tracked via ActivityLog:

```json
{
  "action": "LOCATION_CHANGED",
  "asset_id": "uuid",
  "field_changed": "location_id",
  "old_value": "old_location_id",
  "new_value": "new_location_id"
}
```

---

## Bulk Location Update

Assets can be moved in bulk via dedicated endpoint:

```
PATCH /api/v1/assets/bulk-location
{
  "asset_ids": ["uuid1", "uuid2"],
  "location_id": "new_location_id"
}
```

---

## Related Documents

- [Assets Overview](../assets/overview.md) - Asset location relationship
- [Transfer Workflow](../transfer/workflow.md) - Asset transfer between locations
- [Audit Trail](../audit/trail.md) - Location change tracking