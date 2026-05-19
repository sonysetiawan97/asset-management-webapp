import { type FC } from "react";
import { useList } from "@hooks/list/useList";
import { type DisposalRequest, moduleName, DISPOSAL_STATUSES, DISPOSAL_METHODS } from "../../types/Model";
import { LoadingPage } from "@/components/loadings/LoadingPage";
import { usePagination } from "@hooks/list/usePagination";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const formatCurrency = (v?: number) => v === undefined || v === null ? "—" : new Intl.NumberFormat("en-US", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);
const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

export const ListWrapper: FC = () => {
  const { skip, limit } = usePagination();
  const { t } = useTranslation();
  const { data, isLoading, error } = useList<DisposalRequest>({
    module: moduleName, skip, limit, params: { "!sort[created_at]": -1 },
  });

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Disposals", path: `/${moduleName}` }]);
  }, []);

  if (isLoading) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;

  const items = data?.data.result || [];
  const total = data?.data.count || 0;
  const statusCounts = DISPOSAL_STATUSES.map((s) => ({ ...s, count: items.filter((i) => i.status === s.value).length }));

  return (
    <div className="module-list-container">
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{total}</span>
          <span className="stat-label">{t("modules.disposals.list.total")}</span>
        </div>
        {statusCounts.map((s) => (
          <div key={s.value} className="stat-item">
            <span className="stat-value" style={{ color: s.dot }}>{s.count}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="module-list-header">
        <div className="module-list-title">
          <svg width="20" height="20" viewBox="0 -960 960 960" fill="#1a1a2e">
            <path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" />
          </svg>
          <h2>{t("modules.disposals.list.title")}</h2>
        </div>
        <Link to={`/${moduleName}/create`} className="btn-create">
          <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M720-160q-33 0-56.5-23.5T640-240v-480q0-33 23.5-56.5T720-800h240q33 0 56.5 23.5T1040-720v480q0 33-23.5 56.5T960-160H720Z" />
          </svg>
          {t("button.create")}
        </Link>
      </div>

      <div className="workflow-grid animate-fade-slide-up">
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 -960 960 960" fill="#d1d5db">
                <path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" />
              </svg>
            </div>
            <p className="empty-state__text">{t("modules.disposals.list.empty")}</p>
          </div>
        ) : items.map((item, i) => {
          const status = DISPOSAL_STATUSES.find((s) => s.value === item.status);
          const method = DISPOSAL_METHODS.find((m) => m.value === item.method);
          return (
            <div key={item.id} className="workflow-card" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="workflow-card__header">
                <span className="workflow-status-badge" style={{ background: `${status?.dot}20`, color: status?.dot }}>
                  {status?.label}
                </span>
                <span className="workflow-code">{item.asset_code ?? "—"}</span>
              </div>
              <div className="workflow-card__body">
                <h3 className="workflow-name">{item.asset_name ?? "—"}</h3>
                <div className="workflow-meta">
                  <div className="workflow-meta__item">
                    <strong>{t("modules.disposals.list.method")}:</strong> {method?.label ?? "—"}
                  </div>
                  <div className="workflow-meta__item">
                    <strong>{t("modules.disposals.list.sale_price")}:</strong> {formatCurrency(item.sale_price)}
                  </div>
                  <div className="workflow-meta__item">
                    <strong>{t("modules.disposals.list.initiated")}:</strong> {formatDate(item.created_at)}
                  </div>
                </div>
                <p className="workflow-reason">{item.reason}</p>
                {item.certificate_ref && (
                  <div className="workflow-meta__item">
                    <strong>Certificate:</strong> {item.certificate_ref}
                  </div>
                )}
              </div>
              <div className="workflow-card__footer">
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                  {t("modules.disposals.list.by")} {item.created_by_name ?? "—"}
                </span>
                <div className="workflow-actions">
                  <Link to={`/${moduleName}/${item.id}`} className="btn-action" title="View">
                    <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor">
                      <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {total > limit && (
        <div className="module-pagination">
          <span className="pagination-info">{skip + 1}–{Math.min(skip + limit, total)} / {total}</span>
        </div>
      )}
    </div>
  );
};

export default ListWrapper;