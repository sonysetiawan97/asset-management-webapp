import { useState, useCallback, type FC } from "react";
import ListPage from "./ListPage";
import { type AssetLookupResult } from "@modules/scan/types/Model";
import { apiAxios } from "@/utils/apiAxios";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ListWrapper: FC = () => {
  const { t } = useTranslation();
  const [scannedAsset, setScannedAsset] = useState<AssetLookupResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: t("modules.scan.list.breadcrumb"), path: "/scan" },
    ]);
  }, [t]);

  const lookupAsset = useCallback(async (assetCode: string) => {
    setScanError(null);
    setCameraError(null);

    if (!assetCode.trim()) return;

    setIsLookingUp(true);
    try {
      const { data } = await apiAxios.get("/api/v1/assets/lookup", {
        params: { asset_code: assetCode },
      });

      if (data.status && data.data) {
        setScannedAsset(data.data);
      } else {
        setScanError(data.message || t("modules.scan.list.error_not_found"));
      }
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string } } };
      if (error.response?.status === 404) {
        setScanError(t("modules.scan.list.error_not_found"));
      } else {
        setScanError(
          error.response?.data?.message ||
          t("modules.scan.list.error_generic")
        );
      }
    } finally {
      setIsLookingUp(false);
    }
  }, [t]);

  const startScan = useCallback(async () => {
    setScanError(null);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      stream.getTracks().forEach((track) => track.stop());
      setIsScanning(true);
    } catch {
      setCameraError(t("modules.scan.list.camera_permission_denied"));
      setIsScanning(false);
    }
  }, [t]);

  const stopScan = useCallback(() => {
    setIsScanning(false);
  }, []);

  return (
    <ListPage
      scannedAsset={scannedAsset}
      scanError={scanError}
      isScanning={isScanning}
      onStartScan={startScan}
      onStopScan={stopScan}
      onManualLookup={lookupAsset}
      isLookingUp={isLookingUp}
      cameraError={cameraError}
    />
  );
};

export default ListWrapper;
