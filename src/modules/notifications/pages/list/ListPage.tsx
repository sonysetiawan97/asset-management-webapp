import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";
import { useList } from "@hooks/list/useList";
import { type Notification, moduleName, NOTIFICATION_TYPE_LABELS, NOTIFICATION_TYPE_ICONS } from "../../types/Model";
import { useMarkRead } from "../../services/useNotificationPoll";
import { LoadingPage } from "@/components/loadings/LoadingPage";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useEffect, useState } from "react";

interface ListProps {
  filterRead?: boolean;
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const List: FC<ListProps> = ({ filterRead }) => {
  const { t } = useTranslation();
  const { skip, limit, setSkip } = usePagination();
  const markRead = useMarkRead();
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">(
    filterRead === false ? "unread" : "all"
  );

  const params = activeTab === "unread"
    ? { "!sort[created_at]": -1, is_read: false }
    : { "!sort[created_at]": -1, is_read: activeTab === "read" ? true : undefined };

  const { data, isLoading, error } = useList<Notification>({
    module: moduleName, skip, limit, params,
  });

  const allNotifications = data?.data.result || [];
  const totalCount = data?.data.count || 0;
  const unreadCount = allNotifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Notifications", path: `/${moduleName}` }]);
  }, []);

  const handleMarkRead = async (id: string) => {
    await markRead(id);
  };

  if (isLoading) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="module-list-container">
      {/* Stat Bar */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{totalCount}</span>
          <span className="stat-label">{t("modules.notifications.list.total")}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: "#ef4444" }}>
          <span className="stat-value" style={{ color: unreadCount > 0 ? "#ef4444" : undefined }}>{unreadCount}</span>
          <span className="stat-label">{t("modules.notifications.list.unread")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{totalCount - unreadCount}</span>
          <span className="stat-label">{t("modules.notifications.list.read")}</span>
        </div>
      </div>

      {/* Header + Tabs */}
      <div className="module-list-header">
        <div className="module-list-title">
          <svg width="20" height="20" viewBox="0 -960 960 960" fill="#1a1a2e">
            <path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" />
          </svg>
          <h2>{t("modules.notifications.list.title")}</h2>
        </div>
        {unreadCount > 0 && (
          <button className="btn-create" onClick={() => {}}>
            {t("modules.notifications.list.mark_all_read")}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="notification-tabs">
        {(["all", "unread", "read"] as const).map((tab) => (
          <button
            key={tab}
            className={`notification-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => { setActiveTab(tab); setSkip(0); }}
          >
            {t(`modules.notifications.list.tab_${tab}`)}
            {tab === "unread" && unreadCount > 0 && (
              <span className="notification-tab__badge">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="notification-list animate-fade-slide-up">
        {allNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 -960 960 960" fill="#d1d5db">
                <path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" />
              </svg>
            </div>
            <p className="empty-state__text">{t("modules.notifications.list.empty")}</p>
          </div>
        ) : (
          allNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.is_read ? "read" : "unread"}`}
              style={{ animationDelay: `${index * 40}ms` }}
              onClick={() => !notification.is_read && handleMarkRead(notification.id)}
            >
              <div className={`notification-icon ${!notification.is_read ? "unread" : ""}`}>
                <svg width="18" height="18" viewBox="0 -960 960 960" fill="currentColor">
                  <path d={NOTIFICATION_TYPE_ICONS[notification.type] || NOTIFICATION_TYPE_ICONS.checkout_approved} />
                </svg>
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <span className="notification-title">{notification.title}</span>
                  <span className="notification-time">{formatDate(notification.created_at)}</span>
                </div>
                <p className="notification-message">{notification.message}</p>
                <span className="notification-type">{NOTIFICATION_TYPE_LABELS[notification.type]}</span>
              </div>
              {!notification.is_read && <div className="notification-dot" />}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalCount > limit && (
        <div className="module-pagination">
          <button className="btn-pagination" onClick={() => setSkip(Math.max(0, skip - limit))} disabled={skip === 0}>{t("pagination.prev")}</button>
          <span className="pagination-info">{skip + 1}–{Math.min(skip + limit, totalCount)} / {totalCount}</span>
          <button className="btn-pagination" onClick={() => setSkip(skip + limit)} disabled={skip + limit >= totalCount}>{t("pagination.next")}</button>
        </div>
      )}
    </div>
  );
};

export default List;