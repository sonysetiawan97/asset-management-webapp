import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { UpdatePage } from "./UpdatePage";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useFindOneById } from "@hooks/request/useFindOneById";
import NotFound from "@modules/errors/pages/404NotFound";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { moduleName, UpdateUserModel } from "@/modules/users/types/UserTypes";

const UpdateWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<UpdateUserModel>(
    moduleName,
    id
  );

  const methods = useForm<UpdateUserModel>({ mode: "onBlur" });
  const { reset } = methods;

  useEffect(() => {
    if (data && Array.isArray(data.role) && data.role.length > 0) {
      reset({
        ...data,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Home",
        path: "/",
      },
      { label: "profile", path: `/${moduleName}` },
      { label: "Update" },
    ]);
  }, []);

  if (isLoading) return <ContentLoader />;
  if (!data || error) return <NotFound />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.profile.update.title")}>
        <i className="bi bi-pencil"></i>
      </TitleBarWithIcon>
      <UpdatePage />
    </FormProvider>
  );
};

export default UpdateWrapper;
