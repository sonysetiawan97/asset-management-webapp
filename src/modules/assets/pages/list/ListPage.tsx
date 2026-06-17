import { Link } from "react-router-dom";
import {
  moduleName,
  type Model,
  ASSET_STATUSES,
  ASSET_FILTER_STATUSES,
  STATUS_COLORS,
  CONDITION_COLORS,
} from "@modules/assets/types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";
import { Pagination } from "@components/list/Pagination";

interface ListProps {
  data: Model[];
  count: number;
  allCount: number;
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  countByStatus: Record<string, number>;
}

// Format currency
const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null || isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

// Format date
const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const List = ({ data, count, allCount, selectedStatus, onStatusChange, countByStatus }: ListProps) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  // Count by status (from backend, respects all active filters)
  const statusStats = ASSET_FILTER_STATUSES.map((s) => ({
    ...s,
    count: countByStatus[s.value] ?? 0,
  }));

  const totalValue = data.reduce((acc, a) => acc + (Number(a.purchase_price) || 0), 0);
  const availableCount = countByStatus["available"] ?? 0;
  const inUseCount = countByStatus["in_use"] ?? 0;

  return (
    <div className="module-list-container">
      {/* ── Stat Bar ── */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{allCount}</span>
          <span className="stat-label">{t("modules.assets.list.total_assets")}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: "#10b981" }}>
          <span className="stat-value" style={{ color: "#10b981" }}>{availableCount}</span>
          <span className="stat-label">{t("modules.assets.list.available")}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: "#3b82f6" }}>
          <span className="stat-value" style={{ color: "#3b82f6" }}>{inUseCount}</span>
          <span className="stat-label">{t("modules.assets.list.in_use")}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: "#f59e0b" }}>
          <span className="stat-value" style={{ color: "#f59e0b" }}>
            {formatCurrency(totalValue)}
          </span>
          <span className="stat-label">{t("modules.assets.list.total_value")}</span>
        </div>
      </div>

      {/* ── Status Filter Bar ── */}
      <div className="status-filter-bar">
        <span className="status-filter-bar__label">{t("modules.assets.list.filter_by_status")}</span>
        <div className="status-filter-bar__chips">
          {/* All chip — resets filter */}
          <button
            className={`status-chip ${selectedStatus === null ? "active" : ""}`}
            onClick={() => onStatusChange(null)}
          >
            <span className="status-chip__label">{t("modules.assets.list.filter_all")}</span>
            <span className="status-chip__count">{allCount}</span>
          </button>
          {statusStats.map((s) => {
            const colors = STATUS_COLORS[s.value] ?? { dot: "#6b7280" };
            return (
              <button
                key={s.value}
                className={`status-chip ${selectedStatus === s.value ? "active" : ""}`}
                data-status={s.value}
                onClick={() => onStatusChange(s.value)}
              >
                <span
                  className="status-chip__dot"
                  style={{ background: colors.dot }}
                />
                <span className="status-chip__label">{s.label}</span>
                <span className="status-chip__count">{s.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Header Bar ── */}
      <div className="module-list-header">
        <div className="module-list-title">
          <i className="bi bi-box-seam fs-4" style={{ color: "#1a1a2e" }}></i>
          <h2>{t("modules.assets.list.title")}</h2>
        </div>
        <Link to={`/${moduleName}/create`} className="btn-create">
          <i className="bi bi-plus-lg"></i>
          {t("button.create")}
        </Link>
      </div>

      {/* ── Asset Cards ── */}
      <div className="asset-grid animate-fade-slide-up">
        {data.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <i className="bi bi-inbox fs-1" style={{ color: "#d1d5db" }}></i>
            </div>
            <p className="empty-state__text">
              {selectedStatus
                ? t(`modules.assets.list.empty_by_status.${selectedStatus}`)
                : t("modules.assets.list.empty")}
            </p>
          </div>
        ) : (
          data.map((asset, index) => {
            const statusColors = STATUS_COLORS[asset.asset_status] ?? { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" };
            const conditionColors = CONDITION_COLORS[asset.condition] ?? { bg: "#f3f4f6", text: "#374151" };
            const categoryName = asset.category_name ?? "—";
            const locationName = asset.location_name ?? "—";
            const departmentName = asset.department_name ?? "—";

            return (
              <div
                key={asset.id}
                className="ui-card asset-card"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* ── Card Header ── */}
                <div className="asset-card__header">
                  <div className="asset-status">
                    <span
                      className="asset-status__badge"
                      style={{ background: statusColors.bg, color: statusColors.text }}
                    >
                      {ASSET_STATUSES.find((s) => s.value === asset.asset_status)?.label}
                    </span>
                    <span
                      className="asset-condition__badge"
                      style={{ background: conditionColors.bg, color: conditionColors.text }}
                    >
                      {asset.condition}
                    </span>
                  </div>
                  <span className="asset-code">{asset.asset_code}</span>
                </div>

                {/* ── Card Body ── */}
                <Link to={`/${moduleName}/${asset.id}`} className="asset-card__body">
                  <h3 className="asset-name">{asset.name}</h3>

                  <div className="asset-meta">
                    {categoryName && (
                      <div className="asset-meta__item">
                        <i className="bi bi-tag"></i>
                        {categoryName}
                      </div>
                    )}
                    {locationName && (
                      <div className="asset-meta__item">
                        <i className="bi bi-geo-alt"></i>
                        {locationName}
                      </div>
                    )}
                    {departmentName && (
                      <div className="asset-meta__item">
                        <i className="bi bi-diagram-3"></i>
                        {departmentName}
                      </div>
                    )}
                    {asset.serial_number && (
                      <div className="asset-meta__item">
                        <i className="bi bi-upc-scan"></i>
                        {asset.serial_number}
                      </div>
                    )}
                  </div>

                  <div className="asset-financials">
                    <div className="asset-financials__item">
                      <span className="asset-financials__label">{t("modules.assets.list.purchase_price")}</span>
                      <span className="asset-financials__value">
                        {formatCurrency(asset.purchase_price)}
                      </span>
                    </div>
                    <div className="asset-financials__item">
                      <span className="asset-financials__label">{t("modules.assets.list.book_value")}</span>
                      <span className="asset-financials__value">
                        {formatCurrency(asset.book_value)}
                      </span>
                    </div>
                    <div className="asset-financials__item">
                      <span className="asset-financials__label">{t("modules.assets.list.purchase_date")}</span>
                      <span className="asset-financials__value">
                        {formatDate(asset.purchase_date)}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* ── Card Footer ── */}
                <div className="asset-card__footer">
                  {asset.warranty_end ? (
                    <span className={`asset-warranty ${new Date(asset.warranty_end) < new Date() ? "expired" : "active"}`}>
                      {new Date(asset.warranty_end) < new Date()
                        ? t("modules.assets.list.warranty_expired")
                        : formatDate(asset.warranty_end)}
                    </span>
                  ) : (
                    <span />
                  )}
                  <div className="asset-actions">
                    <Link to={`/${moduleName}/${asset.id}/update`} className="btn-action" title="Edit">
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <Link to={`/${moduleName}/${asset.id}`} className="btn-action" title="View">
                      <i className="bi bi-eye"></i>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      <Pagination count={count} skip={skip} limit={limit} onPageChange={setSkip} />
    </div>
  );
};

export default List;