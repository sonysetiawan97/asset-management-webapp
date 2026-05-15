import { createContext, useContext } from "react";

export const SidebarParentContext = createContext<string | undefined>(
  undefined
);

export const useSidebarParent = () => useContext(SidebarParentContext);
