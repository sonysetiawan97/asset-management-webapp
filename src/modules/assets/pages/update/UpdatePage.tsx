import { useEffect, useRef } from "react";
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
import { useFindOneById } from "@hooks/request/useFindOneById";

const UpdatePage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, watch, setValue } = useFormContext<UpdateModel>();
  const { updateAsync, isLoading } = useUpdate<UpdateModel>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const auth = getAuth();
  const roleCode = auth?.role?.role?.[0]?.code;
  const isStaffOrManager = roleCode === "staff" || roleCode === "manager";

  const watchedDeptId = watch("department_id");
  const { data: deptDetail } = useFindOneById<{ name: string }>(
    "departments",
    isStaffOrManager && watchedDeptId && typeof watchedDeptId !== "object"
      ? String(watchedDeptId)
      : undefined
  );

  const resolvedDeptRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      isStaffOrManager &&
      deptDetail &&
      watchedDeptId &&
      typeof watchedDeptId !== "object" &&
      resolvedDeptRef.current !== watchedDeptId
    ) {
      resolvedDeptRef.current = String(watchedDeptId);
      (setValue as any)("department_id", {
        value: String(watchedDeptId),
        label: deptDetail.name,
      });
    }
  }, [isStaffOrManager, deptDetail, watchedDeptId, setValue]);

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
          <SubmitButton isLoading={isLoading} />
        </div>
      </div>
    </form>
  );
};

export { UpdatePage };
export default UpdatePage;