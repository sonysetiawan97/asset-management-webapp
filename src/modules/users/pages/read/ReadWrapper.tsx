import { useEffect, useState, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { ReadPage } from "./ReadPage";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useFindOneById } from "@hooks/request/useFindOneById";
import NotFound from "@modules/errors/pages/404NotFound";
import { ContentLoader } from "@components/loadings/ContentLoader";
import {
  ReadUserModel,
  moduleName,
  DetailUserModel,
} from "@/modules/users/types/UserTypes";
import { useFindAll } from "@hooks/request/useFindAll";
import {
  Model as Role,
  moduleName as modelRole,
} from "@/modules/roles/types/RoleTypes";
import { SelectOption } from "@/types/SelectOption";
import { LoadOptions } from "react-select-async-paginate";
import { GroupBase } from "react-select";

const ReadWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<ReadUserModel>(
    moduleName,
    id
  );
  const methods = useForm<DetailUserModel>({ mode: "onBlur" });
  const { reset } = methods;

  const [dataRole, setDataRole] = useState<Role[]>([]);
  const { data: roleData } = useFindAll("", modelRole);

  useEffect(() => {
    if (roleData && roleData.result) {
      setDataRole(roleData.result as Role[]);
    }
  }, [roleData]);

  const optionsRole: SelectOption[] = dataRole.map((role) => ({
    value: role.code as string,
    label: role.name,
  }));

  const loadRoleOptions: LoadOptions<
    SelectOption,
    GroupBase<SelectOption>,
    { skip: number }
  > = async (search) => {
    const filtered = optionsRole.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );

    return {
      options: filtered,
      hasMore: false,
      additional: { skip: 0 },
    };
  };

  useEffect(() => {
    if (data && dataRole.length > 0) {
      const selectedRole: SelectOption | undefined = optionsRole.find(
        (option) => option.value === (data.role?.[0] ?? data.role)
      );
      reset({
        ...data,
        role: selectedRole ?? undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dataRole]);

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Home",
        path: "/",
      },
      { label: "Users", path: `/${moduleName}` },
      { label: "Read" },
    ]);
  }, []);

  if (isLoading) return <ContentLoader />;
  if (!data || error) return <NotFound />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.users.read.title")}>
        <i className="bi bi-eye"></i>
      </TitleBarWithIcon>
      <ReadPage listRole={loadRoleOptions} />
    </FormProvider>
  );
};

export default ReadWrapper;
