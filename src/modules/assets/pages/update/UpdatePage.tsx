import { moduleName, type UpdateModel } from "../../types/Model";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BackButton } from "@components/buttons/BackButton";
import { useUpdate } from "@hooks/request/useUpdate";
import { FormFields } from "../../components/FormFields";
import { useCategoryOptions } from "../../hooks/useCategoryOptions";
import { useLocationOptions } from "../../hooks/useLocationOptions";
import { useDepartmentOptions } from "../../hooks/useDepartmentOptions";
import { useUserOptions } from "../../hooks/useUserOptions";
import { getAuth } from "@components/auth/AuthHelpers";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";

const UpdatePage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit } = useFormContext<UpdateModel>();
  const { updateAsync, isLoading } = useUpdate<UpdateModel>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const auth = getAuth();
  const roleCode = auth?.role?.role?.[0]?.code;
  const isStaffOrManager = roleCode === "staff" || roleCode === "manager";

  const categoryLoadOptions = useCategoryOptions();
  const locationLoadOptions = useLocationOptions();
  const departmentLoadOptions = useDepartmentOptions(isStaffOrManager);
  const userLoadOptions = useUserOptions();

  const onSubmit = async (data: UpdateModel) => {
    if (!id) {
      enqueueSnackbar("Asset ID is required", { variant: "error" });
      return;
    }
    try {
      await updateAsync({ id, url: moduleName, body: data });
      enqueueSnackbar(t("modules.assets.update.notification.success"), { variant: "success" });
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <FormFields
          categoryLoadOptions={categoryLoadOptions}
          locationLoadOptions={locationLoadOptions}
          departmentLoadOptions={departmentLoadOptions}
          userLoadOptions={userLoadOptions}
          departmentReadOnly={isStaffOrManager}
        />
      </div>
      <div className="col-12">
        <div className="d-flex gap-2">
          <BackButton />
          <AuthPrivilegesChecker link={`/${moduleName}/:id`} method="PUT">
            <SubmitButton isLoading={isLoading} />
          </AuthPrivilegesChecker>
        </div>
      </div>
    </form>
  );
};

export { UpdatePage };
export default UpdatePage;