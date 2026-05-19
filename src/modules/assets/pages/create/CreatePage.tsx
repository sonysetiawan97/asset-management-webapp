import { moduleName, type CreateModel } from "../../types/Model";
import { useFormContext } from "react-hook-form";
import { useCreate } from "@hooks/request/useCreate";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { FormFields } from "../../components/FormFields";
import { CancelButton } from "@components/buttons/CancelButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { ResetButton } from "@components/buttons/ResetButton";
import { useFindAll } from "@hooks/request/useFindAll";
import { LoadingPage } from "@/components/loadings/LoadingPage";

const CreatePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit } = useFormContext<CreateModel>();
  const { isLoading } = useCreate<CreateModel>(moduleName);

  const { data: categoriesData, isLoading: loadingCategories } = useFindAll<{ id: string; name: string; useful_life_years: number; salvage_value_pct: number }>("categories", "categories");
  const { data: locationsData, isLoading: loadingLocations } = useFindAll<{ id: string; name: string }>("locations", "locations");
  const { data: departmentsData, isLoading: loadingDepartments } = useFindAll<{ id: string; name: string }>("departments", "departments");
  const { data: vendorsData, isLoading: loadingVendors } = useFindAll<{ id: string; name: string }>("vendors", "vendors");
  const { data: usersData, isLoading: loadingUsers } = useFindAll<{ id: string; name: string }>("users", "users");

  const isLoadingAny = loadingCategories || loadingLocations || loadingDepartments || loadingVendors || loadingUsers;
  if (isLoadingAny) return <LoadingPage />;

  const categories = categoriesData?.result ?? [];
  const locations = locationsData?.result ?? [];
  const departments = departmentsData?.result ?? [];
  const vendors = vendorsData?.result ?? [];
  const users = usersData?.result ?? [];

  const onSubmit = async (data: CreateModel) => {
    try {
      console.log("Submitting data:", data);
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
          vendors={vendors}
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