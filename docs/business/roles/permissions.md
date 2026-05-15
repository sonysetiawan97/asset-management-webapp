# Permissions Matrix

## Overview

Detailed breakdown of permissions by role for all system actions.

**PRD Reference:** Section 4.6.2

---

## Asset Permissions

| Action | Administrator | Staff | Manager | Auditor |
|--------|---------------|-------|---------|---------|
| Create asset | ✓ | ✓ | ✓ | ✗ |
| View own dept assets | ✓ | ✓ | ✓ | ✓ |
| View all assets | ✓ | ✗ | ✗ | ✓ |
| Update asset | ✓ | Own only | Own dept | ✗ |
| Delete asset | ✓ | ✗ | ✗ | ✗ |
| View disposed assets | ✓ | ✗ | ✗ | ✓ |

---

## Checkout Permissions

| Action | Administrator | Staff | Manager | Auditor |
|--------|---------------|-------|---------|---------|
| Check out asset | ✓ | ✓ | ✓ | ✗ |
| Approve checkout | ✓ | ✗ | ✓ | ✗ |
| Check in asset | ✓ | ✓ | ✓ | ✗ |

---

## Transfer Permissions

| Action | Administrator | Staff | Manager | Auditor |
|--------|---------------|-------|---------|---------|
| Initiate transfer | ✓ | ✓ | ✓ | ✗ |
| Approve transfer | ✓ | ✗ | ✗ | ✗ |
| Reject transfer | ✓ | ✗ | ✗ | ✗ |

---

## Disposal Permissions

| Action | Administrator | Staff | Manager | Auditor |
|--------|---------------|-------|---------|---------|
| Initiate disposal | ✓ | ✗ | ✓ | ✗ |
| Approve disposal | ✓ | ✗ | ✗ | ✗ |
| Reject disposal | ✓ | ✗ | ✗ | ✗ |

---

## Maintenance Permissions

| Action | Administrator | Staff | Manager | Auditor |
|--------|---------------|-------|---------|---------|
| Create maintenance log | ✓ | ✓ | ✓ | ✗ |
| View maintenance history | ✓ | Own dept | Own dept | ✓ |
| Update maintenance | ✓ | Own only | Own dept | ✗ |
| Delete maintenance | ✓ | ✗ | ✗ | ✗ |

---

## Report Permissions

| Action | Administrator | Staff | Manager | Auditor |
|--------|---------------|-------|---------|---------|
| View inventory report | ✓ | Own dept | Own dept | ✓ |
| View depreciation report | ✓ | Own dept | Own dept | ✓ |
| Export reports | ✓ | Own dept | Own dept | ✓ |

---

## Audit Trail Permissions

| Action | Administrator | Staff | Manager | Auditor |
|--------|---------------|-------|---------|---------|
| View audit trail | ✓ | Own dept | Own dept | ✓ |
| Export audit log | ✓ | ✗ | ✗ | ✓ |

---

## User Management Permissions

| Action | Administrator | Staff | Manager | Auditor |
|--------|---------------|-------|---------|---------|
| Create user | ✓ | ✗ | ✗ | ✗ |
| Update user | ✓ | ✗ | ✗ | ✗ |
| Delete user | ✓ | ✗ | ✗ | ✗ |
| Assign roles | ✓ | ✗ | ✗ | ✗ |

---

## Reference Data Permissions

| Action | Administrator | Staff | Manager | Auditor |
|--------|---------------|-------|---------|---------|
| Manage categories | ✓ | ✗ | ✗ | ✗ |
| Manage locations | ✓ | ✗ | ✗ | ✗ |
| Manage departments | ✓ | ✗ | ✗ | ✗ |
| Manage vendors | ✓ | ✓ | ✓ | ✗ |
| View all reference data | ✓ | ✓ | ✓ | ✓ |

---

## Permission Implementation

### Route Guard / Access Checker

```tsx
const usePermission = (action: string, resource: string) => {
  const { user } = useAuth();

  const permissions: Record<string, string[]> = {
    administrator: ['*'],
    staff: ['assets:read', 'assets:create', 'checkout:*', 'maintenance:read'],
    manager: ['assets:*', 'checkout:*', 'maintenance:*', 'reports:read'],
    auditor: ['assets:read', 'reports:read', 'audit:read'],
  };

  return permissions[user.role]?.includes(action) ?? false;
};

// Usage in component
const canEdit = usePermission('assets:update', 'asset');
```

---

## Business Rules

1. **Scope Enforcement** - Staff/Manager queries automatically filtered by department
2. **Admin Override** - Administrator can view/act on any department
3. **Auditor Read-Only** - Auditor cannot perform any write operations
4. **Own Only** - Staff can only update assets they created

---

## Related Documents

- [Roles Overview](overview.md) - Role definitions
- [Authentication Flow](authentication/flow.md) - Auth context
- [Audit Trail](audit/trail.md) - Action logging