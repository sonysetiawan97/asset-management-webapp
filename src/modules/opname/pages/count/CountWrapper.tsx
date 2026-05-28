import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import { Count } from "./CountPage";
import { useFindOneById as useFindById } from "@hooks/request/useFindOneById";
import { apiAxios } from "@utils/apiAxios";
import { enqueueSnackbar } from "notistack";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useTranslation } from "react-i18next";
import { type OpnameSession, type OpnameItem } from "../../types/Model";
import { LoadingPage } from "@components/loadings/LoadingPage";
import { Html5Qrcode } from "html5-qrcode";

export const CountWrapper: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [items, setItems] = useState<OpnameItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [scannedAsset, setScannedAsset] = useState<OpnameItem | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const html5QrRef = useRef<Html5Qrcode | null>(null);
  const scanContainerId = "count-scan-reader";

  const { data: session, isLoading } = useFindById<OpnameSession>("opname/sessions", id!);

  const triggerFeedback = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1400;
      gain.gain.value = 0.12;
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch { /* audio not supported */ }
    if (navigator.vibrate) navigator.vibrate(80);
  }, []);

  const loadItems = useCallback(async () => {
    if (!id) return;
    setLoadingItems(true);
    try {
      const res = await apiAxios.get(`/opname/sessions/${id}/items`);
      setItems(res.data.data.result ?? []);
    } catch {
      enqueueSnackbar(t("modules.opname.count.error_loading_items"), { variant: "error" });
    } finally {
      setLoadingItems(false);
    }
  }, [id, t]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: t("modules.opname.list.title"), path: "/opname/sessions" },
      { label: session?.name ?? id ?? "", path: `/opname/sessions/${id}` },
      { label: t("modules.opname.count.title_short"), path: "" },
    ]);
  }, [t, session, id]);

  const handleStartScan = useCallback(() => {
    setScanError(null);
    const el = document.getElementById(scanContainerId);
    if (!el) return;

    el.textContent = "";
    const scanner = new Html5Qrcode(scanContainerId);
    html5QrRef.current = scanner;

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      (decodedText: string) => {
        triggerFeedback();
        scanner.stop().then(() => {
          html5QrRef.current = null;
          setTimeout(() => {
            setIsScanning(false);
            handleManualLookup(decodedText);
          }, 150);
        }).catch(() => { /* ignore */ });
      },
      () => { /* ignore */ }
    ).then(() => {
      setIsScanning(true);
    }).catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : "Camera error";
      setScanError(msg);
      setIsScanning(false);
    });
  }, [triggerFeedback]);

  const handleStopScan = useCallback(() => {
    if (html5QrRef.current) {
      html5QrRef.current.stop().then(() => {
        html5QrRef.current = null;
        setIsScanning(false);
      }).catch(() => { /* ignore */ });
    }
  }, []);

  const handleManualLookup = useCallback(async (assetCode: string) => {
    const trimmed = assetCode.trim();
    if (!trimmed) return;

    // Find item by asset code in the session items
    const found = items.find(
      (item) =>
        item.asset?.asset_code?.toLowerCase() === trimmed.toLowerCase() &&
        !item.counted_status
    );

    if (found) {
      setScannedAsset(found);
      setScanError(null);
    } else {
      // Try API lookup
      try {
        const res = await apiAxios.get(`/assets/lookup?asset_code=${encodeURIComponent(trimmed)}`);
        const assetId = res.data.data?.id;
        const item = items.find((i) => String(i.asset_id) === String(assetId));
        if (item) {
          if (item.counted_status) {
            setScanError(t("modules.opname.count.error_already_counted"));
          } else {
            setScannedAsset(item);
            setScanError(null);
          }
        } else {
          setScanError(t("modules.opname.count.error_not_in_session"));
        }
      } catch {
        setScanError(t("modules.opname.count.error_asset_not_found"));
      }
    }
  }, [items, t]);

  const handleCount = async (itemId: string, countedStatus: string, countedLocationId?: string, countedCondition?: string, notes?: string) => {
    if (!id) return;
    setSubmittingId(itemId);
    try {
      await apiAxios.patch(`/opname/sessions/${id}/items/${itemId}/count`, {
        counted_status: countedStatus,
        counted_location_id: countedLocationId,
        counted_condition: countedCondition,
        notes,
      });
      setScannedAsset(null);
      await loadItems();
      enqueueSnackbar(t("modules.opname.count.notification.success"), { variant: "success" });
    } catch {
      enqueueSnackbar(t("modules.opname.count.notification.error"), { variant: "error" });
    } finally {
      setSubmittingId(null);
    }
  };

  if (isLoading) return <LoadingPage />;
  if (!session) return <div className="p-4">Session not found</div>;

  const pendingItems = items.filter((i) => !i.counted_status);
  const countedItems = items.filter((i) => !!i.counted_status);

  return (
    <Count
      session={session}
      items={items}
      pendingItems={pendingItems}
      countedItems={countedItems}
      scannedAsset={scannedAsset}
      scanError={scanError}
      isScanning={isScanning}
      submittingId={submittingId}
      loadingItems={loadingItems}
      onStartScan={handleStartScan}
      onStopScan={handleStopScan}
      onManualLookup={handleManualLookup}
      onCount={handleCount}
      onClearScanned={() => setScannedAsset(null)}
      onRefresh={loadItems}
    />
  );
};

export default CountWrapper;