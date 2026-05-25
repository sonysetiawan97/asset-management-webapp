import { type FC } from "react";
import { moduleName, type CheckoutLog } from "../../types/Model";
import { List } from "./ListPage";
import { useList } from "@hooks/list/useList";
import { ContentLoader } from "@components/loadings/ContentLoader";

export const ListWrapper: FC = () => {
  const { data, isLoading } = useList<CheckoutLog>({ module: moduleName });

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
