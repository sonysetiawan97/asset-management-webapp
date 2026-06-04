import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useTranslation } from "react-i18next";

interface QRCodeSectionProps {
  assetCode: string;
  assetName: string;
}

export const QRCodeSection = ({ assetCode, assetName }: QRCodeSectionProps) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Generate QR code data: asset_code only (not a URL).
  // This way the scanner receives the code directly and can look it up.
  const qrData = assetCode;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        qrData,
        {
          width: 200,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error("QR Code generation error:", error);
        }
      );

      // Also generate data URL for download
      QRCode.toDataURL(qrData, { width: 400, margin: 2 })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Data URL error:", err));
    }
  }, [qrData]);

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qr-${assetCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card mt-3">
      <div className="card-header bg-light">
        <h6 className="mb-0">{t("modules.assets.qr.title")}</h6>
      </div>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-4 text-center">
            <canvas ref={canvasRef} />
          </div>
          <div className="col-md-8">
            <p className="mb-2">
              <strong>{t("modules.assets.qr.asset_code")}:</strong> {assetCode}
            </p>
            <p className="mb-2">
              <strong>{t("modules.assets.qr.asset_name")}:</strong> {assetName}
            </p>
            <p className="mb-3 text-muted small">{t("modules.assets.qr.description")}</p>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleDownload} disabled={!qrDataUrl}>
              <i className="bi bi-download me-1"></i>
              {t("modules.assets.qr.download")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
