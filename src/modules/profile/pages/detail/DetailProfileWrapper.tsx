import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { moduleName } from "@modules/profile/types/ProfileTypes";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DetailProfilePage from "./DetailProfilePage";
import { useTranslation } from "react-i18next";

export const DetailProfileWrapper: FC = () => {
  const methods = useForm({
    mode: "onBlur",
  });
  const { t } = useTranslation();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Home",
        path: "/",
      },
      { label: "Users", path: `/${moduleName}` },
      { label: "Profile" },
    ]);
  }, []);

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.profile.detail.title")}>
        <i className="bi bi-arrow-left"></i>
      </TitleBarWithIcon>
      <DetailProfilePage />
    </FormProvider>
  );
};

export default DetailProfileWrapper;
