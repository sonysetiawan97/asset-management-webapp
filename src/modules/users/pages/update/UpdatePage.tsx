import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdate } from "@hooks/request/useUpdate";
import {
  moduleName,
  UpdateUserModel,
  SubmitUpdateUserModel,
} from "@/modules/users/types/UserTypes";
import { FormDetailFields } from "@modules/users/component/FormDetailFields";
import { FC } from "react";
import { SelectOption } from "@/types/SelectOption";
import { LoadOptions } from "react-select-async-paginate";
import { GroupBase } from "react-select";
import { CancelButton } from "@components/buttons/CancelButton";
interface UpdatePageProps {
  listRole: LoadOptions<
    SelectOption,
    GroupBase<SelectOption>,
    { skip: number }
  >;
}

const UpdatePage: FC<UpdatePageProps> = ({ listRole }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, reset } = useFormContext<UpdateUserModel>();
  const { updateAsync, isLoading } = useUpdate<SubmitUpdateUserModel>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const onSubmit = async (data: UpdateUserModel) => {
    try {
      const { role, photo, ...rest } = data;
      const payload: SubmitUpdateUserModel = {
        first_name: rest.first_name,
        last_name: rest.last_name,
        username: rest.username,
        email: rest.email,
        role: typeof role === 'string' ? [role] : role,
        status: rest.status,
      };

      if (!id) {
        enqueueSnackbar("ID is required", { variant: "error" });
        return;
      }

      await updateAsync({ id, url: moduleName, body: payload });
      enqueueSnackbar(t("modules.users.update.notification.success"), {
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
        <FormDetailFields listOptionRole={listRole} />
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
