import type { FC, ReactNode } from "react";

interface SideBarMenuIconProps {
  icon?: ReactNode;
}

export const SideBarMenuIcon: FC<SideBarMenuIconProps> = ({ icon }) => {
  return <span className="sidebar-menu-icon">{icon}</span>;
};
