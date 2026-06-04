import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "@/utils/apiAxios";
import { moduleName, type TransferRequest, type CountByTransferStatus, TRANSFER_STATUSES } from "../../types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";

interface ListProps {
  data: TransferRequest[];
  count: number;
  countByStatus?: CountByTransferStatus;
  isLoading: boolean;
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export const List: FC<ListProps> = ({ data, count, countByStatus }) => {
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
          ? t("modules.transfers.list.notification.approved")
          : t("modules.transfers.list.notification.rejected"),
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

  const statusCounts = TRANSFER_STATUSES.map((s) => ({
    ...s,
    count: countByStatus?.[s.value] ?? 0,
  }));

  const filteredData =
    selectedStatus === "all" ? data : data.filter((r) => r.transfer_status === selectedStatus);

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
          <button
            className={`status-chip ${selectedStatus === "all" ? "active" : ""}`}
            onClick={() => { setSelectedStatus("all"); setSkip(0); }}
          >
            <span className="status-chip__label">All</span>
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
          <i className="bi bi-arrow-left-right fs-4" style={{ color: "#1a1a2e" }}></i>
          <h2>{t("modules.transfers.list.title")}</h2>
        </div>
        <Link to={`/${moduleName}/create`} className="btn-create">
          <i className="bi bi-plus-lg"></i>
          {t("button.create")}
        </Link>
      </div>

      {/* Cards */}
      <div className="workflow-grid animate-fade-slide-up">
        {filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <i className="bi bi-inbox fs-1" style={{ color: "#d1d5db" }}></i>
            </div>
            <p className="empty-state__text">{t("modules.transfers.list.empty")}</p>
          </div>
        ) : (
          filteredData.map((transfer, index) => {
            const statusMeta = TRANSFER_STATUSES.find((s) => s.value === transfer.transfer_status);
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
                      <i className="bi bi-geo-alt-fill" style={{ color: "#ef4444" }}></i>
                      <span>{transfer.from_location_name ?? "—"}</span>
                      {transfer.from_custodian_name && <small>{transfer.from_custodian_name}</small>}
                    </div>
                    <div className="transfer-route__arrow">
                      <i className="bi bi-arrow-right"></i>
                    </div>
                    <div className="transfer-route__to">
                      <i className="bi bi-geo-alt-fill" style={{ color: "#10b981" }}></i>
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
                    {transfer.transfer_status === "pending" && (
                      <>
                        <button
                          className="btn-action btn-action--success"
                          title="Approve"
                          onClick={() => handleApprove(transfer.id)}
                          disabled={workflowMutation.isPending}
                        >
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button
                          className="btn-action btn-action--danger"
                          title="Reject"
                          onClick={() => handleReject(transfer.id)}
                          disabled={workflowMutation.isPending}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </>
                    )}
                    <Link to={`/${moduleName}/${transfer.id}`} className="btn-action" title="View">
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