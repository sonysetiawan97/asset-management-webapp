import type { FC } from "react";
import { useStore } from "@nanostores/react";
import { $isPageLoading } from "@stores/LoadingStore";

export const LoadingInline: FC = () => {
  const isLoading = useStore($isPageLoading);
  if (!isLoading) return null;

  return (
    <div className="loading-inline" role="status" aria-label="Loading">
      <div className="loading-inline__spinner" aria-hidden="true" />
    </div>
  );
};