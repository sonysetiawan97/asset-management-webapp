import { type FC } from "react";
import { moduleName, type DisposalRequest } from "../../types/Model";
import { List } from "./ListPage";
import { useList } from "@hooks/list/useList";
import { usePagination } from "@hooks/list/usePagination";
import { ContentLoader } from "@components/loadings/ContentLoader";

export const ListWrapper: FC = () => {
  const { skip, limit } = usePagination();
  const { data, isLoading } = useList<DisposalRequest>({
    module: moduleName,
    skip,
    limit,
    params: {},
  });

  if (isLoading) return <ContentLoader />;

  return (
    <List
      data={data?.data?.result ?? []}
      count={data?.data?.count ?? 0}
      isLoading={isLoading}
    />
  );
};

export default ListWrapper;