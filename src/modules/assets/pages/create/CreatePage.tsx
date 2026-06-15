import { useEffect } from "react";
import { moduleName, type CreateModel } from "../../types/Model";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CancelButton } from "@components/buttons/CancelButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { ResetButton } from "@components/buttons/ResetButton";
import { useCreate } from "@hooks/request/useCreate";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { FormFields } from "../../components/FormFields";
import { useCategoryOptions } from "../../hooks/useCategoryOptions";
import { useLocationOptions } from "../../hooks/useLocationOptions";
import { useDepartmentOptions } from "../../hooks/useDepartmentOptions";
import { useUserOptions } from "../../hooks/useUserOptions";
import { getAuth } from "@components/auth/AuthHelpers";

const CreatePage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, setValue, reset } = useFormContext<CreateModel>();
  const { createAsync, isLoading } = useCreate<CreateModel>(moduleName);
  const navigate = useNavigate();

  const auth = getAuth();
  const roleCode = auth?.role?.role?.[0]?.code;
  const isStaffOrManager = roleCode === "staff" || roleCode === "manager";

  const categoryLoadOptions = useCategoryOptions();
  const locationLoadOptions = useLocationOptions();
  const departmentLoadOptions = useDepartmentOptions(isStaffOrManager);
  const userLoadOptions = useUserOptions();

  useEffect(() => {
    if (isStaffOrManager && auth?.department_id) {
      setValue("department_id", String(auth.department_id));
    }
  }, [isStaffOrManager, auth?.department_id, setValue]);

  const onSubmit = async (data: CreateModel) => {
    try {
      await createAsync({ url: moduleName, body: data });
      enqueueSnackbar(t("modules.assets.create.notification.success"), { variant: "success" });
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
        <FormFields
          categoryLoadOptions={categoryLoadOptions}
          locationLoadOptions={locationLoadOptions}
          departmentLoadOptions={departmentLoadOptions}
          userLoadOptions={userLoadOptions}
          departmentReadOnly={isStaffOrManager}
        />
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