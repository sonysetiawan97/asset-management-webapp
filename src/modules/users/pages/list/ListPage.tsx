import { ListContainer } from "@components/list/ListContainer";
import { UserListModel } from "@/modules/users/types/UserTypes";
import type { FC } from "react";
import { usePagination } from "@hooks/list/usePagination";
import { useTranslation } from "react-i18next";
import { ColumnConfig } from "@/types/ColumnConfig";
import { Action } from "@components/list/Action";

interface ListProps {
  data: UserListModel[];
  count: number;
  isLoading: boolean;
}

const ListPage: FC<ListProps> = ({ data, count, isLoading }) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  const columns: ColumnConfig<UserListModel>[] = [
    { title: "Id", name: "id", rowClassName: "font-weight-bold" },
    {
      title: "Username",
      name: "username",
      render: (_, value) => {
        return `${value}`;
      },
    },
    {
      title: "Email",
      name: "email",
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
    <ListContainer<UserListModel>
      title={t("modules.users.list.title")}
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

export { ListPage };
