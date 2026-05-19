import { useEffect, type FC } from "react";
import { List } from "./ListPage";
import { useList } from "@hooks/list/useList";
import { type Model, moduleName } from "../../types/Model";
import { useSearch } from "@hooks/list/useSearch";
import { LoadingPage } from "@/components/loadings/LoadingPage";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useFindAll } from "@hooks/request/useFindAll";

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
  const { data: locationsData } = useFindAll<Model>("locations", "locations");

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Locations", path: `/${moduleName}` },
    ]);
  }, []);

  if (isLoading) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <List
      data={data?.data.result || []}
      count={data?.data.count || 0}
      isLoading={isLoading}
      locations={locationsData?.result ?? []}
    />
  );
};

export default ListWrapper;