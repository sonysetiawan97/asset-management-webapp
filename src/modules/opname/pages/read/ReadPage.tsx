import { type FC } from "react";
import { moduleName } from "../../types/Model";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { EditButton } from "@components/buttons/EditButton";
import { CancelButton } from "@components/buttons/CancelButton";
import { FormFields } from "../../components/FormFields";
import { useFindOneById } from "@hooks/request/useFindOneById";
import { LoadingPage } from "@components/loadings/LoadingPage";
import NotFound from "@modules/errors/pages/404NotFound";

const ReadPage: FC = () => {
  const { t } = useTranslation();
  const { data } = useFormContext();

  const sessionId = data?.id;

  const { data: items, isLoading: itemsLoading } = useFindOneById<{ items: unknown[] }>(
    `${moduleName}/${sessionId}/items`,
    sessionId
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <strong>{t("modules.opname.read.section.session")}</strong>
            <EditButton to={`/${moduleName}/${sessionId}/update`} />
          </div>
          <div className="card-body">
            <FormFields readOnly />
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <strong>{t("modules.opname.read.section.progress")}</strong>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-2">
                <div className="p-3 border rounded text-center">
                  <div className="h4 mb-0">{data?.total_items ?? 0}</div>
                  <small className="text-muted">{t("modules.opname.read.label.total_items")}</small>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="p-3 border rounded text-center">
                  <div className="h4 mb-0">{data?.counted_items ?? 0}</div>
                  <small className="text-muted">{t("modules.opname.read.label.counted_items")}</small>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="p-3 border rounded text-center">
                  <div className="h4 mb-0">
                    {data?.total_items ? Math.round(((data?.counted_items ?? 0) / data.total_items) * 100) : 0}%
                  </div>
                  <small className="text-muted">{t("modules.opname.read.label.progress")}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <strong>{t("modules.opname.read.section.items")}</strong>
          </div>
          <div className="card-body">
            {itemsLoading ? (
              <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
            ) : items ? (
              <p className="text-muted">{t("modules.opname.read.label.items_count", { count: (items as unknown as { items: unknown[] })?.items?.length ?? 0 })}</p>
            ) : (
              <p className="text-muted">{t("modules.opname.read.empty_items")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="col-12">
        <CancelButton to={`/${moduleName}`} />
      </div>
    </div>
  );
};

export { ReadPage };
export default ReadPage;