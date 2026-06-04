import type { FC } from "react";
import { useTranslation } from "react-i18next";

interface CompleteButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const CompleteButton: FC<CompleteButtonProps> = ({ onClick, isLoading = false }) => {
  const { t } = useTranslation();
  return (
    <button type="button" className="btn btn-success" onClick={onClick} disabled={isLoading}>
      <i className="bi bi-check-lg"></i>
      {t("modules.maintenance.read.complete")}
    </button>
  );
};

export { CompleteButton };
