import type { FC } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// TODO: need design
const Unauthorized: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600">
        {t("Unauthorized")}
      </h1>
      <p className="text-gray-500 mt-2">
        {t("Anda tidak memiliki akses untuk halaman ini")}
      </p>
      <Link to={{ pathname: "/dashboard" }}>
        {t("Back")}
      </Link>
    </div>
  );
};

export default Unauthorized;
