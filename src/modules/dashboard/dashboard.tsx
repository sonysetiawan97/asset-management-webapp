import { type FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "@/utils/apiAxios";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { enqueueSnackbar } from "notistack";

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
  assets_by_category: Array<{
    category_name: string;
    count: number;
    total_value: number;
  }>;
  recent_activities: Array<{
    id: number;
    action: string;
    description: string;
    user: string;
    created_time: string;
  }>;
  financial_summary: {
    total_purchase_value: number;
    total_book_value: number;
    total_accumulated_depreciation: number;
  };
}

const fmtIDR = (v?: number) =>
  v === undefined || !isFinite(v)
    ? "—"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(v);

const fmtNumber = (v?: number) =>
  v === undefined || !isFinite(v) ? "—" : v.toLocaleString("en-US");

const statusColors: Record<string, { bar: string; bg: string; label: string }> = {
  available: { bar: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Available" },
  in_use: { bar: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "In Use" },
  under_maintenance: { bar: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "Maintenance" },
  reserved: { bar: "#8b5cf6", bg: "rgba(139,92,246,0.12)", label: "Reserved" },
  lost: { bar: "#6b7280", bg: "rgba(107,114,128,0.12)", label: "Lost" },
  pending_transfer: { bar: "#06b6d4", bg: "rgba(6,182,212,0.12)", label: "Pending Transfer" },
};

/* ─── Count-up hook ─── */
function useCountUp(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (target <= 0) {
      setValue(target);
      return;
    }
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
  formatter?: (v: number) => string;
}

const StatCard: FC<StatCardProps> = ({ icon, label, value, accent, delay, formatter = fmtNumber }) => {
  const counted = useCountUp(value);

  return (
    <div
      className="dash-stat-card"
      style={
        {
          "--card-delay": `${delay}ms`,
          "--card-accent": accent,
        } as React.CSSProperties
      }
    >
      <div className="dash-stat-card__icon">
        <i className={icon} />
      </div>
      <div className="dash-stat-card__body">
        <span className="dash-stat-card__value">{formatter(counted)}</span>
        <span className="dash-stat-card__label">{label}</span>
      </div>
      <div className="dash-stat-card__bar" />
    </div>
  );
};

/* ─── Status Bar ─── */
interface StatusBarProps {
  data: Record<string, number>;
  total: number;
}

const StatusBars: FC<StatusBarProps> = ({ data, total }) => {
  const entries = Object.entries(statusColors)
    .filter(([key]) => (data[key] ?? 0) > 0)
    .map(([key, cfg]) => ({
      key,
      count: data[key] ?? 0,
      pct: total > 0 ? ((data[key] ?? 0) / total) * 100 : 0,
      ...cfg,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="dash-chart-bars">
      {entries.map((item, i) => (
        <div
          className="dash-chart-bar-row"
          key={item.key}
          style={{ "--bar-delay": `${200 + i * 60}ms` } as React.CSSProperties}
        >
          <span className="dash-chart-bar__label">{item.label}</span>
          <div className="dash-chart-bar__track">
            <div
              className="dash-chart-bar__fill"
              style={{
                width: `${item.pct}%`,
                backgroundColor: item.bar,
                boxShadow: `0 0 8px ${item.bar}66`,
              }}
            />
          </div>
          <span className="dash-chart-bar__value">
            {item.count}
            <small> ({Math.round(item.pct)}%)</small>
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─── Category Bars ─── */
const CategoryBars: FC<{ data: DashboardData["assets_by_category"] }> = ({ data }) => {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const top5 = data.slice(0, 5);

  return (
    <div className="dash-category-bars">
      {top5.map((cat, i) => (
        <div
          className="dash-category-row"
          key={cat.category_name}
          style={{ "--cat-delay": `${200 + i * 80}ms` } as React.CSSProperties}
        >
          <div className="dash-category-row__head">
            <span className="dash-category-row__name">{cat.category_name}</span>
            <span className="dash-category-row__count">{cat.count} items</span>
          </div>
          <div className="dash-category-row__track">
            <div
              className="dash-category-row__fill"
              style={{
                width: `${(cat.count / maxCount) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
      {data.length > 5 && (
        <div className="dash-category-more">
          +{data.length - 5} more categories
        </div>
      )}
    </div>
  );
};

/* ─── Timeline ─── */
const Timeline: FC<{ activities: DashboardData["recent_activities"] }> = ({ activities }) => {
  const t = useTranslation();

  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const actionIcon = (action: string): string => {
    const map: Record<string, string> = {
      CHECKED_OUT: "bi-send",
      CHECKED_IN: "bi-box-arrow-in-left",
      STATUS_CHANGED: "bi-arrow-left-right",
      TRANSFER_APPROVED: "bi-check-circle",
      CREATED: "bi-plus-circle",
      UPDATED: "bi-pencil",
    };
    return map[action] ?? "bi-record-circle";
  };

  if (activities.length === 0) {
    return <div className="dash-timeline-empty">No recent activity</div>;
  }

  return (
    <div className="dash-timeline">
      {activities.map((act, i) => (
        <div
          className="dash-timeline-item"
          key={act.id}
          style={{ "--tl-delay": `${200 + i * 80}ms` } as React.CSSProperties}
        >
          <div className="dash-timeline-dot">
            <i className={`bi ${actionIcon(act.action)}`} />
          </div>
          <div className="dash-timeline-content">
            <p className="dash-timeline-desc">{act.description}</p>
            <div className="dash-timeline-meta">
              <span className="dash-timeline-user">
                <i className="bi bi-person-circle" /> {act.user}
              </span>
              <span className="dash-timeline-time">{timeAgo(act.created_time)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Main Dashboard ─── */
const Dashboard: FC = () => {
  const { t } = useTranslation();

  const { data: raw, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await apiAxios.get<{
        status: boolean;
        data: DashboardData;
      }>("/dashboard");
      return res.data.data;
    },
    refetchInterval: 60_000,
  });

  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "Dashboard" }]);
  }, []);

  useEffect(() => {
    if (error) {
      enqueueSnackbar("Failed to load dashboard data", { variant: "error" });
    }
  }, [error]);

  if (isLoading) return <ContentLoader />;

  const stats = raw?.stats;
  const aByStatus = raw?.assets_by_status ?? {};
  const aByCat = raw?.assets_by_category ?? [];
  const activities = raw?.recent_activities ?? [];
  const finance = raw?.financial_summary;
  const totalAssets = stats?.total_assets ?? 0;
  const pending = stats?.pending_approvals;
  const totalPending = (pending?.transfers ?? 0) + (pending?.maintenance ?? 0);

  return (
    <div className="dash-root">
      {/* ─── KPI Stat Cards ─── */}
      <div className="dash-stats-grid">
        <StatCard icon="bi-box-seam" label="Total Assets" value={totalAssets} accent="#f59e0b" delay={50} />
        <StatCard icon="bi-person-check" label="In Use" value={aByStatus.in_use ?? 0} accent="#f59e0b" delay={120} />
        <StatCard icon="bi-check-circle" label="Available" value={aByStatus.available ?? 0} accent="#10b981" delay={190} />
        <StatCard icon="bi-tools" label="Maintenance" value={aByStatus.under_maintenance ?? 0} accent="#ef4444" delay={260} />
        <StatCard icon="bi-clock-history" label="Overdue" value={stats?.overdue_checkouts ?? 0} accent="#8b5cf6" delay={330} />
      </div>

      <div className="dash-grid">
        {/* ─── Left Column ─── */}
        <div className="dash-grid-main">
          {/* Asset Status */}
          <div className="dash-card dash-card--chart">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Asset Status Distribution</h3>
              <span className="dash-card-badge">{totalAssets} total</span>
            </div>
            <StatusBars data={aByStatus} total={totalAssets} />
          </div>

          {/* Recent Activity */}
          <div className="dash-card dash-card--timeline">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Recent Activity</h3>
            </div>
            <Timeline activities={activities} />
          </div>
        </div>

        {/* ─── Right Column ─── */}
        <div className="dash-grid-side">
          {/* Financial Summary */}
          <div className="dash-card dash-card--finance">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Financial Overview</h3>
            </div>
            <div className="dash-finance">
              <div className="dash-finance-row">
                <span className="dash-finance-label">Purchase Value</span>
                <span className="dash-finance-value dash-finance-value--amber">{fmtIDR(finance?.total_purchase_value)}</span>
              </div>
              <div className="dash-finance-row">
                <span className="dash-finance-label">Book Value</span>
                <span className="dash-finance-value dash-finance-value--green">{fmtIDR(finance?.total_book_value)}</span>
              </div>
              <div className="dash-finance-divider" />
              <div className="dash-finance-row">
                <span className="dash-finance-label">Depreciation</span>
                <span className="dash-finance-value dash-finance-value--muted">{fmtIDR(finance?.total_accumulated_depreciation)}</span>
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="dash-card dash-card--pending">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Pending Approvals</h3>
              {totalPending > 0 && <span className="dash-card-badge dash-card-badge--alert">{totalPending}</span>}
            </div>
            <div className="dash-pending">
              <div className="dash-pending-item">
                <div className="dash-pending-icon dash-pending-icon--transfer">
                  <i className="bi bi-arrow-left-right" />
                </div>
                <div className="dash-pending-body">
                  <span className="dash-pending-count">{pending?.transfers ?? 0}</span>
                  <span className="dash-pending-label">Transfer Requests</span>
                </div>
              </div>
              <div className="dash-pending-item">
                <div className="dash-pending-icon dash-pending-icon--maint">
                  <i className="bi bi-tools" />
                </div>
                <div className="dash-pending-body">
                  <span className="dash-pending-count">{pending?.maintenance ?? 0}</span>
                  <span className="dash-pending-label">Maintenance Open</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="dash-card dash-card--categories">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Top Categories</h3>
              <span className="dash-card-badge">{aByCat.length}</span>
            </div>
            <CategoryBars data={aByCat} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
