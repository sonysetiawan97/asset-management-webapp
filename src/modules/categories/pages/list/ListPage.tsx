import { Link } from "react-router-dom";
import { moduleName, type Model } from "@modules/categories/types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";

interface ListProps {
  data: Model[];
  count: number;
  isLoading: boolean;
  categories: Model[];
  selectedRoot: boolean | null;
  onRootChange: (value: boolean | null) => void;
}

export const List = ({
  data,
  count,
  isLoading: _isLoading,
  categories: _categories,
  selectedRoot,
  onRootChange,
}: ListProps) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  const rootCount = data.filter((c) => !c.parent_id).length;
  const subCount = data.filter((c) => !!c.parent_id).length;

  const filteredData =
    selectedRoot === true
      ? data.filter((c) => !c.parent_id)
      : selectedRoot === false
        ? data.filter((c) => !!c.parent_id)
        : data;

  return (
    <div className="module-list-container">
      {/* ── Header Bar ── */}
      <div className="module-list-header">
        <div className="module-list-title">
          <svg width="20" height="20" viewBox="0 -960 960 960" fill="#1a1a2e">
            <path d="M560-160q-17 0-28.5-11.5T520-200q0-17 11.5-28.5T560-240h320q17 0 28.5 11.5T920-200q0 17-11.5 28.5T880-160H560Zm0-160q-17 0-28.5-11.5T520-360q0-17 11.5-28.5T560-400h320q17 0 28.5 11.5T920-360q0 17-11.5 28.5T880-320H560Zm0-160q-17 0-28.5-11.5T520-520q0-17 11.5-28.5T560-560h320q17 0 28.5 11.5T920-520q0 17-11.5 28.5T880-480H560Z" />
          </svg>
          <h2>{t("modules.categories.list.title")}</h2>
        </div>
        <Link to={`/${moduleName}/create`} className="btn-create">
          <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M720-160q-33 0-56.5-23.5T640-240v-480q0-33 23.5-56.5T720-800h240q33 0 56.5 23.5T1040-720v480q0 33-23.5 56.5T960-160H720Zm0-160v-100h80v100h100v80h-100v100h-80v-100H640v-80h80Zm-320-80v-240H160v-80h240v-240h80v240h240v80H400v240h-80v-80H160v80h80Z" />
          </svg>
          {t("button.create")}
        </Link>
      </div>

      {/* ── Filter Bar ── */}
      <div className="status-filter-bar">
        <span className="status-filter-bar__label">{t("modules.categories.list.filter_by_level")}</span>
        <div className="status-filter-bar__chips">
          <button
            className={`status-chip ${selectedRoot === null ? "active" : ""}`}
            onClick={() => onRootChange(null)}
          >
            <span className="status-chip__label">{t("modules.categories.list.filter_all")}</span>
            <span className="status-chip__count">{count}</span>
          </button>
          <button
            className={`status-chip ${selectedRoot === true ? "active" : ""}`}
            onClick={() => onRootChange(true)}
          >
            <span className="status-chip__dot" style={{ background: "#6366f1" }} />
            <span className="status-chip__label">{t("modules.categories.list.filter_root")}</span>
            <span className="status-chip__count">{rootCount}</span>
          </button>
          <button
            className={`status-chip ${selectedRoot === false ? "active" : ""}`}
            onClick={() => onRootChange(false)}
          >
            <span className="status-chip__dot" style={{ background: "#10b981" }} />
            <span className="status-chip__label">{t("modules.categories.list.filter_sub")}</span>
            <span className="status-chip__count">{subCount}</span>
          </button>
        </div>
      </div>

      {/* ── List Table ── */}
      <div className="module-table-container animate-fade-slide-up">
        {filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 -960 960 960" fill="#d1d5db">
                <path d="M560-160q-17 0-28.5-11.5T520-200q0-17 11.5-28.5T560-240h320q17 0 28.5 11.5T920-200q0 17-11.5 28.5T880-160H560Zm0-160q-17 0-28.5-11.5T520-360q0-17 11.5-28.5T560-400h320q17 0 28.5 11.5T920-360q0 17-11.5 28.5T880-320H560Zm0-160q-17 0-28.5-11.5T520-520q0-17 11.5-28.5T560-560h320q17 0 28.5 11.5T920-520q0 17-11.5 28.5T880-480H560Z" />
              </svg>
            </div>
            <p className="empty-state__text">{t("modules.categories.list.empty")}</p>
            <Link to={`/${moduleName}/create`} className="btn-create-empty">
              {t("modules.categories.list.create_first")}
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th style={{ width: "48px" }}>#</th>
                  <th>{t("modules.categories.list.col_name")}</th>
                  <th>{t("modules.categories.list.col_parent")}</th>
                  <th style={{ width: "100px", textAlign: "right" }}>
                    {t("modules.categories.list.col_useful_life")}
                  </th>
                  <th style={{ width: "100px", textAlign: "right" }}>
                    {t("modules.categories.list.col_salvage")}
                  </th>
                  <th style={{ width: "100px", textAlign: "center" }}>{t("button.action")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((cat, index) => {
                  const parentName = cat.parent_id
                    ? data.find((c) => c.id === cat.parent_id)?.name ?? "—"
                    : "—";
                  return (
                    <tr key={cat.id} style={{ animationDelay: `${index * 20}ms` }} className="animate-fade-slide-up">
                      <td className="text-muted" style={{ textAlign: "center" }}>
                        {skip + index + 1}
                      </td>
                      <td>
                        <Link to={`/${moduleName}/${cat.id}`} className="text-decoration-none fw-semibold">
                          {cat.name}
                        </Link>
                      </td>
                      <td className="text-muted">{parentName}</td>
                      <td style={{ textAlign: "right" }}>
                        <span className="text-muted">{cat.useful_life_years ?? 0}</span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span className="text-muted">{cat.salvage_value_pct ?? 0}%</span>
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <Link to={`/${moduleName}/${cat.id}/update`} className="btn-action" title="Edit">
                            <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor">
                              <path d="M200-200h50.46l409.46-409.46-50.46-50.46L200-250.46V-200Zm-60 60v-135.38l527.62-527.39q9.07-8.24 20.03-12.73 10.97-4.5 23-4.5t23.3 4.27q11.28 4.27 19.97 13.58l48.85 49.46q9.31 8.69 13.27 20 3.96 11.31 3.96 22.62 0 12.07-4.12 23.03-4.12 10.97-13.11 20.04L275.38-140H140Z" />
                            </svg>
                          </Link>
                          <Link to={`/${moduleName}/${cat.id}`} className="btn-action" title="View">
                            <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor">
                              <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-re157 146-158t207-158Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112"
                                fill="currentColor"></path>
                              <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
