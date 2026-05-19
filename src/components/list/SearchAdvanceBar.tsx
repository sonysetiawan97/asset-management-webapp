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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16px"
            viewBox="0 -960 960 960"
            width="16px"
            fill="currentColor"
          >
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
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