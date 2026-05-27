import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type ReadMaintenanceModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { CompleteButton } from "@components/buttons/CompleteButton";
import { BackButton } from "@components/buttons/BackButton";
import { CancelButton } from "@components/buttons/CancelButton";
import { useFindOneById } from "@hooks/request/useFindOneById";
import { ContentLoader } from "@components/loadings/ContentLoader";
import NotFound from "@modules/errors/pages/404NotFound";
import { useFindAll } from "@hooks/request/useFindAll";
import { FormFields } from "../../components/FormFields";
import { apiAxios } from "@/utils/apiAxios";
import { useSnackbar } from "notistack";
import { extractErrors } from "@/utils/extractError";

const ReadPage: FC<{
  assets: { id: string; name: string; asset_code: string }[];
  users: { id: string; first_name: string; last_name: string }[];
  status: "open" | "completed";
  onComplete: () => void;
  isCompleting: boolean;
}> = ({ assets, users, status, onComplete, isCompleting }) => {
  if (!assets) return <ContentLoader />;
  const isOpen = status === "open";

  return (
    <form className="row g-3">
      <div className="col-12"><FormFields readOnly={true} assets={assets} users={users} /></div>
      <div className="col-12">
        <div className="d-flex gap-2 mt-2">
          <BackButton />
          {isOpen && (
            <CompleteButton onClick={onComplete} isLoading={isCompleting} />
          )}
          {!isOpen && (
            <CancelButton to={`/${moduleName}`} />
          )}
        </div>
      </div>
    </form>
  );
};

const ReadWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<ReadMaintenanceModel>(moduleName, id);
  const { data: assetsData } = useFindAll<{ id: string; name: string; asset_code: string }>("assets", "assets");
  const { data: usersData } = useFindAll<{ id: string; first_name: string; last_name: string }>("users", "users");
  const methods = useForm<ReadMaintenanceModel>({ mode: "onBlur" });
  const { reset } = methods;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (data) reset(data);
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Maintenance", path: `/${moduleName}` }, { label: data?.asset_name ?? "Read" }]);
  }, [data, reset]);

  const assets = assetsData?.result ?? [];
  const users = usersData?.result ?? [];

  const handleComplete = async () => {
    if (!id) return;
    try {
      await apiAxios.post(`/api/v1/maintenance/${id}/complete`);
      enqueueSnackbar(t("modules.maintenance.update.notification.success"), { variant: "success" });
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      enqueueSnackbar(extractErrors(error).join(", "), { variant: "error" });
    }
  };

  if (isLoading || !assetsData) return <ContentLoader />;
  if (!data || error) return <NotFound />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.maintenance.read.title")}>
        <svg className="d-flex" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#373737">
          <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" />
        </svg>
      </TitleBarWithIcon>
      <ReadPage assets={assets} users={users} status={data.status ?? "open"} onComplete={handleComplete} isCompleting={false} />
    </FormProvider>
  );
};

export default ReadWrapper;
