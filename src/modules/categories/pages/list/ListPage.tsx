import { Link } from "react-router-dom";
import { moduleName, type Model } from "@modules/categories/types/Model";
import { EditButton } from "@components/list/actions/EditButton";
import { ReadButton } from "@components/list/actions/ReadButton";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";
import { Pagination } from "@components/list/Pagination";

interface ListProps {
  data: Model[];
  count: number;
  countByLevel?: Record<string, number>;
  allCategories: Model[];
  selectedRoot: boolean | null;
  onRootChange: (value: boolean | null) => void;
}

export const List = ({
  data,
  count,
  countByLevel = {},
  allCategories,
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
          <i className="bi bi-tags fs-4" style={{ color: "#1a1a2e" }}></i>
          <h2>{t("modules.categories.list.title")}</h2>
        </div>
        <AuthPrivilegesChecker link={`/${moduleName}`} method="POST">
          <Link to={`/${moduleName}/create`} className="btn-create">
            <i className="bi bi-plus-lg"></i>
            {t("button.create")}
          </Link>
        </AuthPrivilegesChecker>
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
            <span className="status-chip__count">{countByLevel.all ?? count}</span>
          </button>
          <button
            className={`status-chip ${selectedRoot === true ? "active" : ""}`}
            onClick={() => onRootChange(true)}
          >
            <span className="status-chip__dot" style={{ background: "#6366f1" }} />
            <span className="status-chip__label">{t("modules.categories.list.filter_root")}</span>
            <span className="status-chip__count">{countByLevel.root ?? 0}</span>
          </button>
          <button
            className={`status-chip ${selectedRoot === false ? "active" : ""}`}
            onClick={() => onRootChange(false)}
          >
            <span className="status-chip__dot" style={{ background: "#10b981" }} />
            <span className="status-chip__label">{t("modules.categories.list.filter_sub")}</span>
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
            <p className="empty-state__text">{t("modules.categories.list.empty")}</p>
            <AuthPrivilegesChecker link={`/${moduleName}`} method="POST">
              <Link to={`/${moduleName}/create`} className="btn-create-empty">
                {t("modules.categories.list.create_first")}
              </Link>
            </AuthPrivilegesChecker>
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
                {data.map((cat, index) => {
                  const parentName = cat.parent_id
                    ? allCategories.find((c) => c.id === cat.parent_id)?.name ?? "—"
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
                          <EditButton id={cat.id} />
                          <ReadButton id={cat.id} />
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
