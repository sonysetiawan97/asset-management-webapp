import { createContext } from "react";

interface FilterContextProps {
  group: string;
  setGroup: (value: string) => void;
}

export const FilterContext = createContext<FilterContextProps | undefined>(
  undefined
);