import { Link } from "react-router-dom";
import {
  moduleName,
  type Model,
  ASSET_STATUSES,
  STATUS_COLORS,
  CONDITION_COLORS,
} from "@modules/assets/types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";

interface ListProps {
  data: Model[];
  count: number;
  isLoading: boolean;
  categories: { id: string; name: string }[];
  locations: { id: string; name: string }[];
}

// Format currency
const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) return "—";
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
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const List = ({ data, count, isLoading: _isLoading, categories, locations }: ListProps) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  // Count by status
  const statusStats = ASSET_STATUSES.map((s) => ({
    ...s,
    count: data.filter((a) => a.asset_status === s.value).length,
  }));

  const totalValue = data.reduce((acc, a) => acc + (a.purchase_price || 0), 0);
  const availableCount = data.filter((a) => a.asset_status === "available").length;
  const inUseCount = data.filter((a) => a.asset_status === "in_use").length;

  return (
    <div className="module-list-container">
      {/* ── Stat Bar ── */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{count}</span>
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
          {statusStats.map((s) => {
            const colors = STATUS_COLORS[s.value] ?? { dot: "#6b7280" };
            return (
              <button key={s.value} className="status-chip" data-status={s.value}>
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
          <svg width="20" height="20" viewBox="0 -960 960 960" fill="#1a1a2e">
            <path d="M520-120q-17 0-28.5-11.5T480-160q0-17 11.5-28.5T520-200h320q17 0 28.5 11.5T880-160q0 17-11.5 28.5T840-120H520Zm0-160q-17 0-28.5-11.5T480-360q0-17 11.5-28.5T520-400h320q17 0 28.5 11.5T880-360q0 17-11.5 28.5T840-320H520Z" />
          </svg>
          <h2>{t("modules.assets.list.title")}</h2>
        </div>
        <Link to={`/${moduleName}/create`} className="btn-create">
          <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M720-160q-33 0-56.5-23.5T640-240v-480q0-33 23.5-56.5T720-800h240q33 0 56.5 23.5T1040-720v480q0 33-23.5 56.5T960-160H720Zm0-160v-100h80v100h100v80h-100v100h-80v-100H640v-80h80Zm-320-80v-240H160v-80h240v-240h80v240h240v80H400v240h-80v-80H160v80h80Z" />
          </svg>
          {t("button.create")}
        </Link>
      </div>

      {/* ── Asset Cards ── */}
      <div className="asset-grid animate-fade-slide-up">
        {data.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 -960 960 960" fill="#d1d5db">
                <path d="M520-120q-17 0-28.5-11.5T480-160q0-17 11.5-28.5T520-200h320q17 0 28.5 11.5T880-160q0 17-11.5 28.5T840-120H520Z" />
              </svg>
            </div>
            <p className="empty-state__text">{t("modules.assets.list.empty")}</p>
            <Link to={`/${moduleName}/create`} className="btn-create-empty">
              {t("modules.assets.list.create_first")}
            </Link>
          </div>
        ) : (
          data.map((asset, index) => {
            const statusColors = STATUS_COLORS[asset.asset_status] ?? { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" };
            const conditionColors = CONDITION_COLORS[asset.condition] ?? { bg: "#f3f4f6", text: "#374151" };
            const categoryName = categories.find((c) => c.id === asset.category_id)?.name ?? "—";
            const locationName = locations.find((l) => l.id === asset.location_id)?.name ?? "—";

            return (
              <div
                key={asset.id}
                className="asset-card"
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
                        <svg width="12" height="12" viewBox="0 -960 960 960" fill="currentColor">
                          <path d="M560-160q-17 0-28.5-11.5T520-200q0-17 11.5-28.5T560-240h320q17 0 28.5 11.5T920-200q0 17-11.5 28.5T880-160H560Z" />
                        </svg>
                        {categoryName}
                      </div>
                    )}
                    {locationName && (
                      <div className="asset-meta__item">
                        <svg width="12" height="12" viewBox="0 -960 960 960" fill="currentColor">
                          <path d="M280-120q-33 0-56.5-23.5T200-200v-560q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v560q0 33-23.5 56.5T680-120H280Z" />
                        </svg>
                        {locationName}
                      </div>
                    )}
                    {asset.serial_number && (
                      <div className="asset-meta__item">
                        <svg width="12" height="12" viewBox="0 -960 960 960" fill="currentColor">
                          <path d="M140-160q-17 0-28.5-11.5T100-200v-560q0-17 11.5-28.5T140-800h680q17 0 28.5 11.5T860-760v560q0 17-11.5 28.5T820-160H140Z" />
                        </svg>
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
                  {asset.warranty_end && (
                    <span className={`asset-warranty ${new Date(asset.warranty_end) < new Date() ? "expired" : "active"}`}>
                      <svg width="11" height="11" viewBox="0 -960 960 960" fill="currentColor">
                        <path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" />
                      </svg>
                      {new Date(asset.warranty_end) < new Date()
                        ? t("modules.assets.list.warranty_expired")
                        : formatDate(asset.warranty_end)}
                    </span>
                  )}
                  <div className="asset-actions">
                    <Link to={`/${moduleName}/${asset.id}/update`} className="btn-action" title="Edit">
                      <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor">
                        <path d="M200-200h50.46l409.46-409.46-50.46-50.46L200-250.46V-200Zm-60 60v-135.38l527.62-527.39q9.07-8.24 20.03-12.73 10.97-4.5 23-4.5t23.3 4.27q11.28 4.27 19.97 13.58l48.85 49.46q9.31 8.69 13.27 20 3.96 11.31 3.96 22.62 0 12.07-4.12 23.03-4.12 10.97-13.11 20.04L275.38-140H140Z" />
                      </svg>
                    </Link>
                    <Link to={`/${moduleName}/${asset.id}`} className="btn-action" title="View">
                      <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor">
                        <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      {count > limit && (
        <div className="module-pagination">
          <button className="btn-pagination" onClick={() => setSkip(Math.max(0, skip - limit))} disabled={skip === 0}>
            <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor">
              <path d="m480-344-240 240 240 240 56-56-168-168 168-168-56-56Z" />
            </svg>
            {t("pagination.prev")}
          </button>
          <span className="pagination-info">
            {skip + 1}–{Math.min(skip + limit, count)} {t("pagination.of")} {count}
          </span>
          <button className="btn-pagination" onClick={() => setSkip(skip + limit)} disabled={skip + limit >= count}>
            {t("pagination.next")}
            <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor">
              <path d="m424-296 56-56-168-168-168 168-56-56 240-240 240 240Z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default List;