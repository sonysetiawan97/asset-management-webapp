import type { ColumnConfig } from "@/types/ColumnConfig";
import { Table } from "./Table";
import { ActionBar } from "./ActionBar";
import { EmptyData } from "../errors/EmptyData";
import { Pagination } from "./Pagination";
import { Title } from "./Title";

interface ListContainerProps<T> {
  title: string;
  data: T[];
  columns: ColumnConfig<T>[];
  isLoading: boolean;
  count: number;
  skip: number;
  limit: number;
  onPageChange: (newSkip: number) => void;
  /** Pass true only when the list page needs field-based filtering beyond text search. */
  showFilter?: boolean;
}

export const ListContainer = <T,>({
  title,
  data,
  columns,
  isLoading,
  count,
  skip,
  limit,
  onPageChange,
  showFilter = false,
}: ListContainerProps<T>) => {
  return (
    <div>
      <div className="animate-fade-slide-up">
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body px-4 pt-3 pb-0">
          {/* SECTION: Title Menu */}
          <Title title={title} />
          {/* SECTION: Action Menu */}
          <ActionBar showFilter={showFilter} />
          {/* SECTION: Table */}
          <div className="mb-0">
            <Table
              data={data}
              isLoading={isLoading}
              columns={columns}
              renderEmpty={<EmptyData />}
            />
          </div>
        </div>
        {/* SECTION: Pagination */}
        {count > limit && (
          <div className="card-footer border-0 bg-transparent text-center pb-4">
            <Pagination
              count={count}
              skip={skip}
              limit={limit}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
