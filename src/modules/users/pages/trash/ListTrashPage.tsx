import type { FC } from "react";
import { moduleName, type User } from "../../types/UserTypes";
import type { ColumnConfig } from "@/types/ColumnConfig";
import { usePagination } from "@hooks/list/usePagination";
import { useTranslation } from "react-i18next";
import { TrashListContainer } from "@components/list/TrashListContainer";
import { TrashAction } from "@components/list/TrashAction";

interface ListProps {
  data: User[];
  count: number;
  isLoading: boolean;
}

export const ListTrashPage: FC<ListProps> = ({ data, count, isLoading }) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  const columns: ColumnConfig<User>[] = [
    { title: "#", name: "id", rowClassName: "font-weight-bold" },
    {
      title: "Username",
      name: "username",
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
        if (id) {
          return <TrashAction id={id.toString()} module={moduleName} />;
        }
      },
    },
  ];

  return (
    <TrashListContainer<User>
      title={t("modules.users.list.trash")}
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
