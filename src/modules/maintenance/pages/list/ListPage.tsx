import { type FC } from "react";
import { Link } from "react-router-dom";
import { moduleName, type MaintenanceLog, MAINTENANCE_TYPES } from "../../types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";

interface ListProps {
  data: MaintenanceLog[];
  count: number;
  isLoading: boolean;
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
};

export const List: FC<ListProps> = ({ data, count, isLoading: _isLoading }) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  const openLogs = data.filter((l) => l.status === "open");
  const completedLogs = data.filter((l) => l.status === "completed");
  const totalCost = data.reduce((acc, l) => acc + (l.cost || 0), 0);

  return (
    <div className="module-list-container">
      {/* Stat Bar */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{count}</span>
          <span className="stat-label">{t("modules.maintenance.list.total_logs")}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: "#f59e0b" }}>
          <span className="stat-value" style={{ color: "#f59e0b" }}>{openLogs.length}</span>
          <span className="stat-label">{t("modules.maintenance.list.open")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{completedLogs.length}</span>
          <span className="stat-label">{t("modules.maintenance.list.completed")}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: "#10b981" }}>
          <span className="stat-value" style={{ color: "#10b981" }}>{formatCurrency(totalCost)}</span>
          <span className="stat-label">{t("modules.maintenance.list.total_cost")}</span>
        </div>
      </div>

      {/* Header */}
      <div className="module-list-header">
        <div className="module-list-title">
          <svg width="20" height="20" viewBox="0 -960 960 960" fill="#1a1a2e">
            <path d="M440-280v-80h80v80h-80Zm160 0v-80h80v80h-80ZM360-280v-80h80v80h-80Zm0 160v-80h80v80h-80ZM280-280v-80h80v80h-80Zm0 160v-80h80v80h-80Zm160-160v-80h80v80h-80Zm0 160v-80h80v80h-80Z" />
          </svg>
          <h2>{t("modules.maintenance.list.title")}</h2>
        </div>
        <Link to={`/${moduleName}/create`} className="btn-create">
          <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M720-160q-33 0-56.5-23.5T640-240v-480q0-33 23.5-56.5T720-800h240q33 0 56.5 23.5T1040-720v480q0 33-23.5 56.5T960-160H720Z" />
          </svg>
          {t("button.create")}
        </Link>
      </div>

      {/* Cards */}
      <div className="workflow-grid animate-fade-slide-up">
        {data.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 -960 960 960" fill="#d1d5db">
                <path d="M440-280v-80h80v80h-80Zm160 0v-80h80v80h-80Z" />
              </svg>
            </div>
            <p className="empty-state__text">{t("modules.maintenance.list.empty")}</p>
          </div>
        ) : (
          data.map((log, index) => {
            const typeMeta = MAINTENANCE_TYPES.find((t) => t.value === log.type);
            return (
              <div key={log.id} className="workflow-card" style={{ animationDelay: `${index * 40}ms` }}>
                <div className="workflow-card__header">
                  <div className="workflow-status">
                    <span
                      className="workflow-status-badge"
                      style={{
                        background: log.status === "completed" ? "#d1fae520" : "#fef3c720",
                        color: log.status === "completed" ? "#065f46" : "#78350f",
                      }}
                    >
                      {log.status === "completed" ? t("modules.maintenance.list.completed") : t("modules.maintenance.list.open")}
                    </span>
                    <span
                      className="workflow-type-badge"
                      style={{ background: typeMeta ? "#dbeafe" : undefined, color: typeMeta ? "#1e40af" : undefined }}
                    >
                      {typeMeta?.label}
                    </span>
                  </div>
                  <span className="workflow-code">{log.asset_code ?? "—"}</span>
                </div>

                <div className="workflow-card__body">
                  <h3 className="workflow-name">{log.asset_name ?? "—"}</h3>
                  <p className="workflow-description">{log.description}</p>
                  <div className="workflow-meta">
                    <div className="workflow-meta__item">
                      <svg width="12" height="12" viewBox="0 -960 960 960" fill="currentColor">
                        <path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" />
                      </svg>
                      {t("modules.maintenance.list.performed_on")}: {formatDate(log.date_performed)}
                    </div>
                    {log.performed_by_name && (
                      <div className="workflow-meta__item">
                        <svg width="12" height="12" viewBox="0 -960 960 960" fill="currentColor">
                          <path d="M240-160q-33 0-56.5-23.5T160-240v-560q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v560q0 33-23.5 56.5T720-160H240Z" />
                        </svg>
                        {log.performed_by_name}
                      </div>
                    )}
                    {log.cost && (
                      <div className="workflow-meta__item">
                        <svg width="12" height="12" viewBox="0 -960 960 960" fill="currentColor">
                          <path d="M520-80q-17 0-28.5-11.5T480-120q0-17 11.5-28.5T520-160h320q17 0 28.5 11.5T880-120q0 17-11.5 28.5T840-80H520Z" />
                        </svg>
                        {formatCurrency(log.cost)}
                      </div>
                    )}
                    {log.next_maintenance_date && (
                      <div className="workflow-meta__item">
                        <svg width="12" height="12" viewBox="0 -960 960 960" fill="currentColor">
                          <path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" />
                        </svg>
                        {t("modules.maintenance.list.next")}: {formatDate(log.next_maintenance_date)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="workflow-card__footer">
                  <div className="workflow-actions">
                    {log.status !== "completed" && (
                      <Link to={`/${moduleName}/${log.id}/update`} className="btn-action btn-action--primary" title="Complete">
                        <svg width="14" height="14" viewBox="0 -960 960" fill="currentColor">
                          <path d="M382-202 144-440l56-56 182 182 350-350 56 56-406 406Z" />
                        </svg>
                      </Link>
                    )}
                    <Link to={`/${moduleName}/${log.id}`} className="btn-action" title="View">
                      <svg width="14" height="14" viewBox="0 -960 960" fill="currentColor">
                        <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {count > limit && (
        <div className="module-pagination">
          <button className="btn-pagination" onClick={() => setSkip(Math.max(0, skip - limit))} disabled={skip === 0}>{t("pagination.prev")}</button>
          <span className="pagination-info">{skip + 1}–{Math.min(skip + limit, count)} / {count}</span>
          <button className="btn-pagination" onClick={() => setSkip(skip + limit)} disabled={skip + limit >= count}>{t("pagination.next")}</button>
        </div>
      )}
    </div>
  );
};

export default List;