import { Link } from "react-router-dom";
import { moduleName, type Model, VENDOR_CATEGORIES, VENDOR_CATEGORY_COLORS } from "@modules/vendors/types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";

interface ListProps {
  data: Model[];
  count: number;
  isLoading: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  supplier: "M520-120q-17 0-28.5-11.5T480-160q0-17 11.5-28.5T520-200h320q17 0 28.5 11.5T880-160q0 17-11.5 28.5T840-120H520Zm0-160q-17 0-28.5-11.5T480-360q0-17 11.5-28.5T520-400h320q17 0 28.5 11.5T880-360q0 17-11.5 28.5T840-320H520Z",
  service_provider: "M240-160q-33 0-56.5-23.5T160-240v-560q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v560q0 33-23.5 56.5T720-160H240Zm120-160h320v-80H360v80Zm0 160h320v-80H360v80Z",
  manufacturer: "M200-60q-33 0-56.5-23.5T120-140v-560h40v-80h560v80h40v560q0 33-23.5 56.5T760-60H200Z",
};

export const List = ({ data, count, isLoading: _isLoading }: ListProps) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  // Stats per category
  const categoryStats = VENDOR_CATEGORIES.map((cat) => ({
    ...cat,
    count: data.filter((v) => v.category === cat.value).length,
    active: data.filter((v) => v.category === cat.value && v.is_active).length,
  }));

  const activeCount = data.filter((v) => v.is_active).length;
  const inactiveCount = data.filter((v) => !v.is_active).length;

  return (
    <div className="module-list-container">
      {/* ── Stat Bar ── */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{count}</span>
          <span className="stat-label">{t("modules.vendors.list.total_vendors")}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: "#10b981" }}>
          <span className="stat-value" style={{ color: "#10b981" }}>{activeCount}</span>
          <span className="stat-label">{t("modules.vendors.list.active")}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: "#ef4444" }}>
          <span className="stat-value" style={{ color: "#ef4444" }}>{inactiveCount}</span>
          <span className="stat-label">{t("modules.vendors.list.inactive")}</span>
        </div>
        {categoryStats.map((cat, i) => (
          <div key={cat.value} className="stat-item" style={{ animationDelay: `${(i + 3) * 50}ms` }}>
            <span className="stat-value">{cat.count}</span>
            <span className="stat-label">{cat.label}</span>
          </div>
        ))}
      </div>

      {/* ── Header Bar ── */}
      <div className="module-list-header">
        <div className="module-list-title">
          <svg width="20" height="20" viewBox="0 -960 960 960" fill="#1a1a2e">
            <path d="M520-120q-17 0-28.5-11.5T480-160q0-17 11.5-28.5T520-200h320q17 0 28.5 11.5T880-160q0 17-11.5 28.5T840-120H520Zm0-160q-17 0-28.5-11.5T480-360q0-17 11.5-28.5T520-400h320q17 0 28.5 11.5T880-360q0 17-11.5 28.5T840-320H520Z" />
          </svg>
          <h2>{t("modules.vendors.list.title")}</h2>
        </div>
        <Link to={`/${moduleName}/create`} className="btn-create">
          <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M720-160q-33 0-56.5-23.5T640-240v-480q0-33 23.5-56.5T720-800h240q33 0 56.5 23.5T1040-720v480q0 33-23.5 56.5T960-160H720Zm0-160v-100h80v100h100v80h-100v100h-80v-100H640v-80h80Zm-320-80v-240H160v-80h240v-240h80v240h240v80H400v240h-80v-80H160v80h80Z" />
          </svg>
          {t("button.create")}
        </Link>
      </div>

      {/* ── Vendor Cards ── */}
      <div className="vendor-grid animate-fade-slide-up">
        {data.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 -960 960 960" fill="#d1d5db">
                <path d="M520-120q-17 0-28.5-11.5T480-160q0-17 11.5-28.5T520-200h320q17 0 28.5 11.5T880-160q0 17-11.5 28.5T840-120H520Z" />
              </svg>
            </div>
            <p className="empty-state__text">{t("modules.vendors.list.empty")}</p>
            <Link to={`/${moduleName}/create`} className="btn-create-empty">
              {t("modules.vendors.list.create_first")}
            </Link>
          </div>
        ) : (
          data.map((vendor, index) => {
            const meta = VENDOR_CATEGORY_COLORS[vendor.category];
            const iconPath = CATEGORY_ICONS[vendor.category] || CATEGORY_ICONS.supplier;
            return (
              <div
                key={vendor.id}
                className={`vendor-card ${!vendor.is_active ? "vendor-card--inactive" : ""}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* ── Status indicator ── */}
                <div className={`vendor-status-dot ${vendor.is_active ? "active" : "inactive"}`} />

                {/* ── Card Header ── */}
                <div className="vendor-card__header">
                  <div className="vendor-icon" style={{ background: meta.bg }}>
                    <svg width="20" height="20" viewBox="0 -960 960 960" fill={meta.text}>
                      <path d={iconPath} />
                    </svg>
                  </div>
                  <div className="vendor-category">
                    <span
                      className="vendor-category-badge"
                      style={{ background: meta.bg, color: meta.text, boxShadow: meta.shadow }}
                    >
                      {VENDOR_CATEGORIES.find((c) => c.value === vendor.category)?.label}
                    </span>
                  </div>
                </div>

                {/* ── Card Body ── */}
                <div className="vendor-card__body">
                  <Link to={`/${moduleName}/${vendor.id}`} className="vendor-name">
                    {vendor.name}
                  </Link>
                  <span className="vendor-code">{vendor.code}</span>

                  {vendor.contact_person && (
                    <div className="vendor-contact">
                      <svg width="12" height="12" viewBox="0 -960 960 960" fill="currentColor">
                        <path d="M480-196q12 0 20-8t8-20v-72q0-12-8-20t-20-8q-12 0-20 8t-8 20v72q0 12 8 20t20 8Zm-40-200q33 0 56.5-23.5T520-480q0-33-23.5-56.5T440-560q-33 0-56.5 23.5T360-480q0 33 23.5 56.5T440-396Zm0 480q-134 0-243-65.5T65-289.5Q21-375.5 21-480t65.5-243Q152-852 257.5-917.5Q363-983 480-983t243 65.5Q852-852 917.5-739.5T983-480q0 104.5-65.5 190.5T724-165q-134 0-243-65.5T257.5-349Q197-435 197-480t60.5-135Q318-780 425-845t113-138Z" />
                      </svg>
                      {vendor.contact_person}
                    </div>
                  )}

                  {vendor.email && (
                    <div className="vendor-email">
                      <svg width="12" height="12" viewBox="0 -960 960 960" fill="currentColor">
                        <path d="M140-160q-17 0-28.5-11.5T100-200v-560q0-17 11.5-28.5T140-800h680q17 0 28.5 11.5T860-760v560q0 17-11.5 28.5T820-160H140Zm40-160h600v-360H180v360Zm0 160h600v-80H180v80Zm0 160h600v-80H180v80Z" />
                      </svg>
                      {vendor.email}
                    </div>
                  )}

                  {vendor.phone && (
                    <div className="vendor-phone">
                      <svg width="12" height="12" viewBox="0 -960 960 960" fill="currentColor">
                        <path d="M753.69-166.31q-34.54 0-60.76-20.24Q667.69-206.77 667.69-239v-25.96q-15.06 2.92-28.99-3.31t-26.34-21.61L553.69-375q-23.5-24.58-51.19-44.98Q478.5-442.44 450-459.5t-50.04-15.98q-27.5 17.06-51.65 36.46Q324.19-418.5 301.5-394L242.81-330q-13.31 10.73-21.61 26.34t-3.31 28.99H192q-32.23 0-52.47 26.15Q120-229.69 120-196.46q0 58.7 26.27 105.85 26.28 47.16 71.54 78.43 45.26 31.27 97.73 47.73 52.47 16.46 109.46 16.46 58.7 0 109.46-16.46 50.77-16.46 97.73-47.73 46.97-31.27 74.23-78.43 27.27-47.15 27.27-105.85Zm-24-140.69v-20q0-49.42-35.42-84.84-35.42-35.42-84.85-35.42t-84.84 35.42Q458.31-367 458.31-317.5t35.42 84.85q35.42 35.42 84.85 35.42t84.85-35.42q35.42-35.42 35.42-84.85ZM238.31-200h595.38v-20q0-65.54-46.77-112.31Q740.15-480 674.62-480q-65.54 0-112.31 46.77Q515.54-386.46 515.54-320H320q0-65.54-46.77-112.31Q226.46-480 160.92-480q-65.54 0-112.31 46.77Q2-386.46 2-320v80H238.31Z" />
                      </svg>
                      {vendor.phone}
                    </div>
                  )}
                </div>

                {/* ── Card Footer ── */}
                <div className="vendor-card__footer">
                  <span className={`vendor-active-badge ${vendor.is_active ? "active" : "inactive"}`}>
                    {vendor.is_active ? t("modules.vendors.list.status_active") : t("modules.vendors.list.status_inactive")}
                  </span>
                  <div className="vendor-actions">
                    <Link to={`/${moduleName}/${vendor.id}/update`} className="btn-action" title="Edit">
                      <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor">
                        <path d="M200-200h50.46l409.46-409.46-50.46-50.46L200-250.46V-200Zm-60 60v-135.38l527.62-527.39q9.07-8.24 20.03-12.73 10.97-4.5 23-4.5t23.3 4.27q11.28 4.27 19.97 13.58l48.85 49.46q9.31 8.69 13.27 20 3.96 11.31 3.96 22.62 0 12.07-4.12 23.03-4.12 10.97-13.11 20.04L275.38-140H140Z" />
                      </svg>
                    </Link>
                    <Link to={`/${moduleName}/${vendor.id}`} className="btn-action" title="View">
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
          <button
            className="btn-pagination"
            onClick={() => setSkip(Math.max(0, skip - limit))}
            disabled={skip === 0}
          >
            <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor">
              <path d="m480-344-240 240 240 240 56-56-168-168 168-168-56-56Z" />
            </svg>
            {t("pagination.prev")}
          </button>
          <span className="pagination-info">
            {skip + 1}–{Math.min(skip + limit, count)} {t("pagination.of")} {count}
          </span>
          <button
            className="btn-pagination"
            onClick={() => setSkip(skip + limit)}
            disabled={skip + limit >= count}
          >
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