import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type CreateTransferModel } from "../../types/Model";
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
  const methods = useForm<CreateTransferModel>({ mode: "onBlur" });
  const { t } = useTranslation();
  const { isLoading } = useCreate<CreateTransferModel>(moduleName);
  const { data: assetsData } = useFindAll<{ id: string; name: string; asset_code: string }>("assets", "/api/v1/assets");
  const { data: locationsData } = useFindAll<{ id: string; name: string }>("locations", "/api/v1/locations");
  const { data: usersData } = useFindAll<{ id: string; name: string }>("users", "/api/v1/users");

  const assets = assetsData?.result ?? [];
  const locations = locationsData?.result ?? [];
  const users = usersData?.result ?? [];
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Transfers", path: `/${moduleName}` }, { label: "Initiate" }]);
  }, []);

  const onSubmit = async (data: CreateTransferModel) => {
    try {
      console.log("Transfer:", data);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  if (!assets || !locations || !users) return <LoadingPage />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.transfers.create.title")}>
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
          <path d="M520-80q-17 0-28.5-11.5T480-120q0-17 11.5-28.5T520-160h320q17 0 28.5 11.5T880-120q0 17-11.5 28.5T840-80H520Z" />
        </svg>
      </TitleBarWithIcon>
      <form className="row g-3" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="col-12">
          <FormFields assets={assets} locations={locations} users={users} />
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