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
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
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
          <svg width="20" height="20" viewBox="0 -960 960 960" fill="#1a1a2e">
            <path d="M240-160q-33 0-56.5-23.5T160-240v-560q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v560q0 33-23.5 56.5T720-160H240Z" />
          </svg>
          <h2>{t("modules.checkout.list.title")}</h2>
        </div>
        <Link to={`/${moduleName}/create`} className="btn-create">
          <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M720-160q-33 0-56.5-23.5T640-240v-480q0-33 23.5-56.5T720-800h240q33 0 56.5 23.5T1040-720v480q0 33-23.5 56.5T960-160H720Zm0-160v-100h80v100h100v80h-100v100h-80v-100H640v-80h80Z" />
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
                <path d="M240-160q-33 0-56.5-23.5T160-240v-560q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v560q0 33-23.5 56.5T720-160H240Z" />
              </svg>
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
                      <svg width="12" height="12" viewBox="0 -960 960 960" fill="currentColor"><path d="M240-160q-33 0-56.5-23.5T160-240v-560q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v560q0 33-23.5 56.5T720-160H240Z" /></svg>
                      {t("modules.checkout.list.assigned_to")}: {log.assigned_to_name ?? "—"}
                    </div>
                    <div className="workflow-meta__item">
                      <svg width="12" height="12" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" /></svg>
                      {log.return_date ? `${t("modules.checkout.list.returned_on")}: ${formatDate(log.return_date)}` : `${t("modules.checkout.list.expected")}: ${formatDate(log.expected_return_date)}`}
                    </div>
                  </div>
                </div>

                <div className="workflow-card__footer">
                  {log.condition_on_return && (
                    <span className={`workflow-condition-badge condition-badge--${log.condition_on_return}`}>{log.condition_on_return}</span>
                  )}
                  <div className="workflow-actions">
                    {!log.return_date && (
                      <Link to={`/${moduleName}/${log.id}/update`} className="btn-action btn-action--primary" title="Check In">
                        <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor"><path d="M386-194q22-22 51-34t60-12h110v-100H537q-36 0-60 24.5T453-280v-140q0-36-24-60t-60-24H209v100h140v100H179q-36 0-60 24t-24 60v140q0 36 24 60t60 24h110q33 0 60-12t51-34Z" /></svg>
                      </Link>
                    )}
                    <Link to={`/${moduleName}/${log.id}`} className="btn-action" title="View">
                      <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" /></svg>
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
