import type { FC } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// TODO: need design
const Unauthenticated: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600">
        {t("errors.unauthenticated.title")}
      </h1>
      <p className="text-gray-500 mt-2">
        {t("errors.unauthenticated.message")}
      </p>
      <Link to={{ pathname: "/auth/signin" }}>
        {t("errors.unauthenticated.button")}
      </Link>
    </div>
  );
};

export default Unauthenticated;
