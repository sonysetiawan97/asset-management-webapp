import { useEffect, type FC, useState } from "react";
import { List } from "./ListPage";
import { useList } from "@hooks/list/useList";
import { type Model, moduleName } from "../../types/Model";
import { useSearch } from "@hooks/list/useSearch";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useFindAll } from "@hooks/request/useFindAll";

export const ListWrapper: FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { skip, limit, setSkip } = usePagination();
  const { query } = useSearch();
  const { data, isLoading, error } = useList<Model>({
    module: moduleName,
    skip,
    limit,
    params: {
      "!search": query,
      "!sort[id]": -1,
      status: 1,
      ...(selectedType ? { type: selectedType } : {}),
    },
  });
  const { data: locationsData } = useFindAll<Model>("locations", "locations");

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Locations", path: `/${moduleName}` },
    ]);
  }, []);

  const handleTypeChange = (value: string | null) => {
    setSelectedType(value);
    setSkip(0);
  };

  if (isLoading) return <ContentLoader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <List
      data={data?.data.result || []}
      count={data?.data.count || 0}
      locations={locationsData?.result ?? []}
      selectedType={selectedType}
      onTypeChange={handleTypeChange}
      countByType={data?.data.count_by_type ?? {}}
    />
  );
};

export default ListWrapper;