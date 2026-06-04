import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type CreateModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { CreatePage } from "./CreatePage";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { useTranslation } from "react-i18next";

const CreateWrapper: FC = () => {
  const methods = useForm<CreateModel>({ mode: "onBlur" });
  const { t } = useTranslation();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Opname", path: `/${moduleName}` },
      { label: "Create" },
    ]);
  }, []);

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.opname.create.title")}>
        <i className="bi bi-clipboard-check"></i>
      </TitleBarWithIcon>
      <CreatePage />
    </FormProvider>
  );
};

export default CreateWrapper;
