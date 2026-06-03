import { useEffect, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import Read from "./ReadPage";
import { useFindOneById as useFindById } from "@hooks/request/useFindOneById";
import { apiAxios } from "@/utils/apiAxios";
import { enqueueSnackbar } from "notistack";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";
import { type ReadModel } from "../../types/Model";
import { LoadingPage } from "@components/loadings/LoadingPage";

export const ReadWrapper: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { skip, limit, setSkip } = usePagination();
  const { data, isLoading, error } = useFindById<ReadModel>("opname/sessions", id!);
  const [activeTab, setActiveTab] = useState<"items" | "summary" | "discrepancies">("items");
  const [items, setItems] = useState<unknown[]>([]);
  const [itemsCount, setItemsCount] = useState(0);
  const [summary, setSummary] = useState<unknown>(null);
  const [discrepancies, setDiscrepancies] = useState<unknown[]>([]);
  const [loadingSub, setLoadingSub] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: t("modules.opname.list.title"), path: "/opname" },
      { label: data?.name ?? id ?? "", path: "" },
    ]);
  }, [t]);

  useEffect(() => {
    if (!id) return;
    setLoadingSub(true);

    if (activeTab === "items") {
      apiAxios
        .get(`/opname/sessions/${id}/items?limit=${limit}&skip=${skip}`)
        .then((res) => {
          setItems(res.data.data.result ?? []);
          setItemsCount(res.data.data.count ?? 0);
          setLoadingSub(false);
        })
        .catch(() => {
          setLoadingSub(false);
          enqueueSnackbar(t("modules.opname.read.error_loading_items"), { variant: "error" });
        });
    } else if (activeTab === "summary") {
      apiAxios
        .get(`/opname/sessions/${id}/summary`)
        .then((res) => {
          setSummary(res.data.data ?? null);
          setLoadingSub(false);
        })
        .catch(() => {
          setLoadingSub(false);
          enqueueSnackbar(t("modules.opname.read.error_loading_summary"), { variant: "error" });
        });
    } else if (activeTab === "discrepancies") {
      apiAxios
        .get(`/opname/sessions/${id}/discrepancies`)
        .then((res) => {
          setDiscrepancies(res.data.data ?? []);
          setLoadingSub(false);
        })
        .catch(() => {
          setLoadingSub(false);
          enqueueSnackbar(t("modules.opname.read.error_loading_discrepancies"), { variant: "error" });
        });
    }
  }, [activeTab, id, t, skip, limit]);

  if (!id) {
    enqueueSnackbar("ID is required", { variant: "error" });
    return <LoadingPage />;
  }

  if (isLoading) return <LoadingPage />;
  if (error) return <div className="p-4">Error: {error.message}</div>;
  if (!data) return <LoadingPage />;

  return (
    <Read
      data={data}
      onAction={async (action: string) => {
        try {
          const endpoint = `/opname/sessions/${id}/${action}`;
          await apiAxios.patch(endpoint);

          enqueueSnackbar(t(`modules.opname.read.notification.${action}`), {
            variant: "success",
          });
          window.location.reload();
        } catch {
          enqueueSnackbar(t("modules.opname.read.notification.action_failed"), {
            variant: "error",
          });
        }
      }}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      items={items}
      itemsCount={itemsCount}
      itemsSkip={skip}
      itemsLimit={limit}
      onItemsPageChange={setSkip}
      summary={summary}
      discrepancies={discrepancies}
      loadingSub={loadingSub}
    />
  );
};

export default ReadWrapper;
