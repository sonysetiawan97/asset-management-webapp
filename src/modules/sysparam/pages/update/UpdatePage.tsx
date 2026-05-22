import { moduleName, type UpdateModel } from "../../types/Model";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdate } from "@hooks/request/useUpdate";
import { FormFields } from "@modules/sysparam/components/FormFields";
import { CancelButton } from "@components/buttons/CancelButton";

const UpdatePage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, reset } = useFormContext<UpdateModel>();
  const { updateAsync, isLoading } = useUpdate<UpdateModel>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const onSubmit = async (data: UpdateModel) => {
    if (!id) {
      enqueueSnackbar("ID is required", { variant: "error" });
      return;
    }

    try {
      await updateAsync({ id, url: moduleName, body: data });
      enqueueSnackbar(t("modules.sysparam.update.notification.success"), {
        variant: "success",
      });

      reset();
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, {
        variant: "error",
      });
    }
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <FormFields />
      </div>

      <div className="col-12">
        <div className="d-flex gap-2">
          <CancelButton to={`/${moduleName}`} />
          <SubmitButton isLoading={isLoading} />
        </div>
      </div>
    </form>
  );
};

export { UpdatePage };
export default UpdatePage;
