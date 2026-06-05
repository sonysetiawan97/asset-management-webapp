import { type FC } from "react";
import ChartSkeleton from "./ChartSkeleton";

interface OpnameSummaryData {
  id: number;
  name: string;
  status: string;
  total_items: number;
  counted_items: number;
  start_date: string;
  end_date: string;
  match_count: number;
  mismatch_count: number;
  not_found_count: number;
  extra_count: number;
}

interface Props {
  data: OpnameSummaryData | null;
  isLoading?: boolean;
  error?: string | null;
}

const STATUS_LABELS: Record<string, string> = {
  in_progress: "In Progress",
  pending_approval: "Pending Approval",
};

const OpnameProgress: FC<Props> = ({ data, isLoading, error }) => {
  if (error) {
    return (
      <div className="dash-card dash-card--error">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Opname Progress</h3>
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
          <h3 className="dash-card-title">Opname Progress</h3>
        </div>
        <ChartSkeleton variant="ring" />
      </div>
    );
  }

  if (!data) {
    return <div className="dash-opname-empty" style={{ textAlign: "center", padding: "24px 0", fontSize: 12, color: "var(--color-text-muted)" }}>No active opname session</div>;
  }

  const pct =
    data.total_items > 0
      ? Math.round((data.counted_items / data.total_items) * 100)
      : 0;

  const now = Date.now();
  const end = data.end_date ? new Date(data.end_date).getTime() : null;
  const overdue = end && now > end;

  const discrepancyTotal =
    data.mismatch_count + data.not_found_count + data.extra_count;

  return (
    <div className="dash-opname-card">
      {/* Header */}
      <div className="dash-opname-hd">
        <div>
          <div className="dash-opname-name" title={`${data.start_date ? new Date(data.start_date).toLocaleDateString() : "—"} → ${data.end_date ? new Date(data.end_date).toLocaleDateString() : "—"}`}>
            {data.name}
          </div>
          <span className={`dash-opname-badge dash-opname-badge--${data.status}`}>
            {STATUS_LABELS[data.status] ?? data.status}
          </span>
        </div>
        {overdue && (
          <div className="dash-opname-overdue">
            <i className="bi bi-exclamation-triangle-fill" /> Overdue
          </div>
        )}
      </div>

      {/* Progress ring */}
      <div className="dash-opname-ring-wrap">
        <svg viewBox="0 0 120 120" className="dash-opname-ring">
          <circle
            cx="60" cy="60" r="52"
            fill="none" stroke="#f0f2f7" strokeWidth="10"
          />
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke={overdue ? "#ef4444" : "#f59e0b"}
            strokeWidth="10"
            strokeDasharray={`${pct * 3.267} 326.7`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dasharray 0.8s ease" }}
          />
          <text x="60" y="50" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1a1a2e" fontFamily="'Bricolage Grotesque', system-ui, sans-serif">
            {pct}%
          </text>
          <text x="60" y="68" textAnchor="middle" fontSize="10" fill="#9ca3af">
            {data.counted_items}/{data.total_items} items
          </text>
        </svg>
      </div>

      {/* Discrepancy pills */}
      {discrepancyTotal > 0 && (
        <div className="dash-opname-pills">
          {data.mismatch_count > 0 && (
            <span className="dash-opname-pill dash-opname-pill--mismatch">
              {data.mismatch_count} Mismatch
            </span>
          )}
          {data.not_found_count > 0 && (
            <span className="dash-opname-pill dash-opname-pill--not-found">
              {data.not_found_count} Not Found
            </span>
          )}
          {data.extra_count > 0 && (
            <span className="dash-opname-pill dash-opname-pill--extra">
              {data.extra_count} Extra
            </span>
          )}
        </div>
      )}

      {discrepancyTotal === 0 && data.counted_items > 0 && (
        <div className="dash-opname-clean">
          <i className="bi bi-check-circle-fill" /> All items match
        </div>
      )}

      {data.status === "in_progress" && (
        <div className="dash-opname-link">
          <a href={`/opname/${data.id}`}>
            Continue <i className="bi bi-arrow-right" />
          </a>
        </div>
      )}
    </div>
  );
};

export default OpnameProgress;
