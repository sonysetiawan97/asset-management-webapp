import { type FC } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { moduleName, type OpnameItem, type ReadModel } from "../../types/Model";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "@components/list/StatusBadge";
import { LoadingPage } from "@components/loadings/LoadingPage";
import { Pagination } from "@components/list/Pagination";
import { apiAxios } from "@/utils/apiAxios";
import { enqueueSnackbar } from "notistack";

interface ReadPageProps {
  data: ReadModel;
  onAction: (action: string) => Promise<void>;
  activeTab: "items" | "summary" | "discrepancies";
  onTabChange: (tab: "items" | "summary" | "discrepancies") => void;
  items: unknown[];
  summary: unknown;
  discrepancies: unknown[];
  loadingSub: boolean;
  itemsCount: number;
  itemsSkip: number;
  itemsLimit: number;
  onItemsPageChange: (newSkip: number) => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  draft: { bg: "#f3f4f6", text: "#374151", dot: "#9ca3af" },
  in_progress: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  pending_approval: { bg: "#fef3c7", text: "#78350f", dot: "#f59e0b" },
  approved: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  closed: { bg: "#e0f2fe", text: "#075985", dot: "#0ea5e9" },
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ItemRow: FC<{ item: OpnameItem }> = ({ item }) => {
  const statusMap: Record<string, { label: string; bg: string; text: string }> = {
    match: { label: "Match", bg: "#d1fae5", text: "#065f46" },
    mismatch: { label: "Mismatch", bg: "#fee2e2", text: "#991b1b" },
    not_found: { label: "Not Found", bg: "#fef3c7", text: "#92400e" },
    extra: { label: "Extra", bg: "#e0f2fe", text: "#075985" },
  };
  const sc = statusMap[item.counted_status ?? "not_found"] ?? statusMap.not_found;
  return (
    <tr>
      <td><span className="fw-semibold">{item.asset?.asset_code ?? "—"}</span></td>
      <td>{item.asset?.name ?? "—"}</td>
      <td>
        <span className="badge" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
      </td>
      <td>{item.counted_at ? formatDate(item.counted_at) : "—"}</td>
      <td>{item.countedByUser ? `${item.countedByUser.first_name} ${item.countedByUser.last_name}`.trim() || "—" : "—"}</td>
      <td>
        {item.notes ? (
          <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: 120 }}>
            {item.notes}
          </small>
        ) : "—"}
      </td>
    </tr>
  );
};

