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
    read: "/examples/:id",
    update: "/examples/:id/update",
    delete: "/examples/:id/delete",
  };

  const columns: ColumnConfig<Model>[] = [
    { title: "#", name: "id", rowClassName: "font-weight-bold" },
    {
      title: "Name",
      name: "name",
      render: (_, value) => {
        return `${value}`;
      },
    },
    {
      title: "Nik",
      name: "nik",
      render: (_, value) => {
        return `${value}`;
      },
    },
    {
      title: "Actions",
      name: "id",
      headerClassName: "header-action-list text-center",
      render: (row) => {
        const { id } = row;
        return (
          <Action
            id={String(id)}
            module={moduleName}
            privilegeUrl={privilegeUrl}
          />
        );
      },
    },
  ];

  return (
    <ListContainer<Model>
      title={t("modules.examples.list.title")}
      columns={columns}
      data={data}
      isLoading={isLoading}
      count={count}
      skip={skip}
      limit={limit}
      onPageChange={setSkip}
      createUrl="/examples/create"
    />
  );
};
