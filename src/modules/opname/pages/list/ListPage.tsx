import { type FC } from "react";
import { Link } from "react-router-dom";
import { moduleName, type OpnameSession, OPNAME_STATUSES, STATUS_COLORS } from "../../types/Model";
import { useTranslation } from "react-i18next";
import { usePagination } from "@hooks/list/usePagination";
import { Pagination } from "@components/pagination/Pagination";
import { StatusBadge } from "@/components/misc/StatusBadge";

interface ListProps {
  data: OpnameSession[];
  count: number;
  isLoading: boolean;
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const List: FC<ListProps> = ({ data, count, isLoading, selectedStatus, onStatusChange }) => {
  const { skip, limit, setSkip } = usePagination();
  const { t } = useTranslation();

  const statusStats = OPNAME_STATUSES.map((s) => ({
    ...s,
    count: data.filter((x) => x.status === s.value).length,
  }));

  const getStatusColor = (status: string) => STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.draft;

  return (
    <div className="module-list-container">
      {/* Stat Bar */}
      <div className="module-stat-bar">
        <div className="row g-2 w-100">
          <div className="col">
            <div className="stat-chip stat-chip--all" onClick={() => onStatusChange(null)}>
              <span className="stat-chip__label">{t("filter_all", { defaultValue: "All" })}</span>
              <span className="stat-chip__count">{data.length}</span>
            </div>
          </div>
          {statusStats.map((s) => {
            const color = getStatusColor(s.value);
            return (
              <div className="col" key={s.value}>
                <div
                  className={`stat-chip ${selectedStatus === s.value ? "active" : ""}`}
                  onClick={() => onStatusChange(s.value)}
                  style={{ "--chip-bg": color.bg, "--chip-text": color.text, "--chip-dot": color.dot } as React.CSSProperties}
                >
                  <span className="stat-chip__label">{t(s.label)}</span>
                  <span className="stat-chip__count">{s.count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="module-table-container">
        <div className="d-flex justify-content-end mb-3">
          <Link to={`/${moduleName}/create`} className="btn btn-primary">
            <i className="bi bi-plus-lg me-1" />
            {t("modules.opname.list.btn_create")}
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>Progress</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <div className="spinner-border text-primary" role="status" />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    {t("modules.opname.list.empty")}
                  </td>
                </tr>
              ) : (
                data.map((session) => {
                  const color = getStatusColor(session.status);
                  const progress = session.total_items > 0
                    ? Math.round((session.counted_items / session.total_items) * 100)
                    : 0;
                  return (
                    <tr key={session.id}>
                      <td className="fw-semibold">{session.name}</td>
                      <td>{formatDate(session.start_date)}</td>
                      <td>
                        <StatusBadge
                          label={session.status.replace("_", " ")}
                          bgColor={color.bg}
                          textColor={color.text}
                          dotColor={color.dot}
                        />
                      </td>
                      <td style={{ minWidth: "140px" }}>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress flex-grow-1" style={{ height: "6px" }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: `${progress}%`, backgroundColor: color.dot }}
                              aria-valuenow={progress}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                          <small className="text-muted" style={{ minWidth: "40px" }}>
                            {session.counted_items}/{session.total_items}
                          </small>
                        </div>
                      </td>
                      <td className="text-center">
                        <Link to={`/${moduleName}/${session.id}`} className="btn btn-sm btn-outline-primary">
                          <i className="bi bi-eye" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination count={count} skip={skip} limit={limit} onChange={setSkip} />
      </div>
    </div>
  );
};

export default List;