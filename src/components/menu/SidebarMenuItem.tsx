import type { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
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
    <Link
      to={fullUrl}
      className="list-group-item"
    >
      <SideBarMenuIcon>{icon}</SideBarMenuIcon>
      <span>{title}</span>
    </Link>
  );
};
