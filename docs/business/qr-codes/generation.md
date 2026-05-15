# QR Code Generation

## Overview

Each asset receives a unique QR code that enables quick identification and access via mobile device scanning.

**PRD Reference:** Section 4.3.1

---

## QR Code Content

The QR code encodes the asset's unique identifier:

```
https://assets.example.com/lookup/{asset_id}
```

Or for offline-capable lookup:
```
AST-2026-000001
```

---

## Generation Process

### Auto-Generation

QR code generated automatically on asset creation:

```ts
class Asset extends Model
{
    protected static boot()
    {
        super.boot();

        Asset.addAction('created', (asset) => {
            QrCodeService.generate(asset);
        });
    }
}
```

### QR Code Service

```ts
class QrCodeService
{
    public static generate(asset: Asset): QrCode
    {
        const content = asset.asset_code; // e.g., AST-2026-000001

        const qrCode = QrCode.format('png')
            .size(300)
            .generate(content);

        const path = `qr-codes/${asset.id}.png`;
        Storage.put(path, qrCode);

        return QrCode.create({
            asset_id: asset.id,
            code: content,
            file_path: path,
            generated_at: new Date(),
        });
    }
}
```

---

## QrCode Entity

### Attributes

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| asset_id | uuid | Reference to asset |
| code | string | Encoded value (asset_code) |
| file_path | string | Storage path to QR image |
| generated_at | datetime | Generation timestamp |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/assets/{id}/qr-code` | Get QR code image |
| GET | `/api/v1/assets/{id}/qr-code/download` | Download QR code PDF |
| POST | `/api/v1/assets/{id}/qr-code/regenerate` | Regenerate QR code |

---

## QR Code Image

- **Format:** PNG
- **Size:** 300x300 pixels
- **Content:** Asset code (text mode)
- **Storage:** Local disk or S3

---

## PDF Label Generation

QR codes can be exported as printable labels:

```json
GET /api/v1/assets/{id}/qr-code/download?format=pdf
```

Returns PDF with:
- Asset code
- Asset name
- QR code image
- Company logo (optional)

---

## Business Rules

1. **Auto-Create** - QR code generated on asset creation
2. **Unique Code** - Each asset has one QR code
3. **Regeneration** - Can regenerate if QR code damaged
4. **Offline Capable** - QR content works without network

---

## Related Documents

- [QR Code Scanning](scanning.md) - Mobile scanning process
- [Assets Overview](../assets/overview.md) - Asset identification
- [Attachments](attachments/handling.md) - File storage