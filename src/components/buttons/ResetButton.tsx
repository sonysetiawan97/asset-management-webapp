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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20px"
        viewBox="0 -960 960 960"
        width="20px"
        fill="#1f1f1f"
      >
        <path d="M481.54-212q-111.63 0-189.81-78.17-78.19-78.17-78.19-189.77 0-111.6 78.19-189.83Q369.91-748 481.54-748q66.15 0 121.27 29.69 55.11 29.7 91.65 78.54V-748h52v204.61H541.85v-51.99h121q-28.62-45.93-76.2-73.27Q539.08-696 481.54-696q-90 0-153 63t-63 153q0 90 63 153t153 63q84 0 144-55.5t69-136.5h53.23q-8.23 103.92-84.27 173.96Q587.46-212 481.54-212Z" />
      </svg>
      {t("button.reset")}
    </button>
  );
};

export { ResetButton };
