import type { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { SideBarMenuIcon } from "./SideBarMenuIcon";
import { SidebarParentContext } from "@/contexts/SidebarParentContext";
import { getAuth, PrivilegesValidation } from "@components/auth/AuthHelpers";

interface SidebarParentMenuProps {
  url: string;
  title: string;
  icon?: ReactNode;
  collapseTargetId?: string;
  links?: string[];
  children?: ReactNode;
}

export const SidebarParentMenu: FC<SidebarParentMenuProps> = ({
  url,
  title,
  icon,
  collapseTargetId,
  links,
  children,
}) => {
  if (links && links.length > 0) {
    const auth = getAuth();
    const hasAnyPrivilege = links.some((link) =>
      PrivilegesValidation({ auth, path: link })
    );
    if (!hasAnyPrivilege) return null;
  }

  return (
    <>
      <Link
        to={url}
        className="parent-menu list-group-item"
        type="button"
        data-bs-toggle={collapseTargetId ? "collapse" : undefined}
        data-bs-target={collapseTargetId ? `#${collapseTargetId}` : undefined}
        aria-expanded="false"
        aria-controls={collapseTargetId}
      >
        <SideBarMenuIcon icon={icon} />
        <span>{title}</span>
      </Link>

      <SidebarParentContext.Provider value={url}>
        {children}
      </SidebarParentContext.Provider>
    </>
  );
};
