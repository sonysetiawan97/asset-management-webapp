# QR Code Scanning

## Overview

Mobile interface enables asset lookup and quick actions via QR code scanning using device camera.

**PRD Reference:** Section 4.3.2

---

## Scanning Flow

```
┌─────────────────┐
│  Open Scanner  │  Mobile app → Camera
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Scan QR Code  │  Read AST-2026-000001
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Lookup Asset  │  GET /api/v1/assets/lookup/{code}
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Display Info   │  Show asset details + actions
└─────────────────┘
```

---

## Lookup Endpoint

```json
GET /api/v1/assets/lookup/{asset_code}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "asset_code": "AST-2026-000001",
    "name": "MacBook Pro M3",
    "category": "Computers",
    "location": "Building A - Floor 3",
    "status": "in_use",
    "custodian": "John Doe",
    "photo_url": "https://..."
  }
}
```

---

## Mobile Scanner Implementation

### Capacitor / React Native

```tsx
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

const scanAsset = async () => {
  const result = await BarcodeScanner.startScan();

  if (result.hasContent) {
    const code = result.content; // AST-2026-000001
    const response = await fetch(`/api/v1/assets/lookup/${code}`);
    const data = await response.json();
    navigateToAssetDetail(data.data.id);
  }
};
```

---

## Quick Actions

After scanning, user can perform:

| Action | Description |
|--------|-------------|
| View Details | Full asset information page |
| Check In | Quick check-in if asset checked out |
| Report Issue | Create maintenance request |
| View History | Audit trail for asset |

---

## Offline Mode

If network unavailable:
- Store scanned codes locally
- Sync when connection restored
- Show cached asset info if previously viewed

---

## Business Rules

1. **Code Validation** - Must match valid asset_code format
2. **Asset Existence** - Return 404 if not found
3. **Status Display** - Show current status (available/in_use/etc)
4. **Permission Check** - Actions respect user role permissions

---

## Error Handling

| Error | Response |
|-------|----------|
| Invalid code format | 400 Bad Request |
| Asset not found | 404 Not Found |
| Network error | Show cached/offline message |

---

## Related Documents

- [QR Code Generation](generation.md) - QR code creation
- [Assets Overview](../assets/overview.md) - Asset lookup