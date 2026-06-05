import { type FC, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "@/utils/apiAxios";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { enqueueSnackbar } from "notistack";

import AssetStatusPie from "./charts/AssetStatusPie";
import MaintenanceTypeBar from "./charts/MaintenanceTypeBar";
import ActivityTrend from "./charts/ActivityTrend";

interface MaintenanceTypeItem {
  type: string;
  open: number;
  completed: number;
  total: number;
}

interface TrendItem {
  month: string;
  count: number;
}

interface DashboardData {
  stats: {
    total_assets: number;
    total_categories: number;
    total_locations: number;
    total_departments: number;
    total_users: number;
    active_checkouts: number;
    overdue_checkouts: number;
    pending_approvals: {
      transfers: number;
      maintenance: number;
    };
  };
  assets_by_status: Record<string, number>;
  maintenance_by_type: MaintenanceTypeItem[];
  activity_trend: TrendItem[];
}

type RangeVal = 7 | 30 | 90;

const fmtNumber = (v?: number) =>
  v === undefined || !isFinite(v) ? "—" : v.toLocaleString("en-US");

/* ─── Count-up hook ─── */
function useCountUp(target: number, duration = 1000): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (target <= 0) { setValue(target); return; }
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return value;
}

/* ─── Stat Card ─── */
interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  accent: string;
  delay: number;
}

const StatCard: FC<StatCardProps> = ({ icon, label, value, accent, delay }) => {
  const counted = useCountUp(value);
  return (
    <div
      className="dash-stat"
      style={{ "--d-delay": `${delay}ms`, "--d-accent": accent } as React.CSSProperties}
    >
      <div className="dash-stat__icon"><i className={icon} /></div>
      <div className="dash-stat__body">
        <span className="dash-stat__value">{fmtNumber(counted)}</span>
        <span className="dash-stat__label">{label}</span>
      </div>
      <div className="dash-stat__bar" />
    </div>
  );
};

/* ─── Main Dashboard ─── */
const Dashboard: FC = () => {
  const [range, setRange] = useState<RangeVal>(30);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const { data: raw, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["dashboard", range],
    queryFn: async () => {
      const res = await apiAxios.get<{ status: boolean; data: DashboardData }>(`/dashboard?range=${range}`);
      return res.data.data;
    },
    refetchInterval: 60_000,
  });

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Dashboard" }]);
  }, []);

  useEffect(() => {
    if (error) enqueueSnackbar("Failed to load dashboard data", { variant: "error" });
  }, [error]);

  useEffect(() => {
    if (raw) setLastUpdated(new Date().toLocaleTimeString());
  }, [raw]);

  if (isLoading) return <ContentLoader />;

  const stats = raw?.stats;
  const aByStatus = raw?.assets_by_status ?? {};
  const totalAssets = stats?.total_assets ?? 0;

  return (
    <div className="dash">
      {/* ── Header ── */}
      <div className="dash-hd">
        <h2 className="dash-hd-title">Dashboard</h2>
        <div className="dash-hd-right">
          <div className="dash-range">
            {([7, 30, 90] as RangeVal[]).map((v) => (
              <button
                key={v}
                type="button"
                className={`dash-range-btn${range === v ? " is-active" : ""}`}
                onClick={() => setRange(v)}
              >
                {v}d
              </button>
            ))}
          </div>
          {lastUpdated && <span className="dash-updated">{lastUpdated}</span>}
          <button
            type="button"
            className="dash-refresh"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <i className={`bi bi-arrow-clockwise${isRefetching ? " dash-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div className="dash-stats">
        <StatCard icon="bi-box-seam" label="Total Assets" value={totalAssets} accent="#f59e0b" delay={50} />
        <StatCard icon="bi-person-check" label="In Use" value={aByStatus.in_use ?? 0} accent="#3b82f6" delay={120} />
        <StatCard icon="bi-check-circle" label="Available" value={aByStatus.available ?? 0} accent="#10b981" delay={190} />
        <StatCard icon="bi-tools" label="Maintenance" value={aByStatus.under_maintenance ?? 0} accent="#ef4444" delay={260} />
      </div>

      {/* ── Chart Row ── */}
      <div className="dash-charts">
        <div className="dash-card">
          <div className="dash-card-hd">
            <h3 className="dash-card-title">Assets by Status</h3>
            <span className="dash-card-badge">{totalAssets}</span>
          </div>
          <AssetStatusPie data={aByStatus} total={totalAssets} />
        </div>
        <div className="dash-card">
          <div className="dash-card-hd">
            <h3 className="dash-card-title">Maintenance by Type</h3>
          </div>
          <MaintenanceTypeBar data={raw?.maintenance_by_type ?? []} />
        </div>
      </div>

      {/* ── Trend (full width) ── */}
      <div className="dash-card">
        <div className="dash-card-hd">
          <h3 className="dash-card-title">Activity Trend</h3>
        </div>
        <ActivityTrend data={raw?.activity_trend ?? []} />
      </div>
    </div>
  );
};

export default Dashboard;
