import { moduleName, type UpdateModel } from "./../../types/Model";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BackButton } from "@components/buttons/BackButton";
import { useUpdate } from "@hooks/request/useUpdate";
import { FormFields } from "@modules/examples/components/FormFields";
import { SelectOption } from "@/types/SelectOption";

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

    const hobbies: string[] = (data.hobbies as unknown as SelectOption[]).map(
      (item) => String(item.value)
    );

    const payload = {
      ...data,
      hobbies,
    };

    try {
      await updateAsync({ id, url: moduleName, body: payload });
      enqueueSnackbar(t("modules.examples.update.notification.success"), {
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
          <BackButton />
          <SubmitButton isLoading={isLoading} />
        </div>
      </div>
    </form>
  );
};

export { UpdatePage };
export default UpdatePage;