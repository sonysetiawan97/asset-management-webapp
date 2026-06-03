import { useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { moduleName, type OpnameItem, type OpnameSession } from "../../types/Model";

interface CountPageProps {
  session: OpnameSession;
  items: OpnameItem[];
  pendingItems: OpnameItem[];
  countedItems: OpnameItem[];
  scannedAsset: OpnameItem | null;
  scanError: string | null;
  isScanning: boolean;
  submittingId: string | null;
  loadingItems: boolean;
  onStartScan: () => void;
  onStopScan: () => void;
  onManualLookup: (code: string) => void;
  onCount: (itemId: string, countedStatus: string, countedLocationId?: string, countedCondition?: string, notes?: string) => Promise<void>;
  onClearScanned: () => void;
  onRefresh: () => void;
}

const COUNT_STATUSES = [
  { value: "match", labelKey: "modules.opname.count.status_match", color: "#d1fae5", text: "#065f46" },
  { value: "mismatch", labelKey: "modules.opname.count.status_mismatch", color: "#fee2e2", text: "#991b1b" },
  { value: "not_found", labelKey: "modules.opname.count.status_not_found", color: "#fef3c7", text: "#92400e" },
  { value: "extra", labelKey: "modules.opname.count.status_extra", color: "#e0f2fe", text: "#075985" },
];

const CONDITIONS = ["new", "good", "fair", "poor"] as const;

interface CountFormProps {
  item: OpnameItem;
  submittingId: string | null;
  onCount: (itemId: string, countedStatus: string, countedLocationId?: string, countedCondition?: string, notes?: string) => Promise<void>;
  onCancel: () => void;
}

const CountForm: FC<CountFormProps> = ({ item, submittingId, onCount, onCancel }) => {
  const { t } = useTranslation();
  const [countedStatus, setCountedStatus] = useState<string>("match");
  const [countedLocationId, setCountedLocationId] = useState<string>(item.expected_location_id ? String(item.expected_location_id) : "");
  const [countedCondition, setCountedCondition] = useState<string>(item.expected_condition ?? "good");
  const [notes, setNotes] = useState("");

  return (
    <div className="card border-primary shadow-sm">
      <div className="card-header bg-primary text-white py-2 d-flex align-items-center justify-content-between">
        <div>
          <strong>{item.asset?.asset_code ?? "—"}</strong>
          <span className="ms-2 text-white-50">{item.asset?.name ?? "—"}</span>
        </div>
        <button className="btn btn-sm btn-outline-light" onClick={onCancel} type="button">
          <i className="bi bi-x-lg" />
        </button>
      </div>
      <div className="card-body py-3">
        <div className="row g-2 mb-3">
          <div className="col-4">
            <label className="form-label small fw-semibold">{t("modules.opname.count.expected_status")}</label>
            <div className="p-2 bg-light rounded">
              <span className="badge bg-secondary">{item.expected_status ?? "—"}</span>
            </div>
          </div>
          <div className="col-4">
            <label className="form-label small fw-semibold">{t("modules.opname.count.expected_location")}</label>
            <div className="p-2 bg-light rounded text-truncate">
              <small>{item.expected_location?.name ?? "—"}</small>
            </div>
          </div>
          <div className="col-4">
            <label className="form-label small fw-semibold">{t("modules.opname.count.expected_condition")}</label>
            <div className="p-2 bg-light rounded">
              <span className="badge bg-secondary">{item.expected_condition ?? "—"}</span>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">{t("modules.opname.count.label_result")} *</label>
          <div className="d-flex gap-2 flex-wrap">
            {COUNT_STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                className={`btn btn-sm ${countedStatus === s.value ? "text-white" : "btn-outline"}`}
                style={countedStatus === s.value ? { backgroundColor: s.color, color: s.text, borderColor: s.color } : {}}
                onClick={() => setCountedStatus(s.value)}
              >
                {t(s.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {countedStatus === "not_found" ? (
          <div className="alert alert-warning py-2 mb-3 small">
            <i className="bi bi-exclamation-triangle me-1" />
            {t("modules.opname.count.hint_not_found")}
          </div>
        ) : countedStatus === "extra" ? (
          <div className="mb-3">
            <label className="form-label fw-semibold">{t("modules.opname.count.counted_location")}</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder={t("modules.opname.count.counted_location_placeholder")}
              value={countedLocationId}
              onChange={(e) => setCountedLocationId(e.target.value)}
            />
          </div>
        ) : (
          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">{t("modules.opname.count.counted_location")}</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder={t("modules.opname.count.counted_location_placeholder")}
                value={countedLocationId}
                onChange={(e) => setCountedLocationId(e.target.value)}
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">{t("modules.opname.count.counted_condition")}</label>
              <select
                className="form-select form-select-sm"
                value={countedCondition}
                onChange={(e) => setCountedCondition(e.target.value)}
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{t(`modules.assets.condition.${c}`)}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {countedStatus === "mismatch" && (
          <div className="mb-3">
            <label className="form-label small fw-semibold">{t("modules.opname.count.label_notes")}</label>
            <textarea
              className="form-control form-control-sm"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("modules.opname.count.notes_placeholder")}
            />
          </div>
        )}

        <div className="d-flex gap-2 justify-content-end">
          <button className="btn btn-outline-secondary btn-sm" onClick={onCancel} type="button">
            {t("button.cancel")}
          </button>
          <button
            className="btn btn-primary btn-sm"
            disabled={submittingId === String(item.id)}
            onClick={() => onCount(String(item.id), countedStatus, countedLocationId || undefined, countedCondition || undefined, notes || undefined)}
          >
            {submittingId === String(item.id) ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              <i className="bi bi-check2 me-1" />
            )}
            {t("modules.opname.count.btn_confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export const Count: FC<CountPageProps> = ({
  session,
  items,
  pendingItems,
  countedItems,
  scannedAsset,
  scanError,
  isScanning,
  submittingId,
  loadingItems,
  onStartScan,
  onStopScan,
  onManualLookup,
  onCount,
  onClearScanned,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const [manualCode, setManualCode] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "counted">("pending");
  const scanContainerId = "count-scan-reader";

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onManualLookup(manualCode.trim());
      setManualCode("");
    }
  };

  const progressPct = session.total_items > 0
    ? Math.round((session.counted_items / session.total_items) * 100)
    : 0;

  const displayedItems = activeFilter === "pending"
    ? pendingItems
    : activeFilter === "counted"
    ? countedItems
    : items;

  return (
    <div className="module-list-container">
      {/* Header */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body py-2">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <h5 className="mb-0 fw-bold">{t("modules.opname.count.title_short")}</h5>
              <small className="text-muted">{session.name}</small>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="text-end">
                <div className="fw-bold">{session.counted_items ?? 0} / {session.total_items ?? 0}</div>
                <div className="progress mt-1" style={{ width: 140, height: 6 }}>
                  <div className="progress-bar bg-success" style={{ width: `${progressPct}%` }} />
                </div>
                <small className="text-muted">{progressPct}%</small>
              </div>
              <div className="d-flex gap-2">
                <Link to={`/${moduleName}/${session.id}`} className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-arrow-left me-1" />
                  {t("button.back")}
                </Link>
                <button className="btn btn-outline-secondary btn-sm" onClick={onRefresh} type="button">
                  <i className="bi bi-arrow-clockwise" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* LEFT: Scanner */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header py-2">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-qr-code-scan me-1" />
                {t("modules.opname.count.scanner_title")}
              </h6>
            </div>
            <div className="card-body p-2">
              {isScanning ? (
                <div className="text-center">
                  <div id={scanContainerId} style={{ maxWidth: 280, margin: "0 auto" }} />
                  <button
                    className="btn btn-sm btn-outline-danger mt-2"
                    onClick={onStopScan}
                    type="button"
                  >
                    <i className="bi bi-stop-fill me-1" />
                    {t("modules.opname.count.btn_stop_scan")}
                  </button>
                </div>
              ) : (
                <div className="text-center py-3">
                  <div
                    id={scanContainerId}
                    style={{
                      width: 240,
                      height: 240,
                      margin: "0 auto",
                      border: "2px dashed #dee2e6",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <small className="text-muted">
                      <i className="bi bi-camera-fill fs-3 d-block mb-1" />
                      {t("modules.opname.count.scanner_placeholder")}
                    </small>
                  </div>
                  <button
                    className="btn btn-primary btn-sm mt-2 w-100"
                    onClick={onStartScan}
                    type="button"
                  >
                    <i className="bi bi-camera-fill me-1" />
                    {t("modules.opname.count.btn_start_scan")}
                  </button>
                </div>
              )}

              {scanError && (
                <div className="alert alert-danger py-2 small mt-2 mb-0">
                  <i className="bi bi-exclamation-circle me-1" />
                  {scanError}
                </div>
              )}

              <hr className="my-2" />

              <form onSubmit={handleManualSubmit}>
                <label className="form-label small fw-semibold">
                  {t("modules.opname.count.manual_code")}
                </label>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("modules.opname.count.manual_code_placeholder")}
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                  />
                  <button className="btn btn-outline-secondary" type="submit">
                    <i className="bi bi-search" />
                  </button>
                </div>
              </form>

              {scannedAsset && (
                <div className="mt-3">
                  <CountForm
                    item={scannedAsset}
                    submittingId={submittingId}
                    onCount={onCount}
                    onCancel={onClearScanned}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Items list */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header py-2 d-flex align-items-center justify-content-between">
              <h6 className="mb-0 fw-semibold">
                {t("modules.opname.count.items_title")}
              </h6>
              <div className="btn-group btn-group-sm">
                {([
                  { key: "pending", label: t("modules.opname.count.filter_pending") },
                  { key: "counted", label: t("modules.opname.count.filter_counted") },
                  { key: "all", label: t("modules.opname.count.filter_all") },
                ] as const).map((f) => (
                  <button
                    key={f.key}
                    className={`btn ${activeFilter === f.key ? "btn-primary" : "btn-outline-secondary"} btn-sm`}
                    onClick={() => setActiveFilter(f.key)}
                    type="button"
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-body p-0" style={{ maxHeight: 520, overflowY: "auto" }}>
              {loadingItems ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : displayedItems.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-clipboard fs-1" />
                  <p className="mt-2 mb-0">
                    {activeFilter === "pending"
                      ? t("modules.opname.count.no_pending")
                      : activeFilter === "counted"
                      ? t("modules.opname.count.no_counted")
                      : t("modules.opname.count.no_items")}
                  </p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {displayedItems.map((item) => {
                    const isCounted = !!item.counted_status;
                    const statusColor = isCounted
                      ? COUNT_STATUSES.find((s) => s.value === item.counted_status)
                      : null;

                    return (
                      <div key={item.id} className="list-group-item d-flex align-items-center py-2 px-3">
                        <div className="flex-grow-1 min-w-0">
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-semibold text-truncate">{item.asset?.asset_code ?? "—"}</span>
                            <span className="text-muted text-truncate">{item.asset?.name ?? "—"}</span>
                          </div>
                          <div className="small text-muted">
                            {item.expected_location?.name ?? "—"}
                          </div>
                        </div>
                        {isCounted ? (
                          <span
                            className="badge flex-shrink-0"
                            style={{ backgroundColor: statusColor?.color, color: statusColor?.text }}
                          >
                            {statusColor ? t(statusColor.labelKey) : item.counted_status}
                          </span>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-primary flex-shrink-0"
                            onClick={() => onManualLookup(item.asset?.asset_code ?? "")}
                            disabled={!!scannedAsset}
                            type="button"
                          >
                            <i className="bi bi-qr-code-scan" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Count;