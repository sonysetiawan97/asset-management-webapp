import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type CreateCheckoutModel } from "../../types/Model";
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
import { LoadingPage } from "@/components/loadings/LoadingPage";

const CreateWrapper: FC = () => {
  const methods = useForm<CreateCheckoutModel>({ mode: "onBlur" });
  const { t } = useTranslation();
  const { isLoading } = useCreate<CreateCheckoutModel>(moduleName);
  const { data: assetsData } = useFindAll<{ id: string; name: string; asset_code: string }>("assets", "/api/v1/assets");
  const { data: usersData } = useFindAll<{ id: string; name: string }>("users", "/api/v1/users");

  const assets = assetsData?.result ?? [];
  const users = usersData?.result ?? [];

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Checkouts", path: `/${moduleName}` }, { label: "Checkout" }]);
  }, []);

  const onSubmit = async (data: CreateCheckoutModel) => {
    try {
      console.log("Checkout:", data);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  if (!assets || !users) return <LoadingPage />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.checkout.create.title")}>
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M720-160q-33 0-56.5-23.5T640-240v-480q0-33 23.5-56.5T720-800h240q33 0 56.5 23.5T1040-720v480q0 33-23.5 56.5T960-160H720Zm0-160v-100h80v100h100v80h-100v100h-80v-100H640v-80h80Z" /></svg>
      </TitleBarWithIcon>
      <form className="row g-3" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="col-12"><FormFields assets={assets} users={users} /></div>
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