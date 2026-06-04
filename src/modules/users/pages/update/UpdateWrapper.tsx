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
import {
  moduleName,
  DetailUserModel,
  UpdateUserModel,
} from "@/modules/users/types/UserTypes";
import {
  useOptionRoleByCode,
  useRoleOptions,
} from "@modules/users/hooks/useRoleOptions";

const UpdateWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<UpdateUserModel>(
    moduleName,
    id
  );

  const methods = useForm<DetailUserModel>({ mode: "onBlur" });
  const { reset } = methods;

  const loadOptions = useRoleOptions();
  const { defaultValue } = useOptionRoleByCode(data?.role);

  useEffect(() => {
    if (!data) return;
  
    reset({
      ...data,
      role: defaultValue ?? undefined,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, defaultValue]); 

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Home",
        path: "/",
      },
      { label: "Users", path: `/${moduleName}` },
      { label: "Update" },
    ]);
  }, []);

  if (isLoading) return <ContentLoader />;
  if (!data || error) return <NotFound />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.users.update.title")}>
        <i className="bi bi-pencil"></i>
      </TitleBarWithIcon>
      <UpdatePage listRole={loadOptions} />
    </FormProvider>
  );
};

export default UpdateWrapper;
