import type { FC } from "react";

export const EmptyData: FC = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
      <i className="bi bi-inbox fs-1 mb-3 opacity-25"></i>
      <p className="mb-0 fw-light" style={{ fontSize: "0.95rem" }}>No data found</p>
    </div>
  );
};
