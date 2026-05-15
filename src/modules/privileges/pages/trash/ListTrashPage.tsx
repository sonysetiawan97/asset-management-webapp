import type { FC } from "react";
import { moduleName, type Model } from "../../types/Model";
import type { ColumnConfig } from "@/types/ColumnConfig";
import { usePagination } from "@hooks/list/usePagination";
import { useTranslation } from "react-i18next";
import { TrashListContainer } from "@components/list/TrashListContainer";
import { TrashAction } from "@components/list/TrashAction";

interface ListProps {
  data: Model[];
  count: number;
  isLoading: boolean;
}

export const ListTrashPage: FC<ListProps> = ({ data, count, isLoading }) => {
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
      title: "Actions",
      name: "id",
      headerClassName: "header-action-list text-center",
      render: (row) => {
        const { id } = row;
        return <TrashAction id={id} module={moduleName} />;
      },
    },
  ];

  return (
    <TrashListContainer<Model>
      title={t("modules.privileges.list.trash")}
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
