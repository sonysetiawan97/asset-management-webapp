# Depreciation

## Overview

Depreciation calculates the decrease in an asset's value over time. This document defines the depreciation method and rules used in the system.

---

## Depreciation Method

**Primary Method:** Straight-Line Depreciation

> **Note:** Declining Balance method is deferred to Phase 2.

---

## Straight-Line Formula

```
Annual Depreciation = (Purchase Price - Salvage Value) ÷ Useful Life (Years)

Book Value = Purchase Price - (Annual Depreciation × Years Since Purchase)
```

### Example

| Field | Value |
|-------|-------|
| Purchase Price | $10,000 |
| Salvage Value | $1,000 |
| Useful Life | 5 years |
| Annual Depreciation | ($10,000 - $1,000) ÷ 5 = $1,800/year |

**Book Value Calculation:**

| Year | Calculation | Book Value |
|------|-------------|------------|
| 0 (Purchase) | - | $10,000 |
| 1 | $10,000 - $1,800 | $8,200 |
| 2 | $8,200 - $1,800 | $6,400 |
| 3 | $6,400 - $1,800 | $4,600 |
| 4 | $4,600 - $1,800 | $2,800 |
| 5 | $2,800 - $1,800 | $1,000 (floor at salvage) |

---

## Asset Attributes for Depreciation

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| purchase_price | decimal | Yes | Original acquisition cost |
| salvage_value | decimal | No | Residual value at end of life (default: 0) |
| useful_life_years | int | No | Expected useful life in years (default: based on category) |
| book_value | decimal | No | Current calculated book value |

---

## Category Defaults

Each category can define default depreciation settings:

| Category | Default Useful Life | Default Salvage Value |
|----------|--------------------|---------------------|
| Computers | 3 years | 10% of purchase price |
| Servers | 5 years | 15% of purchase price |
| Vehicles | 5 years | 20% of purchase price |
| Furniture | 7 years | 10% of purchase price |
| Office Equipment | 5 years | 5% of purchase price |
| Software (License) | License duration | 0 |

---

## Calculation Rules

### 1. Book Value Floor

Book value **never goes below** salvage value:

```
IF book_value < salvage_value THEN book_value = salvage_value
```

### 2. Useful Life Override

Per-asset `useful_life_years` overrides category default.

### 3. Salvage Value Override

Per-asset `salvage_value` overrides category default.

### 4. Disposed Assets

When asset status becomes `disposed`:
- Book value set to 0
- No further depreciation calculations

### 5. Fully Depreciated Assets

Assets with book_value ≤ salvage_value:
- Still tracked in system
- Book value displayed as salvage value
- No further depreciation until disposal

---

## Calculation Process

### Automated (Recommended)

Run via Artisan command monthly:

```bash
php artisan assets:calculate-depreciation
```

**Process:**
1. Query all active assets (status != disposed, lost)
2. For each asset:
   - Calculate years since purchase (floor)
   - Apply straight-line formula
   - Update book_value (floored at salvage_value)
3. Log results

### On-Demand (Manual)

```ts
const asset = await Asset.find(id);
const depreciation = new DepreciationService();
const currentValue = depreciation.calculateBookValue(asset);
```

---

## API Endpoints

### Get Depreciation Report

```
GET /api/v1/reports/depreciation
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category_id | uuid | Filter by category |
| department_id | uuid | Filter by department |
| date_from | date | Calculate as of date |
| date_to | date | Calculate as of date |

**Response:**
```json
{
  "data": [
    {
      "asset_id": "uuid",
      "asset_code": "AST-2026-000001",
      "name": "MacBook Pro",
      "purchase_price": 10000.00,
      "salvage_value": 1000.00,
      "useful_life_years": 3,
      "years_depreciated": 1,
      "annual_depreciation": 3000.00,
      "accumulated_depreciation": 3000.00,
      "book_value": 7000.00
    }
  ],
  "summary": {
    "total_assets": 100,
    "total_purchase_value": 500000.00,
    "total_book_value": 350000.00,
    "total_accumulated_depreciation": 150000.00
  }
}
```

---

## Business Rules

1. **Depreciation runs monthly** - Automated via scheduler
2. **Zero salvage if not set** - Default is 0 if not specified
3. **Category defaults applied** - If asset values not set, use category
4. **Disposed = zero book value** - Assets marked disposed have book_value = 0
5. **No negative book value** - Floor applied at salvage_value

---

## Related Documents

- [Overview](overview.md) - Asset attributes
- [Lifecycle](lifecycle.md) - Disposed state transition