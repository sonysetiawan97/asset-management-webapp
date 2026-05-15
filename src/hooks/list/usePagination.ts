import { PaginationContext } from "@/contexts/PaginationContext";
import { useContext } from "react";

export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error("usePagination must be used within a PaginationProvider");
  }
  return context;
};
