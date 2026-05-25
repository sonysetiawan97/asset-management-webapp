import { moduleName, type CreateModel, type Model } from "@modules/categories/types/Model";
import { useFormContext } from "react-hook-form";
import { useCreate } from "@hooks/request/useCreate";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { FormFields } from "../../components/FormFields";
import { CancelButton } from "@components/buttons/CancelButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { ResetButton } from "@components/buttons/ResetButton";
import { useFindAll } from "@hooks/request/useFindAll";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreatePage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit } = useFormContext<CreateModel>();
  const { createAsync, isLoading } = useCreate<CreateModel>(moduleName);
  const navigate = useNavigate();

  const { data: categoriesData, isLoading: loadingCategories } = useFindAll<Model>("categories", "categories");

  if (loadingCategories) return <ContentLoader />;

  const categories = categoriesData?.result ?? [];

  const onSubmit = async (data: CreateModel) => {
    try {
      await createAsync({ url: moduleName, body: data });
      enqueueSnackbar(t("modules.categories.create.notification.success"), { variant: "success" });
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <FormFields categories={categories} />
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