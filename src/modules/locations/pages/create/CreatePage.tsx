import { moduleName, type CreateModel } from "@modules/locations/types/Model";
import { useFormContext } from "react-hook-form";
import { useCreate } from "@hooks/request/useCreate";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { FormFields } from "../../components/FormFields";
import { CancelButton } from "@components/buttons/CancelButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { ResetButton } from "@components/buttons/ResetButton";
import { useFindAll } from "@hooks/request/useFindAll";
import { type Model } from "@modules/locations/types/Model";
import { LoadingPage } from "@/components/loadings/LoadingPage";

const CreatePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit } = useFormContext<CreateModel>();
  const { isLoading } = useCreate<CreateModel>(moduleName);
  const { data: locationsData, isLoading: isLoadingLocations } = useFindAll<Model>("locations", "/api/v1/locations");

  const onSubmit = async (data: CreateModel) => {
    try {
      console.log("Submitting data:", data);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  if (isLoadingLocations) return <LoadingPage />;

  const locations = locationsData?.result ?? [];

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