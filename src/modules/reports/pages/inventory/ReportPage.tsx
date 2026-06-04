import { type FC } from "react";
import { useList } from "@hooks/list/useList";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { ContentLoader } from "@components/loadings/ContentLoader";

const formatCurrency = (v?: number) => v === undefined || v === null || !isFinite(v) ? "—" : new Intl.NumberFormat("en-US", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);
const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

export const InventoryReport: FC = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useList({ module: "assets", skip: 0, limit: 100, params: {} });

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Reports", path: "/reports" }, { label: "Inventory" }]);
  }, []);

  if (isLoading) return <ContentLoader />;

  const assets = data?.data.result || [];
  const total = assets.length;
  const totalPurchase = assets.reduce((acc: number, a: any) => acc + Number(a.purchase_price), 0);
  const totalBook = assets.reduce((acc: number, a: any) => acc + Number(a.book_value), 0);

  return (
    <div className="report-container">
      <div className="module-stat-bar">
        <div className="stat-item"><span className="stat-value">{total}</span><span className="stat-label">Total Assets</span></div>
        <div className="stat-item"><span className="stat-value">{formatCurrency(totalPurchase)}</span><span className="stat-label">Total Purchase Value</span></div>
        <div className="stat-item"><span className="stat-value">{formatCurrency(totalBook)}</span><span className="stat-label">Total Book Value</span></div>
      </div>

      <div className="module-list-header">
        <div className="module-list-title">
          <i className="bi bi-plus-lg"></i>
          <h2>{t("modules.reports.inventory.title")}</h2>
        </div>
        <button className="btn-create" onClick={() => window.print()}>
          <i className="bi bi-info-circle"></i>
          {t("modules.reports.export_csv")}
        </button>
      </div>

      <div className="report-table-wrap">
        <table className="report-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Status</th>
              <th>Purchase Price</th>
              <th>Book Value</th>
              <th>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a: any) => (
              <tr key={a.id}>
                <td className="font-mono text-xs">{a.asset_code ?? "—"}</td>
                <td>{a.name}</td>
                <td><span className="report-status">{a.status}</span></td>
                <td className="text-right">{formatCurrency(a.purchase_price)}</td>
                <td className="text-right">{formatCurrency(a.book_value)}</td>
                <td>{formatDate(a.purchase_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryReport;