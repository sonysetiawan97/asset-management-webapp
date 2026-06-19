import { type FC } from "react";
import { useList } from "@hooks/list/useList";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";
import { apiAxios } from "@/utils/apiAxios";
import { ASSET_STATUSES, STATUS_COLORS } from "@modules/assets/types/Model";
import { StatusBadge } from "@/components/list/StatusBadge";

const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

async function exportCsv() {
  const response = await apiAxios.get("assets/null/export", {
    params: { report_type: "csv" },
    responseType: "blob",
  });
  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inventory_report_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const InventoryReport: FC = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useList({ module: "assets", skip: 0, limit: 100, params: {} });

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Reports", path: "/reports" }, { label: "Inventory" }]);
  }, []);

  if (isLoading) return <ContentLoader />;

  const assets = data?.data.result || [];
  const total = assets.length;
  const getStatusColor = (status: string) => STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.available;

  return (
    <div className="module-list-container">
      <div className="module-stat-bar">
        <div className="stat-item"><span className="stat-value">{total}</span><span className="stat-label">Total Assets</span></div>
      </div>

      <div className="module-list-header">
        <div className="module-list-title">
          <i className="bi bi-box-seam fs-4" style={{ color: "#1a1a2e" }}></i>
          <h2>{t("modules.reports.inventory.title")}</h2>
        </div>
        <AuthPrivilegesChecker link="/reports/export" method="GET">
          <button className="btn-create" onClick={exportCsv}>
            <i className="bi bi-download"></i>
            {t("modules.reports.export_csv")}
          </button>
        </AuthPrivilegesChecker>
      </div>

      <div className="module-table-container">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Status</th>
                <th>Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted">
                    {t("modules.reports.inventory.empty") ?? "No data"}
                  </td>
                </tr>
              ) : (
                assets.map((a: any) => {
                  const color = getStatusColor(a.status);
                  const statusMeta = ASSET_STATUSES.find((s) => s.value === a.status);
                  return (
                    <tr key={a.id}>
                      <td className="fw-semibold font-mono text-xs">{a.asset_code ?? "—"}</td>
                      <td>{a.name}</td>
                      <td>
                        <StatusBadge
                          label={statusMeta?.label ?? a.status}
                          bgColor={color.bg}
                          textColor={color.text}
                          dotColor={color.dot}
                        />
                      </td>
                      <td>{formatDate(a.purchase_date)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;
