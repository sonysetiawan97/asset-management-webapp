import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { moduleName, type ReadModel } from "../../types/Model";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { ReadPage } from "./ReadPage";
import { TitleBarWithIcon } from "@components/TitleBarWithIcon";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useFindOneById } from "@hooks/request/useFindOneById";
import NotFound from "@modules/errors/pages/404NotFound";
import { ContentLoader } from "@components/loadings/ContentLoader";

const ReadWrapper: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFindOneById<ReadModel>(moduleName, id);
  const methods = useForm<ReadModel>({ mode: "onBlur" });
  const { reset } = methods;

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "Assets", path: `/${moduleName}` },
      { label: "Read" },
    ]);
  }, []);

  if (isLoading) return <ContentLoader />;
  if (!data || error) return <NotFound />;

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title={t("modules.assets.read.title")}>
        <svg className="d-flex" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#373737">
          <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
        </svg>
      </TitleBarWithIcon>
      <ReadPage defaultValue={{ category_id: data.category_id, location_id: data.location_id }} />
    </FormProvider>
  );
};

export default ReadWrapper;