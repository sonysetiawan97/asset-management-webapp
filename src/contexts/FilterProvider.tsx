import { useEffect, useState } from "react";
import { FilterContext } from "./FilterContext";
import { useLocation } from "react-router-dom";

export const FilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [group, setGroup] = useState("");
  const location = useLocation();

  useEffect(() => {
    setGroup("");
  }, [location.pathname]);

  return (
    <FilterContext.Provider value={{ group, setGroup }}>
      {children}
    </FilterContext.Provider>
  );
};