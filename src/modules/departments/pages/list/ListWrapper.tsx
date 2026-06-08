import { useEffect, type FC, useState, useMemo } from "react";
import ListPage from "./ListPage";
import { useList } from "@hooks/list/useList";
import { type Model, moduleName } from "@modules/departments/types/Model";
import { useSearch } from "@hooks/list/useSearch";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";

export const ListWrapper: FC = () => {
  const [selectedRoot, setSelectedRoot] = useState<boolean | null>(null);
  const { skip, limit, setSkip } = usePagination();
  const { query } = useSearch();

  const filterParams = useMemo(() => {
    if (selectedRoot === true) {
      return { "parent_id!null": "1" };
    }
    if (selectedRoot === false) {
      return { "parent_id!nn": "1" };
    }
    return {};
  }, [selectedRoot]);

  const { data, isLoading, error } = useList<Model>({
    module: moduleName,
    skip,
    limit,
    params: {
      "!search": query,
      "!sort[id]": -1,
      ...filterParams,
    },
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Departments", path: `/${moduleName}` },
    ]);
  }, []);

  const handleRootChange = (value: boolean | null) => {
    setSelectedRoot(value);
    setSkip(0);
  };

  if (isLoading) return <ContentLoader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ListPage
      data={data?.data.result || []}
      count={data?.data.count || 0}
      selectedRoot={selectedRoot}
      onRootChange={handleRootChange}
    />
  );
};

export default ListWrapper;
