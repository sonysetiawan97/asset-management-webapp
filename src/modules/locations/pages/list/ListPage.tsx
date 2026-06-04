import { Link } from "react-router-dom";
import {
  moduleName,
  type Model,
  LOCATION_TYPES,
  type LocationType,
} from "@modules/locations/types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";

interface ListProps {
  data: Model[];
  count: number;
  isLoading: boolean;
  locations: Model[];
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
  countByType?: Record<string, number>;
}

const TYPE_DOT_COLORS: Record<LocationType, string> = {
  site: "#6366f1",
  building: "#f59e0b",
  floor: "#10b981",
  room: "#3b82f6",
};

const TYPE_LABELS: Record<LocationType, string> = {
  site: "Site / Campus",
  building: "Building",
  floor: "Floor",
  room: "Room / Zone",
};

export const List = ({
  data,
  count,
  isLoading: _isLoading,
  locations: _locations,
  selectedType,
  onTypeChange,
  countByType = {},
}: ListProps) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  const typeStats = LOCATION_TYPES.map((type) => ({
    ...type,
    count: countByType[type.value] ?? 0,
  }));

  const filteredData = selectedType
    ? data.filter((loc) => loc.type === selectedType)
    : data;

  const getParentName = (parentId: string | null): string => {
    if (!parentId) return "—";
    return data.find((loc) => loc.id === parentId)?.name ?? "—";
  };

  return (
    <div className="module-list-container">
      {/* ── Header Bar ── */}
      <div className="module-list-header">
        <div className="module-list-title">
          <i className="bi bi-geo-alt fs-4" style={{ color: "#1a1a2e" }}></i>
          <h2>{t("modules.locations.list.title")}</h2>
        </div>
        <Link to={`/${moduleName}/create`} className="btn-create">
          <i className="bi bi-plus-lg"></i>
          {t("button.create")}
        </Link>
      </div>

      {/* ── Filter Bar ── */}
      <div className="status-filter-bar">
        <span className="status-filter-bar__label">{t("modules.locations.list.filter_by_type")}</span>
        <div className="status-filter-bar__chips">
          <button
            className={`status-chip ${selectedType === null ? "active" : ""}`}
            onClick={() => onTypeChange(null)}
          >
            <span className="status-chip__label">{t("modules.locations.list.filter_all")}</span>
            <span className="status-chip__count">{countByType.all ?? 0}</span>
          </button>
          {typeStats.map((s) => (
            <button
              key={s.value}
              className={`status-chip ${selectedType === s.value ? "active" : ""}`}
              onClick={() => onTypeChange(s.value)}
            >
              <span
                className="status-chip__dot"
                style={{ background: TYPE_DOT_COLORS[s.value] }}
              />
              <span className="status-chip__label">{s.label}</span>
              <span className="status-chip__count">{s.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── List Table ── */}
      <div className="module-table-container animate-fade-slide-up">
        {filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <i className="bi bi-inbox fs-1" style={{ color: "#d1d5db" }}></i>
            </div>
            <p className="empty-state__text">{t("modules.locations.list.empty")}</p>
            <Link to={`/${moduleName}/create`} className="btn-create-empty">
              {t("modules.locations.list.create_first")}
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th style={{ width: "48px" }}>#</th>
                  <th>{t("modules.locations.list.col_name")}</th>
                  <th>{t("modules.locations.list.col_code")}</th>
                  <th>{t("modules.locations.list.col_type")}</th>
                  <th>{t("modules.locations.list.col_parent")}</th>
                  <th style={{ width: "100px", textAlign: "center" }}>{t("button.action")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((location, index) => (
                  <tr key={location.id} style={{ animationDelay: `${index * 20}ms` }} className="animate-fade-slide-up">
                    <td className="text-muted" style={{ textAlign: "center" }}>
                      {skip + index + 1}
                    </td>
                    <td>
                      <Link to={`/${moduleName}/${location.id}`} className="text-decoration-none fw-semibold">
                        {location.name}
                      </Link>
                    </td>
                    <td>
                      {location.code ? (
                        <span className="location-code-badge">{location.code}</span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <span
                        style={{ color: TYPE_DOT_COLORS[location.type] }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: TYPE_DOT_COLORS[location.type],
                            marginRight: "6px",
                            verticalAlign: "middle",
                          }}
                        />
                        {TYPE_LABELS[location.type]}
                      </span>
                    </td>
                    <td className="text-muted">{getParentName(location.parent_id)}</td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <Link to={`/${moduleName}/${location.id}/update`} className="btn-action" title="Edit">
                            <i className="bi bi-pencil"></i>
                        </Link>
                        <Link to={`/${moduleName}/${location.id}`} className="btn-action" title="View">
                            <i className="bi bi-eye"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            <i className="bi bi-chevron-left"></i>
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
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default List;