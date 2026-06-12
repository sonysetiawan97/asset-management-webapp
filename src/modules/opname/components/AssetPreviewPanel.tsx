import { useMemo, useState, useRef, useEffect, type FC } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { useInfiniteQuery } from "@tanstack/react-query";
import { findAll } from "@services/findAll";
import { useTranslation } from "react-i18next";
import {
  STATUS_COLORS,
  type AssetStatus,
  type AssetCondition,
} from "@modules/assets/types/Model";

interface AssetPreviewItem {
  id: string;
  name: string;
  asset_code: string;
  asset_status: AssetStatus;
  condition: AssetCondition;
  serial_number: string;
  location_name?: string;
  department_name?: string;
  custodian_first_name?: string;
  custodian_last_name?: string;
}

interface AssetPreviewPage {
  result: AssetPreviewItem[];
  count: number;
  count_by_status?: Record<string, number>;
}

const PAGE_SIZE = 20;

const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  in_use: "In Use",
  under_maintenance: "Maintenance",
  reserved: "Reserved",
  lost: "Lost",
  pending_transfer: "Pending",
};

const CONDITION_LABELS: Record<string, string> = {
  new: "New",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

const AssetPreviewPanel: FC = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(
    null
  );
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const listWrapperRef = useRef<HTMLDivElement | null>(null);

  const departmentId = useWatch({ control, name: "department_id" }) as
    | string
    | null
    | undefined;
  const locationId = useWatch({ control, name: "location_id" }) as
    | string
    | null
    | undefined;

  const hasFilter = Boolean(departmentId || locationId);

  const baseParams = useMemo(() => {
    const params: Record<string, unknown> = {
      "asset_status!nin": "disposed",
    };
    if (departmentId) params.department_id = departmentId;
    if (locationId) params.location_id = locationId;
    return params;
  }, [departmentId, locationId]);

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery<AssetPreviewPage>({
    queryKey: ["opname-asset-preview", departmentId, locationId],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await findAll<AssetPreviewItem>("assets", {
        ...baseParams,
        "!skip": pageParam,
        "!limit": PAGE_SIZE,
      });
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce(
        (sum, page) => sum + page.result.length,
        0
      );
      return loadedCount < lastPage.count ? loadedCount : undefined;
    },
    enabled: hasFilter,
    staleTime: 30_000,
  });

  const allAssets = useMemo(() => {
    return data?.pages.flatMap((page) => page.result) ?? [];
  }, [data?.pages]);

  const totalCount = data?.pages[0]?.count ?? 0;

  const statusCounts = useMemo(() => {
    const counts = data?.pages[0]?.count_by_status;
    if (!counts) return [];
    return Object.entries(counts)
      .filter(
        ([key, count]) => count > 0 && key !== "all" && key !== "disposed"
      )
      .sort((a, b) => b[1] - a[1]);
  }, [data?.pages]);

  const filteredAssets = useMemo(() => {
    if (!activeStatusFilter) return allAssets;
    return allAssets.filter((a) => a.asset_status === activeStatusFilter);
  }, [allAssets, activeStatusFilter]);

  const handleChipClick = (status: string | null) => {
    setActiveStatusFilter((prev) => (prev === status ? null : status));
  };

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const el = loadMoreRef.current;
    const scrollContainer = listWrapperRef.current;
    if (!el || !scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { root: scrollContainer, rootMargin: "100px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!hasFilter) {
    return (
      <div className="opname-preview opname-preview--empty-state">
        <div className="opname-preview__empty">
          <div className="opname-preview__empty-icon">
            <i className="bi bi-box-seam"></i>
          </div>
          <div className="opname-preview__empty-text">
            <span className="opname-preview__empty-title">
              {t("modules.opname.preview.empty_title")}
            </span>
            <span className="opname-preview__empty-desc">
              {t("modules.opname.preview.empty_desc")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="opname-preview">
      {/* Header */}
      <div className="opname-preview__header">
        <div className="opname-preview__header-left">
          <div className="opname-preview__header-icon">
            <i className="bi bi-box-seam"></i>
          </div>
          <div className="opname-preview__header-info">
            <span className="opname-preview__header-title">
              {t("modules.opname.preview.title")}
            </span>
            <span className="opname-preview__header-count">
              {isLoading ? (
                <span className="opname-preview__skeleton-inline" />
              ) : (
                t("modules.opname.preview.count", { count: totalCount })
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Status Breakdown Chips */}
      {!isLoading && statusCounts.length > 0 && (
        <div className="opname-preview__status-bar">
          <div
            className={`opname-preview__status-chip ${
              !activeStatusFilter ? "opname-preview__status-chip--active" : ""
            }`}
            onClick={() => handleChipClick(null)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleChipClick(null);
            }}
          >
            <span className="opname-preview__status-label">
              {t("modules.opname.preview.all")}
            </span>
            <span className="opname-preview__status-count">{totalCount}</span>
          </div>

          {statusCounts.map(([status, count]) => {
            const colors = STATUS_COLORS[status as AssetStatus];
            const isActive = activeStatusFilter === status;
            return (
              <div
                key={status}
                className={`opname-preview__status-chip ${
                  isActive ? "opname-preview__status-chip--active" : ""
                }`}
                style={
                  {
                    "--chip-bg": colors?.bg,
                    "--chip-text": colors?.text,
                    "--chip-dot": colors?.dot,
                  } as React.CSSProperties
                }
                onClick={() => handleChipClick(status)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleChipClick(status);
                }}
              >
                <span
                  className="opname-preview__status-dot"
                  style={{ background: colors?.dot }}
                />
                <span className="opname-preview__status-label">
                  {STATUS_LABELS[status] ?? status}
                </span>
                <span className="opname-preview__status-count">{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Asset List */}
      <div ref={listWrapperRef} className="opname-preview__list-wrapper">
        {isLoading ? (
          <div className="opname-preview__skeleton-list">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="opname-preview__skeleton-row">
                <div className="opname-preview__skeleton-badge" />
                <div className="opname-preview__skeleton-lines">
                  <div className="opname-preview__skeleton-line opname-preview__skeleton-line--lg" />
                  <div className="opname-preview__skeleton-line opname-preview__skeleton-line--sm" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="opname-preview__no-results">
            <i className="bi bi-inbox"></i>
            <span>{t("modules.opname.preview.no_assets")}</span>
          </div>
        ) : (
          <div className="opname-preview__list">
            {filteredAssets.map((asset, index) => {
              const statusColor =
                STATUS_COLORS[asset.asset_status] ?? STATUS_COLORS.available;
              return (
                <div
                  key={asset.id}
                  className="opname-preview__item"
                  style={
                    {
                      animationDelay: `${Math.min(index * 30, 300)}ms`,
                    } as React.CSSProperties
                  }
                >
                  <div className="opname-preview__item-left">
                    <div
                      className="opname-preview__item-status-dot"
                      style={{ background: statusColor.dot }}
                    />
                    <div className="opname-preview__item-info">
                      <span className="opname-preview__item-name">
                        {asset.name}
                      </span>
                      <span className="opname-preview__item-code">
                        {asset.asset_code}
                        {asset.serial_number
                          ? ` · ${asset.serial_number}`
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="opname-preview__item-right">
                    <span
                      className="opname-preview__item-badge"
                      style={{
                        background: statusColor.bg,
                        color: statusColor.text,
                      }}
                    >
                      {STATUS_LABELS[asset.asset_status] ?? asset.asset_status}
                    </span>
                    <span className="opname-preview__item-condition">
                      {CONDITION_LABELS[asset.condition] ?? asset.condition}
                    </span>
                    {asset.location_name && (
                      <span className="opname-preview__item-meta">
                        <i className="bi bi-geo-alt"></i>
                        {asset.location_name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="opname-preview__load-more" />

            {isFetchingNextPage && (
              <div className="opname-preview__loading-more">
                <div className="opname-preview__spinner" />
                <span>{t("modules.opname.preview.loading_more")}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { AssetPreviewPanel };
