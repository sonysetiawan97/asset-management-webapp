import { useEffect, useState, type FC } from "react";
import ListPage from "./ListPage";
import { useList } from "@hooks/list/useList";
import { type Model, moduleName } from "@modules/assets/types/Model";
import { useSearch } from "@hooks/list/useSearch";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useFindAll } from "@hooks/request/useFindAll";

export const ListWrapper: FC = () => {
  const { skip, limit, setSkip } = usePagination();
  const { query } = useSearch();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const [unfilteredCounts, setUnfilteredCounts] = useState<{
    count: number;
    countByStatus: Record<string, number>;
  } | null>(null);

  const params = {
    "!search": query,
    "!sort[id]": -1,
    ...(selectedStatus && { asset_status: selectedStatus }),
  };

  const { data, isLoading, error } = useList<Model>({
    module: moduleName,
    skip,
    limit: 12,
    params,
  });

  const { data: categoryData } = useFindAll<{ id: string; name: string }>("categories", "categories");
  const { data: locationData } = useFindAll<{ id: string; name: string }>("locations", "locations");
  const categories = categoryData?.result ?? [];
  const locations = locationData?.result ?? [];

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Assets", path: `/${moduleName}` },
    ]);
  }, []);

  useEffect(() => {
    if (!selectedStatus && data?.data) {
      setUnfilteredCounts({
        count: data.data.count,
        countByStatus: data.data.count_by_status || {},
      });
    }
  }, [selectedStatus, data?.data.count, data?.data.count_by_status]);

  const handleStatusChange = (value: string | null) => {
    setSelectedStatus(value);
    setSkip(0);
  };

  if (isLoading) return <ContentLoader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ListPage
      data={data?.data.result || []}
      count={data?.data.count ?? 0}
      allCount={unfilteredCounts?.count ?? data?.data.count ?? 0}
      countByStatus={unfilteredCounts?.countByStatus ?? data?.data.count_by_status ?? {}}
      categories={categories}
      locations={locations}
      selectedStatus={selectedStatus}
      onStatusChange={handleStatusChange}
    />
  );
};

export default ListWrapper;