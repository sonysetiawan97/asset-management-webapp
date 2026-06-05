import { type FC } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import ChartSkeleton from "./ChartSkeleton";
import { CHART_COLORS } from "../chartTokens";

interface CategoryItem {
  category_name: string;
  count: number;
}

interface Props {
  data: CategoryItem[];
  isLoading?: boolean;
  error?: string | null;
}

const CategoryBarChart: FC<Props> = ({ data, isLoading, error }) => {
  if (error) {
    return (
      <div className="dash-card dash-card--error">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Top Categories</h3>
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
          <h3 className="dash-card-title">Top Categories</h3>
        </div>
        <ChartSkeleton variant="bar" rows={5} />
      </div>
    );
  }

  const top5 = data.slice(0, 5);
  if (top5.length === 0) {
    return (
      <div className="dash-card">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Top Categories</h3>
        </div>
        <div className="dash-card-empty-body">
          <i className="bi bi-tags dash-card-empty-icon" />
          <span className="dash-card-empty-msg">No categories yet</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={top5.length * 44 + 20}>
        <BarChart
          data={top5}
          layout="vertical"
          margin={{ left: 8, right: 48, top: 4, bottom: 4 }}
          barSize={16}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="category_name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            width={100}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              fontSize: 12,
              background: "#fff",
            }}
            formatter={(value: number) => [`${value} items`, "Count"]}
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {top5.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {data.length > 5 && (
        <div className="dash-cat-more">+{data.length - 5} more categories</div>
      )}
    </>
  );
};

export default CategoryBarChart;
