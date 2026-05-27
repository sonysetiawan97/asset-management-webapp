import { Link } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { useRef, useCallback, useEffect, type FC } from "react";
import { useTranslation } from "react-i18next";
import { type AssetLookupResult } from "@modules/scan/types/Model";
import { ASSET_STATUSES } from "@modules/assets/types/Model";

interface ListPageProps {
  scannedAsset: AssetLookupResult | null;
  scanError: string | null;
  isScanning: boolean;
  onStartScan: () => void;
  onStopScan: () => void;
  onManualLookup: (code: string) => void;
  isLookingUp: boolean;
  cameraError: string | null;
}

const ListPage: FC<ListPageProps> = ({
  scannedAsset,
  scanError,
  isScanning,
  onStartScan,
  onStopScan,
  onManualLookup,
  isLookingUp,
  cameraError,
}) => {
  const { t } = useTranslation();
  const scannerContainerId = "scan-reader";
  const html5QrRef = useRef<Html5Qrcode | null>(null);

  const getStatusLabel = (status: string) => {
    const found = ASSET_STATUSES.find((s) => s.value === status);
    return found ? t(`modules.assets.status.${found.label.toLowerCase().replace(" ", "_")}`) : status;
  };

  const getStatusClass = (status: string) => {
    const found = ASSET_STATUSES.find((s) => s.value === status);
    return found ? found.className : "";
  };

  const triggerFeedback = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1200;
      gain.gain.value = 0.15;
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio not supported
    }
    if (navigator.vibrate) navigator.vibrate(100);
  };

  const startCamera = useCallback(() => {
    const el = document.getElementById(scannerContainerId);
    if (!el) return;

    el.textContent = "";
    const scanner = new Html5Qrcode(scannerContainerId);
    html5QrRef.current = scanner;

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      (decodedText: string) => {
        triggerFeedback();
        scanner.stop().then(() => {
          html5QrRef.current = null;
          onManualLookup(decodedText);
        });
      },
      () => {}
    ).catch((err: unknown) => {
      console.error("Scanner error:", err);
    });
  }, [onManualLookup]);

  const stopCamera = useCallback(() => {
    if (html5QrRef.current) {
      html5QrRef.current.stop().catch(() => {});
      html5QrRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(startCamera, 80);
      return () => clearTimeout(timer);
    } else {
      stopCamera();
    }
  }, [isScanning, startCamera, stopCamera]);

  useEffect(() => {
    return () => {
      if (html5QrRef.current) {
        html5QrRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleStopScan = () => {
    stopCamera();
    onStopScan();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || isNaN(value)) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="module-scan-container">
      <div className="row g-4">
        {/* Scanner Panel */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">
                <i className="bi bi-qr-code-scan me-2" />
                {t("modules.scan.list.scanner_title")}
              </h5>
              {isScanning ? (
                <button className="btn btn-sm btn-danger" onClick={handleStopScan}>
                  <i className="bi bi-stop-fill me-1" />
                  {t("modules.scan.list.stop_scan")}
                </button>
              ) : (
                <button className="btn btn-sm btn-primary" onClick={onStartScan}>
                  <i className="bi bi-camera-fill me-1" />
                  {t("modules.scan.list.start_scan")}
                </button>
              )}
            </div>

            <div className="card-body text-center">
              {cameraError && (
                <div className="alert alert-warning py-2 small mb-3">
                  <i className="bi bi-exclamation-triangle me-1" />
                  {cameraError}
                </div>
              )}

              <div className="scanner-viewport mx-auto mb-3">
                <div id={scannerContainerId} />
                {isScanning && (
                  <div className="scanner-overlay">
                    <div className="scanner-line" />
                  </div>
                )}
                {!isScanning && !cameraError && (
                  <div className="scanner-placeholder d-flex align-items-center justify-content-center">
                    <div className="text-muted">
                      <i className="bi bi-qr-code" style={{ fontSize: "4rem" }} />
                      <p className="mt-2 mb-0 small">
                        {t("modules.scan.list.scanner_placeholder")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {isScanning && (
                <div className="mb-2">
                  <span className="badge bg-success">
                    <span className="spinner-border spinner-border-sm me-1" />
                    {t("modules.scan.list.scanning")}
                  </span>
                </div>
              )}

              {scanError && (
                <div className="alert alert-danger py-2 small mb-0">
                  {scanError}
                </div>
              )}

              <div className="manual-input-section mt-3 pt-3 border-top">
                <p className="text-muted small mb-2">
                  {t("modules.scan.list.manual_fallback")}
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <input
                    type="text"
                    id="manual-code-input"
                    className="form-control form-control-sm"
                    placeholder={t("modules.scan.list.manual_placeholder")}
                    style={{ maxWidth: "220px" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const input = e.currentTarget as HTMLInputElement;
                        if (input.value.trim()) {
                          onManualLookup(input.value.trim());
                          input.value = "";
                        }
                      }
                    }}
                  />
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      const input = document.getElementById("manual-code-input") as HTMLInputElement;
                      if (input?.value.trim()) {
                        onManualLookup(input.value.trim());
                        input.value = "";
                      }
                    }}
                  >
                    {isLookingUp ? (
                      <span className="spinner-border spinner-border-sm" role="status" />
                    ) : (
                      <>
                        <i className="bi bi-search me-1" />
                        {t("modules.scan.list.lookup")}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Result Panel */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2" />
                {t("modules.scan.list.result_title")}
              </h5>
            </div>
            <div className="card-body">
              {scannedAsset ? (
                <div className="asset-result">
                  <div className="mb-3">
                    <span className={`badge ${getStatusClass(scannedAsset.asset_status)}`}>
                      {getStatusLabel(scannedAsset.asset_status)}
                    </span>
                    <span className="badge bg-secondary ms-2 text-uppercase">
                      {scannedAsset.condition}
                    </span>
                  </div>

                  <h4 className="mb-1">{scannedAsset.name}</h4>
                  <p className="text-muted small mb-3">
                    {t("modules.scan.list.label_asset_code")}:{" "}
                    <strong>{scannedAsset.asset_code}</strong>
                  </p>

                  <div className="table-responsive">
                    <table className="table table-sm table-borderless asset-detail-table">
                      <tbody>
                        {[
                          [t("modules.scan.list.label_serial"), scannedAsset.serial_number || "—"],
                          [t("modules.scan.list.label_category"), scannedAsset.category_name || "—"],
                          [t("modules.scan.list.label_location"), scannedAsset.location_name || "—"],
                          [t("modules.scan.list.label_department"), scannedAsset.department_name || "—"],
                          [t("modules.scan.list.label_custodian"), scannedAsset.custodian_name || "—"],
                          [t("modules.scan.list.label_purchase_date"), formatDate(scannedAsset.purchase_date)],
                          [t("modules.scan.list.label_purchase_price"), formatCurrency(scannedAsset.purchase_price)],
                          [t("modules.scan.list.label_notes"), scannedAsset.notes || "—"],
                        ].map(([label, value], i) => (
                          <tr key={i}>
                            <th scope="row" style={{ width: "40%" }}>{label}</th>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <Link
                      to={`/assets/${scannedAsset.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      <i className="bi bi-eye me-1" />
                      {t("modules.scan.list.view_asset")}
                    </Link>
                    <Link
                      to={`/assets/${scannedAsset.id}/update`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      <i className="bi bi-pencil me-1" />
                      {t("modules.scan.list.edit_asset")}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-upc-scan" style={{ fontSize: "3.5rem" }} />
                  <p className="mt-3 mb-0">{t("modules.scan.list.result_empty")}</p>
                  <p className="small">{t("modules.scan.list.result_empty_hint")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {scannedAsset && (
        <div className="text-center mt-4">
          <button className="btn btn-outline-primary" onClick={onStartScan}>
            <i className="bi bi-qr-code-scan me-1" />
            {t("modules.scan.list.scan_again")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ListPage;