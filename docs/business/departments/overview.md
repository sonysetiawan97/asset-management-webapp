# Department Overview

## Overview

Departments are the primary organizational unit for asset ownership, user assignment, RBAC scoping, and transfer workflows. Every asset and user belongs to exactly one department. Departments support flat hierarchy (no parent/child for MVP) and can be managed by a designated department manager.

**PRD Reference:** Section 4.7.1, Section 4.7.4

---

## Department Entity

### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | Yes | Primary key, auto-generated |
| name | text (255) | Yes | Official department name, e.g., "Information Technology" |
| code | text (alphanumeric) | Yes | Short code, unique, e.g., "IT", "FIN", "HR" |
| manager_id | uuid | No | FK → users — head of department; receives notifications |
| description | text | No | Department purpose or mandate |
| is_active | boolean | Yes | Default `true`; inactive depts. hidden from new assignments |
| created_at | datetime | Auto | Creation timestamp |
| updated_at | datetime | Auto | Last update timestamp |

---

## Relationships

```
Department
  ├── hasMany: Users          ← employees assigned to this department
  ├── hasMany: Assets        ← assets owned by this department
  ├── hasMany: OpnameSessions ← opname sessions scoped to this department
  ├── belongsTo: User (manager) ← department manager
  └── belongsToMany: TransferRequests ← incoming and outgoing transfers
```

### User ↔ Department

- Each `User` belongs to exactly one `Department` via `department_id`
- Staff/Manager can only view/manage assets within their department
- `manager_id` on Department points to a `User` in that department

### Asset ↔ Department

- Each `Asset` belongs to exactly one `Department` via `department_id`
- Department assignment determines which Staff/Manager can view/manage the asset
- Department assignment is updated via:
  - Asset creation (initial assignment)
  - Inter-Department or Combined transfer (upon approval)

---

## Department Manager

The `manager_id` designates the head of the department. This role receives:

| Notification Type | Trigger | Recipient |
|------------------|---------|-----------|
| Transfer Request | Request targeting or originating from their department | Department Manager |
| Opname Session | Session scoped to their department | Department Manager |
| Overdue Check-In | Asset assigned to their department is overdue | Department Manager |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/departments` | List all departments (paginated, filterable by `is_active`) |
| POST | `/api/v1/departments` | Create department (Administrator only) |
| GET | `/api/v1/departments/{id}` | Get department detail |
| PATCH | `/api/v1/departments/{id}` | Update department (Administrator only) |
| DELETE | `/api/v1/departments/{id}` | Soft-delete department (Administrator only; 409 if has assets/users) |
| GET | `/api/v1/departments/{id}/users` | List users in department |
| GET | `/api/v1/departments/{id}/assets` | List assets in department |
| GET | `/api/v1/departments/{id}/summary` | Department asset summary (count, total value, by status) |

---

## Business Rules

1. **Unique Code** — `code` must be unique across all departments
2. **Name Length** — `name` max 255 characters
3. **Manager Scope** — `manager_id` must reference a user that belongs to this department
4. **Inactive Manager** — If manager is deactivated, `manager_id` can be set to null or reassigned
5. **is_active Default** — New departments start with `is_active = true`
6. **Department Scope for Staff/Manager** — Staff/Manager see only assets/users in their own department

---

## Related Documents

- [Department Management](management.md) — CRUD workflow and business rules
- [Transfer Workflow](../transfer/workflow.md) — Transfer requests between departments
- [Opname Sessions](../opname/sessions.md) — Opname sessions scoped to departments
- [Roles & Permissions](../roles/permissions.md) — Department-scoped RBAC