import { moduleName, type UpdateModel } from "../../types/Model";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@components/buttons/BackButton";
import { useUpdate } from "@hooks/request/useUpdate";
import { FormFields } from "@modules/roles/components/FormFields";
import { PrivilegeOption } from "../../../privileges/types/Model";
import { FC } from "react";

type Props = {
  privileges: PrivilegeOption[];
  defaultValue?: Record<string, string[]>
}

const UpdatePage: FC<Props> = ({ privileges, defaultValue }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, reset, getValues } = useFormContext<UpdateModel>();
  const { updateAsync, isLoading } = useUpdate<UpdateModel>();
  const navigate = useNavigate();

  const onSubmit = async (data: UpdateModel) => {
    try {
      const id = getValues("id");
      const payload: UpdateModel = {
        id,
        code: data.code,
        name: data.name,
        privileges: data.privileges,
      };
      
      await updateAsync({ id, url: moduleName, body: payload });
      enqueueSnackbar(t("modules.roles.update.notification.success"), {
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
        <FormFields privileges={privileges} defaultValue={defaultValue} />
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
