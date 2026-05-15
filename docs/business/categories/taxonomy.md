# Category Taxonomy

## Overview

Assets are organized using a hierarchical category system to support filtered reporting and department-level analysis.

**PRD Reference:** Section 4.1.2

---

## Category Hierarchy

```
Category
└── Sub-Category
    └── Asset Type
```

---

## Default Category Taxonomy

| Category | Sub-Categories |
|----------|-----------------|
| Hardware | Computers, Servers, Networking, Peripherals, Mobile Devices |
| Software | Licenses, Subscriptions, SaaS Applications |
| Furniture & Fixtures | Desks, Chairs, Shelving, Partitions |
| Vehicles | Cars, Motorcycles, Trucks, Heavy Equipment |
| Office Equipment | Printers, Projectors, Photocopiers, Whiteboards |
| Infrastructure | Electrical, HVAC, Plumbing, Security Systems |
| Other | Miscellaneous assets |

---

## Category Entity

### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | Yes | Primary key |
| name | string | Yes | Category name |
| parent_id | uuid | No | Reference to parent category |
| useful_life_years | int | No | Default useful life for assets in this category |
| salvage_value_pct | decimal | No | Default salvage value percentage |
| created_at | datetime | Yes | Creation timestamp |
| updated_at | datetime | Yes | Update timestamp |

---

## Self-Referential Relationship

Categories use self-referential hierarchy:

```ts
class Category extends Model
{
    public parent(): BelongsTo
    {
        return this.belongsTo(Category, 'parent_id');
    }

    public children(): HasMany
    {
        return this.hasMany(Category, 'parent_id');
    }

    public assets(): HasMany
    {
        return this.hasMany(Asset);
    }
}
```

---

## Category Defaults for Depreciation

Each category can define default depreciation settings:

| Category | Default Useful Life | Default Salvage % |
|----------|---------------------|-------------------|
| Computers | 3 years | 10% |
| Servers | 5 years | 15% |
| Vehicles | 5 years | 20% |
| Furniture | 7 years | 10% |
| Office Equipment | 5 years | 5% |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories` | List categories (tree structure) |
| POST | `/api/v1/categories` | Create category |
| GET | `/api/v1/categories/{id}` | Get category detail |
| PATCH | `/api/v1/categories/{id}` | Update category |
| DELETE | `/api/v1/categories/{id}` | Delete category (if no assets) |
| GET | `/api/v1/categories/{id}/children` | Get child categories |
| GET | `/api/v1/categories/{id}/assets` | Get assets in category |

---

## Business Rules

1. **Unique Name** - Category names must be unique at same level
2. **No Circular Reference** - Parent cannot be its own descendant
3. **Asset Count** - Category with assets cannot be deleted (must reassign first)
4. **Default Inheritance** - New assets inherit category depreciation defaults

---

## Related Documents

- [Assets Overview](../assets/overview.md) - Asset categorization
- [Depreciation](../assets/depreciation.md) - Category default depreciation
- [Reports Overview](../reports/overview.md) - Category-based reports