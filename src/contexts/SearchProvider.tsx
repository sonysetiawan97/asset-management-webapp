import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { SearchContext } from "./SearchContext";
import { useLocation } from "react-router-dom";

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [query, setQuery] = useState("");
  const location = useLocation();

  const debouncedSetQuery = useDebouncedCallback((value: string) => {
    setQuery(value);
  }, 500);

  useEffect(() => {
    setQuery("");
  }, [location.pathname]);
  return (
    <SearchContext.Provider value={{ query, setQuery: debouncedSetQuery }}>
      {children}
    </SearchContext.Provider>
  );
};
