import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";
import { useList } from "@hooks/list/useList";
import { type Notification, moduleName, NOTIFICATION_TYPE_LABELS } from "../../types/Model";
import { useMarkRead } from "../../services/useNotificationPoll";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useEffect, useState } from "react";

interface ListProps {
  data: Notification[];
  count: number;
  isLoading: boolean;
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

const getNotifIcon = (type: string): string => {
  const icons: Record<string, string> = {
    warranty_expiry: "bi bi-bell",
    license_expiry: "bi bi-file-text",
    maintenance_due: "bi bi-wrench",
    overdue_checkin: "bi bi-clock",
    asset_lost: "bi bi-exclamation-triangle",
    checkout_approved: "bi bi-check-circle",
    transfer_approved: "bi bi-check-circle",
    transfer_rejected: "bi bi-x-circle",
  };
  return icons[type] || "bi bi-bell";
};

export const List: FC<ListProps> = ({ filterRead }) => {
  const { t } = useTranslation();
  const { skip, limit, setSkip } = usePagination();
  const markRead = useMarkRead();
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">(
    filterRead === false ? "unread" : "all"
  );

  const params = activeTab === "unread"
    ? { read: "false" }
    : activeTab === "read"
    ? { read: "true" }
    : {};

  const { data, isLoading, error } = useList<Notification>({
    module: moduleName, skip, limit, params,
  });

  const allNotifications = data?.data?.result || [];
  const totalCount = data?.data?.count || 0;
  const unreadCount = allNotifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Notifications", path: `/${moduleName}` }]);
  }, []);

  const handleMarkRead = async (id: string) => {
    await markRead(id);
  };

  if (isLoading) return <ContentLoader />;
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
          <i className="bi bi-bell fs-4" style={{ color: "#1a1a2e" }}></i>
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
              <i className="bi bi-inbox fs-1" style={{ color: "#d1d5db" }}></i>
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
                <i className={getNotifIcon(notification.type)}></i>
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <span className="notification-title">{notification.title}</span>
                  <span className="notification-time">{formatDate(notification.created_time)}</span>
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