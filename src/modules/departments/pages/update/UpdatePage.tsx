import { moduleName, type UpdateModel } from "@modules/departments/types/Model";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BackButton } from "@components/buttons/BackButton";
import { useUpdate } from "@hooks/request/useUpdate";
import { FormFields } from "../../components/FormFields";
import { useFindAll } from "@hooks/request/useFindAll";
import { type Model } from "@modules/departments/types/Model";
import { ContentLoader } from "@components/loadings/ContentLoader";

const UpdatePage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit } = useFormContext<UpdateModel>();
  const { updateAsync, isLoading } = useUpdate<UpdateModel>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: departmentsData, isLoading: isLoadingDepartments } = useFindAll<Model>("departments", "departments");

  const onSubmit = async (data: UpdateModel) => {
    if (!id) {
      enqueueSnackbar("Department ID is required", { variant: "error" });
      return;
    }
    try {
      await updateAsync({ id, url: moduleName, body: data });
      enqueueSnackbar(t("modules.departments.update.notification.success"), { variant: "success" });
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  if (isLoadingDepartments) return <ContentLoader />;

  const departments = departmentsData?.result ?? [];

  return (
    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <FormFields departments={departments} />
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