import type { ColumnConfig } from "@/types/ColumnConfig";
import { Table } from "./Table";
import { EmptyData } from "../errors/EmptyData";
import { Pagination } from "./Pagination";
import { Title } from "./Title";
import { TrashActionBar } from "./TrashActionBar";

interface TrashListContainerProps<T> {
  title: string;
  data: T[];
  columns: ColumnConfig<T>[];
  isLoading: boolean;
  count: number;
  skip: number;
  limit: number;
  onPageChange: (newSkip: number) => void;
}

export const TrashListContainer = <T,>({
  title,
  data,
  columns,
  isLoading,
  count,
  skip,
  limit,
  onPageChange,
}: TrashListContainerProps<T>) => {
  return (
    <div>
      <div className="card border-0">
        {/* SECTION: Title Menu */}
        <Title title={title} />
        {/* SECTION: Action Menu */}
        <TrashActionBar />
        {/* SECTION: Table */}
        <Table
          data={data}
          isLoading={isLoading}
          columns={columns}
          renderEmpty={<EmptyData />}
        />
        {/* SECTION: Pagination */}
        <div className="d-flex justify-content-center">
          <Pagination
            count={count}
            skip={skip}
            limit={limit}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};
