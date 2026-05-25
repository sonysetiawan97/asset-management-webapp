import { useEffect, type FC } from "react";
import ListPage from "./ListPage";
import { useList } from "@hooks/list/useList";
import { type Model, moduleName } from "@modules/departments/types/Model";
import { useSearch } from "@hooks/list/useSearch";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useFindAll } from "@hooks/request/useFindAll";

export const ListWrapper: FC = () => {
  const { skip, limit } = usePagination();
  const { query } = useSearch();
  const { data, isLoading, error } = useList<Model>({
    module: moduleName,
    skip,
    limit,
    params: {
      "!search": query,
      "!sort[id]": -1,
    },
  });
  const { data: departmentsData } = useFindAll<Model>("departments", "departments");

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Departments", path: `/${moduleName}` },
    ]);
  }, []);

  if (isLoading) return <ContentLoader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ListPage
      data={data?.data.result || []}
      count={data?.data.count || 0}
      isLoading={isLoading}
      departments={departmentsData?.result ?? []}
    />
  );
};

export default ListWrapper;