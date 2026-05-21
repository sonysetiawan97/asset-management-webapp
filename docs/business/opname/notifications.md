# Opname Notifications

## Overview

The opname module dispatches automated notifications to keep stakeholders informed about session deadlines, overdue sessions, and critical discrepancies discovered during physical counts.

**PRD Reference:** Section 4.4.5

---

## Notification Triggers

### 1. Session Deadline Approaching

| Field | Value |
|-------|-------|
| Trigger Condition | 3 days before `end_date` AND session still `in_progress` |
| Recipients | Session creator + Administrator |
| Channels | Email + In-App |
| Action | Reminder to complete counting before deadline |

**Email Content Example:**
```
Subject: [e-Asseting] Reminder: Stock Opname "Annual 2026" ends in 3 days

The opname session "Annual Stock Opname 2026" is scheduled to end on
2026-05-20. There are still 45 items not yet counted.

Please complete the counting before the deadline to avoid discrepancies
being auto-flagged.

View Session: /opname/sessions/{id}
```

---

### 2. Session Overdue

| Field | Value |
|-------|-------|
| Trigger Condition | `end_date` has passed AND session still `in_progress` |
| Recipients | Administrator |
| Channels | Email + In-App |
| Frequency | Daily reminder until session is closed |
| Action | Urgent notification to close or extend the session |

**Email Content Example:**
```
Subject: [URGENT] Stock Opname "Annual 2026" is OVERDUE

The opname session "Annual Stock Opname 2026" was due on 2026-05-17
but is still marked as in_progress.

Overdue sessions delay financial reconciliation and compliance reporting.

Immediate action required. Please complete counting or close the session.
```

---

### 3. Discrepancy Alert

| Field | Value |
|-------|-------|
| Trigger Condition | Item marked as `not_found` or `extra` during counting |
| Recipients | Administrator |
| Channels | In-App (immediate) |
| Action | Alert to investigate missing or extra assets |

**In-App Notification Content:**
```
Asset "MacBook Pro M3" (AST-2026-000042) marked as NOT FOUND
in "Annual Stock Opname 2026" by John Doe at 10:30 AM.

Review Discrepancy: /opname/sessions/{session_id}/discrepancies
```

---

## Scheduler Configuration

Opname notifications are dispatched via Laravel Queue workers using scheduled Artisan commands.

| Command | Schedule | Job |
|---------|----------|-----|
| `php artisan opname:check-deadlines` | Daily at 8:00 AM | Scans for sessions ending within 3 days |
| `php artisan opname:check-overdue` | Daily at 9:00 AM | Scans for overdue sessions and dispatches daily reminders |
| Real-time | Event-driven | `not_found`/`extra` count triggers immediate in-app notification |

---

## Notification Types

| Type | Trigger | Priority | Channel |
|------|---------|----------|---------|
| `opname_deadline_approaching` | 3 days before end_date | Medium | Email + In-App |
| `opname_session_overdue` | end_date passed | High | Email + In-App |
| `opname_discrepancy_found` | not_found or extra count | High | In-App only |

---

## Business Rules

1. **No Duplicate Deadlines** — System tracks which deadline notifications have been sent to avoid duplicates
2. **Daily Overdue Reminders** — Overdue sessions trigger daily reminders until closed; tracking prevents duplicate daily emails
3. **Immediate Discrepancy Alerts** — `not_found` and `extra` counts trigger immediate in-app notification (no queue delay)
4. **Administrator Only** — Only Administrator receives discrepancy and overdue alerts
5. **Session Creator Included** — Deadline approaching notifications include the session creator alongside Administrator
6. **Department Manager** — If a session is scoped to a department, the department manager also receives deadline notifications

---

## Queue Configuration

| Setting | Value |
|---------|-------|
| Driver | Database (MVP) — Redis in Phase 2 |
| Max Attempts | 3 |
| Retry After | 60 seconds |
| Delivery Target | < 5 minutes from trigger |

---

## Related Documents

- [Opname Sessions](sessions.md) — Session lifecycle
- [Opname Workflow](workflow.md) — Counting and approval workflow
- [Notifications System](../notifications/system.md) — General notification delivery
- [Maintenance Alerts](../maintenance/alerts.md) — Other alert types (warranty, license, etc.)