import type { FC } from "react";

export const LoadingPage: FC = () => {
  return (
    <div className="loading" role="status" aria-label="Loading">
      <div className="loader">
        <div className="loader-wheel" aria-hidden="true" />
        <div className="loader-text" aria-hidden="true" />
      </div>
    </div>
  );
};