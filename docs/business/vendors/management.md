# Vendor Management

## Overview

The vendor management module maintains the list of suppliers and service providers used for asset acquisition and maintenance.

**PRD Reference:** Section 4.1.3

---

## Vendor Entity

### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | Yes | Primary key |
| name | string | Yes | Vendor name |
| code | string | Yes | Unique vendor code |
| email | string | No | Contact email |
| phone | string | No | Contact phone |
| address | text | No | Physical address |
| contact_person | string | No | Primary contact name |
| category | enum | Yes | vendor_type (supplier, service_provider, manufacturer) |
| is_active | boolean | Yes | Active status (default: true) |
| notes | text | No | Additional notes |
| created_by | uuid | Yes | Creator user ID |
| created_at | datetime | Yes | Creation timestamp |
| updated_at | datetime | Yes | Update timestamp |

### Vendor Category Enum

```ts
enum VendorCategory: string
{
    case SUPPLIER = 'supplier';
    case SERVICE_PROVIDER = 'service_provider';
    case MANUFACTURER = 'manufacturer';
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/vendors` | List vendors (with filters) |
| POST | `/api/v1/vendors` | Create vendor |
| GET | `/api/v1/vendors/{id}` | Get vendor detail |
| PATCH | `/api/v1/vendors/{id}` | Update vendor |
| DELETE | `/api/v1/vendors/{id}` | Soft delete vendor |

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| category | Filter by vendor category |
| is_active | Filter by active status |
| search | Search by name or code |

---

## Response Format

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "PT Teknologi Maju",
      "code": "VND-001",
      "email": "contact@teknologimaju.id",
      "phone": "+62-21-1234567",
      "address": "Jakarta Selatan",
      "contact_person": "John Doe",
      "category": "supplier",
      "is_active": true,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 25,
    "total": 50
  }
}
```

---

## Business Rules

1. **Unique Code** - Vendor code must be unique across all vendors
2. **Active Status** - Inactive vendors cannot be selected in new transactions
3. **Soft Delete** - Deleting a vendor sets is_active=false (data preserved)
4. **Category Required** - Must specify vendor category on creation

---

## Related Documents

- [Assets Overview](../assets/overview.md) - Vendor reference in asset
- [Maintenance Overview](../maintenance/overview.md) - Maintenance vendors