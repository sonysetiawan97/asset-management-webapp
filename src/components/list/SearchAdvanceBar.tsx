import { type FC, useState } from "react";
import { useFilter } from "@hooks/list/useFilter";
import { useDebounce } from "use-debounce";

export const SearchAdvanceBar: FC = () => {
  const { group, setGroup } = useFilter();
  const [localGroup, setLocalGroup] = useState(group);
  const [debouncedGroup] = useDebounce(localGroup, 500);

  // Sync debounced value to context
  if (debouncedGroup !== group) {
    setGroup(debouncedGroup);
  }

  const handleClear = () => {
    setLocalGroup("");
    setGroup("");
  };

  const hasValue = localGroup.length > 0;

  return (
    <div className="position-relative d-flex align-items-center">
      <div className="dropdown">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center gap-1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          data-bs-auto-close="outside"
        >
          <i className="bi bi-funnel"></i>
          <span>Filter</span>
          {hasValue && (
            <span className="badge bg-primary rounded-pill ms-1" style={{ fontSize: "0.65rem" }}>
              1
            </span>
          )}
        </button>

        <div className="dropdown-menu p-3" style={{ minWidth: "280px", zIndex: 1050 }}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="fw-semibold" style={{ fontSize: "0.8125rem" }}>Filter</span>
            {hasValue && (
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                style={{ fontSize: "0.75rem" }}
                onClick={handleClear}
              >
                Clear
              </button>
            )}
          </div>

          <div className="mb-0">
            <label htmlFor="filter-group" className="form-label" style={{ fontSize: "0.75rem", fontWeight: 500, color: "#6c757d", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Group
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              id="filter-group"
              placeholder="e.g. general, email, payment..."
              value={localGroup}
              onChange={(e) => setLocalGroup(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};