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
      <svg className="me-1" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff">
        <path d="M382-202 144-440l56-56 182 182 350-350 56 56-406 406Z" />
      </svg>
      {t("modules.maintenance.read.complete")}
    </button>
  );
};

export { CompleteButton };
