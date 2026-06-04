import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type ReadMaintenanceModel, type UpdateMaintenanceModel } from "../../types/Model";
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
import { ContentLoader } from "@components/loadings/ContentLoader";
import NotFound from "@modules/errors/pages/404NotFound";
import { useFindAll } from "@hooks/request/useFindAll";
import { FormFields } from "../../components/FormFields";

const UpdateWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<ReadMaintenanceModel>(moduleName, id);
  const methods = useForm<UpdateMaintenanceModel>({ mode: "onBlur" });
  const { reset } = methods;
  const { updateAsync, isLoading: isUpdating } = useUpdate<UpdateMaintenanceModel>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data: assetsData } = useFindAll<{ id: string; name: string; asset_code: string }>("assets", "assets");
  const { data: usersData } = useFindAll<{ id: string; first_name: string; last_name: string }>("users", "users");

  const assets = assetsData?.result ?? [];
  const users = usersData?.result ?? [];

  useEffect(() => {
    if (!data || !users.length) return;
    reset({
      asset_id: data.asset_id,
      type: data.type,
      date_performed: data.date_performed,
      performed_by: data.performed_by ? String(data.performed_by) : undefined,
      description: data.description,
      cost: data.cost,
      next_maintenance_date: data.next_maintenance_date,
    });
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Maintenance", path: `/${moduleName}` }, { label: data?.asset_name ?? "Complete" }]);
  }, [data, users.length, reset]);

  const onSubmit = async (formData: UpdateMaintenanceModel) => {
    if (!id) {
      enqueueSnackbar(t("common.form.error.id_required"), { variant: "error" });
      return;
    }
    if (!data) return;
    try {
      const payload = {
        ...formData,
        performed_by: String(data.performed_by),
      };
      await updateAsync({ id, url: moduleName, body: payload });
      enqueueSnackbar(t("modules.maintenance.update.notification.success"), { variant: "success" });
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  if (isLoading) return <ContentLoader />;
  if (!data || error) return <NotFound />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.maintenance.update.title")}>
        <i className="bi bi-pencil"></i>
      </TitleBarWithIcon>
      <form className="row g-3" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="col-12"><FormFields readOnly assets={assets} users={users} /></div>
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