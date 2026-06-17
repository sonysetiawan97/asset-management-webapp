import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";

interface ReadButtonProps {
  id: string;
  module?: string;
}

export const ReadButton: FC<ReadButtonProps> = ({ id, module: explicitModule }) => {
  const location = useLocation();
  const module = explicitModule || location.pathname.split("/").filter(Boolean)[0];

  return (
    <AuthPrivilegesChecker link={`/${module}/:id`} method="GET">
      <Link to={`${id}`} className="btn btn-icon button-link">
        <i className="bi bi-eye"></i>
      </Link>
    </AuthPrivilegesChecker>
  );
};
