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
      { label: "Vendors", path: `/${moduleName}` },
      { label: "Create" },
    ]);
  }, []);

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.vendors.create.title")}>
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
          <title>Icon Add</title>
          <path d="M720-160q-33 0-56.5-23.5T640-240v-480q0-33 23.5-56.5T720-800h240q33 0 56.5 23.5T1040-720v480q0 33-23.5 56.5T960-160H720Zm0-160v-100h80v100h100v80h-100v100h-80v-100H640v-80h80Zm-320-80v-240H160v-80h240v-240h80v240h240v80H400v240h-80v-80H160v80h80Z" />
        </svg>
      </TitleBarWithIcon>
      <CreatePage />
    </FormProvider>
  );
};

export default CreateWrapper;