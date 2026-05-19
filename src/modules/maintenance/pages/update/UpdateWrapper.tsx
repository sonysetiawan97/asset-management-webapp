import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type ReadMaintenanceModel, type CompleteMaintenanceModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { BackButton } from "@components/buttons/BackButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useFindOneById } from "@hooks/request/useFindOneById";
import { useUpdate } from "@hooks/request/useUpdate";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { LoadingPage } from "@/components/loadings/LoadingPage";
import NotFound from "@modules/errors/pages/404NotFound";
import { useFindAll } from "@hooks/request/useFindAll";
import { FormFields } from "../../components/FormFields";

const UpdateWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<ReadMaintenanceModel>(moduleName, id);
  const methods = useForm<CompleteMaintenanceModel>({ mode: "onBlur" });
  const { reset } = methods;
  const { updateAsync, isLoading: isUpdating } = useUpdate<CompleteMaintenanceModel>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data: assetsData } = useFindAll<{ id: string; name: string; asset_code: string }>("assets", "assets");
  const { data: usersData } = useFindAll<{ id: string; name: string }>("users", "users");

  const assets = assetsData?.result ?? [];
  const users = usersData?.result ?? [];

  useEffect(() => {
    if (data) reset(data);
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Maintenance", path: `/${moduleName}` }, { label: data?.asset_name ?? "Complete" }]);
  }, [data, reset]);

  const onSubmit = async (formData: CompleteMaintenanceModel) => {
    try {
      await updateAsync({ id: id!, url: moduleName, body: formData });
      enqueueSnackbar(t("modules.maintenance.update.notification.success"), { variant: "success" });
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  if (isLoading) return <LoadingPage />;
  if (!data || error) return <NotFound />;
  if (!assetsData || !usersData) return <LoadingPage />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.maintenance.update.title")}>
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
          <path d="M382-202 144-440l56-56 182 182 350-350 56 56-406 406Z" />
        </svg>
      </TitleBarWithIcon>
      <form className="row g-3" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="col-12"><FormFields assets={assets} users={users} /></div>
        <div className="col-12">
          <div className="d-flex gap-2">
            <BackButton />
            <SubmitButton isLoading={isUpdating} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default UpdateWrapper;