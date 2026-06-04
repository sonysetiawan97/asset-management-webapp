import type { FC } from "react";
import { useTranslation } from "react-i18next";

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton: FC<SubmitButtonProps> = ({ isLoading = false }) => {
  const { t } = useTranslation();
  return (
    <button type="submit" className="btn btn-dark" disabled={isLoading}>
      <i className="bi bi-send"></i>
      {t("button.submit")}
    </button>
  );
};

export { SubmitButton };
