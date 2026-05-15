import type { FC } from "react";
import { useTranslation } from "react-i18next";

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton: FC<SubmitButtonProps> = ({ isLoading = false }) => {
  const { t } = useTranslation();
  return (
    <button type="submit" className="btn btn-dark" disabled={isLoading}>
      <svg className="me-1" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M140-190v-580l688.46 290L140-190Zm60-90 474-200-474-200v147.69L416.92-480 200-427.69V-280Zm0 0v-400 400Z"/></svg>
      {t("button.submit")}
    </button>
  );
};

export { SubmitButton };
