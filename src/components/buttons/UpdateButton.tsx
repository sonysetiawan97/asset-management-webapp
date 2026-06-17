import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";

interface UpdateButtonProps {
  to: string;
  module?: string;
}

const UpdateButton: FC<UpdateButtonProps> = ({ to, module: explicitModule }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const module = explicitModule || location.pathname.split("/").filter(Boolean)[0];

  return (
    <AuthPrivilegesChecker link={`/${module}/:id`} method="PUT">
      <Link to={to} className="btn bg-dark-subtle">
        {t("button.update")}
      </Link>
    </AuthPrivilegesChecker>
  );
};

export { UpdateButton };
