import { useEffect, useState } from "react";
import { PaginationContext } from "./PaginationContext";
import { useLocation } from "react-router-dom";

const { VITE_PAGE_LIMIT } = import.meta.env;

export const PaginationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [skip, setSkip] = useState<number>(0);
  const limit = VITE_PAGE_LIMIT || 10;
  const location = useLocation();

  useEffect(() => {
    setSkip(0);
  }, [location.pathname]);

  return (
    <PaginationContext.Provider value={{ skip, limit, setSkip }}>
      {children}
    </PaginationContext.Provider>
  );
};
