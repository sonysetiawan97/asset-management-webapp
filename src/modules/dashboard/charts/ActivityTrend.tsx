import { type FC } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
} from "recharts";
import ChartSkeleton from "./ChartSkeleton";

interface TrendItem {
  month: string;
  count: number;
}

interface Props {
  data: TrendItem[];
  isLoading?: boolean;
  error?: string | null;
}

const monthLabel = (m: string): string => {
  // "2026-06-04" (daily) vs "2026-06" (monthly)
  const iso = m.length === 7 ? m + "-01" : m;
  const d = new Date(iso);
  if (m.length === 7) {
    return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const ActivityTrend: FC<Props> = ({ data, isLoading, error }) => {
  if (error) {
    return (
      <div className="dash-card dash-card--error">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Monthly Activity Trend</h3>
        </div>
        <div className="dash-card-error-body">
          <i className="bi bi-exclamation-triangle dash-card-error-icon" />
          <span className="dash-card-error-msg">Failed to load</span>
          <button type="button" className="dash-card-error-retry" onClick={() => window.location.reload()}>
            <i className="bi bi-arrow-clockwise" /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="dash-card">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Monthly Activity Trend</h3>
        </div>
        <ChartSkeleton variant="line" />
      </div>
    );
  }

  if (data.length === 0) return null;

  const chartData = data.map((d) => ({ ...d, label: monthLabel(d.month) }));

  // Determine trend direction for gradient color
  const first = data[0]?.count ?? 0;
  const last = data[data.length - 1]?.count ?? 0;
  const trendColor = last > first ? "#10b981" : last < first ? "#ef4444" : "#f59e0b";

  const gradientId = "trendGradient";

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={chartData} margin={{ left: 0, right: 4, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={trendColor} stopOpacity={0.15} />
            <stop offset="100%" stopColor={trendColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f7" vertical={false} />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          interval="preserveStartEnd"
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          width={30}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            fontSize: 12,
            background: "#fff",
          }}
          formatter={(value) => [value, "Activities"]}
          labelFormatter={(label) => label}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke={trendColor}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: trendColor, stroke: "#fff", strokeWidth: 2 }}
        />
        <Brush
          dataKey="label"
          height={20}
          stroke="#e5e7eb"
          fill="#f7f8fc"
          travellerWidth={6}
          gap={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ActivityTrend;
