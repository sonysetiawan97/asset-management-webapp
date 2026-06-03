import { type FC } from "react";
import { moduleName, type UpdateModel } from "../../types/Model";
import { useFormContext } from "react-hook-form";
import { useUpdate } from "@hooks/request/useUpdate";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { FormFields } from "../../components/FormFields";
import { CancelButton } from "@components/buttons/CancelButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useParams, useNavigate } from "react-router-dom";

const UpdatePage: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit } = useFormContext<UpdateModel>();
  const { updateAsync, isLoading } = useUpdate<UpdateModel>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const onSubmit = async (data: UpdateModel) => {
    if (!id) {
      enqueueSnackbar("ID is required", { variant: "error" });
      return;
    }
    try {
      await updateAsync({
        id,
        url: "opname/sessions",
        body: data,
        queryKey: ["opname/sessions"],
      });
      enqueueSnackbar("Opname session updated", { variant: "success" });
      navigate(`/opname`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <FormFields />
      </div>
      <div className="col-12">
        <div className="d-flex gap-3">
          <CancelButton to={`/${moduleName}`} />
          <SubmitButton isLoading={isLoading} />
        </div>
      </div>
    </form>
  );
};

export { UpdatePage };
export default UpdatePage;