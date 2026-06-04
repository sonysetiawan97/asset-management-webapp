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
          <i className="bi bi-wrench fs-4" style={{ color: "#1a1a2e" }}></i>
          <h2>{t("modules.maintenance.list.title")}</h2>
        </div>
        <Link to={`/${moduleName}/create`} className="btn-create">
          <i className="bi bi-plus-lg"></i>
          {t("button.create")}
        </Link>
      </div>

      {/* Cards */}
      <div className="workflow-grid animate-fade-slide-up">
        {data.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <i className="bi bi-inbox fs-1" style={{ color: "#d1d5db" }}></i>
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
                      <i className="bi bi-calendar"></i>
                      {t("modules.maintenance.list.performed_on")}: {formatDate(log.date_performed)}
                    </div>
                    {log.performed_by_name && (
                      <div className="workflow-meta__item">
                        <i className="bi bi-person"></i>
                        {log.performed_by_name}
                      </div>
                    )}
                    {log.cost && (
                      <div className="workflow-meta__item">
                        <i className="bi bi-currency-dollar"></i>
                        {formatCurrency(log.cost)}
                      </div>
                    )}
                    {log.next_maintenance_date && (
                      <div className="workflow-meta__item">
                        <i className="bi bi-calendar"></i>
                        {t("modules.maintenance.list.next")}: {formatDate(log.next_maintenance_date)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="workflow-card__footer">
                  <div className="workflow-actions">
                    {log.status !== "completed" && (
                      <Link to={`/${moduleName}/${log.id}/update`} className="btn-action btn-action--primary" title="Complete">
                        <i className="bi bi-check-lg"></i>
                      </Link>
                    )}
                    <Link to={`/${moduleName}/${log.id}`} className="btn-action" title="View">
                      <i className="bi bi-eye"></i>
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