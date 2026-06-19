import { type FC, useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useList } from "@hooks/list/useList";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";
import { MAINTENANCE_TYPES } from "@modules/maintenance/types/Model";
import { StatusBadge } from "@/components/list/StatusBadge";

interface MaintenanceRecord {
  id: string;
  asset_id: string;
  asset_name?: string;
  asset_code?: string;
  type: string;
  date_performed: string;
  performed_by?: string;
  performed_by_name?: string;
  description: string;
  cost?: number;
  next_maintenance_date?: string;
  status: string;
  created_by_name?: string;
  created_time: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  open: { bg: "#fef3c7", text: "#78350f", dot: "#f59e0b" },
  completed: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
};

const TYPE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  preventive: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  corrective: { bg: "#fef3c7", text: "#78350f", dot: "#f59e0b" },
  inspection: { bg: "#f3e8ff", text: "#6b21a8", dot: "#a855f7" },
};

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
};

function exportToCsv(records: MaintenanceRecord[]) {
  const headers = ["Asset Code", "Asset Name", "Type", "Status", "Date Performed", "Performed By", "Cost", "Next Maintenance", "Created"];
  const rows = records.map((r) => [
    r.asset_code ?? "",
    r.asset_name ?? "",
    r.type,
    r.status,
    r.date_performed ?? "",
    r.performed_by_name ?? "",
    r.cost?.toString() ?? "",
    r.next_maintenance_date ?? "",
    r.created_time ?? "",
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `maintenance_report_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const ReportPage: FC = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useList<MaintenanceRecord>({ module: "maintenance", skip: 0, limit: 500, params: {} });

  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Reports", path: "/reports" }, { label: "Maintenance" }]);
  }, []);

  const records = (data?.data?.result ?? []) as MaintenanceRecord[];
  const totalFromApi = data?.data?.count ?? 0;

  const typeCounts = useMemo(() =>
    records.reduce<Record<string, number>>((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {}),
    [records]
  );

  const filteredData = useMemo(() => {
    let result = records;
    if (selectedType !== "all") result = result.filter((r) => r.type === selectedType);
    if (selectedStatus !== "all") result = result.filter((r) => r.status === selectedStatus);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          (r.asset_name && r.asset_name.toLowerCase().includes(term)) ||
          (r.asset_code && r.asset_code.toLowerCase().includes(term))
      );
    }
    if (dateStart) result = result.filter((r) => r.date_performed && r.date_performed >= dateStart);
    if (dateEnd) result = result.filter((r) => r.date_performed && r.date_performed <= dateEnd);
    return result;
  }, [records, selectedType, selectedStatus, searchTerm, dateStart, dateEnd]);

  const totalCost = useMemo(() => filteredData.reduce((acc, r) => acc + (r.cost || 0), 0), [filteredData]);
  const hasActiveFilters = selectedType !== "all" || selectedStatus !== "all" || !!searchTerm || !!dateStart || !!dateEnd;

  if (isLoading) return <ContentLoader />;

  return (
    <div className="module-list-container">
      {/* Stat Bar */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{hasActiveFilters ? filteredData.length : totalFromApi}</span>
          <span className="stat-label">{t("modules.reports.maintenance.total_logs")}</span>
        </div>
        {MAINTENANCE_TYPES.map((type) => {
          const color = TYPE_COLORS[type.value] ?? { bg: "#e5e7eb", text: "#374151", dot: "#6b7280" };
          return (
            <div key={type.value} className="stat-item" style={{ borderLeftColor: color.dot }}>
              <span className="stat-value" style={{ color: color.dot }}>{typeCounts[type.value] ?? 0}</span>
              <span className="stat-label">{type.label}</span>
            </div>
          );
        })}
        <div className="stat-item" style={{ borderLeftColor: "#10b981" }}>
          <span className="stat-value" style={{ color: "#10b981" }}>{formatCurrency(totalCost)}</span>
          <span className="stat-label">{t("modules.reports.maintenance.total_cost")}</span>
        </div>
      </div>

      {/* Status Filter */}
      <div className="status-filter-bar">
        <span className="status-filter-bar__label">{t("modules.reports.maintenance.filter_by_status")}</span>
        <div className="status-filter-bar__chips">
          <button
            className={`status-chip ${selectedStatus === "all" ? "active" : ""}`}
            onClick={() => setSelectedStatus("all")}
          >
            <span className="status-chip__label">{t("modules.reports.maintenance.filter_status_all")}</span>
          </button>
          <button
            className={`status-chip ${selectedStatus === "open" ? "active" : ""}`}
            onClick={() => setSelectedStatus("open")}
          >
            <span className="status-chip__dot" style={{ background: STATUS_COLORS.open.dot }} />
            <span className="status-chip__label">{t("modules.reports.maintenance.open")}</span>
          </button>
          <button
            className={`status-chip ${selectedStatus === "completed" ? "active" : ""}`}
            onClick={() => setSelectedStatus("completed")}
          >
            <span className="status-chip__dot" style={{ background: STATUS_COLORS.completed.dot }} />
            <span className="status-chip__label">{t("modules.reports.maintenance.completed")}</span>
          </button>
        </div>
      </div>

      {/* Type Filter */}
      <div className="status-filter-bar">
        <span className="status-filter-bar__label">{t("modules.reports.maintenance.filter_by_type")}</span>
        <div className="status-filter-bar__chips">
          <button
            className={`status-chip ${selectedType === "all" ? "active" : ""}`}
            onClick={() => setSelectedType("all")}
          >
            <span className="status-chip__label">{t("modules.reports.maintenance.filter_type_all")}</span>
          </button>
          {MAINTENANCE_TYPES.map((type) => {
            const color = TYPE_COLORS[type.value] ?? { bg: "#e5e7eb", text: "#374151", dot: "#6b7280" };
            return (
              <button
                key={type.value}
                className={`status-chip ${selectedType === type.value ? "active" : ""}`}
                onClick={() => setSelectedType(type.value)}
              >
                <span className="status-chip__dot" style={{ background: color.dot }} />
                <span className="status-chip__label">{type.label}</span>
                <span className="status-chip__count">{typeCounts[type.value] ?? 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + Date Range */}
      <div className="status-filter-bar" style={{ gap: "var(--space-3)" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <i className="bi bi-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", fontSize: 14 }} />
          <input
            type="text"
            className="form-control form-control-sm"
            style={{ paddingLeft: 32 }}
            placeholder={t("modules.reports.maintenance.search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <label className="status-filter-bar__label" style={{ margin: 0 }}>{t("modules.reports.maintenance.date_from")}</label>
          <input
            type="date"
            className="form-control form-control-sm"
            style={{ width: 155 }}
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
          />
          <label className="status-filter-bar__label" style={{ margin: 0 }}>{t("modules.reports.maintenance.date_to")}</label>
          <input
            type="date"
            className="form-control form-control-sm"
            style={{ width: 155 }}
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
          />
        </div>
      </div>

      {/* Header */}
      <div className="module-list-header">
        <div className="module-list-title">
          <i className="bi bi-wrench fs-4" style={{ color: "#1a1a2e" }}></i>
          <h2>{t("modules.reports.maintenance.title")}</h2>
        </div>
        <AuthPrivilegesChecker link="/reports/export" method="GET">
          <button className="btn-create" onClick={() => exportToCsv(filteredData)} style={{ background: "var(--color-surface)", border: "1.5px solid var(--color-border)", color: "var(--color-text-primary)" }}>
            <i className="bi bi-download"></i>
            {t("modules.reports.maintenance.export_csv")}
          </button>
        </AuthPrivilegesChecker>
      </div>

      {/* Table */}
      <div className="module-table-container">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Asset Code</th>
                <th>Asset Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date Performed</th>
                <th>Performed By</th>
                <th>Cost</th>
                <th>Next Maintenance</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-muted">
                    {t("modules.reports.maintenance.empty")}
                  </td>
                </tr>
              ) : (
                filteredData.map((r) => {
                  const typeMeta = MAINTENANCE_TYPES.find((mt) => mt.value === r.type);
                  const typeColor = TYPE_COLORS[r.type] ?? { bg: "#e5e7eb", text: "#374151", dot: "#6b7280" };
                  const statusColor = STATUS_COLORS[r.status] ?? STATUS_COLORS.open;
                  return (
                    <tr key={r.id}>
                      <td className="fw-semibold font-mono text-xs">{r.asset_code ?? "—"}</td>
                      <td>{r.asset_name ?? "—"}</td>
                      <td>
                        <StatusBadge
                          label={typeMeta?.label ?? r.type}
                          bgColor={typeColor.bg}
                          textColor={typeColor.text}
                          dotColor={typeColor.dot}
                        />
                      </td>
                      <td>
                        <StatusBadge
                          label={r.status === "completed" ? t("modules.reports.maintenance.completed") : t("modules.reports.maintenance.open")}
                          bgColor={statusColor.bg}
                          textColor={statusColor.text}
                          dotColor={statusColor.dot}
                        />
                      </td>
                      <td>{formatDate(r.date_performed)}</td>
                      <td>{r.performed_by_name ?? "—"}</td>
                      <td className="text-right">{formatCurrency(r.cost)}</td>
                      <td>{formatDate(r.next_maintenance_date)}</td>
                      <td>{formatDate(r.created_time)}</td>
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

export default ReportPage;
