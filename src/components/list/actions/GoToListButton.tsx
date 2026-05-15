import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export const GoToListButton: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const firstSegment =
    location.pathname.split("/").filter(Boolean)[0] || "default";

  return (
    <Link
      to={`/${firstSegment}`}
      className="btn btn-dark"
    >
      <span>{t("button.to-list")}</span>
    </Link>
  );
};
