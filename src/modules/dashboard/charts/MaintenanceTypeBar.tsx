import { type FC } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import ChartSkeleton from "./ChartSkeleton";
import { MAINTENANCE_COLORS, MAINTENANCE_LABELS } from "../chartTokens";

interface MaintenanceTypeItem {
  type: string;
  open: number;
  completed: number;
  total: number;
}

interface Props {
  data: MaintenanceTypeItem[];
  isLoading?: boolean;
  error?: string | null;
}

const MaintenanceTypeBar: FC<Props> = ({ data, isLoading, error }) => {
  if (error) {
    return (
      <div className="dash-card dash-card--error">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Maintenance by Type</h3>
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
          <h3 className="dash-card-title">Maintenance by Type</h3>
        </div>
        <ChartSkeleton variant="bar" rows={4} />
      </div>
    );
  }

  const chartData = data
    .filter((d) => d.total > 0)
    .map((d) => ({
      ...d,
      label: MAINTENANCE_LABELS[d.type] ?? d.type,
      fill: MAINTENANCE_COLORS[d.type] ?? "#6b7280",
    }));

  const maxVal = chartData.length > 0 ? Math.max(...chartData.map((d) => d.total), 1) : 1;

  if (chartData.length === 0) {
    return (
      <div className="dash-card">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Maintenance by Type</h3>
        </div>
        <div className="dash-card-empty-body">
          <i className="bi bi-tools dash-card-empty-icon" />
          <span className="dash-card-empty-msg">No maintenance logs yet</span>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={chartData.length * 38 + 16}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ left: 8, right: 32, top: 4, bottom: 4 }}
        barSize={22}
        barGap={0}
      >
        <XAxis type="number" hide domain={[0, maxVal]} />
        <YAxis
          type="category"
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          width={80}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            fontSize: 12,
            background: "#fff",
          }}
          formatter={(_: number, __: string, props: { payload: MaintenanceTypeItem }) => [
            `${props.payload.open} open · ${props.payload.completed} done`,
            props.payload.type,
          ]}
          cursor={{ fill: "transparent" }}
        />
        <Bar dataKey="open" stackId="a" radius={[0, 0, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
        <Bar dataKey="completed" stackId="a" radius={[0, 4, 4, 0]} fillOpacity={0.35}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MaintenanceTypeBar;