export const ReadPage: FC<ReadPageProps> = ({
  data,
  onAction,
  activeTab,
  onTabChange,
  items,
  summary,
  discrepancies,
  loadingSub,
  itemsCount,
  itemsSkip,
  itemsLimit,
  onItemsPageChange,
}) => {
  const { t } = useTranslation();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  if (!data) return <LoadingPage />;

  const session = data;
  const color = STATUS_COLORS[session.status] ?? STATUS_COLORS.draft;

  const handleAction = async (action: string) => {
    setActionLoading(action);
    try {
      await onAction(action);
    } catch {
      enqueueSnackbar(t("modules.opname.read.notification.action_failed"), { variant: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const actionButtons = {
    draft: (
      <>
        <button
          className="btn btn-success btn-sm"
          onClick={() => handleAction("start")}
          disabled={!!actionLoading}
        >
          {actionLoading === "start" ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            <i className="bi bi-play-fill me-1" />
          )}
          {t("modules.opname.read.action_start")}
        </button>
        <Link to={`/${moduleName}/${session.id}/update`} className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-pencil me-1" />
          {t("button.edit", { defaultValue: "Edit" })}
        </Link>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={async () => {
            if (confirm(t("modules.opname.read.confirm_delete") as string)) {
              setActionLoading("delete");
              try {
                await apiAxios.delete(`/opname/sessions/${session.id}`);
                enqueueSnackbar(t("modules.opname.read.notification.delete_success"), { variant: "success" });
                window.location.href = `/${moduleName}`;
              } catch {
                enqueueSnackbar(t("modules.opname.read.notification.delete_failed"), { variant: "error" });
              } finally {
                setActionLoading(null);
              }
            }
          }}
          disabled={!!actionLoading}
        >
          <i className="bi bi-trash" />
        </button>
      </>
    ),
    in_progress: (
      <>
        <Link to={`/${moduleName}/${session.id}/count`} className="btn btn-primary btn-sm">
          <i className="bi bi-qr-code-scan me-1" />
          {t("modules.opname.list.btn_count")}
        </Link>
        <button
          className="btn btn-warning btn-sm"
          onClick={() => handleAction("complete")}
          disabled={!!actionLoading}
        >
          {actionLoading === "complete" ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            <i className="bi bi-check-circle me-1" />
          )}
          {t("modules.opname.read.action_complete")}
        </button>
      </>
    ),
    pending_approval: (
      <>
        <button
          className="btn btn-success btn-sm"
          onClick={() => handleAction("approve")}
          disabled={!!actionLoading}
        >
          {actionLoading === "approve" ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            <i className="bi bi-check2 me-1" />
          )}
          {t("modules.opname.read.action_approve")}
        </button>
        <button
          className="btn btn-outline-warning btn-sm"
          onClick={() => handleAction("reject")}
          disabled={!!actionLoading}
        >
          {actionLoading === "reject" ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            <i className="bi bi-x-circle me-1" />
          )}
          {t("modules.opname.read.action_reject")}
        </button>
      </>
    ),
    approved: (
      <button
        className="btn btn-dark btn-sm"
        onClick={() => handleAction("close")}
        disabled={!!actionLoading}
      >
        {actionLoading === "close" ? (
          <span className="spinner-border spinner-border-sm" />
        ) : (
          <i className="bi bi-lock-fill me-1" />
        )}
        {t("modules.opname.read.action_close")}
      </button>
    ),
    closed: null,
  };

  const sm = summary as {
    total: number;
    counted: number;
    uncounted: number;
    match: number;
    mismatch: number;
    not_found: number;
    extra: number;
  } | null;

  return (
    <div className="module-list-container">
      {/* Header */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body py-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <h5 className="mb-0 fw-bold">{session.name}</h5>
              <small className="text-muted">
                {t("modules.opname.read.field_start_date")}: {formatDate(session.start_date)}
                {session.end_date ? ` — ${formatDate(session.end_date)}` : ""}
              </small>
            </div>
            <div className="d-flex align-items-center gap-2">
              <StatusBadge
                label={session.status.replace("_", " ")}
                bgColor={color.bg}
                textColor={color.text}
                dotColor={color.dot}
              />
              <div className="d-flex gap-2 flex-wrap">
                {actionButtons[session.status as keyof typeof actionButtons]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-2">
          <ul className="nav nav-tabs card-header-tabs" role="tablist">
            {(["items", "summary", "discrepancies"] as const).map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link${activeTab === tab ? " active" : ""}`}
                  onClick={() => onTabChange(tab)}
                  type="button"
                >
                  {t(`modules.opname.read.tab_${tab}`)}
                  {tab === "items" && itemsCount > 0 && (
                    <span className="badge bg-secondary ms-1">{itemsCount}</span>
                  )}
                  {tab === "discrepancies" && discrepancies.length > 0 && (
                    <span className="badge bg-danger ms-1">{discrepancies.length}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body p-0">
          <div className="tab-content p-3">

            {/* ITEMS TAB */}
            {activeTab === "items" && (
              <div>
                {loadingSub ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-clipboard fs-1 text-muted" />
                    <p className="text-muted mt-2 mb-3">{t("modules.opname.read.no_items")}</p>
                    {session.status === "draft" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAction("start")}
                        disabled={!!actionLoading}
                      >
                        <i className="bi bi-play-fill me-1" />
                        {t("modules.opname.read.action_start")}
                      </button>
                    )}
                    {session.status === "in_progress" && (
                      <Link
                        to={`/${moduleName}/${session.id}/count`}
                        className="btn btn-primary btn-sm"
                      >
                        <i className="bi bi-qr-code-scan me-1" />
                        {t("modules.opname.list.btn_count")}
                      </Link>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover table-sm align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Asset Code</th>
                            <th>Asset Name</th>
                            <th>Result</th>
                            <th>Counted At</th>
                            <th>Counter</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(items as OpnameItem[]).map((item) => (
                            <ItemRow key={item.id} item={item} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Pagination
                      count={itemsCount}
                      skip={itemsSkip}
                      limit={itemsLimit}
                      onPageChange={onItemsPageChange}
                    />
                  </>
                )}
              </div>
            )}

            {/* SUMMARY TAB */}
            {activeTab === "summary" && (
              <div>
                {loadingSub ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                  </div>
                ) : sm ? (
                  <div className="row g-3">
                    {[
                      { label: t("modules.opname.read.summary_total"), value: sm.total, bg: "#f3f4f6", icon: "bi-collection" },
                      { label: t("modules.opname.read.summary_counted"), value: sm.counted, bg: "#dbeafe", icon: "bi-check-circle" },
                      { label: t("modules.opname.read.summary_uncounted"), value: sm.uncounted, bg: "#fef3c7", icon: "bi-clock" },
                      { label: t("modules.opname.read.summary_match"), value: sm.match, bg: "#d1fae5", icon: "bi-check2-all" },
                      { label: t("modules.opname.read.summary_mismatch"), value: sm.mismatch, bg: "#fee2e2", icon: "bi-exclamation-triange" },
                      { label: t("modules.opname.read.summary_not_found"), value: sm.not_found, bg: "#fef3c7", icon: "bi-question-circle" },
                      { label: t("modules.opname.read.summary_extra"), value: sm.extra, bg: "#e0f2fe", icon: "bi-plus-circle" },
                    ].map((stat) => (
                      <div className="col-md-3" key={stat.label}>
                        <div className="card border-0" style={{ backgroundColor: stat.bg }}>
                          <div className="card-body text-center py-3">
                            <i className={`bi ${stat.icon} fs-4 mb-2 d-block`} style={{ color: "#6b7280" }} />
                            <div className="h2 fw-bold mb-0">{stat.value}</div>
                            <small className="text-muted">{stat.label}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-bar-chart fs-1" />
                    <p className="mt-2">{t("modules.opname.read.no_summary")}</p>
                  </div>
                )}
              </div>
            )}

            {/* DISCREPANCIES TAB */}
            {activeTab === "discrepancies" && (
              <div>
                {loadingSub ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                  </div>
                ) : discrepancies.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-check-circle fs-1 text-success" />
                    <p className="text-muted mt-2">{t("modules.opname.read.no_discrepancies")}</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover table-sm align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Asset Code</th>
                          <th>Asset Name</th>
                          <th>Issue</th>
                          <th>Expected</th>
                          <th>Counted</th>
                          <th>Notes</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(discrepancies as OpnameItem[]).map((item) => (
                          <tr key={item.id}>
                            <td className="fw-semibold">{item.asset?.asset_code ?? "—"}</td>
                            <td>{item.asset?.name ?? "—"}</td>
                            <td>
                              <span
                                className={`badge ${
                                  item.counted_status === "not_found"
                                    ? "bg-warning"
                                    : item.counted_status === "extra"
                                    ? "bg-info"
                                    : "bg-danger"
                                }`}
                              >
                                {item.counted_status === "not_found"
                                  ? t("modules.opname.read.issue_not_found")
                                  : item.counted_status === "extra"
                                  ? t("modules.opname.read.issue_extra")
                                  : t("modules.opname.read.issue_mismatch")}
                              </span>
                            </td>
                            <td>
                              <div className="small">
                                <div>{item.expected_status ?? "—"}</div>
                                <div className="text-muted">
                                  {item.expected_location?.name ?? "—"}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="small">
                                <div>
                                  {item.counted_status !== "not_found" &&
                                  item.counted_status !== "extra"
                                    ? item.counted_status
                                    : "—"}
                                </div>
                                <div className="text-muted">
                                  {item.counted_location?.name ?? "—"}
                                </div>
                              </div>
                            </td>
                            <td>{item.notes ? <small className="text-muted">{item.notes}</small> : "—"}</td>
                            <td>
                              {item.counted_status === "mismatch" && (
                                <button
                                  className="btn btn-outline-success btn-xs"
                                  onClick={async () => {
                                    try {
                                      await apiAxios.patch(`/opname/sessions/${session.id}/items/${item.id}/approve-adjustment`);
                                      enqueueSnackbar(
                                        t("modules.opname.read.notification.adjustment_approved"),
                                        { variant: "success" }
                                      );
                                      window.location.reload();
                                    } catch {
                                      enqueueSnackbar(
                                        t("modules.opname.read.notification.adjustment_failed"),
                                        { variant: "error" }
                                      );
                                    }
                                  }}
                                >
                                  {t("modules.opname.read.btn_approve_adjustment")}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadPage;
