import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const CreateButton: FC = () => {
  const { t } = useTranslation();
  return (
    <Link
      to={"create"}
      className="btn btn-dark w-auto d-flex align-items-center gap-2"
    >
      <i className="bi bi-plus-lg"></i>
      <span>{t("button.create")}</span>
    </Link>
  );
};
