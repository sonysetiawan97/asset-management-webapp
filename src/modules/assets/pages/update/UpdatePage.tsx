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
import { useFindAll } from "@hooks/request/useFindAll";
import { LoadingPage } from "@/components/loadings/LoadingPage";

const UpdatePage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit } = useFormContext<UpdateModel>();
  const { updateAsync, isLoading } = useUpdate<UpdateModel>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: categoryData } = useFindAll<{ id: string; name: string; useful_life_years: number; salvage_value_pct: number }>("categories", "categories");
  const { data: locationData } = useFindAll<{ id: string; name: string }>("locations", "locations");
  const { data: departmentData } = useFindAll<{ id: string; name: string }>("departments", "departments");
  const { data: vendorData } = useFindAll<{ id: string; name: string }>("vendors", "vendors");
  const { data: userData } = useFindAll<{ id: string; name: string }>("users", "users");

  const categories = categoryData?.result ?? [];
  const locations = locationData?.result ?? [];
  const departments = departmentData?.result ?? [];
  const vendors = vendorData?.result ?? [];
  const users = userData?.result ?? [];

  const isLoadingAny = categoryData === undefined || locationData === undefined || departmentData === undefined || vendorData === undefined || userData === undefined;
  if (isLoadingAny) return <LoadingPage />;

  const onSubmit = async (data: UpdateModel) => {
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
          categories={categories}
          locations={locations}
          departments={departments}
          vendors={vendors}
          users={users}
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