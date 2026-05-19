import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type ReadCheckoutModel, type CheckinModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { CheckinFormFields } from "../../components/FormFields";
import { BackButton } from "@components/buttons/BackButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useFindOneById } from "@hooks/request/useFindOneById";
import { useUpdate } from "@hooks/request/useUpdate";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useFindAll } from "@hooks/request/useFindAll";
import { LoadingPage } from "@/components/loadings/LoadingPage";
import NotFound from "@modules/errors/pages/404NotFound";

const ReadWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<ReadCheckoutModel>(moduleName, id);
  const methods = useForm<CheckinModel>({ mode: "onBlur" });
  const { reset } = methods;
  const { updateAsync, isLoading: isUpdating } = useUpdate<CheckinModel>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data: assetsData } = useFindAll<{ id: string; name: string; asset_code: string }>("assets", "/api/v1/assets");
  const { data: usersData } = useFindAll<{ id: string; name: string }>("users", "/api/v1/users");

  const assets = assetsData?.result ?? [];
  const users = usersData?.result ?? [];

  useEffect(() => {
    if (data) reset(data);
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Checkouts", path: `/${moduleName}` }, { label: data?.asset_name ?? "Read" }]);
  }, [data, reset]);

  const onSubmit = async (formData: CheckinModel) => {
    try {
      await updateAsync({ id: id!, url: moduleName, body: formData });
      enqueueSnackbar(t("modules.checkout.update.notification.success"), { variant: "success" });
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
      <TitleBarWithIcon title={t("modules.checkout.update.title")}>
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M386-194q22-22 51-34t60-12h110v-100H537q-36 0-60 24.5T453-280v-140q0-36-24-60t-60-24H209v100h140v100H179q-36 0-60 24t-24 60v140q0 36 24 60t60 24h110q33 0 60-12t51-34Z" /></svg>
      </TitleBarWithIcon>
      <form className="row g-3" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="col-12"><CheckinFormFields assets={assets} users={users} /></div>
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

export default ReadWrapper;