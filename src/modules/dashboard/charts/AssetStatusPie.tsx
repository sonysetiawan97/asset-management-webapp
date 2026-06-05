import { type FC } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import ChartSkeleton from "./ChartSkeleton";
import { STATUS_COLORS, STATUS_LABELS } from "../chartTokens";

interface Props {
  data: Record<string, number>;
  total: number;
  isLoading?: boolean;
  error?: string | null;
}

const AssetStatusPie: FC<Props> = ({ data, total, isLoading, error }) => {
  if (error) {
    return (
      <div className="dash-card dash-card--error">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Assets by Status</h3>
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
          <h3 className="dash-card-title">Assets by Status</h3>
        </div>
        <ChartSkeleton variant="donut" />
      </div>
    );
  }

  const chartData = Object.entries(STATUS_COLORS)
    .map(([key, color]) => ({
      name: STATUS_LABELS[key] ?? key,
      key,
      value: data[key] ?? 0,
      color,
    }))
    .filter((d) => d.value > 0);

  if (total === 0 || chartData.length === 0) {
    return (
      <div className="dash-card">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Assets by Status</h3>
        </div>
        <div className="dash-card-empty-body">
          <i className="bi bi-pie-chart dash-card-empty-icon" />
          <span className="dash-card-empty-msg">No assets registered yet</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-chart-ctr">
      <ResponsiveContainer width="100%" height={190}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              fontSize: 12,
              background: "#fff",
            }}
            formatter={(value, name) => {
              const v = Number(value) || 0;
              return [`${v} (${total > 0 ? Math.round((v / total) * 100) : 0}%)`, name];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="dash-chart-center">{total}</div>
      <div className="dash-legend">
        {chartData.map((entry) => (
          <span key={entry.name} className="dash-legend-itm">
            <span className="dash-legend-dot" style={{ background: entry.color }} />
            {entry.name}
            <span className="dash-legend-num">{entry.value}</span>
            <span className="dash-legend-pct">
              ({total > 0 ? Math.round((entry.value / total) * 100) : 0}%)
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default AssetStatusPie;
