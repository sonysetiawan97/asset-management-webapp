import { useEffect, type FC } from "react";
import { List } from "./ListPage";
import { useList } from "@hooks/list/useList";
import { type Model, moduleName } from "../../types/Model";
import { useSearch } from "@hooks/list/useSearch";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";

export const ListWrapper: FC = () => {
  const { skip, limit } = usePagination();
  const { query } = useSearch();
  const { data, isLoading, error } = useList<Model>({
    module: moduleName,
    skip,
    limit,
    params: {
      "!search": query,
      "!sort[id]": -1,
      status: 1,
    },
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Privileges", path: `/${moduleName}` },
    ]);
  }, []);

  if (isLoading) return <ContentLoader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <List
      data={data?.data.result || []}
      count={data?.data.count || 0}
      isLoading={isLoading}
    />
  );
};

export default ListWrapper;
