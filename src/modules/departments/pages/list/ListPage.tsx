import { Link } from "react-router-dom";
import { moduleName, type Model } from "@modules/departments/types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";
import { Pagination } from "@components/list/Pagination";

interface ListProps {
  data: Model[];
  count: number;
  countByLevel?: Record<string, number>;
  selectedRoot: boolean | null;
  onRootChange: (value: boolean | null) => void;
}

export const List = ({
  data,
  count,
  countByLevel = {},
  selectedRoot,
  onRootChange,
}: ListProps) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  return (
    <div className="module-list-container">
      {/* ── Header Bar ── */}
      <div className="module-list-header">
        <div className="module-list-title">
          <i className="bi bi-diagram-3 fs-4" style={{ color: "#1a1a2e" }}></i>
          <h2>{t("modules.departments.list.title")}</h2>
        </div>
        <Link to={`/${moduleName}/create`} className="btn-create">
          <i className="bi bi-plus-lg"></i>
          {t("button.create")}
        </Link>
      </div>

      {/* ── Filter Bar ── */}
      <div className="status-filter-bar">
        <span className="status-filter-bar__label">{t("modules.departments.list.filter_by_level")}</span>
        <div className="status-filter-bar__chips">
          <button
            className={`status-chip ${selectedRoot === null ? "active" : ""}`}
            onClick={() => onRootChange(null)}
          >
            <span className="status-chip__label">{t("modules.departments.list.filter_all")}</span>
            <span className="status-chip__count">{countByLevel.all ?? count}</span>
          </button>
          <button
            className={`status-chip ${selectedRoot === true ? "active" : ""}`}
            onClick={() => onRootChange(true)}
          >
            <span className="status-chip__dot" style={{ background: "#6366f1" }} />
            <span className="status-chip__label">{t("modules.departments.list.filter_root")}</span>
            <span className="status-chip__count">{countByLevel.root ?? 0}</span>
          </button>
          <button
            className={`status-chip ${selectedRoot === false ? "active" : ""}`}
            onClick={() => onRootChange(false)}
          >
            <span className="status-chip__dot" style={{ background: "#10b981" }} />
            <span className="status-chip__label">{t("modules.departments.list.filter_sub")}</span>
            <span className="status-chip__count">{countByLevel.sub ?? 0}</span>
          </button>
        </div>
      </div>

      {/* ── List Table ── */}
      <div className="module-table-container animate-fade-slide-up">
        {data.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <i className="bi bi-inbox fs-1" style={{ color: "#d1d5db" }}></i>
            </div>
            <p className="empty-state__text">{t("modules.departments.list.empty")}</p>
            <Link to={`/${moduleName}/create`} className="btn-create-empty">
              {t("modules.departments.list.create_first")}
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th style={{ width: "48px" }}>#</th>
                  <th>{t("modules.departments.list.col_name")}</th>
                  <th>{t("modules.departments.list.col_code")}</th>
                  <th>{t("modules.departments.list.col_parent")}</th>
                  <th style={{ width: "100px", textAlign: "right" }}>
                    {t("modules.departments.list.col_headcount")}
                  </th>
                  <th style={{ width: "100px", textAlign: "center" }}>{t("button.action")}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((dept, index) => {
                  const parentName = dept.parent_id
                    ? data.find((d) => d.id === dept.parent_id)?.name ?? "—"
                    : "—";
                  return (
                    <tr key={dept.id} style={{ animationDelay: `${index * 20}ms` }} className="animate-fade-slide-up">
                      <td className="text-muted" style={{ textAlign: "center" }}>
                        {skip + index + 1}
                      </td>
                      <td>
                        <Link to={`/${moduleName}/${dept.id}`} className="text-decoration-none fw-semibold">
                          {dept.name}
                        </Link>
                      </td>
                      <td>
                        {dept.code ? (
                          <span className="location-code-badge">{dept.code}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="text-muted">{parentName}</td>
                      <td style={{ textAlign: "right" }}>
                        <span className="text-muted">{dept.headcount ?? 0}</span>
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <Link to={`/${moduleName}/${dept.id}/update`} className="btn-action" title="Edit">
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <Link to={`/${moduleName}/${dept.id}`} className="btn-action" title="View">
                            <i className="bi bi-eye"></i>
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
      <Pagination count={count} skip={skip} limit={limit} onPageChange={setSkip} />
    </div>
  );
};

export default List;
