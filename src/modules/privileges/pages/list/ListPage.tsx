import type { FC } from "react";
import { type Model } from "../../types/Model";
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

  const columns: ColumnConfig<Model>[] = [
    { title: "#", name: "id", rowClassName: "font-weight-bold" },
    {
      title: "Module",
      name: "module",
      render: (_, value) => {
        return `${value}`;
      },
    },
    {
      title: "URI",
      name: "uri",
      render: (_, value) => {
        return `${value}`;
      },
    },
    {
      title: "Method",
      name: "method",
      render: (_, value) => {
        return `${value}`;
      },
    },
    {
      title: "Action",
      name: "action",
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
        return <Action id={id} />;
      },
    },
  ];

  return (
    <ListContainer<Model>
      title={t("modules.privileges.list.title")}
      columns={columns}
      data={data}
      isLoading={isLoading}
      count={count}
      skip={skip}
      limit={limit}
      onPageChange={setSkip}
    />
  );
};
