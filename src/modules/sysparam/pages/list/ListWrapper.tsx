import { useEffect, type FC } from "react";
import { List } from "./ListPage";
import { useList } from "@hooks/list/useList";
import { useSearch } from "@hooks/list/useSearch";
import { useFilter } from "@hooks/list/useFilter";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { Model, moduleName } from "@modules/sysparam/types/Model";

export const ListWrapper: FC = () => {
  const { skip, limit } = usePagination();
  const { query } = useSearch();
  const { group } = useFilter();
  const { data, isLoading, error } = useList<Model>({
    module: moduleName,
    skip,
    limit,
    params: {
      "!search": query,
      "!sort[id]": -1,
      status: 1,
      ...(group ? { group } : {}),
    },
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Sysparams", path: `/${moduleName}` },
    ]);
  }, []);

  if (error) return <div className="text-center py-5 text-danger">Error: {error.message}</div>;

  return (
    <List
      data={data?.data.result || []}
      count={data?.data.count || 0}
      isLoading={isLoading}
    />
  );
};

export default ListWrapper;
