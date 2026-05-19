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
          <svg width="64" height="64" viewBox="0 -960 960 960" fill="#d1d5db">
            <path d="M760-160q-33 0-56.5-23.5T680-240v-320h120v-120H240v120h120v320q0 33-23.5 56.5T300-160H760Zm-40-280v-200H280v200H240v-240q0-33 23.5-56.5T300-680h440q33 0 56.5 23.5T820-600v240H720Zm40 40v-80h280v80H760Z" />
          </svg>
        </div>
        <p className="empty-state__text">{title ?? t("common.under_construction")}</p>
      </div>
    </div>
  );
};

export default UnderConstruction;
