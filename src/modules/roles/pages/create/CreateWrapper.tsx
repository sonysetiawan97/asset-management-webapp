import { useEffect, useState, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type CreateModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { CreatePage } from "./CreatePage";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { useTranslation } from "react-i18next";
import { PrivilegeOption } from "@modules/privileges/types/Model";
import { useGetPrivileges } from "@modules/roles/hooks/useGetPrivileges";

const CreateWrapper: FC = () => {
  const methods = useForm<CreateModel>({mode: "onBlur"});
  const { t } = useTranslation();
  const [privilegeOptions, setPrivilegeOptions] = useState<PrivilegeOption[]>([]);
  const { formattedPrivileges } = useGetPrivileges();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Home",
        path: "/",
      },
      { label: "Roles", path: `/${moduleName}` },
      { label: "Create" },
    ]);

    async function getPrivilege() {
      const response = await formattedPrivileges();
      const { data: fetchedData } = response ?? {};
      if (fetchedData) {
        const privilegeOptionsMapping = Object.values(
          fetchedData as object
        ).map((entries) => {
          const { name, mapping } = entries;
          return {
            name,
            mapping: Object.values(mapping as object).map((entry) => {
              const { action, uri, method } = entry;
              return {
                label: action,
                value: uri.concat("|", method)
              };
            }),
          };
        });

        setPrivilegeOptions(privilegeOptionsMapping);
      }
    }

    getPrivilege();
  }, [formattedPrivileges]);

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.roles.create.title")}>
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
          <title>Icon Menu</title>
          <path d="M200-200h50.46l409.46-409.46-50.46-50.46L200-250.46V-200Zm-60 60v-135.38l527.62-527.39q9.07-8.24 20.03-12.73 10.97-4.5 23-4.5t23.3 4.27q11.28 4.27 19.97 13.58l48.85 49.46q9.31 8.69 13.27 20 3.96 11.31 3.96 22.62 0 12.07-4.12 23.03-4.12 10.97-13.11 20.04L275.38-140H140Zm620.38-570.15-50.23-50.23 50.23 50.23Zm-126.13 75.9-24.79-25.67 50.46 50.46-25.67-24.79Z" />
        </svg>
      </TitleBarWithIcon>
      <CreatePage dataPrivilege={privilegeOptions} />
    </FormProvider>
  );
};

export default CreateWrapper;
