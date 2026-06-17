import { type FC, useState } from "react";
import { moduleName, type ReadTransferModel, TRANSFER_STATUSES } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { BackButton } from "@components/buttons/BackButton";
import { useFindOneById } from "@hooks/request/useFindOneById";
import { ContentLoader } from "@components/loadings/ContentLoader";
import NotFound from "@modules/errors/pages/404NotFound";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "@/utils/apiAxios";
import { useSnackbar } from "notistack";
import { Modal } from "@components/Modal";
import type { AxiosError } from "axios";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

interface ReadPageProps {
  id: string;
  data: ReadTransferModel;
  transferStatus?: string;
  onApprove?: () => void;
  onOpenRejectModal?: () => void;
  isWorkflowPending?: boolean;
}

const ReadPage: FC<ReadPageProps> = ({ id, data, transferStatus, onApprove, onOpenRejectModal, isWorkflowPending }) => {
  const { t } = useTranslation();

  const statusMeta = TRANSFER_STATUSES.find((s) => s.value === data.transfer_status);
  const typeLabel = t(`modules.transfers.list.transfer_type_short.${data.transfer_type}`);

  return (
    <div className="workflow-detail animate-fade-slide-up">
      {/* Header Card */}
      <div className="ui-card workflow-card">
        <div className="workflow-card__header">
          <div className="d-flex gap-2 align-items-center">
            <span
              className="workflow-status-badge"
              style={{
                background: statusMeta?.dot ? `${statusMeta.dot}20` : undefined,
                color: statusMeta?.dot,
              }}
            >
              {statusMeta?.label}
            </span>
            <span className="workflow-type-badge">{typeLabel}</span>
          </div>
          <span className="workflow-code">{data.asset_code ?? "—"}</span>
        </div>
        <div className="workflow-card__body">
          <h2 className="workflow-name" >
            {data.asset_name ?? "—"}
          </h2>
        </div>
      </div>

      {/* Transfer Route Card */}
      <div className="ui-card workflow-card">
        <div className="workflow-card__body">
          <div className="transfer-route">
            <div className="transfer-route__from">
              <div className="d-flex align-items-center gap-1 mb-1">
                <i className="bi bi-geo-alt-fill" style={{ color: "#ef4444" }}></i>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{t("modules.transfers.list.from_label")}</span>
              </div>
              <strong>{data.from_location_name ?? "—"}</strong>
              {data.from_department_name && <small>{data.from_department_name}</small>}
              {data.from_custodian_name && <small>{data.from_custodian_name}</small>}
            </div>
            <div className="transfer-route__arrow">
              <i className="bi bi-arrow-right fs-4"></i>
            </div>
            <div className="transfer-route__to">
              <div className="d-flex align-items-center gap-1 mb-1">
                <i className="bi bi-geo-alt-fill" style={{ color: "#10b981" }}></i>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{t("modules.transfers.list.to_label")}</span>
              </div>
              <strong>{data.to_location_name ?? "—"}</strong>
              {data.to_department_name && <small>{data.to_department_name}</small>}
              {data.to_custodian_name && <small>{data.to_custodian_name}</small>}
            </div>
          </div>
        </div>
      </div>

      {/* Reason & Notes Card */}
      <div className="ui-card workflow-card">
        <div className="workflow-card__body">
          <div className="workflow-detail__field">
            <span className="workflow-detail__label">{t("modules.transfers.create.form.reason")}</span>
            <p className="workflow-detail__value">{data.reason ?? "—"}</p>
          </div>
          {data.notes && (
            <div className="workflow-detail__field" style={{ marginTop: 12 }}>
              <span className="workflow-detail__label">{t("modules.transfers.create.form.notes")}</span>
              <p className="workflow-detail__value">{data.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline / Metadata Card */}
      <div className="ui-card workflow-card">
        <div className="workflow-card__body">
          <div className="workflow-meta">
            <div className="workflow-meta__item">
              <i className="bi bi-person"></i>
              {t("modules.transfers.list.requested_by")}: <strong>{data.created_by_name ?? "—"}</strong>
            </div>
            <div className="workflow-meta__item">
              <i className="bi bi-calendar3"></i>
              {formatDate(data.created_time)}
            </div>
            {data.transfer_status === "approved" && data.approved_by_name && (
              <div className="workflow-meta__item">
                <i className="bi bi-check-circle" style={{ color: "#10b981" }}></i>
                {t("modules.transfers.read.approved_by")}: <strong>{data.approved_by_name}</strong>
                {data.approved_at && <> &middot; {formatDate(data.approved_at)}</>}
              </div>
            )}
            {data.transfer_status === "rejected" && (
              <>
                {data.approved_by_name && (
                  <div className="workflow-meta__item">
                    <i className="bi bi-x-circle" style={{ color: "#ef4444" }}></i>
                    {t("modules.transfers.read.rejected_by")}: <strong>{data.approved_by_name}</strong>
                    {data.approved_at && <> &middot; {formatDate(data.approved_at)}</>}
                  </div>
                )}
                {data.rejection_reason && (
                  <div className="workflow-meta__item">
                    <i className="bi bi-chat-square-text"></i>
                    {t("modules.transfers.read.rejection_reason")}: <em>{data.rejection_reason}</em>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-2 justify-content-end">
        {transferStatus === "pending" && (
          <>
            <AuthPrivilegesChecker link={`/${moduleName}/${id}/approve`} method="PATCH">
              <button className="btn btn-success" onClick={onApprove} disabled={isWorkflowPending}>
                <i className="bi bi-check-lg me-1"></i> {t("modules.transfers.read.approve")}
              </button>
            </AuthPrivilegesChecker>
            <AuthPrivilegesChecker link={`/${moduleName}/${id}/reject`} method="PATCH">
              <button className="btn btn-danger" onClick={onOpenRejectModal} disabled={isWorkflowPending}>
                <i className="bi bi-x-lg me-1"></i> {t("modules.transfers.read.reject")}
              </button>
            </AuthPrivilegesChecker>
          </>
        )}
        <BackButton />
      </div>
    </div>
  );
};

const ReadWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<ReadTransferModel>(moduleName, id);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Transfers", path: `/${moduleName}` }, { label: data?.asset_name ?? "Read" }]);
  }, [data]);

  const workflowMutation = useMutation({
    mutationFn: ({ action, reason }: { action: "approve" | "reject"; reason?: string }) =>
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

  const handleApprove = () => {
    if (!id) return;
    workflowMutation.mutate({ action: "approve" });
  };

  const handleOpenRejectModal = () => {
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!id) return;
    workflowMutation.mutate(
      { action: "reject", reason: rejectionReason },
      { onSettled: () => setShowRejectModal(false) }
    );
  };

  if (isLoading) return <ContentLoader />;
  if (!data || error) return <NotFound />;

  return (
    <>
      <TitleBarWithIcon title={t("modules.transfers.read.title")}>
        <i className="bi bi-eye"></i>
      </TitleBarWithIcon>
      <ReadPage
        id={id ?? ""}
        data={data}
        transferStatus={data.transfer_status}
        onApprove={handleApprove}
        onOpenRejectModal={handleOpenRejectModal}
        isWorkflowPending={workflowMutation.isPending}
      />

      <Modal
        isOpen={showRejectModal}
        closeModal={() => setShowRejectModal(false)}
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
          <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)} disabled={workflowMutation.isPending}>
            {t("modules.transfers.read.reject_cancel")}
          </button>
          <AuthPrivilegesChecker link={`/${moduleName}/${id}/reject`} method="PATCH">
            <button
              className="btn btn-danger"
              onClick={handleConfirmReject}
              disabled={workflowMutation.isPending || !rejectionReason.trim()}
            >
              {t("modules.transfers.read.reject_confirm")}
            </button>
          </AuthPrivilegesChecker>
        </div>
      </Modal>
    </>
  );
};

export default ReadWrapper;
