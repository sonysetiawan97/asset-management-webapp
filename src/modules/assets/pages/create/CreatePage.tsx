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
import { useFindAll } from "@hooks/request/useFindAll";
import { ContentLoader } from "@components/loadings/ContentLoader";

const CreatePage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, reset } = useFormContext<CreateModel>();
  const { createAsync, isLoading } = useCreate<CreateModel>(moduleName);
  const navigate = useNavigate();

  const { data: categoriesData, isLoading: loadingCategories } = useFindAll<{ id: string; name: string; useful_life_years: number; salvage_value_pct: number }>("categories", "categories");
  const { data: locationsData, isLoading: loadingLocations } = useFindAll<{ id: string; name: string }>("locations", "locations");
  const { data: departmentsData, isLoading: loadingDepartments } = useFindAll<{ id: string; name: string }>("departments", "departments");
  const { data: usersData, isLoading: loadingUsers } = useFindAll<{ id: string; first_name: string; last_name: string }>("users", "users");

  const isLoadingAny = loadingCategories || loadingLocations || loadingDepartments || loadingUsers;
  if (isLoadingAny) return <ContentLoader />;

  const categories = categoriesData?.result ?? [];
  const locations = locationsData?.result ?? [];
  const departments = departmentsData?.result ?? [];
  const users = usersData?.result ?? [];

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
          categories={categories}
          locations={locations}
          departments={departments}
          users={users}
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