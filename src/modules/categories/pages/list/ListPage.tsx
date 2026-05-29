import { Link } from "react-router-dom";
import { moduleName, type Model } from "@modules/categories/types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";

interface ListProps {
  data: Model[];
  count: number;
  isLoading: boolean;
  categories: Model[];
}

// Get children of a category
const getChildren = (categoryId: string, allCategories: Model[]): Model[] => {
  return allCategories.filter((c) => c.parent_id === categoryId);
};

// Count assets under a category (placeholder — wire to actual API)
const CategoryCount = ({ count }: { count: number }) => (
  <span className="hierarchy-count">
    <svg width="12" height="12" viewBox="0 -960 960 960" fill="currentColor">
      <path d="M520-80q-17 0-28.5-11.5T480-120q0-17 11.5-28.5T520-160h320q17 0 28.5 11.5T880-120q0 17-11.5 28.5T840-80H520Zm0-160q-17 0-28.5-11.5T480-280q0-17 11.5-28.5T520-320h320q17 0 28.5 11.5T880-280q0 17-11.5 28.5T840-240H520Z" />
    </svg>
    {count}
  </span>
);

// Single category card component
const CategoryCard = ({
  category,
  allCategories,
  depth = 0,
}: {
  category: Model;
  allCategories: Model[];
  depth?: number;
}) => {
  const { t } = useTranslation();
  const children = getChildren(category.id, allCategories);
  const isParent = children.length > 0;

  return (
    <div className={`hierarchy-node ${depth > 0 ? "is-child" : ""}`}>
      <div className="hierarchy-card" data-depth={depth}>
        {/* ── Category Icon ── */}
        <div className="category-icon">
          <svg width="18" height="18" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M560-160q-17 0-28.5-11.5T520-200q0-17 11.5-28.5T560-240h320q17 0 28.5 11.5T920-200q0 17-11.5 28.5T880-160H560Zm0-160q-17 0-28.5-11.5T520-360q0-17 11.5-28.5T560-400h320q17 0 28.5 11.5T920-360q0 17-11.5 28.5T880-320H560Zm0-160q-17 0-28.5-11.5T520-520q0-17 11.5-28.5T560-560h320q17 0 28.5 11.5T920-520q0 17-11.5 28.5T880-480H560Z" />
          </svg>
        </div>

        {/* ── Category Info ── */}
        <div className="category-info">
          <Link to={`/${moduleName}/${category.id}`} className="category-name">
            {category.name}
          </Link>
          {depth === 0 && isParent && (
            <span className="category-has-children">
              <svg width="11" height="11" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M400-240q-33 0-56.5-23.5T320-320v-160q0-33 23.5-56.5T400-560h160q33 0 56.5 23.5T640-480v160q0 33-23.5 56.5T560-240H400Zm-80 240v-320h320v320H320Z" />
              </svg>
              {t("modules.categories.list.has_children", { count: children.length })}
            </span>
          )}
        </div>

        {/* ── Metrics ── */}
        {/* <div className="hierarchy-detail">
          <div className="hierarchy-metric">
            <span className="hierarchy-metric__value">{category.useful_life_years}</span>
            <span className="hierarchy-metric__label">{t("modules.categories.list.years")}</span>
          </div>
          <div className="hierarchy-metric">
            <span className="hierarchy-metric__value">{category.salvage_value_pct}%</span>
            <span className="hierarchy-metric__label">{t("modules.categories.list.salvage")}</span>
          </div>
          <div className="hierarchy-metric">
            <span className="hierarchy-metric__value">
              <CategoryCount count={0} />
            </span>
            <span className="hierarchy-metric__label">{t("modules.categories.list.assets")}</span>
          </div>
        </div> */}

        {/* ── Action ── */}
        <div className="hierarchy-actions">
          <Link to={`/${moduleName}/${category.id}/update`} className="btn-action">
            <svg width="15" height="15" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M200-200h50.46l409.46-409.46-50.46-50.46L200-250.46V-200Zm-60 60v-135.38l527.62-527.39q9.07-8.24 20.03-12.73 10.97-4.5 23-4.5t23.3 4.27q11.28 4.27 19.97 13.58l48.85 49.46q9.31 8.69 13.27 20 3.96 11.31 3.96 22.62 0 12.07-4.12 23.03-4.12 10.97-13.11 20.04L275.38-140H140Z" />
            </svg>
          </Link>
          <Link to={`/${moduleName}/${category.id}`} className="btn-action">
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
            <CategoryCard
              key={child.id}
              category={child}
              allCategories={allCategories}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const List = ({ data, count, isLoading: _isLoading, categories: _categories }: ListProps) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  // Build hierarchy: root categories first
  const rootCategories = data.filter((cat) => !cat.parent_id);

  return (
    <div className="module-list-container">
      {/* ── Stat Bar ── */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{count}</span>
          <span className="stat-label">{t("modules.categories.list.total_categories")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {data.filter((c: Model) => !c.parent_id).length}
          </span>
          <span className="stat-label">{t("modules.categories.list.root_categories")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {data.filter((c: Model) => c.parent_id).length}
          </span>
          <span className="stat-label">{t("modules.categories.list.sub_categories")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {data.length > 0
              ? Math.round(
                  data.reduce((acc: number, c: Model) => acc + c.useful_life_years, 0) /
                    data.length,
                )
              : 0}
          </span>
          <span className="stat-label">{t("modules.categories.list.avg_life")}</span>
        </div>
      </div>

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

      {/* ── Hierarchy Tree ── */}
      <div className="hierarchy-tree animate-fade-slide-up">
        {rootCategories.length === 0 ? (
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
          rootCategories.map((category, index) => (
            <div
              key={category.id}
              style={{ animationDelay: `${index * 60}ms` }}
              className="animate-fade-slide-up"
            >
              <CategoryCard
                category={category}
                allCategories={data}
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