import { type FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type CreateMaintenanceModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { FormFields } from "../../components/FormFields";
import { CancelButton } from "@components/buttons/CancelButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useCreate } from "@hooks/request/useCreate";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const CreateWrapper: FC = () => {
  const methods = useForm<CreateMaintenanceModel>({ mode: "onBlur" });
  const { t } = useTranslation();
  const { createAsync, isLoading } = useCreate<CreateMaintenanceModel>(moduleName);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Maintenance", path: `/${moduleName}` }, { label: "Log" }]);
  }, []);

  const onSubmit = async (data: CreateMaintenanceModel) => {
    try {
      const payload = { ...data, performed_by: data.performed_by ? String(data.performed_by) : undefined };
      await createAsync({ url: moduleName, body: payload });
      enqueueSnackbar(t("modules.maintenance.create.notification.success"), { variant: "success" });
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.maintenance.create.title")}>
        <i className="bi bi-wrench"></i>
      </TitleBarWithIcon>
      <form className="row g-3" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="col-12">
          <FormFields control={methods.control} />
        </div>
        <div className="col-12">
          <div className="d-flex gap-3">
            <CancelButton to={`/${moduleName}`} />
            <SubmitButton isLoading={isLoading} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateWrapper;
