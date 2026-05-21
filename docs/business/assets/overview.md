# Asset Domain Overview

## Definition

An **Asset** is any physical or digital resource owned by the organization with economic value that requires tracking throughout its lifecycle.

## Asset Types

### Categories

| Category | Examples |
|----------|----------|
| Hardware | Computers, Servers, Networking Equipment, Mobile Devices |
| Software | Licenses, Subscriptions, SaaS Applications |
| Furniture & Fixtures | Desks, Chairs, Shelving, Partitions |
| Vehicles | Cars, Motorcycles, Trucks, Heavy Equipment |
| Office Equipment | Printers, Projectors, Photocopiers |
| Infrastructure | Electrical Systems, HVAC, Plumbing, Security |
| Other | Miscellaneous assets |

### Sub-categories

Each category can have sub-categories:
- Hardware → Computers → Laptops, Desktops
- Hardware → Servers → Rack Servers, Blade Servers

---

## Asset Identification

### Asset Code

System-generated unique identifier.

**Format:** `AST-YYYY-XXXXXX`

```
AST-2026-000001
└─┬─┘   └──┬──┘ └┬┘
 │   Year │  Sequence (6 digits)
 └── AST (Asset prefix)
```

### Additional Identifiers

| Field | Description | Example |
|-------|-------------|---------|
| Serial Number | Manufacturer/vendor serial | SN-2024-ABC123 |
| Asset Tag | Physical label for scanning | AST-TAG-001 |
| QR Code | System-generated for mobile scanning | URL to asset detail |

---

## Asset Attributes

### Core Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Descriptive name (255 chars max) |
| asset_code | string | Yes | System-generated unique code |
| serial_number | string | No | Manufacturer serial number |
| brand | string | No | Brand / manufacturer, e.g., Dell, HP, Herman Miller |
| model_number | string | No | Model identifier |
| category_id | uuid | Yes | Reference to category |
| location_id | uuid | No | Current location |
| department_id | uuid | Yes | Owning department |
| vendor_id | uuid | No | Purchase vendor |
| custodian_id | uuid | No | Current custodian (user) |

### Financial Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| purchase_price | decimal | Yes | Original acquisition cost |
| purchase_date | date | Yes | Date of acquisition |
| salvage_value | decimal | No | Residual value at end of life |
| useful_life_years | int | No | Expected useful life in years |
| book_value | decimal | No | Current book value (calculated) |

### Tracking Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| status | enum | Yes | Current status |
| condition | enum | Yes | Physical condition |
| warranty_start | date | No | Warranty start date |
| warranty_end | date | No | Warranty expiration date |
| license_key | string | No | License key (encrypted, software only) |
| license_expiry | date | No | License expiration (software only) |

### Metadata

| Attribute | Type | Description |
|-----------|------|-------------|
| notes | text | Additional notes |
| created_by | uuid | Creator user ID |
| updated_by | uuid | Last updater user ID |
| created_time | datetime | Creation timestamp |
| updated_time | datetime | Last update timestamp |

---

## Domain Relationships

```
Asset
├── belongsTo Category (category_id)
├── belongsTo Location (location_id)
├── belongsTo Department (department_id)
├── belongsTo User (vendor_id) - optional vendor
├── belongsTo User (custodian_id) - current holder
├── hasMany MaintenanceLog
├── hasMany CheckoutLog
├── hasMany Attachment
├── hasMany ActivityLog (audit trail)
└── morphMany Notification
```

---

## Related Documents

- [Asset Lifecycle](lifecycle.md) - Status states and transitions
- [Depreciation](depreciation.md) - Book value calculation
- [Checkout Process](checkout.md) - Assignment workflow