import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type Model, moduleName, type DetailModel } from "./../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { ReadPage } from "./ReadPage";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useFindOneById } from "@hooks/request/useFindOneById";
import NotFound from "@modules/errors/pages/404NotFound";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { useOptionsRoleById } from "@modules/users/hooks/useRoleOptions";
import { useDefaultOptionSysparamByGroup } from "@modules/products/hooks/useSysparamOptions";

const ReadWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<Model>(moduleName, id);
  const methods = useForm<DetailModel>({ mode: "onBlur" });
  const { reset } = methods;

  const { defaultValue } = useOptionsRoleById(data?.citizen);
  const { defaultValues } = useDefaultOptionSysparamByGroup(
    "gender",
    data?.hobbies
  );

  useEffect(() => {
    if (data && defaultValues && defaultValue) {
      reset({
        ...data,
        hobbies: defaultValues,
        citizen: defaultValue,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, defaultValues, defaultValue]);

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Home",
        path: "/",
      },
      { label: "Examples", path: `/${moduleName}` },
      { label: "Read" },
    ]);
  }, []);

  if (isLoading) return <ContentLoader />;
  if (!data || error) return <NotFound />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.examples.read.title")}>
        <i className="bi bi-eye"></i>
      </TitleBarWithIcon>
      <ReadPage />
    </FormProvider>
  );
};

export default ReadWrapper;
