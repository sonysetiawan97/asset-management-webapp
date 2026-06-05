import { type FC, useMemo } from "react";

interface ActivityItem {
  id: number;
  action: string;
  description: string;
  user: string;
  created_time: string;
}

interface Props {
  data: ActivityItem[];
  isLoading?: boolean;
  error?: string | null;
}

const ACTION_ICONS: Record<string, string> = {
  created: "bi-plus-circle",
  updated: "bi-pencil",
  deleted: "bi-trash",
  checkout: "bi-box-arrow-right",
  checkin: "bi-box-arrow-in-left",
  transfer: "bi-arrow-left-right",
  maintenance: "bi-tools",
  disposed: "bi-trash3",
};

const ACTION_COLORS: Record<string, string> = {
  created: "#10b981",
  updated: "#f59e0b",
  checkout: "#3b82f6",
  checkin: "#10b981",
  transfer: "#8b5cf6",
  maintenance: "#ef4444",
  deleted: "#6b7280",
};

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const RecentActivity: FC<Props> = ({ data, isLoading, error }) => {
  const displayed = useMemo(() => data.slice(0, 7), [data]);

  if (error) {
    return (
      <div className="dash-card dash-card--error">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Recent Activity</h3>
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
          <h3 className="dash-card-title">Recent Activity</h3>
        </div>
        <div className="skel-texts">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skel-text" style={{ width: `${90 - i * 8}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="dash-card">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Recent Activity</h3>
        </div>
        <div className="dash-card-empty-body">
          <i className="bi bi-activity dash-card-empty-icon" />
          <span className="dash-card-empty-msg">No recent activity</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <h3 className="dash-card-title">Recent Activity</h3>
        <a href="/activity-logs" className="dash-card-header-link">
          View All <i className="bi bi-chevron-right" />
        </a>
      </div>
      <div className="dash-activity-feed">
        {displayed.map((item) => (
          <div key={item.id} className="dash-activity-row">
            <span
              className="dash-activity-icon"
              style={{ background: `${ACTION_COLORS[item.action] ?? "#6b7280"}15`, color: ACTION_COLORS[item.action] ?? "#6b7280" }}
            >
              <i className={`bi ${ACTION_ICONS[item.action] ?? "bi-record-circle"}`} />
            </span>
            <div className="dash-activity-body">
              <span className="dash-activity-text">
                <strong>{item.user}</strong> {item.description}
              </span>
              <span className="dash-activity-time">{timeAgo(item.created_time)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
