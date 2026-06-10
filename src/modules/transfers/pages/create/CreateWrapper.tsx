import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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

const CreateWrapper: FC = () => {
  const methods = useForm<CreateTransferModel>({ mode: "onBlur" });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { createAsync, isLoading } = useCreate<CreateTransferModel>(moduleName);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Transfers", path: `/${moduleName}` }, { label: "Initiate" }]);
  }, []);

  const onSubmit = async (data: CreateTransferModel) => {
    try {
      await createAsync({ url: moduleName, body: data });
      enqueueSnackbar(t("modules.transfers.create.notification.success"), { variant: "success" });
      methods.reset();
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.transfers.create.title")}>
        <i className="bi bi-arrow-left-right"></i>
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