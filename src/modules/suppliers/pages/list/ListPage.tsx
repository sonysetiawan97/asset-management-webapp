import type { FC } from "react";
import { moduleName, type Model } from "../../types/Model";
import { Action } from "@/components/list/Action";
import type { ColumnConfig } from "@/types/ColumnConfig";
import { ListContainer } from "@/components/list/ListContainer";
import { usePagination } from "@hooks/list/usePagination";
import { useTranslation } from "react-i18next";

interface ListProps {
  data: Model[];
  count: number;
  isLoading: boolean;
}

export const List: FC<ListProps> = ({ data, count, isLoading }) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();
  const privilegeUrl = {
    read: `/${moduleName}/:id`,
    update: `/${moduleName}/:id/update`,
    delete: `/${moduleName}/:id/delete`,
  };

  const columns: ColumnConfig<Model>[] = [
    { title: "#", name: "id", rowClassName: "font-weight-bold" },
    {
      title: t("modules.suppliers.create.form.code"),
      name: "code",
    },
    {
      title: t("modules.suppliers.create.form.name"),
      name: "name",
    },
    {
      title: t("modules.suppliers.create.form.phone"),
      name: "phone",
    },
    {
      title: t("modules.suppliers.create.form.email"),
      name: "email",
    },
    {
      title: "Actions",
      name: "id",
      headerClassName: "header-action-list text-center",
      render: (row) => (
        <Action
          id={row.id}
          module={moduleName}
          privilegeUrl={privilegeUrl}
        />
      ),
    },
  ];

  return (
    <ListContainer<Model>
      title={t("modules.suppliers.list.title")}
      columns={columns}
      data={data}
      isLoading={isLoading}
      count={count}
      skip={skip}
      limit={limit}
      onPageChange={setSkip}
      createUrl={`/${moduleName}/create`}
    />
  );
};

export { List };
export default List;