import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type ReadCheckoutModel, type CheckinModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { BackButton } from "@components/buttons/BackButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useFindOneById } from "@hooks/request/useFindOneById";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { ContentLoader } from "@components/loadings/ContentLoader";
import NotFound from "@modules/errors/pages/404NotFound";
import { apiAxios } from "@/utils/apiAxios";
import { CheckinFormFields } from "../../components/FormFields";

const ReadWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<ReadCheckoutModel>(moduleName, id);
  const methods = useForm<CheckinModel>({ mode: "onBlur" });
  const { reset } = methods;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (data) {
      reset({
        condition_on_return: data.condition_on_return,
        return_date: data.return_date,
        notes: data.notes,
      });
    }
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: t("modules.checkout.list.title"), path: `/${moduleName}` },
      { label: data?.asset_name ?? t("modules.checkout.read.title") },
    ]);
  }, [data, reset, t]);

  const onSubmit = async (formData: CheckinModel) => {
    if (!id) {
      enqueueSnackbar("Checkout ID required", { variant: "error" });
      return;
    }
    try {
      await apiAxios.post(`/assets/checkin/${id}`, {
        condition: formData.condition_on_return,
        notes: formData.notes,
      });
      enqueueSnackbar(t("modules.checkout.update.notification.success"), { variant: "success" });
      methods.reset();
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  if (isLoading) return <ContentLoader />;
  if (!data || error) return <NotFound />;

  const isReturned = !!data.return_date;
  const isOverdue = !isReturned && data.expected_return_date && new Date(data.expected_return_date) < new Date();

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.checkout.update.title")}>
        <svg height="24" width="24" viewBox="0 -960 960 960" fill="#000">
          <path d="M386-194q22-22 51-34t60-12h110v-100H537q-36 0-60 24.5T453-280v-140q0-36-24-60t-60-24H209v100h140v100H179q-36 0-60 24t-24 60v140q0 36 24 60t60 24h110q33 0 60-12t51-34Z" />
        </svg>
      </TitleBarWithIcon>

      {/* Asset Info Card */}
      <div className="card mb-4" style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
        <div className="card-body p-4">
          {/* Asset header */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h4 className="mb-1 fw-semibold" style={{ color: "#1a1a2e" }}>
                {data.asset_name ?? "—"}
              </h4>
              <span className="badge" style={{ background: "#f3f4f6", color: "#6b7280", fontSize: "12px" }}>
                {data.asset_code ?? "—"}
              </span>
            </div>
            {isReturned ? (
              <span className="workflow-status-badge workflow-status-badge--returned">{t("modules.checkout.list.returned")}</span>
            ) : isOverdue ? (
              <span className="workflow-status-badge workflow-status-badge--overdue">{t("modules.checkout.list.overdue")}</span>
            ) : (
              <span className="workflow-status-badge workflow-status-badge--active">{t("modules.checkout.list.active")}</span>
            )}
          </div>

          {/* Metadata grid */}
          <div className="row g-3 mt-2">
            <div className="col-md-4">
              <p className="text-muted mb-1" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("modules.checkout.list.assigned_to")}
              </p>
              <p className="mb-0 fw-medium" style={{ color: "#374151" }}>
                {data.assigned_to_name ?? "—"}
              </p>
            </div>
            <div className="col-md-4">
              <p className="text-muted mb-1" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("modules.checkout.list.checked_out_on")}
              </p>
              <p className="mb-0 fw-medium" style={{ color: "#374151" }}>
                {data.checkout_date ?? "—"}
              </p>
            </div>
            <div className="col-md-4">
              <p className="text-muted mb-1" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("modules.checkout.list.expected")}
              </p>
              <p className="mb-0 fw-medium" style={{ color: isOverdue ? "#ef4444" : "#374151" }}>
                {data.expected_return_date ?? "—"}
                {isOverdue && (
                  <span className="badge badge-soft-danger ms-2" style={{ fontSize: "11px" }}>
                    Overdue
                  </span>
                )}
              </p>
            </div>
          </div>

          {data.notes && (
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid #f3f4f6" }}>
              <p className="text-muted mb-1" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("modules.checkout.update.label_notes")}
              </p>
              <p className="mb-0" style={{ color: "#6b7280", fontSize: "14px" }}>{data.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Check-In Form */}
      {!isReturned ? (
        <div className="card p-4" style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <h5 className="fw-semibold mb-3" style={{ color: "#1a1a2e" }}>
            {t("modules.checkout.update.title")}
          </h5>
          <form className="row g-3" onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="col-12">
              <CheckinFormFields />
            </div>
            <div className="col-12">
              <div className="d-flex gap-2">
                <BackButton />
                <SubmitButton isLoading={false} />
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="alert d-flex align-items-center gap-2" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", borderRadius: "12px" }}>
          <svg width="18" height="18" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M382-202 144-440l56-56 182 182 350-350 56 56-406 406Z" />
          </svg>
          <span className="fw-medium">
            {t("modules.checkout.update.alert_returned")}
          </span>
          <span style={{ color: "#166534" }}>
            — {t("modules.checkout.list.returned_on")} {data.return_date}
          </span>
        </div>
      )}
    </FormProvider>
  );
};

export default ReadWrapper;
