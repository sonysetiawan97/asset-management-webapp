import { type FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  title?: string;
}

export const UnderConstruction: FC<Props> = ({ title }) => {
  const { t } = useTranslation();
  return (
    <div className="module-list-container">
      <div className="empty-state" style={{ marginTop: "3rem" }}>
        <div className="empty-state__icon">
          <i className="bi bi-cone-striped fs-1"></i>
        </div>
        <p className="empty-state__text">{title ?? t("common.under_construction")}</p>
      </div>
    </div>
  );
};

export default UnderConstruction;
