import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { apiAxios } from "@/utils/apiAxios";
import { ContentLoader } from "@components/loadings/ContentLoader";

interface AssetLogsSectionProps {
  assetId: string;
}

interface CheckoutLog {
  id: string;
  asset_id: string;
  assigned_to: string;
  assigned_by: string;
  checkout_date: string;
  expected_return_date: string | null;
  return_date: string | null;
  condition_on_return: string | null;
  notes: string | null;
}

interface MaintenanceLog {
  id: string;
  asset_id: string;
  type: string;
  date_performed: string;
  performed_by: string;
  description: string;
  cost: number | null;
  next_maintenance_date: string | null;
  notes: string | null;
  status: string;
}

const fetchCheckoutHistory = async (assetId: string): Promise<CheckoutLog[]> => {
  const { data } = await apiAxios.get<{ data: CheckoutLog[] }>(`/assets/${assetId}/checkout-history`);
  return data.data;
};

const fetchMaintenanceHistory = async (assetId: string): Promise<MaintenanceLog[]> => {
  const { data } = await apiAxios.get<{ data: MaintenanceLog[] }>(`/assets/${assetId}/maintenance-history`);
  return data.data;
};

const formatDate = (value: string | null | undefined): string => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
};

const isOverdue = (log: CheckoutLog): boolean => {
  if (log.return_date) return false;
  if (!log.expected_return_date) return false;
  return new Date(log.expected_return_date).getTime() < Date.now();
};

const checkoutStatus = (log: CheckoutLog, t: (k: string) => string): { label: string; className: string } => {
  if (log.return_date) return { label: t("modules.assets.read.logs.checkout.status.returned"), className: "bg-success-subtle text-success" };
  if (isOverdue(log)) return { label: t("modules.assets.read.logs.checkout.status.overdue"), className: "bg-danger-subtle text-danger" };
  return { label: t("modules.assets.read.logs.checkout.status.open"), className: "bg-warning-subtle text-warning" };
};

export const AssetLogsSection = ({ assetId }: AssetLogsSectionProps) => {
  const { t } = useTranslation();

  const checkoutQuery = useQuery({
    queryKey: ["assets", assetId, "checkout-history"],
    queryFn: () => fetchCheckoutHistory(assetId),
    enabled: !!assetId,
  });

  const maintenanceQuery = useQuery({
    queryKey: ["assets", assetId, "maintenance-history"],
    queryFn: () => fetchMaintenanceHistory(assetId),
    enabled: !!assetId,
  });

  const checkouts = checkoutQuery.data ?? [];
  const maintenance = maintenanceQuery.data ?? [];
  const isLoading = checkoutQuery.isLoading || maintenanceQuery.isLoading;

  return (
    <div className="mt-3">
      <h5 className="mb-3">{t("modules.assets.read.logs.title")}</h5>

      {isLoading ? (
        <ContentLoader />
      ) : (
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <div className="card h-100">
              <div className="card-header bg-light">
                <h6 className="mb-0">{t("modules.assets.read.logs.checkout.title")}</h6>
              </div>
              <div className="card-body p-0">
                {checkouts.length === 0 ? (
                  <p className="text-muted small p-3 mb-0">{t("modules.assets.read.logs.checkout.empty")}</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {checkouts.map((log) => {
                      const status = checkoutStatus(log, t);
                      return (
                        <li key={log.id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <strong className="small">{formatDate(log.checkout_date)}</strong>
                            <span className={`badge ${status.className}`}>{status.label}</span>
                          </div>
                          <div className="small text-muted mb-1">
                            {t("modules.assets.read.logs.checkout.assignedTo")}: <span className="text-body">#{log.assigned_to}</span>
                          </div>
                          {log.expected_return_date && (
                            <div className="small text-muted mb-1">
                              {t("modules.assets.read.logs.checkout.expectedReturn")}: <span className="text-body">{formatDate(log.expected_return_date)}</span>
                            </div>
                          )}
                          {log.return_date && (
                            <div className="small text-muted mb-1">
                              {t("modules.assets.read.logs.checkout.returnDate")}: <span className="text-body">{formatDate(log.return_date)}</span>
                            </div>
                          )}
                          {log.condition_on_return && (
                            <div className="small text-muted mb-1">
                              {t("modules.assets.read.logs.checkout.conditionOnReturn")}: <span className="text-body">{log.condition_on_return}</span>
                            </div>
                          )}
                          {log.notes && <div className="small mt-1">{log.notes}</div>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card h-100">
              <div className="card-header bg-light">
                <h6 className="mb-0">{t("modules.assets.read.logs.maintenance.title")}</h6>
              </div>
              <div className="card-body p-0">
                {maintenance.length === 0 ? (
                  <p className="text-muted small p-3 mb-0">{t("modules.assets.read.logs.maintenance.empty")}</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {maintenance.map((log) => (
                      <li key={log.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <strong className="small">{formatDate(log.date_performed)}</strong>
                          <span className="badge bg-info-subtle text-info text-uppercase">{log.type}</span>
                        </div>
                        <div className="small text-muted mb-1">
                          {t("modules.assets.read.logs.maintenance.performedBy")}: <span className="text-body">{log.performed_by}</span>
                        </div>
                        <div className="small mb-1">{log.description}</div>
                        {log.cost !== null && log.cost !== undefined && (
                          <div className="small text-muted mb-1">
                            {t("modules.assets.read.logs.maintenance.cost")}: <span className="text-body">{log.cost.toLocaleString()}</span>
                          </div>
                        )}
                        {log.next_maintenance_date && (
                          <div className="small text-muted mb-1">
                            {t("modules.assets.read.logs.maintenance.nextMaintenance")}: <span className="text-body">{formatDate(log.next_maintenance_date)}</span>
                          </div>
                        )}
                        {log.notes && <div className="small mt-1">{log.notes}</div>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
