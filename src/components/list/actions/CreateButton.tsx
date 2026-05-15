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
      <svg
        className="d-flex"
        xmlns="http://www.w3.org/2000/svg"
        height="20px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#fff"
      >
        <title>{t("button.create")}</title>
        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
      </svg>
      <span>{t("button.create")}</span>
    </Link>
  );
};
