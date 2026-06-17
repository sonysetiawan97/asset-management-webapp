import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "@/utils/apiAxios";
import {
  moduleName,
  type TransferRequest,
  type TransferStatus,
  TRANSFER_FILTER_STATUSES,
  TRANSFER_STATUS_COLORS,
  TRANSFER_STATUSES,
} from "../../types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";
import { Pagination } from "@components/list/Pagination";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { Modal } from "@components/Modal";

interface ListProps {
  data: TransferRequest[];
  count: number;
  allCount: number;
  countByStatus: Record<string, number>;
  selectedStatus: TransferStatus | null;
  onStatusChange: (status: TransferStatus | null) => void;
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const workflowMutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: "approve" | "reject"; reason?: string }) =>
      apiAxios.patch(`${moduleName}/${id}/${action}`, action === "reject" ? { reason } : undefined),
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

  const handleReject = (id: string) => {
    setRejectTargetId(id);
    setRejectionReason("");
  };

  const closeRejectModal = () => {
    setRejectTargetId(null);
    setRejectionReason("");
  };

  const handleConfirmReject = () => {
    if (!rejectTargetId) return;
    workflowMutation.mutate(
      { id: rejectTargetId, action: "reject", reason: rejectionReason },
      { onSettled: closeRejectModal }
    );
  };

  const statusStats = TRANSFER_FILTER_STATUSES.map((s) => ({
    ...s,
    count: countByStatus[s.value] ?? 0,
  }));

  return (
    <div className="module-list-container">
      {/* Stat Bar */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{allCount}</span>
          <span className="stat-label">{t("modules.transfers.list.total_transfers")}</span>
        </div>
        {statusStats.map((s) => (
          <div key={s.value} className="stat-item">
            <span className="stat-value" style={{ color: TRANSFER_STATUS_COLORS[s.value]?.dot }}>{s.count}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Status Filter Chips */}
      <div className="status-filter-bar">
        <span className="status-filter-bar__label">{t("modules.transfers.list.filter_by_status")}</span>
        <div className="status-filter-bar__chips">
          <button
            className={`status-chip ${selectedStatus === null ? "active" : ""}`}
            onClick={() => onStatusChange(null)}
          >
            <span className="status-chip__label">{t("modules.transfers.list.all")}</span>
            <span className="status-chip__count">{allCount}</span>
          </button>
          {statusStats.map((s) => {
            const colors = TRANSFER_STATUS_COLORS[s.value];
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
          <i className="bi bi-arrow-left-right fs-4" style={{ color: "#1a1a2e" }}></i>
          <h2>{t("modules.transfers.list.title")}</h2>
        </div>
        <AuthPrivilegesChecker link={`/${moduleName}`} method="POST">
          <Link to={`/${moduleName}/create`} className="btn-create">
            <i className="bi bi-plus-lg"></i>
            {t("button.create")}
          </Link>
        </AuthPrivilegesChecker>
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
                ? t(`modules.transfers.list.empty_by_status.${selectedStatus}`)
                : t("modules.transfers.list.empty")}
            </p>
          </div>
        ) : (
          data.map((transfer, index) => {
            const statusMeta = TRANSFER_STATUSES.find((s) => s.value === transfer.transfer_status);
            return (
              <div key={transfer.id} className="ui-card workflow-card" style={{ animationDelay: `${index * 40}ms` }}>
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
                          title={t("modules.transfers.list.approve")}
                          onClick={() => handleApprove(transfer.id)}
                          disabled={workflowMutation.isPending}
                        >
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button
                          className="btn-action btn-action--danger"
                          title={t("modules.transfers.list.reject")}
                          onClick={() => handleReject(transfer.id)}
                          disabled={workflowMutation.isPending}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </>
                    )}
                    <Link to={`/${moduleName}/${transfer.id}`} className="btn-action" title={t("modules.transfers.list.view")}>
                      <i className="bi bi-eye"></i>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={rejectTargetId !== null}
        closeModal={closeRejectModal}
        title={t("modules.transfers.read.reject_modal_title")}
      >
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{t("modules.transfers.read.rejection_reason_label")}</label>
            <textarea
              className="form-control"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={t("modules.transfers.read.rejection_reason_placeholder")}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeRejectModal} disabled={workflowMutation.isPending}>
            {t("modules.transfers.read.reject_cancel")}
          </button>
          <button
            className="btn btn-danger"
            onClick={handleConfirmReject}
            disabled={workflowMutation.isPending || !rejectionReason.trim()}
          >
            {t("modules.transfers.read.reject_confirm")}
          </button>
        </div>
      </Modal>

      {/* Pagination */}
      <Pagination count={count} skip={skip} limit={limit} onPageChange={setSkip} />
    </div>
  );
};

export default List;
