import { type FC } from "react";
import { Link } from "react-router-dom";
import { moduleName, type CheckoutLog } from "../../types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";

interface ListProps {
  data: CheckoutLog[];
  count: number;
  isLoading: boolean;
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isOverdue = (expectedReturn: string | undefined, returnDate: string | undefined) => {
  if (!expectedReturn || returnDate) return false;
  return new Date(expectedReturn) < new Date();
};

export const List: FC<ListProps> = ({ data, count, isLoading: _isLoading }) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  const activeLogs = data.filter((l) => !l.return_date);
  const returnedLogs = data.filter((l) => !!l.return_date);
  const overdueCount = activeLogs.filter((l) => isOverdue(l.expected_return_date, l.return_date)).length;

  return (
    <div className="module-list-container">
      {/* Stat Bar */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{count}</span>
          <span className="stat-label">{t("modules.checkout.list.total_checkouts")}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: "#3b82f6" }}>
          <span className="stat-value" style={{ color: "#3b82f6" }}>{activeLogs.length}</span>
          <span className="stat-label">{t("modules.checkout.list.active")}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: overdueCount > 0 ? "#ef4444" : "#e5e7eb" }}>
          <span className="stat-value" style={{ color: overdueCount > 0 ? "#ef4444" : undefined }}>{overdueCount}</span>
          <span className="stat-label">{t("modules.checkout.list.overdue")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{returnedLogs.length}</span>
          <span className="stat-label">{t("modules.checkout.list.returned")}</span>
        </div>
      </div>

      {/* Header */}
      <div className="module-list-header">
        <div className="module-list-title">
          <i className="bi bi-send fs-4" style={{ color: "#1a1a2e" }}></i>
          <h2>{t("modules.checkout.list.title")}</h2>
        </div>
      </div>

      {/* Cards */}
      <div className="workflow-grid animate-fade-slide-up">
        {data.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <i className="bi bi-inbox fs-1" style={{ color: "#d1d5db" }}></i>
            </div>
            <p className="empty-state__text">{t("modules.checkout.list.empty")}</p>
          </div>
        ) : (
          data.map((log, index) => {
            const overdue = isOverdue(log.expected_return_date, log.return_date);
            return (
              <div key={log.id} className="workflow-card" style={{ animationDelay: `${index * 40}ms` }}>
                <div className="workflow-card__header">
                  <div className="workflow-status">
                    {log.return_date ? (
                      <span className="workflow-status-badge workflow-status-badge--returned">{t("modules.checkout.list.returned")}</span>
                    ) : overdue ? (
                      <span className="workflow-status-badge workflow-status-badge--overdue">{t("modules.checkout.list.overdue")}</span>
                    ) : (
                      <span className="workflow-status-badge workflow-status-badge--active">{t("modules.checkout.list.active")}</span>
                    )}
                  </div>
                  <span className="workflow-code">{log.asset_code ?? "—"}</span>
                </div>

                <div className="workflow-card__body">
                  <h3 className="workflow-name">{log.asset_name ?? "—"}</h3>
                  <div className="workflow-meta">
                    <div className="workflow-meta__item">
                      <i className="bi bi-person"></i>
                      {t("modules.checkout.list.assigned_to")}: {log.assigned_to_name ?? "—"}
                    </div>
                    <div className="workflow-meta__item">
                      <i className="bi bi-calendar"></i>
                      {log.return_date
                        ? `${t("modules.checkout.list.returned_on")} ${formatDate(log.return_date)}`
                        : `${t("modules.checkout.list.expected")} ${formatDate(log.expected_return_date)}`}
                    </div>
                  </div>
                </div>

                <div className="workflow-card__footer">
                  <div />
                  {!log.return_date ? (
                    <Link
                      to={`/${moduleName}/${log.id}`}
                      className="btn-action btn-action--primary"
                      title={t("modules.checkout.list.btn_check_in")}
                    >
                      <i className="bi bi-arrow-return-left"></i>
                    </Link>
                  ) : (
                    <span className="workflow-status-badge workflow-status-badge--returned">
                      {t("modules.checkout.list.returned")}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {count > limit && (
        <div className="module-pagination">
          <button
            className="btn-pagination"
            onClick={() => setSkip(Math.max(0, skip - limit))}
            disabled={skip === 0}
          >
            {t("pagination.prev")}
          </button>
          <span className="pagination-info">
            {skip + 1}–{Math.min(skip + limit, count)} / {count}
          </span>
          <button
            className="btn-pagination"
            onClick={() => setSkip(skip + limit)}
            disabled={skip + limit >= count}
          >
            {t("pagination.next")}
          </button>
        </div>
      )}
    </div>
  );
};

export default List;
