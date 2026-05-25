import { useEffect, type FC } from "react";
import { useList } from "@hooks/list/useList";
import { useSearch } from "@hooks/list/useSearch";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { User, moduleName } from "@modules/users/types/UserTypes";
import { ListTrashPage } from "./ListTrashPage";

export const ListTrashWrapper: FC = () => {
  const { skip, limit } = usePagination();
  const { query } = useSearch();
  const { data, isLoading, error } = useList<User>({
    module: moduleName,
    skip,
    limit,
    params: {
      "!search": query,
      "!sort[id]": -1,
      status: 0,
    },
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Trash", path: "#" },
      { label: "User", path: `/${moduleName}` },
    ]);
  }, []);

  if (isLoading) return <ContentLoader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ListTrashPage
      data={data?.data.result || []}
      count={data?.data.count || 0}
      isLoading={isLoading}
    />
  );
};

export default ListTrashWrapper;
