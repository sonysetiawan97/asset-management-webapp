import { type FC } from "react";

export type TimeRangeValue = 7 | 30 | 90;

interface Props {
  value: TimeRangeValue;
  onChange: (v: TimeRangeValue) => void;
  lastUpdated: string | null;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const OPTIONS: { label: string; value: TimeRangeValue }[] = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

const TimeRangeFilter: FC<Props> = ({ value, onChange, lastUpdated, onRefresh, isRefreshing }) => {
  return (
    <div className="dash-filter-bar">
      <div className="dash-filter-group">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`dash-filter-btn${value === opt.value ? " dash-filter-btn--active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
        {lastUpdated && (
          <span className="dash-filter-updated">
            <i className="bi bi-clock-history" /> Updated {lastUpdated}
          </span>
        )}
      </div>
      <button
        type="button"
        className="dash-filter-refresh"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <i className={`bi bi-arrow-clockwise${isRefreshing ? " dash-spin" : ""}`} />
      </button>
    </div>
  );
};

export default TimeRangeFilter;
