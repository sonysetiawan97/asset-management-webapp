# QR Code Scanning

## Overview

Mobile QR code scanning enables asset lookup and context-aware quick actions using the device camera. The scan interface supports browser-based scanning via `html5-qrcode`, manual fallback, and integration with active opname sessions.

**PRD Reference:** Section 4.5.2

---

## QR Scan Page

| Field | Value |
|-------|-------|
| Route | `/scan` |
| Component | `ScanPage.tsx` |
| Required Permission | Staff/Manager, Administrator |
| Library | `html5-qrcode` (browser-based) |

---

## Camera Initialization & Permission Handling

The scanning interface uses `html5-qrcode` npm library for browser-based camera access.

| Scenario | System Behavior |
|----------|----------------|
| Camera permission granted | Camera stream starts immediately; scan viewport displayed |
| Permission prompt shown | User prompted to allow camera access |
| Permission denied | Permission denied UI displayed; manual input fallback shown |
| Permission denied forever | "Allow in Settings" message with instructions; manual input fallback |
| No camera available | Manual input fallback shown automatically |
| HTTPS not available | Warning banner shown; scanning may still work depending on browser |

> **Security Note:** Camera access requires HTTPS. The system displays a warning if accessed over HTTP.

---

## Scan Workflow

```
┌─────────────────┐
│  Open Scan Page │  Navigate to /scan; camera initialized
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Point Camera   │  html5-qrcode detects and decodes QR in real-time
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Validate URL   │  Decode QR → extract signed URL → call validation API
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Context Check  │  Determine scan result behavior based on context
└───────┬─────────┘
        │
    ┌───┴────────────────────┬──────────────┬─────────────┐
    ▼                        ▼              ▼             ▼
┌─────────┐          ┌─────────────┐  ┌──────────┐  ┌──────────┐
│ Default │          │ Opname      │  │ Check-In │  │ Unknown  │
│ Navigate│          │ Active      │  │ Flow     │  │ Context  │
│ to Asset│          │ Count Link  │  │ Check-In │  │ Navigate │
│ Detail  │          │ Prompt      │  │ Button   │  │ to Asset │
└─────────┘          └─────────────┘  └──────────┘  └──────────┘
```

---

## Context-Aware Scan Behaviour

| Context | URL Decoded | Behaviour |
|--------|-------------|-----------|
| Default | `/assets/{id}` | Navigate to asset detail page |
| Opname Active | `/assets/{id}` | Show "Count This Asset" prompt → link to `/opname/{session_id}/count?asset={id}` |
| Check-In Flow | `/assets/{id}` | Show "Check In This Asset" action button |
| Maintenance | `/assets/{id}` | Show "Log Maintenance" action button |
| Unknown Context | Any valid asset URL | Navigate to asset detail page |

---

## Scan Feedback States

| State | UI Feedback |
|-------|-------------|
| Camera initializing | Loading spinner + "Menginisialisasi kamera..." |
| Camera ready | Live camera feed with scan frame overlay |
| QR detected | Green flash + haptic feedback (if supported) |
| Validation in progress | Loading spinner over camera feed |
| Valid QR / navigate | Success toast: "Asset ditemukan: {asset_name}"; navigate |
| Invalid / expired QR | Error toast: "QR code tidak valid"; scan ready state restored |
| Asset not found | Error toast: "Asset tidak ditemukan"; scan ready state restored |
| Camera permission denied | Full-page fallback with manual input form |

---

## Manual Fallback

When camera is unavailable or permission is denied, the scan page displays a manual asset code input form.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Asset Code | Text input | Yes | Format: `AST-YYYY-XXXXXX` |
| Submit | Button | — | Triggers `/api/v1/assets/lookup?asset_code={code}` API |

On valid asset code entry, the system navigates to the asset detail page using the same logic as camera scan.

---

## Opname Scan Integration

During an active opname session, the scan page has additional behavior.

### Active Session Detection
- System checks for active opname session (`status = in_progress`) on page load via `GET /api/v1/opname/sessions?status=in_progress`
- Session indicator banner shows active session name (e.g., "Stock Opname 2026 — Sedang Aktif")

### Asset Countable Check
- After QR decode, system calls `GET /api/v1/opname/sessions/{id}/items?asset_id={uuid}` to verify asset is in session's opname item list
- **Countable Asset:** "Hitung Asset Ini" button shown → navigates to count form with asset pre-filled
- **Non-Countable Asset:** Toast: "Asset ini tidak termasuk dalam sesi opname aktif"; still navigates to detail page
- **Session Scope Mismatch:** If session is scoped to a department/location and scanned asset is outside scope, warning shown

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/opname/sessions?status=in_progress` | Get active opname session for context detection |
| GET | `/api/v1/opname/sessions/{id}/items?asset_id={uuid}` | Check if asset is in opname item list (scan count eligibility) |
| GET | `/api/v1/assets/lookup?asset_code={code}` | Lookup asset by manual code input (fallback) |
| GET | `/api/v1/assets/{id}` | Get asset data for scan validation |

---

## Error Handling Matrix

| Error Type | Cause | User Message | Recovery |
|------------|-------|-------------|----------|
| Invalid QR Format | QR contains non-asset URL | "Format QR code tidak dikenali" | Auto-retry scan |
| Expired Signed URL | QR URL signature expired | "QR code sudah kadaluarsa" | Direct user to asset list |
| Asset Not Found | Asset ID in QR no longer exists | "Asset tidak ditemukan di sistem" | Offer manual lookup |
| Network Error | API call fails | "Tidak dapat terhubung ke server" | Retry button |
| Camera Not Supported | Browser doesn't support camera API | "Perangkat tidak mendukung pemindaian kamera" | Show manual fallback |

---

## Print Optimization

The QR label print view (`/assets/qr-print`) is designed for label printers.

- **Label Size:** 62mm × 38mm (Avery standard)
- **Layout:** Asset ID + Asset Name + QR Code PNG (centered)
- **CSS:** `@media print` rules for precise sizing
- **Batch Print:** Multi-select assets → print all labels in single print job
- **Browser Support:** Chrome, Edge recommended for print accuracy

---

## Business Rules

1. **Code Validation** — Must match valid asset_code format `AST-YYYY-XXXXXX`
2. **Asset Existence** — Return 404 if not found
3. **Status Display** — Show current status (available/in_use/etc)
4. **Permission Check** — Actions respect user role permissions
5. **Opname Context** — Active opname session enables count workflow
6. **Manual Fallback** — Always available when camera unavailable
7. **HTTPS Requirement** — Warn if accessed over HTTP

---

## Related Documents

- [QR Code Generation](generation.md) — QR code creation
- [Assets Overview](../assets/overview.md) — Asset lookup
- [Opname Workflow](../opname/workflow.md) — Opname count process