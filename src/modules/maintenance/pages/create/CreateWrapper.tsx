import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type CreateMaintenanceModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { FormFields } from "../../components/FormFields";
import { CancelButton } from "@components/buttons/CancelButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useCreate } from "@hooks/request/useCreate";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { useFindAll } from "@hooks/request/useFindAll";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { useNavigate } from "react-router-dom";

const CreateWrapper: FC = () => {
  const methods = useForm<CreateMaintenanceModel>({ mode: "onBlur" });
  const { t } = useTranslation();
  const { createAsync, isLoading } = useCreate<CreateMaintenanceModel>(moduleName);
  const navigate = useNavigate();
  const { data: assetsData } = useFindAll<{ id: string; name: string; asset_code: string }>("assets", "assets");
  const { data: usersData } = useFindAll<{ id: string; first_name: string; last_name: string }>("users", "users");

  const assets = assetsData?.result ?? [];
  const users = usersData?.result ?? [];

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

  if (!assets || !users) return <ContentLoader />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.maintenance.create.title")}>
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
          <path d="M440-280v-80h80v80h-80Zm160 0v-80h80v80h-80Z" />
        </svg>
      </TitleBarWithIcon>
      <form className="row g-3" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="col-12">
          <FormFields assets={assets} users={users} />
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