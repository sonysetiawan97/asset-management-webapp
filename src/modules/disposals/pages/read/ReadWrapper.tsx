import { type FC } from "react";
import { moduleName, type DisposalRequest, DISPOSAL_STATUSES, DISPOSAL_METHODS } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "@/utils/apiAxios";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { BackButton } from "@components/buttons/BackButton";
import { useFindOneById } from "@hooks/request/useFindOneById";
import { ContentLoader } from "@components/loadings/ContentLoader";
import NotFound from "@modules/errors/pages/404NotFound";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null || isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
};

interface WorkflowButtonProps {
  id: string;
  action: "approve" | "reject";
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const WorkflowButton: FC<WorkflowButtonProps> = ({ id, action, onSuccess, onError }) => {
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationFn: () => apiAxios.patch(`${moduleName}/${id}/${action}`),
    onSuccess: () => { onSuccess(); },
    onError: (error: unknown) => {
      const { message } = error as AxiosError;
      onError(message || "Operation failed");
    },
  });

  const isApprove = action === "approve";
  return (
    <button
      className={`btn btn-sm ${isApprove ? "btn-success" : "btn-danger"}`}
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending
        ? t("button.action") + "..."
        : isApprove
          ? t("button.approve")
          : t("button.reject")
      }
    </button>
  );
};

const ReadPage: FC<{ data: DisposalRequest }> = ({ data }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const statusMeta = DISPOSAL_STATUSES.find((s) => s.value === data.disposal_status);
  const methodMeta = DISPOSAL_METHODS.find((m) => m.value === data.method);
  const isPending = data.disposal_status === "pending";

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [moduleName] });
    enqueueSnackbar(
      data.disposal_status === "pending"
        ? t("modules.disposals.list.notification.approved")
        : t("modules.disposals.list.notification.rejected"),
      { variant: "success" }
    );
  };

  const handleError = (msg: string) => { enqueueSnackbar(msg, { variant: "error" }); };

  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h6 className="mb-0">{t("modules.disposals.read.title")}</h6>
            <span
              className="badge"
              style={{ background: statusMeta?.dot ? `${statusMeta.dot}20` : "#e5e7eb", color: statusMeta?.dot ?? "#6b7280" }}
            >
              {statusMeta?.label}
            </span>
          </div>
          <div className="card-body">
            {/* Asset Info */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label text-muted small">{t("modules.disposals.create.form.asset")}</label>
                <div className="fw-medium">{data.asset_name ?? "—"}</div>
                <div className="text-muted small">{data.asset_code ?? "—"}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small">{t("modules.disposals.create.form.method")}</label>
                <div className="fw-medium">
                  <span className={`badge ${methodMeta?.className ?? "bg-secondary"}`}>{data.method}</span>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="mb-3">
              <label className="form-label text-muted small">{t("modules.disposals.create.form.reason")}</label>
              <div className="fw-medium">{data.reason}</div>
            </div>

            {/* Conditional fields */}
            {(data.sale_price !== undefined || data.buyer || data.transaction_date) && (
              <div className="row mb-3">
                {data.sale_price !== undefined && (
                  <div className="col-md-4">
                    <label className="form-label text-muted small">{t("modules.disposals.create.form.sale_price")}</label>
                    <div className="fw-medium">{formatCurrency(data.sale_price)}</div>
                  </div>
                )}
                {data.buyer && (
                  <div className="col-md-4">
                    <label className="form-label text-muted small">{t("modules.disposals.create.form.buyer")}</label>
                    <div className="fw-medium">{data.buyer}</div>
                  </div>
                )}
                {data.transaction_date && (
                  <div className="col-md-4">
                    <label className="form-label text-muted small">{t("modules.disposals.create.form.transaction_date")}</label>
                    <div className="fw-medium">{data.transaction_date}</div>
                  </div>
                )}
              </div>
            )}

            {data.certificate_ref && (
              <div className="mb-3">
                <label className="form-label text-muted small">{t("modules.disposals.create.form.certificate_ref")}</label>
                <div className="fw-medium">{data.certificate_ref}</div>
              </div>
            )}

            <hr />

            {/* Approval Info */}
            {data.approved_by_name && (
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small">Approved/Rejected By</label>
                  <div className="fw-medium">{data.approved_by_name}</div>
                </div>
                {data.approved_at && (
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Date</label>
                    <div className="fw-medium">{formatDate(data.approved_at)}</div>
                  </div>
                )}
              </div>
            )}

            {data.rejection_reason && (
              <div className="mb-3">
                <label className="form-label text-muted small">Rejection Reason</label>
                <div className="fw-medium text-danger">{data.rejection_reason}</div>
              </div>
            )}

            {/* Initiator */}
            <div className="row">
              <div className="col-md-6">
                <label className="form-label text-muted small">Initiated {t("modules.disposals.list.by")}</label>
                <div className="fw-medium">{data.created_by_name ?? "—"}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small">Date</label>
                <div className="fw-medium">{formatDate(data.created_time)}</div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="card-footer d-flex align-items-center justify-content-between">
            <BackButton />
            {isPending && (
              <div className="d-flex gap-2">
                <WorkflowButton id={data.id} action="reject" onSuccess={handleSuccess} onError={handleError} />
                <WorkflowButton id={data.id} action="approve" onSuccess={handleSuccess} onError={handleError} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReadWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<DisposalRequest>(moduleName, id);

  useEffect(() => {
    if (data) setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Disposals", path: `/${moduleName}` }, { label: data.asset_name ?? "Read" }]);
  }, [data]);

  if (isLoading) return <ContentLoader />;
  if (!data || error) return <NotFound />;

  return (
    <>
      <TitleBarWithIcon title={t("modules.disposals.read.title")}>
        <i className="bi bi-eye"></i>
      </TitleBarWithIcon>
      <ReadPage data={data} />
    </>
  );
};

export default ReadWrapper;