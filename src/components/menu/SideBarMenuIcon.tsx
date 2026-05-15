import type { FC, ReactNode } from "react";

interface SideBarMenuIconProps {
  children: ReactNode;
}

export const SideBarMenuIcon: FC<SideBarMenuIconProps> = ({ children }) => {
  return <div>{children}</div>;
};
