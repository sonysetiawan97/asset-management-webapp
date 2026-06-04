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
import { useFindAll } from "@hooks/request/useFindAll";
import { ContentLoader } from "@components/loadings/ContentLoader";
import type { TransferAsset } from "../../components/FormFields";

const CreateWrapper: FC = () => {
  const methods = useForm<CreateTransferModel>({ mode: "onBlur" });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { createAsync, isLoading } = useCreate<CreateTransferModel>(moduleName);
  const { data: assetsData } = useFindAll<TransferAsset>("assets", "assets");
  const { data: locationsData } = useFindAll<{ id: string; name: string }>("locations", "locations");
  const { data: departmentsData } = useFindAll<{ id: string; name: string }>("departments", "departments");
  const { data: usersData } = useFindAll<{ id: number; first_name: string; last_name: string }>("users", "users");

  const assets = assetsData?.result ?? [];
  const locations = locationsData?.result ?? [];
  const departments = departmentsData?.result ?? [];
  const users = usersData?.result ?? [];
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

  if (!assets || !locations || !departments || !users) return <ContentLoader />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.transfers.create.title")}>
        <i className="bi bi-arrow-left-right"></i>
      </TitleBarWithIcon>
      <form className="row g-3" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="col-12">
          <FormFields assets={assets} locations={locations} departments={departments} users={users} />
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