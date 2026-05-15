import type { ReactNode } from "react";
import clsx from "clsx";
import type { ColumnConfig } from "@/types/ColumnConfig";
import { useSnackbar } from "notistack";
import { LoadingPage } from "@components/loadings/LoadingPage";

export interface TableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  isLoading?: boolean;
  error?: Error | null;
  renderEmpty?: ReactNode;
  className?: string;
}

export const Table = <T,>({
  columns,
  data,
  isLoading = false,
  error = null,
  renderEmpty = "No data available",
}: TableProps<T>) => {
  const { enqueueSnackbar } = useSnackbar();

  if (isLoading) return <LoadingPage />;
  if (error) return enqueueSnackbar(error.message);
  if (!data || data.length === 0) return <div>{renderEmpty}</div>;

  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th
              key={`${col.title}-${index}`}
              scope="col"
              className={col.headerClassName}
            >
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`} className="table-row-animated"
              style={{ animationDelay: `${Math.min(rowIndex, 8) * 40}ms` }}>
            {columns.map((col, colIndex) => {
              const cell =
                typeof col.render === "function"
                  ? col.render(row, row[col.name], rowIndex)
                  : (row[col.name] as unknown as ReactNode);
              return (
                <td
                  key={`${col.title}-${colIndex}`}
                  className={clsx("vertical-align-middle", col.rowClassName)}
                >
                  {cell}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
