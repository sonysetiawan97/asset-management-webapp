import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdate } from "@hooks/request/useUpdate";
import {
  moduleName,
  UpdateUserProfileModel,
  SubmitUpdateUserModel,
} from "@/modules/users/types/UserTypes";
import { CancelButton } from "@components/buttons/CancelButton";
import { FormFields } from "@modules/profile/component/FormFields";
import { useAuth } from "@hooks/useAuth";
import { moduleName as profile } from "@modules/profile/types/ProfileTypes";
import { setUser } from "@modules/users/stores/userStores";

const UpdatePage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, reset } =
    useFormContext<UpdateUserProfileModel>();
  const { updateAsync, isLoading } = useUpdate<SubmitUpdateUserModel>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const onSubmit = async (data: UpdateUserProfileModel) => {
    const roleCode = data.role;
    if (roleCode) {
      const { first_name, last_name, username, email, photo } = data;
      const payload = {
        first_name,
        last_name,
        username,
        email,
        photo,
        role: roleCode,
        status: user?.status,
      };

      if (!id) {
        enqueueSnackbar("ID is required", { variant: "error" });
        return;
      }

      try {
        await updateAsync({ id, url: moduleName, body: payload });
        enqueueSnackbar(t("modules.profile.update.notification.success"), {
          variant: "success",
        });

        if (user) {
          const updatedUser = {
            ...user,
            first_name: first_name ?? user.first_name,
            last_name: last_name ?? user.last_name,
            username: username ?? user.username,
            email: email ?? user.email,
            photo: photo ? JSON.stringify(photo) : user.photo,
          };

          setUser(updatedUser);
        }

        reset();
        navigate(`/${profile}`);
      } catch (error: unknown) {
        const { message } = error as AxiosError;
        enqueueSnackbar(message, {
          variant: "error",
        });
      }
    }
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <FormFields />
      </div>

      <div className="col-12">
        <div className="d-flex gap-2">
          <CancelButton to={`/${profile}`} />
          <SubmitButton isLoading={isLoading} />
        </div>
      </div>
    </form>
  );
};

export { UpdatePage };
export default UpdatePage;
