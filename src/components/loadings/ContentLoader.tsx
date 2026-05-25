import type { FC } from "react";

/**
 * Inline skeleton loader for page content.
 * Use this instead of LoadingPage when data is loading inside a page.
 * This renders inside the content container — header and sidebar stay visible.
 */
export const ContentLoader: FC = () => {
  return (
    <div className="content-loader" role="status" aria-label="Loading content">
      {/* Header skeleton row */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="skeleton-title" />
        <div className="skeleton-button" />
      </div>

      {/* Table skeleton */}
      <div className="skeleton-table">
        <div className="skeleton-thead">
          <div className="skeleton-th" />
          <div className="skeleton-th" />
          <div className="skeleton-th" />
          <div className="skeleton-th" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-row">
            <span />
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
    </div>
  );
};