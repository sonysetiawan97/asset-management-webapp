import { useEffect, useState, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type ReadModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { ReadPage } from "./ReadPage";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useFindOneById } from "@hooks/request/useFindOneById";
import NotFound from "@modules/errors/pages/404NotFound";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { useGetPrivileges } from "@modules/roles/hooks/useGetPrivileges";
import { PrivilegeOption } from "@modules/privileges/types/Model";

const ReadWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<ReadModel>(moduleName, id);
  const { formattedPrivileges } = useGetPrivileges();
  const methods = useForm<ReadModel>({ mode: "onBlur" });
  const { reset } = methods;
  const { setValue } = methods;
  const [privilegeOptions, setPrivilegeOptions] = useState<PrivilegeOption[]>([]);
  const [checkedMap, setCheckedMap] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Home",
        path: "/",
      },
      { label: "Roles", path: `/${moduleName}` },
      { label: "Read" },
    ]);
  }, []);

  useEffect(() => {
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

        if (!data) return;

        const checkedGroupMap: Record<string, string[]> = {};
        privilegeOptionsMapping.forEach((group) => {
          const matched = group.mapping
            .map((item) => item.value)
            .filter((v) => data.privilege?.includes(v));
          if (matched.length > 0) {
            checkedGroupMap[group.name] = matched;
          }
        });

        setCheckedMap(checkedGroupMap);
      }
    }

    getPrivilege();

    if (data) {
      setValue("name", data.name);
      setValue("privilege", data.privilege);
    }
  }, [data, formattedPrivileges, setValue]);

  if (isLoading) return <ContentLoader />;
  if (!data || error) return <NotFound />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.roles.read.title")}>
        <i className="bi bi-eye"></i>
      </TitleBarWithIcon>
      <ReadPage privilegeOptions={privilegeOptions} checkedMap={checkedMap} />
    </FormProvider>
  );
};

export default ReadWrapper;
