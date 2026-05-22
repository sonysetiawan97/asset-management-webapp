import { type FC } from "react";
import { Link } from "react-router-dom";
import { moduleName, type TransferRequest, TRANSFER_STATUSES } from "../../types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";

interface ListProps {
  data: TransferRequest[];
  count: number;
  isLoading: boolean;
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export const List: FC<ListProps> = ({ data, count, isLoading: _isLoading }) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  const statusCounts = TRANSFER_STATUSES.map((s) => ({
    ...s,
    count: data.filter((r) => r.status === s.value).length,
  }));

  return (
    <div className="module-list-container">
      {/* Stat Bar */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{count}</span>
          <span className="stat-label">{t("modules.transfers.list.total_transfers")}</span>
        </div>
        {statusCounts.map((s) => (
          <div key={s.value} className="stat-item">
            <span className="stat-value" style={{ color: s.dot }}>{s.count}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Status Filter Chips */}
      <div className="status-filter-bar">
        <span className="status-filter-bar__label">{t("modules.transfers.list.filter_by_status")}</span>
        <div className="status-filter-bar__chips">
          {statusCounts.map((s) => (
            <button key={s.value} className="status-chip">
              <span className="status-chip__dot" style={{ background: s.dot }} />
              <span className="status-chip__label">{s.label}</span>
              <span className="status-chip__count">{s.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="module-list-header">
        <div className="module-list-title">
          <svg width="20" height="20" viewBox="0 -960 960 960" fill="#1a1a2e">
            <path d="M520-80q-17 0-28.5-11.5T480-120q0-17 11.5-28.5T520-160h320q17 0 28.5 11.5T880-120q0 17-11.5 28.5T840-80H520Z" />
          </svg>
          <h2>{t("modules.transfers.list.title")}</h2>
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
                <path d="M520-80q-17 0-28.5-11.5T480-120q0-17 11.5-28.5T520-160h320q17 0 28.5 11.5T880-120q0 17-11.5 28.5T840-80H520Z" />
              </svg>
            </div>
            <p className="empty-state__text">{t("modules.transfers.list.empty")}</p>
          </div>
        ) : (
          data.map((transfer, index) => {
            const statusMeta = TRANSFER_STATUSES.find((s) => s.value === transfer.status);
            return (
              <div key={transfer.id} className="workflow-card" style={{ animationDelay: `${index * 40}ms` }}>
                <div className="workflow-card__header">
                  <span
                    className="workflow-status-badge"
                    style={{ background: statusMeta?.dot ? `${statusMeta.dot}20` : undefined, color: statusMeta?.dot }}
                  >
                    {statusMeta?.label}
                  </span>
                  <span className="workflow-code">{transfer.asset_code ?? "—"}</span>
                </div>

                <div className="workflow-card__body">
                  <h3 className="workflow-name">{transfer.asset_name ?? "—"}</h3>

                  <div className="transfer-route">
                    <div className="transfer-route__from">
                      <svg width="12" height="12" viewBox="0 -960 960" fill="#ef4444">
                        <path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" />
                      </svg>
                      <span>{transfer.from_location_name ?? "—"}</span>
                      {transfer.from_custodian_name && <small>{transfer.from_custodian_name}</small>}
                    </div>
                    <div className="transfer-route__arrow">
                      <svg width="16" height="16" viewBox="0 -960 960" fill="currentColor">
                        <path d="m424-296-56-56 120-120H120v-80h312L368-712l56-56 184 184-184 184Z" />
                      </svg>
                    </div>
                    <div className="transfer-route__to">
                      <svg width="12" height="12" viewBox="0 -960 960" fill="#10b981">
                        <path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" />
                      </svg>
                      <span>{transfer.to_location_name ?? "—"}</span>
                      {transfer.to_custodian_name && <small>{transfer.to_custodian_name}</small>}
                    </div>
                  </div>

                  <p className="workflow-reason">{transfer.reason}</p>

                  <div className="workflow-meta">
                    <div className="workflow-meta__item">
                      {t("modules.transfers.list.requested_by")}: {transfer.created_by_name ?? "—"}
                    </div>
                    <div className="workflow-meta__item">{formatDate(transfer.created_time)}</div>
                  </div>
                </div>

                <div className="workflow-card__footer">
                  <div className="workflow-actions">
                    {transfer.status === "pending" && (
                      <>
                        <button className="btn-action btn-action--success" title="Approve" onClick={() => {}}>
                          <svg width="14" height="14" viewBox="0 -960 960" fill="currentColor"><path d="M382-202 144-440l56-56 182 182 350-350 56 56-406 406Z" /></svg>
                        </button>
                        <button className="btn-action btn-action--danger" title="Reject" onClick={() => {}}>
                          <svg width="14" height="14" viewBox="0 -960 960" fill="currentColor"><path d="M336-285 168-453l56-56 168 168 168-168 56 56-168 168 168 168-56 56-168-168-168 168-56-56 168-168Z" /></svg>
                        </button>
                      </>
                    )}
                    <Link to={`/${moduleName}/${transfer.id}`} className="btn-action" title="View">
                      <svg width="14" height="14" viewBox="0 -960 960" fill="currentColor"><path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" /></svg>
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