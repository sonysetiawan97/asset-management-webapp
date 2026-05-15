import { createContext } from "react";

interface SearchContextProps {
  query: string;
  setQuery: (value: string) => void;
}

export const SearchContext = createContext<SearchContextProps | undefined>(
  undefined
);
