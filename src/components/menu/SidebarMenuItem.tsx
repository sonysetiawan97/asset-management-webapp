import type { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { SideBarMenuIcon } from "./SideBarMenuIcon";
import { useSidebarParent } from "@/contexts/SidebarParentContext";

interface SidebarMenuItemProps {
  url: string;
  title: string;
  icon?: ReactNode;
  parentUrl?: string;
}

export const SidebarMenuItem: FC<SidebarMenuItemProps> = ({
  url,
  title,
  icon,
  parentUrl,
}) => {
  const inheritedParentUrl = useSidebarParent();

  const baseUrl = parentUrl || inheritedParentUrl;

  const fullUrl = baseUrl
    ? `${baseUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`
    : url;

  return (
    <NavLink
      to={fullUrl}
      end
      className={({ isActive }) =>
        isActive ? "list-group-item active" : "list-group-item"
      }
    >
      <SideBarMenuIcon icon={icon} />
      <span>{title}</span>
    </NavLink>
  );
};
