import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "@/utils/apiAxios";
import { moduleName, type DisposalRequest, DISPOSAL_STATUSES, DISPOSAL_METHODS } from "../../types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";

interface ListProps {
  data: DisposalRequest[];
  count: number;
  isLoading: boolean;
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null || isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const List: FC<ListProps> = ({ data, count }) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const workflowMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "approve" | "reject" }) =>
      apiAxios.patch(`${moduleName}/${id}/${action}`),
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: [moduleName] });
      enqueueSnackbar(
        action === "approve"
          ? t("modules.disposals.list.notification.approved")
          : t("modules.disposals.list.notification.rejected"),
        { variant: "success" }
      );
    },
    onError: (error: unknown) => {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const handleApprove = (id: string) => workflowMutation.mutate({ id, action: "approve" });
  const handleReject = (id: string) => workflowMutation.mutate({ id, action: "reject" });

  const statusCounts = DISPOSAL_STATUSES.map((s) => ({
    ...s,
    count: data.filter((r) => r.disposal_status === s.value).length,
  }));

  const filteredData =
    selectedStatus === "all" ? data : data.filter((r) => r.disposal_status === selectedStatus);

  return (
    <div className="module-list-container">
      {/* Stat Bar */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{count}</span>
          <span className="stat-label">{t("modules.disposals.list.total")}</span>
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
        <span className="status-filter-bar__label">{t("modules.disposals.list.filter_by_status")}</span>
        <div className="status-filter-bar__chips">
          <button
            className={`status-chip ${selectedStatus === "all" ? "active" : ""}`}
            onClick={() => { setSelectedStatus("all"); setSkip(0); }}
          >
            <span className="status-chip__label">{t("filter_all")}</span>
          </button>
          {statusCounts.map((s) => (
            <button
              key={s.value}
              className={`status-chip ${selectedStatus === s.value ? "active" : ""}`}
              onClick={() => { setSelectedStatus(s.value); setSkip(0); }}
            >
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
          <h2>{t("modules.disposals.list.title")}</h2>
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
        {filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 -960 960 960" fill="#d1d5db">
                <path d="M520-80q-17 0-28.5-11.5T480-120q0-17 11.5-28.5T520-160h320q17 0 28.5 11.5T880-120q0 17-11.5 28.5T840-80H520Z" />
              </svg>
            </div>
            <p className="empty-state__text">{t("modules.disposals.list.empty")}</p>
          </div>
        ) : (
          filteredData.map((disposal, index) => {
            const statusMeta = DISPOSAL_STATUSES.find((s) => s.value === disposal.disposal_status);
            const methodMeta = DISPOSAL_METHODS?.find((m) => m.value === disposal.method);
            return (
              <div key={disposal.id} className="workflow-card" style={{ animationDelay: `${index * 40}ms` }}>
                <div className="workflow-card__header">
                  <span
                    className="workflow-status-badge"
                    style={{ background: statusMeta?.dot ? `${statusMeta.dot}20` : undefined, color: statusMeta?.dot }}
                  >
                    {statusMeta?.label}
                  </span>
                  <span className="workflow-code">{disposal.asset_code ?? "—"}</span>
                </div>

                <div className="workflow-card__body">
                  <h3 className="workflow-name">{disposal.asset_name ?? "—"}</h3>

                  <div className="disposal-method-badge">
                    <span className={`method-badge ${methodMeta?.className ?? ""}`}>
                      {disposal.method}
                    </span>
                    {disposal.sale_price !== undefined && (
                      <span className="disposal-sale-price">
                        {formatCurrency(disposal.sale_price)}
                      </span>
                    )}
                  </div>

                  <p className="workflow-reason">{disposal.reason}</p>

                  <div className="workflow-meta">
                    <div className="workflow-meta__item">
                      {t("modules.disposals.list.initiated")} {t("modules.disposals.list.by")}: {disposal.created_by_name ?? "—"}
                    </div>
                    <div className="workflow-meta__item">{formatDate(disposal.created_time)}</div>
                  </div>
                </div>

                <div className="workflow-card__footer">
                  <div className="workflow-actions">
                    {disposal.disposal_status === "pending" && (
                      <>
                        <button
                          className="btn-action btn-action--success"
                          title="Approve"
                          onClick={() => handleApprove(disposal.id)}
                          disabled={workflowMutation.isPending}
                        >
                          <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor"><path d={"M382-202 144-440l56-56 182 182 350-350 56 56-406 406Z"} /></svg>
                        </button>
                        <button
                          className="btn-action btn-action--danger"
                          title="Reject"
                          onClick={() => handleReject(disposal.id)}
                          disabled={workflowMutation.isPending}
                        >
                          <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor"><path d={"M336-285 168-453l56-56 168 168 168-168 56 56-168 168 168 168-56 56-168-168-168 168-56-56 168-168Z"} /></svg>
                        </button>
                      </>
                    )}
                    <Link to={`/${moduleName}/${disposal.id}`} className="btn-action" title="View">
                      <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49-119q0-70 49-119t119-49q70 0 119 49t49 119q0 70-49 119t-119 49Z" /></svg>
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
