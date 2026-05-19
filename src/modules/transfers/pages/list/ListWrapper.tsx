import { useEffect, type FC } from "react";
import { List } from "./ListPage";
import { useList } from "@hooks/list/useList";
import { type TransferRequest, moduleName } from "../../types/Model";
import { LoadingPage } from "@/components/loadings/LoadingPage";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";

export const ListWrapper: FC = () => {
  const { skip, limit } = usePagination();
  const { data, isLoading, error } = useList<TransferRequest>({
    module: moduleName, skip, limit,
    params: { "!sort[created_at]": -1 },
  });

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Transfers", path: `/${moduleName}` }]);
  }, []);

  if (isLoading) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <List data={data?.data.result || []} count={data?.data.count || 0} isLoading={isLoading} />
  );
};

export default ListWrapper;