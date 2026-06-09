import { type FC } from "react";
import { Link } from "react-router-dom";
import {
  moduleName,
  type CheckoutLog,
  type CheckoutStatus,
  CHECKOUT_FILTER_STATUSES,
  CHECKOUT_STATUS_COLORS,
} from "../../types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";
import { Pagination } from "@components/list/Pagination";

interface ListProps {
  data: CheckoutLog[];
  count: number;
  allCount: number;
  countByStatus: Record<string, number>;
  selectedStatus: CheckoutStatus | null;
  onStatusChange: (status: CheckoutStatus | null) => void;
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

export const List: FC<ListProps> = ({
  data,
  count,
  allCount,
  countByStatus,
  selectedStatus,
  onStatusChange,
}) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  const statusStats = CHECKOUT_FILTER_STATUSES.map((s) => ({
    ...s,
    count: countByStatus[s.value] ?? 0,
  }));

  return (
    <div className="module-list-container">
      {/* Stat Bar */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{allCount}</span>
          <span className="stat-label">{t("modules.checkout.list.total_checkouts")}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: "#3b82f6" }}>
          <span className="stat-value" style={{ color: "#3b82f6" }}>{countByStatus["active"] ?? 0}</span>
          <span className="stat-label">{t("modules.checkout.list.active")}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: "#ef4444" }}>
          <span className="stat-value" style={{ color: "#ef4444" }}>{countByStatus["overdue"] ?? 0}</span>
          <span className="stat-label">{t("modules.checkout.list.overdue")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{countByStatus["returned"] ?? 0}</span>
          <span className="stat-label">{t("modules.checkout.list.returned")}</span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="status-filter-bar">
        <span className="status-filter-bar__label">{t("modules.checkout.list.filter_by_status")}</span>
        <div className="status-filter-bar__chips">
          <button
            className={`status-chip ${selectedStatus === null ? "active" : ""}`}
            onClick={() => onStatusChange(null)}
          >
            <span className="status-chip__label">{t("modules.checkout.list.filter_all")}</span>
            <span className="status-chip__count">{allCount}</span>
          </button>
          {statusStats.map((s) => {
            const colors = CHECKOUT_STATUS_COLORS[s.value];
            return (
              <button
                key={s.value}
                className={`status-chip ${selectedStatus === s.value ? "active" : ""}`}
                onClick={() => onStatusChange(s.value)}
              >
                <span
                  className="status-chip__dot"
                  style={{ background: colors.dot }}
                />
                <span className="status-chip__label">{s.label}</span>
                <span className="status-chip__count">{s.count}</span>
              </button>
            );
          })}
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
            <p className="empty-state__text">
              {selectedStatus
                ? t(`modules.checkout.list.empty_by_status.${selectedStatus}`)
                : t("modules.checkout.list.empty")}
            </p>
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
      <Pagination count={count} skip={skip} limit={limit} onPageChange={setSkip} />
    </div>
  );
};

export default List;
