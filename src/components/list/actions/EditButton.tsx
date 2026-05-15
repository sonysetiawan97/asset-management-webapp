import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface EditButtonProps {
  id: string;
}

export const EditButton: FC<EditButtonProps> = ({ id }) => {
  const { t } = useTranslation();
  return (
    <Link to={`${id}/update`} className="btn btn-icon button-link">
      <svg
        className="d-flex"
        xmlns="http://www.w3.org/2000/svg"
        height="18px"
        viewBox="0 -960 960 960"
        width="18px"
        fill="#373737"
      >
        <title>{t("button.update")}</title>
        <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
      </svg>
    </Link>
  );
};
