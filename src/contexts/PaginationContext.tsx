import { createContext } from "react";

interface PaginationContextProps {
  skip: number;
  limit: number;
  setSkip: (newSkip: number) => void;
}

export const PaginationContext = createContext<
  PaginationContextProps | undefined
>(undefined);
