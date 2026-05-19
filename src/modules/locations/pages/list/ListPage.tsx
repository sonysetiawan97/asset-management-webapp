import { Link } from "react-router-dom";
import { moduleName, type Model, LOCATION_TYPES, type LocationType } from "@modules/locations/types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";

interface ListProps {
  data: Model[];
  count: number;
  isLoading: boolean;
  locations: Model[];
}

const TYPE_META: Record<LocationType, { icon: string; className: string; label: string }> = {
  site: {
    className: "location-type-badge--site",
    label: "Site",
    icon: "M280-120q-33 0-56.5-23.5T200-200v-560q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v560q0 33-23.5 56.5T680-120H280Z",
  },
  building: {
    className: "location-type-badge--building",
    label: "Building",
    icon: "M200-60q-33 0-56.5-23.5T120-140v-560h40v-80h560v80h40v560q0 33-23.5 56.5T760-60H200Zm40-680h520v-80H240v80Zm0 160h520v-80H240v80Zm0 160h520v-80H240v80Z",
  },
  floor: {
    className: "location-type-badge--floor",
    label: "Floor",
    icon: "M120-100v-80l80-80 80 80v80h240v-80l80-80 80 80v80h40q33 0 56.5 23.5T840-80v320q0 33-23.5 56.5T760 300H200q-33 0-56.5-23.5T120-20v-60h560v-80H200v-40q0-33 23.5-56.5T280-240h240q33 0 56.5 23.5T600-160v120H120v-280Z",
  },
  room: {
    className: "location-type-badge--room",
    label: "Room",
    icon: "M120-80v-320h280v-160h400v160q0 33-23.5 56.5T760-280v360q0 33-23.5 56.5T680-160H200q-33 0-56.5-23.5T120-240v160Zm0 160h560v-360q0-33 23.5-56.5T760-400v-160H400v160q0 33-23.5 56.5T320-280v360Zm0-40v-320 320Zm280-80v80h280v-80H400Zm0-160v80h280v-80H400Zm0-80v80h280v-80H400Z",
  },
};

const getParentName = (parentId: string | null, allLocations: Model[]): string => {
  if (!parentId) return "—";
  return allLocations.find((loc) => loc.id === parentId)?.name ?? "—";
};

// Location card component
const LocationCard = ({
  location,
  allLocations,
  depth = 0,
}: {
  location: Model;
  allLocations: Model[];
  depth?: number;
}) => {
  const meta = TYPE_META[location.type];
  const children = allLocations.filter((loc) => loc.parent_id === location.id);
  const isParent = children.length > 0;

  return (
    <div className={`hierarchy-node ${depth > 0 ? "is-child" : ""}`}>
      <div className="location-card" data-type={location.type}>
        {/* ── Type Icon ── */}
        <div className={`location-icon location-icon--${location.type}`}>
          <svg width="18" height="18" viewBox="0 -960 960 960" fill="currentColor">
            <path d={meta.icon} />
          </svg>
        </div>

        {/* ── Location Info ── */}
        <div className="location-info">
          <Link to={`/${moduleName}/${location.id}`} className="location-name">
            {location.name}
          </Link>
          <div className="location-meta">
            {location.code && (
              <span className="location-code-badge">{location.code}</span>
            )}
            <span className={`location-type-badge ${meta.className}`}>
              {meta.label}
            </span>
            {isParent && (
              <span className="location-children-count">
                <svg width="11" height="11" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="M240-160q-33 0-56.5-23.5T160-240v-120q0-33 23.5-56.5T240-440h240v-120H160v-80h320v80H200v120h240q33 0 56.5 23.5T520-280v120q0 33-23.5 56.5T440-80H240Zm0-80v80h200v-80H240Zm0-160v80h200v-80H240Z" />
                </svg>
                {children.length} {children.length === 1 ? "child" : "children"}
              </span>
            )}
          </div>
        </div>

        {/* ── Parent Info ── */}
        <div className="location-parent">
          <span className="location-parent__label">{getParentName(location.parent_id, allLocations)}</span>
          {location.parent_id && (
            <span className="location-parent__hint">parent</span>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="hierarchy-actions">
          <Link to={`/${moduleName}/${location.id}/update`} className="btn-action">
            <svg width="15" height="15" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M200-200h50.46l409.46-409.46-50.46-50.46L200-250.46V-200Zm-60 60v-135.38l527.62-527.39q9.07-8.24 20.03-12.73 10.97-4.5 23-4.5t23.3 4.27q11.28 4.27 19.97 13.58l48.85 49.46q9.31 8.69 13.27 20 3.96 11.31 3.96 22.62 0 12.07-4.12 23.03-4.12 10.97-13.11 20.04L275.38-140H140Z" />
            </svg>
          </Link>
          <Link to={`/${moduleName}/${location.id}`} className="btn-action">
            <svg width="15" height="15" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Render children ── */}
      {isParent && (
        <div className="hierarchy-children">
          {children.map((child) => (
            <LocationCard
              key={child.id}
              location={child}
              allLocations={allLocations}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const List = ({ data, count, isLoading: _isLoading, locations: _locations }: ListProps) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  const rootLocations = data.filter((loc) => !loc.parent_id);

  // Stats per type
  const typeCounts = LOCATION_TYPES.map((type) => ({
    ...type,
    count: data.filter((loc) => loc.type === type.value).length,
  }));

  return (
    <div className="module-list-container">
      {/* ── Stat Bar ── */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{count}</span>
          <span className="stat-label">{t("modules.locations.list.total_locations")}</span>
        </div>
        {typeCounts.map((tc, i) => (
          <div key={tc.value} className="stat-item" style={{ animationDelay: `${(i + 1) * 50}ms` }}>
            <span className="stat-value">{tc.count}</span>
            <span className="stat-label">{tc.label}</span>
          </div>
        ))}
      </div>

      {/* ── Header Bar ── */}
      <div className="module-list-header">
        <div className="module-list-title">
          <svg width="20" height="20" viewBox="0 -960 960 960" fill="#1a1a2e">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-560q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v560q0 33-23.5 56.5T680-120H280Z" />
          </svg>
          <h2>{t("modules.locations.list.title")}</h2>
        </div>
        <Link to={`/${moduleName}/create`} className="btn-create">
          <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M720-160q-33 0-56.5-23.5T640-240v-480q0-33 23.5-56.5T720-800h240q33 0 56.5 23.5T1040-720v480q0 33-23.5 56.5T960-160H720Zm0-160v-100h80v100h100v80h-100v100h-80v-100H640v-80h80Zm-320-80v-240H160v-80h240v-240h80v240h240v80H400v240h-80v-80H160v80h80Z" />
          </svg>
          {t("button.create")}
        </Link>
      </div>

      {/* ── Location Tree ── */}
      <div className="hierarchy-tree animate-fade-slide-up">
        {rootLocations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 -960 960 960" fill="#d1d5db">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-560q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v560q0 33-23.5 56.5T680-120H280Z" />
              </svg>
            </div>
            <p className="empty-state__text">{t("modules.locations.list.empty")}</p>
            <Link to={`/${moduleName}/create`} className="btn-create-empty">
              {t("modules.locations.list.create_first")}
            </Link>
          </div>
        ) : (
          rootLocations.map((location, index) => (
            <div
              key={location.id}
              style={{ animationDelay: `${index * 60}ms` }}
              className="animate-fade-slide-up"
            >
              <LocationCard
                location={location}
                allLocations={data}
                depth={0}
              />
            </div>
          ))
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