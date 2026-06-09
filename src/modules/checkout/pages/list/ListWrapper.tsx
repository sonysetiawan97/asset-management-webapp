import { useEffect, useState, type FC } from "react";
import { List } from "./ListPage";
import { useList } from "@hooks/list/useList";
import { moduleName, type CheckoutLog, type CheckoutStatus } from "../../types/Model";
import { useSearch } from "@hooks/list/useSearch";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";

export const ListWrapper: FC = () => {
  const { skip, limit, setSkip } = usePagination();
  const { query } = useSearch();
  const [selectedStatus, setSelectedStatus] = useState<CheckoutStatus | null>(null);

  const [unfilteredCounts, setUnfilteredCounts] = useState<{
    count: number;
    countByStatus: Record<string, number>;
  } | null>(null);

  const params = {
    "!search": query,
    "!sort[id]": -1,
    ...(selectedStatus && { status: selectedStatus }),
  };

  const { data, isLoading, error } = useList<CheckoutLog>({
    module: moduleName,
    skip,
    limit: 12,
    params,
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Checkouts", path: `/${moduleName}` },
    ]);
  }, []);

  useEffect(() => {
    if (!selectedStatus && data?.data) {
      setUnfilteredCounts({
        count: data.data.count,
        countByStatus: data.data.count_by_status || {},
      });
    }
  }, [selectedStatus, data?.data?.count, data?.data?.count_by_status]);

  const handleStatusChange = (value: CheckoutStatus | null) => {
    setSelectedStatus(value);
    setSkip(0);
  };

  if (isLoading) return <ContentLoader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <List
      data={data?.data?.result || []}
      count={data?.data?.count ?? 0}
      allCount={unfilteredCounts?.count ?? data?.data?.count ?? 0}
      countByStatus={unfilteredCounts?.countByStatus ?? data?.data?.count_by_status ?? {}}
      selectedStatus={selectedStatus}
      onStatusChange={handleStatusChange}
    />
  );
};

export default ListWrapper;
