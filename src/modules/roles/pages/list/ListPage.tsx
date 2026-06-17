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
      title: "Name",
      name: "name",
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
      title={t("modules.roles.list.title")}
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
