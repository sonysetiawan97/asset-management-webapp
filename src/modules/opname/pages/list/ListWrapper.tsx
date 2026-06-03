import { useEffect, useState, type FC } from "react";
import { List } from "./ListPage";
import { useList } from "@hooks/list/useList";
import { type OpnameSession } from "../../types/Model";
import { useSearch } from "@hooks/list/useSearch";
import { LoadingPage } from "@/components/loadings/LoadingPage";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";

export const ListWrapper: FC = () => {
  const { skip, limit } = usePagination();
  const { query } = useSearch();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const params = {
    "!search": query,
    "!sort[id]": -1,
    ...(selectedStatus && { status: selectedStatus }),
  };

  const { data, isLoading, error } = useList<OpnameSession>({
    module: "opname/sessions",
    skip,
    limit,
    params,
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Opname", path: `/opname/sessions` },
    ]);
  }, []);

  if (isLoading) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <List
      data={data?.data.result || []}
      count={data?.data.count || 0}
      isLoading={isLoading}
      selectedStatus={selectedStatus}
      onStatusChange={setSelectedStatus}
    />
  );
};

export default ListWrapper;
