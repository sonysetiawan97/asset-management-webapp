import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { useTranslation } from "react-i18next";
import { CreateModel, moduleName } from "@/modules/users/types/UserTypes";
import CreatePage from "./CreatePage";
import { useRoleOptions } from "@modules/users/hooks/useRoleOptions";

const CreateWrapper: FC = () => {
  const methods = useForm<CreateModel>({
    mode: "onBlur",
  });
  const { t } = useTranslation();

  const loadOptions = useRoleOptions();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Home",
        path: "/",
      },
      { label: "User", path: `/${moduleName}` },
      { label: "Create" },
    ]);
  }, []);

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.users.create.title")}>
        <i className="bi bi-people"></i>
      </TitleBarWithIcon>
      <CreatePage listRole={loadOptions} />
    </FormProvider>
  );
};

export default CreateWrapper;
