import { type FC } from "react";
import { List } from "./ListPage";
import { LoadingPage } from "@/components/loadings/LoadingPage";
import { useList } from "@hooks/list/useList";
import { type Notification, moduleName } from "../../types/Model";
import { usePagination } from "@hooks/list/usePagination";

const ListWrapper: FC = () => {
  const { skip, limit } = usePagination();
  const { data: _data, isLoading, error } = useList<Notification>({
    module: moduleName, skip, limit,
    params: { "!sort[created_at]": -1 },
  });

  if (isLoading) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;

  return <List />;
};

export default ListWrapper;