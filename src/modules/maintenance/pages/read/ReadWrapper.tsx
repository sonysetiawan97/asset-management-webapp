import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type ReadMaintenanceModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { BackButton } from "@components/buttons/BackButton";
import { useFindOneById } from "@hooks/request/useFindOneById";
import { ContentLoader } from "@components/loadings/ContentLoader";
import NotFound from "@modules/errors/pages/404NotFound";
import { useFindAll } from "@hooks/request/useFindAll";
import { FormFields } from "../../components/FormFields";

const ReadPage: FC = () => {
  const { data: assetsData } = useFindAll<{ id: string; name: string; asset_code: string }>("assets", "assets");
  const { data: usersData } = useFindAll<{ id: string; name: string }>("users", "users");

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
  const { data, error, isLoading } = useFindOneById<ReadMaintenanceModel>(moduleName, id);
  const methods = useForm<ReadMaintenanceModel>({ mode: "onBlur" });
  const { reset } = methods;

  useEffect(() => {
    if (data) reset(data);
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Maintenance", path: `/${moduleName}` }, { label: data?.asset_name ?? "Read" }]);
  }, [data, reset]);

  if (isLoading) return <ContentLoader />;
  if (!data || error) return <NotFound />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.maintenance.read.title")}>
        <svg className="d-flex" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#373737">
          <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" />
        </svg>
      </TitleBarWithIcon>
      <ReadPage />
    </FormProvider>
  );
};

export default ReadWrapper;