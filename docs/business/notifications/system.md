# Notification System

## Overview

The system delivers alerts and notifications via email and in-app notifications to keep users informed of important asset events.

**PRD Reference:** Section 4.6.4

---

## Notification Channels

| Channel | Description | Use Case |
|---------|-------------|----------|
| In-App | Web notifications in SPA | Real-time alerts |
| Email | SMTP-based delivery | Important alerts |

---

## Notification Entity

### Attributes

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Recipient user |
| type | string | Notification type |
| title | string | Notification title |
| message | text | Notification body |
| data | json | Additional data (asset_id, etc.) |
| is_read | boolean | Read status |
| read_at | datetime | Read timestamp |
| created_at | datetime | Creation timestamp |

---

## Notification Types

| Type | Channel | Trigger |
|------|---------|---------|
| warranty_expiry | In-App + Email | 30/7 days before warranty end |
| license_expiry | In-App + Email | 60/14 days before license end |
| maintenance_due | In-App | Scheduled maintenance date reached |
| overdue_checkin | In-App + Email | Past expected return date |
| asset_lost | In-App + Email | Asset marked as lost |
| checkout_approved | In-App | Checkout request approved |
| transfer_approved | In-App | Transfer request approved |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/notifications` | List user notifications |
| GET | `/api/v1/notifications/unread` | Get unread count |
| PATCH | `/api/v1/notifications/{id}/read` | Mark as read |
| PATCH | `/api/v1/notifications/read-all` | Mark all as read |
| DELETE | `/api/v1/notifications/{id}` | Delete notification |

---

## Polling Configuration

React SPA polls for new notifications:

```tsx
useEffect(() => {
  const fetchNotifications = async () => {
    const response = await apiAxios.get('/api/v1/notifications');
    setNotifications(response.data.data);
  };

  fetchNotifications();
  const interval = setInterval(fetchNotifications, 60000); // 60 seconds

  return () => clearInterval(interval);
}, []);
```

**Polling interval:** 60 seconds

---

## Email Configuration

### Frontend Display

Email notifications are shown as in-app notifications when received. The actual email delivery is configured on the backend.

### Notification Badge

```tsx
const NotificationBell = () => {
  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => apiAxios.get('/api/v1/notifications/unread'),
    refetchInterval: 60000,
  });

  const unreadCount = unreadData?.data?.count ?? 0;

  return (
    <Badge count={unreadCount}>
      <BellIcon />
    </Badge>
  );
};
```

---

## Queue Processing

All notifications dispatched via queue on the backend:

```ts
// Backend dispatches via queue
NotificationService.send(user, new WarrantyExpiryAlert(asset, daysLeft));

// Or via job queue
WarrantyExpiryNotification.dispatch(asset, user).onQueue('notifications');
```

---

## Business Rules

1. **User Preferences** - Users can configure which notifications to receive
2. **Unread Badge** - Show unread count in navigation
3. **Mark as Read** - Clicking notification marks it as read
4. **Retention** - Notifications older than 90 days auto-deleted

---

## Related Documents

- [Maintenance Alerts](maintenance/alerts.md) - Automated alerts
- [Authentication Flow](authentication/flow.md) - User context
- [Governance Authentication](../governance/authentication.md) - Auth setup