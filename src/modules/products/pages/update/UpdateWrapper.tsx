import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type ReadModel, type UpdateModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { UpdatePage } from "./UpdatePage";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useFindOneById } from "@hooks/request/useFindOneById";
import NotFound from "@modules/errors/pages/404NotFound";
import { ContentLoader } from "@components/loadings/ContentLoader";

const UpdateWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<ReadModel>(moduleName, id);
  const methods = useForm<UpdateModel>({ mode: "onBlur" });
  const { reset } = methods;

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Products", path: `/${moduleName}` },
      { label: "Update" },
    ]);
  }, []);

  if (isLoading) return <ContentLoader />;
  if (!data || error) return <NotFound />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.products.update.title")}>
        <i className="bi bi-pencil"></i>
      </TitleBarWithIcon>
      <UpdatePage />
    </FormProvider>
  );
};

export default UpdateWrapper;
