import { type FC } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const ResetButton: FC = () => {
  const { t } = useTranslation();
  const { reset } = useFormContext();

  const handleReset = () => {
    reset();
  };

  return (
    <button onClick={handleReset} className="btn btn-outline">
      <i className="bi bi-arrow-counterclockwise"></i>
      {t("button.reset")}
    </button>
  );
};

export { ResetButton };
