# Department Management

## Overview

Department management covers the complete CRUD lifecycle, deactivation rules, deletion guards, and the relationship between departments, assets, and users. Only Administrators can manage departments.

**PRD Reference:** Section 4.7.2, Section 4.7.3, Section 4.7.5, Section 4.7.6

---

## Create Department

### API

```
POST /api/v1/departments
```

**Request:**
```json
{
  "name": "Information Technology",
  "code": "IT",
  "manager_id": "uuid-of-manager",
  "description": "Technology infrastructure and systems management"
}
```

**Response:** `201 Created` with `DepartmentResource`

**Preconditions:**
- `name` required, max 255 characters
- `code` required, unique, alphanumeric
- `manager_id` optional; if provided, must belong to the new department
- `is_active` defaults to `true`

**Result:**
- Department created with `is_active = true`
- No assets or users assigned yet
- ActivityLog: `DEPARTMENT_CREATED`

---

## Update Department

### API

```
PATCH /api/v1/departments/{id}
```

**Request:**
```json
{
  "name": "IT & Digital Services",
  "code": "ITD",
  "manager_id": "uuid-new-manager",
  "description": "Technology, digital platforms and systems"
}
```

**Updatable Fields:** `name`, `code`, `manager_id`, `description`

**Non-Updatable After Creation:** `is_active` (use separate deactivate action)

**Result:**
- Department fields updated
- ActivityLog: `DEPARTMENT_UPDATED`

---

## Deactivate Department

### API

```
PATCH /api/v1/departments/{id}
{
  "is_active": false
}
```

**Effect:**
- Department hidden from new assignment dropdowns
- Existing assets and users retain their assignment — **not affected**
- Department remains accessible in historical reports and audit trail
- `manager_id` can be cleared automatically

**Reactivation:**
- `PATCH /api/v1/departments/{id}` with `is_active: true`
- All assignment dropdowns re-show the department

---

## Delete Department

### API

```
DELETE /api/v1/departments/{id}
```

**Preconditions (checked by API):**
- Department has **no active assets** → HTTP `409 Conflict` if assets exist
- Department has **no active users** → HTTP `409 Conflict` if users exist

**If Preconditions Met:**
- Soft-delete: `is_active → false` (or `deleted_at` set)
- ActivityLog: `DEPARTMENT_DELETED`

**If Preconditions Not Met:**
```json
{
  "success": false,
  "error": {
    "code": "DEPARTMENT_NOT_EMPTY",
    "message": "Cannot delete department with active assets or users. Reassign them first."
  }
}
```

**HTTP Status:** `409 Conflict`

---

## Reassign Department Manager

### API

```
PATCH /api/v1/departments/{id}
{
  "manager_id": "uuid-new-manager"
}
```

**Effect:**
- Previous manager loses manager role for this department
- Previous manager retains access as a regular department member
- New manager begins receiving department notifications
- ActivityLog: `DEPARTMENT_MANAGER_CHANGED`

---

## Department-Asset Relationship

### Asset Assignment Rules

| Event | Asset department_id | Notes |
|-------|--------------------|-------|
| Asset Creation | Set to current user's department | Initial assignment |
| Inter-Department Transfer (approval) | Updated to `to_department_id` | TransferRequest approved by Administrator |
| Combined Transfer (approval) | Updated to `to_department_id` | Both dept and location updated |

### Staff/Manager Asset Visibility

- Staff/Manager see only assets where `department_id` matches their own `department_id`
- Staff/Manager can initiate transfers originating from their department
- Auditor can see all assets regardless of department

---

## Department Summary

### API

```
GET /api/v1/departments/{id}/summary
```

**Response:**
```json
{
  "department_id": "uuid",
  "department_name": "Information Technology",
  "department_code": "IT",
  "manager": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "asset_summary": {
    "total": 145,
    "available": 30,
    "in_use": 95,
    "under_maintenance": 12,
    "reserved": 3,
    "lost": 2,
    "disposed": 3
  },
  "total_book_value": 125000000,
  "total_purchase_value": 250000000,
  "user_count": 28,
  "active_opname_sessions": 1
}
```

---

## Department RBAC Matrix

| Permission | Administrator | Staff / Manager | Auditor |
|-----------|:---:|:---:|:---:|
| View All Departments | ✓ | ✓ | ✓ |
| Create Department | ✓ | ✗ | ✗ |
| Edit Department | ✓ | ✗ | ✗ |
| Deactivate / Delete Department | ✓ | ✗ | ✗ |
| Assign Department Manager | ✓ | ✗ | ✗ |
| View Own Department Summary | ✓ | ✓ | ✓ |
| View Other Department Summary | ✓ | ✗ | ✓ |
| View All Assets (all depts.) | ✓ | ✗ | ✓ |
| View Own Department Assets | ✓ | ✓ | ✓ |

---

## Business Rules

1. **Flat Hierarchy** — MVP uses no parent/child department hierarchy; each asset/user belongs to exactly one department
2. **Deletion Guard** — Departments with assets or users cannot be deleted (409 Conflict)
3. **Soft Delete** — Deletion is soft (is_active → false or deleted_at set); supports data recovery
4. **Manager Reassignment** — Prior manager retains department membership after reassignment
5. **Inactive Dept. Hidden** — `is_active = false` hides from new assignment dropdowns but does not affect existing assignments
6. **Transfer Scope** — Staff/Manager can only initiate transfers from their own department
7. **Auditor Cross-Department** — Auditor can view all department summaries and all assets across departments

---

## Related Documents

- [Department Overview](overview.md) — Entity definition and relationships
- [Transfer Workflow](../transfer/workflow.md) — Inter-department transfers
- [Opname Sessions](../opname/sessions.md) — Department-scoped opname
- [Roles & Permissions](../roles/permissions.md) — Role-based access control