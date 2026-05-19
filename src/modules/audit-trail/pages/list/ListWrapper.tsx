import { type FC } from "react";
import { useList } from "@hooks/list/useList";
import { type ActivityLog, moduleName, AUDIT_ACTION_LABELS, AUDIT_ACTION_COLORS } from "../../types/Model";
import { LoadingPage } from "@/components/loadings/LoadingPage";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

export const List: FC = () => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();
  const [filterAction, setFilterAction] = useState<string>("");
  const { data, isLoading, error } = useList<ActivityLog>({
    module: moduleName, skip, limit,
    params: filterAction ? { action: filterAction } : {},
  });

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Audit Trail", path: `/${moduleName}` }]);
  }, []);

  if (isLoading) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;

  const items = data?.data.result || [];
  const total = data?.data.count || 0;
  const actions = Object.entries(AUDIT_ACTION_LABELS) as [string, string][];

  return (
    <div className="module-list-container">
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{total}</span>
          <span className="stat-label">{t("modules.audit.list.total")}</span>
        </div>
      </div>

      <div className="module-list-header">
        <div className="module-list-title">
          <svg width="20" height="20" viewBox="0 -960 960 960" fill="#1a1a2e">
            <path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" />
          </svg>
          <h2>{t("modules.audit.list.title")}</h2>
        </div>
      </div>

      <div className="audit-filter-bar">
        <span className="audit-filter-label">{t("modules.audit.list.filter")}:</span>
        <select className="audit-filter-select" value={filterAction} onChange={(e) => { setFilterAction(e.target.value); setSkip(0); }}>
          <option value="">All Actions</option>
          {actions.map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="audit-list animate-fade-slide-up">
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 -960 960 960" fill="#d1d5db">
                <path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" />
              </svg>
            </div>
            <p className="empty-state__text">{t("modules.audit.list.empty")}</p>
          </div>
        ) : (
          items.map((log, index) => (
            <div key={log.id} className="audit-item" style={{ animationDelay: `${index * 30}ms` }}>
              <div className="audit-icon" style={{ background: `${AUDIT_ACTION_COLORS[log.action] ?? "#6b7280"}20`, color: AUDIT_ACTION_COLORS[log.action] ?? "#6b7280" }}>
                <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" />
                </svg>
              </div>
              <div className="audit-content">
                <div className="audit-header">
                  <span className="audit-action-badge" style={{ background: `${AUDIT_ACTION_COLORS[log.action] ?? "#6b7280"}15`, color: AUDIT_ACTION_COLORS[log.action] ?? "#6b7280" }}>
                    {AUDIT_ACTION_LABELS[log.action] ?? log.action}
                  </span>
                  <span className="audit-time">{formatDate(log.created_at)}</span>
                </div>
                <div className="audit-detail">
                  {log.asset_code && <span className="audit-asset">{log.asset_code}</span>}
                  {log.asset_name && <span className="audit-name">{log.asset_name}</span>}
                  {log.user_name && <span className="audit-user">by {log.user_name}</span>}
                </div>
                {log.field_changed && (
                  <div className="audit-change">
                    <span className="audit-field">{log.field_changed}:</span>
                    {log.old_value && <del className="audit-old">{log.old_value}</del>}
                    {log.new_value && <ins className="audit-new">{log.new_value}</ins>}
                  </div>
                )}
                {log.ip_address && <span className="audit-ip">IP: {log.ip_address}</span>}
              </div>
            </div>
          ))
        )}
      </div>

      {total > limit && (
        <div className="module-pagination">
          <button className="btn-pagination" onClick={() => setSkip(Math.max(0, skip - limit))} disabled={skip === 0}>{t("pagination.prev")}</button>
          <span className="pagination-info">{skip + 1}–{Math.min(skip + limit, total)} / {total}</span>
          <button className="btn-pagination" onClick={() => setSkip(skip + limit)} disabled={skip + limit >= total}>{t("pagination.next")}</button>
        </div>
      )}
    </div>
  );
};

export default List;