# Roles Overview

## Overview

The system implements role-based access control (RBAC) with four primary roles: Administrator, Staff, Manager, and Auditor.

**PRD Reference:** Section 4.6.1

---

## Role Definitions

| Role | Description | Scope |
|------|-------------|-------|
| Administrator | Full system access | All departments |
| Manager | Department-level access + approval | Own department |
| Staff | Department-level access | Own department only |
| Auditor | Read-only access | All departments |

---

## User-Role Entity

### Attributes

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Reference to user |
| role | enum | Role type |
| department_id | uuid | Department scope (Staff/Manager) |
| created_at | datetime | Assignment timestamp |

### Role Enum

```ts
enum UserRole: string
{
    case ADMINISTRATOR = 'administrator';
    case STAFF = 'staff';
    case MANAGER = 'manager';
    case AUDITOR = 'auditor';
}
```

---

## Role Hierarchy

```
Administrator
    │
    ├── Can do everything
    │
    ├── Approve transfers
    ├── Approve disposals
    └── Manage users
        │
Staff/Manager (Department-scoped)
    │
    ├── View own department assets
    ├── Create assets (Staff)
    ├── Approve checkout (Manager)
    ├── Initiate transfers
    └── View reports (own dept)
        │
Auditor (Read-only)
    │
    ├── View all assets
    ├── View all reports
    └── View audit trail
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/{id}/role` | Get user role |
| POST | `/api/v1/users/{id}/role` | Assign role to user |
| PATCH | `/api/v1/users/{id}/role` | Update user role |
| DELETE | `/api/v1/users/{id}/role` | Remove role |

---

## Department Scope

Staff and Manager roles are scoped to a department:

```json
POST /api/v1/users/{id}/role
{
  "role": "staff",
  "department_id": "uuid-of-department"
}
```

- **Staff:** Can only see/create assets within assigned department
- **Manager:** Same as Staff, plus can approve checkouts within department

---

## Business Rules

1. **One Role Per User** - Each user has one active role
2. **Department Required** - Staff/Manager must have department_id
3. **Admin Only Assignment** - Only Administrator can assign roles
4. **Role Immutability** - Cannot change own role

---

## Related Documents

- [Permissions Matrix](permissions.md) - Detailed permission list
- [Authentication Flow](authentication/flow.md) - Login and auth
- [Reports Overview](reports/overview.md) - Report access by role