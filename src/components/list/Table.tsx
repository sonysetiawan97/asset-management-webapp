import type { ReactNode } from "react";
import clsx from "clsx";
import type { ColumnConfig } from "@/types/ColumnConfig";
import { useSnackbar } from "notistack";

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

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) return enqueueSnackbar(error.message);
  if (!data || data.length === 0) return <div className="text-center py-5">{renderEmpty}</div>;

  return (
    <div className="table-wrapper border border-secondary-subtle rounded-3">
      <table className="table table-hover mb-0">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={`${col.title}-${index}`}
                scope="col"
                className={clsx(col.headerClassName)}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {columns.map((col, colIndex) => {
                const cell =
                  typeof col.render === "function"
                    ? col.render(row, row[col.name], rowIndex)
                    : (row[col.name] as unknown as ReactNode);
                return (
                  <td
                    key={`${col.title}-${colIndex}`}
                    className={clsx(col.rowClassName)}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
