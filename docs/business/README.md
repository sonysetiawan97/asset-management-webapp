# Business Logic Documentation

> Detailed business rules and processes for this project.

---

## Domain Index

### Assets

| Document | Description |
|----------|-------------|
| [assets/overview](assets/overview.md) | Asset domain overview, definitions |
| [assets/lifecycle](assets/lifecycle.md) | Asset lifecycle states and transitions |
| [assets/depreciation](assets/depreciation.md) | Depreciation calculation rules |
| [assets/checkout](assets/checkout.md) | Check-in/check-out process |

### Locations & Departments

| Document | Description |
|----------|-------------|
| [location/hierarchy](location/hierarchy.md) | Location structure and hierarchy |
| [departments/overview](departments/overview.md) | Department entity and relationships |
| [departments/management](departments/management.md) | Department CRUD, deactivation, RBAC |

### Transfers

| Document | Description |
|----------|-------------|
| [transfer/workflow](transfer/workflow.md) | Asset transfer process |

### Maintenance

| Document | Description |
|----------|-------------|
| [maintenance/overview](maintenance/overview.md) | Maintenance logging |
| [maintenance/alerts](maintenance/alerts.md) | Automated alerts |

### Opname

| Document | Description |
|----------|-------------|
| [opname/sessions](opname/sessions.md) | OpnameSession entity, statuses, API |
| [opname/items](opname/items.md) | OpnameItem entity, counted statuses |
| [opname/workflow](opname/workflow.md) | Counting workflow, 9 steps |
| [opname/reports](opname/reports.md) | Opname-specific reports |
| [opname/notifications](opname/notifications.md) | Opname alert triggers |

### Disposal

| Document | Description |
|----------|-------------|
| [disposal/workflow](disposal/workflow.md) | Asset disposal process |

### Reports

| Document | Description |
|----------|-------------|
| [reports/overview](reports/overview.md) | Report types and filters |

### Audit

| Document | Description |
|----------|-------------|
| [audit/trail](audit/trail.md) | Audit trail logging |

### Categories

| Document | Description |
|----------|-------------|
| [categories/taxonomy](categories/taxonomy.md) | Category hierarchy |

### Vendors

| Document | Description |
|----------|-------------|
| [vendors/management](vendors/management.md) | Vendor management |

### Attachments

| Document | Description |
|----------|-------------|
| [attachments/handling](attachments/handling.md) | File upload and signed URLs |

### QR Codes

| Document | Description |
|----------|-------------|
| [qr-codes/generation](qr-codes/generation.md) | QR code creation |
| [qr-codes/scanning](qr-codes/scanning.md) | QR code mobile scanning |

### Roles & Permissions

| Document | Description |
|----------|-------------|
| [roles/overview](roles/overview.md) | Role definitions |
| [roles/permissions](roles/permissions.md) | Permission matrix |

### Authentication

| Document | Description |
|----------|-------------|
| [authentication/flow](authentication/flow.md) | Sanctum SPA auth flow |

### Notifications

| Document | Description |
|----------|-------------|
| [notifications/system](notifications/system.md) | Notification delivery |

---

## How to Use

Reference these documents when working on specific features:

```markdown
## Key References
- Tech Governance: docs/governance/
- Business Logic:
  - Asset Overview: docs/business/assets/overview.md
  - Depreciation Rules: docs/business/assets/depreciation.md
```

---

## Adding New Business Domains

1. Create folder: `docs/business/{domain-name}/`
2. Add overview.md as entry point
3. Add topic-specific docs (lifecycle, processes, etc.)
4. Update this README with new domain