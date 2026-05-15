# Attachment Handling

## Overview

The attachment module handles file uploads for assets, maintenance logs, and other entities. Uses signed URLs for secure, temporary access.

**PRD Reference:** Section 4.1.4

---

## Supported File Types

| Type | Extensions | Max Size |
|------|-------------|----------|
| Images | jpg, jpeg, png, gif, webp | 5 MB |
| Documents | pdf, doc, docx, xls, xlsx | 10 MB |
| Other | zip, rar | 10 MB |

---

## Attachment Entity

### Attributes

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| attachable_type | string | Model class (Asset, MaintenanceLog) |
| attachable_id | uuid | Related model ID |
| file_name | string | Original file name |
| file_path | string | Storage path |
| mime_type | string | MIME type |
| file_size | int | Size in bytes |
| uploaded_by | uuid | User who uploaded |
| created_at | datetime | Upload timestamp |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/attachments/upload` | Upload file |
| GET | `/api/v1/attachments/{id}/download` | Download with signed URL |
| GET | `/api/v1/assets/{id}/attachments` | List asset attachments |
| DELETE | `/api/v1/attachments/{id}` | Delete attachment |

---

## Upload Flow

### Step 1: Request Upload URL (Optional)

For large files or direct upload:

```json
POST /api/v1/attachments/upload
{
  "attachable_type": "Asset",
  "attachable_id": "uuid-of-asset",
  "file_name": "receipt.pdf",
  "mime_type": "application/pdf"
}
```

Response:
```json
{
  "upload_url": "https://storage.example.com/upload?signature=...",
  "attachment_id": "uuid"
}
```

### Step 2: Simple Upload (Default)

```multipart
POST /api/v1/assets/{id}/attachments
Content-Type: multipart/form-data

file: <binary>
```

---

## Signed URL Generation

Download URLs are signed with expiration:

```ts
const url = storage.disk('local').temporaryUrl(
    attachment.file_path,
    new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
);
```

- **Default expiration:** 15 minutes
- **Used for:** All download endpoints
- **Protection:** Prevents unauthorized access

---

## Storage Configuration

```ts
// config/filesystems.ts
disks: {
    local: {
        driver: 'local',
        root: storage_path('app/uploads'),
    },
    s3: {
        driver: 's3',
        // For production with AWS S3
    },
}
```

---

## Business Rules

1. **File Size Limit** - Enforced based on file type
2. **Extension Validation** - Only allowed extensions permitted
3. **Signed URLs** - All downloads use temporary signed URLs
4. **Soft Delete** - Attachment deletion removes file from storage

---

## Related Documents

- [Maintenance Overview](../maintenance/overview.md) - Maintenance attachments
- [Assets Overview](../assets/overview.md) - Asset document attachments
- [QR Codes](qr-codes/generation.md) - QR code attachment to assets