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
        <i className="bi bi-person-badge"></i>
      </TitleBarWithIcon>
      <CreatePage dataPrivilege={privilegeOptions} />
    </FormProvider>
  );
};

export default CreateWrapper;
