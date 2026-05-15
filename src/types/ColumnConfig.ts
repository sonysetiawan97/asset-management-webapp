import type { ReactNode } from "react";

export interface ColumnConfig<T> {
  title: string;
  name: keyof T;
  headerClassName?: string;
  rowClassName?: string;
  render?: (row: T, value: unknown, rowIndex: number) => ReactNode;
}
