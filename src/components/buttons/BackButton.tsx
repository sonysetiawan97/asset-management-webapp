import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const BackButton: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} className="btn btn-dark" type="button">
      {t("button.back")}
    </button>
  );
};

export { BackButton };
