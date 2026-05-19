import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type CreateDisposalModel } from "../../types/Model";
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
  const methods = useForm<CreateDisposalModel>({ mode: "onBlur" });
  const { t } = useTranslation();
  const { isLoading } = useCreate<CreateDisposalModel>(moduleName);
  const { enqueueSnackbar } = useSnackbar();
  const { data: assetsData } = useFindAll<{ id: string; name: string; asset_code: string }>("assets", "/api/v1/assets");

  const assets = assetsData?.result ?? [];

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Disposals", path: `/${moduleName}` }, { label: "Initiate" }]);
  }, []);

  const onSubmit = async (formData: CreateDisposalModel) => {
    try { console.log("Disposal:", formData); }
    catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  if (!assets) return <LoadingPage />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.disposals.create.title")}>
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
          <path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" />
        </svg>
      </TitleBarWithIcon>
      <form className="row g-3" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="col-12"><FormFields assets={assets} /></div>
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