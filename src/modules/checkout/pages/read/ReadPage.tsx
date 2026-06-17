import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type ReadCheckoutModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { FormFields } from "../../components/FormFields";
import { BackButton } from "@components/buttons/BackButton";
import { useFindOneById } from "@hooks/request/useFindOneById";
import { ContentLoader } from "@components/loadings/ContentLoader";
import NotFound from "@modules/errors/pages/404NotFound";
import { useFindAll } from "@hooks/request/useFindAll";

const ReadPage: FC = () => {
  const { data: assetsData } = useFindAll<{ id: string; name: string; asset_code: string }>("assets", "assets");
  const { data: usersData } = useFindAll<{ id: string; name: string }>("options/users", "options/users");

  const assets = assetsData?.result ?? [];
  const users = usersData?.result ?? [];

  if (!assetsData || !usersData) return <ContentLoader />;

  return (
    <form className="row g-3">
      <div className="col-12"><FormFields readOnly={true} assets={assets} users={users} /></div>
      <div className="col-12"><div className="d-flex gap-2 mt-2"><BackButton /></div></div>
    </form>
  );
};

const ReadWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<ReadCheckoutModel>(moduleName, id);
  const methods = useForm<ReadCheckoutModel>({ mode: "onBlur" });
  const { reset } = methods;

  useEffect(() => {
    if (data) reset(data);
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Checkouts", path: `/${moduleName}` }, { label: data?.asset_name ?? "Read" }]);
  }, [data, reset]);

  if (isLoading) return <ContentLoader />;
  if (!data || error) return <NotFound />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.checkout.read.title")}>
        <i className="bi bi-eye"></i>
      </TitleBarWithIcon>
      <ReadPage />
    </FormProvider>
  );
};

export default ReadWrapper;