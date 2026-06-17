import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";

interface CreateButtonProps {
  module?: string;
}

export const CreateButton: FC<CreateButtonProps> = ({ module: explicitModule }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const module = explicitModule || location.pathname.split("/").filter(Boolean)[0];

  return (
    <AuthPrivilegesChecker link={`/${module}`} method="POST">
      <Link
        to={"create"}
        className="btn btn-dark w-auto d-flex align-items-center gap-2"
      >
        <i className="bi bi-plus-lg"></i>
        <span>{t("button.create")}</span>
      </Link>
    </AuthPrivilegesChecker>
  );
};
