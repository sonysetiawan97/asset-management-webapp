import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type CreateDisposalModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { FormFields } from "../../components/FormFields";
import { CancelButton } from "@components/buttons/CancelButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useCreate } from "@hooks/request/useCreate";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { useFindAll } from "@hooks/request/useFindAll";
import { ContentLoader } from "@components/loadings/ContentLoader";

const CreateWrapper: FC = () => {
  const methods = useForm<CreateDisposalModel>({ mode: "onBlur" });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createAsync, isLoading } = useCreate<CreateDisposalModel>(moduleName);
  const { data: assetsData, isLoading: assetsLoading } = useFindAll<{ id: string; name: string; asset_code: string }>("assets", "assets");

  const assets = assetsData?.result ?? [];

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Disposals", path: `/${moduleName}` }, { label: "Initiate" }]);
  }, []);

  const onSubmit = async (formData: CreateDisposalModel) => {
    try {
      await createAsync({ url: moduleName, body: formData });
      enqueueSnackbar(t("modules.disposals.create.notification.success"), { variant: "success" });
      methods.reset();
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message || t("modules.disposals.create.notification.error"), { variant: "error" });
    }
  };

  if (assetsLoading) return <ContentLoader />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.disposals.create.title")}>
        <i className="bi bi-trash"></i>
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
