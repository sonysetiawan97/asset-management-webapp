import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";

interface EditButtonProps {
  id: string;
  module?: string;
}

export const EditButton: FC<EditButtonProps> = ({ id, module: explicitModule }) => {
  const location = useLocation();
  const module = explicitModule || location.pathname.split("/").filter(Boolean)[0];

  return (
    <AuthPrivilegesChecker link={`/${module}/:id`} method="PUT">
      <Link to={`${id}/update`} className="btn btn-icon button-link">
        <i className="bi bi-pencil"></i>
      </Link>
    </AuthPrivilegesChecker>
  );
};
