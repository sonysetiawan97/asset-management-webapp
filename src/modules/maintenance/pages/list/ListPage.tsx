import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "@/utils/apiAxios";
import { moduleName, type MaintenanceLog, MAINTENANCE_TYPES, type MaintenanceType } from "../../types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";
import { useSnackbar } from "notistack";
import { Modal } from "@components/Modal";
import { Pagination } from "@components/list/Pagination";

interface ListProps {
  data: MaintenanceLog[];
  count: number;
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const TYPE_DOT_COLORS: Record<MaintenanceType, string> = {
  scheduled: "#6366f1",
  corrective: "#ef4444",
  preventive: "#10b981",
  inspection: "#f59e0b",
};

const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
};

export const List: FC<ListProps> = ({ data, count }) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [completeTargetId, setCompleteTargetId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("all");

  const completeMutation = useMutation({
    mutationFn: (id: string) => apiAxios.post(`/${moduleName}/${id}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [moduleName] });
      enqueueSnackbar(t("modules.maintenance.update.notification.success"), { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar(t("modules.maintenance.update.notification.error"), { variant: "error" });
    },
    onSettled: () => setCompleteTargetId(null),
  });

  const handleConfirmComplete = () => {
    if (!completeTargetId) return;
    completeMutation.mutate(completeTargetId);
  };

  const typeCounts = data.reduce<Record<string, number>>((acc, l) => {
    acc[l.type] = (acc[l.type] || 0) + 1;
    return acc;
  }, {});

  const filteredData = selectedType === "all" ? data : data.filter((l) => l.type === selectedType);

  return (
    <div className="module-list-container">
      {/* Stat Bar */}
      <div className="module-stat-bar">
        <div className="stat-item">
          <span className="stat-value">{count}</span>
          <span className="stat-label">{t("modules.maintenance.list.total_logs")}</span>
        </div>
        {MAINTENANCE_TYPES.map((type) => (
          <div key={type.value} className="stat-item" style={{ borderLeftColor: "#3b82f6" }}>
            <span className="stat-value" style={{ color: "#3b82f6" }}>{typeCounts[type.value] ?? 0}</span>
            <span className="stat-label">{type.label}</span>
          </div>
        ))}
        <div className="stat-item" style={{ borderLeftColor: "#10b981" }}>
          <span className="stat-value" style={{ color: "#10b981" }}>{formatCurrency(filteredData.reduce((acc, l) => acc + (Number(l.cost) || 0), 0))}</span>
          <span className="stat-label">{t("modules.maintenance.list.total_cost")}</span>
        </div>
      </div>

      {/* Type Filter */}
      <div className="status-filter-bar">
        <span className="status-filter-bar__label">{t("modules.maintenance.list.filter_by_type")}</span>
        <div className="status-filter-bar__chips">
          <button
            className={`status-chip ${selectedType === "all" ? "active" : ""}`}
            onClick={() => setSelectedType("all")}
          >
            <span className="status-chip__label">{t("modules.maintenance.list.filter_type_all")}</span>
            <span className="status-chip__count">{data.length}</span>
          </button>
          {MAINTENANCE_TYPES.map((type) => (
            <button
              key={type.value}
              className={`status-chip ${selectedType === type.value ? "active" : ""}`}
              onClick={() => setSelectedType(type.value)}
            >
              <span className="status-chip__dot" style={{ background: TYPE_DOT_COLORS[type.value] }} />
              <span className="status-chip__label">{type.label}</span>
              <span className="status-chip__count">{typeCounts[type.value] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="module-list-header">
        <div className="module-list-title">
          <i className="bi bi-wrench fs-4" style={{ color: "#1a1a2e" }}></i>
          <h2>{t("modules.maintenance.list.title")}</h2>
        </div>
        <Link to={`/${moduleName}/create`} className="btn-create">
          <i className="bi bi-plus-lg"></i>
          {t("button.create")}
        </Link>
      </div>

      {/* Cards */}
      <div className="workflow-grid animate-fade-slide-up">
        {filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <i className="bi bi-inbox fs-1" style={{ color: "#d1d5db" }}></i>
            </div>
            <p className="empty-state__text">{t("modules.maintenance.list.empty")}</p>
          </div>
        ) : (
          filteredData.map((log, index) => {
            const typeMeta = MAINTENANCE_TYPES.find((t) => t.value === log.type);
            return (
              <div key={log.id} className="ui-card workflow-card" style={{ animationDelay: `${index * 40}ms` }}>
                <div className="workflow-card__header">
                  <div className="workflow-status">
                    <span
                      className="workflow-status-badge"
                      style={{
                        background: log.status === "completed" ? "#d1fae520" : "#fef3c720",
                        color: log.status === "completed" ? "#065f46" : "#78350f",
                      }}
                    >
                      {log.status === "completed" ? t("modules.maintenance.list.completed") : t("modules.maintenance.list.open")}
                    </span>
                    <span
                      className="workflow-type-badge"
                      style={{ background: typeMeta ? "#dbeafe" : undefined, color: typeMeta ? "#1e40af" : undefined }}
                    >
                      {typeMeta?.label}
                    </span>
                  </div>
                  <span className="workflow-code">{log.asset_code ?? "—"}</span>
                </div>

                <div className="workflow-card__body">
                  <h3 className="workflow-name">{log.asset_name ?? "—"}</h3>
                  <p className="workflow-description">{log.description}</p>
                  <div className="workflow-meta">
                    <div className="workflow-meta__item">
                      <i className="bi bi-calendar"></i>
                      {t("modules.maintenance.list.performed_on")}: {formatDate(log.date_performed)}
                    </div>
                    {log.performed_by_name && (
                      <div className="workflow-meta__item">
                        <i className="bi bi-person"></i>
                        {log.performed_by_name}
                      </div>
                    )}
                    {log.cost && (
                      <div className="workflow-meta__item">
                        <i className="bi bi-currency-dollar"></i>
                        {formatCurrency(log.cost)}
                      </div>
                    )}
                    {log.next_maintenance_date && (
                      <div className="workflow-meta__item">
                        <i className="bi bi-calendar-check"></i>
                        {t("modules.maintenance.list.next")}: {formatDate(log.next_maintenance_date)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="workflow-card__footer">
                  <div className="workflow-actions">
                    {log.status !== "completed" && (
                      <button
                        className="btn-action btn-action--primary"
                        title={t("modules.maintenance.read.complete")}
                        onClick={() => setCompleteTargetId(log.id)}
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>
                    )}
                    <Link to={`/${moduleName}/${log.id}`} className="btn-action" title="View">
                      <i className="bi bi-eye"></i>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Complete Confirmation Modal */}
      <Modal
        isOpen={!!completeTargetId}
        closeModal={() => setCompleteTargetId(null)}
        title={t("modules.maintenance.list.complete_modal_title")}
      >
        <div className="modal-body">
          <p>{t("modules.maintenance.list.complete_modal_body")}</p>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setCompleteTargetId(null)}
            disabled={completeMutation.isPending}
          >
            {t("button.cancel")}
          </button>
          <button
            className="btn btn-success"
            onClick={handleConfirmComplete}
            disabled={completeMutation.isPending}
          >
            {completeMutation.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" />
                {t("modules.maintenance.read.complete")}
              </>
            ) : (
              t("modules.maintenance.read.complete")
            )}
          </button>
        </div>
      </Modal>

      {/* Pagination */}
      {filteredData.length > limit && (
        <Pagination count={count} skip={skip} limit={limit} onPageChange={setSkip} />
      )}
    </div>
  );
};

export default List;
