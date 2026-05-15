import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface UpdateButtonProps {
  to: string;
}

const UpdateButton: FC<UpdateButtonProps> = ({ to }) => {
  const { t } = useTranslation();

  return (
    <Link to={to} className="btn bg-dark-subtle">
      {t("button.update")}
    </Link>
  );
};

export { UpdateButton };
