import { useEffect, useState, type FC } from "react";
import ListPage from "./ListPage";
import { useList } from "@hooks/list/useList";
import { type Model, moduleName } from "@modules/assets/types/Model";
import { useSearch } from "@hooks/list/useSearch";
import { LoadingPage } from "@/components/loadings/LoadingPage";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useFindAll } from "@hooks/request/useFindAll";

export const ListWrapper: FC = () => {
  const { skip, limit } = usePagination();
  const { query } = useSearch();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const params = {
    "!search": query,
    "!sort[id]": -1,
    ...(selectedStatus && { asset_status: selectedStatus }),
  };

  const { data, isLoading, error } = useList<Model>({
    module: moduleName,
    skip,
    limit,
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

  if (isLoading) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ListPage
      data={data?.data.result || []}
      count={data?.data.count || 0}
      isLoading={isLoading}
      categories={categories}
      locations={locations}
      selectedStatus={selectedStatus}
      onStatusChange={setSelectedStatus}
    />
  );
};

export default ListWrapper;