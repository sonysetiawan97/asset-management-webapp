import { useList } from "@hooks/list/useList";
import { usePagination } from "@hooks/list/usePagination";
import { useSearch } from "@hooks/list/useSearch";
import { moduleName, UserListModel } from "@/modules/users/types/UserTypes";
import { FC, useEffect } from "react";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { ListPage } from "./ListPage";

export const ListWrapper: FC = () => {
  const { skip, limit } = usePagination();
  const { query } = useSearch();
  const { data, isLoading, error } = useList<UserListModel>({
    module: moduleName,
    skip,
    limit,
    params: {
      "!search": query,
      status: "1",
      "!sort[id]": -1,
    },
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Users", path: `/${moduleName}` },
    ]);
  }, []);

  if (isLoading) return <ContentLoader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ListPage
      data={data?.data.result || []}
      count={data?.data.count || 0}
      isLoading={isLoading}
    />
  );
};

export default ListWrapper;
