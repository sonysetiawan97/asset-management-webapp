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
        <svg
          className="d-flex"
          xmlns="http://www.w3.org/2000/svg"
          height="18px"
          viewBox="0 -960 960 960"
          width="18px"
          fill="#373737"
        >
          <title>Icon Menu</title>
          <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
        </svg>
      </TitleBarWithIcon>
      <ReadPage listRole={loadRoleOptions} />
    </FormProvider>
  );
};

export default ReadWrapper;
