import { Link } from "react-router-dom";
import { moduleName, type Model } from "@modules/departments/types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";

interface ListProps {
  data: Model[];
  count: number;
  isLoading: boolean;
  departments: Model[];
}

// Get children of a department
const getChildren = (departmentId: string, allDepartments: Model[]): Model[] => {
  return allDepartments.filter((d) => d.parent_id === departmentId);
};

// Single department card component
const DepartmentCard = ({
  department,
  allDepartments,
  depth = 0,
}: {
  department: Model;
  allDepartments: Model[];
  depth?: number;
}) => {
  const { t } = useTranslation();
  const children = getChildren(department.id, allDepartments);
  const isParent = children.length > 0;

  return (
    <div className={`hierarchy-node ${depth > 0 ? "is-child" : ""}`}>
      <div className="hierarchy-card" data-depth={depth}>
        {/* ── Department Icon ── */}
        <div className="category-icon">
          <svg width="18" height="18" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M480-80q-17 0-28.5-11.5T440-120v-120H280q-17 0-28.5-11.5T240-160v-160q0-17 11.5-28.5T280-200h160v-120q0-17 11.5-28.5T480-360q17 0 28.5 11.5T520-300v120h160q17 0 28.5 11.5T720-160v160q0 17-11.5 28.5T680-120H520v120q0 17-11.5 28.5T480-80Zm0-240Zm-200 0Zm400 0Z" />
          </svg>
        </div>

        {/* ── Department Info ── */}
        <div className="category-info">
          <Link to={`/${moduleName}/${department.id}`} className="category-name">
            {department.name}
          </Link>
          {department.code && (
            <span className="category-code">{department.code}</span>
          )}
          {depth === 0 && isParent && (
            <span className="category-has-children">
              <svg width="11" height="11" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M400-240q-33 0-56.5-23.5T320-320v-160q0-33 23.5-56.5T400-560h160q33 0 56.5 23.5T640-480v160q0 33-23.5 56.5T560-240H400Z" />
              </svg>
              {t("modules.departments.list.has_children", { count: children.length })}
            </span>
          )}
        </div>

        {/* ── Metrics ── */}
        <div className="hierarchy-detail">
          <div className="hierarchy-metric">
            <span className="hierarchy-metric__value">{department.headcount || 0}</span>
            <span className="hierarchy-metric__label">{t("modules.departments.list.headcount")}</span>
          </div>
        </div>

        {/* ── Action ── */}
        <div className="hierarchy-actions">
          <Link to={`/${moduleName}/${department.id}/update`} className="btn-action">
            <svg width="15" height="15" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M200-200h50.46l409.46-409.46-50.46-50.46L200-250.46V-200Zm-60 60v-135.38l527.62-527.39q9.07-8.24 20.03-12.73 10.97-4.5 23-4.5t23.3 4.27q11.28 4.27 19.97 13.58l48.85 49.46q9.31 8.69 13.27 20 3.96 11.31 3.96 22.62 0 12.07-4.12 23.03-4.12 10.97-13.11 20.04L275.38-140H140Z" />
            </svg>
          </Link>
          <Link to={`/${moduleName}/${department.id}`} className="btn-action">
            <svg width="15" height="15" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Render children recursively ── */}
      {isParent && (
        <div className="hierarchy-children">
          {children.map((child) => (
            <DepartmentCard
              key={child.id}
              department={child}
              allDepartments={allDepartments}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const List = ({ data, count, isLoading: _isLoading, departments: _departments }: ListProps) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  // Build hierarchy: root departments first
  const rootDepartments = data.filter((dep) => !dep.parent_id);

  return (
    <div className="module-list-container">
      {/* ── Stat Bar ── */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{count}</span>
          <span className="stat-label">{t("modules.departments.list.total_departments")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {data.filter((d: Model) => !d.parent_id).length}
          </span>
          <span className="stat-label">{t("modules.departments.list.root_departments")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {data.filter((d: Model) => d.parent_id).length}
          </span>
          <span className="stat-label">{t("modules.departments.list.sub_departments")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {data.reduce((acc: number, d: Model) => acc + (d.headcount || 0), 0)}
          </span>
          <span className="stat-label">{t("modules.departments.list.total_headcount")}</span>
        </div>
      </div>

      {/* ── Header Bar ── */}
      <div className="module-list-header">
        <div className="module-list-title">
          <svg width="20" height="20" viewBox="0 -960 960 960" fill="#1a1a2e">
            <path d="M480-80q-17 0-28.5-11.5T440-120v-120H280q-17 0-28.5-11.5T240-160v-160q0-17 11.5-28.5T280-200h160v-120q0-17 11.5-28.5T480-360q17 0 28.5 11.5T520-300v120h160q17 0 28.5 11.5T720-160v160q0 17-11.5 28.5T680-120H520v120q0 17-11.5 28.5T480-80Z" />
          </svg>
          <h2>{t("modules.departments.list.title")}</h2>
        </div>
        <Link to={`/${moduleName}/create`} className="btn-create">
          <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M720-160q-33 0-56.5-23.5T640-240v-480q0-33 23.5-56.5T720-800h240q33 0 56.5 23.5T1040-720v480q0 33-23.5 56.5T960-160H720Zm0-160v-100h80v100h100v80h-100v100h-80v-100H640v-80h80Zm-320-80v-240H160v-80h240v-240h80v240h240v80H400v240h-80v-80H160v80h80Z" />
          </svg>
          {t("button.create")}
        </Link>
      </div>

      {/* ── Hierarchy Tree ── */}
      <div className="hierarchy-tree animate-fade-slide-up">
        {rootDepartments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 -960 960 960" fill="#d1d5db">
                <path d="M480-80q-17 0-28.5-11.5T440-120v-120H280q-17 0-28.5-11.5T240-160v-160q0-17 11.5-28.5T280-200h160v-120q0-17 11.5-28.5T480-360q17 0 28.5 11.5T520-300v120h160q17 0 28.5 11.5T720-160v160q0 17-11.5 28.5T680-120H520v120q0 17-11.5 28.5T480-80Z" />
              </svg>
            </div>
            <p className="empty-state__text">{t("modules.departments.list.empty")}</p>
            <Link to={`/${moduleName}/create`} className="btn-create-empty">
              {t("modules.departments.list.create_first")}
            </Link>
          </div>
        ) : (
          rootDepartments.map((department, index) => (
            <div
              key={department.id}
              style={{ animationDelay: `${index * 60}ms` }}
              className="animate-fade-slide-up"
            >
              <DepartmentCard
                department={department}
                allDepartments={data}
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