import type { FC } from "react";
import { getAuth, PrivilegesValidation } from "@components/auth/AuthHelpers";

interface SidebarMenuTitleProps {
  title: string;
  links?: string[];
}

export const SidebarMenuTitle: FC<SidebarMenuTitleProps> = ({
  title,
  links,
}) => {
  if (links && links.length > 0) {
    const auth = getAuth();
    const hasAnyPrivilege = links.some((link) =>
      PrivilegesValidation({ auth, path: link })
    );
    if (!hasAnyPrivilege) return null;
  }

  return (
    <span
      className="sidebar-section-title"
      aria-current="true"
    >
      {title}
    </span>
  );
};
