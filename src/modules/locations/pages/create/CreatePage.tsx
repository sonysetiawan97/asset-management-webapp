import { moduleName, type CreateModel, type Model } from "@modules/locations/types/Model";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCreate } from "@hooks/request/useCreate";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { FormFields } from "../../components/FormFields";
import { CancelButton } from "@components/buttons/CancelButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { ResetButton } from "@components/buttons/ResetButton";
import { useFindAll } from "@hooks/request/useFindAll";
import { LoadingPage } from "@/components/loadings/LoadingPage";
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, reset } = useFormContext<CreateModel>();
  const { createAsync, isLoading } = useCreate<CreateModel>(moduleName);
  const navigate = useNavigate();
  const { data: locationsData, isLoading: isLoadingLocations } = useFindAll<Model>("locations", "locations");

  if (isLoadingLocations) return <LoadingPage />;
  const locations = locationsData?.result ?? [];

  const onSubmit = async (data: CreateModel) => {
    try {
      await createAsync({ url: moduleName, body: data });
      enqueueSnackbar(t("modules.locations.create.notification.success"), { variant: "success" });
      reset();
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <FormFields locations={locations} />
      </div>

      <div className="col-12">
        <div className="d-flex gap-3">
          <CancelButton to={`/${moduleName}`} />
          <ResetButton />
          <SubmitButton isLoading={isLoading} />
        </div>
      </div>
    </form>
  );
};

export { CreatePage };
export default CreatePage;