import { type FC } from "react";
import { moduleName, type CreateModel } from "../../types/Model";
import { useFormContext } from "react-hook-form";
import { useCreate } from "@hooks/request/useCreate";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { FormFields } from "../../components/FormFields";
import { AssetPreviewPanel } from "../../components/AssetPreviewPanel";
import { CancelButton } from "@components/buttons/CancelButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { ResetButton } from "@components/buttons/ResetButton";
import { useNavigate } from "react-router-dom";

const CreatePage: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit } = useFormContext<CreateModel>();
  const { createAsync, isLoading } = useCreate<CreateModel>("opname/sessions");
  const navigate = useNavigate();

  const onSubmit = async (data: CreateModel) => {
    try {
      await createAsync({ url: "opname/sessions", body: data });
      enqueueSnackbar("Opname session created", { variant: "success" });
      navigate(`/opname`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <form className="row g-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12 col-lg-4">
        <FormFields />
        <div className="d-flex gap-3 mt-2">
          <CancelButton to={`/${moduleName}`} />
          <ResetButton />
          <SubmitButton isLoading={isLoading} />
        </div>
      </div>
      <div className="col-12 col-lg-8">
        <div className="opname-preview-column">
          <AssetPreviewPanel />
        </div>
      </div>
    </form>
  );
};

export { CreatePage };
export default CreatePage;